# Enhanced Telegram Notification Features

This document describes all the Telegram notification features that have been added to the SMS Subscription Site.

## Current Features

### 1. ✅ User Registration Notifications
- **Trigger:** When a new user registers via `/api/register-main-app-user`
- **Content:** User email, name, and phone number
- **Format:** HTML with emojis

### 2. ✅ Payment Submission Notifications
- **Trigger:** When a user submits a payment request
- **Content:** User email, amount, transaction ID, payment ID
- **Special Feature:** Includes inline keyboard buttons for quick approve/reject actions
- **Buttons:**
  - ✅ Approve
  - ❌ Reject
  - 🔗 Open Admin Panel

### 3. ✅ Payment Approval Notifications
- **Trigger:** When an admin approves a payment
- **Content:** User email, amount, credits added, admin who approved

### 4. ✅ Payment Rejection Notifications
- **Trigger:** When an admin rejects a payment
- **Content:** User email, amount, transaction ID, admin who rejected

## Enhanced Functions Available

### `sendTelegramNotification(message, options)`
Basic notification function with enhanced options:
- **Parameters:**
  - `message` (string): HTML formatted message
  - `options` (object, optional):
    - `inlineKeyboard`: Array of button arrays for interactive buttons
    - `disablePreview`: Boolean to disable link previews

### `sendPaymentNotificationWithButtons(email, amount, txid, paymentId)`
Specialized function for payment notifications with action buttons:
- Creates a formatted payment notification
- Includes inline keyboard with approve/reject buttons
- Includes link to admin panel

### `sendDailySummary(stats)`
Sends a daily summary report (ready to use, needs to be called from a scheduled job):
- **Stats object should include:**
  - `newUsers`: Number of new users today
  - `newPayments`: Number of new payments today
  - `totalRevenue`: Total revenue today
  - `pendingPayments`: Number of pending payments
  - `totalUsers`: Total number of users
  - `totalCredits`: Total credits issued

## Future Enhancement Ideas

### 1. Inline Button Actions (Requires Webhook Setup)
- Set up Telegram webhook to handle button clicks
- Allow admins to approve/reject payments directly from Telegram
- Requires additional API endpoint to handle callback queries

### 2. Daily/Weekly Summary Reports
- Scheduled cron job or Vercel Cron to send daily summaries
- Weekly revenue reports
- Monthly user growth reports

### 3. Low Credit Alerts
- Notify when a user's credits are running low
- Alert when credits reach zero

### 4. Error Notifications
- System errors
- API failures
- Database connection issues

### 5. Admin Activity Logs
- Track admin actions
- Login notifications
- User management actions

### 6. Multiple Admin Support
- Support multiple chat IDs
- Role-based notifications
- Different notification levels

### 7. Rich Media Support
- Send charts/graphs for statistics
- Screenshots of admin panel
- QR codes for quick access

### 8. Command Support
- `/stats` - Get current statistics
- `/pending` - List pending payments
- `/users` - User count and recent registrations
- `/help` - List available commands

## Usage Examples

### Basic Notification
```javascript
import { sendTelegramNotification } from './lib/telegram.js';

await sendTelegramNotification(`
👤 <b>New User Registration!</b>
<b>Email:</b> user@example.com
`);
```

### Notification with Buttons
```javascript
import { sendTelegramNotification } from './lib/telegram.js';

const message = "Choose an action:";
const buttons = [
    [
        { text: "✅ Approve", callback_data: "approve_123" },
        { text: "❌ Reject", callback_data: "reject_123" }
    ]
];

await sendTelegramNotification(message, { inlineKeyboard: buttons });
```

### Payment Notification
```javascript
import { sendPaymentNotificationWithButtons } from './lib/telegram.js';

await sendPaymentNotificationWithButtons(
    "user@example.com",
    10.00,
    "tx_abc123",
    "payment_id_xyz"
);
```

### Daily Summary
```javascript
import { sendDailySummary } from './lib/telegram.js';

await sendDailySummary({
    newUsers: 5,
    newPayments: 3,
    totalRevenue: 50.00,
    pendingPayments: 2,
    totalUsers: 150,
    totalCredits: 500
});
```

## Configuration

All Telegram features use the same environment variables:
- `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather
- `TELEGRAM_ADMIN_CHAT_ID`: Your chat ID
- `ADMIN_PANEL_URL` (optional): URL for admin panel link in buttons

## Notes

- Inline buttons currently show in notifications but require webhook setup to be functional
- All notifications support HTML formatting
- Emojis are used for better visual distinction
- Notifications are sent asynchronously (won't block API responses)

