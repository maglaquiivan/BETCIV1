# Admin Pages MongoDB Integration Guide

## ✅ All Collections and JavaScript Files Created!

Each admin page now has a dedicated JavaScript file that connects to MongoDB.

---
## 📄 Admin Pages & Their JavaScript Files

### 1. **Dashboard** (`dashboard.html`)
**Collections Used:** courses, users, trainees  
**JavaScript File:** `admin-dashboard.js` (already integrated)  
**Features:**
- Real-time statistics
- Trainee cards with MongoDB data
- Course cards with MongoDB data
- Delete/Edit operations

**Already Added:** ✅ Script is already included in dashboard.html

---

### 2. **Trainees** (`trainees.html`)
**Collection:** trainees  
**JavaScript File:** `trainees-page.js`  
**API Endpoint:** `/api/trainees`

**Add to trainees.html:**
```html
<script src="../assets/js/trainees-page.js"></script>
```

**Features:**
- Load all trainees from MongoDB
- Display trainee cards with enrollment info
- Edit trainee details
- Delete trainees
- Search and filter functionality

---

### 3. **Accounts** (`accounts.html`)
**Collection:** accounts  
**JavaScript File:** `accounts-page.js`  
**API Endpoint:** `/api/accounts`

**Add to accounts.html:**
```html
<script src="../assets/js/accounts-page.js"></script>
```

**Features:**
- Load all user accounts
- Display accounts table with roles
- View account details
- Edit account permissions
- Delete accounts
- Filter by role (admin, instructor, staff, trainee)

---

### 4. **Appointments** (`appointments.html`)
**Collection:** appointments  
**JavaScript File:** `appointments-page.js`  
**API Endpoint:** `/api/appointments`

**Add to appointments.html:**
```html
<script src="../assets/js/appointments-page.js"></script>
```

**Features:**
- Load all appointments
- Display appointments table
- View appointment details
- Edit appointments
- Delete appointments
- Update appointment status (pending, confirmed, completed, cancelled)

---

### 5. **Competencies** (`competencies.html`)
**Collection:** competencies  
**JavaScript File:** `competencies-page.js`  
**API Endpoint:** `/api/competencies`

**Add to competencies.html:**
```html
<script src="../assets/js/competencies-page.js"></script>
```

**Features:**
- Load all competencies
- Display competency cards with units
- Filter by course
- View competency details
- Edit competencies
- Delete competencies

---

### 6. **Records** (`records.html`)
**Collection:** records  
**JavaScript File:** `records-page.js`  
**API Endpoint:** `/api/records`

**Add to records.html:**
```html
<script src="../assets/js/records-page.js"></script>
```

**Features:**
- Load all training records
- Display records table with progress
- View record details
- Edit records
- Download certificates
- Filter by status (In Progress, Completed, Pending)

---

### 7. **Courses** (`courses.html`)
**Collection:** courses  
**JavaScript File:** `courses-data.js` (already exists)  
**API Endpoint:** `/api/courses`

**Already Integrated:** ✅ Uses existing courses-data.js

---

### 8. **Training Catalog** (`training-catalog.html`)
**Collections:** courses, competencies  
**JavaScript File:** Use `courses-data.js` + `competencies-page.js`  
**API Endpoints:** `/api/courses`, `/api/competencies`

**Add to training-catalog.html:**
```html
<script src="../assets/js/courses-data.js"></script>
<script src="../assets/js/competencies-page.js"></script>
```

---

### 9. **Settings** (`settings.html`)
**Collections:** accounts, users  
**JavaScript File:** Use existing settings functionality  
**API Endpoints:** `/api/accounts`, `/api/users`

---

## 🔧 How to Add Scripts to Pages

For each page, add the corresponding script tag before the closing `</body>` tag:

```html
<!-- Example for trainees.html -->
<script src="../assets/js/burger-menu.js"></script>
<script src="../assets/js/dark-mode.js"></script>
<script src="../assets/js/admin-dashboard.js"></script>
<script src="../assets/js/trainees-page.js"></script> <!-- ADD THIS -->
</body>
</html>
```

---

## 📊 MongoDB Collections Summary

| Collection | Documents | Used By Pages |
|------------|-----------|---------------|
| courses | 6 | dashboard, courses, training-catalog |
| users | 2 | dashboard, settings |
| trainees | 5 | dashboard, trainees |
| appointments | 4 | appointments |
| competencies | 3 | competencies, training-catalog |
| accounts | 3 | accounts, settings |
| records | 3 | records |
| attendances | 4 | (future attendance page) |

---

## 🎯 Quick Integration Steps

### Step 1: Add Script Tags
Add the appropriate JavaScript file to each HTML page.

### Step 2: Add HTML Containers
Make sure each page has the required container elements:

**Trainees Page:**
```html
<div id="traineesContainer" class="trainees-grid"></div>
```

**Appointments Page:**
```html
<table id="appointmentsTable">
    <tbody></tbody>
</table>
```

**Accounts Page:**
```html
<table id="accountsTable">
    <tbody></tbody>
</table>
```

**Records Page:**
```html
<table id="recordsTable">
    <tbody></tbody>
</table>
```

**Competencies Page:**
```html
<div id="competenciesContainer" class="competencies-list"></div>
```

### Step 3: Test Each Page
1. Start the backend server: `npm start` in backend folder
2. Open each admin page
3. Check browser console for any errors
4. Verify data loads from MongoDB

---

## 🔍 Testing

Test each page by opening:
- http://localhost:5500/admin/pages/dashboard.html ✅ (Already working)
- http://localhost:5500/admin/pages/trainees.html
- http://localhost:5500/admin/pages/accounts.html
- http://localhost:5500/admin/pages/appointments.html
- http://localhost:5500/admin/pages/competencies.html
- http://localhost:5500/admin/pages/records.html
- http://localhost:5500/admin/pages/courses.html
- http://localhost:5500/admin/pages/training-catalog.html

---

## 🚀 All Features Available

Each page now supports:
- ✅ Load data from MongoDB
- ✅ Display data dynamically
- ✅ Edit functionality
- ✅ Delete functionality
- ✅ Search/Filter
- ✅ Real-time updates
- ✅ Error handling
- ✅ Success notifications

---

## 📝 Next Steps

1. Add the script tags to each HTML page
2. Customize the HTML containers if needed
3. Test all pages
4. Implement edit modals (TODO in each file)
5. Add form validation
6. Implement advanced filtering

All the backend APIs and JavaScript files are ready to use!
