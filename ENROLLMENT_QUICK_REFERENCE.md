# Enrollment System - Quick Reference Card

## For Trainees

### How to Enroll in a Course

1. **Login** to your trainee account
2. **Navigate** to "Training Courses" in the sidebar
3. **Click** the "Enroll" button on your desired course
4. **Fill out** the enrollment form with your information
5. **Submit** the form
6. **Done!** You'll see a success message

### Form Fields to Prepare

**Required Information:**
- Full Name (First & Last)
- Email Address
- Phone Number
- Complete Address
- Date of Birth
- Gender

**Optional Information:**
- Educational Background
- Emergency Contact Name & Phone

### After Enrollment

- Your button will change to "Continue"
- You can view your enrolled courses
- Track your progress
- Access course materials

---

## For Administrators

### Where to Find Enrollees

**Path:** Admin Dashboard > Records > Enrollment Tab

### What You Can See

- Record ID
- Trainee ID
- Full Name
- Email Address
- Course Enrolled
- Enrollment Date
- Status (In Progress/Completed/Pending)
- Progress Percentage

### View Complete Details

**Click** the "View" (👁) button to see:
- All enrollment information
- Complete personal details
- Emergency contact information
- Course progress and status

### Available Actions

- **View** - See complete enrollee details
- **Export** - Download records as CSV
- **Filter** - Filter by course
- **Search** - Search by name, email, or course

---

## Technical Quick Reference

### API Endpoints

```
POST /api/enrollments
- Creates enrollment
- Auto-creates trainee record

POST /api/records
- Stores enrollee form data

GET /api/records
- Retrieves all enrollment records

GET /api/records/:id
- Gets single record details
```

### Database Collections

**Enrollments** → Tracks enrollment status
**Trainees** → Stores trainee profiles  
**Records** → Stores complete enrollee data

### Key Files

**Frontend:**
- `frontend/trainee/assets/js/courses.js`
- `frontend/trainee/assets/css/dashboard.css`
- `frontend/admin/pages/records.html`

**Backend:**
- `backend/models/Record.js`
- `backend/routes/records.js`
- `backend/routes/enrollments.js`

---

## Troubleshooting Quick Fixes

### Form Not Appearing
→ Check if user is logged in
→ Clear browser cache
→ Check browser console for errors

### Data Not Saving
→ Verify backend server is running
→ Check MongoDB connection
→ Review server logs

### Data Not in Admin Dashboard
→ Refresh the page
→ Check if record was created in database
→ Verify GET /api/records endpoint

### Pre-filled Data Wrong
→ Check user session data
→ Re-login to refresh session
→ Verify user profile is complete

---

## Quick Testing Steps

### Test Enrollment (5 minutes)

1. Login as trainee
2. Go to Training Courses
3. Click "Enroll" on any course
4. Fill form and submit
5. Verify success message

### Test Admin View (3 minutes)

1. Login as admin
2. Go to Records > Enrollment
3. Find the new enrollee
4. Click "View" button
5. Verify all data is correct

---

## Status Indicators

### Enrollment Status
- **In Progress** - Currently enrolled, not completed
- **Completed** - Course finished successfully
- **Pending** - Awaiting approval or action

### Progress Bar
- **0%** - Just enrolled
- **1-99%** - In progress
- **100%** - Completed

---

## Contact & Support

### For Issues
1. Check this quick reference
2. Review detailed documentation
3. Check server logs
4. Contact system administrator

### Documentation Files
- `COMPLETE_ENROLLMENT_SUMMARY.md` - Full overview
- `ENROLLMENT_FORM_IMPLEMENTATION.md` - Technical details
- `ENROLLMENT_FORM_QUICK_GUIDE.md` - Visual guide
- `QUICK_START_ENROLLMENT.md` - Testing guide

---

## Version Information

**Implementation Date:** 2024
**System:** BETCI Training Management System
**Features:** Enrollment Form + Records Management
**Status:** ✅ Production Ready
