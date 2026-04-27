# Quick Test Guide - Avatar Sync Fix

## What Was Fixed
Admin avatar now syncs correctly across all pages after upload in Settings.

## Quick Test (30 seconds)

### Step 1: Upload Avatar
1. Go to **Settings** page
2. Click **"Change Photo"**
3. Select an image
4. Wait for success message

### Step 2: Navigate to Dashboard
1. Click **Dashboard** in sidebar (within 5 seconds of upload)
2. Avatar should display correctly!

### Step 3: Check Console (Optional)
Press **F12** to open console, you should see:
```
✓ Using cached admin profile picture
✓ Cache is fresh, skipping API call
```

## If Avatar Doesn't Show

### Quick Fix:
1. Open console (F12)
2. Type: `refreshAvatar()`
3. Press Enter
4. Avatar should load from API

### Check Cache:
```javascript
const session = JSON.parse(localStorage.getItem('userSession'));
const key = `adminProfilePic_${session.accountId}`;
console.log('Cached:', !!sessionStorage.getItem(key));
```

### Check API:
```javascript
const session = JSON.parse(localStorage.getItem('userSession'));
fetch(`http://localhost:5500/api/admin-accounts/${session.accountId}`)
  .then(r => r.json())
  .then(d => console.log('API has avatar:', !!d.profilePicture));
```

## How It Works

### The Magic:
- **Upload** → Cache updated with timestamp
- **Navigate** (< 5 sec) → Uses cache, skips API
- **Navigate** (> 5 sec) → Uses cache, then verifies with API

### Cache Lifetime:
- **Fresh:** < 5 seconds (trusted, no API call)
- **Stale:** ≥ 5 seconds (verified with API)

## Console Commands

```javascript
// Manual refresh
refreshAvatar()

// Check cache age
const session = JSON.parse(localStorage.getItem('userSession'));
const key = `adminProfilePic_${session.accountId}`;
const ts = sessionStorage.getItem(`${key}_timestamp`);
console.log('Age:', (Date.now() - parseInt(ts)) / 1000, 'seconds');

// Clear cache
sessionStorage.clear();
```

## Expected Console Output

### After Upload (Settings):
```
✓ Cleared cached profile picture
✓ Updated cached profile picture with timestamp
Profile picture updated successfully
```

### After Navigation (Dashboard):
```
=== AVATAR LOADING DEBUG ===
User ID: ADM-001
Cache key: adminProfilePic_ADM-001
Cached picture exists: true
Cache timestamp: 1713724800000
✓ Using cached admin profile picture (length: 123456)
Cache age (ms): 2341
✓ Cache is fresh, skipping API call
```

## Success Indicators

✓ Avatar shows in Settings after upload
✓ Avatar shows in Dashboard after navigation
✓ Avatar shows in Competencies after navigation
✓ Console shows "Cache is fresh, skipping API call"
✓ No 404 or 500 errors in console

## Files Changed
- `frontend/admin/assets/js/admin-dashboard.js` - Smart cache logic
- `frontend/admin/pages/settings.html` - Timestamp tracking

## Full Documentation
See `ADMIN_AVATAR_SYNC_FINAL_FIX.md` for complete technical details.
