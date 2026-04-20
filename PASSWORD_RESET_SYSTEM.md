# Password Reset System - Backend Implementation

## Overview
Complete backend-only password reset system for BETCI application using Node.js, Express, MongoDB, Nodemailer, and bcrypt.

## Features
✅ Secure token generation using crypto  
✅ 15-minute token expiration  
✅ Email sending with Gmail SMTP  
✅ Password hashing with bcrypt  
✅ No email enumeration (security)  
✅ Supports both Admin and Trainee accounts  
✅ Automatic token cleanup  
✅ Professional HTML email template  

---

## Installation

### 1. Install Required Dependencies

```bash
cd backend
npm install bcrypt nodemailer
```

**Note:** `crypto` is built into Node.js, no installation needed.

### 2. Configure Environment Variables

Edit `backend/.env` and add:

```env
# Email Configuration for Password Reset
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
FRONTEND_URL=http://localhost:3000
```

### 3. Gmail App Password Setup

**Important:** You MUST use a Gmail App Password, not your regular password.

#### Steps to Generate Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose "Mail"
5. Click **Select device** → Choose "Other" → Enter "BETCI"
6. Click **Generate**
7. Copy the 16-character password (no spaces)
8. Paste it into `.env` as `EMAIL_PASSWORD`

**Example:**
```env
EMAIL_USER=betci.support@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

### 1. Request Password Reset

**Endpoint:** `POST /api/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Always 200 - Security):**
```json
{
  "message": "If an account exists with this email, you will receive a password reset link shortly."
}
```

**Security Note:** Always returns success message, even if email doesn't exist. This prevents attackers from discovering valid email addresses.

**cURL Example:**
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@betci.edu.ph"}'
```

---

### 2. Reset Password

**Endpoint:** `POST /api/reset-password`

**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "message": "Password has been reset successfully. You can now login with your new password.",
  "accountType": "admin"
}
```

**Error Responses:**

**400 - Invalid Token:**
```json
{
  "message": "Invalid or expired reset token. Please request a new password reset."
}
```

**400 - Weak Password:**
```json
{
  "message": "Password must be at least 8 characters long"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"abc123def456...",
    "newPassword":"NewPassword123!"
  }'
```

---

### 3. Verify Reset Token (Optional)

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

**cURL Example:**
```bash
curl http://localhost:5500/api/verify-reset-token/abc123def456...
```

---

### 4. Cleanup Expired Tokens (Maintenance)

**Endpoint:** `DELETE /api/cleanup-expired-tokens`

**Response:**
```json
{
  "message": "Cleanup completed",
  "deletedCount": 5
}
```

**Note:** MongoDB TTL index automatically deletes expired tokens, but this endpoint provides manual cleanup.

---

## Email Template

The system sends a professional HTML email with:

- **Subject:** "Password Reset Request - BETCI"
- **Personalized greeting** with user's first name
- **Clickable button** "Reset Password"
- **Fallback plain URL** for email clients that don't support buttons
- **Expiration warning** (15 minutes)
- **Security notice** about ignoring if not requested
- **Responsive design** that works on mobile and desktop
- **BETCI branding** with orange gradient header

**Email Preview:**

```
┌─────────────────────────────────────┐
│   Password Reset Request            │  ← Orange gradient header
├─────────────────────────────────────┤
│ Hello John,                         │
│                                     │
│ We received a request to reset     │
│ your password...                    │
│                                     │
│  ┌─────────────────────┐           │
│  │  Reset Password     │           │  ← Orange button
│  └─────────────────────┘           │
│                                     │
│ Or copy this link:                  │
│ http://localhost:3000/reset-...    │
│                                     │
│ ⚠️ Important: Expires in 15 min    │
└─────────────────────────────────────┘
```

---

## Security Features

### 1. No Email Enumeration
- Always returns success message, even if email doesn't exist
- Prevents attackers from discovering valid accounts

### 2. Token Security
- Generated using `crypto.randomBytes(32)` (256-bit)
- Hashed with SHA-256 before storing in database
- Unhashed token sent in email (one-time use)

### 3. Token Expiration
- 15-minute expiration time
- MongoDB TTL index for automatic cleanup
- Tokens marked as "used" after successful reset

### 4. Password Security
- Hashed with bcrypt (10 salt rounds)
- Minimum 8 characters required
- Old password immediately replaced

### 5. Request Logging
- IP address logged for security auditing
- Console logs for monitoring
- No sensitive data in logs

---

## Database Schema

### PasswordReset Collection

```javascript
{
  email: String,           // User email (lowercase, trimmed)
  accountType: String,     // 'admin' or 'trainee'
  token: String,           // Hashed token (SHA-256)
  expiresAt: Date,         // Expiration timestamp
  used: Boolean,           // Token usage status
  requestIp: String,       // Requester IP address
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

**Indexes:**
- `{ token: 1, expiresAt: 1 }` - Fast token lookup
- `{ email: 1, accountType: 1 }` - Fast email lookup
- `{ expiresAt: 1 }` - TTL index for auto-deletion

---

## Testing

### Test Flow

1. **Request Password Reset:**
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@betci.edu.ph"}'
```

2. **Check Email Inbox** for reset link

3. **Extract Token** from email URL:
```
http://localhost:3000/reset-password?token=ABC123DEF456...
                                            ↑ Copy this token
```

4. **Reset Password:**
```bash
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"ABC123DEF456...",
    "newPassword":"NewPassword123!"
  }'
```

5. **Login** with new password

### Test Cases

#### ✅ Valid Email (Admin)
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@betci.edu.ph"}'
```
**Expected:** Success message + email sent

#### ✅ Valid Email (Trainee)
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"trainee@betci.edu.ph"}'
```
**Expected:** Success message + email sent

#### ✅ Non-existent Email
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com"}'
```
**Expected:** Success message (no email sent)

#### ✅ Invalid Token
```bash
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"invalid","newPassword":"Test123!"}'
```
**Expected:** Error "Invalid or expired reset token"

#### ✅ Expired Token
Wait 16 minutes after requesting reset, then try to use token.
**Expected:** Error "Invalid or expired reset token"

#### ✅ Weak Password
```bash
curl -X POST http://localhost:5500/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"valid-token","newPassword":"123"}'
```
**Expected:** Error "Password must be at least 8 characters long"

---

## Troubleshooting

### Email Not Sending

**Problem:** Email service fails to send

**Solutions:**

1. **Check Gmail App Password:**
   - Must be 16 characters (no spaces in code, but Gmail shows with spaces)
   - Must have 2-Step Verification enabled
   - Generate new App Password if needed

2. **Check .env Configuration:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

3. **Check Console Logs:**
   ```
   ✓ Email service configured successfully
   ✓ Password reset email sent: <message-id>
   ```

4. **Test Email Configuration:**
   ```javascript
   // Add to server.js temporarily
   const { verifyEmailConfig } = require('./utils/emailService');
   verifyEmailConfig();
   ```

### Token Not Working

**Problem:** Reset token returns "Invalid or expired"

**Solutions:**

1. **Check Token Expiration:**
   - Tokens expire after 15 minutes
   - Request new reset if expired

2. **Check Token Format:**
   - Must be exact token from email
   - No extra spaces or characters

3. **Check Database:**
   ```javascript
   // In MongoDB shell
   db.passwordresets.find()
   ```

### Password Not Updating

**Problem:** Password reset succeeds but can't login

**Solutions:**

1. **Check bcrypt Installation:**
   ```bash
   npm list bcrypt
   ```

2. **Check Password Hashing:**
   - Verify bcrypt is hashing correctly
   - Check salt rounds (should be 10)

3. **Check Login Route:**
   - Ensure login route uses bcrypt.compare()

---

## File Structure

```
backend/
├── models/
│   ├── AdminAccount.js          # Existing
│   ├── TraineeAccount.js        # Existing
│   └── PasswordReset.js         # NEW - Token storage
├── routes/
│   ├── passwordReset.js         # NEW - Reset endpoints
│   └── ...other routes
├── utils/
│   └── emailService.js          # NEW - Email sending
├── .env                         # Updated with email config
├── package.json                 # Updated with dependencies
└── server.js                    # Updated with routes
```

---

## Production Considerations

### 1. Environment Variables
- Use secure environment variable management (AWS Secrets Manager, etc.)
- Never commit `.env` to version control

### 2. Email Service
- Consider using dedicated email service (SendGrid, AWS SES) for production
- Gmail has daily sending limits (500 emails/day)

### 3. Rate Limiting
- Add rate limiting to prevent abuse:
```javascript
const rateLimit = require('express-rate-limit');

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many password reset attempts, please try again later'
});

app.use('/api/forgot-password', resetLimiter);
```

### 4. HTTPS
- Always use HTTPS in production
- Update `FRONTEND_URL` to use `https://`

### 5. Monitoring
- Log all password reset attempts
- Monitor for suspicious patterns
- Set up alerts for high volumes

### 6. Token Storage
- Consider Redis for token storage (faster than MongoDB)
- Implement token blacklisting for extra security

---

## Next Steps

### Backend Complete ✅
- [x] Password reset routes
- [x] Email service
- [x] Token management
- [x] Security features

### Frontend TODO (Not Included)
- [ ] Forgot password form
- [ ] Reset password form
- [ ] Token validation
- [ ] Success/error messages

---

## Support

For issues or questions:
1. Check console logs for errors
2. Verify email configuration
3. Test with cURL commands
4. Check MongoDB for token records

---

## License

Part of BETCI application - Internal use only

---

**Last Updated:** April 20, 2026  
**Version:** 1.0.0  
**Author:** BETCI Development Team
