# ✅ Fix Email Configuration

## Current Status

✅ **bcrypt installed** - Password hashing working  
✅ **nodemailer installed** - Email service ready  
✅ **Server running** - All routes registered  
⚠️ **Email not configured** - Need Gmail credentials  

---

## Quick Fix (3 Steps)

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. If you see "App passwords", click it
4. If not, you need to enable **2-Step Verification** first:
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process
   - Then return to App passwords

5. In App passwords:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter: **BETCI**
   - Click **Generate**

6. Copy the 16-character password (shown like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and update these lines:

```env
# Replace with your actual Gmail address
EMAIL_USER=your-email@gmail.com

# Replace with the 16-character App Password (no spaces)
EMAIL_PASSWORD=abcdefghijklmnop

# This is correct, leave as is
FRONTEND_URL=http://localhost:3000
```

**Example:**
```env
EMAIL_USER=betci.support@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
FRONTEND_URL=http://localhost:3000
```

### Step 3: Restart Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

**Look for:**
```
✓ Email service configured successfully
```

---

## Test the System

Once email is configured, test it:

```bash
# In a new terminal (keep server running)
node test-password-reset.js
```

Or test with cURL:

```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@betci.edu.ph\"}"
```

---

## Troubleshooting

### "Invalid login: Username and Password not accepted"

**Cause:** Wrong email or password in .env

**Solutions:**
1. Double-check EMAIL_USER is correct Gmail address
2. Make sure EMAIL_PASSWORD is the App Password (not regular password)
3. Remove any spaces from the App Password
4. Generate a new App Password if needed

### "2-Step Verification required"

**Cause:** Gmail requires 2-Step Verification for App Passwords

**Solution:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Then generate App Password

### "App passwords not available"

**Cause:** Using a work/school account or 2-Step not enabled

**Solution:**
1. Use a personal Gmail account
2. Enable 2-Step Verification first

---

## Alternative: Skip Email for Now

If you want to test the system without email:

1. Comment out the email verification in `server.js`:

```javascript
// Verify email configuration on startup
// const { verifyEmailConfig } = require('./utils/emailService');
// verifyEmailConfig();
```

2. The password reset will still work, but emails won't be sent

3. You can manually test with tokens from the database

---

## Current .env File

Your current `.env` should look like this:

```env
PORT=5500
MONGODB_URI=mongodb://localhost:27017/BETCI
NODE_ENV=development

# Email Configuration for Password Reset
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
FRONTEND_URL=http://localhost:3000
```

**Update the EMAIL_USER and EMAIL_PASSWORD lines!**

---

## Next Steps

1. ✅ Packages installed (bcrypt, nodemailer)
2. ⚠️ Configure Gmail credentials in .env
3. 🔄 Restart server
4. ✅ Test password reset system

---

**Need Help?**

Check the full documentation:
- `PASSWORD_RESET_COMPLETE.md` - Overview
- `SETUP_PASSWORD_RESET.md` - Setup guide
- `PASSWORD_RESET_SYSTEM.md` - Complete reference
