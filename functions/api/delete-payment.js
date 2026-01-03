/**
 * Delete Payment API - Direct endpoint for Cloudflare Pages
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
        const { paymentId } = body;

        if (!paymentId) {
            return jsonResponse({ error: 'Payment ID required' }, 400);
        }

        const paymentRef = db.collection('payments').doc(paymentId);
        const paymentDoc = await paymentRef.get();

        if (!paymentDoc.exists) {
            return jsonResponse({ error: 'Payment not found' }, 404);
        }

        await paymentRef.delete();
        return jsonResponse({ success: true, message: 'Payment deleted' });
    } catch (error) {
        console.error('Delete payment error:', error);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}
