# 🔧 Fix: Not Receiving Password Reset Emails

## Problem
You're seeing "Password reset link has been sent to your email!" but no email arrives.

## Root Cause
Your `.env` file has placeholder values instead of real Gmail credentials:
```env
EMAIL_USER=your-email@gmail.com          ← Not real
EMAIL_PASSWORD=your-app-password-here    ← Not real
```

---

## ✅ Solution: Configure Real Gmail Credentials

### Step 1: Get Gmail App Password (5 minutes)

#### A. Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Follow the setup process (you'll need your phone)
4. Complete the setup

#### B. Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You'll see "App passwords" section
3. Click **"Select app"** → Choose **"Mail"**
4. Click **"Select device"** → Choose **"Other (Custom name)"**
5. Type: **"BETCI Password Reset"**
6. Click **"Generate"**
7. You'll see a 16-character password like: `abcd efgh ijkl mnop`
8. **Copy this password** (you won't see it again!)

### Step 2: Update .env File

Open `backend/.env` and replace the placeholder values:

**Before:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

**After:**
```env
EMAIL_USER=ivanmaglagui@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:**
- Use your actual Gmail address
- Remove spaces from the App Password (Gmail shows it with spaces, but you need to remove them)
- Example: `abcd efgh ijkl mnop` becomes `abcdefghijklmnop`

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C or use kill script)
kill-port-5500.bat

# Start server
npm start
```

### Step 4: Look for Success Message

When server starts, you should see:
```
✓ Email service configured successfully
```

If you see an error instead:
```
✗ Email service configuration error: Invalid login
```
Then your credentials are wrong. Double-check them.

---

## 🧪 Test Email Sending

### Test 1: Using cURL

```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ivanmaglagui@gmail.com\"}"
```

**Expected:**
- Response: `{"message":"If an account exists with this email..."}`
- Email arrives in your inbox within 30 seconds

### Test 2: Using Your Frontend

1. Go to: http://localhost:5500/auth/forgot-password.html
2. Enter your email: `ivanmaglagui@gmail.com`
3. Click "Send Reset Link"
4. Check your email inbox

### Test 3: Using Test Script

```bash
node test-password-reset.js
```

This will test everything including email sending.

---

## 📧 Check Your Email

### Where to Look:

1. **Inbox** - Check main inbox first
2. **Spam/Junk** - Gmail might filter it here
3. **Promotions Tab** - If you have Gmail tabs enabled
4. **All Mail** - Search for "Password Reset"

### Email Details:

- **From:** BETCI Support <your-email@gmail.com>
- **Subject:** Password Reset Request - BETCI
- **Content:** Professional HTML email with reset button

---

## 🐛 Troubleshooting

### Issue 1: "Invalid login: Username and Password not accepted"

**Causes:**
- Wrong email address
- Wrong App Password
- Using regular password instead of App Password
- 2-Step Verification not enabled

**Solutions:**
1. Verify EMAIL_USER is your correct Gmail address
2. Verify EMAIL_PASSWORD is the 16-character App Password
3. Remove any spaces from the App Password
4. Generate a new App Password if needed

### Issue 2: Email still not arriving

**Check:**
1. Server logs show: `✓ Password reset email sent to: email@example.com`
2. Email is in spam/junk folder
3. Email address exists in database (Admin or Trainee account)
4. Gmail account is active and not suspended

### Issue 3: "2-Step Verification required"

**Solution:**
You must enable 2-Step Verification before you can create App Passwords.
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Then create App Password

### Issue 4: Can't find "App passwords" option

**Possible causes:**
- Using work/school Google account (not supported)
- 2-Step Verification not enabled
- Account security settings restricted

**Solution:**
- Use a personal Gmail account
- Enable 2-Step Verification first

---

## 📝 Example Configuration

Here's what your `.env` should look like with real values:

```env
PORT=5500
MONGODB_URI=mongodb://localhost:27017/BETCI
NODE_ENV=development

# Email Configuration for Password Reset
EMAIL_USER=ivanmaglagui@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
FRONTEND_URL=http://localhost:5500
```

**Note:** I updated FRONTEND_URL to `http://localhost:5500` since that's your actual server port.

---

## ✅ Verification Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] EMAIL_USER updated in .env with real Gmail
- [ ] EMAIL_PASSWORD updated in .env with App Password (no spaces)
- [ ] FRONTEND_URL set to http://localhost:5500
- [ ] Server restarted
- [ ] Server shows: "✓ Email service configured successfully"
- [ ] Test email sent
- [ ] Email received in inbox (or spam)

---

## 🎯 Quick Fix Summary

1. **Get App Password:** https://myaccount.google.com/apppasswords
2. **Update .env:**
   ```env
   EMAIL_USER=ivanmaglagui@gmail.com
   EMAIL_PASSWORD=your-16-char-password
   FRONTEND_URL=http://localhost:5500
   ```
3. **Restart server:** `npm start`
4. **Test:** Send password reset request
5. **Check email:** Look in inbox and spam

---

## 🔗 Helpful Links

- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Gmail Security:** https://myaccount.google.com/security
- **2-Step Verification:** https://support.google.com/accounts/answer/185839

---

## 💡 Pro Tips

1. **Use a dedicated email** for sending (like betci.support@gmail.com)
2. **Check spam folder** - First emails often go to spam
3. **Whitelist sender** - Add sender to contacts to avoid spam
4. **Test with your own email** first before testing with others
5. **Keep App Password secure** - Don't share it or commit to Git

---

## 🚨 Security Notes

- **Never use your regular Gmail password** - Always use App Password
- **Never commit .env to Git** - It's already in .gitignore
- **Regenerate App Password** if you think it's compromised
- **Use environment variables** in production (not .env file)

---

**After following these steps, emails should arrive within 30 seconds! 📧**
