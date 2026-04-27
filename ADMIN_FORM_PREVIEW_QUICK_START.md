# Admin Form Preview Modal - Quick Start

## 3-Step Integration

### Step 1: Add CSS Link (in `<head>`)
```html
<link rel="stylesheet" href="admin/assets/css/form-preview-modal.css">
```

### Step 2: Add Modal HTML (before `</body>`)
```html
<div id="formPreviewModal" class="form-preview-modal-overlay">
    <div class="form-preview-modal">
        <div class="form-preview-header">
            <div class="form-preview-header-info"></div>
            <button class="form-preview-close" onclick="closeFormPreviewModal()">×</button>
        </div>
        <div class="form-preview-body"></div>
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

### Step 3: Add JavaScript (before `</body>`)
```html
<script src="admin/assets/js/form-preview-modal.js"></script>
```

## Usage

### View Application
```html
<button onclick="openApplicationPreview('${application._id}')">
    <i class="bi bi-eye"></i> View Details
</button>
```

### View Admission
```html
<button onclick="openAdmissionPreview('${admission._id}')">
    <i class="bi bi-eye"></i> View Details
</button>
```

### Close Modal
```javascript
closeFormPreviewModal();
```

### Print Preview
```javascript
printFormPreview();
```

## Features at a Glance

✅ **Application Preview**
- All personal information
- Address details
- Contact information
- Education & employment
- Work experience table
- Training & seminars table
- Licensure exams table
- Competency assessments table
- Signature display
- Uploaded photo

✅ **Admission Preview**
- Admission information
- Applicant details
- Assessment schedule
- Requirements checklist
- Remarks section
- Uploaded photo

✅ **UI Features**
- Status badges (Pending, Approved, Rejected, etc.)
- Submission date display
- Print button
- Close button
- Responsive design
- Smooth animations
- Professional styling

## File Locations

```
frontend/admin/
├── assets/
│   ├── css/
│   │   └── form-preview-modal.css
│   └── js/
│       └── form-preview-modal.js
└── components/
    └── form-preview-modal.html
```

## Example: Records Table Integration

```html
<table class="table table-hover">
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <!-- Applications -->
        <tr>
            <td>APP-001</td>
            <td>John Doe</td>
            <td>Application</td>
            <td><span class="badge bg-warning">Pending</span></td>
            <td>2024-01-15</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="openApplicationPreview('${app._id}')">
                    <i class="bi bi-eye"></i> View
                </button>
            </td>
        </tr>
        
        <!-- Admissions -->
        <tr>
            <td>ADM-001</td>
            <td>Jane Smith</td>
            <td>Admission</td>
            <td><span class="badge bg-success">Confirmed</span></td>
            <td>2024-01-16</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="openAdmissionPreview('${adm._id}')">
                    <i class="bi bi-eye"></i> View
                </button>
            </td>
        </tr>
    </tbody>
</table>

<!-- Modal -->
<div id="formPreviewModal" class="form-preview-modal-overlay">
    <div class="form-preview-modal">
        <div class="form-preview-header">
            <div class="form-preview-header-info"></div>
            <button class="form-preview-close" onclick="closeFormPreviewModal()">×</button>
        </div>
        <div class="form-preview-body"></div>
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

<!-- Scripts -->
<script src="admin/assets/js/form-preview-modal.js"></script>
```

## Styling Customization

### Change Primary Color
Edit `form-preview-modal.css`:
```css
/* Change from #E67E22 to your color */
.preview-section-header {
    background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_DARK_COLOR 100%);
}
```

### Change Grid Columns
```css
.preview-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns instead of auto-fit */
}
```

### Adjust Modal Width
```css
.form-preview-modal {
    max-width: 1400px; /* Increase from 1200px */
}
```

## API Requirements

The modal expects these endpoints to exist:

```javascript
// Get all applications
GET /api/applications
// Returns: [{ _id, applicationId, profile, ... }, ...]

// Get all admissions
GET /api/admissions
// Returns: [{ _id, admissionId, applicantName, ... }, ...]
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Modal not opening | Check `API_BASE_URL` is defined |
| Images not showing | Verify images are base64 in database |
| Print not working | Check browser pop-up settings |
| Styling looks wrong | Clear cache, verify CSS file loaded |
| Data not displaying | Check API endpoints return correct data |

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE11 | ⚠️ Limited |

## Next Steps

1. Copy the three files to your project
2. Add CSS link to your HTML head
3. Add modal HTML before closing body tag
4. Add JavaScript before closing body tag
5. Add "View Details" buttons to your tables
6. Test with sample data

## Support Resources

- Full Guide: `ADMIN_FORM_PREVIEW_MODAL_GUIDE.md`
- Component Template: `frontend/admin/components/form-preview-modal.html`
- JavaScript: `frontend/admin/assets/js/form-preview-modal.js`
- CSS: `frontend/admin/assets/css/form-preview-modal.css`
