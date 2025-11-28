# Testing Guide for SMS Subscription Site

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Vercel CLI** installed globally: `npm install -g vercel`
3. **Firebase Project** with Firestore enabled
4. **Environment Variables** configured

## Setup for Local Testing

### Step 1: Install Dependencies

```bash
cd sms-subscription-site
npm install
```

### Step 2: Create `.env` File

Create a `.env` file in the `sms-subscription-site/` directory with:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional (for Telegram notifications)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### Step 3: Run Local Development Server

```bash
# Using Vercel CLI (recommended for serverless functions)
vercel dev

# This will start the server on http://localhost:3000
# Or use the port Vercel assigns
```

**Alternative:** If you don't have Vercel CLI, you can use a simple HTTP server for static files, but API routes won't work:

```bash
# Python 3
python3 -m http.server 8000

# Or Node.js http-server
npx http-server -p 8000
```

## Testing Checklist

### 1. Pricing Display & Package Selection

**Test Steps:**
1. Open `index.html` in browser (or via local server)
2. Navigate to pricing section
3. Verify "$1 per SMS" is displayed clearly
4. Verify package prices show correct SMS counts:
   - Starter: $5 / 5 SMS
   - Pro: $20 / 20 SMS
   - Enterprise: $60 / 60 SMS

**Expected Results:**
- ✅ Pricing clearly states "$1 per SMS"
- ✅ Package descriptions match actual credits
- ✅ Clicking "Select Starter/Pro/Enterprise" redirects to login

**Test Package Selection:**
1. Click "Select Starter" on index page
2. Login with test email
3. Click "Add Credits" in dashboard
4. Verify payment modal shows:
   - Amount pre-filled to $5
   - Package info displayed: "Starter Package - $5 for 5 SMS"

### 2. Wallet Address Copy Function

**Test Steps:**
1. Login to dashboard
2. Click "Add Credits" to open payment modal
3. Click copy button next to ERC-20 address
4. Click copy button next to TRC-20 address
5. Paste in a text editor to verify

**Expected Results:**
- ✅ Copy button shows "Copied!" feedback
- ✅ Correct address is copied to clipboard
- ✅ Both ERC-20 and TRC-20 addresses work

### 3. Payment Submission

**Test Steps:**
1. Login to dashboard
2. Open payment modal
3. Enter amount: $10
4. Enter test TXID: `0x1234567890abcdef1234567890abcdef12345678`
5. Submit payment

**Expected Results:**
- ✅ Success message: "Payment submitted successfully!"
- ✅ Payment appears in admin panel as "pending"
- ✅ Payment appears in user's payment history
- ✅ Telegram notification sent (if configured)

**Test with Package Selection:**
1. Select "Pro" package from index page
2. Login and open payment modal
3. Verify amount is pre-filled to $20
4. Submit payment
5. Verify correct amount is saved

### 4. Payment History

**Test Steps:**
1. Login to dashboard
2. Scroll to "Payment History" section
3. Verify all payments are displayed
4. Check payment details:
   - Date
   - Amount
   - Credits (should match amount: $10 = 10 credits)
   - Status (pending/approved)
   - TXID (truncated)

**Expected Results:**
- ✅ All payments for user are shown
- ✅ Payments sorted by date (newest first)
- ✅ Status colors are correct (pending=yellow, approved=green)
- ✅ Credits calculation is correct ($1 = 1 credit)

### 5. Auto-Refresh

**Test Steps:**
1. Login to dashboard
2. Note current credit count
3. In another browser/incognito window, open admin panel
4. Approve a pending payment
5. Wait 30 seconds (or manually trigger refresh)
6. Check dashboard

**Expected Results:**
- ✅ Credits update automatically within 30 seconds
- ✅ Notification appears: "Payment approved! X SMS credits added"
- ✅ Payment history updates to show "approved" status
- ✅ No refresh needed manually

**Test Auto-Refresh Pause:**
1. Open payment modal
2. Wait 30+ seconds
3. Verify auto-refresh doesn't run while modal is open
4. Close modal
5. Verify auto-refresh resumes

### 6. Payment Confirmation Notifications

**Test Steps:**
1. Submit a payment
2. In admin panel, approve the payment
3. Refresh dashboard (or wait for auto-refresh)
4. Check for notification

**Expected Results:**
- ✅ Success notification appears: "Payment approved! X SMS credits added"
- ✅ Notification auto-dismisses after 5 seconds
- ✅ Can manually close notification with X button
- ✅ Notification doesn't duplicate on multiple refreshes

### 7. Admin Panel - Payment Approval

**Test Steps:**
1. Submit a test payment from user dashboard
2. Open admin panel
3. Verify payment appears in pending list
4. Click "Approve" button
5. Confirm approval dialog
6. Check user dashboard

**Expected Results:**
- ✅ Payment status changes to "approved"
- ✅ User credits increase by correct amount
- ✅ Payment disappears from pending list
- ✅ User receives notification

### 8. Credit Calculation ($1 = 1 SMS)

**Test Different Amounts:**
- $5 → Should add 5 credits
- $10 → Should add 10 credits
- $20 → Should add 20 credits
- $25.50 → Should add 25 credits (Math.floor)
- $0.99 → Should be rejected (minimum $5)

**Test Steps:**
1. Submit payments with different amounts
2. Approve them in admin panel
3. Check user credits in dashboard
4. Verify credits = Math.floor(amount)

**Expected Results:**
- ✅ $1 = 1 credit (strictly)
- ✅ Decimal amounts are floored (e.g., $25.99 = 25 credits)
- ✅ Minimum $5 enforced

## API Endpoint Testing

### Test API Endpoints Directly

You can test API endpoints using curl or Postman:

```bash
# Get user data
curl -X POST http://localhost:3000/api/get-user-data \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "test@example.com"}'

# Get user payments
curl -X POST http://localhost:3000/api/get-user-payments \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "test@example.com"}'

# Submit payment
curl -X POST http://localhost:3000/api/submit-payment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 10,
    "txid": "0x1234567890abcdef"
  }'

# Approve payment (from admin)
curl -X POST http://localhost:3000/api/approve-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "payment-id-from-firebase",
    "email": "test@example.com",
    "amount": 10
  }'
```

## Common Issues to Check

### 1. Firebase Connection
- ✅ Verify Firebase credentials in `.env`
- ✅ Check Firestore is enabled in Firebase Console
- ✅ Verify collections: `users`, `payments` exist

### 2. CORS Issues
- ✅ Check browser console for CORS errors
- ✅ Verify API endpoints have CORS headers
- ✅ Test from same origin (localhost)

### 3. Session Storage
- ✅ Check browser DevTools → Application → Session Storage
- ✅ Verify `userEmail` is stored after login
- ✅ Verify `selectedPackage` is stored/cleared correctly

### 4. Console Errors
- ✅ Open browser DevTools → Console
- ✅ Check for JavaScript errors
- ✅ Check for API call failures
- ✅ Verify network requests succeed (200 status)

### 5. Firebase Indexes
- ✅ If `get-user-payments` fails, create composite index:
  - Collection: `payments`
  - Fields: `email` (Ascending), `createdAt` (Descending)

## Firebase Console Testing

1. **Check Collections:**
   - Go to Firebase Console → Firestore
   - Verify `users` collection has test user
   - Verify `payments` collection has test payments

2. **Verify Data:**
   - Check user document has `smsCredits` field
   - Check payment document has correct `status`, `amount`, `txid`
   - Verify `approvedAt` timestamp when payment approved

3. **Test Queries:**
   - Try querying payments by email
   - Verify sorting by `createdAt` works

## End-to-End Test Scenario

**Complete User Journey:**

1. **User Registration:**
   - User registers in main app (account.html)
   - Email synced to Firebase via `/api/register-main-app-user`

2. **Package Selection:**
   - User visits subscription site index page
   - Clicks "Select Pro" package
   - Redirected to login

3. **Login:**
   - User logs in with registered email
   - Redirected to dashboard

4. **Payment:**
   - Dashboard shows payment modal with pre-filled $20
   - User copies wallet address
   - User enters TXID and submits payment
   - Payment appears as "pending" in history

5. **Admin Approval:**
   - Admin opens admin panel
   - Sees pending payment
   - Approves payment

6. **User Notification:**
   - User dashboard auto-refreshes
   - Credits update from 0 to 20
   - Notification appears: "Payment approved! 20 SMS credits added"
   - Payment history shows "approved" status

7. **Credit Usage:**
   - User can now use credits in main app
   - Credits deducted when SMS sent
   - Dashboard shows updated credit count

## Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Testing

1. **Auto-Refresh:**
   - Verify polling doesn't cause performance issues
   - Check network tab for API calls every 30s
   - Verify no memory leaks after extended use

2. **Payment History:**
   - Test with many payments (10+)
   - Verify pagination or scrolling works
   - Check rendering performance

## Security Testing

1. **Input Validation:**
   - Try submitting invalid email formats
   - Try negative amounts
   - Try very large amounts
   - Try SQL injection in TXID (should be sanitized)

2. **Authentication:**
   - Try accessing dashboard without login
   - Try accessing API endpoints without auth
   - Verify sessionStorage is cleared on logout

## Deployment Checklist

Before deploying to Vercel:

- [ ] All environment variables set in Vercel dashboard
- [ ] Firebase indexes created (if needed)
- [ ] CORS configured for production domain
- [ ] All features tested locally
- [ ] No console errors
- [ ] Payment flow works end-to-end
- [ ] Admin panel accessible
- [ ] Mobile responsive design tested

## Quick Test Script

Create a simple test HTML file to quickly test API endpoints:

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Tester</title>
</head>
<body>
    <h1>Subscription Site API Tester</h1>
    <button onclick="testGetUserData()">Test Get User Data</button>
    <button onclick="testGetPayments()">Test Get Payments</button>
    <button onclick="testSubmitPayment()">Test Submit Payment</button>
    <pre id="result"></pre>
    
    <script>
        const API_BASE = 'http://localhost:3000/api';
        const TEST_EMAIL = 'test@example.com';
        
        async function testGetUserData() {
            const res = await fetch(`${API_BASE}/get-user-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: TEST_EMAIL })
            });
            document.getElementById('result').textContent = JSON.stringify(await res.json(), null, 2);
        }
        
        async function testGetPayments() {
            const res = await fetch(`${API_BASE}/get-user-payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: TEST_EMAIL })
            });
            document.getElementById('result').textContent = JSON.stringify(await res.json(), null, 2);
        }
        
        async function testSubmitPayment() {
            const res = await fetch(`${API_BASE}/submit-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: TEST_EMAIL,
                    amount: 10,
                    txid: '0x' + Math.random().toString(16).substr(2, 40)
                })
            });
            document.getElementById('result').textContent = JSON.stringify(await res.json(), null, 2);
        }
    </script>
</body>
</html>
```

## Troubleshooting

### API Returns 404
- Check Vercel dev server is running
- Verify route matches `vercel.json` configuration
- Check file path is correct

### Firebase Errors
- Verify `.env` file exists and has correct values
- Check Firebase service account has Firestore permissions
- Verify Firestore is enabled in Firebase Console

### CORS Errors
- Check API endpoints have CORS headers
- Verify origin matches allowed origins
- Test from same origin first

### Session Storage Not Working
- Check browser allows sessionStorage
- Verify no private/incognito mode blocking
- Check browser console for errors

---

**Ready to Deploy?** Once all tests pass, you're ready to deploy to Vercel!

