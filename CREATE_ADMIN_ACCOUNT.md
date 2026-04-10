# Create Admin Account in Database

## Admin Account Details from Screenshot
- **Account ID**: ADM-2026-001
- **Full Name**: Admin User
- **Email**: admin@betci.edu.ph
- **Phone**: +63 9XX XXX XXXX
- **Date Joined**: 01/01/2026
- **Address**: Not provided
- **Role**: Admin

## Method 1: Using MongoDB Shell (mongosh)

### Step 1: Open MongoDB Shell
```bash
mongosh
```

### Step 2: Switch to BETCI Database
```javascript
use BETCI
```

### Step 3: Insert Admin Account
```javascript
db.adminaccounts.insertOne({
  accountId: "ADM-2026-001",
  username: "admin",
  email: "admin@betci.edu.ph",
  password: "admin123",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  status: "active",
  phone: "+63 9XX XXX XXXX",
  address: "Not provided",
  profilePicture: null,
  lastLogin: new Date("2026-01-01"),
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date()
})
```

### Step 4: Verify Account Created
```javascript
db.adminaccounts.findOne({ accountId: "ADM-2026-001" })
```

You should see the account details printed.

## Method 2: Using Node.js Script

Create a file `backend/scripts/createAdminAccount.js`:

```javascript
const mongoose = require('mongoose');
const AdminAccount = require('../models/AdminAccount');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

async function createAdminAccount() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if account already exists
    const existing = await AdminAccount.findOne({ accountId: 'ADM-2026-001' });
    if (existing) {
      console.log('Admin account ADM-2026-001 already exists!');
      process.exit(0);
    }

    // Create new admin account
    const adminAccount = new AdminAccount({
      accountId: 'ADM-2026-001',
      username: 'admin',
      email: 'admin@betci.edu.ph',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      phone: '+63 9XX XXX XXXX',
      address: 'Not provided',
      profilePicture: null,
      lastLogin: new Date('2026-01-01'),
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date()
    });

    await adminAccount.save();
    console.log('✓ Admin account created successfully!');
    console.log('Account ID:', adminAccount.accountId);
    console.log('Email:', adminAccount.email);
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

createAdminAccount();
```

Then run:
```bash
cd backend
node scripts/createAdminAccount.js
```

## Method 3: Update Seed Data Script

The seed data script has already been updated to create admin accounts. Just run:

```bash
cd backend
npm run seed
```

This will create:
- ACC001 (admin@betci.com / admin123)
- ACC002 (instructor@betci.com / instructor123)
- ACC003 (staff@betci.com / staff123)

## After Creating the Account

### 1. Restart the Server
```bash
cd backend
npm start
```

### 2. Clear Browser Cache
- Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
- Clear cookies and cached files for localhost

### 3. Login with New Credentials
- **Email**: admin@betci.edu.ph
- **Password**: admin123
- **Account ID**: ADM-2026-001

### 4. Update Profile Information
After logging in:
1. Go to Settings
2. Click "Edit Information"
3. Update phone number, address, and other details
4. Upload profile picture using "Change Photo"

## Verify Account in Database

```javascript
// In mongosh
use BETCI
db.adminaccounts.find({ email: "admin@betci.edu.ph" }).pretty()
```

## Update Existing Account

If you want to update the existing ACC001 account to use the new email:

```javascript
use BETCI
db.adminaccounts.updateOne(
  { accountId: "ACC001" },
  { 
    $set: { 
      accountId: "ADM-2026-001",
      email: "admin@betci.edu.ph",
      phone: "+63 9XX XXX XXXX",
      updatedAt: new Date()
    }
  }
)
```

## Troubleshooting

### Account Not Found (404 Error)
- Make sure MongoDB is running
- Verify the account was created: `db.adminaccounts.find()`
- Check the accountId matches exactly
- Restart the server

### Cannot Login
- Verify email and password are correct
- Check the account status is "active"
- Clear browser cookies
- Check server logs for errors

### Profile Picture Upload Fails
- Make sure the account exists in database
- Verify accountId in session matches database
- Check file size is under 2MB
- Ensure file format is JPG or PNG

## Security Note

⚠️ **Important**: Change the default password after first login!

1. Login with admin123
2. Go to Settings → Change Password
3. Set a strong password
4. Save changes

## Quick Command Summary

```bash
# Create account using mongosh
mongosh
use BETCI
db.adminaccounts.insertOne({
  accountId: "ADM-2026-001",
  username: "admin",
  email: "admin@betci.edu.ph",
  password: "admin123",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})

# Verify
db.adminaccounts.findOne({ accountId: "ADM-2026-001" })

# Exit
exit
```

Then restart your server and login!
