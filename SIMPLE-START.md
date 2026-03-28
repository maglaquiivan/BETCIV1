# 🚀 SUPER SIMPLE START GUIDE

## The Easiest Way to Run BETCI

### 🎯 Just Double-Click This File:
```
RUN-APP.bat
```

That's it! The application will:
1. Check if MongoDB is running
2. Start MongoDB (if needed)
3. Start the backend server
4. Open the dashboard in your browser automatically

---

## 🖥️ Alternative: Use PowerShell

Right-click `RUN-APP.ps1` and select "Run with PowerShell"

Or open PowerShell and run:
```powershell
cd BETCIV1-main
.\RUN-APP.ps1
```

---

## 🛑 To Stop Everything

Double-click:
```
STOP-APP.bat
```

Or in PowerShell:
```powershell
.\STOP-APP.ps1
```

---

## ✅ Check if It's Running

Double-click:
```
CHECK-STATUS.bat
```

This will tell you:
- Is MongoDB running?
- Is the backend server running?
- Is the API responding?

---

## 🌐 URLs to Remember

Once running, open these in your browser:

**Admin Dashboard:**
```
http://localhost:5500/frontend/admin/pages/dashboard.html
```

**Admin Login:**
```
http://localhost:5500/frontend/admin/login.html
```
- Email: `admin@betci.com`
- Password: `admin123`

**Trainees Page:**
```
http://localhost:5500/frontend/admin/pages/trainees.html
```

---

## ❌ If MongoDB is Not Installed

You'll see a warning. You have 2 options:

### Option 1: Install MongoDB (Recommended)
1. Download: https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Complete" installation
4. Check "Install MongoDB as a Service"
5. Done! MongoDB will run automatically

### Option 2: Use Cloud MongoDB (No Installation)
1. Sign up: https://www.mongodb.com/cloud/atlas (free)
2. Create a free cluster
3. Get connection string
4. Open `backend\.env` file
5. Replace the MONGODB_URI line with your connection string
6. Run `RUN-APP.bat` again

---

## 🎯 Quick Troubleshooting

### "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org

### "Port 5500 is already in use"
**Solution:** Run `STOP-APP.bat` first, then `RUN-APP.bat`

### "Cannot connect to database"
**Solution:** 
1. Make sure MongoDB is running
2. Check `CHECK-STATUS.bat` to verify
3. If using Atlas, verify your connection string in `backend\.env`

### "No trainees showing"
**Solution:** Seed the database:
```cmd
cd backend
node scripts\seedData.js
```

---

## 📝 Summary

**To Start:** Double-click `RUN-APP.bat`

**To Stop:** Double-click `STOP-APP.bat`

**To Check:** Double-click `CHECK-STATUS.bat`

**That's all you need to know!** 🎉
