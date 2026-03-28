# 🚀 BETCI MongoDB Setup - Step by Step

## What You Need to Do

### Step 1: Make Sure MongoDB is Running

Open a **NEW terminal** and run:
```bash
mongod
```

Keep this terminal open! You should see:
```
[initandlisten] waiting for connections on port 27017
```

If you get an error, MongoDB might already be running as a service. That's fine!

---

### Step 2: Seed the Database (Create Users & Courses)

**Option A: Double-click this file:**
```
seed-database.bat
```

**Option B: Run manually:**
```bash
cd BETCIV1-main\backend
npm install
node scripts\seedData.js
```

You should see:
```
Connected to MongoDB
Cleared existing data
Courses seeded successfully
Users seeded successfully
Database seeded successfully!
```

---

### Step 3: Start the Server

**Option A: Double-click this file:**
```
start-server.bat
```

**Option B: Run manually:**
```bash
cd BETCIV1-main\backend
npm start
```

You should see:
```
Server running at http://localhost:5500
MongoDB URI: mongodb://localhost:27017/betci
MongoDB connected successfully
```

---

### Step 4: Check MongoDB Compass

1. In MongoDB Compass, refresh the connection
2. Look for database named: **`betci`** (lowercase)
3. Inside `betci`, you should see:
   - **users** collection (2 documents)
   - **courses** collection (6 documents)

---

### Step 5: Open the Application

Go to: **http://localhost:5500**

Login with:
- **Admin:** admin@betci.com / admin123
- **Trainee:** trainee@betci.com / trainee123

---

## ❌ Troubleshooting

### "Cannot connect to MongoDB"
- Run `mongod` in a terminal
- Or check if MongoDB service is running: `net start MongoDB`

### "Module not found" error
- Run `npm install` in the backend folder first

### Still no data in MongoDB Compass?
1. Make sure you're looking at the `betci` database (lowercase)
2. Look for `users` and `courses` collections (not `admin_account`)
3. Click the refresh button in MongoDB Compass
4. Run the seed script again: `node scripts\seedData.js`

### Port 5500 already in use?
- Stop the old server.js (the one in root folder)
- Only run the server from backend folder

---

## 📊 What Gets Created

### Users Collection (2 documents)
```json
{
  "userId": "admin001",
  "email": "admin@betci.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

```json
{
  "userId": "trainee001",
  "email": "trainee@betci.com",
  "password": "trainee123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "trainee"
}
```

### Courses Collection (6 documents)
- Forklift Operation NC II (active)
- Bulldozer Operation NC II (active)
- Dump Truck Operation NC II (available)
- Hydraulic Excavator NC II (completed)
- Wheel Loader NC II (available)
- Backhoe Loader NC II (available)

---

## 🎯 Quick Commands

```bash
# Install dependencies
cd BETCIV1-main\backend
npm install

# Seed database
npm run seed

# Start server
npm start

# Start with auto-reload
npm run dev
```
