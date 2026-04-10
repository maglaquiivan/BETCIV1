/**
 * Profile Completion Guard
 * 
 * This script checks if the user has completed their profile before
 * allowing access to enrollment and application forms.
 * 
 * Include this script on pages that require profile completion:
 * - assessment.html (application form)
 * - enrollment pages
 * - any other protected pages
 */

(function() {
    'use strict';

    // Pages that require profile completion
    const PROTECTED_PAGES = [
        'assessment.html',
        'application-form.html',
        'admission-slip.html',
        'registration-form.html'
    ];

    // Check if current page requires profile completion
    function isProtectedPage() {
        const currentPage = window.location.pathname.split('/').pop();
        return PROTECTED_PAGES.some(page => currentPage.includes(page));
    }

    // Check if profile is complete
    function isProfileComplete() {
        try {
            const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
            
            // Check if required fields are filled
            const requiredFields = [
                'firstName',
                'lastName',
                'email',
                'phone',
                'address'
            ];

            const hasAllFields = requiredFields.every(field => {
                const value = userSession[field];
                return value && value.trim() !== '';
            });

            // Also check profileComplete flag if it exists
            if (userSession.profileComplete === false) {
                return false;
            }

            return hasAllFields;
        } catch (error) {
            console.error('Error checking profile completion:', error);
            return false;
        }
    }

    // Show profile incomplete modal
    function showProfileIncompleteModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="profileIncompleteModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                Profile Incomplete
                            </h5>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="bi bi-person-circle" style="font-size: 4rem; color: #ffc107;"></i>
                            <h4 class="mt-3">Complete Your Profile First</h4>
                            <p class="text-muted">
                                Before you can enroll in courses or submit applications, 
                                you need to complete your profile with all required information.
                            </p>
                            <div class="alert alert-info mt-3">
                                <small>
                                    <strong>Required Information:</strong><br>
                                    • Full Name<br>
                                    • Email Address<br>
                                    • Phone Number<br>
                                    • Complete Address
                                </small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="window.history.back()">
                                <i class="bi bi-arrow-left me-1"></i> Go Back
                            </button>
                            <button type="button" class="btn btn-warning" onclick="window.location.href='manage-profile.html?required=true'">
                                <i class="bi bi-person-fill-gear me-1"></i> Complete Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('profileIncompleteModal'));
        modal.show();
    }

    // Check profile completion on page load
    function checkProfileCompletion() {
        // Only check on protected pages
        if (!isProtectedPage()) {
            return;
        }

        // Check if user is logged in
        const userSession = localStorage.getItem('userSession');
        if (!userSession) {
            // Not logged in, redirect to login
            window.location.href = '../../auth/login.html';
            return;
        }

        // Check if profile is complete
        if (!isProfileComplete()) {
            // Profile incomplete, show modal
            showProfileIncompleteModal();
        }
    }

    // Run check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkProfileCompletion);
    } else {
        checkProfileCompletion();
    }

    // Export function for manual checks
    window.checkProfileCompletion = isProfileComplete;
})();
