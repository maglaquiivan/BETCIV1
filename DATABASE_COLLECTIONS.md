# BETCI MongoDB Collections

## ✅ All Collections Created Successfully!

### Database: `BETCI`

---

## 📊 Collections Overview

### 1. **courses** (6 documents)
Training courses offered by BETCI

**API Endpoint:** `/api/courses`

**Sample Data:**
- Forklift Operation NC II (active)
- Bulldozer Operation NC II (active)
- Dump Truck Operation NC II (available)
- Hydraulic Excavator NC II (completed)
- Wheel Loader NC II (available)
- Backhoe Loader NC II (available)

**Fields:**
- courseId, title, description, image
- category, duration, status, traineeCount

---

### 2. **users** (2 documents)
User authentication (admin & trainee login)

**API Endpoint:** `/api/users`

**Sample Data:**
- Admin User (admin@betci.com)
- John Doe - Trainee (trainee@betci.com)

**Fields:**
- userId, email, password, firstName, lastName
- role, phone, address, enrolledCourses

---

### 3. **trainees** (5 documents)
Detailed trainee information and enrollment

**API Endpoint:** `/api/trainees`

**Sample Data:**
- John Doe (Forklift Operation - 65% progress)
- Maria Santos (Bulldozer Operation - 45% progress)
- Carlos Reyes (Hydraulic Excavator - Completed)
- Lisa Garcia (Forklift Operation - 30% progress)
- Miguel Cruz (Bulldozer Operation - 55% progress)

**Fields:**
- traineeId, firstName, lastName, email, phone
- address, dateOfBirth, gender, enrolledCourses
- status, emergencyContact

**Admin Page:** `trainees.html`

---

### 4. **appointments** (4 documents)
Training appointments and assessments

**API Endpoint:** `/api/appointments`

**Sample Data:**
- John Doe - Initial Assessment (Confirmed)
- Maria Santos - Mid-term Evaluation (Pending)
- Carlos Reyes - Final Certification (Completed)
- Lisa Garcia - Safety Training (Confirmed)

**Fields:**
- appointmentId, traineeName, traineeEmail
- courseId, courseName, appointmentDate, appointmentTime
- status, purpose, notes

**Admin Page:** `appointments.html`

---

### 5. **competencies** (3 documents)
Course competencies and learning units

**API Endpoint:** `/api/competencies`

**Sample Data:**
- Operate Forklift Truck (CON311201)
- Operate Bulldozer (CON311202)
- Operate Hydraulic Excavator (CON311203)

**Fields:**
- competencyId, title, code, description
- courseId, courseName, level, units, status

**Admin Page:** `competencies.html`

---

### 6. **accounts** (3 documents)
System user accounts with roles and permissions

**API Endpoint:** `/api/accounts`

**Sample Data:**
- Admin User (admin role)
- Robert Johnson - Instructor (instructor role)
- Sarah Williams - Staff (staff role)

**Fields:**
- accountId, username, email, password
- firstName, lastName, role, status
- lastLogin, permissions

**Admin Page:** `accounts.html`

---

### 7. **records** (3 documents)
Training records and certificates

**API Endpoint:** `/api/records`

**Sample Data:**
- John Doe - Forklift (In Progress - 65%)
- Maria Santos - Bulldozer (In Progress - 45%)
- Carlos Reyes - Excavator (Completed - Passed)

**Fields:**
- userId, courseId, courseName, status
- progress, startDate, completionDate
- grade, certificate

**Admin Page:** `records.html`

---

### 8. **attendances** (4 documents)
Daily attendance tracking

**API Endpoint:** `/api/attendance`

**Sample Data:**
- TRN001 - March 1 (Present)
- TRN001 - March 2 (Present)
- TRN002 - March 1 (Present)
- TRN002 - March 2 (Late)

**Fields:**
- userId, courseId, date, status
- timeIn, timeOut, remarks

---

## 🔑 Login Credentials

### Admin
- Email: `admin@betci.com`
- Password: `admin123`
- URL: http://localhost:5500/admin/login.html

### Trainee
- Email: `trainee@betci.com`
- Password: `trainee123`
- URL: http://localhost:5500/auth/login.html

### Instructor
- Email: `instructor@betci.com`
- Password: `instructor123`

---

## 📋 Admin Dashboard Pages & Collections

| Page | Collection(s) Used | API Endpoint |
|------|-------------------|--------------|
| dashboard.html | courses, users, trainees | /api/courses, /api/users, /api/trainees |
| trainees.html | trainees | /api/trainees |
| accounts.html | accounts | /api/accounts |
| courses.html | courses | /api/courses |
| training-catalog.html | courses, competencies | /api/courses, /api/competencies |
| appointments.html | appointments | /api/appointments |
| competencies.html | competencies | /api/competencies |
| records.html | records | /api/records |
| settings.html | accounts, users | /api/accounts, /api/users |

---

## 🔄 How to Verify Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Click on **BETCI** database
4. You should see 8 collections:
   - accounts (3)
   - appointments (4)
   - attendances (4)
   - competencies (3)
   - courses (6)
   - records (3)
   - trainees (5)
   - users (2)

---

## 🚀 API Testing

Test the APIs using browser or Postman:

```
GET http://localhost:5500/api/courses
GET http://localhost:5500/api/trainees
GET http://localhost:5500/api/appointments
GET http://localhost:5500/api/competencies
GET http://localhost:5500/api/accounts
GET http://localhost:5500/api/records
GET http://localhost:5500/api/attendance/user/TRN001
```

---

## 🔧 Re-seed Database

If you need to reset all data:

```bash
cd BETCIV1-main\backend
node scripts\seedData.js
```

Or double-click: `seed-database.bat`
