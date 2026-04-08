
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = (typeof config !== 'undefined' && config.api)
        ? config.api.baseUrl
        : window.location.origin + '/CAATE-ITRMS/backend/public';
}

async function loadCoursesForDropdown() {
    const dropdown = document.getElementById('assessmentTitle');
    const loadingIndicator = document.getElementById('assessmentTitleLoading');
    const errorIndicator = document.getElementById('assessmentTitleError');

    if (!dropdown) {
        console.warn('Assessment title dropdown not found');
        return;
    }

    try {
        if (loadingIndicator) loadingIndicator.classList.remove('d-none');
        if (errorIndicator) errorIndicator.classList.add('d-none');

        const response = await fetch(`${window.API_BASE_URL}/api/v1/competencies`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            dropdown.innerHTML = '<option value="">Select an assessment...</option>';

            result.data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.title || 'Untitled Course';
                option.textContent = course.title || 'Untitled Course';
                dropdown.appendChild(option);
            });

            if (loadingIndicator) loadingIndicator.classList.add('d-none');
        } else {
            throw new Error('No assessments found');
        }
    } catch (error) {
        console.warn('Could not load assessments, using manual entry:', error.message);

        if (loadingIndicator) loadingIndicator.classList.add('d-none');

        if (errorIndicator) errorIndicator.classList.add('d-none');

        dropdown.innerHTML = `
            <option value="">Select an assessment...</option>
            <option value="Manual Entry">Manual Entry (Type your assessment)</option>
        `;
    }
}

function ensureToastContainer() {
    let container = document.getElementById('toastContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    container.classList.add('toast-container');
    return container;
}

document.getElementById('picture').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            this.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should not exceed 2MB');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const preview = document.getElementById('picturePreview');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');

            preview.src = event.target.result;
            placeholder.style.display = 'none';
            previewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('viewPictureBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        const preview = document.getElementById('picturePreview');
        if (preview.src) {
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Picture Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${preview.src}" class="img-fluid" style="max-height: 70vh;">
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();

            modal.addEventListener('hidden.bs.modal', function () {
                document.body.removeChild(modal);
            });
        }
    });

    document.getElementById('removePictureBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        const pictureInput = document.getElementById('picture');
        const placeholder = document.getElementById('picturePlaceholder');
        const previewContainer = document.getElementById('picturePreviewContainer');
        const preview = document.getElementById('picturePreview');

        pictureInput.value = '';

        preview.src = '';
        previewContainer.style.display = 'none';
        placeholder.style.display = 'flex';
    });
});

const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function getCanvasCoordinates(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const coords = getCanvasCoordinates(e, canvas);
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch, canvas);
    isDrawing = true;
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch, canvas);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    [lastX, lastY] = [coords.x, coords.y];
});

canvas.addEventListener('touchend', () => isDrawing = false);

document.querySelector('.btn-clear').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
});

document.getElementById('birthDate').addEventListener('change', function () {
    const birthDate = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    document.getElementById('age').value = age >= 0 ? age : '';
});

function addWorkRow() {
    const tbody = document.getElementById('workExperienceBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="workCompany[]" autocomplete="off"></td>
        <td><input type="text" name="workPosition[]" autocomplete="off"></td>
        <td><input type="text" name="workDates[]" placeholder="MM/YYYY - MM/YYYY" autocomplete="off"></td>
        <td><input type="text" name="workSalary[]" autocomplete="off"></td>
        <td><input type="text" name="workStatus[]" autocomplete="off"></td>
        <td><input type="number" name="workYears[]" step="0.1" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeWorkRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeWorkRow(btn) {
    const tbody = document.getElementById('workExperienceBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

function addTrainingRow() {
    const tbody = document.getElementById('trainingBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="trainingTitle[]" autocomplete="off"></td>
        <td><input type="text" name="trainingVenue[]" autocomplete="off"></td>
        <td><input type="text" name="trainingDates[]" placeholder="MM/YYYY - MM/YYYY" autocomplete="off"></td>
        <td><input type="number" name="trainingHours[]" autocomplete="off"></td>
        <td><input type="text" name="trainingConductedBy[]" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeTrainingRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeTrainingRow(btn) {
    const tbody = document.getElementById('trainingBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

function addLicensureRow() {
    const tbody = document.getElementById('licensureBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="licensureTitle[]" autocomplete="off"></td>
        <td><input type="number" name="licensureYear[]" min="1900" max="2100" autocomplete="off"></td>
        <td><input type="text" name="licensureVenue[]" autocomplete="off"></td>
        <td><input type="text" name="licensureRating[]" autocomplete="off"></td>
        <td><input type="text" name="licensureRemarks[]" autocomplete="off"></td>
        <td><input type="date" name="licensureExpiry[]" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeLicensureRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeLicensureRow(btn) {
    const tbody = document.getElementById('licensureBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

function addCompetencyRow() {
    const tbody = document.getElementById('competencyBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="competencyTitle[]" autocomplete="off"></td>
        <td><input type="text" name="competencyLevel[]" autocomplete="off"></td>
        <td><input type="text" name="competencySector[]" autocomplete="off"></td>
        <td><input type="text" name="competencyCert[]" autocomplete="off"></td>
        <td><input type="date" name="competencyIssuance[]" autocomplete="off"></td>
        <td><input type="date" name="competencyExpiry[]" autocomplete="off"></td>
        <td><button type="button" class="btn-remove" onclick="removeCompetencyRow(this)">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function removeCompetencyRow(btn) {
    const tbody = document.getElementById('competencyBody');
    if (tbody.children.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('At least one row is required');
    }
}

function hasSignature() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data.some(channel => channel !== 0);
}

function collectTableRowData(row, fieldNames) {
    const values = {};

    fieldNames.forEach((fieldName) => {
        const field = row.querySelector(`[name="${fieldName}[]"]`);
        values[fieldName] = field ? field.value.trim() : '';
    });

    return values;
}

function collectWorkExperiences() {
    const rows = document.querySelectorAll('#workExperienceBody tr');
    const items = [];

    rows.forEach((row) => {
        const values = collectTableRowData(row, ['workCompany', 'workPosition', 'workDates', 'workSalary', 'workStatus', 'workYears']);
        if (values.workCompany || values.workPosition || values.workDates || values.workSalary || values.workStatus || values.workYears) {
            items.push({
                company: values.workCompany,
                position: values.workPosition,
                inclusive_dates: values.workDates,
                monthly_salary: values.workSalary,
                status_of_appointment: values.workStatus,
                years_of_experience: values.workYears ? parseFloat(values.workYears) || 0 : 0
            });
        }
    });

    return items;
}

function collectTrainingSeminars() {
    const rows = document.querySelectorAll('#trainingBody tr');
    const items = [];

    rows.forEach((row) => {
        const values = collectTableRowData(row, ['trainingTitle', 'trainingVenue', 'trainingDates', 'trainingHours', 'trainingConductedBy']);
        if (values.trainingTitle || values.trainingVenue || values.trainingDates || values.trainingHours || values.trainingConductedBy) {
            items.push({
                title: values.trainingTitle,
                venue: values.trainingVenue,
                inclusive_dates: values.trainingDates,
                number_of_hours: values.trainingHours ? parseInt(values.trainingHours, 10) || 0 : 0,
                conducted_by: values.trainingConductedBy
            });
        }
    });

    return items;
}

function collectLicensureExams() {
    const rows = document.querySelectorAll('#licensureBody tr');
    const items = [];

    rows.forEach((row) => {
        const values = collectTableRowData(row, ['licensureTitle', 'licensureYear', 'licensureVenue', 'licensureRating', 'licensureRemarks', 'licensureExpiry']);
        if (values.licensureTitle || values.licensureYear || values.licensureVenue || values.licensureRating || values.licensureRemarks || values.licensureExpiry) {
            items.push({
                title: values.licensureTitle,
                year_taken: values.licensureYear ? parseInt(values.licensureYear, 10) || 0 : null,
                examination_venue: values.licensureVenue,
                rating: values.licensureRating,
                remarks: values.licensureRemarks,
                expiry_date: values.licensureExpiry
            });
        }
    });

    return items;
}

function collectCompetencyAssessments() {
    const rows = document.querySelectorAll('#competencyBody tr');
    const items = [];

    rows.forEach((row) => {
        const values = collectTableRowData(row, ['competencyTitle', 'competencyLevel', 'competencySector', 'competencyCert', 'competencyIssuance', 'competencyExpiry']);
        if (values.competencyTitle || values.competencyLevel || values.competencySector || values.competencyCert || values.competencyIssuance || values.competencyExpiry) {
            items.push({
                title: values.competencyTitle,
                qualification_level: values.competencyLevel,
                industry_sector: values.competencySector,
                certificate_number: values.competencyCert,
                date_of_issuance: values.competencyIssuance,
                expiration_date: values.competencyExpiry
            });
        }
    });

    return items;
}

document.getElementById('applicationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateApplicationForm()) {
        return;
    }

    showConfirmationModal();
});

function setupErrorRemovalListeners() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    const inputFields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="number"], select, textarea');
    inputFields.forEach(field => {
        field.addEventListener('input', function () {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });

        field.addEventListener('change', function () {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });

    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const radioGroup = form.querySelectorAll(`input[name="${this.name}"]`);
            radioGroup.forEach(r => {
                if (r.classList.contains('is-invalid')) {
                    r.classList.remove('is-invalid');
                }
            });
        });
    });

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });

    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(fileInput => {
        fileInput.addEventListener('change', function () {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
}

function validateApplicationForm() {
    const form = document.getElementById('applicationForm');
    let isValid = true;
    const missingFields = [];

    form.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

    const requiredFields = [
        { id: 'schoolName', label: 'School/Training Center/Company' },
        { id: 'assessmentTitle', label: 'Assessment Title' },
        { id: 'schoolAddress', label: 'School Address' },
        { id: 'mobile', label: 'Mobile Number' },
        { id: 'email', label: 'Email Address' },
        { id: 'birthDate', label: 'Birth Date' },
        { id: 'firstname', label: 'First Name' },
        { id: 'mailingNumber', label: 'Number Street' },
        { id: 'barangay', label: 'Barangay' },
        { id: 'district', label: 'District' },
        { id: 'city', label: 'City' },
        { id: 'province', label: 'Province' },
        { id: 'region', label: 'Region' },
        { id: 'zip', label: 'Zip' },
        { id: 'mothersName', label: "Mother's Name" },
        { id: 'fathersName', label: "Father's Name" },
        { id: 'birthPlace', label: 'Birth Place' }
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && (!element.value || element.value.trim() === '')) {
            element.classList.add('is-invalid');
            missingFields.push(field.label);
            isValid = false;
        }
    });

    const radioGroups = [
        { name: 'sex', label: 'Sex' },
        { name: 'civilStatus', label: 'Civil Status' },
        { name: 'education', label: 'Educational Attainment' },
        { name: 'employmentStatus', label: 'Employment Status' }
    ];

    radioGroups.forEach(group => {
        const checked = document.querySelector(`input[name="${group.name}"]:checked`);
        if (!checked) {
            document.querySelectorAll(`input[name="${group.name}"]`).forEach(radio => {
                radio.classList.add('is-invalid');
            });
            missingFields.push(group.label);
            isValid = false;
        }
    });

    if (!isValid) {
        const firstInvalidField = form.querySelector('.is-invalid');
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Please complete all required fields.', 'error');
        return false;
    }

    return true;
}

function showConfirmationModal() {
    const layoutOverlay = document.getElementById('layoutOverlay');
    if (layoutOverlay) {
        layoutOverlay.classList.add('active');
    }

    const modalElement = document.getElementById('confirmationModal');
    const modal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener('hidden.bs.modal', () => {
        if (layoutOverlay) {
            layoutOverlay.classList.remove('active');
        }
    }, { once: true });

    if (layoutOverlay) {
        layoutOverlay.addEventListener('click', () => {
            modal.hide();
        }, { once: true });
    }

    modal.show();
}

document.addEventListener('DOMContentLoaded', function () {
    const confirmBtn = document.getElementById('confirmSubmitBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            handleConfirmedSubmit();
        });
    }
});

function handleConfirmedSubmit() {
    const form = document.getElementById('applicationForm');

    const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
    if (confirmationModal) {
        confirmationModal.hide();
    }

    const layoutOverlay = document.getElementById('layoutOverlay');
    if (layoutOverlay) {
        layoutOverlay.classList.remove('active');
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Submitting...';

    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            continue;
        }

        if (key.endsWith('[]')) {
            const arrayKey = key.slice(0, -2); // Remove the []
            if (!data[arrayKey]) {
                data[arrayKey] = [];
            }
            data[arrayKey].push(value);
        } else {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
        data.userId = userId;
    }

    const picturePreview = document.getElementById('picturePreview');
    if (picturePreview && picturePreview.src && picturePreview.src.startsWith('data:')) {
        data.picture = picturePreview.src;
    }

    const canvas = document.getElementById('signatureCanvas');
    if (canvas && hasSignature()) {
        data.signature = canvas.toDataURL();
    }

    data.work_experience = collectWorkExperiences();
    data.training_seminars = collectTrainingSeminars();
    data.licensure_exams = collectLicensureExams();
    data.competency_assessments = collectCompetencyAssessments();

    data.submittedAt = new Date().toISOString();
    data.status = 'pending';

    fetch(`${window.API_BASE_URL}/api/v1/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
                }).catch(jsonError => {
                    throw new Error(`Server error: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(result => {
            showToast('Application submitted successfully!', 'success');

            form.reset();

            if (canvas) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            const preview = document.getElementById('picturePreview');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');
            if (preview && placeholder && previewContainer) {
                preview.src = '';
                previewContainer.style.display = 'none';
                placeholder.style.display = 'flex';
            }

            localStorage.removeItem('applicationFormDraft');
        })
        .catch(error => {
            console.error('Application submission error:', error);

            const applications = JSON.parse(localStorage.getItem('applications') || '[]');
            applications.push(data);
            localStorage.setItem('applications', JSON.stringify(applications));

            if (error.message.includes('MongoDB') || error.message.includes('timeout') || error.message.includes('connection')) {
                showToast('âš ï¸ Database is offline. Your application has been saved locally. Please start MongoDB service and try again.', 'warning');
                console.error('MongoDB Connection Error - Please start MongoDB service');
                console.info('To start MongoDB, run: net start MongoDB (as Administrator)');
            } else {
                showToast('Application saved locally. It will be submitted when the server is available.', 'warning');
            }

            form.reset();
            if (canvas) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            const preview = document.getElementById('picturePreview');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');
            if (preview && placeholder && previewContainer) {
                preview.src = '';
                previewContainer.style.display = 'none';
                placeholder.style.display = 'flex';
            }
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
}

document.getElementById('applicationForm').addEventListener('reset', function (e) {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const preview = document.getElementById('picturePreview');
    const placeholder = document.getElementById('picturePlaceholder');
    const previewContainer = document.getElementById('picturePreviewContainer');
    preview.src = '';
    previewContainer.style.display = 'none';
    placeholder.style.display = 'flex';

    document.getElementById('age').value = '';

    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

    if (canvas) {
        canvas.style.border = '1px solid #d9dee3';
    }
});

function autoSave() {
    const formData = new FormData(document.getElementById('applicationForm'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('applicationFormDraft', JSON.stringify(data));
}

setInterval(autoSave, 30000);

window.addEventListener('load', function () {
    const savedData = localStorage.getItem('applicationFormDraft');
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById('applicationForm');

        for (let key in data) {
            const field = form.elements[key];
            if (field && field.type !== 'file') {
                if (field.type === 'radio') {
                    if (field.value === data[key]) {
                        field.checked = true;
                    }
                } else if (field.length) {
                    for (let i = 0; i < field.length; i++) {
                        if (field[i].type === 'radio' && field[i].value === data[key]) {
                            field[i].checked = true;
                        } else if (field[i].type !== 'radio') {
                            field[i].value = data[key];
                        }
                    }
                } else {
                    field.value = data[key];
                }
            }
        }
    }
});

function confirmResetApplication() {
    document.getElementById('applicationForm').reset();
    const resetModal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
    resetModal.hide();
    alert('Form has been reset successfully!');
}

function confirmSubmitApplication() {
    const form = document.getElementById('applicationForm');
    form.submit();
    const submitModal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
    submitModal.hide();
}

function confirmPrintApplication() {
    const printModal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
    printModal.hide();
    setTimeout(() => {
        window.print();
    }, 300);
}

function showToast(message, type = 'success') {
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem('applicationFormDraft');
    ensureToastContainer();

    loadCoursesForDropdown().catch(err => {
        console.warn('Could not load courses:', err.message);
    });

    initializePhilippineAddressDropdowns();

    const assessmentRadios = document.querySelectorAll('input[name="assessmentType"]');
    assessmentRadios.forEach(radio => {
        radio.checked = false;
    });

    setupErrorRemovalListeners();
});

function initializePhilippineAddressDropdowns() {

    const districtField = document.getElementById('district');
    if (districtField) {
        districtField.addEventListener('keypress', function (e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
            const isNumber = /[1-9]/.test(e.key);

            if (this.value.length >= 1 && !allowedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }

            if (!isNumber && !allowedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }

            if (e.key === '0') {
                e.preventDefault();
                return;
            }
        });

        districtField.addEventListener('input', function (e) {
            let value = e.target.value;

            value = value.replace(/[^1-9]/g, '');

            if (value.length > 1) {
                value = value.charAt(0);
            }

            e.target.value = value;
        });

        districtField.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const validDigit = paste.match(/[1-9]/);
            if (validDigit) {
                this.value = validDigit[0];
            }
        });
    }

    const textOnlyFields = ['barangay', 'city', 'province'];

    textOnlyFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('keypress', function (e) {
                const char = String.fromCharCode(e.which);
                const allowedPattern = /[a-zA-Z\s\-'\.]/;

                if (!allowedPattern.test(char) && e.which !== 8 && e.which !== 0) {
                    e.preventDefault();
                }
            });

            field.addEventListener('input', function (e) {
                const cleanValue = e.target.value.replace(/[^a-zA-Z\s\-'\.]/g, '');
                if (e.target.value !== cleanValue) {
                    e.target.value = cleanValue;
                }
            });
        }
    });

    function formatPhoneNumber(value, type) {
        const digits = value.replace(/\D/g, '');

        if (type === 'mobile') {
            if (digits.length <= 4) {
                return digits;
            } else if (digits.length <= 7) {
                return digits.slice(0, 4) + ' ' + digits.slice(4);
            } else if (digits.length <= 11) {
                return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
            }
            return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
        } else {
            if (digits.length <= 2) {
                return digits.length > 0 ? '(' + digits : '';
            } else if (digits.length <= 5) {
                return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
            } else if (digits.length <= 9) {
                return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 5) + '-' + digits.slice(5, 9);
            }
            return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 5) + '-' + digits.slice(5, 9);
        }
    }

    const phoneFields = [
        { id: 'tel', type: 'landline' },
        { id: 'mobile', type: 'mobile' },
        { id: 'fax', type: 'landline' }
    ];

    phoneFields.forEach(({ id, type }) => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', function (e) {
                const cursorPosition = e.target.selectionStart;
                const oldValue = e.target.value;
                const newValue = formatPhoneNumber(oldValue, type);

                if (oldValue !== newValue) {
                    e.target.value = newValue;

                    let newCursorPosition = cursorPosition;
                    if (newValue.length > oldValue.length) {
                        newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
                    }
                    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                }
            });

            field.addEventListener('keypress', function (e) {
                const char = String.fromCharCode(e.which);
                if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 46) {
                    e.preventDefault();
                }
            });
        }
    });
}
