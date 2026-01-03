/**
 * Delete User API - Direct endpoint for Cloudflare Pages
 */
import { initFirebase, getDb } from '../lib/firebase.js';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Content-Type': 'application/json'
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

export async function onRequestOptions() {
    return new Response(null, { status: 200, headers: corsHeaders });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    initFirebase(env);
    const db = getDb();

    try {
        const body = await request.json();
        const { userEmail } = body;

        if (!userEmail) {
            return jsonResponse({ error: 'Email is required' }, 400);
        }

        const userRef = db.collection('users').doc(userEmail);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return jsonResponse({ error: 'User not found' }, 404);
        }

        await userRef.delete();
        return jsonResponse({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}
