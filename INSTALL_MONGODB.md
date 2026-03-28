# How to Install MongoDB on Windows

## 🚀 Quick Installation Guide

### Method 1: Download and Install MongoDB

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or higher)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **IMPORTANT**: Check "Install MongoDB as a Service"
   - **IMPORTANT**: Check "Install MongoDB Compass" (GUI tool)
   - Click "Next" and "Install"

3. **Add MongoDB to PATH** (if not automatic)
   - Open "Environment Variables":
     - Press `Win + X` → System → Advanced system settings
     - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add:
     ```
     C:\Program Files\MongoDB\Server\7.0\bin
     ```
   - Click "OK" on all windows

4. **Verify Installation**
   - Open a NEW Command Prompt
   - Run:
     ```cmd
     mongod --version
     ```
   - You should see version information

5. **Create Data Directory**
   ```cmd
   mkdir C:\data\db
   ```

6. **Start MongoDB**
   ```cmd
   mongod
   ```

---

## 🎯 Alternative: Use MongoDB Atlas (Cloud - Free)

If you don't want to install MongoDB locally, use the cloud version:

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a free cluster (M0 - Free tier)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

### Step 3: Update Your Backend
Open `BETCIV1-main/backend/.env` and change:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/BETCI
```
(Replace with your actual connection string)

### Step 4: Start Backend Only
```cmd
cd BETCIV1-main\backend
npm start
```

No need to run `mongod` - it's in the cloud!

---

## 🔧 Quick Fix: Check if MongoDB is Already Running

Sometimes MongoDB is installed but running as a service:

### Check if MongoDB Service is Running:
```cmd
sc query MongoDB
```

### Start MongoDB Service:
```cmd
net start MongoDB
```

### Stop MongoDB Service:
```cmd
net stop MongoDB
```

---

## 📍 Common MongoDB Installation Paths

Try running mongod with full path:

```cmd
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

Or:
```cmd
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

Or:
```cmd
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

---

## ✅ After Installation

Once MongoDB is installed and running, you can:

1. **Start MongoDB** (if not running as service):
   ```cmd
   mongod
   ```

2. **Start Backend**:
   ```cmd
   cd BETCIV1-main\backend
   npm start
   ```

3. **Open Browser**:
   ```
   http://localhost:5500/frontend/admin/pages/trainees.html
   ```

---

## 🆘 Still Having Issues?

### Option 1: Use the Batch File
I've already started MongoDB for you in the background. Just run:
```cmd
cd BETCIV1-main\backend
npm start
```

### Option 2: Check MongoDB Compass
If you installed MongoDB Compass (GUI):
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. You should see your databases

### Option 3: Reinstall MongoDB
1. Uninstall current MongoDB
2. Download fresh installer
3. Make sure to check "Install as Service" during installation

---

## 💡 Pro Tip

If you're just testing and don't want to deal with MongoDB installation:
- Use MongoDB Atlas (cloud version - free)
- No installation needed
- Just update the connection string in `.env`
- Works from anywhere with internet

---

## 🎉 Success Checklist

- [ ] MongoDB installed
- [ ] `mongod --version` works in CMD
- [ ] MongoDB service is running OR mongod command is running
- [ ] Backend server starts without errors
- [ ] Can access http://localhost:5500/api/trainees in browser

---

Need more help? Check the official MongoDB docs:
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
