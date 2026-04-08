# ⚠️ CRITICAL: How to Run Your Application

## THE PROBLEM
You are using **Live Server (port 5501)** which DOES NOT WORK with this project!

## THE SOLUTION
Use your **Node.js Backend (port 5500)** instead!

---

## Step-by-Step Instructions

### 1. Stop Live Server
- Close any Live Server instances
- Make sure nothing is running on port 5501

### 2. Start Node.js Backend
Open a terminal and run:
```cmd
cd BETCIV1-main\backend
node server.js
```

You should see:
```
✓ MongoDB Connected
✓ Server running on port 5500
✓ API Endpoints available
```

### 3. Access Your Pages
Open your browser and go to:

**Landing Page:**
```
http://localhost:5500/public/index.html
```

**Admin Dashboard:**
```
http://localhost:5500/admin/pages/dashboard.html
```

**Trainee Dashboard:**
```
http://localhost:5500/trainee/pages/dashboard.html
```

**Assessment Forms:**
```
http://localhost:5500/trainee/pages/assessment/registration-form.html
http://localhost:5500/trainee/pages/assessment/application-form.html
http://localhost:5500/trainee/pages/assessment/admission-slip.html
```

---

## Why Live Server Doesn't Work

Live Server serves files from a different root directory and doesn't understand your project structure:

❌ Live Server (port 5501):
- Doesn't serve from the correct root
- Can't find `/assets/img/` files
- Can't find `/trainee/assets/` files
- Returns 404 for everything

✅ Node.js Backend (port 5500):
- Serves from `frontend/` directory
- All paths work correctly
- Images load properly
- CSS and JS files load correctly

---

## Quick Test

After starting the Node.js backend, test these URLs:

1. http://localhost:5500/assets/img/logo.png (should show the logo)
2. http://localhost:5500/trainee/assets/css/dashboard.css (should show CSS)
3. http://localhost:5500/trainee/assets/js/common.js (should show JavaScript)

If all three work, your server is running correctly!

---

## Troubleshooting

**Problem:** "Cannot GET /"
**Solution:** Make sure you're accessing the full path, not just `http://localhost:5500/`

**Problem:** "EADDRINUSE: Port 5500 already in use"
**Solution:** Another instance is running. Close it first.

**Problem:** "MongoDB connection error"
**Solution:** Make sure MongoDB is running or check your `.env` file

---

## Remember
🚫 NEVER use Live Server (port 5501)
✅ ALWAYS use Node.js Backend (port 5500)
