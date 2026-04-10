# Profile Completion Flow

## Overview

This document describes the profile completion flow that ensures trainees complete their profile before enrolling in courses or submitting applications.

## User Flow

### 1. Registration
```
User fills registration form
  ↓
Account created with profileComplete = false
  ↓
Redirected to login page
  ↓
User logs in with new credentials
```

### 2. First Login
```
User logs in
  ↓
System checks profileComplete flag
  ↓
If profileComplete = false:
  → Redirect to manage-profile.html?firstLogin=true
  → Show notification banner
  → User must complete profile
  
If profileComplete = true:
  → Redirect to dashboard.html
```

### 3. Profile Completion
```
User on manage-profile.html
  ↓
Fills required fields:
  • First Name
  • Last Name
  • Phone Number
  • Address
  ↓
Clicks "Save Changes"
  ↓
System sets profileComplete = true
  ↓
Redirected to dashboard.html
```

### 4. Protected Pages
```
User tries to access:
  • assessment.html
  • application-form.html
  • admission-slip.html
  • registration-form.html
  ↓
Profile guard checks profileComplete
  ↓
If profileComplete = false:
  → Show modal: "Complete Your Profile First"
  → Options: Go Back | Complete Profile
  
If profileComplete = true:
  → Allow access to page
```

## Implementation Details

### Files Modified

#### 1. `frontend/assets/js/login.js`
**Changes:**
- Added `profileComplete` to session data
- Check `profileComplete` after login
- Redirect to `manage-profile.html?firstLogin=true` if incomplete
- Redirect to `dashboard.html` if complete

**Code:**
```javascript
// Check if profile is complete
if (!user.profileComplete) {
    showModal('success', 'Welcome!', 'Please complete your profile...', 
              '../trainee/pages/manage-profile.html?firstLogin=true');
} else {
    showModal('success', 'Login Successful!', 'Welcome back!', 
              '../trainee/pages/dashboard.html');
}
```

#### 2. `frontend/trainee/pages/manage-profile.html`
**Changes:**
- Added notification banner for required profile completion
- Update `profileComplete` flag when saving
- Update session storage with new data
- Redirect to dashboard after completion

**Code:**
```javascript
// Check if all required fields are filled
const isProfileComplete = firstName && lastName && phone && address;

// Update with profileComplete flag
body: JSON.stringify({
    firstName,
    lastName,
    phone,
    course,
    address,
    profileComplete: isProfileComplete
})

// Update session
userSession.profileComplete = isProfileComplete;
localStorage.setItem('userSession', JSON.stringify(userSession));

// Redirect if required
if ((urlParams.get('required') || urlParams.get('firstLogin')) && isProfileComplete) {
    alert('Profile completed! You can now enroll in courses.');
    window.location.href = 'dashboard.html';
}
```

#### 3. `frontend/trainee/assets/js/profile-guard.js` (NEW)
**Purpose:** Protect pages that require profile completion

**Features:**
- Checks if current page is protected
- Validates profile completion
- Shows modal if profile incomplete
- Provides options to go back or complete profile

**Protected Pages:**
- `assessment.html`
- `application-form.html`
- `admission-slip.html`
- `registration-form.html`

**Code:**
```javascript
function isProfileComplete() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address'];
    const hasAllFields = requiredFields.every(field => {
        const value = userSession[field];
        return value && value.trim() !== '';
    });
    
    if (userSession.profileComplete === false) {
        return false;
    }
    
    return hasAllFields;
}
```

#### 4. `frontend/trainee/pages/assessment.html`
**Changes:**
- Added Bootstrap JS (required for modal)
- Added profile-guard.js script

**Code:**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/profile-guard.js"></script>
```

#### 5. `frontend/trainee/pages/assessment/application-form.html`
**Changes:**
- Added Bootstrap JS (required for modal)
- Added profile-guard.js script

**Code:**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../../assets/js/profile-guard.js"></script>
```

## Database Schema

### TraineeAccount Model
Add `profileComplete` field:

```javascript
{
    accountId: String,
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    role: String,
    status: String,
    profileComplete: Boolean  // NEW FIELD
}
```

## User Experience

### First-Time User Journey

1. **Registration Page**
   - User fills basic info (name, email, password, address)
   - Clicks "Register"
   - Sees success message: "Account created. Please login."

2. **Login Page**
   - User enters credentials
   - Clicks "Login"
   - Sees message: "Welcome! Please complete your profile..."

3. **Manage Profile Page**
   - Yellow notification banner appears
   - Message: "Complete Your Profile - Please fill in all required information below to enroll in courses and submit applications."
   - User fills in phone number and any missing info
   - Clicks "Save Changes"
   - Sees success: "Profile completed! You can now enroll in courses."
   - Redirected to dashboard

4. **Dashboard**
   - User can now access all features
   - Can enroll in courses
   - Can submit applications

### Returning User Journey

1. **Login Page**
   - User enters credentials
   - Clicks "Login"
   - Sees message: "Welcome back! Redirecting to dashboard..."

2. **Dashboard**
   - Direct access to all features
   - No profile completion required

### Incomplete Profile Access Attempt

1. **User on Dashboard**
   - Clicks "Assessment" or "Application Form"

2. **Profile Guard Activates**
   - Modal appears: "Profile Incomplete"
   - Icon: Warning triangle
   - Message: "Before you can enroll in courses or submit applications, you need to complete your profile with all required information."
   - Required info listed:
     - Full Name
     - Email Address
     - Phone Number
     - Complete Address
   - Buttons:
     - "Go Back" - Returns to previous page
     - "Complete Profile" - Goes to manage-profile.html?required=true

3. **Complete Profile**
   - User clicks "Complete Profile"
   - Redirected to manage-profile page
   - Yellow banner shows
   - User fills missing info
   - Saves changes
   - Redirected back to dashboard
   - Can now access protected pages

## Testing Checklist

### Registration Flow
- [ ] Register new account
- [ ] Verify redirect to login page
- [ ] Login with new credentials
- [ ] Verify redirect to manage-profile with notification
- [ ] Complete profile
- [ ] Verify redirect to dashboard
- [ ] Verify can access assessment pages

### Profile Guard
- [ ] Create account with incomplete profile
- [ ] Login
- [ ] Try to access assessment.html
- [ ] Verify modal appears
- [ ] Click "Complete Profile"
- [ ] Verify redirect to manage-profile
- [ ] Complete profile
- [ ] Try to access assessment.html again
- [ ] Verify access granted

### Session Persistence
- [ ] Complete profile
- [ ] Logout
- [ ] Login again
- [ ] Verify direct access to dashboard
- [ ] Verify can access protected pages

## Configuration

### Add More Protected Pages

Edit `profile-guard.js`:

```javascript
const PROTECTED_PAGES = [
    'assessment.html',
    'application-form.html',
    'admission-slip.html',
    'registration-form.html',
    'your-new-page.html'  // Add here
];
```

### Change Required Fields

Edit `profile-guard.js`:

```javascript
const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'yourNewField'  // Add here
];
```

### Customize Modal

Edit `profile-guard.js` - `showProfileIncompleteModal()` function:

```javascript
const modalHTML = `
    <div class="modal-body text-center py-4">
        <h4 class="mt-3">Your Custom Title</h4>
        <p class="text-muted">
            Your custom message here
        </p>
    </div>
`;
```

## Troubleshooting

### Issue: User stuck in profile completion loop
**Solution:** Check if all required fields are being saved to database

### Issue: Profile guard not working
**Solution:** Verify Bootstrap JS is loaded before profile-guard.js

### Issue: Modal not showing
**Solution:** Check browser console for errors, ensure Bootstrap CSS is loaded

### Issue: Redirect not working after profile completion
**Solution:** Check URL parameters are being read correctly

## Future Enhancements

1. **Email Verification**
   - Require email verification before profile completion
   - Send verification link after registration

2. **Profile Completion Progress**
   - Show progress bar (e.g., "Profile 60% complete")
   - List missing fields

3. **Optional Fields**
   - Mark some fields as optional
   - Allow partial profile completion

4. **Profile Picture Requirement**
   - Require profile picture upload
   - Validate image size and format

5. **Document Upload**
   - Require ID or certificate upload
   - Validate document format

## Summary

The profile completion flow ensures that:
- ✅ New users complete their profile before accessing protected features
- ✅ Required information is collected from all trainees
- ✅ User experience is smooth and guided
- ✅ System maintains data integrity
- ✅ Protected pages are only accessible to users with complete profiles

This implementation provides a secure and user-friendly way to ensure all trainees have complete profiles before they can enroll in courses or submit applications.
