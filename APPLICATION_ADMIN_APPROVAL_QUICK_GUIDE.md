# Application & Admission Approval - Quick Guide

## YES - Applications WILL Appear in Admin Dashboard

When a trainee submits an application form, it **automatically appears** in the Admin Dashboard under the **Records → Application** tab.

---

## WHERE TO FIND SUBMITTED APPLICATIONS

### For Admin Users:
1. **Login** to admin account
2. **Click "Records"** in the left sidebar
3. **Click "Application" tab** at the top
4. **View all submitted applications** in the table

### What You'll See:
```
┌─────────────────────────────────────────────────────────────────┐
│ Application Records                                             │
├─────────────────────────────────────────────────────────────────┤
│ Application ID │ Trainee      │ Course    │ Date      │ Status  │
├─────────────────────────────────────────────────────────────────┤
│ #APP001        │ Jane Smith   │ Bulldozer │ Jan 14    │ Under   │
│                │              │ Operation │ 2024      │ Review  │
├─────────────────────────────────────────────────────────────────┤
│ #APP002        │ Mike Johnson │ Excavator │ Jan 16    │ Approved│
│                │              │ Operation │ 2024      │         │
└─────────────────────────────────────────────────────────────────┘
```

---

## APPLICATION APPROVAL PROCESS

### Step 1: View Application
- Click **"View"** button in the Actions column
- See full application details including:
  - Personal information
  - Work experience
  - Training/seminars
  - Licensure exams
  - Competency assessments
  - Picture and signature

### Step 2: Review Details
- Check all submitted information
- Verify required fields are complete
- Review attachments (picture, signature)

### Step 3: Approve or Reject
- **Approve**: Change status to "Approved" ✓
- **Reject**: Change status to "Rejected" ✗
- **Under Review**: Keep as pending (default)

### Step 4: Save Changes
- Click "Save" or "Update"
- Status updates immediately

---

## ADMISSION SLIP FLOW

### After Application is Approved:
1. Trainee can submit **Admission Slip**
2. Admission slip appears in **Records → Admission** tab
3. Admin can review and approve admission slips

### Admission Records Table:
```
┌─────────────────────────────────────────────────────────────────┐
│ Admission Records                                               │
├─────────────────────────────────────────────────────────────────┤
│ Admission ID │ Trainee      │ Course    │ Date      │ Status    │
├─────────────────────────────────────────────────────────────────┤
│ #ADM001      │ Jane Smith   │ Bulldozer │ Jan 15    │ Pending   │
│              │              │ Operation │ 2024      │           │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMPLETE FLOW SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│ TRAINEE SUBMITS APPLICATION FORM                                │
│ ├─ Fills personal information                                   │
│ ├─ Uploads picture & signature                                  │
│ └─ Clicks "Submit"                                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ APPLICATION APPEARS IN ADMIN DASHBOARD                          │
│ ├─ Records → Application Tab                                    │
│ ├─ Status: "Under Review" (yellow badge)                        │
│ └─ Admin can view full details                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ ADMIN REVIEWS & APPROVES                                        │
│ ├─ Click "View" to see details                                  │
│ ├─ Change status to "Approved" (green badge)                    │
│ └─ Save changes                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ TRAINEE SUBMITS ADMISSION SLIP                                  │
│ ├─ Goes to Assessment → Admission Slip                          │
│ ├─ Fills admission details                                      │
│ └─ Clicks "Submit"                                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ ADMISSION SLIP APPEARS IN ADMIN DASHBOARD                       │
│ ├─ Records → Admission Tab                                      │
│ ├─ Status: "Pending" (yellow badge)                             │
│ └─ Admin can view and manage                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## STATUS BADGES

| Status | Color | Meaning |
|--------|-------|---------|
| Under Review | 🟡 Yellow | Waiting for admin approval |
| Approved | 🟢 Green | Admin approved the application |
| Rejected | 🔴 Red | Admin rejected the application |
| Pending | 🟡 Yellow | Waiting for action |

---

## KEY INFORMATION

### Application Data Includes:
- ✓ Personal information (name, address, contact)
- ✓ ULI (Unique Learner Identifier)
- ✓ Assessment details
- ✓ Work experience records
- ✓ Training/seminars records
- ✓ Licensure exams records
- ✓ Competency assessments records
- ✓ Picture (Base64 encoded)
- ✓ Signature (Canvas drawing)

### Admission Slip Data Includes:
- ✓ Reference number (15 segments)
- ✓ Applicant name & contact
- ✓ Picture upload
- ✓ Assessment details
- ✓ Receipt number
- ✓ Assessment center
- ✓ Requirements checklist
- ✓ Assessment date & time
- ✓ Signatures (officer & applicant)

---

## ADMIN DASHBOARD TABS

### Records Section Has 3 Tabs:

1. **Enrollment** 📋
   - View trainee enrollments
   - Manage enrollment records
   - Track enrollment status

2. **Application** 📄
   - View submitted applications
   - Review application details
   - Approve/reject applications
   - Export application records

3. **Admission** ✓
   - View admission slips
   - Review admission details
   - Manage admission records
   - Export admission records

---

## QUICK CHECKLIST

### For Trainees:
- [ ] Fill application form completely
- [ ] Upload picture (passport size)
- [ ] Draw signature on canvas
- [ ] Click "Submit"
- [ ] Wait for admin approval
- [ ] Submit admission slip after approval

### For Admins:
- [ ] Go to Records → Application tab
- [ ] Review submitted applications
- [ ] Check all required fields
- [ ] Approve or reject applications
- [ ] Monitor admission slips
- [ ] Manage admission records

---

## TROUBLESHOOTING

**Q: Application not showing in admin dashboard?**
- A: Refresh the page, check if backend is running, verify trainee account ID

**Q: Can't change application status?**
- A: Check admin permissions, refresh page, verify API connection

**Q: Picture/signature not saving?**
- A: Check file size, verify Base64 conversion, check database limits

**Q: Admission slip not appearing?**
- A: Ensure application is approved first, refresh page, check backend

---

## SUMMARY

✅ **YES** - Applications appear in Admin Dashboard automatically
✅ **Location** - Records → Application Tab
✅ **Status** - Starts as "Under Review"
✅ **Admin Can** - View, Approve, Reject, Export
✅ **Next Step** - Trainee submits Admission Slip after approval
✅ **Admission** - Appears in Records → Admission Tab
