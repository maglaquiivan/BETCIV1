# Test Accounts CRUD Functionality

## ✅ What Was Implemented

### Full CRUD Operations for Accounts Page

1. **CREATE** - Add new account to MongoDB
2. **READ** - Load and display accounts from MongoDB
3. **UPDATE** - Edit existing account in MongoDB
4. **DELETE** - Remove account from MongoDB

---

## 🧪 How to Test

### Step 1: Start the Server
```bash
cd BETCIV1-main\backend
npm start
```

### Step 2: Login as Admin
1. Open: http://localhost:5500/admin/login.html
2. Email: `admin@betci.com`
3. Password: `admin123`

### Step 3: Go to Accounts Page
Click on "Accounts" in the sidebar

---

## 📝 Test Cases

### Test 1: View Existing Accounts (READ)
✅ **Expected:** You should see 3 accounts loaded from MongoDB:
- Admin User (admin@betci.com)
- Robert Johnson (instructor@betci.com)
- Sarah Williams (staff@betci.com)

---

### Test 2: Add New Account (CREATE)
1. Click "Add Account" button
2. Fill in the form:
   - Username: `testuser`
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@betci.com`
   - Password: `test123`
   - Role: `Staff`
3. Click "Save Account"

✅ **Expected:**
- Success notification appears
- New account appears in the table
- Account is saved to MongoDB

**Verify in MongoDB Compass:**
- Open BETCI database → accounts collection
- You should see the new account with accountId starting with "ACC"

---

### Test 3: Edit Existing Account (UPDATE)
1. Click the "Edit" button (pencil icon) on any account
2. Modal opens with account data pre-filled
3. Change some fields:
   - Change First Name to "Updated"
   - Change Role to "Instructor"
4. Click "Save Account"

✅ **Expected:**
- Success notification appears
- Account updates in the table
- Changes are saved to MongoDB

**Verify in MongoDB Compass:**
- Refresh the accounts collection
- The account should show updated values

---

### Test 4: Delete Account (DELETE)
1. Click the "Delete" button (trash icon) on the test account
2. Delete confirmation modal appears
3. Type the username exactly: `testuser`
4. Click "Delete Account"

✅ **Expected:**
- Success notification appears
- Account disappears from table
- Account is removed from MongoDB

**Verify in MongoDB Compass:**
- Refresh the accounts collection
- The account should be gone

---

## 🔍 Features Implemented

### Add Account Modal
- ✅ Form with all required fields
- ✅ Validation (all fields required)
- ✅ Auto-generates accountId
- ✅ Saves to MongoDB via POST /api/accounts
- ✅ Success/error notifications

### Edit Account Modal
- ✅ Loads existing account data
- ✅ Pre-fills form fields
- ✅ Password optional (leave blank to keep current)
- ✅ Updates MongoDB via PUT /api/accounts/:id
- ✅ Success/error notifications

### Delete Account
- ✅ Confirmation modal with username verification
- ✅ Prevents accidental deletion
- ✅ Deletes from MongoDB via DELETE /api/accounts/:id
- ✅ Success/error notifications

### View Account
- ✅ Shows account details in alert
- ✅ Displays all account information
- ✅ Fetches from MongoDB via GET /api/accounts/:id

---

## 🎯 API Endpoints Used

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| List | GET | /api/accounts | Get all accounts |
| View | GET | /api/accounts/:id | Get single account |
| Create | POST | /api/accounts | Create new account |
| Update | PUT | /api/accounts/:id | Update account |
| Delete | DELETE | /api/accounts/:id | Delete account |

---

## 📊 MongoDB Collection Structure

**Collection:** `accounts`

**Document Example:**
```json
{
  "_id": "ObjectId(...)",
  "accountId": "ACC1234567890",
  "username": "testuser",
  "email": "test@betci.com",
  "password": "test123",
  "firstName": "Test",
  "lastName": "User",
  "role": "staff",
  "status": "active",
  "lastLogin": null,
  "permissions": ["view_trainees"],
  "createdAt": "2024-03-26T...",
  "updatedAt": "2024-03-26T..."
}
```

---

## ✨ Additional Features

### Search Functionality
```javascript
searchAccounts('john'); // Filters accounts by search term
```

### Filter by Role
```javascript
filterByRole('admin'); // Shows only admin accounts
filterByRole('all'); // Shows all accounts
```

### Notifications
- Success (green) - Operation completed
- Error (red) - Operation failed
- Info (blue) - Information message

---

## 🐛 Troubleshooting

### Accounts not loading?
- Check browser console for errors
- Verify server is running: `npm start` in backend folder
- Check MongoDB is running: `mongod`
- Test API: http://localhost:5500/test-api.html

### Can't save account?
- Check all required fields are filled
- Check browser console for error messages
- Verify MongoDB connection in server logs

### Delete not working?
- Make sure you type the username exactly
- Check browser console for errors
- Verify account exists in MongoDB

---

## 🎉 Success!

Your accounts page now has full CRUD functionality connected to MongoDB!

All operations (Create, Read, Update, Delete) work directly with the database.
