# Account Separation Implementation Summary

## Overview
Separated the single `accounts` collection into two distinct collections:
- `adminaccounts` - For admin and instructor users
- `traineeaccounts` - For trainee users

This ensures that admin profile pictures and data are completely separate from trainee profile pictures and data.

## Changes Made

### 1. New Database Models Created

#### AdminAccount Model (`backend/models/AdminAccount.js`)
- Collection: `adminaccounts`
- Fields: accountId, username, email, password, firstName, lastName, role (admin/instructor/staff), status, profilePicture, phone, address, lastLogin, permissions
- Role restricted to: admin, instructor, staff

#### TraineeAccount Model (`backend/models/TraineeAccount.js`)
- Collection: `traineeaccounts`
- Fields: accountId, username, email, password, firstName, lastName, role (trainee), status, profilePicture, phone, course, address, lastLogin, dateOfBirth
- Role restricted to: trainee only

### 2. New API Routes Created

#### Admin Accounts Route (`backend/routes/adminAccounts.js`)
- Endpoint: `/api/admin-accounts`
- Operations: GET all, GET by ID, POST create, PUT update, DELETE
- Manages admin/instructor accounts only

#### Trainee Accounts Route (`backend/routes/traineeAccounts.js`)
- Endpoint: `/api/trainee-accounts`
- Operations: GET all, GET by ID, POST create, PUT update, DELETE
- Manages trainee accounts only

### 3. Server Configuration Updated (`backend/server.js`)
- Registered new routes:
  - `/api/admin-accounts` → adminAccountRoutes
  - `/api/trainee-accounts` → traineeAccountRoutes
- Old `/api/accounts` route kept for backward compatibility

### 4. Login System Updated (`backend/routes/users.js`)
- Login now checks multiple collections in order:
  1. AdminAccount collection (for admin/instructor)
  2. TraineeAccount collection (for trainees)
  3. Account collection (legacy, for backward compatibility)
  4. User collection (fallback)
- Returns `userType` field to help frontend identify which collection was used
- Returns all user data including profilePicture, phone, address

### 5. Registration Updated (`frontend/assets/js/login.js`)
- Registration now saves to `trainee-accounts` collection
- Account ID format: `TRN{timestamp}` for trainees
- Automatically creates trainee record in trainees collection
- Role automatically set to 'trainee'

### 6. Settings Pages Updated

#### Admin Settings (`frontend/admin/pages/settings.html`)
- Dynamically determines API endpoint based on user role
- Admin/Instructor → uses `/api/admin-accounts`
- Trainee → uses `/api/trainee-accounts`
- Profile picture upload uses correct endpoint
- Profile data loads from correct collection

#### Trainee Settings (`frontend/trainee/pages/settings.html`)
- Dynamically determines API endpoint based on user role
- Uses `/api/trainee-accounts` for trainee users
- Profile picture upload uses correct endpoint
- Profile data loads from correct collection

## Data Flow

### Registration Flow (Trainee)
1. User fills registration form
2. Data saved to `traineeaccounts` collection via `/api/trainee-accounts`
3. Trainee record created in `trainees` collection
4. Account ID format: `TRN{timestamp}`

### Login Flow
1. User enters email/password
2. System checks AdminAccount collection first
3. If not found, checks TraineeAccount collection
4. If not found, checks legacy Account collection
5. Returns user data with `userType` indicator
6. Session stored with all user data including role

### Profile Picture Upload Flow
1. User uploads picture in settings
2. Frontend checks user role from session
3. Determines correct API endpoint:
   - Admin/Instructor → `/api/admin-accounts/{accountId}`
   - Trainee → `/api/trainee-accounts/{accountId}`
4. Picture saved as base64 in correct collection
5. All avatars updated on page

## Benefits

1. **Data Separation**: Admin and trainee data completely separated
2. **Profile Pictures**: Each user type has their own profile pictures
3. **Security**: Role-based access to different collections
4. **Scalability**: Easier to manage and scale separate collections
5. **Backward Compatibility**: Old accounts collection still works

## Database Collections

### Before
- `accounts` - All users (admin, instructor, trainee)

### After
- `adminaccounts` - Admin and instructor users only
- `traineeaccounts` - Trainee users only
- `accounts` - Legacy (kept for backward compatibility)

## API Endpoints

### New Endpoints
- `GET /api/admin-accounts` - Get all admin accounts
- `GET /api/admin-accounts/:id` - Get admin account by ID
- `POST /api/admin-accounts` - Create admin account
- `PUT /api/admin-accounts/:id` - Update admin account
- `DELETE /api/admin-accounts/:id` - Delete admin account

- `GET /api/trainee-accounts` - Get all trainee accounts
- `GET /api/trainee-accounts/:id` - Get trainee account by ID
- `POST /api/trainee-accounts` - Create trainee account
- `PUT /api/trainee-accounts/:id` - Update trainee account
- `DELETE /api/trainee-accounts/:id` - Delete trainee account

### Existing Endpoints (Unchanged)
- `POST /api/users/login` - Login (now checks both collections)
- `GET /api/accounts` - Legacy accounts (backward compatibility)

## Testing Checklist

- [ ] Register new trainee account
- [ ] Login with trainee account
- [ ] Upload trainee profile picture
- [ ] Verify trainee picture appears in trainee dashboard
- [ ] Login with admin account
- [ ] Upload admin profile picture
- [ ] Verify admin picture appears in admin dashboard
- [ ] Verify admin and trainee pictures are separate
- [ ] Check MongoDB collections are created correctly
- [ ] Verify role labels display correctly (Admin/Trainee)

## Notes

- Old accounts in the `accounts` collection will still work
- New registrations go to `traineeaccounts` collection
- Admin accounts should be manually created in `adminaccounts` collection
- Profile pictures are stored as base64 strings (max 2MB)
- All changes are backward compatible
