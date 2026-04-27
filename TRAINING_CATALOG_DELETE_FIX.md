# Training Catalog Delete Course Fix

## Problem
When trying to delete a course from the training catalog, the API was returning a 500 error:
```
DELETE http://localhost:5500/api/courses/69 500 (Internal Server Error)
```

## Root Cause
The `confirmDelete()` function was converting the courseId to an integer using `parseInt()`:
```javascript
const courseId = parseInt(currentDeleteCard.dataset.courseId);
```

This converted MongoDB ObjectIds (like "507f1f77bcf86cd799439011") to just "507", which is not a valid course ID.

## Solution
Removed the `parseInt()` conversion to preserve the actual courseId:

**Before:**
```javascript
const courseId = parseInt(currentDeleteCard.dataset.courseId);
```

**After:**
```javascript
const courseId = currentDeleteCard.dataset.courseId;
```

## How It Works

### Course Card Creation:
```javascript
card.dataset.courseId = course._id || course.courseId || course.id;
```
Sets the courseId to the actual MongoDB ObjectId (e.g., "507f1f77bcf86cd799439011")

### Delete Confirmation:
```javascript
const courseId = currentDeleteCard.dataset.courseId;
```
Now correctly retrieves the full courseId without truncation

### API Call:
```javascript
fetch(API_BASE_URL + '/courses/' + courseId, { method: 'DELETE' })
```
Sends the correct courseId to the backend

## Files Modified
- `frontend/admin/pages/training-catalog.html` - Line 603

## Testing

### Before Fix:
1. Click delete on any course
2. Confirm deletion
3. Error: `DELETE /api/courses/69 500`

### After Fix:
1. Click delete on any course
2. Confirm deletion
3. Success: Course deleted successfully ✓

## Verification

Check the browser console:
- Should see no 500 errors
- Should see success notification
- Course should be removed from the list

## Related Code

### Backend Validation (already in place):
```javascript
// Delete course
router.delete('/:id', async (req, res) => {
  try {
    let course;
    
    // Try to find and delete by courseId first
    course = await Course.findOneAndDelete({ courseId: req.params.id });
    
    // If not found and ID looks like a MongoDB ObjectId, try that
    if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
      try {
        course = await Course.findByIdAndDelete(req.params.id);
      } catch (err) {
        console.log('Error deleting by ObjectId:', err.message);
      }
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted', success: true });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: error.message });
  }
});
```

## Why This Matters

### Data Integrity:
- Ensures correct course is deleted
- Prevents accidental deletion of wrong courses

### API Compatibility:
- Works with MongoDB ObjectIds
- Works with custom courseIds
- Handles both formats correctly

### User Experience:
- Delete operations now work correctly
- No more confusing 500 errors
- Proper success/error feedback

## Summary

Simple one-line fix that removes unnecessary type conversion, allowing the correct courseId to be sent to the API for deletion.

**Change:** Remove `parseInt()` wrapper
**Impact:** Delete course functionality now works correctly
**Status:** ✓ Fixed
