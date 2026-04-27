# Admin Records Page - Form Preview Modal Integration

## Overview
This document shows how to integrate the Form Preview Modal into the existing admin records page (`frontend/admin/pages/records.html`).

## Current Implementation
The admin records page currently shows basic details in a modal. We'll enhance it to show comprehensive form previews.

## Integration Steps

### Step 1: Update HTML Head
Add the CSS link to the `<head>` section of `records.html`:

```html
<head>
    <!-- ... existing head content ... -->
    <link rel="stylesheet" href="../assets/css/form-preview-modal.css">
</head>
```

### Step 2: Add Modal Template
Add this modal template before the closing `</body>` tag in `records.html`:

```html
<!-- Form Preview Modal -->
<div id="formPreviewModal" class="form-preview-modal-overlay">
    <div class="form-preview-modal">
        <div class="form-preview-header">
            <div class="form-preview-header-info"></div>
            <button class="form-preview-close" onclick="closeFormPreviewModal()" title="Close">×</button>
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

### Step 3: Add JavaScript
Add this script before the closing `</body>` tag:

```html
<script src="../assets/js/form-preview-modal.js"></script>
```

### Step 4: Update View Details Buttons
Replace the existing `viewApplicationDetails()` and `viewAdmissionDetails()` functions with calls to the new preview functions.

**Before:**
```javascript
async function viewApplicationDetails(applicationId) {
    // Old implementation showing basic details
}
```

**After:**
```javascript
async function viewApplicationDetails(applicationId) {
    openApplicationPreview(applicationId);
}

async function viewAdmissionDetails(admissionId) {
    openAdmissionPreview(admissionId);
}
```

### Step 5: Update Table Action Buttons
Update the action buttons in your records table to use the new functions:

```html
<!-- For Applications -->
<button class="btn btn-sm btn-info" onclick="viewApplicationDetails('${application._id}')">
    <i class="bi bi-eye"></i> View Details
</button>

<!-- For Admissions -->
<button class="btn btn-sm btn-info" onclick="viewAdmissionDetails('${admission._id}')">
    <i class="bi bi-eye"></i> View Details
</button>
```

## Complete Example

Here's a complete example of how the records page might look with the integration:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Records - Admin Dashboard</title>
    
    <!-- Existing stylesheets -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <!-- Add Form Preview Modal CSS -->
    <link rel="stylesheet" href="../assets/css/form-preview-modal.css">
    
    <style>
        /* Your existing styles */
    </style>
</head>
<body>
    <!-- Navigation and header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <!-- Navigation content -->
    </nav>

    <!-- Main content -->
    <div class="container-fluid mt-4">
        <h1>Records Management</h1>
        
        <!-- Applications Section -->
        <div class="card mt-4">
            <div class="card-header">
                <h5>Applications</h5>
            </div>
            <div class="card-body">
                <table class="table table-hover" id="applicationsTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Admissions Section -->
        <div class="card mt-4">
            <div class="card-header">
                <h5>Admissions</h5>
            </div>
            <div class="card-body">
                <table class="table table-hover" id="admissionsTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Assessment</th>
                            <th>Status</th>
                            <th>Assessment Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Form Preview Modal -->
    <div id="formPreviewModal" class="form-preview-modal-overlay">
        <div class="form-preview-modal">
            <div class="form-preview-header">
                <div class="form-preview-header-info"></div>
                <button class="form-preview-close" onclick="closeFormPreviewModal()" title="Close">×</button>
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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/form-preview-modal.js"></script>
    
    <script>
        // API Base URL
        const API_BASE_URL = 'http://localhost:5000/api';

        // Load records on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadApplications();
            loadAdmissions();
        });

        // Load applications
        async function loadApplications() {
            try {
                const response = await fetch(`${API_BASE_URL}/applications`);
                const applications = await response.json();
                
                const tbody = document.querySelector('#applicationsTable tbody');
                tbody.innerHTML = applications.map(app => `
                    <tr>
                        <td>${app.applicationId || app._id}</td>
                        <td>${app.profile?.firstName || ''} ${app.profile?.surname || ''}</td>
                        <td>${app.assessmentTitle || 'N/A'}</td>
                        <td>
                            <span class="badge bg-${getStatusColor(app.status)}">
                                ${(app.status || 'pending').toUpperCase()}
                            </span>
                        </td>
                        <td>${app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewApplicationDetails('${app._id}')">
                                <i class="bi bi-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error loading applications:', error);
            }
        }

        // Load admissions
        async function loadAdmissions() {
            try {
                const response = await fetch(`${API_BASE_URL}/admissions`);
                const admissions = await response.json();
                
                const tbody = document.querySelector('#admissionsTable tbody');
                tbody.innerHTML = admissions.map(adm => `
                    <tr>
                        <td>${adm.admissionId || adm._id}</td>
                        <td>${adm.applicantName || 'N/A'}</td>
                        <td>${adm.assessmentApplied || 'N/A'}</td>
                        <td>
                            <span class="badge bg-${getStatusColor(adm.status)}">
                                ${(adm.status || 'pending').toUpperCase()}
                            </span>
                        </td>
                        <td>${adm.assessmentDate ? new Date(adm.assessmentDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewAdmissionDetails('${adm._id}')">
                                <i class="bi bi-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error loading admissions:', error);
            }
        }

        // Get status badge color
        function getStatusColor(status) {
            const colors = {
                'pending': 'warning',
                'approved': 'success',
                'rejected': 'danger',
                'confirmed': 'success',
                'completed': 'success',
                'cancelled': 'danger'
            };
            return colors[status] || 'secondary';
        }

        // View application details
        function viewApplicationDetails(applicationId) {
            openApplicationPreview(applicationId);
        }

        // View admission details
        function viewAdmissionDetails(admissionId) {
            openAdmissionPreview(admissionId);
        }

        // Show notification
        function showNotification(message, type = 'info') {
            // Your existing notification function
            console.log(`[${type}] ${message}`);
        }
    </script>
</body>
</html>
```

## Key Changes

1. **Added CSS Link:** Form preview modal styles
2. **Added Modal HTML:** Complete modal structure
3. **Added JavaScript:** Form preview modal functions
4. **Updated Functions:** `viewApplicationDetails()` and `viewAdmissionDetails()` now call the preview functions
5. **Enhanced Table:** Shows more information and uses the new preview modal

## Benefits

✅ **Comprehensive View:** Users see all form data, not just basic fields  
✅ **Professional Presentation:** Organized sections with icons  
✅ **Print Support:** Users can print the complete form  
✅ **Consistent Styling:** Matches the trainee review modal  
✅ **Better UX:** Smooth animations and responsive design  
✅ **Status Visibility:** Clear status badges and submission dates  

## Testing

1. Navigate to the Records page
2. Click "View Details" on an application or admission
3. Verify the modal opens with all data
4. Test the Print button
5. Test the Close button
6. Test on different screen sizes

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal not opening | Check browser console for errors |
| Data not showing | Verify API endpoints are working |
| Styling looks off | Clear browser cache |
| Print not working | Check browser pop-up settings |

## Next Steps

1. Copy the integration code to your records.html
2. Update the API_BASE_URL if needed
3. Test with your actual data
4. Customize colors/styling as needed
5. Deploy to production

## Support

For issues or questions, refer to:
- `ADMIN_FORM_PREVIEW_MODAL_GUIDE.md` - Full documentation
- `ADMIN_FORM_PREVIEW_QUICK_START.md` - Quick reference
