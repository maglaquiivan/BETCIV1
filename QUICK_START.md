# BETCI - Quick Start Guide

## 🚀 Start the Application

### Option 1: Using Batch File (Windows)
1. Double-click `start-server.bat`
2. Wait for "MongoDB connected successfully"
3. Open browser to http://localhost:5500

### Option 2: Manual Start
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Server
cd BETCIV1-main/backend
npm install
npm run seed
npm start
```

## 🔑 Login Credentials

### Admin Account
- Email: `admin@betci.com`
- Password: `admin123`
- URL: http://localhost:5500/admin/login.html

### Trainee Account
- Email: `trainee@betci.com`
- Password: `trainee123`
- URL: http://localhost:5500/auth/login.html

## 📊 What's Connected to MongoDB

✅ **Admin Dashboard**
- Real-time course statistics
- Trainee management (view, edit, delete)
- Course management (view, edit, delete)
- User authentication

✅ **Trainee Dashboard**
- Course catalog from database
- Enrollment tracking
- Progress monitoring

✅ **Authentication**
- Login validation against MongoDB
- User registration creates DB records
- Role-based access control

## 🔧 Common Commands

```bash
# Seed database with sample data
cd BETCIV1-main/backend
npm run seed

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Check MongoDB status (Windows)
net start MongoDB
```

## 📁 Project Structure

```
BETCIV1-main/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # RESTful API endpoints
│   ├── scripts/         # Database seeding
│   ├── server.js        # Express server
│   └── .env             # Configuration
├── frontend/
│   ├── admin/           # Admin dashboard
│   ├── trainee/         # Trainee dashboard
│   ├── auth/            # Login pages
│   └── js/api.js        # API client
└── MONGODB_SETUP.md     # Detailed setup guide
```

## 🌐 API Base URL

All API calls go to: `http://localhost:5500/api`

## ❓ Troubleshooting

**Can't connect to MongoDB?**
- Run `mongod` in a terminal
- Or start MongoDB service: `net start MongoDB`

**Port 5500 already in use?**
- Change PORT in `backend/.env`
- Update API_BASE_URL in frontend files

**No data showing?**
- Run `npm run seed` to populate database
- Check browser console for errors
- Verify server is running

## 📖 Full Documentation

See `MONGODB_SETUP.md` for complete setup instructions and API documentation.
