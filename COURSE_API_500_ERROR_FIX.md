# Course API 500 Error Fix

## Problem
Getting 500 Internal Server Error when trying to access courses by ID:
```
GET http://localhost:5500/api/courses/69 - 500 (Internal Server Error)
```

## Root Cause
The backend was trying to use `findById()` with non-ObjectId values like "69", which caused MongoDB to throw an error. MongoDB ObjectIds must be 24-character hexadecimal strings (e.g., "507f1f77bcf86cd799439011"), but numeric courseIds like "69" are not valid ObjectIds.

The code was calling:
```javascript
course = await Course.findById(req.params.id); // Throws error if id is not valid ObjectId
```

## Solution
Added validation to check if the ID is a valid MongoDB ObjectId before attempting to use `findById()`:

```javascript
// Only try findById if the ID is a valid ObjectId format
if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
  try {
    course = await Course.findById(req.params.id);
  } catch (err) {
    console.log('Error finding by ObjectId:', err.message);
  }
}
```

## Changes Made

### 1. GET /api/courses/:id
**Before:**
```javascript
course = await Course.findOne({ courseId: req.params.id });
if (!course) {
  course = await Course.findById(req.params.id); // Could throw error
}
```

**After:**
```javascript
course = await Course.findOne({ courseId: req.params.id });
if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
  try {
    course = await Course.findById(req.params.id);
  } catch (err) {
    console.log('Error finding by ObjectId:', err.message);
  }
}
```

### 2. PUT /api/courses/:id
**Before:**
```javascript
course = await Course.findOneAndUpdate({ courseId: req.params.id }, ...);
if (!course) {
  course = await Course.findByIdAndUpdate(req.params.id, ...); // Could throw error
}
```

**After:**
```javascript
course = await Course.findOneAndUpdate({ courseId: req.params.id }, ...);
if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
  try {
    course = await Course.findByIdAndUpdate(req.params.id, ...);
  } catch (err) {
    console.log('Error updating by ObjectId:', err.message);
  }
}
```

### 3. DELETE /api/courses/:id
**Before:**
```javascript
course = await Course.findOneAndDelete({ courseId: req.params.id });
if (!course) {
  course = await Course.findByIdAndDelete(req.params.id); // Could throw error
}
```

**After:**
```javascript
course = await Course.findOneAndDelete({ courseId: req.params.id });
if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
  try {
    course = await Course.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log('Error deleting by ObjectId:', err.message);
  }
}
```

## How It Works

### ID Validation Flow:
1. **First attempt:** Try to find by `courseId` field (e.g., "69", "COURSE-001")
2. **Check validity:** If not found, check if ID is a valid MongoDB ObjectId format
3. **Second attempt:** Only if valid, try to find by MongoDB `_id`
4. **Error handling:** Wrap in try-catch to prevent 500 errors
5. **Return 404:** If still not found, return 404 instead of 500

### Valid ObjectId Examples:
- ✅ `507f1f77bcf86cd799439011` (24 hex characters)
- ✅ `5f8d0d55b54764421b7156c9`
- ❌ `69` (too short, not hex)
- ❌ `COURSE-001` (not hex format)

## Benefits
- ✅ No more 500 errors for invalid ObjectId formats
- ✅ Proper 404 responses when course not found
- ✅ Better error logging for debugging
- ✅ Supports both courseId and MongoDB _id lookups
- ✅ Graceful fallback behavior

## Testing

### Test with courseId:
```bash
GET http://localhost:5500/api/courses/69
# Should return course if exists, or 404 if not found
```

### Test with MongoDB ObjectId:
```bash
GET http://localhost:5500/api/courses/507f1f77bcf86cd799439011
# Should return course if exists, or 404 if not found
```

### Test with invalid ID:
```bash
GET http://localhost:5500/api/courses/invalid-id
# Should return 404, not 500
```

## Files Modified
- `backend/routes/courses.js` - Added ObjectId validation for GET, PUT, DELETE routes

## Related
- MongoDB ObjectId documentation: https://docs.mongodb.com/manual/reference/method/ObjectId/
- Mongoose Types.ObjectId.isValid(): https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-isValidObjectId

## Notes
- The `courseId` field is a custom string field (e.g., "69", "COURSE-001")
- The `_id` field is MongoDB's auto-generated ObjectId
- Both are supported for lookups, but validation prevents errors
- Always try `courseId` first as it's the primary identifier
