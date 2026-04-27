# Gmail App Password Setup Guide

## ⚠️ IMPORTANT: Regular Gmail Password Will NOT Work!

Gmail no longer accepts regular passwords for third-party applications. You MUST use an "App Password" instead.

## Your Gmail Account
- **Email**: baki40843@gmail.com
- **Regular Password**: Bakihanma1234567890 ❌ (This will NOT work for the app)
- **App Password**: You need to generate this ✅

---

## Step-by-Step Instructions

### Step 1: Enable 2-Step Verification (Required)
Before you can create an App Password, you MUST have 2-Step Verification enabled.

1. Go to: https://myaccount.google.com/security
2. Sign in with **baki40843@gmail.com**
3. Scroll down to "2-Step Verification"
4. If it says "Off", click on it and follow the steps to turn it ON
5. You'll need to verify your phone number

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with **baki40843@gmail.com** if prompted
3. You'll see "App passwords" page
4. Under "Select app", choose **"Mail"**
5. Under "Select device", choose **"Windows Computer"** (or "Other" and type "BETCI App")
6. Click **"Generate"**
7. Google will show you a 16-character password like: `abcd efgh ijkl mnop`
8. **COPY THIS PASSWORD** (you can remove the spaces)

### Step 3: Update .env File

1. Open `BETCIV1-main/backend/.env` file
2. Find the line: `EMAIL_PASSWORD=PASTE_YOUR_APP_PASSWORD_HERE`
3. Replace `PASTE_YOUR_APP_PASSWORD_HERE` with your 16-character App Password
4. Example:
   ```
   EMAIL_USER=baki40843@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
5. Save the file

### Step 4: Restart the Server

1. Stop your current server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd BETCIV1-main/backend
   npm start
   ```

---

## Troubleshooting

### Error: "2-Step Verification is not enabled"
- You need to enable 2-Step Verification first (see Step 1 above)
- Go to: https://myaccount.google.com/security

### Error: "App passwords is not available"
- Make sure you're signed in with **baki40843@gmail.com**
- Make sure 2-Step Verification is enabled
- Try using this direct link: https://security.google.com/settings/security/apppasswords

### Error: "Invalid login: 535-5.7.8"
- This means you're still using the regular password
- You MUST use the App Password generated from Google
- Double-check you copied the entire 16-character password

### Still not working?
1. Make sure there are no extra spaces in the password
2. Make sure you saved the .env file
3. Make sure you restarted the server
4. Try generating a new App Password

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Email | baki40843@gmail.com |
| Regular Password | ❌ Will NOT work |
| App Password | ✅ Generate from Google |
| 2-Step Verification | ✅ Must be enabled |
| App Password Link | https://myaccount.google.com/apppasswords |

---

## Security Notes

- App Passwords are safer than using your regular password
- Each app gets its own password
- You can revoke App Passwords anytime without changing your main password
- Never share your App Password publicly

---

## After Setup

Once you've completed these steps:
1. The email service will work for password reset functionality
2. Users can request password reset emails
3. Emails will be sent from baki40843@gmail.com
4. No more "Invalid login" errors

---

## Need Help?

If you're still having issues:
1. Check that 2-Step Verification is ON
2. Generate a NEW App Password
3. Make sure you're copying the ENTIRE 16-character password
4. Restart the server after updating .env
