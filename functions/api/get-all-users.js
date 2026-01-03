/**
 * Get All Users API - Direct endpoint for Cloudflare Pages
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

export async function onRequestGet(context) {
    const { env } = context;
    initFirebase(env);
    const db = getDb();

    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];

        usersSnapshot.forEach(doc => {
            users.push({ email: doc.id, ...doc.data() });
        });

        users.sort((a, b) => {
            const dateA = a.createdAt || a.updatedAt || '';
            const dateB = b.createdAt || b.updatedAt || '';
            return dateB.localeCompare(dateA);
        });

        return jsonResponse({ success: true, users, count: users.length });
    } catch (error) {
        console.error('Get all users error:', error);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}
