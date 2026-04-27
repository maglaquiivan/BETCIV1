# 📧 How to Get Gmail App Password (Visual Guide)

## Why You Need This

Gmail doesn't allow apps to use your regular password for security reasons. You need to create a special "App Password" specifically for the BETCI password reset system.

---

## Step-by-Step Instructions

### Step 1: Enable 2-Step Verification

```
1. Go to: https://myaccount.google.com/security

2. Look for "2-Step Verification"
   
   ┌─────────────────────────────────────┐
   │  2-Step Verification                │
   │  Off  ← Click here to enable        │
   └─────────────────────────────────────┘

3. Click "Get Started"

4. Follow the prompts:
   - Enter your phone number
   - Receive verification code
   - Enter code
   - Turn on 2-Step Verification
```

### Step 2: Generate App Password

```
1. Go to: https://myaccount.google.com/apppasswords

2. You'll see this screen:
   
   ┌─────────────────────────────────────┐
   │  App passwords                      │
   │                                     │
   │  Select app:  [Mail ▼]             │
   │  Select device: [Other ▼]          │
   │                                     │
   │  [Generate]                         │
   └─────────────────────────────────────┘

3. Select app: Choose "Mail"

4. Select device: Choose "Other (Custom name)"

5. Type: "BETCI Password Reset"

6. Click "Generate"

7. You'll see a 16-character password:
   
   ┌─────────────────────────────────────┐
   │  Your app password for BETCI        │
   │                                     │
   │  abcd efgh ijkl mnop               │
   │                                     │
   │  [Done]                             │
   └─────────────────────────────────────┘

8. COPY THIS PASSWORD!
   - You won't see it again
   - Remove the spaces: abcdefghijklmnop
```

---

## Step 3: Update .env File

Open `backend/.env` in your code editor:

**Find these lines:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

**Replace with your actual values:**
```env
EMAIL_USER=ivanmaglagui@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:**
- Use your real Gmail address
- Remove spaces from the password
- Don't use quotes around the values

---

## Step 4: Restart Server

```bash
# Stop the server (Ctrl+C)

# Start it again
npm start
```

**Look for this message:**
```
✓ Email service configured successfully
```

**If you see this instead:**
```
✗ Email service configuration error: Invalid login
```
Then your credentials are wrong. Double-check them!

---

## Step 5: Test It

### Option 1: Use Your Frontend

1. Go to: http://localhost:5500/auth/forgot-password.html
2. Enter your email
3. Click "Send Reset Link"
4. Check your email inbox

### Option 2: Use cURL

```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ivanmaglagui@gmail.com\"}"
```

### Option 3: Use Test Script

```bash
node test-password-reset.js
```

---

## 📧 Check Your Email

**Where to look:**
1. ✉️ Inbox (main)
2. 🗑️ Spam/Junk folder
3. 📁 Promotions tab (if using Gmail tabs)
4. 🔍 Search for "Password Reset"

**Email will look like:**
```
From: BETCI Support <your-email@gmail.com>
Subject: Password Reset Request - BETCI

┌─────────────────────────────────────┐
│  Password Reset Request             │
├─────────────────────────────────────┤
│  Hello User,                        │
│                                     │
│  We received a request to reset    │
│  your password...                   │
│                                     │
│  ┌───────────────────┐             │
│  │  Reset Password   │             │
│  └───────────────────┘             │
│                                     │
│  ⚠️ Expires in 15 minutes          │
└─────────────────────────────────────┘
```

---

## 🐛 Common Issues

### "Can't find App passwords option"

**Cause:** 2-Step Verification not enabled

**Fix:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification first
3. Then try App passwords again

### "Invalid login" error

**Causes:**
- Wrong email address
- Wrong App Password
- Spaces in the password
- Using regular password instead of App Password

**Fix:**
1. Double-check EMAIL_USER is correct
2. Double-check EMAIL_PASSWORD has no spaces
3. Generate a new App Password
4. Update .env and restart server

### Email not arriving

**Check:**
1. Server logs show: `✓ Password reset email sent`
2. Email is in spam folder
3. Email address exists in database
4. Gmail account is active

---

## ✅ Quick Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] Copied password (removed spaces)
- [ ] Updated EMAIL_USER in .env
- [ ] Updated EMAIL_PASSWORD in .env
- [ ] Saved .env file
- [ ] Restarted server
- [ ] Saw "✓ Email service configured successfully"
- [ ] Tested password reset
- [ ] Received email

---

## 🎯 Example .env File

```env
PORT=5500
MONGODB_URI=mongodb://localhost:27017/BETCI
NODE_ENV=development

# Email Configuration
EMAIL_USER=ivanmaglagui@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
FRONTEND_URL=http://localhost:5500
```

---

## 🔗 Quick Links

- **App Passwords:** https://myaccount.google.com/apppasswords
- **Security Settings:** https://myaccount.google.com/security
- **2-Step Verification Help:** https://support.google.com/accounts/answer/185839

---

## 💡 Tips

1. **Save the App Password** somewhere safe (password manager)
2. **Test with your own email** first
3. **Check spam folder** for first email
4. **Use a dedicated Gmail** for sending (optional)
5. **Regenerate if compromised** - You can always create a new one

---

**That's it! Follow these steps and emails will work! 📧✅**
