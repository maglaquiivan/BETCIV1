# Fix Admin Account 404 Error

## Problem
Getting `404 (Not Found)` error when trying to fetch `/api/admin-accounts/ACC002`

## Root Cause
The admin account `ACC002` doesn't exist in the `adminaccounts` collection in MongoDB.

## Solution

### Option 1: Seed the Database (Recommended)
Run the seed script to populate all default accounts including ACC002:

```bash
cd BETCIV1-main/backend
node scripts/seedData.js
```

This will create:
- **Admin Account**: admin@betci.com / admin123 (ACC001)
- **Instructor Account**: instructor@betci.com / instructor123 (ACC002)
- **Trainee Account**: trainee@betci.com / trainee123

### Option 2: Manual Database Check
If you want to verify what's in your database:

1. Open MongoDB Compass or mongo shell
2. Connect to your database
3. Check the `adminaccounts` collection
4. Verify that ACC002 exists

### What Was Fixed in Code
Updated `admin-dashboard.js` to handle 404 errors gracefully:
- Changed error from throwing to warning
- Falls back to using session data if API fetch fails
- No more console errors disrupting the UI

## Testing
1. Run the seed script
2. Clear browser cache (Ctrl + Shift + Delete)
3. Login with: instructor@betci.com / instructor123
4. Check that profile loads without 404 errors

## Default Accounts After Seeding
| Role | Email | Password | Account ID |
|------|-------|----------|------------|
| Admin | admin@betci.com | admin123 | ACC001 |
| Instructor | instructor@betci.com | instructor123 | ACC002 |
| Trainee | trainee@betci.com | trainee123 | TRN-xxx |
