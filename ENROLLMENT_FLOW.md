# Enrollment Flow Documentation

## Overview
When a trainee clicks "Enroll" on a course in the trainee dashboard, the system automatically creates/updates records in both the Enrollments and Trainees collections, making the data visible in the admin dashboard.

## Flow Diagram

```
Trainee Dashboard (courses.html)
         |
         | Click "Enroll" button
         v
enrollInCourse() function (courses.js)
         |
         | POST /api/enrollments
         v
Backend Enrollment Route (enrollments.js)
         |
         |-- Creates Enrollment record
         |
         |-- Fetches User data
         |
         |-- Creates/Updates Trainee record
         |       |
         |       |-- If trainee exists: Add course to enrolledCourses
         |       |-- If new trainee: Create new trainee with course
         |
         v
Admin Dashboard (trainees.html)
         |
         | Fetches from /api/trainees
         v
Displays enrolled trainees with their courses
```

## Implementation Details

### 1. Frontend (Trainee Side)
**File:** `frontend/trainee/assets/js/courses.js`

The `enrollInCourse()` function:
- Validates user is logged in
- Sends POST request to `/api/enrollments` with:
  - `userId`: Current logged-in user ID
  - `courseId`: Selected course ID
  - `courseName`: Course name/title

### 2. Backend (Enrollment Route)
**File:** `backend/routes/enrollments.js`

The POST `/api/enrollments` endpoint:
1. Checks if user is already enrolled (prevents duplicates)
2. Creates enrollment record with:
   - Unique enrollment ID
   - User ID and course ID
   - Status: 'active'
   - Progress: 0%
   - Enrollment date

3. Fetches user information from Users collection
4. Creates or updates trainee record:
   - **If trainee exists:** Adds new course to `enrolledCourses` array
   - **If new trainee:** Creates new trainee with:
     - Auto-generated trainee ID
     - User's personal information (name, email, phone, address)
     - Course enrollment details
     - Status: 'active'

### 3. Admin Dashboard
**File:** `frontend/admin/pages/trainees.html`
**Script:** `frontend/admin/assets/js/trainees-page.js`

The admin dashboard:
- Fetches all trainees from `/api/trainees`
- Displays trainee cards with:
  - Name and avatar
  - Enrolled courses
  - Contact information
  - Enrollment date
  - Status
- Provides CRUD operations for trainee management

## Database Collections

### Enrollments Collection
```javascript
{
  enrollmentId: "ENR1234567890",
  userId: "USR1234567890",
  courseId: "COURSE123",
  courseName: "Forklift Operation",
  status: "active",
  progress: 0,
  enrollmentDate: Date,
  completionDate: Date (optional),
  lastAccessedDate: Date
}
```

### Trainees Collection
```javascript
{
  traineeId: "TRN1234567890",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St",
  status: "active",
  enrolledCourses: [
    {
      courseId: "COURSE123",
      courseName: "Forklift Operation",
      enrollmentDate: Date,
      status: "active",
      progress: 0
    }
  ]
}
```

## Synchronization

The system maintains synchronization between Enrollments and Trainees:

1. **On Enrollment:** Creates/updates both collections
2. **On Progress Update:** Updates both enrollment and trainee progress
3. **On Status Change:** Updates both enrollment and trainee status

This ensures data consistency across the system.

## Testing the Flow

1. **Login as Trainee:**
   - Navigate to trainee dashboard
   - Go to "Training Courses" section

2. **Enroll in Course:**
   - Click "Enroll" button on any available course
   - Verify success message appears

3. **Check Admin Dashboard:**
   - Login as admin
   - Navigate to "Trainees" page
   - Verify the enrolled trainee appears with course information

4. **Verify Data:**
   - Check trainee card shows correct name, email, and course
   - Verify enrollment date is displayed
   - Confirm status is "Active"

## API Endpoints

### Enrollment Endpoints
- `POST /api/enrollments` - Create new enrollment (also creates/updates trainee)
- `GET /api/enrollments/user/:userId` - Get user's enrollments
- `PUT /api/enrollments/:enrollmentId/progress` - Update progress
- `PUT /api/enrollments/:enrollmentId/status` - Update status

### Trainee Endpoints
- `GET /api/trainees` - Get all trainees
- `GET /api/trainees/:traineeId` - Get single trainee
- `POST /api/trainees` - Create trainee (manual)
- `PUT /api/trainees/:traineeId` - Update trainee
- `DELETE /api/trainees/:traineeId` - Delete trainee

## Notes

- Trainees are automatically created from user data on first enrollment
- Multiple course enrollments are supported (added to enrolledCourses array)
- Duplicate enrollments are prevented
- All timestamps are automatically managed
- Status changes propagate to both collections
