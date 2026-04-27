# Fix Password Reset 500 Error

## Error
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
/api/forgot-password
```

## Cause
The 500 error occurs because the **Gmail App Password is not configured** in the backend `.env` file. When the backend tries to send an email, it fails because the email service credentials are missing or incorrect.

## Solution

### Step 1: Generate Gmail App Password

1. **Go to Google Account Security**
   - URL: https://myaccount.google.com/security
   - Sign in with: **baki40843@gmail.com**
   - Password: **Bakihanma1234567890**

2. **Enable 2-Step Verification** (if not already enabled)
   - Scroll to "2-Step Verification"
   - Click and follow the setup process
   - Verify your phone number

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Windows Computer** (or "Other" → type "BETCI")
   - Click **Generate**
   - Copy the 16-character password (example: `abcd efgh ijkl mnop`)
   - Remove spaces: `abcdefghijklmnop`

### Step 2: Update Backend Configuration

1. **Open the .env file**
   ```
   BETCIV1-main/backend/.env
   ```

2. **Update EMAIL_PASSWORD**
   ```env
   PORT=5500
   MONGODB_URI=mongodb://localhost:27017/BETCI
   NODE_ENV=development

   # Email Configuration
   EMAIL_USER=baki40843@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop  ← Replace with your App Password
   FRONTEND_URL=http://localhost:5500
   ```

3. **Save the file**

### Step 3: Restart Backend Server

1. **Stop the current server**
   - Press `Ctrl+C` in the terminal where server is running

2. **Start the server again**
   ```bash
   cd BETCIV1-main/backend
   npm start
   ```

3. **Verify server started**
   - Look for: `Server running on port 5500`
   - Look for: `✓ Email service configured successfully`

### Step 4: Test Password Reset

1. **Open forgot password page**
   ```
   http://localhost:5500/frontend/auth/forgot-password.html
   ```

2. **Enter email**
   - Use: baki40843@gmail.com (or any registered email)

3. **Click "SEND RESET LINK"**
   - Should show: "Password reset link has been sent to your email!"
   - No 500 error

4. **Check email inbox**
   - Look for email from baki40843@gmail.com
   - Subject: "Password Reset Request - BETCI"
   - Click the reset link

## Verification

### Backend Console Should Show:
```
✓ Email service configured successfully
✓ Password reset email sent to: user@example.com (admin)
```

### Frontend Should Show:
```
Custom notification modal:
"Password reset link has been sent to your email!"
```

### Email Should Contain:
- Reset link with token
- Valid for 15 minutes
- Professional HTML template
- BETCI branding

## If Still Getting 500 Error

### Check Backend Logs
Look for specific error messages:
```
✗ Failed to send password reset email: Invalid login: 535-5.7.8
```

This means:
- App Password is incorrect
- Using regular password instead of App Password
- 2-Step Verification not enabled

### Common Issues

1. **"Invalid login: 535-5.7.8"**
   - Solution: Generate new App Password
   - Make sure you're using App Password, not regular password

2. **"App passwords is not available"**
   - Solution: Enable 2-Step Verification first
   - Go to: https://myaccount.google.com/security

3. **"Connection timeout"**
   - Solution: Check internet connection
   - Check firewall settings
   - Make sure port 587 (SMTP) is not blocked

4. **"EAUTH: Invalid credentials"**
   - Solution: Double-check EMAIL_USER and EMAIL_PASSWORD
   - Make sure no extra spaces in .env file
   - Restart server after updating .env

## Testing Without Email (Temporary)

If you want to test the flow without configuring email:

### Option 1: Check Backend Logs
The backend still generates the token and saves it to database. Check console for:
```
✓ Password reset token generated: abc123...
```

### Option 2: Use Test Script
Run the test script:
```bash
cd BETCIV1-main/backend
node test-password-reset.js
```

This will test the complete flow and show you what would happen.

## Updated Error Message

The frontend now shows a helpful message when email service is not configured:

```
┌─────────────────────────────────────────────┐
│  localhost:5500 says                        │
│                                             │
│  Email service is not configured yet.       │
│  Please contact your administrator to       │
│  set up Gmail App Password.                 │
│                                             │
│         ┌──────────┐                        │
│         │    OK    │                        │
│         └──────────┘                        │
└─────────────────────────────────────────────┘
```

## Quick Reference

| Setting | Value |
|---------|-------|
| Email | baki40843@gmail.com |
| Regular Password | ❌ Will NOT work |
| App Password | ✅ Required (16 characters) |
| Get App Password | https://myaccount.google.com/apppasswords |
| .env File | BETCIV1-main/backend/.env |
| Restart Command | `npm start` in backend folder |

## Status After Fix

✅ Password reset will:
1. Accept email input
2. Call backend API
3. Generate secure token
4. Send email via Gmail
5. Show success notification
6. User receives email with reset link

## Files Modified
- `BETCIV1-main/frontend/auth/forgot-password.html` - Better error handling for 500 errors
- `BETCIV1-main/backend/.env` - Needs EMAIL_PASSWORD update

## Next Steps
1. Generate Gmail App Password
2. Update backend/.env file
3. Restart backend server
4. Test password reset flow
5. Check email inbox for reset link
