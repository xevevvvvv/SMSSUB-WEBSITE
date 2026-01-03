/**
 * Admin Login API for Cloudflare Pages Functions
 * Dedicated endpoint for /api/admin-login
 */
import { initFirebase, getDb } from '../lib/firebase.js';
import { verifyPassword } from '../lib/password.js';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Content-Type': 'application/json'
};

// JSON response helper
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: corsHeaders
    });
}

// Handle OPTIONS preflight
export async function onRequestOptions() {
    return new Response(null, { status: 200, headers: corsHeaders });
}

// Handle POST requests
export async function onRequestPost(context) {
    const { request, env } = context;

    initFirebase(env);
    const db = getDb();

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return jsonResponse({ error: 'Email and password required' }, 400);
        }

        const doc = await db.collection('admins').doc(email).get();
        if (!doc.exists) {
            return jsonResponse({ error: 'Invalid credentials' }, 401);
        }

        const adminData = doc.data();
        if (adminData.active === false) {
            return jsonResponse({ error: 'Account inactive' }, 403);
        }

        const isValid = await verifyPassword(password, adminData.passwordHash);
        if (!isValid) {
            return jsonResponse({ error: 'Invalid credentials' }, 401);
        }

        await db.collection('admins').doc(email).update({
            lastLogin: new Date().toISOString()
        });

        return jsonResponse({
            success: true,
            admin: { email: adminData.email || email, role: adminData.role || 'admin' }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}

// Handle GET requests (return method not allowed)
export async function onRequestGet() {
    return jsonResponse({ error: 'Use POST method' }, 405);
}
