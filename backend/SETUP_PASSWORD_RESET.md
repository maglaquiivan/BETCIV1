# Quick Setup Guide - Password Reset System

## Step 1: Install Dependencies

```bash
cd backend
npm install bcrypt nodemailer
```

## Step 2: Configure Gmail

### Get Gmail App Password:

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Scroll to **App passwords**
4. Select app: **Mail**
5. Select device: **Other (Custom name)** → Enter "BETCI"
6. Click **Generate**
7. Copy the 16-character password

### Update .env File:

Edit `backend/.env`:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `your-email@gmail.com` with your Gmail address
- `abcdefghijklmnop` with your App Password (no spaces)

## Step 3: Start Server

```bash
npm start
```

**Look for:**
```
✓ MongoDB connected successfully
✓ Email service configured successfully
✓ Server running at http://localhost:5500
```

## Step 4: Test the System

### Test 1: Request Password Reset

```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@betci.edu.ph"}'
```

**Expected Response:**
```json
{
  "message": "If an account exists with this email, you will receive a password reset link shortly."
}
```

**Check:**
- Console shows: `✓ Password reset email sent to: admin@betci.edu.ph (admin)`
- Email received in inbox

### Test 2: Check Email

Open the email and click "Reset Password" button or copy the link.

**Link format:**
```
http://localhost:3000/reset-password?token=abc123def456...
```

### Test 3: Reset Password

Extract the token from the URL and use it:

```bash
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"PASTE_TOKEN_HERE",
    "newPassword":"NewPassword123!"
  }'
```

**Expected Response:**
```json
{
  "message": "Password has been reset successfully. You can now login with your new password.",
  "accountType": "admin"
}
```

### Test 4: Login with New Password

Try logging in with the new password to verify it works.

## Troubleshooting

### ✗ Email service configuration error

**Problem:** Gmail credentials incorrect

**Solution:**
1. Verify EMAIL_USER is correct Gmail address
2. Verify EMAIL_PASSWORD is App Password (not regular password)
3. Ensure 2-Step Verification is enabled
4. Generate new App Password if needed

### ✗ Failed to send password reset email

**Problem:** SMTP connection failed

**Solution:**
1. Check internet connection
2. Verify Gmail allows "Less secure app access" (if using old method)
3. Use App Password instead of regular password
4. Check firewall settings

### Token expired or invalid

**Problem:** Token doesn't work

**Solution:**
1. Tokens expire after 15 minutes - request new one
2. Ensure token is copied exactly from email
3. Check MongoDB for token: `db.passwordresets.find()`

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/forgot-password` | POST | Request reset link |
| `/api/reset-password` | POST | Reset password with token |
| `/api/verify-reset-token/:token` | GET | Check if token is valid |
| `/api/cleanup-expired-tokens` | DELETE | Manual cleanup |

## Security Notes

✅ **Email Enumeration Protection:** Always returns success, even if email doesn't exist  
✅ **Token Security:** 256-bit random tokens, hashed before storage  
✅ **Password Security:** bcrypt hashing with 10 salt rounds  
✅ **Expiration:** 15-minute token lifetime  
✅ **One-time Use:** Tokens deleted after successful reset  

## Files Created

```
backend/
├── models/PasswordReset.js       # Token storage model
├── routes/passwordReset.js       # API endpoints
├── utils/emailService.js         # Email sending service
└── .env                          # Updated with email config
```

## Next Steps

1. ✅ Backend is complete and working
2. 📝 Create frontend forms (forgot password, reset password)
3. 🔗 Connect frontend to these API endpoints
4. 🎨 Style the forms to match BETCI design
5. ✉️ Customize email template with BETCI logo

## Production Checklist

Before deploying to production:

- [ ] Use dedicated email service (SendGrid, AWS SES)
- [ ] Add rate limiting to prevent abuse
- [ ] Use HTTPS for all connections
- [ ] Store secrets in secure vault (AWS Secrets Manager)
- [ ] Set up monitoring and alerts
- [ ] Test with real user accounts
- [ ] Update FRONTEND_URL to production domain

---

**Need Help?**

Check the full documentation: `PASSWORD_RESET_SYSTEM.md`
