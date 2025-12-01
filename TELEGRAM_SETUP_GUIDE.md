# Telegram Notifications Setup Guide for Vercel

This guide will help you configure Telegram notifications for your Vercel serverless backend. Notifications are sent when:
- ✅ Users submit payment requests (subscriptions)
- ✅ Users register on the website

---

## Step 1: Create a Telegram Bot

1. **Open Telegram** and search for [@BotFather](https://t.me/botfather)
2. **Start a conversation** with BotFather
3. **Send the command**: `/newbot`
4. **Follow the prompts**:
   - Choose a name for your bot (e.g., "My App Admin Bot")
   - Choose a username (must end in `bot`, e.g., `myapp_admin_bot`)
5. **Copy the bot token** that BotFather gives you (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
   - ⚠️ **Keep this token secure!** Don't share it publicly.

---

## Step 2: Get Your Chat ID

1. **Start a conversation** with your new bot (search for the username you created)
2. **Send any message** to your bot (e.g., "Hello")
3. **Open this URL in your browser** (replace `YOUR_BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. **Look for the `chat` object** in the JSON response:
   ```json
   {
     "ok": true,
     "result": [
       {
         "message": {
           "chat": {
             "id": 123456789,  // <-- This is your Chat ID
             "first_name": "Your Name",
             "type": "private"
           }
         }
       }
     ]
   }
   ```
5. **Copy the `id` value** - this is your `TELEGRAM_ADMIN_CHAT_ID`

---

## Step 3: Add Environment Variables to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (the SMS subscription site project)
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New** button
5. Add the first variable:
   - **Name**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Your bot token from Step 1 (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
   - **Environment(s)**: Select **Production**, **Preview**, and **Development** (or just Production if you prefer)
   - Click **Save**
6. Add the second variable:
   - **Name**: `TELEGRAM_ADMIN_CHAT_ID`
   - **Value**: Your chat ID from Step 2 (e.g., `123456789`)
   - **Environment(s)**: Select **Production**, **Preview**, and **Development**
   - Click **Save**

### Method 2: Via Vercel CLI

```bash
# Navigate to your project directory
cd sms-subscription-site

# Add Telegram Bot Token
vercel env add TELEGRAM_BOT_TOKEN

# Add Admin Chat ID
vercel env add TELEGRAM_ADMIN_CHAT_ID

# Pull environment variables to verify
vercel env pull .env
```

---

## Step 4: Redeploy Your Project

**⚠️ Important**: Environment variables only take effect after redeployment!

### Via Vercel Dashboard:
1. Go to your project's **Deployments** tab
2. Click the **⋯** (three dots) menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Via Vercel CLI:
```bash
vercel --prod
```

---

## Step 5: Test the Notifications

### Test Payment Notification:
1. Go to your subscription website
2. Submit a test payment request
3. Check your Telegram - you should receive a notification like:
   ```
   💰 New Payment Request!
   
   User: user@example.com
   Amount: $10
   TXID: abc123xyz
   
   Check Admin Panel to approve.
   ```

### Test Registration Notification:
1. Register a new user on your website
2. Check your Telegram - you should receive a notification like:
   ```
   👤 New User Registration!
   
   Email: user@example.com
   Name: John Doe
   Phone: +1234567890
   ```

---

## Troubleshooting

### No notifications received?

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → **Logs**
   - Look for errors or warnings about Telegram
   - Check for: `"Telegram Bot Token or Admin Chat ID missing"`

2. **Verify Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure both variables are set correctly
   - Make sure they're enabled for the correct environment (Production/Preview)

3. **Test Bot Token Manually**:
   ```bash
   # Replace YOUR_BOT_TOKEN and YOUR_CHAT_ID
   curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id": YOUR_CHAT_ID, "text": "Test message"}'
   ```
   - If this works, your credentials are correct
   - If it fails, check your bot token and chat ID

4. **Check Bot Permissions**:
   - Make sure you've started a conversation with your bot
   - Send a message to your bot first
   - The bot needs to receive at least one message before it can send to you

5. **Redeploy After Changes**:
   - Environment variables require a redeploy to take effect
   - Make sure you've redeployed after adding the variables

---

## Notification Format

### Payment Notification:
```
💰 New Payment Request!

User: user@example.com
Amount: $10
TXID: abc123xyz

Check Admin Panel to approve.
```

### User Registration Notification:
```
👤 New User Registration!

Email: user@example.com
Name: John Doe
Phone: +1234567890
```

---

## Security Best Practices

1. **Never commit** your bot token or chat ID to Git
2. **Use different bots** for development and production if possible
3. **Rotate credentials** if they're ever exposed
4. **Limit bot access** - only share with trusted admins
5. **Monitor bot activity** - check Telegram for unexpected messages

---

## Quick Checklist

- [ ] Created Telegram bot via @BotFather
- [ ] Got bot token
- [ ] Got chat ID by messaging the bot
- [ ] Added `TELEGRAM_BOT_TOKEN` to Vercel environment variables
- [ ] Added `TELEGRAM_ADMIN_CHAT_ID` to Vercel environment variables
- [ ] Redeployed the project
- [ ] Tested payment notification
- [ ] Tested registration notification

---

## Need Help?

If you're still having issues:
1. Check Vercel function logs for error messages
2. Verify your bot token format (should be: `numbers:letters`)
3. Verify your chat ID is a number (not a string)
4. Make sure you've messaged your bot at least once
5. Try the manual curl test above to verify credentials

