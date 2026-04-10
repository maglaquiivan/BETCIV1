# Run Seed Data to Fix Admin Account Issue

## Problem
The admin account `ACC001` doesn't exist in the database, causing 404 errors when trying to upload profile pictures or update settings.

## Solution
Run the seed data script to create all necessary accounts including admin accounts in the new `adminaccounts` collection.

## Steps to Run Seed Data

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run seed
```

### Option 2: Using node directly
```bash
cd backend
node scripts/seedData.js
```

## What the Seed Script Does

1. **Clears all existing data** from:
   - courses
   - users
   - trainees
   - appointments
   - competencies
   - accounts (legacy)
   - adminaccounts (new)
   - traineeaccounts (new)
   - records
   - attendances

2. **Creates sample data** including:
   - 6 courses (Forklift, Bulldozer, Dump Truck, etc.)
   - 2 users
   - 5 trainees
   - 4 appointments
   - 3 competencies
   - 3 admin accounts (in both legacy and new collections)
   - 1 trainee account (in new collection)
   - 3 training records
   - 4 attendance records

## Default Login Credentials

After running the seed script, you can log in with:

### Admin Account
- **Email**: admin@betci.com
- **Password**: admin123
- **Account ID**: ACC001
- **Role**: admin

### Trainee Account
- **Email**: trainee@betci.com
- **Password**: trainee123
- **Account ID**: ACC1774597634318
- **Role**: trainee

### Instructor Account
- **Email**: instructor@betci.com
- **Password**: instructor123
- **Account ID**: ACC002
- **Role**: instructor

## After Running Seed Data

1. **Restart the server** (if it's running):
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm start
   ```

2. **Clear browser cache and cookies** for localhost:5500

3. **Log in again** using the credentials above

4. **Test profile picture upload**:
   - Go to Settings
   - Click "Change Photo"
   - Select an image
   - Should work without 404 errors

## Verification

After seeding, you should see this output:
```
Connected to MongoDB
Cleared existing data
✓ Courses seeded successfully (6 courses)
✓ Users seeded successfully (2 users)
✓ Trainees seeded successfully (5 trainees)
✓ Appointments seeded successfully (4 appointments)
✓ Competencies seeded successfully (3 competencies)
✓ Accounts seeded successfully (3 accounts)
✓ Admin accounts seeded successfully (3 accounts)
✓ Trainee accounts seeded successfully (1 account)
✓ Records seeded successfully (3 records)
✓ Attendance seeded successfully (4 attendance records)

========================================
Database seeded successfully!
========================================
```

## Important Notes

⚠️ **WARNING**: Running the seed script will **DELETE ALL EXISTING DATA** in your database!

- Only run this in development
- Do NOT run this in production
- Back up any important data before running
- All user-created courses, accounts, and records will be lost

## Troubleshooting

### Error: Cannot find module '../models/AdminAccount'
Make sure the AdminAccount model file exists at:
`backend/models/AdminAccount.js`

### Error: Cannot find module '../models/TraineeAccount'
Make sure the TraineeAccount model file exists at:
`backend/models/TraineeAccount.js`

### Error: Connection refused
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
# Windows: Start MongoDB service from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Still getting 404 errors after seeding
1. Check the database was actually seeded:
   ```bash
   mongosh
   use BETCI
   db.adminaccounts.find()
   ```

2. Verify ACC001 exists in the output

3. Clear browser cache completely

4. Log out and log in again

## Alternative: Manual Account Creation

If you don't want to run the seed script (to preserve existing data), you can manually create the admin account using MongoDB:

```bash
mongosh
use BETCI

db.adminaccounts.insertOne({
  accountId: "ACC001",
  username: "admin",
  email: "admin@betci.com",
  password: "admin123",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  status: "active",
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Then restart the server and try again.
