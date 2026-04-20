# Application Flow - Technical Reference

## File Structure & Code References

---

## 1. TRAINEE APPLICATION SUBMISSION

### File Location
```
BETCIV1-main/frontend/trainee/pages/assessment/application-form.html
```

### Submit Function
```javascript
// Line ~2023
async function submitApplicationForm() {
    // Validates required fields
    // Collects all form data
    // Converts picture to Base64
    // Converts signature canvas to Base64
    // Sends to: POST http://localhost:5500/api/applications
    // Status set to: "pending"
}
```

### Data Structure Sent
```javascript
{
  applicationId: "APP{timestamp}",
  userId: "{trainee account ID}",
  referenceNumber: "...",
  uli: {
    segment1: "...",
    segment2: "...",
    segment3: "...",
    segment4: "..."
  },
  schoolName: "...",
  assessmentTitle: "...",
  schoolAddress: "...",
  dateOfApplication: "...",
  assessmentType: "...",
  clientType: {
    tvetGraduatingStudent: boolean,
    tvetGraduate: boolean,
    industryWorker: boolean,
    k12: boolean,
    owf: boolean
  },
  profile: {
    surname: "...",
    firstName: "...",
    secondName: "...",
    middleName: "...",
    middleInitial: "...",
    nameExtension: "...",
    picture: "data:image/...",  // Base64
    numberStreet: "...",
    barangay: "...",
    district: "...",
    city: "...",
    province: "...",
    region: "...",
    zip: "...",
    mothersName: "...",
    fathersName: "...",
    sex: "...",
    civilStatus: "...",
    tel: "...",
    mobile: "...",
    email: "...",
    fax: "...",
    others: "...",
    highestEducationalAttainment: "...",
    employmentStatus: "...",
    birthDate: "...",
    birthPlace: "...",
    age: "..."
  },
  workExperience: [
    {
      companyName: "...",
      position: "...",
      inclusiveDates: "...",
      monthlySalary: "...",
      statusOfAppointment: "...",
      yearsOfExperience: "..."
    }
  ],
  trainingSeminars: [
    {
      title: "...",
      venue: "...",
      inclusiveDates: "...",
      numberOfHours: "...",
      conductedBy: "..."
    }
  ],
  licensureExams: [
    {
      title: "...",
      yearTaken: "...",
      examinationVenue: "...",
      rating: "...",
      remarks: "...",
      expiryDate: "..."
    }
  ],
  competencyAssessments: [
    {
      title: "...",
      qualificationLevel: "...",
      industrySector: "...",
      certificateNumber: "...",
      dateOfIssuance: "...",
      expirationDate: "..."
    }
  ],
  signature: "data:image/...",  // Canvas Base64
  status: "pending"
}
```

### API Endpoint Called
```
POST http://localhost:5500/api/applications
Content-Type: application/json
```

---

## 2. BACKEND - APPLICATION STORAGE

### Backend Route File
```
BETCIV1-main/backend/routes/applications.js
```

### Database Model
```
BETCIV1-main/backend/models/Application.js
```

### Database Collection
```
MongoDB Collection: applications
```

### API Endpoints Available
```
POST   /api/applications              - Create new application
GET    /api/applications              - Get all applications
GET    /api/applications/:id          - Get specific application
PUT    /api/applications/:id          - Update application
DELETE /api/applications/:id          - Delete application
```

---

## 3. ADMIN DASHBOARD - VIEW APPLICATIONS

### File Location
```
BETCIV1-main/frontend/admin/pages/records.html
```

### Tab Navigation
```html
<!-- Line ~144-160 -->
<div class="records-button-tabs">
    <button class="tab-item active" onclick="showSection('enrollment', event)">
        Enrollment
    </button>
    <button class="tab-item" onclick="showSection('application', event)">
        Application
    </button>
    <button class="tab-item" onclick="showSection('admission', event)">
        Admission
    </button>
</div>
```

### Application Records Section
```html
<!-- Line ~214-268 -->
<div id="application" class="records-section">
    <div class="card">
        <div class="card-header">
            <h2 class="card-title">Application Records</h2>
            <p class="card-subtitle">View trainee applications</p>
            <button class="btn btn-primary" onclick="exportRecords('application')">
                Export
            </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Application ID</th>
                    <th>Trainee</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Applications loaded here -->
            </tbody>
        </table>
    </div>
</div>
```

### Admin Dashboard JavaScript
```
BETCIV1-main/frontend/admin/assets/js/admin-dashboard.js
```

### Key Functions
```javascript
// View trainee forms (Application and Admission)
async function viewTraineeForms(userId) {
    // Fetches applications and admissions for specific trainee
    // Line ~331
}

// Show specific section (enrollment, application, admission)
function showSection(section, event) {
    // Toggles between tabs
}

// Export records
function exportRecords(type) {
    // Exports application records to file
}
```

---

## 4. ADMISSION SLIP SUBMISSION

### File Location
```
BETCIV1-main/frontend/trainee/pages/assessment/admission-slip.html
```

### Submit Function
```javascript
// Line ~970
async function submitAdmissionSlip() {
    // Validates required fields
    // Collects admission data
    // Sends to: POST http://localhost:5500/api/admissions
    // Status set to: "pending"
}
```

### Data Structure Sent
```javascript
{
  admissionId: "ADM{timestamp}",
  userId: "{trainee account ID}",
  applicantName: "...",
  telNumber: "...",
  picture: "data:image/...",  // Base64
  assessmentApplied: "...",
  officialReceiptNumber: "...",
  dateIssued: "...",
  assessmentCenter: "...",
  requirements: {
    selfAssessmentGuide: boolean,
    passportPictures: boolean
  },
  remarks: {
    bringPPE: boolean,
    others: boolean,
    othersSpecify: "..."
  },
  assessmentDate: "...",
  assessmentTime: "...",
  status: "pending"
}
```

### API Endpoint Called
```
POST http://localhost:5500/api/admissions
Content-Type: application/json
```

---

## 5. ADMIN DASHBOARD - VIEW ADMISSIONS

### File Location
```
BETCIV1-main/frontend/admin/pages/records.html
```

### Admission Records Section
```html
<!-- Line ~269-310 -->
<div id="admission" class="records-section">
    <div class="card">
        <div class="card-header">
            <h2 class="card-title">Admission Records</h2>
            <p class="card-subtitle">View admission slips and records</p>
            <button class="btn btn-primary" onclick="exportRecords('admission')">
                Export
            </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Admission ID</th>
                    <th>Trainee</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Admissions loaded here -->
            </tbody>
        </table>
    </div>
</div>
```

---

## 6. BACKEND - ADMISSION STORAGE

### Backend Route File
```
BETCIV1-main/backend/routes/admissions.js
```

### Database Model
```
BETCIV1-main/backend/models/Admission.js
```

### Database Collection
```
MongoDB Collection: admissions
```

### API Endpoints Available
```
POST   /api/admissions                - Create new admission
GET    /api/admissions                - Get all admissions
GET    /api/admissions/:id            - Get specific admission
PUT    /api/admissions/:id            - Update admission
DELETE /api/admissions/:id            - Delete admission
```

---

## 7. DATABASE MODELS

### Application Model
```
BETCIV1-main/backend/models/Application.js
```

Fields:
- applicationId (String, unique)
- userId (String, reference to user)
- referenceNumber (String)
- uli (Object with 4 segments)
- schoolName (String)
- assessmentTitle (String)
- schoolAddress (String)
- dateOfApplication (Date)
- assessmentType (String)
- clientType (Object with boolean flags)
- profile (Object with personal info)
- workExperience (Array)
- trainingSeminars (Array)
- licensureExams (Array)
- competencyAssessments (Array)
- signature (String - Base64)
- status (String: pending, approved, rejected)
- createdAt (Date)
- updatedAt (Date)

### Admission Model
```
BETCIV1-main/backend/models/Admission.js
```

Fields:
- admissionId (String, unique)
- userId (String, reference to user)
- applicantName (String)
- telNumber (String)
- picture (String - Base64)
- assessmentApplied (String)
- officialReceiptNumber (String)
- dateIssued (Date)
- assessmentCenter (String)
- requirements (Object)
- remarks (Object)
- assessmentDate (Date)
- assessmentTime (String)
- status (String: pending, approved, rejected)
- createdAt (Date)
- updatedAt (Date)

---

## 8. FLOW SEQUENCE

### Step 1: Trainee Submits Application
```
application-form.html
    ↓
submitApplicationForm()
    ↓
Collect form data
    ↓
Convert picture to Base64
    ↓
Convert signature canvas to Base64
    ↓
POST /api/applications
    ↓
Backend stores in MongoDB
    ↓
Status: "pending"
```

### Step 2: Admin Views Application
```
records.html
    ↓
Click "Application" tab
    ↓
showSection('application')
    ↓
Fetch /api/applications
    ↓
Display in table
    ↓
Status: "Under Review" (yellow)
```

### Step 3: Admin Approves Application
```
records.html
    ↓
Click "View" button
    ↓
viewTraineeForms(userId)
    ↓
Change status to "Approved"
    ↓
PUT /api/applications/:id
    ↓
Backend updates MongoDB
    ↓
Status: "Approved" (green)
```

### Step 4: Trainee Submits Admission Slip
```
admission-slip.html
    ↓
submitAdmissionSlip()
    ↓
Collect admission data
    ↓
Convert picture to Base64
    ↓
POST /api/admissions
    ↓
Backend stores in MongoDB
    ↓
Status: "pending"
```

### Step 5: Admin Views Admission Slip
```
records.html
    ↓
Click "Admission" tab
    ↓
showSection('admission')
    ↓
Fetch /api/admissions
    ↓
Display in table
    ↓
Status: "Pending" (yellow)
```

---

## 9. CSS STYLING

### Admin Dashboard CSS
```
BETCIV1-main/frontend/admin/assets/css/admin-dashboard.css
```

### Status Badge Colors
```css
.badge-warning {
    background: #FFC107;  /* Yellow - Under Review */
    color: #333;
}

.badge-success {
    background: #28A745;  /* Green - Approved */
    color: white;
}

.badge-danger {
    background: #DC3545;  /* Red - Rejected */
    color: white;
}
```

---

## 10. ENVIRONMENT CONFIGURATION

### Backend Server
```
Port: 5500
Base URL: http://localhost:5500
```

### API Base URL (Frontend)
```javascript
const API_BASE_URL = 'http://localhost:5500/api';
```

### Database
```
MongoDB
Collections:
  - applications
  - admissions
  - users
  - trainees
  - courses
  - enrollments
  - records
```

---

## 11. TESTING ENDPOINTS

### Test Application Submission
```bash
curl -X POST http://localhost:5500/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "assessmentTitle": "Forklift Operation NC II",
    "profile": {
      "firstName": "John",
      "surname": "Doe"
    },
    "status": "pending"
  }'
```

### Test Get All Applications
```bash
curl -X GET http://localhost:5500/api/applications
```

### Test Update Application Status
```bash
curl -X PUT http://localhost:5500/api/applications/APP123 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

---

## 12. COMMON ISSUES & SOLUTIONS

### Issue: Application not appearing in admin dashboard
**Solution**: 
- Check if backend is running on port 5500
- Verify MongoDB connection
- Check browser console for errors
- Refresh the page

### Issue: Status not updating
**Solution**:
- Verify API endpoint is correct
- Check admin permissions
- Ensure trainee account ID is valid
- Check database connection

### Issue: Picture/Signature not saving
**Solution**:
- Check Base64 conversion
- Verify file size limits
- Check database field size
- Monitor network requests

### Issue: Admission slip not appearing after approval
**Solution**:
- Ensure application status is "approved"
- Check if trainee submitted admission slip
- Verify backend is running
- Refresh the page

---

## Summary

| Component | Location | Purpose |
|-----------|----------|---------|
| Application Form | `frontend/trainee/pages/assessment/application-form.html` | Trainee submits application |
| Admission Slip | `frontend/trainee/pages/assessment/admission-slip.html` | Trainee submits admission slip |
| Admin Records | `frontend/admin/pages/records.html` | Admin views and manages records |
| Admin JS | `frontend/admin/assets/js/admin-dashboard.js` | Admin dashboard logic |
| App Routes | `backend/routes/applications.js` | Application API endpoints |
| Adm Routes | `backend/routes/admissions.js` | Admission API endpoints |
| App Model | `backend/models/Application.js` | Application data structure |
| Adm Model | `backend/models/Admission.js` | Admission data structure |
