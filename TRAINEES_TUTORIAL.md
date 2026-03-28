# BETCI Trainees Management Tutorial

## 🎯 Overview
This tutorial will guide you through viewing, adding, editing, and deleting trainees in the BETCI system.

---

## 📋 Prerequisites

Before starting, ensure:
1. ✅ MongoDB is installed and running
2. ✅ Node.js is installed
3. ✅ Backend server is running on port 5500

---

## 🚀 Quick Start Guide

### Step 1: Start MongoDB
Open a terminal and run:
```bash
mongod
```
Or if you have a custom data directory:
```bash
mongod --dbpath data/db
```

### Step 2: Start the Backend Server
Open another terminal, navigate to the backend folder, and run:
```bash
cd BETCIV1-main/backend
npm start
```

You should see:
```
✓ Server running at http://localhost:5500
✓ MongoDB connected successfully
```

### Step 3: Seed the Database (First Time Only)
If you don't have any data, run:
```bash
cd BETCIV1-main/backend
node scripts/seedData.js
```

This creates sample users and courses.

---

## 🌐 Accessing the Trainees Page

### Option 1: Direct URL
Open your browser and go to:
```
http://localhost:5500/frontend/admin/pages/trainees.html
```

### Option 2: Through Admin Dashboard
1. Go to: `http://localhost:5500/frontend/admin/login.html`
2. Login with:
   - Email: `admin@betci.com`
   - Password: `admin123`
3. Click on "Trainees" in the sidebar

---

## 👥 Managing Trainees

### ✅ View All Trainees
- When you open the trainees page, all trainees are automatically loaded from the database
- Each trainee card shows:
  - Name and initials
  - Enrolled course
  - Email address
  - Phone number
  - Location
  - Enrollment date
  - Status (Active/Inactive/Graduated)

### ➕ Add a New Trainee

1. Click the "View All" button (top right) or "Add Now" button
2. Fill in the form:
   - **Full Name**: First and last name (e.g., "John Doe")
   - **Email**: Valid email address
   - **Phone**: Contact number
   - **Location**: Address or city
   - **Role/Position**: Course name (e.g., "Forklift Operation")
   - **Enrolled Date**: Select date from calendar
   - **Status**: Choose Active, Inactive, or Graduated
3. Click "Save Trainee"
4. The new trainee will appear in the grid

### ✏️ Edit an Existing Trainee

1. Find the trainee card you want to edit
2. Click the "Edit" button (pencil icon)
3. The form will open with current data pre-filled
4. Modify any fields you want to change
5. Click "Save Trainee"
6. The trainee card will update automatically

### 🗑️ Delete a Trainee

1. Find the trainee card you want to delete
2. Click the "Delete" button (trash icon)
3. A confirmation modal will appear
4. Type the trainee's full name exactly as shown
5. Click "Delete Trainee"
6. The trainee will be removed from the database

---

## 🔍 Search Functionality

Use the search bar at the top to filter trainees:
- Search by name
- Search by email
- Search by course
- Search by any visible text

The results update in real-time as you type.

---

## 🛠️ Troubleshooting

### Problem: Trainees Not Showing

**Solution 1: Check if MongoDB is running**
```bash
# Windows
tasklist | findstr mongod

# If not running, start it:
mongod
```

**Solution 2: Check if backend server is running**
```bash
# Navigate to backend folder
cd BETCIV1-main/backend
npm start
```

**Solution 3: Check browser console**
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for errors like:
   - "Failed to fetch" → Server not running
   - "CORS error" → Server configuration issue
   - "404 Not Found" → Wrong API endpoint

**Solution 4: Verify API is working**
Open in browser:
```
http://localhost:5500/api/trainees
```
You should see JSON data with trainees.

### Problem: "Failed to load trainees" Error

**Check:**
1. MongoDB is running: `mongod`
2. Backend server is running: `npm start` in backend folder
3. Port 5500 is not blocked by firewall
4. Database has data (run seed script if needed)

### Problem: Edit/Delete Buttons Not Working

**Solution:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh the page (Ctrl + F5)
3. Check console for JavaScript errors (F12)

---

## 📊 Database Structure

Trainees are stored in MongoDB with this structure:

```javascript
{
  traineeId: "TRN1234567890",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "09123456789",
  address: "Manila, Philippines",
  status: "active",
  enrolledCourses: [
    {
      courseId: "COURSE123",
      courseName: "Forklift Operation NC II",
      enrollmentDate: "2024-01-15",
      status: "active",
      progress: 0
    }
  ]
}
```

---

## 🔐 API Endpoints

The trainees page uses these API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trainees` | Get all trainees |
| GET | `/api/trainees/:id` | Get single trainee |
| POST | `/api/trainees` | Create new trainee |
| PUT | `/api/trainees/:id` | Update trainee |
| DELETE | `/api/trainees/:id` | Delete trainee |

---

## 💡 Tips & Best Practices

1. **Always verify data before deleting** - Deletion is permanent!
2. **Use meaningful course names** - Makes it easier to track trainees
3. **Keep email addresses unique** - Prevents confusion
4. **Update status regularly** - Mark trainees as graduated when they complete
5. **Use search feature** - Faster than scrolling through all trainees

---

## 🎨 Status Colors

- **Green (Active)**: Currently enrolled and attending
- **Yellow (Inactive)**: Temporarily not attending
- **Blue (Graduated)**: Completed the course

---

## 📝 Common Tasks

### Task 1: Enroll a New Student
1. Click "View All" button
2. Fill in all required fields
3. Set status to "Active"
4. Click "Save Trainee"

### Task 2: Mark Student as Graduated
1. Click "Edit" on the trainee card
2. Change status to "Graduated"
3. Click "Save Trainee"

### Task 3: Update Contact Information
1. Click "Edit" on the trainee card
2. Update email, phone, or location
3. Click "Save Trainee"

### Task 4: Find a Specific Trainee
1. Use the search bar at the top
2. Type name, email, or course
3. Results filter automatically

---

## 🆘 Need Help?

If you encounter issues:

1. **Check the console logs** (F12 → Console tab)
2. **Verify server is running** (check terminal)
3. **Test API directly** (visit http://localhost:5500/api/trainees)
4. **Restart everything**:
   ```bash
   # Stop MongoDB and server (Ctrl+C)
   # Then restart:
   mongod
   cd backend && npm start
   ```

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5500
- [ ] Can access trainees page in browser
- [ ] Trainees are loading from database
- [ ] Can add new trainees
- [ ] Can edit existing trainees
- [ ] Can delete trainees
- [ ] Search functionality works

---

## 🎉 You're All Set!

You now know how to manage trainees in the BETCI system. Happy training! 🚀
