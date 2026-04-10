# Profile Picture Upload Fix

## Problem
Profile picture upload is failing because the admin account doesn't exist in the `adminaccounts` collection in the database.

## Quick Fix - Run Seed Data

The easiest solution is to run the seed data script which will create the admin account:

```bash
cd backend
npm run seed
```

This will create:
- Admin account: `ACC001` (admin@betci.com / admin123)
- Instructor account: `ACC002` (instructor@betci.com / instructor123)
- Trainee account: `ACC1774597634318` (trainee@betci.com / trainee123)

## Alternative - Manual Account Creation

If you don't want to run the seed script (to preserve existing data), create the admin account manually:

### Using MongoDB Shell

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
  profilePicture: null,
  phone: "+63 9XX XXX XXXX",
  address: "Not provided",
  createdAt: new Date(),
  updatedAt: new Date()
})

exit
```

## After Creating the Account

1. **Restart the server**:
   ```bash
   cd backend
   npm start
   ```

2. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear cookies and cache for localhost

3. **Log out and log in again**:
   - Email: admin@betci.com
   - Password: admin123

4. **Try uploading profile picture again**:
   - Go to Settings
   - Click "Change Photo"
   - Select an image (JPG/PNG, under 2MB)
   - Should work now!

## Verify Account Exists

Check if the account exists in the database:

```bash
mongosh
use BETCI
db.adminaccounts.find({ accountId: "ACC001" }).pretty()
```

You should see the account details.

## Common Issues

### Issue: Still getting 404 error
**Solution**: The accountId in your session doesn't match the database
- Log out completely
- Clear browser cookies
- Log in again with admin@betci.com / admin123

### Issue: Image uploads but doesn't display
**Solution**: The image might be too large
- Keep images under 2MB
- Use JPG or PNG format
- Try a smaller image

### Issue: "Failed to update profile picture"
**Solution**: Check server logs
```bash
# In the backend terminal, you should see error messages
# Common causes:
# - Account not found (404)
# - Invalid image format
# - Image too large
# - Database connection issue
```

## Debug Steps

1. **Check if MongoDB is running**:
   ```bash
   mongosh
   # If it connects, MongoDB is running
   ```

2. **Check if server is running**:
   - Open http://localhost:5500/api/admin-accounts
   - Should see a list of admin accounts

3. **Check browser console**:
   - Press F12
   - Go to Console tab
   - Look for error messages when uploading

4. **Check Network tab**:
   - Press F12
   - Go to Network tab
   - Try uploading
   - Look for the PUT request to `/api/admin-accounts/ACC001`
   - Check the response status and error message

## Image Upload Flow

1. User clicks "Change Photo"
2. File input dialog opens
3. User selects image
4. Image is validated (size, type)
5. Image is converted to base64
6. PUT request to `/api/admin-accounts/{accountId}`
7. Database is updated
8. Session storage is updated
9. UI is updated with new image

## Testing

After fixing, test the following:

- [ ] Upload profile picture in admin settings
- [ ] Refresh page - picture should persist
- [ ] Log out and log in - picture should still be there
- [ ] Upload different picture - should replace old one
- [ ] Check database - profilePicture field should have base64 data

## Notes

- Profile pictures are stored as base64 strings in the database
- This is simple but not ideal for production
- For production, consider using cloud storage (S3, Cloudinary, etc.)
- Base64 images can make the database large
- Consider adding image compression before upload
