# 🚀 How to Run BETCI Application

## ✅ What's Already Running

Good news! I've already started these for you:
- ✅ MongoDB (running in background)
- ✅ Backend Server (running on port 5500)

---

## 🌐 Open the Application

Just open your browser and go to:

### Admin Dashboard:
```
http://localhost:5500/frontend/admin/pages/dashboard.html
```

### Admin Login Page:
```
http://localhost:5500/frontend/admin/login.html
```
**Login credentials:**
- Email: `admin@betci.com`
- Password: `admin123`

---

## 🔄 If You Need to Restart Later

### Option 1: Use the Batch File (Easiest)
Double-click `START_HERE.bat` in the BETCIV1-main folder

### Option 2: Manual Commands

**Step 1: Start MongoDB**
Open Command Prompt or PowerShell:
```cmd
mongod
```
Keep this window open.

**Step 2: Start Backend Server**
Open a NEW Command Prompt or PowerShell:
```cmd
cd BETCIV1-main\backend
npm start
```
Keep this window open too.

**Step 3: Open Browser**
```
http://localhost:5500/frontend/admin/pages/dashboard.html
```

---

## 📊 What You'll See on Dashboard

The dashboard now loads REAL data from MongoDB:

### Stats Cards (Top)
- Active Courses count
- Total Trainees count  
- Today's Enrollments

### Trainees Section
- Shows first 3 trainees from database
- Click "Add Trainee" button to go to trainees page
- Edit button redirects to trainees page
- Delete button removes trainee from database

### Courses Section
- Shows first 3 courses from database
- Click "Add Trainee" button to go to training catalog
- Edit/Delete buttons work with real database

---

## 🛠️ Troubleshooting

### Problem: "mongod is not recognized"

**Solution:** MongoDB is not installed. You have 2 options:

**Option A: Install MongoDB Locally**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer, choose "Complete" installation
3. Check "Install MongoDB as a Service"
4. After install, MongoDB runs automatically (no need to run `mongod`)

**Option B: Use MongoDB Atlas (Cloud - Free)**
1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `BETCIV1-main/backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/BETCI
   ```
5. Just run: `cd BETCIV1-main\backend` then `npm start`

### Problem: Backend Won't Start

**Check:**
1. MongoDB is running (or using Atlas)
2. Port 5500 is not in use
3. Run `npm install` in backend folder first

### Problem: No Data Showing

**Solution:** Seed the database
```cmd
cd BETCIV1-main\backend
node scripts\seedData.js
```

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Start MongoDB | `mongod` |
| Start Backend | `cd BETCIV1-main\backend` then `npm start` |
| Seed Database | `cd BETCIV1-main\backend` then `node scripts\seedData.js` |
| Open Dashboard | http://localhost:5500/frontend/admin/pages/dashboard.html |
| Stop Server | Press `Ctrl + C` in terminal |

---

## ✨ What's Fixed

1. ✅ Dashboard now fetches real trainees from `/api/trainees`
2. ✅ Dashboard now fetches real courses from `/api/courses`
3. ✅ Stats cards show actual counts from database
4. ✅ "Add Trainee" buttons redirect to proper pages
5. ✅ Edit/Delete buttons work with database
6. ✅ No more static dummy data

---

## 🎉 You're Ready!

Everything is running and connected to the database. Just open the browser and start managing trainees!
