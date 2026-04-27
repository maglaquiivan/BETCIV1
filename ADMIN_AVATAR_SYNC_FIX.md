# Admin Avatar Sync Fix

## Problem
When an admin changes their profile picture in Settings, the avatar doesn't update on other pages (Dashboard, Competencies, etc.) until a hard refresh.

## Root Cause
The avatar caching mechanism wasn't properly clearing and updating the sessionStorage cache when a new profile picture was uploaded.

## Solution Applied

### 1. Enhanced Cache Management in Settings (settings.html)
**Location:** Lines 1249-1262

**Before:**
```javascript
if (response.ok) {
    // DO NOT store base64 in session - it causes 431 errors
    // Just update the display directly
    updateAvatarDisplays(base64Image);
    
    showNotification('Profile picture updated successfully', 'success');
}
```

**After:**
```javascript
if (response.ok) {
    // Clear the cached profile picture to force reload
    const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || '{}');
    if (userSession.accountId) {
        const cachedPictureKey = `adminProfilePic_${userSession.accountId}`;
        sessionStorage.removeItem(cachedPictureKey);
        console.log('Cleared cached profile picture');
    }
    
    // Update the cache with new image
    if (userSession.accountId) {
        const cachedPictureKey = `adminProfilePic_${userSession.accountId}`;
        sessionStorage.setItem(cachedPictureKey, base64Image);
        console.log('Updated cached profile picture');
    }
    
    // DO NOT store base64 in session - it causes 431 errors
    // Just update the display directly
    updateAvatarDisplays(base64Image);
    
    showNotification('Profile picture updated successfully', 'success');
}
```

**Changes:**
- Added explicit cache clearing before update
- Added explicit cache setting with new image
- Added console logging for debugging

### 2. Enhanced Logging in admin-dashboard.js
**Location:** Lines 978-995

**Added detailed logging:**
```javascript
console.log('Checking for cached profile picture:', cachedPictureKey);
console.log('Cached picture exists:', !!cachedPicture);

if (cachedPicture && cachedPicture.startsWith('data:')) {
    console.log('Using cached admin profile picture (length:', cachedPicture.length, ')');
    updateAllAvatarsWithImage(cachedPicture);
} else if (cachedPicture) {
    console.log('Cached picture exists but does not start with data:, ignoring');
}

console.log('Fetching admin profile from API:', userId);
```

**Location:** Lines 1034-1044

**Enhanced API response logging:**
```javascript
if (admin.profilePicture && admin.profilePicture.startsWith('data:')) {
    console.log('Updating admin profile picture from API (length:', admin.profilePicture.length, ')');
    sessionStorage.setItem(cachedPictureKey, admin.profilePicture);
    console.log('Cached profile picture updated in sessionStorage');
    updateAllAvatarsWithImage(admin.profilePicture);
} else if (admin.profilePicture) {
    console.log('Admin has profilePicture but it does not start with data:', admin.profilePicture.substring(0, 50));
} else {
    console.log('Admin has no profilePicture in database');
}
```

## How It Works

### Avatar Update Flow:
1. **User uploads new avatar in Settings**
   - Image converted to base64
   - Sent to backend via PUT request
   - Backend saves to MongoDB

2. **Settings page updates cache**
   - Clears old cache: `sessionStorage.removeItem(cachedPictureKey)`
   - Sets new cache: `sessionStorage.setItem(cachedPictureKey, base64Image)`
   - Updates current page display

3. **Other pages load avatar**
   - Check sessionStorage cache first (instant display)
   - Fetch from API to ensure latest version
   - Update cache if API returns newer version
   - Update all avatar elements on page

### Cache Key Format:
```javascript
const cachedPictureKey = `adminProfilePic_${userSession.accountId}`;
// Example: "adminProfilePic_ADM-001"
```

## Testing Steps

### 1. Upload New Avatar
1. Go to Settings page
2. Click "Change Photo"
3. Select an image (JPG/PNG, max 2MB)
4. Wait for success notification
5. Open browser console (F12)
6. Check for logs:
   ```
   Cleared cached profile picture
   Updated cached profile picture
   Profile picture updated successfully
   ```

### 2. Verify Cache Update
1. In console, run:
   ```javascript
   const session = JSON.parse(localStorage.getItem('userSession'));
   const key = `adminProfilePic_${session.accountId}`;
   const cached = sessionStorage.getItem(key);
   console.log('Cached avatar exists:', !!cached);
   console.log('Cached avatar length:', cached ? cached.length : 0);
   ```

### 3. Navigate to Other Pages
1. Go to Dashboard
2. Check console for logs:
   ```
   Checking for cached profile picture: adminProfilePic_ADM-001
   Cached picture exists: true
   Using cached admin profile picture (length: 50000)
   Fetching admin profile from API: ADM-001
   Updating admin profile picture from API (length: 50000)
   ```
3. Avatar should display immediately (from cache)
4. Avatar should update if API returns different version

### 4. Hard Refresh Test
1. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Cache is cleared
3. Avatar loads from API
4. Cache is repopulated

## Debugging

### If avatar still doesn't update:

1. **Check sessionStorage:**
   ```javascript
   // In browser console
   console.log(sessionStorage);
   ```
   Look for `adminProfilePic_ADM-XXX` key

2. **Check API response:**
   ```javascript
   // In browser console
   const session = JSON.parse(localStorage.getItem('userSession'));
   fetch(`http://localhost:5500/api/admin-accounts/${session.accountId}`)
     .then(r => r.json())
     .then(d => console.log('API profilePicture:', d.profilePicture ? 'EXISTS' : 'MISSING'));
   ```

3. **Check MongoDB:**
   ```javascript
   // In MongoDB shell or Compass
   db.adminaccounts.findOne({ accountId: "ADM-001" }, { profilePicture: 1 })
   ```

4. **Clear all caches manually:**
   ```javascript
   // In browser console
   sessionStorage.clear();
   localStorage.clear();
   location.reload();
   ```

## Files Modified
1. `frontend/admin/pages/settings.html` - Enhanced cache management
2. `frontend/admin/assets/js/admin-dashboard.js` - Enhanced logging

## Related Files
- `backend/routes/adminAccounts.js` - Handles PUT requests
- `backend/models/AdminAccount.js` - Defines schema
- All admin pages that display avatar

## Prevention
- Always clear cache before setting new value
- Always log cache operations for debugging
- Always fetch from API after using cache (ensures latest data)
- Never store large base64 in localStorage (use sessionStorage)

## Notes
- sessionStorage is cleared when tab/window closes
- localStorage persists across sessions
- Base64 images can be 50KB-500KB in size
- Cache key must match across all pages
