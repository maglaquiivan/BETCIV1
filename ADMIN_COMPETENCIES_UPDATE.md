# Admin Competencies Display Update

## Summary
Updated the admin competencies display in `training-catalog.html` to match the trainee format with image-based cards, while maintaining Edit and Delete functionality for administrators.

## Changes Made

### 1. Competency Card Display Format
- **Image Display**: Added 200px height image at the top of each card with level-based color gradient background
- **Level Colors**:
  - NC I: Blue (#3498db)
  - NC II: Orange (#E67E22)
  - NC III: Purple (#9b59b6)
  - NC IV: Red (#e74c3c)
- **Card Structure**:
  - Image at top (200px height)
  - Title with level badge
  - Competency code (orange color)
  - Description text
  - Units of Competency list (first 3 with "+X more" indicator)
  - Hours and credits display
  - Edit and Delete buttons at bottom

### 2. Image Path Handling
Added comprehensive image path handling to support:
- Base64 data URLs (use as-is)
- Full HTTP URLs (use as-is)
- Absolute paths starting with `/assets/`
- Relative paths with `../`
- Filename-only paths (add default path)

### 3. Edit Functionality Fix
- **Previous Issue**: Edit function was trying to extract data from card HTML using unreliable selectors
- **Solution**: Changed to fetch competency data directly from API using competency ID
- **Benefits**:
  - More reliable data retrieval
  - Ensures all fields are populated correctly
  - Handles missing fields gracefully
  - Pre-fills form with existing data (doesn't clear fields)

### 4. Data ID Handling
- Fixed competency ID storage to support both `_id` (MongoDB) and `competencyId` formats
- Added fallback code generation for competencies without codes

### 5. Hover Effects
Added interactive hover effects to competency cards:
- Transform: translateY(-4px) on hover
- Enhanced shadow on hover
- Orange border highlight on hover

## Files Modified
- `BETCIV1-main/frontend/admin/pages/training-catalog.html`

## Key Features

### Admin View (with Edit/Delete)
- Full CRUD operations available
- Edit button opens modal with pre-filled data
- Delete button requires confirmation
- Image upload/management capability

### Trainee View (view-only)
- Same visual format as admin
- No Edit/Delete buttons
- Read-only access to competency information

## Testing Checklist
- [ ] Verify competencies display with images correctly
- [ ] Test Edit button - modal should open with pre-filled data
- [ ] Test Delete button - confirmation modal should appear
- [ ] Verify hover effects work on competency cards
- [ ] Check image display for different image formats (base64, URLs, paths)
- [ ] Confirm units list displays correctly (first 3 + count)
- [ ] Verify hours and credits display accurately

## Technical Details

### API Endpoints Used
- `GET /api/competencies` - Load all competencies
- `GET /api/competencies/:id` - Load single competency for editing
- `GET /api/courses` - Load courses for dropdown

### Data Structure
```javascript
{
  _id: "competency_id",
  competencyId: "optional_custom_id",
  code: "COMP-CODE",
  title: "Competency Title",
  description: "Description text",
  level: "NC II",
  status: "Active",
  courseName: "Course Name",
  image: "image_url_or_base64",
  units: [
    {
      unitCode: "UNIT-001",
      unitTitle: "Unit Title",
      hours: 40,
      credits: 3
    }
  ]
}
```

## Next Steps
1. Test the Edit functionality to ensure form pre-fills correctly
2. Test the Delete functionality with confirmation
3. Verify image display across different competencies
4. Ensure hover effects work smoothly
5. Test on different screen sizes for responsiveness
