# Quick Fix Guide - Common Errors

## 🚨 Error: 431 Request Header Fields Too Large

**Symptoms:**
- Console shows: `Z:1 Failed to load resource: 431`
- Console shows: `9k=:1 Failed to load resource: 431`
- Page loads slowly or not at all
- `ERR_CONNECTION_RESET` errors

**Quick Fix:**
```
Navigate to: http://localhost:5500/fix-431-error.html
Click: "Fix Storage Now"
```

**What it does:** Removes large Base64 images from browser storage

**Read more:** `431_ERROR_FIX.md`

---

## 🚨 Error: 404 Not Found (Cryptic Names)

**Symptoms:**
- Console shows: `9k=:1 Failed to load resource: 404`
- Console shows: `Z:1 Failed to load resource: 404`
- Random characters in error messages

**Quick Fix:**
```
Navigate to: http://localhost:5500/clear-cache.html?auto
```

**What it does:** Clears all browser cache and storage

**Read more:** `404_ERROR_FIX.md`

---

## 🚨 Error: Base64 Image Not Displaying

**Symptoms:**
- Images show broken icon
- Console shows: `http://localhost:5500/admin/pages/image/jpeg;base64,...`
- Console shows: `GET http://localhost:5500/image/jpeg;base64,... ERR_CONNECTION_RESET`
- 404 error for image paths

**Quick Fix:**

**Step 1: Fix Database (Important!)**
```
Windows: Double-click FIX-DATABASE-IMAGES.bat
Command: cd backend && node scripts/fixBase64Images.js
```

**Step 2: Clear Browser Storage**
```
Navigate to: http://localhost:5500/fix-431-error.html
Click: "Fix Storage Now"
```

**Step 3: Reload Page**

**What was fixed:** 
- Added `data:` prefix to Base64 image strings in code
- Database migration script to fix existing data

**Read more:** `BASE64_IMAGE_404_FIX.md`

---

## 🚨 Error: Session/Login Issues

**Symptoms:**
- Can't stay logged in
- Session expires immediately
- Login redirects to login page

**Quick Fix:**
```
Navigate to: http://localhost:5500/clear-session.html
```

**What it does:** Clears corrupted session data

**Read more:** `CLEAR-SESSION-FIX.md`

---

## 🛠️ Universal Fix (Nuclear Option)

If nothing else works:

### Method 1: Browser Console
Press F12, paste this, press Enter:
```javascript
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### Method 2: Browser Settings
1. Press `Ctrl + Shift + Delete`
2. Select "All time"
3. Check all boxes
4. Click "Clear data"
5. Reload page

---

## 📋 Error Decision Tree

```
Is the error code 431?
├─ YES → Use fix-431-error.html
└─ NO
   └─ Is it 404 with weird names (Z:1, 9k=)?
      ├─ YES → Use clear-cache.html
      └─ NO
         └─ Is it about images not loading?
            ├─ YES → Check BASE64_IMAGE_404_FIX.md
            └─ NO → Try universal fix above
```

---

## 🔧 Available Fix Tools

| Tool | URL | Purpose |
|------|-----|---------|
| **431 Fix** | `/fix-431-error.html` | Remove large Base64 from storage |
| **Cache Clear** | `/clear-cache.html` | Clear all cache and storage |
| **Session Clear** | `/clear-session.html` | Fix session issues |

### Auto-Fix Mode
Add `?auto` to any URL for automatic fixing:
- `http://localhost:5500/fix-431-error.html?auto`
- `http://localhost:5500/clear-cache.html?auto`

---

## 📚 Detailed Documentation

| Error Type | Documentation File |
|------------|-------------------|
| 431 Errors | `431_ERROR_FIX.md` |
| 404 Errors | `404_ERROR_FIX.md` |
| Base64 Images | `BASE64_IMAGE_404_FIX.md` |
| Session Issues | `CLEAR-SESSION-FIX.md` |
| Blur/UI Issues | `BLUR_FIX_SUMMARY.md` |

---

## 🎯 Prevention Tips

### For Users
1. Don't upload profile pictures larger than 500KB
2. Clear browser cache weekly
3. Use modern browsers (Chrome, Edge, Firefox)
4. Keep browser updated

### For Developers
1. ❌ Never store Base64 images in localStorage/sessionStorage
2. ✅ Store images in database, reference by URL
3. ✅ Use proper data URLs: `data:image/jpeg;base64,...`
4. ✅ Add cleanup code to remove old Base64 data

---

## 🆘 Still Having Issues?

1. Check if server is running: `http://localhost:5500`
2. Try incognito/private browsing mode
3. Disable browser extensions temporarily
4. Check browser console for specific error messages
5. Refer to detailed documentation files above
