# MongoDB Setup Instructions

## Prerequisites
- MongoDB installed and running on your system
- Node.js installed (v14 or higher)

## Setup Steps

### 1. Start MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017/`

**Windows:**
```bash
mongod
```

Or if MongoDB is installed as a service:
```bash
net start MongoDB
```

### 2. Install Backend Dependencies
```bash
cd BETCIV1-main/backend
npm install
```

### 3. Seed the Database
This will populate MongoDB with default courses and users:
```bash
cd BETCIV1-main/backend
npm run seed
```

**Default users created:**
- **Admin:** `admin@betci.com` / `admin123`
- **Trainee:** `trainee@betci.com` / `trainee123`

### 4. Start the Server
```bash
cd BETCIV1-main/backend
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run at `http://localhost:5500`

### 5. Access the Application
- **Landing Page:** http://localhost:5500
- **Admin Login:** http://localhost:5500/admin/login.html
- **Trainee Login:** http://localhost:5500/auth/login.html

## Quick Start (Windows)
Double-click `start-server.bat` in the BETCIV1-main folder

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Users
- `POST /api/users/login` - Login (returns user object)
- `POST /api/users/register` - Register new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Attendance
- `GET /api/attendance/user/:userId` - Get user attendance
- `GET /api/attendance/course/:courseId` - Get course attendance
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance

### Records
- `GET /api/records/user/:userId` - Get user training records
- `GET /api/records/:id` - Get single record
- `POST /api/records` - Create record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

## Features Integrated with MongoDB

### Admin Dashboard
- Loads real-time statistics from MongoDB
- Displays trainees from database
- Shows courses with live data
- Delete/Edit operations update MongoDB

### Trainee Dashboard
- Loads courses from MongoDB API
- Displays course status (active, completed, available)
- Shows progress and enrollment data

### Authentication
- Admin and trainee login validates against MongoDB
- User registration creates new records in database
- Session management with localStorage

## Configuration

Edit `backend/.env` to change settings:
```
PORT=5500
MONGODB_URI=mongodb://localhost:27017/betci
NODE_ENV=development
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check if port 27017 is available
- Verify MongoDB URI in `.env` file

### Server Won't Start
- Make sure port 5500 is not in use
- Run `npm install` in backend folder
- Check Node.js version (should be v14+)

### No Data Showing
- Run the seed script: `npm run seed`
- Check browser console for API errors
- Verify server is running at http://localhost:5500

### CORS Errors
- Server already configured with CORS enabled
- Make sure you're accessing via http://localhost:5500 not file://

## Database Structure

### Collections
- **users** - Admin and trainee accounts
- **courses** - Training courses
- **attendances** - Attendance records
- **records** - Training records and certificates

### Sample Data
The seed script creates:
- 6 courses (Forklift, Bulldozer, Excavator, Dump Truck, Wheel Loader, Backhoe)
- 2 users (1 admin, 1 trainee)

