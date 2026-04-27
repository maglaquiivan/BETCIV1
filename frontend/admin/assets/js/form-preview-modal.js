// Form Preview Modal Functions for Admin Dashboard
// Displays comprehensive read-only previews of submitted applications and admissions

/**
 * Open application form preview modal
 * @param {string} applicationId - The application ID to preview
 */
async function openApplicationPreview(applicationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/applications`);
        const applications = await response.json();
        const application = applications.find(app => app._id === applicationId || app.applicationId === applicationId);

        if (!application) {
            showNotification('Application not found', 'error');
            return;
        }

        // Store the form ID for deletion
        currentFormPreviewId = application._id || application.applicationId;
        currentFormPreviewType = 'application';

        const modal = document.getElementById('formPreviewModal');
        const modalBody = modal.querySelector('.form-preview-body');
        
        // Build the preview HTML
        let previewHTML = buildApplicationPreviewHTML(application);
        modalBody.innerHTML = previewHTML;
        
        // Add status badge and submission info
        const headerInfo = modal.querySelector('.form-preview-header-info');
        headerInfo.innerHTML = `
            <div class="preview-header-content">
                <div>
                    <h2><i class="bi bi-file-earmark-text"></i> Application Form Preview</h2>
                    <p class="preview-subtitle">Reference: ${application.applicationId || application._id}</p>
                </div>
                <div class="preview-badges">
                    <span class="status-badge status-${application.status || 'pending'}">${(application.status || 'pending').toUpperCase()}</span>
                    ${application.submittedAt ? `<span class="submitted-date"><i class="bi bi-calendar-check"></i> ${new Date(application.submittedAt).toLocaleDateString()}</span>` : ''}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Error loading application preview:', error);
        showNotification('Failed to load application preview', 'error');
    }
}

/**
 * Open admission slip preview modal
 * @param {string} admissionId - The admission ID to preview
 */
async function openAdmissionPreview(admissionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admissions`);
        const admissions = await response.json();
        const admission = admissions.find(adm => adm._id === admissionId || adm.admissionId === admissionId);

        if (!admission) {
            showNotification('Admission slip not found', 'error');
            return;
        }

        // Store the form ID for deletion
        currentFormPreviewId = admission._id || admission.admissionId;
        currentFormPreviewType = 'admission';

        const modal = document.getElementById('formPreviewModal');
        const modalBody = modal.querySelector('.form-preview-body');
        
        // Build the preview HTML
        let previewHTML = buildAdmissionPreviewHTML(admission);
        modalBody.innerHTML = previewHTML;
        
        // Add status badge and submission info
        const headerInfo = modal.querySelector('.form-preview-header-info');
        headerInfo.innerHTML = `
            <div class="preview-header-content">
                <div>
                    <h2><i class="bi bi-ticket-detailed"></i> Admission Slip Preview</h2>
                    <p class="preview-subtitle">Reference: ${admission.admissionId || admission._id}</p>
                </div>
                <div class="preview-badges">
                    <span class="status-badge status-${admission.status || 'pending'}">${(admission.status || 'pending').toUpperCase()}</span>
                    ${admission.submittedAt ? `<span class="submitted-date"><i class="bi bi-calendar-check"></i> ${new Date(admission.submittedAt).toLocaleDateString()}</span>` : ''}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error('Error loading admission preview:', error);
        showNotification('Failed to load admission preview', 'error');
    }
}

/**
 * Build HTML for application form preview
 * @param {object} app - Application data
 * @returns {string} HTML content
 */
function buildApplicationPreviewHTML(app) {
    const profile = app.profile || {};
    const workExp = app.workExperience || [];
    const training = app.trainingSeminars || [];
    const licensure = app.licensureExams || [];
    const competency = app.competencyAssessments || [];

    return `
        <div class="preview-content">
            <!-- Application Information Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-info-circle"></i> Application Information</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Application ID</label>
                            <div class="preview-value">${app.applicationId || app._id || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Course/Assessment</label>
                            <div class="preview-value">${app.assessmentTitle || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>School/Training Center</label>
                            <div class="preview-value">${app.schoolName || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Assessment Type</label>
                            <div class="preview-value">${app.assessmentType || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Date of Application</label>
                            <div class="preview-value">${app.dateOfApplication ? new Date(app.dateOfApplication).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Reference Number</label>
                            <div class="preview-value">${app.referenceNumber || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Personal Information Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-person"></i> Personal Information</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Surname</label>
                            <div class="preview-value">${profile.surname || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>First Name</label>
                            <div class="preview-value">${profile.firstName || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Middle Name</label>
                            <div class="preview-value">${profile.middleName || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Sex</label>
                            <div class="preview-value">${profile.sex || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Date of Birth</label>
                            <div class="preview-value">${profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Age</label>
                            <div class="preview-value">${profile.age || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Civil Status</label>
                            <div class="preview-value">${profile.civilStatus || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Birth Place</label>
                            <div class="preview-value">${profile.birthPlace || 'N/A'}</div>
                        </div>
                    </div>
                    ${profile.picture ? `
                        <div class="preview-picture-section">
                            <label>Photograph</label>
                            <img src="${profile.picture}" alt="Applicant Photo" class="preview-picture">
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Address Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-geo-alt"></i> Address</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Street Address</label>
                            <div class="preview-value">${profile.numberStreet || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Barangay</label>
                            <div class="preview-value">${profile.barangay || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>District</label>
                            <div class="preview-value">${profile.district || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>City/Municipality</label>
                            <div class="preview-value">${profile.city || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Province</label>
                            <div class="preview-value">${profile.province || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Region</label>
                            <div class="preview-value">${profile.region || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>ZIP Code</label>
                            <div class="preview-value">${profile.zip || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Information Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-telephone"></i> Contact Information</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Telephone</label>
                            <div class="preview-value">${profile.tel || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Mobile</label>
                            <div class="preview-value">${profile.mobile || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Email</label>
                            <div class="preview-value">${profile.email || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Fax</label>
                            <div class="preview-value">${profile.fax || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Education & Employment Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-book"></i> Education & Employment</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Highest Educational Attainment</label>
                            <div class="preview-value">${profile.highestEducationalAttainment || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Employment Status</label>
                            <div class="preview-value">${profile.employmentStatus || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Work Experience Section -->
            ${workExp.length > 0 ? `
                <div class="preview-section">
                    <div class="preview-section-header">
                        <h3><i class="bi bi-briefcase"></i> Work Experience</h3>
                    </div>
                    <div class="preview-section-body">
                        <div class="preview-table-wrapper">
                            <table class="preview-table">
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>Position</th>
                                        <th>Inclusive Dates</th>
                                        <th>Years</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${workExp.map(exp => `
                                        <tr>
                                            <td>${exp.companyName || 'N/A'}</td>
                                            <td>${exp.position || 'N/A'}</td>
                                            <td>${exp.inclusiveDates || 'N/A'}</td>
                                            <td>${exp.yearsOfExperience || 'N/A'}</td>
                                            <td>${exp.statusOfAppointment || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Training & Seminars Section -->
            ${training.length > 0 ? `
                <div class="preview-section">
                    <div class="preview-section-header">
                        <h3><i class="bi bi-mortarboard"></i> Training & Seminars</h3>
                    </div>
                    <div class="preview-section-body">
                        <div class="preview-table-wrapper">
                            <table class="preview-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Venue</th>
                                        <th>Dates</th>
                                        <th>Hours</th>
                                        <th>Conducted By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${training.map(train => `
                                        <tr>
                                            <td>${train.title || 'N/A'}</td>
                                            <td>${train.venue || 'N/A'}</td>
                                            <td>${train.inclusiveDates || 'N/A'}</td>
                                            <td>${train.numberOfHours || 'N/A'}</td>
                                            <td>${train.conductedBy || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Licensure Examinations Section -->
            ${licensure.length > 0 ? `
                <div class="preview-section">
                    <div class="preview-section-header">
                        <h3><i class="bi bi-award"></i> Licensure Examinations</h3>
                    </div>
                    <div class="preview-section-body">
                        <div class="preview-table-wrapper">
                            <table class="preview-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Year Taken</th>
                                        <th>Venue</th>
                                        <th>Rating</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${licensure.map(lic => `
                                        <tr>
                                            <td>${lic.title || 'N/A'}</td>
                                            <td>${lic.yearTaken || 'N/A'}</td>
                                            <td>${lic.examinationVenue || 'N/A'}</td>
                                            <td>${lic.rating || 'N/A'}</td>
                                            <td>${lic.remarks || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Competency Assessments Section -->
            ${competency.length > 0 ? `
                <div class="preview-section">
                    <div class="preview-section-header">
                        <h3><i class="bi bi-check-circle"></i> Competency Assessments</h3>
                    </div>
                    <div class="preview-section-body">
                        <div class="preview-table-wrapper">
                            <table class="preview-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Qualification Level</th>
                                        <th>Industry Sector</th>
                                        <th>Certificate #</th>
                                        <th>Date of Issuance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${competency.map(comp => `
                                        <tr>
                                            <td>${comp.title || 'N/A'}</td>
                                            <td>${comp.qualificationLevel || 'N/A'}</td>
                                            <td>${comp.industrySector || 'N/A'}</td>
                                            <td>${comp.certificateNumber || 'N/A'}</td>
                                            <td>${comp.dateOfIssuance ? new Date(comp.dateOfIssuance).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Signature Section -->
            ${app.signature ? `
                <div class="preview-section">
                    <div class="preview-section-header">
                        <h3><i class="bi bi-pen"></i> Signature</h3>
                    </div>
                    <div class="preview-section-body">
                        <div class="preview-signature-box">
                            <img src="${app.signature}" alt="Applicant Signature" class="preview-signature">
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Build HTML for admission slip preview
 * @param {object} admission - Admission data
 * @returns {string} HTML content
 */
function buildAdmissionPreviewHTML(admission) {
    const requirements = admission.requirements || {};
    const remarks = admission.remarks || {};

    return `
        <div class="preview-content">
            <!-- Admission Information Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-info-circle"></i> Admission Information</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Admission ID</label>
                            <div class="preview-value">${admission.admissionId || admission._id || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Assessment Applied</label>
                            <div class="preview-value">${admission.assessmentApplied || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Official Receipt Number</label>
                            <div class="preview-value">${admission.officialReceiptNumber || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Date Issued</label>
                            <div class="preview-value">${admission.dateIssued ? new Date(admission.dateIssued).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Assessment Center</label>
                            <div class="preview-value">${admission.assessmentCenter || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Applicant Information Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-person"></i> Applicant Information</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Applicant Name</label>
                            <div class="preview-value">${admission.applicantName || 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Telephone Number</label>
                            <div class="preview-value">${admission.telNumber || 'N/A'}</div>
                        </div>
                    </div>
                    ${admission.picture ? `
                        <div class="preview-picture-section">
                            <label>Photograph</label>
                            <img src="${admission.picture}" alt="Applicant Photo" class="preview-picture">
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Assessment Schedule Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-calendar-event"></i> Assessment Schedule</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-grid">
                        <div class="preview-field">
                            <label>Assessment Date</label>
                            <div class="preview-value">${admission.assessmentDate ? new Date(admission.assessmentDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div class="preview-field">
                            <label>Assessment Time</label>
                            <div class="preview-value">${admission.assessmentTime || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Requirements Checklist Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-checklist"></i> Requirements Checklist</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-checklist">
                        <div class="checklist-item">
                            <span class="checklist-icon ${requirements.selfAssessmentGuide ? 'checked' : ''}">
                                <i class="bi ${requirements.selfAssessmentGuide ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
                            </span>
                            <span>Self Assessment Guide</span>
                        </div>
                        <div class="checklist-item">
                            <span class="checklist-icon ${requirements.passportPictures ? 'checked' : ''}">
                                <i class="bi ${requirements.passportPictures ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
                            </span>
                            <span>Passport Pictures</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Remarks Section -->
            <div class="preview-section">
                <div class="preview-section-header">
                    <h3><i class="bi bi-chat-left-text"></i> Remarks</h3>
                </div>
                <div class="preview-section-body">
                    <div class="preview-checklist">
                        <div class="checklist-item">
                            <span class="checklist-icon ${remarks.bringPPE ? 'checked' : ''}">
                                <i class="bi ${remarks.bringPPE ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
                            </span>
                            <span>Bring PPE (Personal Protective Equipment)</span>
                        </div>
                        <div class="checklist-item">
                            <span class="checklist-icon ${remarks.others ? 'checked' : ''}">
                                <i class="bi ${remarks.others ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
                            </span>
                            <span>Others: ${remarks.othersSpecify || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Close the form preview modal
 */
function closeFormPreviewModal() {
    const modal = document.getElementById('formPreviewModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Print the form preview
 */
function printFormPreview() {
    const modal = document.getElementById('formPreviewModal');
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Form Preview</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">');
    printWindow.document.write('<style>');
    printWindow.document.write(getFormPreviewPrintStyles());
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(modal.querySelector('.form-preview-body').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

/**
 * Get print styles for form preview
 */
function getFormPreviewPrintStyles() {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto', sans-serif; background: white; padding: 20px; }
        .preview-content { max-width: 900px; margin: 0 auto; }
        .preview-section { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .preview-section-header { background: #f5f5f5; padding: 15px 20px; border-bottom: 2px solid #E67E22; }
        .preview-section-header h3 { font-size: 16px; font-weight: 700; color: #E67E22; margin: 0; }
        .preview-section-body { padding: 20px; }
        .preview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .preview-field { display: flex; flex-direction: column; }
        .preview-field label { font-size: 12px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 8px; }
        .preview-value { font-size: 14px; color: #333; padding: 8px 12px; background: #f9f9f9; border-radius: 4px; border: 1px solid #e0e0e0; }
        .preview-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .preview-table th { background: #E67E22; color: white; padding: 10px; text-align: left; font-size: 12px; font-weight: 600; }
        .preview-table td { padding: 10px; border: 1px solid #ddd; font-size: 13px; }
        .preview-table tr:nth-child(even) { background: #f9f9f9; }
        .preview-picture { max-width: 150px; border: 2px solid #333; border-radius: 4px; margin-top: 10px; }
        .preview-signature { max-width: 300px; border: 2px solid #333; border-radius: 4px; margin-top: 10px; }
        @media print { body { padding: 0; } }
    `;
}

// Store current form ID for deletion
let currentFormPreviewId = null;
let currentFormPreviewType = null; // 'application' or 'admission'

/**
 * Delete the form preview
 */
async function deleteFormPreview() {
    if (!currentFormPreviewId || !currentFormPreviewType) {
        showError('Error', 'No form selected for deletion');
        return;
    }
    
    // Show custom confirmation modal
    showConfirmation(
        'Delete Confirmation',
        `Are you sure you want to delete this ${currentFormPreviewType}? This action cannot be undone.`,
        'confirmDeleteFormPreview',
        null
    );
}

/**
 * Confirm and execute form deletion
 */
async function confirmDeleteFormPreview() {
    try {
        const endpoint = currentFormPreviewType === 'application' ? 'applications' : 'admissions';
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${currentFormPreviewId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).catch(() => ({ status: 404 }));
        
        if (response.ok) {
            showSuccess('Success', `${currentFormPreviewType.charAt(0).toUpperCase() + currentFormPreviewType.slice(1)} deleted successfully!`);
            closeFormPreviewModal();
            
            // Reload the appropriate records
            setTimeout(() => {
                if (currentFormPreviewType === 'application' && typeof loadApplicationRecords === 'function') {
                    loadApplicationRecords();
                } else if (currentFormPreviewType === 'admission' && typeof loadAdmissionRecords === 'function') {
                    loadAdmissionRecords();
                }
            }, 1500);
        } else if (response.status === 404) {
            showError('Error', 'The backend does not support deleting this record yet. Please contact your administrator to implement the DELETE endpoint.');
        } else {
            showError('Error', `Failed to delete ${currentFormPreviewType}`);
        }
    } catch (error) {
        console.error(`Error deleting ${currentFormPreviewType}:`, error);
        showError('Error', `Error deleting ${currentFormPreviewType}: ` + error.message);
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('formPreviewModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeFormPreviewModal();
            }
        });
    }
});
