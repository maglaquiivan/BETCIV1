# Database Collections Summary

## Overview
The BETCI system now has comprehensive database collections for managing all aspects of the training and assessment process.

## Collections List

### 1. **Accounts Collection**
- **Purpose**: User authentication and profile management
- **Key Fields**: accountId, username, email, password, firstName, lastName, role, profilePicture, status
- **API Endpoint**: `/api/accounts`

### 2. **Trainees Collection**
- **Purpose**: Trainee information and enrollment tracking
- **Key Fields**: traineeId, firstName, lastName, email, phone, address, enrolledCourses, status
- **API Endpoint**: `/api/trainees`
- **Note**: Automatically created when users register

### 3. **Courses Collection**
- **Purpose**: Training course catalog
- **Key Fields**: courseId, title, description, duration, category, status, image
- **API Endpoint**: `/api/courses`

### 4. **Records Collection**
- **Purpose**: Enrollment and progress tracking
- **Key Fields**: userId, courseId, courseName, status, progress, startDate
- **API Endpoint**: `/api/records`

### 5. **Applications Collection** ✨ NEW
- **Purpose**: TESDA Competency Assessment Applications
- **Key Fields**:
  - applicationId, userId, referenceNumber
  - ULI (4 segments)
  - School and assessment information
  - Client type (TVET, Industry Worker, K-12, OWF)
  - Complete profile (name, address, parents, contact)
  - Work experience (dynamic array)
  - Training/seminars (dynamic array)
  - Licensure exams (dynamic array)
  - Competency assessments (dynamic array)
  - Picture and signature (base64)
  - Status: pending/approved/rejected
- **API Endpoint**: `/api/applications`
- **Created**: Automatically when trainee submits Application Form

### 6. **Admissions Collection** ✨ NEW
- **Purpose**: Assessment admission slips and scheduling
- **Key Fields**:
  - admissionId, userId, applicationId
  - Applicant name, tel number, picture
  - Assessment details (title, receipt number, date issued)
  - Assessment center
  - Requirements checklist (self-assessment guide, passport pictures)
  - Remarks (PPE, others)
  - Assessment schedule (date, time)
  - Status: pending/confirmed/completed/cancelled
- **API Endpoint**: `/api/admissions`
- **Created**: Automatically when trainee submits Admission Slip

### 7. **Appointments Collection**
- **Purpose**: Scheduling and appointment management
- **Key Fields**: appointmentId, userId, date, time, type, status
- **API Endpoint**: `/api/appointments`

### 8. **Attendance Collection**
- **Purpose**: Training attendance tracking
- **Key Fields**: attendanceId, userId, courseId, date, status
- **API Endpoint**: `/api/attendance`

### 9. **Competencies Collection**
- **Purpose**: Competency standards and qualifications
- **Key Fields**: competencyId, title, level, sector, description
- **API Endpoint**: `/api/competencies`

### 10. **Users Collection**
- **Purpose**: Legacy user management (being phased out in favor of Accounts)
- **API Endpoint**: `/api/users`

## Data Flow

### Registration Flow
1. User registers → Creates **Account** record
2. System automatically creates **Trainee** record
3. If course selected → Creates **Record** (enrollment)

### Assessment Flow
1. Trainee clicks "Enroll" → Toast notification → Redirects to Assessment page
2. Fills Application Form → Submits → Creates **Application** record
3. Fills Admission Slip → Submits → Creates **Admission** record
4. Admin reviews applications and admissions
5. Assessment scheduled and completed

## API Routes Summary

| Collection | GET All | GET One | POST | PUT | DELETE |
|------------|---------|---------|------|-----|--------|
| Accounts | ✓ | ✓ | ✓ | ✓ | ✓ |
| Trainees | ✓ | ✓ | ✓ | ✓ | ✓ |
| Courses | ✓ | ✓ | ✓ | ✓ | ✓ |
| Records | ✓ | ✓ | ✓ | ✓ | ✓ |
| Applications | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admissions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Appointments | ✓ | ✓ | ✓ | ✓ | ✓ |
| Attendance | ✓ | ✓ | ✓ | ✓ | ✓ |
| Competencies | ✓ | ✓ | ✓ | ✓ | ✓ |

## Additional Features

### User-Specific Queries
- `/api/applications/user/:userId` - Get all applications for a user
- `/api/admissions/user/:userId` - Get all admissions for a user

### Image Storage
- Profile pictures stored as base64 in Accounts collection
- Application pictures stored as base64 in Applications collection
- Admission pictures stored as base64 in Admissions collection
- Signatures stored as base64 in Applications collection

## Database Connection
- **MongoDB URI**: `mongodb://localhost:27017/BETCI`
- **Server Port**: 5500
- **Base API URL**: `http://localhost:5500/api`

## Status Values

### Application Status
- `pending` - Submitted, awaiting review
- `approved` - Approved by admin
- `rejected` - Rejected by admin

### Admission Status
- `pending` - Submitted, awaiting confirmation
- `confirmed` - Schedule confirmed
- `completed` - Assessment completed
- `cancelled` - Cancelled

### Trainee Status
- `active` - Currently enrolled
- `inactive` - Not currently enrolled
- `graduated` - Completed training

## Notes
- All collections use timestamps (createdAt, updatedAt)
- All IDs are unique strings with prefixes (APP, ADM, TRN, etc.)
- Base64 images have 50MB limit in server configuration
- All routes support CORS for frontend access
