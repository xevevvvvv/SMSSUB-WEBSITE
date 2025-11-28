# Admin Panel Setup Guide

## Overview

The admin panel uses **password-based authentication** with Firebase Firestore. Admins must:
1. Have an account in the `admins` collection with a **hashed password**
2. Login through `admin-login.html` with email and password
3. **No dependency on the `users` collection** (standalone system)

## Initial Setup

### Step 1: Create Admins Collection in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **Start collection** (if Firestore is new) or **Add collection**
5. Collection ID: `admins`
6. Click **Next**

### Step 2: Generate Password Hash

You need to hash the password before storing it in Firebase. Use one of these methods:

#### Method A: Using Node.js Script (Recommended)

Create a temporary file `hash-password.js`:

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
if (!password) {
    console.error('Usage: node hash-password.js <password>');
    process.exit(1);
}

console.log('Password Hash:', hashPassword(password));
```

Run: `node hash-password.js "YourPassword123!"`

#### Method B: Using Online Tool (Less Secure)

Use a SHA-256 hash generator, but you'll need to add salt manually.

#### Method C: Quick Test Hash

For testing, you can use this pre-generated hash (password: `admin123`):
```
a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3:0123456789abcdef0123456789abcdef
```

**⚠️ Important:** Change this password immediately in production!

### Step 3: Add Your First Admin to Firebase

1. In the `admins` collection, click **Add document**
2. **Document ID**: Use the admin's email address (e.g., `admin@example.com`)
   - **Important**: The document ID must be the email address (case-sensitive)
3. Add the following fields:

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `email` | string | `admin@example.com` | Admin email address |
| `passwordHash` | string | `[hash from Step 2]` | **Hashed password** (format: `hash:salt`) |
| `role` | string | `admin` | Admin role (can be `admin` or `super_admin`) |
| `active` | boolean | `true` | Whether admin is active |
| `createdAt` | timestamp | Current date/time | When admin was added |
| `createdBy` | string | `system` | Who created this admin |

**Example Document:**
```
Document ID: admin@example.com
Fields:
  email: "admin@example.com"
  passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3:0123456789abcdef0123456789abcdef"
  role: "admin"
  active: true
  createdAt: [Current timestamp]
  createdBy: "system"
```

### Step 4: Test Admin Login

1. Navigate to `admin-login.html` in your browser
2. Enter the admin email and password
3. Click "Login"
4. You should be redirected to `admin-panel.html`

**✅ Success!** You now have admin access.

## Managing Admins

### Adding a New Admin

1. **Generate password hash** (use Method A from Step 2)
2. Go to Firebase Console → Firestore → `admins` collection
3. Click **Add document**
4. Document ID: Use the new admin's email
5. Add all required fields including `passwordHash`
6. Set `active: true`

### Changing an Admin Password

1. Generate new password hash
2. Open the admin document in Firebase
3. Update the `passwordHash` field with the new hash
4. Admin must use new password on next login

### Removing an Admin

**Option 1: Deactivate (Recommended)**
- Open the admin document in Firebase
- Set `active: false`
- Admin will lose access immediately

**Option 2: Delete**
- Delete the document from Firebase
- Admin will lose access immediately

### Changing Admin Role

- Open the admin document in Firebase
- Update the `role` field
- Currently roles are: `admin` or `super_admin`
- (Future: Different roles may have different permissions)

## Security Best Practices

### 1. Strong Passwords
- Use passwords with at least 12 characters
- Include uppercase, lowercase, numbers, and symbols
- Don't reuse passwords from other services
- Change passwords periodically

### 2. Limit Admin Access
- Only add trusted individuals as admins
- Regularly review the admin list
- Remove admins who no longer need access
- Use dedicated admin email addresses

### 3. Monitor Access
- Check Firebase logs for login attempts
- Review `lastLogin` timestamps in admin documents
- Watch for suspicious activity
- Review payment approvals regularly

### 4. Password Security
- Never store passwords in plain text
- Always use hashed passwords in Firebase
- Don't share passwords via email or chat
- Use password managers for admin accounts

### 5. Environment Security
- Never commit Firebase credentials to git
- Use environment variables for Firebase config
- Rotate Firebase service account keys periodically
- Keep admin panel URL private

## Troubleshooting

### "Invalid email or password" Error

**Check:**
1. ✅ Email exists in `admins` collection
2. ✅ Document ID matches email exactly (case-sensitive)
3. ✅ `passwordHash` field exists and is in correct format (`hash:salt`)
4. ✅ Password was hashed correctly
5. ✅ `active` field is `true`

**Solution:**
- Verify email and password are correct
- Regenerate password hash if needed
- Check browser console for errors
- Verify admin document in Firebase Console

### Admin Cannot Access Panel

**Check:**
1. ✅ Successfully logged in through `admin-login.html`
2. ✅ `adminEmail` exists in sessionStorage
3. ✅ `isAdmin` is set to `true` in sessionStorage
4. ✅ Not redirected to login page

**Solution:**
- Clear browser cache and sessionStorage
- Try logging out and back in
- Check browser console for errors
- Verify admin document in Firebase

### API Returns 403 Forbidden

**Possible Causes:**
- Admin check failed
- Email not in `admins` collection
- `adminEmail` not sent in API request
- Session expired

**Solution:**
- Verify admin email in Firebase
- Check API request includes `adminEmail`
- Re-login to refresh session
- Review server logs for details

### Password Hash Not Working

**Check:**
1. ✅ Hash format is correct: `hash:salt` (two parts separated by colon)
2. ✅ Hash is SHA-256
3. ✅ Salt is 32 hex characters
4. ✅ No extra spaces or characters

**Solution:**
- Regenerate password hash using the script
- Verify hash format in Firebase
- Test with a known working hash first

## Firebase Collection Structure

```
admins/
  ├── admin@example.com/
  │   ├── email: "admin@example.com"
  │   ├── passwordHash: "hash:salt"
  │   ├── role: "admin"
  │   ├── active: true
  │   ├── createdAt: [timestamp]
  │   ├── createdBy: "system"
  │   └── lastLogin: [timestamp] (auto-updated)
  │
  └── superadmin@example.com/
      ├── email: "superadmin@example.com"
      ├── passwordHash: "hash:salt"
      ├── role: "super_admin"
      ├── active: true
      ├── createdAt: [timestamp]
      ├── createdBy: "admin@example.com"
      └── lastLogin: [timestamp]
```

## API Endpoints

### Admin Login
```
POST /api/admin-login
Body: { 
  "email": "admin@example.com",
  "password": "plain-text-password"
}
Response: { 
  "success": true, 
  "admin": { "email": "...", "role": "admin" }
}
```

### Check Admin Status
```
POST /api/check-admin
Body: { "userEmail": "admin@example.com" }
Response: { "success": true, "isAdmin": true }
```

### Protected Admin Endpoints
- `POST /api/approve-payment` - Requires `adminEmail` in body
- `POST /api/get-pending-payments` - Requires `adminEmail` in body

## Quick Reference

**Add Admin:**
1. Generate password hash
2. Firebase Console → Firestore → `admins` collection
3. Add document with email as ID
4. Add `passwordHash` field with generated hash
5. Set `active: true`

**Change Password:**
1. Generate new password hash
2. Update `passwordHash` field in Firebase
3. Admin uses new password on next login

**Test Admin Access:**
1. Go to `admin-login.html`
2. Enter email and password
3. Should redirect to `admin-panel.html`

## Password Hash Generator Script

Save this as `hash-password.js` in your project root:

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
if (!password) {
    console.error('Usage: node hash-password.js <password>');
    process.exit(1);
}

console.log('\nPassword Hash:');
console.log(hashPassword(password));
console.log('\nCopy this hash to Firebase passwordHash field\n');
```

Run: `node hash-password.js "YourSecurePassword123!"`

## Support

If you encounter issues:
1. Check Firebase Console for admin documents
2. Verify `passwordHash` format is correct
3. Review browser console for errors
4. Check server logs for API errors
5. Verify email matches exactly (case-sensitive)

---

**Security Note:** 
- Never share admin panel URLs publicly
- Never store passwords in plain text
- Always use hashed passwords in Firebase
- Change default passwords immediately
- The admin panel should only be accessible to authorized personnel
