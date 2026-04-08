

'use strict';

class RegistrationFormHandler {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = null;
        this.originalBtnText = '';
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('Registration form not found');
            return;
        }

        this.submitBtn = this.form.querySelector('button[type="submit"]');
        if (this.submitBtn) {
            this.originalBtnText = this.submitBtn.innerHTML;
        }

        this.setupEventListeners();
        this.setupULIInputs();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.showConfirmationModal(e));

        const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
        if (confirmSubmitBtn) {
            confirmSubmitBtn.addEventListener('click', () => this.handleConfirmedSubmit());
        }

        this.setupBirthFieldValidation();

        this.setupEmploymentEducationValidation();
    }

    setupBirthFieldValidation() {
        const birthMonth = document.getElementById('birthMonth');
        const birthDay = document.getElementById('birthDay');
        const birthYear = document.getElementById('birthYear');
        const age = document.getElementById('age');
        const contactNo = document.getElementById('contactNo');

        if (birthMonth) {
            birthMonth.addEventListener('blur', () => {
                const value = parseInt(birthMonth.value);
                if (birthMonth.value && (value < 1 || value > 12)) {
                    this.showFieldError(birthMonth, 'Month must be between 1 and 12');
                } else {
                    this.clearFieldError(birthMonth);
                }
            });
        }

        if (birthDay) {
            birthDay.addEventListener('blur', () => {
                const value = parseInt(birthDay.value);
                if (birthDay.value && (value < 1 || value > 31)) {
                    this.showFieldError(birthDay, 'Day must be between 1 and 31');
                } else {
                    this.clearFieldError(birthDay);
                }
            });
        }

        if (birthYear) {
            birthYear.addEventListener('blur', () => {
                const value = parseInt(birthYear.value);
                const currentYear = new Date().getFullYear();
                if (birthYear.value && (value < 1900 || value > currentYear)) {
                    this.showFieldError(birthYear, `Year must be between 1900 and ${currentYear}`);
                } else {
                    this.clearFieldError(birthYear);
                }
            });
        }

        if (age) {
            age.addEventListener('blur', () => {
                const value = parseInt(age.value);
                if (age.value && (value < 1 || value > 120)) {
                    this.showFieldError(age, 'Age must be between 1 and 120');
                } else {
                    this.clearFieldError(age);
                }
            });
        }

        if (contactNo) {
            contactNo.addEventListener('blur', () => {
                if (!contactNo.value || contactNo.value.trim() === '') {
                    this.showFieldError(contactNo, 'Contact number is required');
                } else {
                    this.clearFieldError(contactNo);
                }
            });
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        field.classList.add('is-invalid');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');

        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupEmploymentEducationValidation() {
        const employmentStatusInputs = document.querySelectorAll('input[name="employmentStatus"]');
        const employmentTypeInputs = document.querySelectorAll('input[name="employmentType"]');
        const educationInputs = document.querySelectorAll('input[name="education"]');
        const clientClassificationInputs = document.querySelectorAll('input[name="clientClassification"]');

        employmentStatusInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('employmentStatus');

                const selectedValue = document.querySelector('input[name="employmentStatus"]:checked')?.value;
                const employmentTypeSection = document.querySelector('input[name="employmentType"]')?.closest('.mt-3');

                if (selectedValue === 'wage' || selectedValue === 'underemployed') {
                    if (employmentTypeSection) {
                        employmentTypeSection.style.opacity = '1';
                        employmentTypeSection.style.pointerEvents = 'auto';
                    }
                } else {
                    if (employmentTypeSection) {
                        employmentTypeSection.style.opacity = '0.5';
                        employmentTypeSection.style.pointerEvents = 'none';
                    }
                    employmentTypeInputs.forEach(typeInput => {
                        typeInput.checked = false;
                    });
                    this.clearRadioGroupRedBorder('employmentType');
                }
            });
        });

        employmentTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('employmentType');
            });
        });

        educationInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('education');
            });
        });

        const sexInputs = document.querySelectorAll('input[name="sex"]');
        sexInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('sex');
            });
        });

        const civilStatusInputs = document.querySelectorAll('input[name="civilStatus"]');
        civilStatusInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('civilStatus');
            });
        });

        clientClassificationInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.clearRadioGroupRedBorder('clientClassification');
            });
        });
    }

    showRadioGroupRedBorder(groupName) {
        this.clearRadioGroupRedBorder(groupName);

        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.add('radio-required-error');
        });
    }

    clearRadioGroupRedBorder(groupName) {
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.remove('radio-required-error');
        });
    }

    showRadioGroupError(groupName, message) {
        this.clearRadioGroupError(groupName);

        const firstInput = document.querySelector(`input[name="${groupName}"]`);
        if (!firstInput) return;

        let container = firstInput.closest('.card-body') || firstInput.closest('.col-md-4') || firstInput.closest('.mb-3');
        if (!container) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback radio-group-error';
        errorDiv.style.display = 'block';
        errorDiv.textContent = message;
        errorDiv.setAttribute('data-group', groupName);

        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.add('is-invalid');
        });

        container.appendChild(errorDiv);
    }

    clearRadioGroupError(groupName) {
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
            input.classList.remove('is-invalid');
        });

        const errorDiv = document.querySelector(`.radio-group-error[data-group="${groupName}"]`);
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupULIInputs() {
        const uliInputs = document.querySelectorAll('.uli-input');
        uliInputs.forEach((input, index) => {
            input.addEventListener('input', function () {
                if (this.value.length === 1 && index < uliInputs.length - 1) {
                    uliInputs[index + 1].focus();
                }
            });
        });
    }

    showConfirmationModal(e) {
        e.preventDefault();

        const formData = this.collectFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        this.pendingFormData = formData;

        this.loadLevelIIICourses();

        const layoutOverlay = document.getElementById('layoutOverlay');
        if (layoutOverlay) {
            layoutOverlay.classList.add('active');
        }

        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));

        const modalElement = document.getElementById('confirmationModal');
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (layoutOverlay) {
                layoutOverlay.classList.remove('active');
            }
            this.formSubmitted = false;
        }, { once: true });

        if (layoutOverlay) {
            layoutOverlay.addEventListener('click', () => {
                modal.hide();
            }, { once: true });
        }

        modal.show();
    }

    async handleConfirmedSubmit() {
        const selectedCourse = document.getElementById('selectedCourse');
        if (!selectedCourse || !selectedCourse.value) {
            selectedCourse.classList.add('is-invalid');
            this.showToast('Please select a course before submitting', 'error');
            return;
        }
        selectedCourse.classList.remove('is-invalid');

        this.pendingFormData.selectedCourse = selectedCourse.value;
        this.pendingFormData.selectedCourseId = selectedCourse.options[selectedCourse.selectedIndex].dataset.courseId;

        this.formSubmitted = true;

        const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        if (confirmationModal) {
            confirmationModal.hide();
        }

        const layoutOverlay = document.getElementById('layoutOverlay');
        if (layoutOverlay) {
            layoutOverlay.classList.remove('active');
        }

        this.setLoadingState(true);

        try {
            const response = await this.submitToDatabase(this.pendingFormData);

            if (response.success) {
                this.showToast('Registration submitted successfully! You will receive a confirmation email shortly.', 'success');

                this.form.reset();
            } else {
                throw new Error(response.message || 'Failed to submit registration');
            }

        } catch (error) {
            console.error('Registration submission error:', error);
            this.showErrorMessage(error.message || 'An error occurred while submitting the registration');
        } finally {
            this.setLoadingState(false);
        }
    }

    async loadLevelIIICourses() {
        const dropdown = document.getElementById('selectedCourse');
        if (!dropdown) return;

        try {
            const API_BASE_URL = window.API_BASE_URL || window.location.origin + '/CAATE-ITRMS/backend/public';
            const response = await fetch(`${API_BASE_URL}/api/v1/courses`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
                const levelIIICourses = result.data.filter(course => {
                    const badge = (course.badge || course.course_code || '').toUpperCase();
                    const enrollmentStatus = course.enrollment_status || '';
                    return (badge.includes('LEVEL III') || badge.includes('LEVEL 3') || badge.includes('LEVEL-III'))
                        && enrollmentStatus === 'Open Enrollment';
                });

                dropdown.innerHTML = '<option value="">Select a course...</option>';

                if (levelIIICourses.length > 0) {
                    levelIIICourses.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.title || 'Untitled Course';
                        option.dataset.courseId = course._id?.$oid || course._id || '';
                        option.textContent = `${course.title || 'Untitled Course'} (${course.badge || course.course_code || ''})`;
                        dropdown.appendChild(option);
                    });
                } else {
                    dropdown.innerHTML = '<option value="">No Level III courses available with open enrollment</option>';
                }
            } else {
                dropdown.innerHTML = '<option value="">No courses available</option>';
            }
        } catch (error) {
            console.error('Error loading Level III courses:', error);
            dropdown.innerHTML = '<option value="">Error loading courses</option>';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.setLoadingState(true);

        try {
            const formData = this.collectFormData();

            if (!this.validateForm(formData)) {
                this.setLoadingState(false);
                return;
            }

            const response = await this.submitToDatabase(formData);

            if (response.success) {
                this.form.reset();
            } else {
                throw new Error(response.message || 'Failed to submit registration');
            }

        } catch (error) {
            console.error('Registration submission error:', error);
            this.showErrorMessage(error.message || 'An error occurred while submitting the registration');
        } finally {
            this.setLoadingState(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (let [key, value] of formData.entries()) {
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

        const userId = localStorage.getItem('userId');
        if (userId) {
            data.userId = userId;
        }

        const uliInputs = document.querySelectorAll('.uli-input');
        let uliNumber = '';
        uliInputs.forEach((input, index) => {
            uliNumber += input.value || '';
            if (index === 2 || index === 4 || index === 7 || index === 12) {
                uliNumber += '-';
            }
        });
        data.uliNumber = uliNumber;

        const checkboxGroups = ['clientClassification', 'disabilityType', 'disabilityCause'];
        checkboxGroups.forEach(group => {
            const checkboxes = document.querySelectorAll(`input[name="${group}"]:checked`);
            data[group] = Array.from(checkboxes).map(cb => {
                if (cb.value === 'others' && group === 'clientClassification') {
                    const othersInput = document.querySelector('input[name="clientClassificationOthers"]');
                    const othersText = othersInput ? othersInput.value.trim() : '';
                    return othersText ? `others: ${othersText}` : 'others';
                }
                return cb.value;
            });
        });

        data.submittedAt = new Date().toISOString();
        data.status = 'pending';

        return data;
    }

    validateForm(data) {
        let isValid = true;

        this.clearAllErrors();

        const requiredFields = [
            'firstName',
            'numberStreet',
            'barangay',
            'district',
            'cityMunicipality',
            'province',
            'region',
            'emailFacebook',
            'contactNo',
            'nationality',
            'sex',
            'civilStatus',
            'employmentStatus',
            'education',
            'birthMonth',
            'birthDay',
            'birthYear',
            'age',
            'birthCity',
            'birthProvince',
            'birthRegion',
            'parentName',
            'parentAddress',
            'courseQualification'
        ];

        const missingFields = [];
        const fieldLabels = {
            'firstName': 'First Name',
            'numberStreet': 'Number, Street',
            'barangay': 'Barangay',
            'district': 'District',
            'cityMunicipality': 'City/Municipality',
            'province': 'Province',
            'region': 'Region',
            'emailFacebook': 'Email Address/Facebook Account',
            'contactNo': 'Contact Number',
            'nationality': 'Nationality',
            'sex': 'Sex',
            'civilStatus': 'Civil Status',
            'employmentStatus': 'Employment Status',
            'employmentType': 'Employment Type',
            'birthMonth': 'Month of Birth',
            'birthDay': 'Day of Birth',
            'birthYear': 'Year of Birth',
            'age': 'Age',
            'birthCity': 'Birth City/Municipality',
            'birthProvince': 'Birth Province',
            'birthRegion': 'Birth Region',
            'education': 'Educational Attainment',
            'parentName': 'Parent/Guardian Name',
            'parentAddress': 'Parent/Guardian Address',
            'courseQualification': 'Course/Qualification Name',
            'clientClassification': 'Learner/Trainee/Student Classification'
        };

        requiredFields.forEach(field => {
            if (!data[field] || data[field].toString().trim() === '') {
                missingFields.push(fieldLabels[field] || field);

                if (field === 'sex' || field === 'civilStatus' || field === 'employmentStatus' || field === 'education') {
                    this.showRadioGroupRedBorder(field);
                    isValid = false;
                }

                const inputElement = document.getElementById(field) || document.querySelector(`[name="${field}"]`);
                if (inputElement && (inputElement.type === 'text' || inputElement.type === 'number' || inputElement.type === 'email' || inputElement.tagName === 'TEXTAREA')) {
                    this.showFieldError(inputElement, `${fieldLabels[field]} is required`);
                    isValid = false;
                }
            }
        });

        const clientClassifications = document.querySelectorAll('input[name="clientClassification"]:checked');
        if (clientClassifications.length === 0) {
            this.showRadioGroupRedBorder('clientClassification');
            isValid = false;
        }

        if (data.employmentStatus && (data.employmentStatus === 'wage' || data.employmentStatus === 'underemployed')) {
            if (!data.employmentType || data.employmentType.toString().trim() === '') {
                this.showRadioGroupRedBorder('employmentType');
                this.showToast('Please select an Employment Type when Wage-Employed or Underemployed is selected.', 'error');
                isValid = false;
            }
        }

        if (data.birthMonth && (data.birthMonth < 1 || data.birthMonth > 12)) {
            this.showToast('Month of Birth must be between 1 and 12', 'error');
            return false;
        }

        if (data.birthDay && (data.birthDay < 1 || data.birthDay > 31)) {
            this.showToast('Day of Birth must be between 1 and 31', 'error');
            return false;
        }

        const currentYear = new Date().getFullYear();
        if (data.birthYear && (data.birthYear < 1900 || data.birthYear > currentYear)) {
            this.showToast(`Year of Birth must be between 1900 and ${currentYear}`, 'error');
            return false;
        }

        if (data.age && (data.age < 1 || data.age > 120)) {
            this.showToast('Age must be between 1 and 120', 'error');
            return false;
        }

        if (missingFields.length > 0) {
            console.log('Validation failed - showing simple message');
            this.showToast('Please complete all required fields.', 'error');
            return false;
        }

        return isValid;
    }

    clearAllErrors() {
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });

        document.querySelectorAll('.invalid-feedback, .radio-group-error').forEach(error => {
            error.remove();
        });

        document.querySelectorAll('.radio-required-error').forEach(radio => {
            radio.classList.remove('radio-required-error');
        });

        document.querySelectorAll('.card-body').forEach(cardBody => {
            cardBody.style.backgroundColor = '';
        });
    }

    async submitToDatabase(data) {
        try {
            console.log('Submitting registration data:', data);

            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            return result;
        } catch (error) {
            console.error('Database submission error:', error);
            throw error;
        }
    }

    setLoadingState(loading) {
        if (!this.submitBtn) return;

        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Submitting...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnText;
        }
    }

    showSuccessModal() {
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

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

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const handler = new RegistrationFormHandler();

    window.testToast = function (message = 'Test notification', type = 'success') {
        handler.showToast(message, type);
    };
});

