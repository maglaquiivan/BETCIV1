# Gmail App Password Setup - Quick Guide

## Current Status
❌ Email service is NOT configured  
❌ Password reset emails are NOT being sent  
✅ System works in development mode (shows success but doesn't send email)

## What You Need To Do

Your Gmail account: **baki40843@gmail.com**  
Your regular password: **Bakihanma1234567890** (this will NOT work for SMTP!)

### Step 1: Enable 2-Step Verification (Required!)

1. Go to: https://myaccount.google.com/security
2. Sign in with **baki40843@gmail.com** and password **Bakihanma1234567890**
3. Find "2-Step Verification" section
4. Click "Get Started" or "Turn On"
5. Follow the prompts to verify your phone number
6. Complete the setup

**Why?** Gmail requires 2-Step Verification before you can create App Passwords.

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. You'll see "App passwords" page
4. Select app: **Mail**
5. Select device: **Windows Computer** (or choose "Other" and type "BETCI")
6. Click **Generate**
7. You'll see a 16-character password like: `abcd efgh ijkl mnop`
8. **COPY THIS PASSWORD** (you'll need it in the next step)

**Important:** Remove the spaces when you paste it!  
Example: `abcd efgh ijkl mnop` becomes `abcdefghijklmnop`

### Step 3: Update .env File

1. Open file: `BETCIV1-main/backend/.env`
2. Find the line: `EMAIL_PASSWORD=PASTE_YOUR_APP_PASSWORD_HERE`
3. Replace `PASTE_YOUR_APP_PASSWORD_HERE` with your 16-character App Password
4. Make sure there are NO spaces in the password
5. Save the file

**Example:**
```env
EMAIL_USER=baki40843@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### Step 4: Restart Your Server

1. Stop your current server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd backend
   npm start
   ```
3. Look for this message: `✓ Email service configured and ready`

### Step 5: Test It!

Run the test script:
```bash
cd backend
node test-email-simple.js
```

**Expected output:**
```
✓ Email Configuration Test PASSED
Check your inbox at: baki40843@gmail.com
```

Then check your Gmail inbox for the test email!

### Step 6: Try Password Reset

1. Go to: http://localhost:5500/frontend/auth/forgot-password.html
2. Enter: **baki40843@gmail.com**
3. Click "SEND RESET LINK"
4. Check your Gmail inbox for the password reset email

## Troubleshooting

### "App passwords is not available"
→ You need to enable 2-Step Verification first (Step 1)

### "Invalid login: 535-5.7.8"
→ You're using the wrong password. Use the App Password, not your regular password!

### Still not working?
1. Make sure you copied the App Password correctly (no spaces!)
2. Make sure you saved the .env file
3. Make sure you restarted the server
4. Check the backend console for error messages

## What Happens Now?

**Before setup:**
- User submits email → System shows success message
- NO email is actually sent
- Token is logged to console only
- User never receives reset link

**After setup:**
- User submits email → System shows success message
- Email IS sent via Gmail SMTP
- User receives professional HTML email
- User can click link to reset password

## Need Help?

If you're stuck, check the backend console when you start the server. It will show:
- ✓ Email service configured and ready (Good!)
- ⚠️ Email service not configured (Need to follow steps above)

The system will also show detailed instructions in the console when someone tries to reset their password.
