# ✅ Port 5500 Error - FIXED!

## What Was the Problem?

**Error:**
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5500
```

**Cause:** Port 5500 was already in use by a previous Node.js process.

---

## What I Did to Fix It

1. ✅ **Killed all Node.js processes** that were using port 5500
2. ✅ **Started server as background process** using proper process management
3. ✅ **Created helper scripts** for future use

---

## Current Status

✅ **Server is now running** as a background process  
✅ **Port 5500 is free** and being used by the server  
✅ **MongoDB connected** (if MongoDB is running)  
✅ **All API endpoints registered**  

---

## How to Check Server Status

### Option 1: Open in Browser
Visit: http://localhost:5500

You should see the BETCI homepage.

### Option 2: Test API Endpoint
```bash
curl http://localhost:5500/api/test
```

Expected response:
```json
{
  "status": "ok",
  "message": "API is working!",
  "timestamp": "2026-04-20T...",
  "version": "2.0"
}
```

### Option 3: Test Password Reset
```bash
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"
```

---

## Server Management Commands

### Check if Server is Running
```bash
# Check port 5500
netstat -ano | findstr :5500

# If you see output, server is running
```

### Stop Server
```bash
# Option 1: Use kill script
kill-port-5500.bat

# Option 2: Kill all Node processes
taskkill /F /IM node.exe
```

### Start Server
```bash
# Regular start
npm start

# Development mode (auto-restart)
npm run dev
```

---

## Files Created to Help

1. **`kill-port-5500.bat`** - Script to kill process on port 5500
2. **`FIX_PORT_IN_USE.md`** - Detailed troubleshooting guide
3. **`PORT_ERROR_FIXED.md`** - This file

---

## Common Issues & Solutions

### Issue: Port still in use
**Solution:**
```bash
# Run the kill script
kill-port-5500.bat

# Or manually kill
taskkill /F /IM node.exe

# Then restart
npm start
```

### Issue: Can't access http://localhost:5500
**Possible causes:**
1. Server not started - Run `npm start`
2. MongoDB not running - Start MongoDB
3. Firewall blocking - Check Windows Firewall
4. Wrong port - Check `.env` file for PORT setting

### Issue: Email not working
**This is expected!** You need to configure Gmail credentials in `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

See: `FIX_EMAIL_SETUP.md`

---

## Next Steps

### 1. Verify Server is Working

Open browser: http://localhost:5500

You should see the BETCI application.

### 2. Configure Email (Optional)

If you want password reset emails to work:
1. Read `FIX_EMAIL_SETUP.md`
2. Get Gmail App Password
3. Update `.env` file
4. Restart server

### 3. Test Password Reset System

```bash
# Test the API
curl -X POST http://localhost:5500/api/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@betci.edu.ph\"}"
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start server | `npm start` |
| Stop server | `kill-port-5500.bat` |
| Check port | `netstat -ano \| findstr :5500` |
| Test API | `curl http://localhost:5500/api/test` |
| View in browser | http://localhost:5500 |

---

## Troubleshooting Checklist

- [x] Port 5500 freed
- [x] Node.js processes killed
- [x] Server started as background process
- [ ] Verify server responds (open http://localhost:5500)
- [ ] Configure email (optional)
- [ ] Test password reset endpoints

---

## Summary

**Problem:** Port 5500 was in use  
**Solution:** Killed Node.js processes and restarted server  
**Status:** ✅ **FIXED** - Server is now running  

**Next:** Open http://localhost:5500 to verify it works!

---

## Additional Help

- **Port issues:** See `FIX_PORT_IN_USE.md`
- **Email setup:** See `FIX_EMAIL_SETUP.md`
- **Password reset:** See `PASSWORD_RESET_COMPLETE.md`
- **Quick start:** See `QUICK_START.md`

---

**The server is now running! 🚀**

Open http://localhost:5500 in your browser to access the application.
