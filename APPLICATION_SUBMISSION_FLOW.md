# Application Submission & Admin Approval Flow

## Overview
When a trainee submits an application form, it is stored in the database and appears in the Admin Dashboard's Records section for review and approval.

---

## 1. TRAINEE SIDE - Application Submission

### Location
- **File**: `frontend/trainee/pages/assessment/application-form.html`
- **Function**: `submitApplicationForm()`

### What Happens When Trainee Submits
1. Form validation checks required fields:
   - Surname
   - First Name
   - Assessment Title

2. Application data is collected including:
   - Personal information (name, address, contact details)
   - ULI (Unique Learner Identifier) segments
   - Assessment details
   - Work experience records
   - Training/seminars records
   - Licensure exams records
   - Competency assessments records
   - Picture (converted to Base64)
   - Signature (canvas drawing converted to Base64)

3. Data is sent to backend API:
   ```
   POST http://localhost:5500/api/applications
   ```

4. Application status is set to: **"pending"**

5. Data is also saved to localStorage as backup

6. If application is for course enrollment:
   - Enrollment record is created
   - Record is created for admin dashboard
   - User is enrolled in the course

7. Success message: "Application Form submitted successfully!"

---

## 2. BACKEND - Data Storage

### API Endpoint
- **Route**: `backend/routes/applications.js`
- **Database Collection**: `applications`

### Data Stored
```javascript
{
  applicationId: "APP{timestamp}",
  userId: "{trainee account ID}",
  referenceNumber: "...",
  uli: { segment1, segment2, segment3, segment4 },
  schoolName: "...",
  assessmentTitle: "...",
  schoolAddress: "...",
  dateOfApplication: "...",
  assessmentType: "...",
  clientType: { ... },
  profile: { ... },
  workExperience: [ ... ],
  trainingSeminars: [ ... ],
  licensureExams: [ ... ],
  competencyAssessments: [ ... ],
  signature: "...",
  status: "pending"  // Initial status
}
```

---

## 3. ADMIN SIDE - View & Approve Applications

### Location
- **File**: `frontend/admin/pages/records.html`
- **Tab**: "Application" (in the Records section)

### How to Access
1. Admin logs in to dashboard
2. Click on **"Records"** in the sidebar
3. Click on **"Application"** tab
4. View all submitted applications in table format

### Application Records Table Shows
| Column | Description |
|--------|-------------|
| Application ID | Unique ID (e.g., #APP001) |
| Trainee | Name of the trainee who submitted |
| Course | Assessment/Course title |
| Date | Date of submission |
| Status | Current status (Under Review, Approved, Rejected) |
| Actions | View button to see full details |

### Current Status Options
- **Under Review** (yellow badge) - Initial status when submitted
- **Approved** (green badge) - Admin approved the application
- **Rejected** (red badge) - Admin rejected the application

### Admin Actions
1. **View** - Click "View" button to see full application details
2. **Approve** - Change status to "Approved"
3. **Reject** - Change status to "Rejected"
4. **Export** - Export application records to file

---

## 4. ADMISSION SLIP FLOW

### After Application Approval
Once application is approved, trainee can:
1. Go to Assessment page
2. Click "Admission Slip"
3. Fill in admission slip details
4. Submit admission slip

### Admission Slip Data
- Reference number (15 segments)
- Applicant name
- Tel number
- Picture upload
- Assessment applied for
- Receipt number
- Date issued
- Assessment center
- Checklist (requirements, remarks)
- Assessment date & time
- Signatures (processing officer & applicant)

### Admission Slip Status
- Submitted admission slips appear in **"Admission"** tab in Records
- Admin can view and manage admission records

---

## 5. COMPLETE WORKFLOW DIAGRAM

```
TRAINEE SIDE
├── Fill Application Form
├── Upload Picture & Signature
├── Submit Application
│   └── Status: "pending"
│   └── Sent to: /api/applications
│   └── Saved to: localStorage
│
ADMIN SIDE (Records → Application Tab)
├── View All Applications
├── Review Application Details
├── Change Status:
│   ├── Approved ✓
│   ├── Rejected ✗
│   └── Under Review ⏳
│
TRAINEE SIDE (After Approval)
├── Go to Assessment
├── Fill Admission Slip
├── Submit Admission Slip
│   └── Status: "pending"
│   └── Sent to: /api/admissions
│
ADMIN SIDE (Records → Admission Tab)
├── View All Admission Slips
├── Review Admission Details
└── Manage Admission Records
```

---

## 6. KEY FILES INVOLVED

### Frontend (Trainee)
- `frontend/trainee/pages/assessment/application-form.html` - Application form
- `frontend/trainee/pages/assessment/admission-slip.html` - Admission slip

### Frontend (Admin)
- `frontend/admin/pages/records.html` - Records management with tabs
- `frontend/admin/assets/js/admin-dashboard.js` - Admin dashboard logic

### Backend
- `backend/routes/applications.js` - Application API endpoints
- `backend/routes/admissions.js` - Admission API endpoints
- `backend/models/Application.js` - Application data model
- `backend/models/Admission.js` - Admission data model

---

## 7. API ENDPOINTS

### Application Endpoints
```
POST   /api/applications              - Submit new application
GET    /api/applications              - Get all applications
GET    /api/applications/:id          - Get specific application
PUT    /api/applications/:id          - Update application status
DELETE /api/applications/:id          - Delete application
```

### Admission Endpoints
```
POST   /api/admissions                - Submit new admission slip
GET    /api/admissions                - Get all admission slips
GET    /api/admissions/:id            - Get specific admission slip
PUT    /api/admissions/:id            - Update admission slip
DELETE /api/admissions/:id            - Delete admission slip
```

---

## 8. STATUS FLOW

```
Application Submitted
        ↓
    pending (Under Review)
        ↓
    ┌───┴───┐
    ↓       ↓
approved  rejected
    ↓
Trainee can submit Admission Slip
    ↓
Admission Slip Submitted
    ↓
pending (Under Review)
    ↓
    ┌───┴───┐
    ↓       ↓
approved  rejected
```

---

## 9. TESTING THE FLOW

### Step 1: Submit Application
1. Login as trainee
2. Go to Assessment → Application Form
3. Fill all required fields
4. Upload picture and signature
5. Click "Submit"
6. Confirm submission

### Step 2: View in Admin Dashboard
1. Login as admin
2. Go to Records
3. Click "Application" tab
4. See the submitted application with status "Under Review"

### Step 3: Approve Application
1. Click "View" on the application
2. Review details
3. Change status to "Approved"
4. Save changes

### Step 4: Submit Admission Slip
1. Login as trainee
2. Go to Assessment → Admission Slip
3. Fill admission slip details
4. Click "Submit"

### Step 5: View Admission in Admin Dashboard
1. Login as admin
2. Go to Records
3. Click "Admission" tab
4. See the submitted admission slip

---

## 10. TROUBLESHOOTING

### Application Not Appearing in Admin Dashboard
- Check if application was successfully submitted (check browser console)
- Verify backend API is running on port 5500
- Check database connection
- Ensure trainee is logged in with valid account ID

### Status Not Updating
- Refresh the page
- Check if admin has permission to update records
- Verify API endpoint is working

### Picture/Signature Not Saving
- Check if file size is too large
- Verify Base64 conversion is working
- Check database field size limits

---

## Summary

✅ **Trainee submits application** → Appears in Admin Records (Application tab)
✅ **Admin reviews and approves** → Status changes to "Approved"
✅ **Trainee submits admission slip** → Appears in Admin Records (Admission tab)
✅ **Admin manages admission records** → Can approve/reject admission slips
