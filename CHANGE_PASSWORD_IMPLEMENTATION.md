# Change Password Implementation

## Overview
Implemented a fully functional change password feature with password hashing for both trainee and admin accounts.

## Features

### ✅ Security
- **Password Hashing**: Uses SHA-256 hashing algorithm (Node.js crypto module)
- **Current Password Verification**: Requires current password before allowing change
- **Session-Based**: Only logged-in users can change their password
- **Auto-Logout**: Forces re-login after password change for security

### ✅ Validation
- Minimum 6 characters length
- Current password must be correct
- New password must be different from current
- New password and confirm password must match
- All fields required

### ✅ User Experience
- Loading state during API call
- Clear success/error messages
- Form reset after successful change
- Automatic redirect to login page
- Works for both trainee and admin accounts

## Implementation Details

### Backend API

**File**: `backend/routes/changePassword.js`

**Endpoint**: `POST /api/change-password`

**Request Body**:
```json
{
  "accountId": "TRN-0001",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "userType": "trainee"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Features**:
- SHA-256 password hashing
- Backward compatibility (checks both plain text and hashed passwords)
- Validates current password
- Updates password in correct collection (admin or trainee)
- Adds `passwordChangedAt` timestamp

### Frontend Integration

**Files Modified**:
1. `frontend/trainee/pages/settings.html` - Trainee change password
2. `frontend/admin/pages/settings.html` - Admin change password

**Flow**:
1. User fills in change password form
2. Frontend validates input
3. Calls `/api/change-password` endpoint
4. Shows loading state
5. On success: Shows message → Clears session → Redirects to login
6. On error: Shows error message

### Server Configuration

**File**: `backend/server.js`

Added route registration:
```javascript
const changePasswordRoutes = require('./routes/changePassword');
app.use('/api', changePasswordRoutes);
```

## Password Hashing

### Algorithm: SHA-256

**Why SHA-256?**
- Built into Node.js (no external dependencies)
- Fast and secure
- One-way hashing (cannot be reversed)
- Consistent hash output

**Implementation**:
```javascript
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
```

### Backward Compatibility

The system checks both:
1. Plain text passwords (for old accounts)
2. Hashed passwords (for new accounts)

This ensures existing accounts continue to work while new passwords are hashed.

## Database Updates

### Collections Affected
- `adminaccounts` - Admin/Instructor passwords
- `traineeaccounts` - Trainee passwords

### New Field Added
- `passwordChangedAt` - Timestamp of last password change

## Usage

### For Trainees
1. Login to trainee dashboard
2. Go to Settings → Change Password tab
3. Enter current password
4. Enter new password (min 6 characters)
5. Confirm new password
6. Click "Update Password"
7. Login again with new password

### For Admins
1. Login to admin dashboard
2. Go to Settings → Change Password tab
3. Follow same steps as trainees

## Security Best Practices

✅ **Implemented**:
- Password hashing (SHA-256)
- Current password verification
- Session invalidation after change
- Minimum password length
- Server-side validation

🔒 **Recommended for Production**:
- Use bcrypt instead of SHA-256 (with salt)
- Add rate limiting to prevent brute force
- Implement password complexity requirements
- Add password history (prevent reuse)
- Add email notification on password change
- Implement 2FA (Two-Factor Authentication)

## Testing

### Test Cases
1. ✅ Change password with correct current password
2. ✅ Reject change with incorrect current password
3. ✅ Reject password shorter than 6 characters
4. ✅ Reject when new password matches current
5. ✅ Reject when passwords don't match
6. ✅ Verify password is hashed in database
7. ✅ Verify can login with new password
8. ✅ Verify old password no longer works

### Manual Testing Steps
1. Register/Login as trainee
2. Go to Settings → Change Password
3. Try changing password
4. Verify logout and redirect
5. Login with new password
6. Verify old password doesn't work
7. Repeat for admin account

## Error Handling

### Frontend Errors
- Missing fields → Alert message
- Password too short → Alert message
- Passwords don't match → Alert message
- API error → Alert with error message

### Backend Errors
- Account not found → 404 error
- Wrong current password → 401 error
- Missing fields → 400 error
- Server error → 500 error

## API Response Codes

- `200` - Success
- `400` - Bad request (missing fields, validation error)
- `401` - Unauthorized (wrong current password)
- `404` - Account not found
- `500` - Server error

## Notes

- Passwords are hashed using SHA-256
- Old plain text passwords still work (backward compatible)
- New passwords are automatically hashed
- Session is cleared after password change
- User must login again with new password
- Works for both trainee and admin accounts
- Password change is logged with timestamp

## Future Enhancements

- [ ] Add password strength indicator
- [ ] Implement bcrypt with salt
- [ ] Add email notification
- [ ] Add password history
- [ ] Implement password expiry
- [ ] Add 2FA support
- [ ] Add rate limiting
- [ ] Add password recovery
