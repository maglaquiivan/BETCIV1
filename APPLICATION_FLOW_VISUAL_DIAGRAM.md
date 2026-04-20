# Application & Admission Flow - Visual Diagrams

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BETCI SYSTEM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                            TRAINEE SIDE                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Application Form (application-form.html)                           │   │
│  │ ├─ Personal Information                                            │   │
│  │ ├─ ULI Segments                                                    │   │
│  │ ├─ Assessment Details                                              │   │
│  │ ├─ Work Experience                                                 │   │
│  │ ├─ Training/Seminars                                               │   │
│  │ ├─ Licensure Exams                                                 │   │
│  │ ├─ Competency Assessments                                          │   │
│  │ ├─ Picture Upload (Base64)                                         │   │
│  │ ├─ Signature Canvas (Base64)                                       │   │
│  │ └─ [SUBMIT BUTTON]                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ submitApplicationForm()                                             │   │
│  │ ├─ Validate required fields                                         │   │
│  │ ├─ Collect all form data                                            │   │
│  │ ├─ Convert picture to Base64                                        │   │
│  │ ├─ Convert signature canvas to Base64                               │   │
│  │ ├─ Set status: "pending"                                            │   │
│  │ └─ POST /api/applications                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Success Message                                                     │   │
│  │ "Application Form submitted successfully!"                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Node.js/Express)                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ POST /api/applications (applications.js)                           │   │
│  │ ├─ Receive application data                                         │   │
│  │ ├─ Validate data                                                    │   │
│  │ ├─ Create Application document                                      │   │
│  │ └─ Save to MongoDB                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ MongoDB Collection: applications                                    │   │
│  │ ├─ applicationId: "APP{timestamp}"                                  │   │
│  │ ├─ userId: "{trainee account ID}"                                   │   │
│  │ ├─ profile: { ... }                                                 │   │
│  │ ├─ workExperience: [ ... ]                                          │   │
│  │ ├─ trainingSeminars: [ ... ]                                        │   │
│  │ ├─ licensureExams: [ ... ]                                          │   │
│  │ ├─ competencyAssessments: [ ... ]                                   │   │
│  │ ├─ picture: "data:image/..."                                        │   │
│  │ ├─ signature: "data:image/..."                                      │   │
│  │ ├─ status: "pending"                                                │   │
│  │ └─ createdAt: {timestamp}                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN SIDE                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Admin Dashboard (dashboard.html)                                    │   │
│  │ └─ Click "Records" in sidebar                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Records Page (records.html)                                         │   │
│  │ ├─ [Enrollment Tab]                                                 │   │
│  │ ├─ [Application Tab] ← CLICK HERE                                   │   │
│  │ └─ [Admission Tab]                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Application Records Table                                           │   │
│  │ ┌──────────────────────────────────────────────────────────────┐   │   │
│  │ │ Application ID │ Trainee │ Course │ Date │ Status │ Actions │   │   │
│  │ ├──────────────────────────────────────────────────────────────┤   │   │
│  │ │ #APP001        │ Jane    │ Bulldozer │ Jan 14 │ 🟡 Under  │ View │   │
│  │ │                │ Smith   │ Operation │ 2024   │ Review    │      │   │
│  │ ├──────────────────────────────────────────────────────────────┤   │   │
│  │ │ #APP002        │ Mike    │ Excavator │ Jan 16 │ 🟢 Approved│ View │   │
│  │ │                │ Johnson │ Operation │ 2024   │           │      │   │
│  │ └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Admin Actions                                                       │   │
│  │ ├─ [View] - See full application details                            │   │
│  │ ├─ [Approve] - Change status to "Approved" (🟢)                     │   │
│  │ ├─ [Reject] - Change status to "Rejected" (🔴)                      │   │
│  │ └─ [Export] - Export records to file                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│                    TRAINEE SIDE (After Approval)                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Admission Slip (admission-slip.html)                               │   │
│  │ ├─ Reference Number (15 segments)                                   │   │
│  │ ├─ Applicant Name & Tel                                             │   │
│  │ ├─ Picture Upload                                                   │   │
│  │ ├─ Assessment Details                                               │   │
│  │ ├─ Receipt Number                                                   │   │
│  │ ├─ Assessment Center                                                │   │
│  │ ├─ Requirements Checklist                                           │   │
│  │ ├─ Assessment Date & Time                                           │   │
│  │ ├─ Signatures (Officer & Applicant)                                 │   │
│  │ └─ [SUBMIT BUTTON]                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ submitAdmissionSlip()                                               │   │
│  │ ├─ Validate required fields                                         │   │
│  │ ├─ Collect admission data                                           │   │
│  │ ├─ Convert picture to Base64                                        │   │
│  │ ├─ Set status: "pending"                                            │   │
│  │ └─ POST /api/admissions                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Success Message                                                     │   │
│  │ "Admission Slip submitted successfully!"                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Node.js/Express)                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ POST /api/admissions (admissions.js)                               │   │
│  │ ├─ Receive admission data                                           │   │
│  │ ├─ Validate data                                                    │   │
│  │ ├─ Create Admission document                                        │   │
│  │ └─ Save to MongoDB                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ MongoDB Collection: admissions                                      │   │
│  │ ├─ admissionId: "ADM{timestamp}"                                    │   │
│  │ ├─ userId: "{trainee account ID}"                                   │   │
│  │ ├─ applicantName: "..."                                             │   │
│  │ ├─ assessmentApplied: "..."                                         │   │
│  │ ├─ picture: "data:image/..."                                        │   │
│  │ ├─ requirements: { ... }                                            │   │
│  │ ├─ remarks: { ... }                                                 │   │
│  │ ├─ assessmentDate: "..."                                            │   │
│  │ ├─ assessmentTime: "..."                                            │   │
│  │ ├─ status: "pending"                                                │   │
│  │ └─ createdAt: {timestamp}                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN SIDE                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Records Page (records.html)                                         │   │
│  │ ├─ [Enrollment Tab]                                                 │   │
│  │ ├─ [Application Tab]                                                │   │
│  │ └─ [Admission Tab] ← CLICK HERE                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Admission Records Table                                             │   │
│  │ ┌──────────────────────────────────────────────────────────────┐   │   │
│  │ │ Admission ID │ Trainee │ Course │ Date │ Status │ Actions   │   │   │
│  │ ├──────────────────────────────────────────────────────────────┤   │   │
│  │ │ #ADM001      │ Jane    │ Bulldozer │ Jan 15 │ 🟡 Pending │ View │   │
│  │ │              │ Smith   │ Operation │ 2024   │           │      │   │
│  │ └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Admin Actions                                                       │   │
│  │ ├─ [View] - See full admission slip details                         │   │
│  │ ├─ [Approve] - Change status to "Approved" (🟢)                     │   │
│  │ ├─ [Reject] - Change status to "Rejected" (🔴)                      │   │
│  │ └─ [Export] - Export records to file                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION STATUS FLOW                      │
└─────────────────────────────────────────────────────────────────┘

                    TRAINEE SUBMITS
                          │
                          ↓
                    ┌──────────────┐
                    │   PENDING    │
                    │ (Under Review)│
                    │   🟡 Yellow  │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                ↓                     ↓
        ┌────────────────┐    ┌────────────────┐
        │   APPROVED     │    │   REJECTED     │
        │   🟢 Green     │    │   🔴 Red       │
        └────────┬───────┘    └────────────────┘
                 │
                 ↓
        TRAINEE CAN SUBMIT
        ADMISSION SLIP
                 │
                 ↓
        ┌──────────────────┐
        │  ADMISSION SLIP  │
        │    SUBMITTED     │
        │   PENDING        │
        │   🟡 Yellow      │
        └────────┬─────────┘
                 │
        ┌────────┴──────────┐
        ↓                   ↓
    ┌────────────┐    ┌────────────┐
    │ APPROVED   │    │ REJECTED   │
    │ 🟢 Green   │    │ 🔴 Red     │
    └────────────┘    └────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION DATA FLOW                        │
└─────────────────────────────────────────────────────────────────┘

TRAINEE FORM DATA
├─ Personal Information
│  ├─ Name (Surname, First, Middle, Extension)
│  ├─ Address (Street, Barangay, City, Province, Region, Zip)
│  ├─ Contact (Tel, Mobile, Email, Fax)
│  ├─ Birth Info (Date, Place, Age)
│  ├─ Family (Mother, Father)
│  └─ Status (Sex, Civil Status, Education, Employment)
│
├─ Assessment Information
│  ├─ ULI (4 segments)
│  ├─ School Name & Address
│  ├─ Assessment Title
│  ├─ Assessment Type
│  └─ Client Type (TVET, Industry, K12, OWF)
│
├─ Experience Records
│  ├─ Work Experience (Company, Position, Dates, Salary, Status, Years)
│  ├─ Training/Seminars (Title, Venue, Dates, Hours, Conductor)
│  ├─ Licensure Exams (Title, Year, Venue, Rating, Remarks, Expiry)
│  └─ Competency Assessments (Title, Level, Sector, Certificate, Dates)
│
├─ Attachments
│  ├─ Picture (Converted to Base64)
│  └─ Signature (Canvas drawing converted to Base64)
│
└─ Metadata
   ├─ Application ID (Generated)
   ├─ User ID (From session)
   ├─ Status (Set to "pending")
   └─ Timestamp (Created date)

                          ↓

                    BACKEND PROCESSING
                    ├─ Validate data
                    ├─ Create document
                    └─ Save to MongoDB

                          ↓

                    MONGODB STORAGE
                    ├─ Collection: applications
                    ├─ Document: {applicationId, userId, profile, ...}
                    └─ Status: pending

                          ↓

                    ADMIN RETRIEVAL
                    ├─ GET /api/applications
                    ├─ Filter by status
                    └─ Display in table

                          ↓

                    ADMIN ACTIONS
                    ├─ View details
                    ├─ Update status
                    └─ Export records
```

---

## File Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FILE RELATIONSHIPS                           │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (Trainee)
├─ application-form.html
│  ├─ Imports: common.js
│  ├─ Function: submitApplicationForm()
│  ├─ API Call: POST /api/applications
│  └─ Data: Application object
│
└─ admission-slip.html
   ├─ Imports: common.js
   ├─ Function: submitAdmissionSlip()
   ├─ API Call: POST /api/admissions
   └─ Data: Admission object

                          ↓

BACKEND (Node.js/Express)
├─ routes/applications.js
│  ├─ POST /api/applications
│  ├─ GET /api/applications
│  ├─ PUT /api/applications/:id
│  └─ Calls: Application.js model
│
├─ routes/admissions.js
│  ├─ POST /api/admissions
│  ├─ GET /api/admissions
│  ├─ PUT /api/admissions/:id
│  └─ Calls: Admission.js model
│
├─ models/Application.js
│  ├─ Schema definition
│  ├─ Validation
│  └─ Database operations
│
└─ models/Admission.js
   ├─ Schema definition
   ├─ Validation
   └─ Database operations

                          ↓

DATABASE (MongoDB)
├─ Collection: applications
│  ├─ Document: {applicationId, userId, profile, ...}
│  └─ Status: pending/approved/rejected
│
└─ Collection: admissions
   ├─ Document: {admissionId, userId, applicantName, ...}
   └─ Status: pending/approved/rejected

                          ↓

FRONTEND (Admin)
├─ records.html
│  ├─ Imports: admin-dashboard.js
│  ├─ Tabs: Enrollment, Application, Admission
│  ├─ Function: showSection('application')
│  ├─ Function: viewTraineeForms(userId)
│  ├─ API Call: GET /api/applications
│  └─ Display: Application table
│
└─ admin-dashboard.js
   ├─ Function: viewTraineeForms()
   ├─ Function: showSection()
   ├─ Function: exportRecords()
   └─ API Calls: Fetch applications/admissions
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  COMPONENT INTERACTIONS                         │
└─────────────────────────────────────────────────────────────────┘

TRAINEE COMPONENT
    │
    ├─ Fills Form
    │  └─ Validates Input
    │     └─ Converts Files (Picture, Signature)
    │        └─ Sends to Backend
    │
    └─ Receives Response
       ├─ Success: Shows message
       └─ Error: Shows alert

                    ↓

BACKEND COMPONENT
    │
    ├─ Receives Request
    │  └─ Validates Data
    │     └─ Creates Document
    │        └─ Saves to Database
    │
    └─ Sends Response
       ├─ Success: Returns ID
       └─ Error: Returns error message

                    ↓

DATABASE COMPONENT
    │
    ├─ Stores Document
    │  └─ Indexes by ID
    │     └─ Indexes by UserID
    │        └─ Indexes by Status
    │
    └─ Ready for Queries

                    ↓

ADMIN COMPONENT
    │
    ├─ Requests Data
    │  └─ Filters by Status
    │     └─ Sorts by Date
    │        └─ Displays in Table
    │
    ├─ Views Details
    │  └─ Fetches Full Document
    │     └─ Displays Modal
    │
    └─ Updates Status
       └─ Sends Update Request
          └─ Backend Updates Database
             └─ Admin Sees Change
```

---

## Summary

✅ **Application submitted** → Appears in Admin Dashboard (Application tab)
✅ **Admin reviews** → Can approve, reject, or keep under review
✅ **Trainee notified** → Can proceed to admission slip after approval
✅ **Admission slip submitted** → Appears in Admin Dashboard (Admission tab)
✅ **Admin manages** → Can approve or reject admission slip
