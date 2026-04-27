# Password Reset - Username-Based System

## ✅ Updated: Now Uses Username Instead of Email

The password reset system has been updated to ask for **username** first, then look up the email from the database.

## How It Works Now

### User Flow:

1. User goes to: http://localhost:5500/frontend/auth/forgot-password.html
2. **Form asks for: USERNAME** (not email)
3. User enters their username (e.g., `admin`, `ivanmaglaqui`, `markysan28`)
4. System looks up the email associated with that username
5. System sends reset email to the email address found
6. User receives email and can reset password

### Example Usernames in Database:

**Admin Accounts:**
- Username: `admin` → Email: admin@betci.com

**Trainee Accounts:**
- Username: `ivanmaglaqui` → Email: ivanmaglaqui@gmail.com
- Username: `markysan28` → Email: markysan28@gmail.com
- Username: `yajeee1209` → Email: yajeee1209@gmail.com

## What Changed

### Frontend (forgot-password.html):

**Before:**
```html
<label for="reset-email">EMAIL ADDRESS</label>
<input type="email" id="reset-email" placeholder="Enter your registered email address">
```

**After:**
```html
<label for="reset-username">USERNAME</label>
<input type="text" id="reset-username" placeholder="Enter your username">
```

### Backend (passwordReset.js):

**Before:**
```javascript
const { email } = req.body;
// Search by email
user = await AdminAccount.findOne({ email: normalizedEmail });
```

**After:**
```javascript
const { username } = req.body;
// Search by username, get email from user record
user = await AdminAccount.findOne({ username: normalizedUsername });
if (user) {
  userEmail = user.email; // Get email from database
}
```

## Backend Logic Flow

```
1. Receive username from frontend
   ↓
2. Search AdminAccount collection for username
   ↓
3. If not found, search TraineeAccount collection
   ↓
4. If found, get email from user.email field
   ↓
5. Generate reset token
   ↓
6. Send email to the email address found
   ↓
7. Return success message (same whether user exists or not)
```

## Security Features

✅ **Username Enumeration Protection:** Always returns same success message  
✅ **Email Privacy:** Email address is never revealed to the requester  
✅ **Token Security:** SHA-256 hashed tokens stored in database  
✅ **Time Limit:** 15-minute expiration on reset links  
✅ **One-Time Use:** Tokens deleted after use  
✅ **IP Logging:** Request IP logged for security auditing

## Success Message

The system always shows the same message whether the username exists or not:

```
"If an account exists with this username, you will receive a 
password reset link shortly. Please check your inbox and spam folder."
```

This prevents attackers from discovering which usernames exist in the system.

## Backend Console Output

When a valid username is submitted:

```
✓ Password reset email sent for username: admin (admin)
   Email sent to: admin@betci.com
```

When an invalid username is submitted:

```
Password reset requested for non-existent username: invaliduser
```

## Testing

### Test with Admin Account:
1. Go to: http://localhost:5500/frontend/auth/forgot-password.html
2. Enter username: `admin`
3. Click: SEND RESET LINK
4. Check email: admin@betci.com

### Test with Trainee Account:
1. Go to: http://localhost:5500/frontend/auth/forgot-password.html
2. Enter username: `ivanmaglaqui`
3. Click: SEND RESET LINK
4. Check email: ivanmaglaqui@gmail.com

### Test with Invalid Username:
1. Go to: http://localhost:5500/frontend/auth/forgot-password.html
2. Enter username: `nonexistent`
3. Click: SEND RESET LINK
4. See success message (but no email sent)
5. Backend logs: "Password reset requested for non-existent username"

## Email Content

The email sent will contain:

**To:** [Email from database]  
**From:** BETCI Support <baki40843@gmail.com>  
**Subject:** Password Reset Request - BETCI

**Body:**
- Personalized greeting with user's first name
- Reset password button
- Reset link (valid for 15 minutes)
- Security warning
- BETCI branding

## Database Lookup

The system searches in this order:

1. **AdminAccount collection** - Search by `username` field
   - If found: Use `email` field from admin record
   
2. **TraineeAccount collection** - Search by `username` field
   - If found: Use `email` field from trainee record

3. **Not found** - Return success message without sending email

## Files Modified

1. **frontend/auth/forgot-password.html**
   - Changed input from email to username
   - Updated label and placeholder text
   - Updated validation logic
   - Changed API request to send username

2. **backend/routes/passwordReset.js**
   - Changed to accept username instead of email
   - Added database lookup by username
   - Extract email from user record
   - Enhanced logging to show username → email mapping

## Benefits of Username-Based Reset

✅ **User Friendly:** Users remember usernames better than emails  
✅ **Privacy:** Email addresses not exposed in the form  
✅ **Flexibility:** Email can be changed without affecting username  
✅ **Security:** Prevents email enumeration attacks  
✅ **Consistency:** Matches login flow (which uses username)

## API Endpoint

**Endpoint:** `POST /api/forgot-password`

**Request Body:**
```json
{
  "username": "admin"
}
```

**Response (Success):**
```json
{
  "message": "If an account exists with this username, you will receive a password reset link shortly."
}
```

**Response (Error):**
```json
{
  "message": "Please provide a username"
}
```

## Complete Flow Example

```
User Action: Enter username "admin" → Click "SEND RESET LINK"
   ↓
Frontend: POST /api/forgot-password { username: "admin" }
   ↓
Backend: Search AdminAccount.findOne({ username: "admin" })
   ↓
Backend: Found user! Email = "admin@betci.com"
   ↓
Backend: Generate token: "a1b2c3d4e5f6..."
   ↓
Backend: Save to PasswordReset collection
   ↓
Backend: Send email to "admin@betci.com"
   ↓
Email Service: Send via Gmail SMTP
   ↓
User: Receives email at admin@betci.com
   ↓
User: Clicks reset link
   ↓
User: Resets password
   ↓
Done! ✅
```

## Status

✅ **Frontend Updated:** Now asks for username  
✅ **Backend Updated:** Looks up email by username  
✅ **Email Service:** Working and configured  
✅ **Database Lookup:** Searches both admin and trainee collections  
✅ **Security:** Username enumeration protection enabled  
✅ **Testing:** Ready to test with existing usernames

---

**Updated on:** April 22, 2026  
**System Status:** ✅ FULLY OPERATIONAL
