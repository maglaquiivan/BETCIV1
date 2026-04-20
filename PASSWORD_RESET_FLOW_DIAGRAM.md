# Password Reset System - Visual Flow Diagram

## 🔄 Complete Password Reset Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PASSWORD RESET SYSTEM FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   USER       │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. Enters email
       │    POST /api/forgot-password
       │    { "email": "user@example.com" }
       ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  passwordReset.js - /api/forgot-password                       │  │
│  │                                                                 │  │
│  │  2. Validate email format                                      │  │
│  │     ✓ Contains @                                               │  │
│  │     ✓ Lowercase & trim                                         │  │
│  │                                                                 │  │
│  │  3. Search for user                                            │  │
│  │     ┌─────────────────┐      ┌──────────────────┐            │  │
│  │     │ AdminAccount    │  OR  │ TraineeAccount   │            │  │
│  │     │ Collection      │      │ Collection       │            │  │
│  │     └─────────────────┘      └──────────────────┘            │  │
│  │                                                                 │  │
│  │  4. User found?                                                │  │
│  │     ├─ YES → Continue to step 5                               │  │
│  │     └─ NO  → Return success message (security)                │  │
│  │              Skip steps 5-7                                    │  │
│  │                                                                 │  │
│  │  5. Generate secure token                                      │  │
│  │     crypto.randomBytes(32) → 256-bit random token             │  │
│  │     Example: "a1b2c3d4e5f6..."                                │  │
│  │                                                                 │  │
│  │  6. Hash token for storage                                     │  │
│  │     SHA-256(token) → "9f8e7d6c5b4a..."                        │  │
│  │                                                                 │  │
│  │  7. Store in database                                          │  │
│  │     ┌────────────────────────────────────┐                    │  │
│  │     │ PasswordReset Collection           │                    │  │
│  │     ├────────────────────────────────────┤                    │  │
│  │     │ email: "user@example.com"          │                    │  │
│  │     │ accountType: "admin"               │                    │  │
│  │     │ token: "9f8e7d6c..." (hashed)      │                    │  │
│  │     │ expiresAt: Date + 15 minutes       │                    │  │
│  │     │ used: false                        │                    │  │
│  │     │ requestIp: "192.168.1.1"           │                    │  │
│  │     └────────────────────────────────────┘                    │  │
│  │                                                                 │  │
│  │  8. Send email                                                 │  │
│  │     ┌────────────────────────────────────┐                    │  │
│  │     │  emailService.js                   │                    │  │
│  │     │  ┌──────────────────────────────┐  │                    │  │
│  │     │  │ Nodemailer + Gmail SMTP      │  │                    │  │
│  │     │  │ ┌──────────────────────────┐ │  │                    │  │
│  │     │  │ │ HTML Email Template      │ │  │                    │  │
│  │     │  │ │ - BETCI Branding         │ │  │                    │  │
│  │     │  │ │ - Reset Button           │ │  │                    │  │
│  │     │  │ │ - Fallback URL           │ │  │                    │  │
│  │     │  │ │ - Expiration Warning     │ │  │                    │  │
│  │     │  │ └──────────────────────────┘ │  │                    │  │
│  │     │  └──────────────────────────────┘  │                    │  │
│  │     └────────────────────────────────────┘                    │  │
│  │     Reset URL: http://localhost:3000/reset-password?token=... │  │
│  │     (Unhashed token sent in email)                            │  │
│  │                                                                 │  │
│  │  9. Return success response                                    │  │
│  │     { "message": "If an account exists..." }                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 10. Success message displayed
       ↓
┌──────────────┐
│   USER       │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 11. Checks email inbox
       ↓
┌──────────────────────────────────────────────────────────────────────┐
│                          EMAIL INBOX                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  From: BETCI Support <betci@gmail.com>                         │  │
│  │  Subject: Password Reset Request - BETCI                       │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  ╔════════════════════════════════════════════════════╗  │  │  │
│  │  │  ║     Password Reset Request                         ║  │  │  │
│  │  │  ╠════════════════════════════════════════════════════╣  │  │  │
│  │  │  ║  Hello John,                                       ║  │  │  │
│  │  │  ║                                                    ║  │  │  │
│  │  │  ║  We received a request to reset your password...  ║  │  │  │
│  │  │  ║                                                    ║  │  │  │
│  │  │  ║    ┌──────────────────────┐                       ║  │  │  │
│  │  │  ║    │  Reset Password      │  ← Clickable Button   ║  │  │  │
│  │  │  ║    └──────────────────────┘                       ║  │  │  │
│  │  │  ║                                                    ║  │  │  │
│  │  │  ║  Or copy this link:                               ║  │  │  │
│  │  │  ║  http://localhost:3000/reset-password?token=...   ║  │  │  │
│  │  │  ║                                                    ║  │  │  │
│  │  │  ║  ⚠️ Expires in 15 minutes                         ║  │  │  │
│  │  │  ╚════════════════════════════════════════════════════╝  │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 12. Clicks "Reset Password" button
       │     or copies URL
       ↓
┌──────────────┐
│   USER       │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 13. Redirected to reset password page
       │     URL: http://localhost:3000/reset-password?token=a1b2c3...
       │
       │ 14. Enters new password
       │     POST /api/reset-password
       │     { "token": "a1b2c3...", "newPassword": "NewPass123!" }
       ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  passwordReset.js - /api/reset-password                        │  │
│  │                                                                 │  │
│  │  15. Validate input                                            │  │
│  │      ✓ Token provided                                          │  │
│  │      ✓ Password provided                                       │  │
│  │      ✓ Password length >= 8 characters                         │  │
│  │                                                                 │  │
│  │  16. Hash the token                                            │  │
│  │      SHA-256(token) → "9f8e7d6c5b4a..."                        │  │
│  │                                                                 │  │
│  │  17. Find token in database                                    │  │
│  │      ┌────────────────────────────────────┐                    │  │
│  │      │ PasswordReset Collection           │                    │  │
│  │      │ WHERE:                             │                    │  │
│  │      │   token = "9f8e7d6c..." (hashed)   │                    │  │
│  │      │   used = false                     │                    │  │
│  │      │   expiresAt > NOW()                │                    │  │
│  │      └────────────────────────────────────┘                    │  │
│  │                                                                 │  │
│  │  18. Token valid?                                              │  │
│  │      ├─ YES → Continue to step 19                             │  │
│  │      └─ NO  → Return error "Invalid or expired token"         │  │
│  │                                                                 │  │
│  │  19. Find user account                                         │  │
│  │      ┌─────────────────┐      ┌──────────────────┐            │  │
│  │      │ AdminAccount    │  OR  │ TraineeAccount   │            │  │
│  │      │ WHERE:          │      │ WHERE:           │            │  │
│  │      │ email = ...     │      │ email = ...      │            │  │
│  │      └─────────────────┘      └──────────────────┘            │  │
│  │                                                                 │  │
│  │  20. Hash new password                                         │  │
│  │      bcrypt.hash(newPassword, 10)                              │  │
│  │      "NewPass123!" → "$2b$10$abc123..."                        │  │
│  │                                                                 │  │
│  │  21. Update user password                                      │  │
│  │      user.password = "$2b$10$abc123..."                        │  │
│  │      user.save()                                               │  │
│  │                                                                 │  │
│  │  22. Mark token as used                                        │  │
│  │      resetRecord.used = true                                   │  │
│  │      resetRecord.save()                                        │  │
│  │                                                                 │  │
│  │  23. Delete token from database                                │  │
│  │      PasswordReset.deleteOne({ _id: resetRecord._id })         │  │
│  │                                                                 │  │
│  │  24. Return success response                                   │  │
│  │      {                                                         │  │
│  │        "message": "Password has been reset successfully...",   │  │
│  │        "accountType": "admin"                                  │  │
│  │      }                                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 25. Success message displayed
       ↓
┌──────────────┐
│   USER       │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 26. Redirected to login page
       │
       │ 27. Logs in with new password
       │     POST /api/login
       │     { "email": "user@example.com", "password": "NewPass123!" }
       ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Login Route                                                    │  │
│  │                                                                 │  │
│  │  28. Find user by email                                        │  │
│  │                                                                 │  │
│  │  29. Compare passwords                                         │  │
│  │      bcrypt.compare("NewPass123!", "$2b$10$abc123...")         │  │
│  │      → true ✓                                                  │  │
│  │                                                                 │  │
│  │  30. Return success + session token                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
       │
       │ 31. Login successful!
       ↓
┌──────────────┐
│   USER       │
│  (Dashboard) │
└──────────────┘

✅ PASSWORD RESET COMPLETE!
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Email Enumeration Protection                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Always return success message, even if email doesn't exist │ │
│  │ Prevents attackers from discovering valid accounts         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 2: Token Generation                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ crypto.randomBytes(32) → 256-bit random token              │ │
│  │ Cryptographically secure random number generator           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 3: Token Hashing                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ SHA-256 hash before storing in database                    │ │
│  │ Even if database compromised, tokens are useless           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 4: Token Expiration                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 15-minute automatic expiration                             │ │
│  │ MongoDB TTL index for automatic cleanup                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 5: One-Time Use                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Token deleted after successful password reset              │ │
│  │ Cannot be reused even within expiration time               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 6: Password Hashing                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ bcrypt with 10 salt rounds                                 │ │
│  │ Industry-standard one-way hashing                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 7: IP Logging                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Request IP address logged for security auditing            │ │
│  │ Can track suspicious patterns                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Layer 8: Input Validation                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Email format validation                                    │ │
│  │ Password length validation (min 8 chars)                   │ │
│  │ Token format validation                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│ Backend  │────▶│ Database │────▶│  Email   │
│ Frontend │     │  Server  │     │ MongoDB  │     │  Service │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     ▲                │                 │                 │
     │                │                 │                 │
     │                ▼                 ▼                 ▼
     │           ┌─────────┐      ┌─────────┐      ┌─────────┐
     │           │ Validate│      │  Store  │      │  Send   │
     │           │  Input  │      │  Token  │      │  Email  │
     │           └─────────┘      └─────────┘      └─────────┘
     │                │                 │                 │
     │                ▼                 ▼                 ▼
     │           ┌─────────┐      ┌─────────┐      ┌─────────┐
     │           │Generate │      │  Hash   │      │ Gmail   │
     │           │  Token  │      │  Token  │      │  SMTP   │
     │           └─────────┘      └─────────┘      └─────────┘
     │                                                   │
     └───────────────────────────────────────────────────┘
                    Email with reset link
```

---

## 🗄️ Database Collections

```
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Collections                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AdminAccount Collection                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ _id, accountId, username, email, password (bcrypt),        │ │
│  │ firstName, lastName, role, status, ...                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  TraineeAccount Collection                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ _id, accountId, username, email, password (bcrypt),        │ │
│  │ firstName, lastName, role, status, course, ...             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  PasswordReset Collection (NEW)                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ _id, email, accountType, token (SHA-256), expiresAt,       │ │
│  │ used, requestIp, createdAt, updatedAt                      │ │
│  │                                                             │ │
│  │ Indexes:                                                    │ │
│  │ - { token: 1, expiresAt: 1 }                               │ │
│  │ - { email: 1, accountType: 1 }                             │ │
│  │ - { expiresAt: 1 } (TTL - auto-delete)                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📧 Email Template Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      Email Structure                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║  Header (Orange Gradient)                                 ║  │
│  ║  ┌─────────────────────────────────────────────────────┐  ║  │
│  ║  │  Password Reset Request                             │  ║  │
│  ║  └─────────────────────────────────────────────────────┘  ║  │
│  ╠═══════════════════════════════════════════════════════════╣  │
│  ║  Body (White Background)                                  ║  │
│  ║  ┌─────────────────────────────────────────────────────┐  ║  │
│  ║  │  Hello {{firstName}},                               │  ║  │
│  ║  │                                                      │  ║  │
│  ║  │  We received a request to reset your password...    │  ║  │
│  ║  │                                                      │  ║  │
│  ║  │  ┌──────────────────────────────────────┐           │  ║  │
│  ║  │  │  Reset Password (Orange Button)      │           │  ║  │
│  ║  │  └──────────────────────────────────────┘           │  ║  │
│  ║  │                                                      │  ║  │
│  ║  │  Or copy this link:                                 │  ║  │
│  ║  │  {{resetUrl}}                                       │  ║  │
│  ║  │                                                      │  ║  │
│  ║  │  ┌────────────────────────────────────────────────┐ │  ║  │
│  ║  │  │ ⚠️ Important: Expires in 15 minutes           │ │  ║  │
│  ║  │  └────────────────────────────────────────────────┘ │  ║  │
│  ║  │                                                      │  ║  │
│  ║  │  If you didn't request this, ignore this email.    │  ║  │
│  ║  └─────────────────────────────────────────────────────┘  ║  │
│  ╠═══════════════════════════════════════════════════════════╣  │
│  ║  Footer (Gray Background)                                 ║  │
│  ║  ┌─────────────────────────────────────────────────────┐  ║  │
│  ║  │  © 2026 BETCI. All rights reserved.                │  ║  │
│  ║  │  This is an automated message.                      │  ║  │
│  ║  └─────────────────────────────────────────────────────┘  ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timeline

```
Time: 0 min          User requests password reset
      ↓
Time: 0-5 sec        Token generated, stored, email sent
      ↓
Time: 0-30 sec       User receives email
      ↓
Time: 0-15 min       User clicks link and resets password
      ↓
Time: 15 min         Token expires (if not used)
      ↓
Time: 15+ min        MongoDB auto-deletes expired token
```

---

## 🎯 Success Indicators

```
✅ Server starts with: "✓ Email service configured successfully"
✅ Test script passes all tests
✅ Email arrives within seconds
✅ Reset link works
✅ Password updates successfully
✅ Can login with new password
✅ Token deleted after use
✅ Expired tokens auto-deleted
```

---

**This visual diagram shows the complete flow of the password reset system from start to finish!**
