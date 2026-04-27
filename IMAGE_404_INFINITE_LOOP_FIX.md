# Image 404 Infinite Loop Fix

## Problem
The browser console was flooded with thousands of 404 errors for `logo.png` and equipment images, causing:
- Browser performance degradation
- Console becoming unusable
- Sentry error monitoring hitting resource limits
- Infinite loop of failed image loads

## Root Cause
The `onerror` handler in image tags was missing `this.onerror=null`, causing an infinite loop:
```html
<!-- WRONG - Creates infinite loop -->
<img src="${imageUrl}" onerror="this.src='/assets/img/logo.png'">
```

When the primary image failed to load, it tried to load the fallback. If the fallback also failed (due to incorrect path), it would trigger onerror again infinitely.

## Solution Applied

### 1. Fixed onerror Handler (Line 651)
**Before:**
```html
<img src="${imageUrl}" alt="${course.title || 'Course'}" onerror="this.src='/assets/img/logo.png'">
```

**After:**
```html
<img src="${imageUrl}" alt="${course.title || 'Course'}" 
     onerror="this.onerror=null; this.src='../../assets/img/logo.png'; this.style.objectFit='contain'; this.style.padding='20px';">
```

**Changes:**
- Added `this.onerror=null` to prevent infinite loop
- Fixed path from `/assets/` (absolute) to `../../assets/` (relative)
- Added styling for better fallback display

### 2. Fixed Image Path Mappings (Lines 603-607)
**Before:**
```javascript
const courseImages = {
    'forklift': '/assets/img/fork.png',
    'bulldozer': '/assets/img/bulldozer.png',
    'dump truck': '/assets/img/dump truck.png',
    'excavator': '/assets/img/hydraulic excavator.png'
};
```

**After:**
```javascript
const courseImages = {
    'forklift': '../../assets/img/fork.png',
    'bulldozer': '../../assets/img/bulldozer.png',
    'dump truck': '../../assets/img/dump truck.png',
    'excavator': '../../assets/img/hydraulic excavator.png'
};
```

### 3. Fixed Default Image Path (Line 612)
**Before:**
```javascript
let imageUrl = '/assets/img/logo.png';
```

**After:**
```javascript
let imageUrl = '../../assets/img/logo.png';
```

### 4. Fixed Path Conversion Logic (Lines 628-632)
**Before:**
```javascript
} else if (course.image.includes('/assets/img/')) {
    imageUrl = '/assets/img/' + course.image.split('/assets/img/')[1];
} else if (course.image.startsWith('/assets/')) {
    imageUrl = course.image;
```

**After:**
```javascript
} else if (course.image.includes('/assets/img/')) {
    imageUrl = '../../assets/img/' + course.image.split('/assets/img/')[1];
} else if (course.image.startsWith('/assets/')) {
    imageUrl = '../..' + course.image;
```

## Why This Happened
The file is located at `frontend/admin/pages/dashboard.html`, so:
- Absolute paths like `/assets/img/logo.png` don't work with Live Server
- Need relative paths: `../../assets/img/logo.png` (up 2 levels to frontend root)

## Path Structure
```
frontend/
├── assets/
│   └── img/
│       ├── logo.png ✓
│       ├── bulldozer.png ✓
│       ├── dump truck.png ✓
│       └── hydraulic excavator.png ✓
└── admin/
    └── pages/
        └── dashboard.html (current file)
```

From `dashboard.html` to `logo.png`: `../../assets/img/logo.png`

## Testing
1. Refresh the admin dashboard page
2. Open browser console (F12)
3. Verify no 404 errors for images
4. Check that course cards display images correctly
5. If an image fails, it should show the logo as fallback (only once)

## Files Modified
- `BETCIV1-main/frontend/admin/pages/dashboard.html`

## Related Issues
Similar fixes may be needed in:
- `frontend/trainee/pages/dashboard.html` (lines 591, 727)
- `frontend/trainee/assets/js/courses.js` (lines 192, 342)

## Prevention
Always include `this.onerror=null` in onerror handlers:
```html
<img src="image.png" onerror="this.onerror=null; this.src='fallback.png';">
```

This ensures the fallback is only attempted once, preventing infinite loops.
