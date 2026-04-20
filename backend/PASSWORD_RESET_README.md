# Password Reset System - Complete Backend Implementation

## 🎯 Overview

A production-ready, secure password reset system for the BETCI application. This backend-only implementation handles password reset requests, token generation, email sending, and password updates for both Admin and Trainee accounts.

## ✨ Features

- ✅ **Secure Token Generation** - 256-bit random tokens using crypto
- ✅ **Email Delivery** - Professional HTML emails via Gmail SMTP
- ✅ **Password Hashing** - bcrypt with 10 salt rounds
- ✅ **Token Expiration** - 15-minute automatic expiration
- ✅ **Security First** - No email enumeration, one-time tokens
- ✅ **Dual Account Support** - Works with Admin and Trainee accounts
- ✅ **Auto Cleanup** - MongoDB TTL index for expired tokens
- ✅ **Production Ready** - Error handling, logging, validation

## 📦 Installation

### 1. Install Dependencies

```bash
cd backend
npm install bcrypt nodemailer
```

### 2. Configure Environment

Add to `backend/.env`:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:3000
```

### 3. Get Gmail App Password

**Important:** You need a Gmail App Password, not your regular password.

1. Visit: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App passwords**
4. Generate password for "Mail" → "Other (BETCI)"
5. Copy the 16-character password
6. Paste into `.env` as `EMAIL_PASSWORD`

### 4. Start Server

```bash
npm start
```

Look for:
```
✓ MongoDB connected successfully
✓ Email service configured successfully
✓ Server running at http://localhost:5500
```

## 🚀 Quick Test

### Test with cURL:

```bash
# Request password reset
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@betci.edu.ph"}'

# Check your email for the reset link
# Extract token from URL and use it:

# Reset password
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"TOKEN_FROM_EMAIL",
    "newPassword":"NewPassword123!"
  }'
```

### Test with Script:

```bash
node test-password-reset.js
```

This will:
- Verify email configuration
- Check database connectivity
- Test token generation
- Optionally send test email
- Verify password hashing

## 📚 API Documentation

### 1. Request Password Reset

**Endpoint:** `POST /api/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** (Always 200 for security)
```json
{
  "message": "If an account exists with this email, you will receive a password reset link shortly."
}
```

**What happens:**
1. Validates email format
2. Searches both Admin and Trainee collections
3. If found: Generates token, stores in DB, sends email
4. If not found: Returns success message (no email sent)
5. Token expires in 15 minutes

---

### 2. Reset Password

**Endpoint:** `POST /api/reset-password`

**Request:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePassword123!"
}
```

**Success Response:** (200)
```json
{
  "message": "Password has been reset successfully. You can now login with your new password.",
  "accountType": "admin"
}
```

**Error Responses:**

- **400** - Invalid/expired token
- **400** - Password too short (< 8 chars)
- **404** - User not found
- **500** - Server error

**What happens:**
1. Validates token and password
2. Checks token expiration
3. Finds user account
4. Hashes new password with bcrypt
5. Updates user password
6. Marks token as used
7. Deletes token from database

---

### 3. Verify Token (Optional)

**Endpoint:** `GET /api/verify-reset-token/:token`

**Response:**
```json
{
  "valid": true,
  "message": "Token is valid",
  "expiresIn": "12 minutes",
  "accountType": "trainee"
}
```

**Use case:** Frontend can check token validity before showing reset form

---

### 4. Cleanup Expired Tokens

**Endpoint:** `DELETE /api/cleanup-expired-tokens`

**Response:**
```json
{
  "message": "Cleanup completed",
  "deletedCount": 5
}
```

**Note:** MongoDB TTL index auto-deletes expired tokens, but this provides manual cleanup

## 🔒 Security Features

### 1. Email Enumeration Protection
```javascript
// Always returns success, even if email doesn't exist
return res.status(200).json({ 
  message: "If an account exists..." 
});
```

### 2. Token Security
- **Generation:** `crypto.randomBytes(32)` → 256-bit random token
- **Storage:** SHA-256 hashed before database storage
- **Transmission:** Unhashed token sent in email (one-time use)
- **Expiration:** 15 minutes automatic expiration
- **One-time:** Deleted after successful use

### 3. Password Security
- **Hashing:** bcrypt with 10 salt rounds
- **Validation:** Minimum 8 characters
- **Storage:** Only hashed passwords in database

### 4. Request Logging
- IP address logged for security auditing
- Console logs for monitoring
- No sensitive data in logs

## 📧 Email Template

Professional HTML email with:

- **Personalized greeting** with user's first name
- **Clickable button** "Reset Password" (orange, branded)
- **Fallback URL** for email clients without button support
- **Expiration warning** (15 minutes)
- **Security notice** about ignoring if not requested
- **Responsive design** for mobile and desktop
- **BETCI branding** with gradient header

**Preview:**

```
┌──────────────────────────────────────┐
│  Password Reset Request              │ ← Orange gradient
├──────────────────────────────────────┤
│  Hello John,                         │
│                                      │
│  We received a request to reset      │
│  your password...                    │
│                                      │
│   ┌────────────────────┐            │
│   │  Reset Password    │            │ ← Orange button
│   └────────────────────┘            │
│                                      │
│  Or copy this link:                  │
│  http://localhost:3000/reset-...    │
│                                      │
│  ⚠️ Expires in 15 minutes           │
└──────────────────────────────────────┘
```

## 🗄️ Database Schema

### PasswordReset Collection

```javascript
{
  _id: ObjectId,
  email: String,           // Lowercase, trimmed
  accountType: String,     // 'admin' or 'trainee'
  token: String,           // SHA-256 hashed
  expiresAt: Date,         // 15 min from creation
  used: Boolean,           // false by default
  requestIp: String,       // Requester IP
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

**Indexes:**
- `{ token: 1, expiresAt: 1 }` - Fast token lookup
- `{ email: 1, accountType: 1 }` - Fast email lookup
- `{ expiresAt: 1 }` - TTL index (auto-delete expired)

## 📁 File Structure

```
backend/
├── models/
│   ├── AdminAccount.js          # Existing
│   ├── TraineeAccount.js        # Existing
│   └── PasswordReset.js         # NEW - Token storage
│
├── routes/
│   ├── passwordReset.js         # NEW - API endpoints
│   └── ...other routes
│
├── utils/
│   └── emailService.js          # NEW - Email sending
│
├── .env                         # Updated with email config
├── package.json                 # Updated with dependencies
├── server.js                    # Updated with routes
└── test-password-reset.js       # NEW - Test script
```

## 🧪 Testing

### Manual Testing

1. **Request Reset:**
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@betci.edu.ph"}'
```

2. **Check Email** - Look for reset link

3. **Extract Token** from URL:
```
http://localhost:3000/reset-password?token=ABC123...
                                            ↑ Copy this
```

4. **Reset Password:**
```bash
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"ABC123...","newPassword":"NewPass123!"}'
```

5. **Login** with new password

### Automated Testing

```bash
node test-password-reset.js
```

### Test Cases

| Test | Expected Result |
|------|----------------|
| Valid admin email | ✅ Email sent |
| Valid trainee email | ✅ Email sent |
| Non-existent email | ✅ Success message (no email) |
| Invalid token | ❌ Error message |
| Expired token (>15 min) | ❌ Error message |
| Weak password (<8 chars) | ❌ Error message |
| Valid token + password | ✅ Password updated |

## 🐛 Troubleshooting

### Email Not Sending

**Symptoms:**
```
✗ Email service configuration error
✗ Failed to send password reset email
```

**Solutions:**

1. **Check Gmail App Password:**
   - Must be 16 characters
   - Must have 2-Step Verification enabled
   - Generate new if needed: https://myaccount.google.com/apppasswords

2. **Check .env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop  # No spaces
   ```

3. **Test Configuration:**
   ```bash
   node test-password-reset.js
   ```

### Token Not Working

**Symptoms:**
```json
{"message": "Invalid or expired reset token"}
```

**Solutions:**

1. **Check Expiration:**
   - Tokens expire after 15 minutes
   - Request new reset if expired

2. **Check Token Format:**
   - Must be exact token from email
   - No extra spaces or line breaks

3. **Check Database:**
   ```javascript
   // MongoDB shell
   use BETCI
   db.passwordresets.find()
   ```

### Password Not Updating

**Symptoms:** Reset succeeds but can't login

**Solutions:**

1. **Check bcrypt:**
   ```bash
   npm list bcrypt
   ```

2. **Check Login Route:**
   - Ensure it uses `bcrypt.compare()`
   - Check password field name matches

3. **Test Password Hash:**
   ```javascript
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash('test', 10);
   const match = await bcrypt.compare('test', hash);
   console.log(match); // Should be true
   ```

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Use dedicated email service (SendGrid, AWS SES, Mailgun)
- [ ] Add rate limiting to prevent abuse
- [ ] Enable HTTPS for all connections
- [ ] Store secrets in secure vault (AWS Secrets Manager, Azure Key Vault)
- [ ] Set up monitoring and alerts
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Test with real user accounts
- [ ] Configure proper CORS settings
- [ ] Set up logging service (CloudWatch, Datadog)
- [ ] Implement token blacklisting for extra security

### Rate Limiting Example

```javascript
const rateLimit = require('express-rate-limit');

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many password reset attempts'
});

app.use('/api/forgot-password', resetLimiter);
```

### Email Service Alternatives

**Gmail:** Good for development, 500 emails/day limit

**SendGrid:** Production-ready, 100 emails/day free
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

**AWS SES:** Scalable, pay-as-you-go
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
```

## 📊 Monitoring

### Key Metrics to Track

- Password reset requests per hour
- Successful resets vs failed attempts
- Token expiration rate
- Email delivery success rate
- Average time from request to reset

### Logging Examples

```javascript
// Log password reset request
console.log(`Password reset requested: ${email} from ${ip}`);

// Log successful reset
console.log(`Password reset successful: ${email} (${accountType})`);

// Log failed attempts
console.log(`Failed reset attempt: Invalid token from ${ip}`);
```

## 🔐 Security Best Practices

1. **Never reveal if email exists** - Always return success message
2. **Use HTTPS in production** - Encrypt all traffic
3. **Implement rate limiting** - Prevent brute force attacks
4. **Log all attempts** - Monitor for suspicious activity
5. **Use strong tokens** - 256-bit random tokens minimum
6. **Hash tokens in database** - Additional security layer
7. **Short expiration time** - 15 minutes maximum
8. **One-time use tokens** - Delete after successful use
9. **Validate password strength** - Minimum 8 characters
10. **Use bcrypt for passwords** - Industry standard hashing

## 📝 License

Part of BETCI application - Internal use only

## 👥 Support

For issues or questions:
1. Check console logs for errors
2. Run test script: `node test-password-reset.js`
3. Verify email configuration
4. Check MongoDB for token records
5. Review full documentation: `PASSWORD_RESET_SYSTEM.md`

---

**Version:** 1.0.0  
**Last Updated:** April 20, 2026  
**Author:** BETCI Development Team
