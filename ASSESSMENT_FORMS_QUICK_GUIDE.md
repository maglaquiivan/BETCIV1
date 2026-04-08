# Assessment Forms - Quick Reference Guide

## 📁 File Structure

```
trainee/
├── pages/
│   └── assessment/
│       ├── admission-slip.html       ✅ Updated
│       ├── application-form.html     ✅ Updated
│       └── registration-form.html    ✅ Updated
└── assets/
    ├── css/
    │   ├── dashboard.css             (Shared)
    │   ├── styles.css                (Shared)
    │   ├── admission-slip.css        (Form-specific)
    │   ├── application-form.css      (Form-specific)
    │   └── registration-form.css     (Form-specific)
    └── js/
        ├── common.js                 (Shared)
        ├── mobile-menu.js            (Shared)
        ├── admission-slip.js         (Form-specific)
        ├── application-form.js       (Form-specific)
        └── registration-form.js      (Form-specific)
```

## 🔗 Connected Files

### Each Form Now Includes:

**CSS (3 files):**
1. `dashboard.css` - Main dashboard theme
2. `styles.css` - Common trainee styles
3. `[form-name].css` - Form-specific styles

**JavaScript (3 files):**
1. `common.js` - Shared functionality
2. `mobile-menu.js` - Mobile navigation
3. `[form-name].js` - Form-specific logic

## 🎨 What's Included

### From `common.js`:
- 🌙 Dark mode toggle
- 👤 User profile dropdown
- 🚪 Logout functionality
- 📱 Responsive helpers
- 🔔 Toast notifications

### From `mobile-menu.js`:
- 📱 Mobile sidebar toggle
- 🍔 Hamburger menu
- 👆 Touch-friendly navigation
- 💾 Menu state persistence

### From Form-Specific JS:
- ✅ Form validation
- 💾 Auto-save
- 📤 File uploads
- 🔢 Reference number formatting
- 📨 Form submission

## 🚀 Quick Test

### 1. Open a Form
```
http://localhost:5500/trainee/pages/assessment/admission-slip.html
```

### 2. Check Console
- No 404 errors
- No JavaScript errors
- "Common trainee scripts loaded" message

### 3. Test Features
- [ ] Dark mode toggle works
- [ ] Mobile menu opens/closes
- [ ] Form fields are styled
- [ ] Validation works
- [ ] Submit button functions

## 📝 Path Reference

From `assessment/` folder to `assets/`:
```
../../assets/css/dashboard.css
../../assets/js/common.js
```

From `pages/` folder to `assets/`:
```
../assets/css/dashboard.css
../assets/js/common.js
```

## 🔧 Common Issues

### CSS Not Loading?
```html
<!-- Check path uses ../../ from assessment folder -->
<link rel="stylesheet" href="../../assets/css/dashboard.css" />
```

### JS Not Working?
```html
<!-- Ensure common.js loads first -->
<script src="../../assets/js/common.js"></script>
<script src="../../assets/js/mobile-menu.js"></script>
<script src="../../assets/js/[form-name].js"></script>
```

### Dark Mode Not Persisting?
- Check `common.js` is loaded
- Verify localStorage is enabled
- Clear browser cache

## ✅ Verification Checklist

- [ ] All 3 forms load without errors
- [ ] Dark mode works on all forms
- [ ] Mobile menu functions correctly
- [ ] Forms are styled consistently
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Form validation works
- [ ] File uploads function

## 📱 Mobile Testing

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test:
   - Hamburger menu
   - Form responsiveness
   - Touch interactions
   - No horizontal scroll

## 🎯 Key Changes

### Before:
- Used old vendor paths
- Inconsistent styling
- No dark mode
- No mobile menu

### After:
- Unified asset paths
- Consistent theme
- Dark mode enabled
- Mobile-friendly

## 📊 Status

| Form | CSS | JS | Dark Mode | Mobile | Status |
|------|-----|----|-----------| -------|--------|
| Admission Slip | ✅ | ✅ | ✅ | ✅ | Complete |
| Application Form | ✅ | ✅ | ✅ | ✅ | Complete |
| Registration Form | ✅ | ✅ | ✅ | ✅ | Complete |

## 🔗 Related Files

- `ASSESSMENT_FORMS_INTEGRATION.md` - Detailed documentation
- `COMMON_JS_SETUP.md` - Common.js documentation
- `MOBILE_MENU_IMPLEMENTATION.md` - Mobile menu guide

---

**All assessment forms are now fully integrated with the trainee dashboard!** 🎉
