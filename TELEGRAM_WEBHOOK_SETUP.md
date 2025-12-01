# Telegram Webhook Setup Guide

This guide will help you set up Telegram webhook commands to manage payments and users directly from Telegram.

## Features

✅ **Payment Management:**
- Approve/reject/delete payments via buttons or commands
- List pending payments with action buttons

✅ **User Management:**
- List all users
- Delete users via buttons or commands

✅ **Reports:**
- Current statistics (`/stats`)
- Monthly growth report (`/monthly`)

## Step 1: Set Up Webhook URL

After deploying to Vercel, you need to set your webhook URL in Telegram.

### Get Your Deployment URL

Your webhook URL will be:
```
https://YOUR_DEPLOYMENT_URL.vercel.app/api/telegram-webhook
```

Replace `YOUR_DEPLOYMENT_URL` with your actual Vercel deployment URL (e.g., `smssub-website.vercel.app`)

### Set Webhook via Browser

Open this URL in your browser (replace `YOUR_BOT_TOKEN` and `YOUR_WEBHOOK_URL`):

```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=YOUR_WEBHOOK_URL
```

**Example:**
```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://smssub-website.vercel.app/api/telegram-webhook
```

### Set Webhook via curl

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_DEPLOYMENT_URL.vercel.app/api/telegram-webhook"}'
```

### Verify Webhook

Check if webhook is set correctly:

```
https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo
```

You should see:
```json
{
  "ok": true,
  "result": {
    "url": "https://your-deployment.vercel.app/api/telegram-webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

## Step 2: Test Commands

Once the webhook is set up, send these commands to your bot:

### Payment Commands

- `/pending` - List all pending payments with action buttons
- `/approve <payment_id>` - Approve a payment by ID
- `/reject <payment_id>` - Reject a payment by ID
- `/delete_payment <payment_id>` - Delete a payment by ID

### User Commands

- `/users` - List all users (up to 50) with delete buttons
- `/delete_user <email>` - Delete a user by email

### Report Commands

- `/stats` - Show current system statistics
- `/monthly` - Show monthly growth report
- `/help` - Show all available commands

## Step 3: Using Buttons

### Payment Notifications

When a new payment is submitted, you'll receive a notification with buttons:
- ✅ **Approve** - Approves the payment and adds credits
- ❌ **Reject** - Rejects the payment
- 🔗 **Open Admin Panel** - Opens the admin panel in browser

### Pending Payments List

When you use `/pending`, you'll see:
- List of all pending payments
- Action buttons for each payment (Approve/Reject/Delete)

### Users List

When you use `/users`, you'll see:
- List of all users (up to 50)
- Delete button for each user

## Security

- Only the admin chat ID (set in `TELEGRAM_ADMIN_CHAT_ID`) can use commands
- Unauthorized users will receive an "Unauthorized access" message
- All actions are logged

## Troubleshooting

### Webhook not receiving updates?

1. **Check webhook URL:**
   ```bash
   curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
   ```

2. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for errors in the webhook endpoint

3. **Test webhook manually:**
   ```bash
   curl -X POST "https://YOUR_DEPLOYMENT_URL.vercel.app/api/telegram-webhook" \
     -H "Content-Type: application/json" \
     -d '{
       "message": {
         "chat": {"id": YOUR_CHAT_ID},
         "text": "/help"
       }
     }'
   ```

### Commands not working?

1. **Verify environment variables:**
   - `TELEGRAM_BOT_TOKEN` is set
   - `TELEGRAM_ADMIN_CHAT_ID` is set correctly

2. **Check chat ID:**
   - Make sure you're using the bot from the correct Telegram account
   - The chat ID must match `TELEGRAM_ADMIN_CHAT_ID`

3. **Redeploy after changes:**
   - If you updated environment variables, redeploy your Vercel project

### Buttons not working?

- Buttons require the webhook to be set up
- Make sure the webhook URL is correct
- Check Vercel logs for callback query errors

## Monthly Report Details

The `/monthly` command shows:
- New users this month vs last month (with growth %)
- Revenue this month vs last month (with growth %)
- Approved and pending payments
- Total credits issued
- Action required alerts

## Example Usage

### Approve a Payment
```
/pending
```
Then click the ✅ Approve button, or:
```
/approve payment_id_here
```

### Delete a User
```
/users
```
Then click the 🗑️ Delete button, or:
```
/delete_user user@example.com
```

### Get Monthly Report
```
/monthly
```

## Next Steps

1. Set up the webhook URL
2. Test with `/help` command
3. Try `/pending` to see pending payments
4. Use `/monthly` to see growth report
5. Test approve/reject buttons on payment notifications

---

**Note:** The webhook must be set up for buttons to work. Commands will work once the webhook is configured.

