/**
 * Approve Payment API - Direct endpoint for Cloudflare Pages
 */
import { initFirebase, getDb } from '../lib/firebase.js';
import { sendTelegramNotification } from '../lib/telegram.js';

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
        const { paymentId, adminEmail } = body;

        if (!paymentId) {
            return jsonResponse({ error: 'Payment ID required' }, 400);
        }

        const paymentRef = db.collection('payments').doc(paymentId);
        const paymentDoc = await paymentRef.get();

        if (!paymentDoc.exists) {
            return jsonResponse({ error: 'Payment not found' }, 404);
        }

        const paymentData = paymentDoc.data();
        if (paymentData.status === 'approved') {
            return jsonResponse({ error: 'Already approved' }, 400);
        }

        const userEmail = paymentData.email;
        const creditsToAdd = Math.floor(paymentData.amount);

        await paymentRef.update({
            status: 'approved',
            approvedBy: adminEmail || 'admin',
            approvedAt: new Date().toISOString()
        });

        const userRef = db.collection('users').doc(userEmail);
        const userDoc = await userRef.get();
        const currentCredits = userDoc.exists ? (userDoc.data().smsCredits || 0) : 0;

        await userRef.set({
            smsCredits: currentCredits + creditsToAdd,
            lastPaymentDate: new Date().toISOString(),
            subscriptionStatus: 'active'
        }, { merge: true });

        sendTelegramNotification(`✅ Payment Approved!\n\nUser: ${userEmail}\nAmount: $${paymentData.amount}\nCredits Added: ${creditsToAdd}`, env).catch(console.error);

        return jsonResponse({ success: true, message: 'Payment approved and credits added' });
    } catch (error) {
        console.error('Approve payment error:', error);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}
