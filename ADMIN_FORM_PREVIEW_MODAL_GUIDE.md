# Admin Form Preview Modal - Integration Guide

## Overview
This guide provides comprehensive instructions for integrating the Form Preview Modal into the admin dashboard. The modal displays submitted applications and admission slips in a read-only, print-friendly format.

## Features
✅ Full application form preview with all fields  
✅ Full admission slip preview with all fields  
✅ Professional styling consistent with trainee review modal  
✅ Display of uploaded pictures  
✅ Status badges and submission dates  
✅ Print-friendly layout  
✅ Responsive design for all screen sizes  
✅ Smooth animations and transitions  
✅ Organized sections with icons  
✅ Table views for work experience, training, licensure, and competency assessments  

## Files Created

### 1. JavaScript File
**Location:** `frontend/admin/assets/js/form-preview-modal.js`

**Functions:**
- `openApplicationPreview(applicationId)` - Opens application preview modal
- `openAdmissionPreview(admissionId)` - Opens admission slip preview modal
- `closeFormPreviewModal()` - Closes the modal
- `printFormPreview()` - Prints the current preview
- `buildApplicationPreviewHTML(app)` - Builds application preview HTML
- `buildAdmissionPreviewHTML(admission)` - Builds admission preview HTML

### 2. CSS File
**Location:** `frontend/admin/assets/css/form-preview-modal.css`

**Features:**
- Modal overlay with fade-in animation
- Responsive grid layouts
- Print-friendly styles
- Custom scrollbar styling
- Status badge colors
- Table styling
- Mobile-responsive design

### 3. HTML Template
**Location:** `frontend/admin/components/form-preview-modal.html`

**Contains:**
- Modal structure with header, body, and footer
- Close button
- Print button
- Usage instructions

## Integration Steps

### Step 1: Add CSS Link
Add this to the `<head>` section of your admin dashboard HTML file:

```html
<link rel="stylesheet" href="path/to/admin/assets/css/form-preview-modal.css">
```

### Step 2: Include Modal Template
Add this before the closing `</body>` tag in your admin dashboard HTML:

```html
<!-- Form Preview Modal -->
<div id="formPreviewModal" class="form-preview-modal-overlay">
    <div class="form-preview-modal">
        <!-- Modal Header -->
        <div class="form-preview-header">
            <div class="form-preview-header-info">
                <!-- Header content will be populated by JavaScript -->
            </div>
            <button class="form-preview-close" onclick="closeFormPreviewModal()" title="Close">×</button>
        </div>

        <!-- Modal Body -->
        <div class="form-preview-body">
            <!-- Content will be populated by JavaScript -->
        </div>

        <!-- Modal Footer -->
        <div class="form-preview-footer">
            <button type="button" class="preview-action-btn preview-print-btn" onclick="printFormPreview()">
                <i class="bi bi-printer"></i> Print
            </button>
            <button type="button" class="preview-action-btn preview-close-btn" onclick="closeFormPreviewModal()">
                <i class="bi bi-x-circle"></i> Close
            </button>
        </div>
    </div>
</div>
```

### Step 3: Include JavaScript File
Add this before the closing `</body>` tag:

```html
<script src="path/to/admin/assets/js/form-preview-modal.js"></script>
```

### Step 4: Add View Details Buttons
Update your application and admission records table to include "View Details" buttons:

#### For Applications:
```html
<button onclick="openApplicationPreview('${application._id}')" class="btn btn-sm btn-info">
    <i class="bi bi-eye"></i> View Details
</button>
```

#### For Admissions:
```html
<button onclick="openAdmissionPreview('${admission._id}')" class="btn btn-sm btn-info">
    <i class="bi bi-eye"></i> View Details
</button>
```

## Application Form Preview Sections

The application preview displays the following sections:

1. **Application Information**
   - Application ID
   - Course/Assessment
   - School/Training Center
   - Assessment Type
   - Date of Application
   - Reference Number

2. **Personal Information**
   - Surname, First Name, Middle Name
   - Sex, Date of Birth, Age
   - Civil Status, Birth Place
   - Photograph (if available)

3. **Address**
   - Street Address
   - Barangay, District
   - City/Municipality
   - Province, Region
   - ZIP Code

4. **Contact Information**
   - Telephone
   - Mobile
   - Email
   - Fax

5. **Education & Employment**
   - Highest Educational Attainment
   - Employment Status

6. **Work Experience** (if available)
   - Table with: Company Name, Position, Dates, Years, Status

7. **Training & Seminars** (if available)
   - Table with: Title, Venue, Dates, Hours, Conducted By

8. **Licensure Examinations** (if available)
   - Table with: Title, Year, Venue, Rating, Remarks

9. **Competency Assessments** (if available)
   - Table with: Title, Qualification Level, Industry Sector, Certificate #, Date

10. **Signature** (if available)
    - Signature image display

## Admission Slip Preview Sections

The admission preview displays the following sections:

1. **Admission Information**
   - Admission ID
   - Assessment Applied
   - Official Receipt Number
   - Date Issued
   - Assessment Center

2. **Applicant Information**
   - Applicant Name
   - Telephone Number
   - Photograph (if available)

3. **Assessment Schedule**
   - Assessment Date
   - Assessment Time

4. **Requirements Checklist**
   - Self Assessment Guide (checked/unchecked)
   - Passport Pictures (checked/unchecked)

5. **Remarks**
   - Bring PPE (checked/unchecked)
   - Others (with specification if checked)

## Styling Features

### Status Badges
- **Pending:** Yellow background
- **Approved:** Green background
- **Rejected:** Red background
- **Confirmed:** Green background
- **Completed:** Green background
- **Cancelled:** Red background

### Color Scheme
- Primary Color: #E67E22 (Orange)
- Secondary Color: #d35400 (Dark Orange)
- Success: #4CAF50 (Green)
- Info: #2196F3 (Blue)
- Danger: #dc3545 (Red)
- Background: #f5f5f5 (Light Gray)

### Responsive Breakpoints
- Desktop: Full layout with multi-column grids
- Tablet (≤768px): Single column layout
- Mobile (≤480px): Optimized for small screens

## Print Functionality

The modal includes a print button that:
- Opens a print preview window
- Applies print-specific styles
- Hides unnecessary UI elements
- Optimizes layout for paper
- Supports page breaks for long content

### Print Styles Applied:
- White background
- Optimized margins
- Page break handling
- Hidden buttons and controls
- Readable font sizes

## API Integration

The modal functions expect the following API endpoints:

### Get Applications
```
GET /api/applications
Response: Array of application objects
```

### Get Admissions
```
GET /api/admissions
Response: Array of admission objects
```

The functions search for records by `_id` or `applicationId`/`admissionId`.

## Customization

### Changing Colors
Edit `form-preview-modal.css` and update:
- `#E67E22` - Primary orange color
- `#d35400` - Dark orange color
- `#4CAF50` - Green color
- `#2196F3` - Blue color

### Changing Grid Layout
Modify the `preview-grid` class in CSS:
```css
.preview-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
```

### Adding New Sections
Edit `buildApplicationPreviewHTML()` or `buildAdmissionPreviewHTML()` functions to add new sections.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Limited support (no animations)

## Accessibility Features

- Semantic HTML structure
- ARIA labels for icons
- Keyboard navigation support
- High contrast text
- Clear visual hierarchy
- Readable font sizes

## Performance Considerations

- Modal content is generated on-demand
- Images are displayed as base64 (already in database)
- Smooth animations use CSS transforms
- Efficient grid layouts
- Minimal DOM manipulation

## Troubleshooting

### Modal Not Opening
- Check that `API_BASE_URL` is defined globally
- Verify the application/admission ID is correct
- Check browser console for errors

### Images Not Displaying
- Ensure images are stored as base64 in database
- Check that `profile.picture` or `admission.picture` fields exist
- Verify image data is not corrupted

### Print Not Working
- Check browser print settings
- Ensure pop-ups are not blocked
- Try different print destination (PDF, printer)

### Styling Issues
- Clear browser cache
- Verify CSS file is loaded (check Network tab)
- Check for CSS conflicts with other stylesheets

## Example Implementation

```html
<!-- In your admin records table -->
<table class="table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>APP-001</td>
            <td>John Doe</td>
            <td><span class="badge bg-warning">Pending</span></td>
            <td>
                <button onclick="openApplicationPreview('${app._id}')" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i> View
                </button>
            </td>
        </tr>
    </tbody>
</table>

<!-- Include modal -->
<div id="formPreviewModal" class="form-preview-modal-overlay">
    <!-- Modal content here -->
</div>

<!-- Include scripts -->
<script src="admin/assets/js/form-preview-modal.js"></script>
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify API endpoints are working
4. Check that all files are properly linked

## Version History

- v1.0 (Initial Release)
  - Application form preview
  - Admission slip preview
  - Print functionality
  - Responsive design
  - Status badges
  - Picture display
