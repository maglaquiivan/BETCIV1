# Quick Test Guide - Form Preview Modal

## 5-Minute Test

### 1. Open Records Page
- Navigate to Admin > Records
- Should load without errors

### 2. Test Application Preview
- Click "Application" tab
- Click "Preview" on any application
- Modal should open with form data
- Click "Print" button
- Click "Close" button

### 3. Test Admission Preview
- Click "Admission" tab
- Click "Preview" on any admission
- Modal should open with admission data
- Click "Print" button
- Click "Close" button

### 4. Verify No Errors
- Open browser console (F12)
- Should see no errors related to form preview modal
- Should see applications and admissions loaded

## What to Look For

✅ **Modal Opens**
- Smooth animation
- Content displays correctly
- No layout issues

✅ **Data Displays**
- All form sections visible
- Data matches database
- Status badges show correctly

✅ **Buttons Work**
- Print button opens print dialog
- Close button closes modal
- Clicking outside closes modal

✅ **No Errors**
- Console shows no errors
- API calls succeed
- Data loads properly

## If Something Doesn't Work

### Modal Doesn't Open
- Check browser console for errors
- Verify form-preview-modal.js is loaded
- Check if API endpoints are working

### Data Doesn't Display
- Check if API returns data
- Verify database has records
- Check browser console for fetch errors

### Print Doesn't Work
- Check browser pop-up settings
- Try different browser
- Check if CSS is loading

### Styling Looks Wrong
- Clear browser cache (Ctrl+Shift+R)
- Check if CSS file is loaded
- Verify dark mode isn't interfering

## Success Criteria

✅ Records page loads
✅ Applications tab shows data
✅ Admissions tab shows data
✅ Preview modal opens
✅ Form data displays correctly
✅ Print button works
✅ Close button works
✅ No console errors

## Files to Check

1. **records.html** - Main page
2. **form-preview-modal.js** - Modal logic
3. **form-preview-modal.css** - Modal styling
4. **Browser Console** - For errors

## API Endpoints to Verify

```
GET http://localhost:5500/api/applications
GET http://localhost:5500/api/admissions
```

Both should return arrays of records.

## Done! ✅

If all tests pass, the form preview modal is working correctly and ready for production use.

