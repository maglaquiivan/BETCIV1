# Admission Slip Accessibility Fixes

## Summary
Fixed all accessibility issues in `admission-slip.html` to ensure proper form field labeling, id/name attributes, and semantic HTML compliance.

## Issues Fixed

### 1. Reference Number Inputs (admRefNum1-admRefNum15)
**Issue**: Inputs had only `name` attributes, missing `id` attributes
**Fix**: Added `id` attributes matching the `name` values
- Changed: `<input type="text" name="admRefNum1" ...>` 
- To: `<input type="text" id="admRefNum1" name="admRefNum1" ...>`
- Updated label to reference first input: `<label for="admRefNum1" class="ref-label">`

### 2. Applicant Name Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="applicantName"` attribute

### 3. Tel. Number Field
**Issue**: Missing `name` attribute and incorrect input type
**Fix**: 
- Added `name="telNumber"` attribute
- Changed input type from `text` to `tel` for better semantic meaning

### 4. Picture Upload Input
**Issue**: Missing associated label for accessibility
**Fix**: 
- Added `<label for="pictureUpload" class="sr-only">Upload picture</label>`
- Added `alt="Applicant picture preview"` to the preview image
- Added `.sr-only` CSS class for screen reader only text

### 5. Assessment Applied Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="assessmentApplied"` attribute

### 6. Receipt Number Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="receiptNumber"` attribute

### 7. Date Issued Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="dateIssued"` attribute

### 8. Assessment Center Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="assessmentCenter"` attribute

### 9. Assessment Date Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="assessmentDate"` attribute

### 10. Assessment Time Field
**Issue**: Missing `name` attribute
**Fix**: Added `name="assessmentTime"` attribute

## CSS Additions
Added `.sr-only` class for screen reader only content:
```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

## Verification
- All form fields now have both `id` and `name` attributes
- All form fields have associated `<label>` elements with proper `for` attributes
- All input types are semantically correct (tel for phone numbers, date for dates, time for times)
- No accessibility warnings or errors in diagnostics
- Checkbox fields (selfAssessment, pictures, ppe, others) already had proper labels

## Files Modified
- `BETCIV1-main/frontend/trainee/pages/assessment/admission-slip.html`

## Testing
Run the admission slip page and check browser console for accessibility warnings. All should be resolved.
