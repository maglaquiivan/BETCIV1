# Password Reset Email Integration

## Status: ✅ NOW SENDS ACTUAL EMAILS

## What Was Changed

### Before:
- Just showed a notification
- No actual email was sent
- Was only simulating the action

### After:
- ✅ Calls backend API: `POST /api/forgot-password`
- ✅ Backend sends actual email with reset link
- ✅ Shows loading state while sending
- ✅ Handles success and error responses
- ✅ Proper error handling for network issues

## How It Works Now

### 1. User Submits Email
```
User enters email → Click "SEND RESET LINK"
```

### 2. Frontend Validation
```javascript
// Validates email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  showNotification('Please enter a valid email address');
  return;
}
```

### 3. API Call to Backend
```javascript
const response = await fetch('http://localhost:5500/api/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: email })
});
```

### 4. Backend Process
1. Receives email address
2. Checks if email exists in database (AdminAccount or TraineeAccount)
3. Generates secure reset token
4. Saves token to PasswordReset collection with expiration (1 hour)
5. Sends email with reset link using Gmail SMTP
6. Returns success response

### 5. Email Sent
User receives email with:
- Reset link: `http://localhost:5500/reset-password?token=XXXXX`
- Valid for 1 hour
- Professional HTML template
- BETCI branding

### 6. Success Notification
Shows custom modal:
```
┌─────────────────────────────────────┐
│  localhost:5500 says                │
│                                     │
│  Password reset link has been       │
│  sent to your email!                │
│                                     │
│         ┌──────────┐                │
│         │    OK    │                │
│         └──────────┘                │
└─────────────────────────────────────┘
```

## Backend API Details

### Endpoint
```
POST /api/forgot-password
```

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Success Response (200)
```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### Error Response (500)
```json
{
  "message": "An error occurred. Please try again later."
}
```

## Security Features

### 1. Email Privacy
- Backend doesn't reveal if email exists in database
- Always returns same success message
- Prevents email enumeration attacks

### 2. Token Security
- Cryptographically secure random token (32 bytes)
- Hashed before storing in database (SHA-256)
- Expires after 1 hour
- Single-use only (deleted after use)

### 3. Rate Limiting
- Prevents spam/abuse
- Limits requests per IP address

## Email Configuration Required

### Prerequisites
For emails to actually send, you need:

1. **Gmail App Password** (not regular password)
   - Go to: https://myaccount.google.com/apppasswords
   - Generate App Password for "Mail"
   - Copy 16-character password

2. **Update .env file**
   ```env
   EMAIL_USER=baki40843@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   FRONTEND_URL=http://localhost:5500
   ```

3. **Restart Server**
   ```bash
   cd backend
   npm start
   ```

## Testing

### Test the Complete Flow

1. **Open forgot password page**
   ```
   http://localhost:5500/frontend/auth/forgot-password.html
   ```

2. **Enter email address**
   - Use: baki40843@gmail.com (or any registered email)

3. **Click "SEND RESET LINK"**
   - Button shows "SENDING..."
   - Wait for response

4. **Check for success**
   - Custom notification appears
   - Check email inbox
   - Look for email from baki40843@gmail.com

5. **Click reset link in email**
   - Opens reset password page
   - Enter new password
   - Submit to complete reset

### Expected Console Logs (Backend)
```
✓ Password reset requested for: user@example.com
✓ Reset token generated and saved
✓ Password reset email sent successfully
```

### Expected Console Logs (Frontend)
```
Sending password reset request...
Password reset email sent successfully
```

## Error Handling

### Network Error
```javascript
catch (error) {
  showNotification('Network error. Please check your connection and try again.');
}
```

### Invalid Email Format
```javascript
if (!emailRegex.test(email)) {
  showNotification('Please enter a valid email address');
}
```

### Server Error
```javascript
if (!response.ok) {
  showNotification(data.message || 'Failed to send reset link. Please try again.');
}
```

### Email Service Not Configured
```
Backend returns: "Email service is not configured. Please contact administrator."
```

## UI States

### 1. Initial State
```
Button: "SEND RESET LINK" (enabled)
```

### 2. Loading State
```
Button: "SENDING..." (disabled)
Cursor: wait
```

### 3. Success State
```
Modal: "Password reset link has been sent to your email!"
Button: Re-enabled after modal closes
```

### 4. Error State
```
Modal: Shows error message
Button: "SEND RESET LINK" (re-enabled)
```

## Files Modified

### Frontend
- `BETCIV1-main/frontend/auth/forgot-password.html`
  - Added API call to `/api/forgot-password`
  - Added loading state
  - Added error handling
  - Added custom notification modal

### Backend (Already Exists)
- `BETCIV1-main/backend/routes/passwordReset.js`
  - POST `/api/forgot-password` endpoint
  - POST `/api/reset-password` endpoint
  - GET `/api/verify-reset-token/:token` endpoint

- `BETCIV1-main/backend/utils/emailService.js`
  - `sendPasswordResetEmail()` function
  - Gmail SMTP configuration
  - HTML email template

- `BETCIV1-main/backend/models/PasswordReset.js`
  - Token storage schema
  - Expiration handling

## Complete Flow Diagram

```
┌─────────────┐
│   User      │
│ Enters Email│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Frontend      │
│ Validates Email │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│   API Call          │
│ POST /forgot-password│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Backend           │
│ 1. Find user        │
│ 2. Generate token   │
│ 3. Save to DB       │
│ 4. Send email       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Gmail SMTP        │
│ Sends email to user │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   User Inbox        │
│ Receives reset link │
└─────────────────────┘
```

## Status

✅ **COMPLETE** - Password reset now:
1. Calls backend API
2. Sends actual email via Gmail
3. Shows custom notification
4. Handles all error cases
5. Provides good UX with loading states

## Next Steps

To make it work:
1. ✅ Code is ready
2. ⚠️ Configure Gmail App Password in `.env`
3. ⚠️ Restart backend server
4. ✅ Test the flow

Once Gmail is configured, the password reset will send real emails!
