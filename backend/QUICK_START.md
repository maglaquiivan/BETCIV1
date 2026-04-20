# 🚀 Password Reset - Quick Start

## ✅ Status: Packages Installed, Server Running

The error is **FIXED**! Now just configure email.

---

## 📧 Configure Email (2 Minutes)

### 1. Get Gmail App Password

Visit: https://myaccount.google.com/apppasswords

- Enable 2-Step Verification (if needed)
- Generate App Password for "Mail"
- Copy the 16-character password

### 2. Edit `.env` File

Open `backend/.env` and update:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### 3. Restart Server

```bash
npm start
```

Look for: `✓ Email service configured successfully`

---

## 🧪 Test It

```bash
# Test with script
node test-password-reset.js

# Or test with cURL
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@betci.edu.ph\"}"
```

---

## 📋 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/forgot-password` | POST | Request reset link |
| `/api/reset-password` | POST | Reset password |
| `/api/verify-reset-token/:token` | GET | Verify token |

---

## 📚 Full Documentation

- `FIX_EMAIL_SETUP.md` - Email configuration guide
- `PASSWORD_RESET_COMPLETE.md` - Complete overview
- `PASSWORD_RESET_SYSTEM.md` - Full reference

---

## ✅ What's Working

✅ bcrypt installed  
✅ nodemailer installed  
✅ Server running  
✅ MongoDB connected  
✅ API routes registered  
⚠️ Email needs configuration  

---

**Next:** Configure email in `.env` file!
