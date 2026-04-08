// Toast notification function
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

function setupSignatureCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

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
}

function clearSignature(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
}

function confirmReset() {
    document.getElementById('admissionSlipForm').reset();
    clearSignature('signatureCanvas1');
    clearSignature('signatureCanvas2');

    const pictureInput = document.getElementById('picture');
    const placeholder = document.getElementById('picturePlaceholder');
    const previewContainer = document.getElementById('picturePreviewContainer');
    const preview = document.getElementById('picturePreview');

    if (pictureInput) pictureInput.value = '';
    if (preview) preview.src = '';
    if (previewContainer) previewContainer.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';

    const resetModal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
    if (resetModal) resetModal.hide();

    showToast('Form has been reset successfully!', 'success');
}

function confirmPrint() {
    const printModal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
    if (printModal) printModal.hide();

    setTimeout(() => {
        window.print();
    }, 300);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Ensure toast container exists
    ensureToastContainer();

    // Setup signature canvases
    setupSignatureCanvas('signatureCanvas1');
    setupSignatureCanvas('signatureCanvas2');

    // Phone number formatting function
    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, '');

        if (digits.length <= 4) {
            return digits;
        } else if (digits.length <= 7) {
            return digits.slice(0, 4) + ' ' + digits.slice(4);
        } else if (digits.length <= 11) {
            return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
        }
        return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 11);
    }

    // Setup phone number formatting for Tel. Number field
    const telField = document.getElementById('telNumber');
    if (telField) {
        telField.addEventListener('input', function (e) {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = formatPhoneNumber(oldValue);

            if (oldValue !== newValue) {
                e.target.value = newValue;

                let newCursorPosition = cursorPosition;
                if (newValue.length > oldValue.length) {
                    newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
                }
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        });

        telField.addEventListener('keypress', function (e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 46) {
                e.preventDefault();
            }
        });
    }

    // Picture upload handler
    const pictureInput = document.getElementById('picture');
    if (pictureInput) {
        pictureInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showToast('Please upload an image file', 'error');
                    this.value = '';
                    return;
                }

                if (file.size > 2 * 1024 * 1024) {
                    showToast('Image size should not exceed 2MB', 'error');
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
    }

    // View picture button
    const viewPictureBtn = document.getElementById('viewPictureBtn');
    if (viewPictureBtn) {
        viewPictureBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const preview = document.getElementById('picturePreview');
            if (preview && preview.src) {
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
    }

    // Remove picture button
    const removePictureBtn = document.getElementById('removePictureBtn');
    if (removePictureBtn) {
        removePictureBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const pictureInput = document.getElementById('picture');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');
            const preview = document.getElementById('picturePreview');

            if (pictureInput) pictureInput.value = '';
            if (preview) preview.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        });
    }

    // Form validation on submit
    const form = document.getElementById('admissionSlipForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Remove all previous invalid classes
            form.querySelectorAll('.is-invalid').forEach(field => {
                field.classList.remove('is-invalid');
            });

            // Define required fields
            const requiredFields = [
                { id: 'applicantName', label: 'Name of Applicant' },
                { id: 'telNumber', label: 'Tel. Number' },
                { id: 'assessmentApplied', label: 'Assessment Applied for' },
                { id: 'applicantPrintedName', label: 'Printed Name' },
                { id: 'applicantDate', label: 'Date' }
            ];

            const missingFields = [];

            // Validate each required field
            requiredFields.forEach(field => {
                const element = document.getElementById(field.id);

                if (element && (!element.value || element.value.trim() === '')) {
                    element.classList.add('is-invalid');
                    missingFields.push(field.label);
                    isValid = false;
                }
            });

            if (!isValid) {
                // Scroll to first invalid field
                const firstInvalidField = form.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Show error toast
                showToast('Please complete all required fields.', 'error');
                return false;
            }

            // If validation passes, show confirmation modal
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
        });

        // Remove invalid class when user starts typing
        const inputFields = form.querySelectorAll('input, textarea, select');
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
    }

    // Confirm submit button handler
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', function () {
            const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
            if (confirmationModal) {
                confirmationModal.hide();
            }

            // Submit the form after modal closes
            setTimeout(() => {
                submitAdmissionSlip();
            }, 300);
        });
    }
});

// Function to collect all form data
function collectAdmissionSlipData() {
    const formData = {};

    // Reference Number (16 individual inputs)
    const referenceNumber = [
        document.getElementById('referenceQualifiable')?.value || '',
        document.getElementById('referenceYY1')?.value || '',
        document.getElementById('referenceYY2')?.value || '',
        document.getElementById('referenceRegion1')?.value || '',
        document.getElementById('referenceRegion2')?.value || '',
        document.getElementById('referenceProvince1')?.value || '',
        document.getElementById('referenceProvince2')?.value || '',
        document.getElementById('referenceAC1')?.value || '',
        document.getElementById('referenceAC2')?.value || '',
        document.getElementById('referenceAC3')?.value || '',
        document.getElementById('referenceSeries1')?.value || '',
        document.getElementById('referenceSeries2')?.value || '',
        document.getElementById('referenceSeries3')?.value || '',
        document.getElementById('referenceSeries4')?.value || '',
        document.getElementById('referenceSeries5')?.value || '',
        document.getElementById('referenceSeries6')?.value || ''
    ].join('');

    formData.referenceNumber = referenceNumber;

    // Picture (convert to base64 if exists)
    const pictureInput = document.getElementById('picture');
    const picturePreview = document.getElementById('picturePreview');
    formData.picture = picturePreview?.src || '';

    // Applicant Information
    formData.applicantName = document.getElementById('applicantName')?.value || '';
    formData.telNumber = document.getElementById('telNumber')?.value || '';
    formData.assessmentApplied = document.getElementById('assessmentApplied')?.value || '';
    formData.orNumber = document.getElementById('orNumber')?.value || '';
    formData.dateIssued = document.getElementById('dateIssued')?.value || '';

    // Processing Officer Section
    formData.assessmentCenter = document.getElementById('assessmentCenter')?.value || '';

    // Checkboxes for submitted requirements
    const checkboxes = document.querySelectorAll('.radio-group.vertical input[type="checkbox"]');
    formData.submittedRequirements = [];
    formData.remarks = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const label = checkbox.parentElement.textContent.trim();
            if (index < 2) {
                formData.submittedRequirements.push(label);
            } else {
                formData.remarks.push(label);
            }
        }
    });

    // Assessment Date and Time
    const assessmentDateInputs = document.querySelectorAll('input[type="date"]');
    const assessmentTimeInput = document.querySelector('input[type="time"]');

    if (assessmentDateInputs.length > 1) {
        formData.assessmentDate = assessmentDateInputs[0]?.value || '';
    }
    formData.assessmentTime = assessmentTimeInput?.value || '';

    // Signatures (convert canvas to base64)
    const signatureCanvas1 = document.getElementById('signatureCanvas1');
    const signatureCanvas2 = document.getElementById('signatureCanvas2');

    formData.processingOfficerSignature = signatureCanvas1 ? signatureCanvas1.toDataURL() : '';
    formData.applicantSignature = signatureCanvas2 ? signatureCanvas2.toDataURL() : '';

    // Printed Names and Dates
    const printedNameInputs = document.querySelectorAll('input[type="text"][placeholder="Enter name"]');
    const dateInputs = document.querySelectorAll('input[type="date"]');

    formData.processingOfficerPrintedName = printedNameInputs[0]?.value || '';
    formData.processingOfficerDate = dateInputs[1]?.value || '';
    formData.applicantPrintedName = document.getElementById('applicantPrintedName')?.value || '';
    formData.applicantDate = document.getElementById('applicantDate')?.value || '';

    // Add metadata
    formData.submittedAt = new Date().toISOString();
    formData.status = 'pending';

    return formData;
}

// Function to submit admission slip to database
async function submitAdmissionSlip() {
    const data = collectAdmissionSlipData();

    try {
        const response = await fetch(`${config.api.baseUrl}/api/v1/admissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
        }

        const result = await response.json();

        showToast('Admission slip submitted successfully!', 'success');

        // Reset form after successful submission
        setTimeout(() => {
            document.getElementById('admissionSlipForm').reset();
            clearSignature('signatureCanvas1');
            clearSignature('signatureCanvas2');

            // Reset picture
            const pictureInput = document.getElementById('picture');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');
            const preview = document.getElementById('picturePreview');

            if (pictureInput) pictureInput.value = '';
            if (preview) preview.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        }, 1500);

    } catch (error) {
        // Save to localStorage as backup
        const admissions = JSON.parse(localStorage.getItem('admissions') || '[]');
        admissions.push(data);
        localStorage.setItem('admissions', JSON.stringify(admissions));

        if (error.message.includes('MongoDB') || error.message.includes('timeout') || error.message.includes('connection')) {
            showToast('⚠️ Database is offline. Your admission slip has been saved locally.', 'warning');
        } else {
            showToast('Admission slip saved locally. It will be submitted when the server is available.', 'warning');
        }

        // Still reset form after saving locally
        setTimeout(() => {
            document.getElementById('admissionSlipForm').reset();
            clearSignature('signatureCanvas1');
            clearSignature('signatureCanvas2');

            const pictureInput = document.getElementById('picture');
            const placeholder = document.getElementById('picturePlaceholder');
            const previewContainer = document.getElementById('picturePreviewContainer');
            const preview = document.getElementById('picturePreview');

            if (pictureInput) pictureInput.value = '';
            if (preview) preview.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        }, 1500);
    }
}
