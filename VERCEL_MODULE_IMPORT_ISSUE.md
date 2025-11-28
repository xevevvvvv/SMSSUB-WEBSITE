# Vercel Serverless Function Module Import Issue

## Problem Summary
Serverless functions on Vercel cannot import shared library modules. Functions fail at runtime with `ERR_MODULE_NOT_FOUND` errors, even though the files exist and imports work locally.

## Project Structure
```
sms-subscription-site/
├── api/                    # Serverless functions (10 files)
│   ├── admin-login.js
│   ├── validate-user.js
│   └── ... (8 more API files)
├── lib/                    # Shared library modules
│   ├── firebase.js         # Exports: { db }
│   ├── password.js         # Exports: { hashPassword, verifyPassword, generatePassword }
│   └── telegram.js         # Exports: { sendTelegramNotification }
└── package.json            # "type": "module" (ES modules)
```

## Current Configuration

### package.json
```json
{
  "type": "module",
  "scripts": {
    "vercel-build": "mkdir -p api/lib && cp -r lib/* api/lib/"
  }
}
```

### vercel.json
```json
{
  "version": 2,
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    ...
  ]
}
```

### API File Import Pattern
All API files use:
```javascript
import { db } from './lib/firebase';
import { verifyPassword } from './lib/password';
import { sendTelegramNotification } from './lib/telegram';
```

## Error Details

### Runtime Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/lib/firebase' 
imported from /var/task/api/admin-login.js
```

**Key Observations:**
- Error shows it's looking for `/var/task/lib/firebase` (one level up from api/)
- But with `./lib/firebase` import, it should look for `/var/task/api/lib/firebase`
- This suggests path resolution is going up one level incorrectly

### Deployment Environment
- **Platform:** Vercel (Hobby plan - 12 function limit)
- **Runtime:** Node.js (ES modules - `"type": "module"`)
- **Function Location:** `/var/task/api/*.js` at runtime
- **Deployment URL:** `smssub-website.vercel.app`

## Attempted Solutions (All Failed)

### 1. Build Script Only
**Approach:** Copy lib files to `api/lib/` during build
```json
"vercel-build": "mkdir -p api/lib && cp -r lib/* api/lib/"
```
**Result:** Build script runs, but files not accessible at runtime. Error: `Cannot find module '/var/task/lib/firebase'`

### 2. includeFiles Configuration
**Approach:** Use Vercel's `includeFiles` to bundle lib files
```json
{
  "functions": {
    "api/**/*.js": {
      "includeFiles": "lib/**"
    }
  }
}
```
**Result:** Files still not found. Same error persists.

### 3. Build Script + includeFiles
**Approach:** Combined both approaches
- Build script copies `lib/*` → `api/lib/`
- `includeFiles: "api/lib/**"` to include copied files
**Result:** Still fails with same error.

### 4. Different Import Paths Tried
- `./lib/firebase` → Looks for `/var/task/lib/firebase` (wrong - goes up one level)
- `../lib/firebase` → Looks for `/var/lib/firebase` (wrong - goes up two levels)
- `../../lib/firebase` → Also tried, same issue

### 5. Moving Lib Files into api/lib/ Permanently
**Approach:** Move lib files directly into `api/lib/` directory
**Result:** Vercel counted them as separate functions (13 total, exceeded 12 limit)

## Key Questions

1. **Path Resolution:** Why does `./lib/firebase` from `/var/task/api/admin-login.js` resolve to `/var/task/lib/firebase` instead of `/var/task/api/lib/firebase`?

2. **Build Script Timing:** Does Vercel package functions before or after the `vercel-build` script runs? Are copied files included in the function package?

3. **includeFiles Behavior:** How exactly does `includeFiles` work? Where are the included files placed in the function's file system at runtime?

4. **ES Modules on Vercel:** Are there special requirements for ES module imports in Vercel serverless functions? Do we need explicit `.js` extensions?

5. **Alternative Approaches:** 
   - Should we use a different file structure?
   - Should we bundle the lib files differently?
   - Is there a Vercel-specific way to handle shared modules?

## Constraints
- Must stay under 12 serverless functions (Vercel Hobby limit)
- Lib files cannot be counted as separate functions
- Need to share code across 10 API endpoints
- Using ES modules (`"type": "module"`)

## Additional Context
- **Framework:** No framework - plain Node.js serverless functions
- **Module System:** ES modules (not CommonJS)
- **Deployment:** Vercel serverless functions
- **Local Development:** Works fine locally
- **Issue:** Only occurs in Vercel production environment

## What We Need
A working solution that:
1. Allows API functions to import from shared lib modules
2. Doesn't count lib files as separate functions
3. Works reliably in Vercel's serverless environment
4. Maintains clean code organization

