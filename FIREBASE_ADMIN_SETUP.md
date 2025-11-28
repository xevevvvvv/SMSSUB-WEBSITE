# Firebase Admin Setup - Step by Step

## Quick Setup Guide

Follow these steps to set up your first admin in Firebase:

### Step 1: Generate Password Hash

**Option A: Use Node.js (Recommended)**

Create a file `hash-password.js`:

```javascript
import crypto from 'crypto';

function hashPassword(password, salt = null) {
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex');
    }
    const hash = crypto
        .createHash('sha256')
        .update(password + salt)
        .digest('hex');
    return `${hash}:${salt}`;
}

const password = process.argv[2];
console.log('Hash:', hashPassword(password));
```

Run: `node hash-password.js "YourPassword123!"`

**Option B: Quick Test (Password: `admin123`)**

Use this hash for testing:
```
a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3:0123456789abcdef0123456789abcdef
```

### Step 2: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **Ticketmaster-SMS**
3. Click **Firestore Database** in left sidebar
4. Click **Data** tab (if not already selected)

### Step 3: Create Admins Collection

1. Click **+ Start collection** button (top left)
2. Collection ID: `admins` (exactly as shown)
3. Click **Next**

### Step 4: Add Your First Admin Document

1. **Document ID**: Enter your admin email (e.g., `admin@example.com`)
   - ⚠️ Must be the email address exactly
   - Case-sensitive
   
2. Click **Add field** and add these fields one by one:

   **Field 1:**
   - Field: `email`
   - Type: `string`
   - Value: `admin@example.com` (same as document ID)

   **Field 2:**
   - Field: `passwordHash`
   - Type: `string`
   - Value: Paste the hash from Step 1 (format: `hash:salt`)

   **Field 3:**
   - Field: `role`
   - Type: `string`
   - Value: `admin`

   **Field 4:**
   - Field: `active`
   - Type: `boolean`
   - Value: `true` (toggle to true)

   **Field 5:**
   - Field: `createdAt`
   - Type: `timestamp`
   - Value: Click to set current date/time

   **Field 6:**
   - Field: `createdBy`
   - Type: `string`
   - Value: `system`

3. Click **Save**

### Step 5: Verify Document Structure

Your document should look like this:

```
Document ID: admin@example.com

Fields:
  email: "admin@example.com"
  passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3:0123456789abcdef0123456789abcdef"
  role: "admin"
  active: true
  createdAt: [timestamp]
  createdBy: "system"
```

### Step 6: Test Login

1. Open `admin-login.html` in your browser
2. Enter:
   - Email: `admin@example.com`
   - Password: `admin123` (if using test hash) or your password
3. Click **Login**
4. Should redirect to `admin-panel.html`

## Visual Guide

```
Firebase Console
├── Firestore Database
    └── Data Tab
        └── (default)
            └── + Start collection
                └── Collection ID: "admins"
                    └── + Add document
                        └── Document ID: "admin@example.com"
                            ├── Field: email = "admin@example.com"
                            ├── Field: passwordHash = "[hash:salt]"
                            ├── Field: role = "admin"
                            ├── Field: active = true
                            ├── Field: createdAt = [timestamp]
                            └── Field: createdBy = "system"
```

## Common Mistakes

❌ **Wrong Document ID** - Must be email address exactly  
❌ **Missing passwordHash** - Required for login  
❌ **Wrong hash format** - Must be `hash:salt` (two parts with colon)  
❌ **active = false** - Admin won't be able to login  
❌ **Case mismatch** - Email must match exactly (case-sensitive)

## Next Steps

After setup:
1. ✅ Test login works
2. ✅ Change default password (if using test hash)
3. ✅ Add more admins as needed
4. ✅ Review `ADMIN_SETUP.md` for full documentation

---

**Need Help?** See `ADMIN_SETUP.md` for detailed troubleshooting and security best practices.

