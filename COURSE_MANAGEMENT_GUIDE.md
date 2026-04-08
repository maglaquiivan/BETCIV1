# Course Management System Guide

## Overview
The BETCI platform now has a complete course management system that allows administrators to add, edit, and delete courses. All changes are automatically reflected across the entire platform.

## Features

### 1. Add New Courses (Admin)
- Navigate to Admin Dashboard → Courses
- Click the "Add New Course" button
- Fill in the course details:
  - Course Title (required)
  - Course Description (required)
  - Course Image (upload file or provide URL)
- Click "Save Changes"
- The new course is saved to the MongoDB database

### 2. Edit Existing Courses (Admin)
- Navigate to Admin Dashboard → Courses
- Click the "Edit" button on any course card
- Modify the course details
- Click "Save Changes"
- Updates are saved to the database

### 3. Delete Courses (Admin)
- Navigate to Admin Dashboard → Courses
- Click the "Delete" button on any course card
- Confirm the deletion
- Course is removed from the database

### 4. Automatic Display
Once a course is added or modified in the admin panel, it automatically appears in:
- **Landing Page** (index.html) - Public-facing course catalog
- **Trainee Dashboard** - Available courses for enrollment
- **Admin Courses Page** - Full course management interface

## Technical Implementation

### Database Schema
Courses are stored in MongoDB with the following structure:
```javascript
{
  courseId: String (unique identifier),
  title: String (course name),
  description: String (course details),
  image: String (image URL or base64),
  category: String (default: 'Heavy Equipment'),
  duration: String (default: '3 months'),
  status: String (active/completed/available),
  traineeCount: Number (default: 0)
}
```

### API Endpoints
- `GET /api/courses` - Fetch all courses
- `GET /api/courses/:id` - Fetch single course
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Files Modified
1. **Admin Courses Page** (`frontend/admin/pages/courses.html`)
   - Added "Add New Course" button
   - Added `openAddCourseModal()` function
   - Updated `saveCourseChanges()` to handle both create and update
   - Added `deleteCourse()` function

2. **Landing Page** (`frontend/public/index.html`)
   - Updated `loadCoursesFromStorage()` to dynamically generate course cards
   - Removed hardcoded courses
   - Added dynamic course count update

3. **Trainee Dashboard** (`frontend/trainee/pages/dashboard.html`)
   - Already fetches courses from API
   - Displays courses dynamically

4. **API Service** (`frontend/js/api.js`)
   - Already includes all CRUD operations for courses

## How to Use

### For Administrators

#### Adding a New Course:
1. Log in to the admin panel
2. Go to "Courses" section
3. Click "Add New Course"
4. Enter course details:
   - Title: e.g., "Crane Operation NC II"
   - Description: Brief overview of the course
   - Image: Upload an image or provide a URL
5. Click "Save Changes"
6. The course will appear immediately on all pages

#### Editing a Course:
1. Find the course you want to edit
2. Click the "Edit" button
3. Modify the details
4. Click "Save Changes"

#### Deleting a Course:
1. Find the course you want to delete
2. Click the "Delete" button
3. Confirm the deletion
4. The course will be removed from all pages

### For Trainees
- View all available courses on the landing page
- See courses in the trainee dashboard
- Enroll in courses directly from the course cards

## Initial Setup

### Seeding Default Courses
To populate the database with default courses:
```bash
cd backend
node scripts/seedData.js
```

This will create 6 default courses:
1. Forklift Operation NC II
2. Bulldozer Operation NC II
3. Dump Truck Operation NC II
4. Hydraulic Excavator NC II
5. Wheel Loader NC II
6. Backhoe Loader NC II

### Starting the Server
```bash
cd backend
npm start
```

The server runs on `http://localhost:5500`

## Image Handling
- Images can be uploaded as files (converted to base64)
- Or provided as URLs (relative or absolute paths)
- Supported formats: JPG, PNG, GIF
- Maximum file size: 5MB

## Notes
- All course changes are saved to MongoDB
- Changes are reflected immediately across all pages
- The landing page auto-refreshes courses every 10 seconds
- Course IDs are automatically generated from the title (lowercase, hyphenated)

## Troubleshooting

### Courses not appearing?
1. Check if the backend server is running
2. Verify MongoDB connection
3. Check browser console for errors
4. Ensure API endpoint is correct (`http://localhost:5500/api/courses`)

### Images not loading?
1. Verify image path is correct
2. Check if image file exists in the specified location
3. Try using absolute paths (e.g., `/assets/img/course.png`)
4. Ensure image file size is under 5MB

### Cannot add/edit courses?
1. Verify you're logged in as admin
2. Check network tab for API errors
3. Ensure all required fields are filled
4. Check MongoDB connection

## Future Enhancements
- Bulk course import/export
- Course categories and filtering
- Course prerequisites
- Enrollment limits
- Course scheduling
- Instructor assignment
