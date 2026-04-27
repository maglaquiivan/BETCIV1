// Trainees Page - MongoDB Integration with Full CRUD
const API_BASE_URL = 'http://localhost:5500/api';
let currentEditTraineeId = null;
let allTrainees = [];

document.addEventListener('DOMContentLoaded', function() {
    loadTrainees();
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchTrainees(e.target.value));
    }
});

// Load all trainees from MongoDB
async function loadTrainees() {
    console.log('Loading trainees from API...');
    try {
        // Fetch from both trainees and trainee-accounts collections
        const traineesResponse = await fetch(`${API_BASE_URL}/trainees`);
        const traineeAccountsResponse = await fetch(`${API_BASE_URL}/trainee-accounts`);
        
        console.log('Trainees response status:', traineesResponse.status);
        console.log('Trainee accounts response status:', traineeAccountsResponse.status);
        
        if (!traineesResponse.ok && !traineeAccountsResponse.ok) {
            throw new Error('Failed to fetch trainees from both collections');
        }
        
        // Get trainees from both sources
        const traineesData = traineesResponse.ok ? await traineesResponse.json() : [];
        const traineeAccountsData = traineeAccountsResponse.ok ? await traineeAccountsResponse.json() : [];
        
        // Combine both arrays and remove duplicates
        allTrainees = [...traineesData, ...traineeAccountsData];
        
        // Remove duplicates by email
        const seen = new Set();
        allTrainees = allTrainees.filter(trainee => {
            if (seen.has(trainee.email)) {
                return false;
            }
            seen.add(trainee.email);
            return true;
        });
        
        console.log('Loaded trainees:', allTrainees.length, 'trainees');
        
        // Fetch enrollments to get course information
        const enrollmentsResponse = await fetch(`${API_BASE_URL}/enrollments`);
        const enrollments = await enrollmentsResponse.json();
        
        // Fetch courses to get course names
        const coursesResponse = await fetch(`${API_BASE_URL}/courses`);
        const courses = await coursesResponse.json();
        
        // Create course map
        const courseMap = {};
        courses.forEach(course => {
            courseMap[course._id || course.courseId] = course.title || course.courseName;
        });
        
        // Add enrollment data to trainees
        allTrainees = allTrainees.map(trainee => {
            const traineeEnrollments = enrollments.filter(e => 
                e.traineeId === trainee.traineeId || 
                e.traineeId === trainee.accountId ||
                e.accountId === trainee.traineeId ||
                e.accountId === trainee.accountId
            );
            
            trainee.enrolledCourses = traineeEnrollments.map(enrollment => ({
                courseName: courseMap[enrollment.courseId] || 'Unknown Course',
                enrollmentDate: enrollment.enrollmentDate || enrollment.createdAt
            }));
            
            // Map accountId to traineeId for compatibility
            trainee.traineeId = trainee.traineeId || trainee.accountId;
            
            return trainee;
        });
        
        displayTrainees(allTrainees);
        
    } catch (error) {
        console.error('Error loading trainees:', error);
        showNotification('Failed to load trainees. Make sure the server is running.', 'error');
    }
}

// Display trainees in the grid
function displayTrainees(trainees) {
    const container = document.querySelector('.trainees-grid');
    if (!container) return;
    
    if (trainees.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="bi bi-inbox" style="font-size: 48px; color: #999;"></i>
                <p style="color: #999; margin-top: 16px; font-size: 16px;">No trainees found</p>
                <button class="btn btn-primary" onclick="openAddTraineeModal()" style="margin-top: 20px;">
                    <i class="bi bi-plus"></i> Add First Trainee
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = trainees.map(trainee => {
        const initials = `${trainee.firstName.charAt(0)}${trainee.lastName.charAt(0)}`.toUpperCase();
        const course = trainee.enrolledCourses && trainee.enrolledCourses.length > 0 
            ? trainee.enrolledCourses[0].courseName 
            : 'No course enrolled';
        const status = trainee.status || 'active';
        const enrollDate = trainee.enrolledCourses && trainee.enrolledCourses.length > 0 && trainee.enrolledCourses[0].enrollmentDate
            ? new Date(trainee.enrolledCourses[0].enrollmentDate).toLocaleDateString()
            : 'N/A';
        
        // Check if trainee has a profile picture
        const hasProfilePicture = trainee.profilePicture && trainee.profilePicture.trim() !== '';
        const avatarContent = hasProfilePicture 
            ? `<img src="${trainee.profilePicture}" alt="${trainee.firstName} ${trainee.lastName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
            : initials;
        
        return `
            <div class="trainee-card">
                <div class="trainee-header">
                    <div class="trainee-avatar">${avatarContent}</div>
                    <div class="trainee-info">
                        <h3>${trainee.firstName} ${trainee.lastName}</h3>
                        <p>${course}</p>
                    </div>
                    <span class="trainee-status status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <div class="trainee-details">
                    <div class="detail-item">
                        <i class="bi bi-envelope"></i>
                        <span>${trainee.email}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-phone"></i>
                        <span>${trainee.phone || 'No phone'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-geo-alt"></i>
                        <span>${trainee.address || 'No location'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-calendar"></i>
                        <span>Enrolled: ${enrollDate}</span>
                    </div>
                </div>
                <div class="trainee-actions">
                    <button class="btn-action view" onclick="viewTraineeDetailsModal('${trainee.traineeId}')" style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; font-weight: 600; transition: all 0.3s ease; flex: 1; justify-content: center;">
                        <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn-action edit" onclick="editTraineeDetailsModal('${trainee.traineeId}')" style="background: #f39c12; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; font-weight: 600; transition: all 0.3s ease; flex: 1; justify-content: center;">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn-action delete" onclick="deleteTraineeDetailsModal('${trainee.traineeId}')" style="background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; font-weight: 600; transition: all 0.3s ease; flex: 1; justify-content: center;">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Open add trainee modal
function openAddTraineeModal() {
    currentEditTraineeId = null;
    document.getElementById('modalTitle').textContent = 'Add New Trainee';
    document.getElementById('traineeForm').reset();
    document.getElementById('traineeModal').classList.add('active');
}

// Close trainee modal
function closeTraineeModal() {
    document.getElementById('traineeModal').classList.remove('active');
    document.getElementById('traineeForm').reset();
    currentEditTraineeId = null;
}

// View trainee - Show details in modal (read-only)
function viewTrainee(traineeId) {
    // For now, just open edit modal in view mode
    // You can enhance this later with a dedicated view modal
    editTrainee(traineeId);
}

// Edit trainee - Load data into modal
async function editTrainee(traineeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${traineeId}`);
        if (!response.ok) throw new Error('Failed to fetch trainee');
        
        const trainee = await response.json();
        
        // Set current edit ID
        currentEditTraineeId = traineeId;
        
        // Update modal title
        document.getElementById('modalTitle').textContent = 'Edit Trainee';
        
        // Populate form fields
        document.getElementById('traineeName').value = `${trainee.firstName} ${trainee.lastName}`;
        document.getElementById('traineeEmail').value = trainee.email;
        document.getElementById('traineePhone').value = trainee.phone || '';
        document.getElementById('traineeLocation').value = trainee.address || '';
        
        // Set role/course
        const course = trainee.enrolledCourses && trainee.enrolledCourses.length > 0 
            ? trainee.enrolledCourses[0].courseName 
            : '';
        document.getElementById('traineeRole').value = course;
        
        // Set enrolled date
        if (trainee.enrolledCourses && trainee.enrolledCourses.length > 0 && trainee.enrolledCourses[0].enrollmentDate) {
            const date = new Date(trainee.enrolledCourses[0].enrollmentDate);
            document.getElementById('traineeEnrolled').value = date.toISOString().split('T')[0];
        }
        
        // Set status
        document.getElementById('traineeStatus').value = trainee.status || 'active';
        
        // Open modal
        document.getElementById('traineeModal').classList.add('active');
        
    } catch (error) {
        console.error('Error fetching trainee:', error);
        showNotification('Failed to load trainee details', 'error');
    }
}

// Save trainee (Add or Update)
async function saveTrainee(event) {
    event.preventDefault();
    console.log('saveTrainee called');
    
    const fullName = document.getElementById('traineeName').value.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];
    
    const email = document.getElementById('traineeEmail').value;
    const phone = document.getElementById('traineePhone').value;
    const address = document.getElementById('traineeLocation').value;
    const courseName = document.getElementById('traineeRole').value;
    const enrolledDate = document.getElementById('traineeEnrolled').value;
    const status = document.getElementById('traineeStatus').value;
    
    const traineeData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        status,
        enrolledCourses: [{
            courseId: `COURSE${Date.now()}`,
            courseName: courseName,
            enrollmentDate: new Date(enrolledDate),
            status: 'active',
            progress: 0
        }]
    };
    
    try {
        let response;
        
        if (currentEditTraineeId) {
            // Update existing trainee
            console.log('Updating trainee:', currentEditTraineeId);
            response = await fetch(`${API_BASE_URL}/trainees/${currentEditTraineeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(traineeData)
            });
            
            console.log('Update response status:', response.status);
            
            if (response.ok) {
                showNotification('Trainee updated successfully', 'success');
            } else {
                const errorData = await response.json();
                console.error('Update error:', errorData);
                throw new Error(errorData.message || 'Failed to update trainee');
            }
        } else {
            // Create new trainee
            traineeData.traineeId = `TRN${Date.now()}`;
            
            console.log('Creating new trainee with data:', traineeData);
            
            response = await fetch(`${API_BASE_URL}/trainees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(traineeData)
            });
            
            console.log('Create response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Trainee created:', result);
                showNotification('Trainee created successfully', 'success');
            } else {
                const error = await response.json();
                console.error('Create error:', error);
                throw new Error(error.message || 'Failed to create trainee');
            }
        }
        
        // Close modal and reload trainees
        closeTraineeModal();
        await loadTrainees();
        
    } catch (error) {
        console.error('Error saving trainee:', error);
        showNotification(error.message || 'Failed to save trainee', 'error');
    }
}

// Open delete modal
function openDeleteModal(traineeId, traineeName) {
    window.currentDeleteTraineeId = traineeId;
    document.getElementById('deleteTraineeNameModal').textContent = traineeName;
    document.getElementById('deleteConfirmInput').value = '';
    document.getElementById('deleteConfirmInput').placeholder = `Type "${traineeName}" to confirm`;
    document.getElementById('deleteErrorMsg').style.display = 'none';
    document.getElementById('deleteModal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    window.currentDeleteTraineeId = null;
}

// Confirm delete trainee
async function confirmDelete() {
    const traineeName = document.getElementById('deleteTraineeNameModal').textContent;
    const confirmInput = document.getElementById('deleteConfirmInput').value;
    const errorMsg = document.getElementById('deleteErrorMsg');
    
    if (confirmInput !== traineeName) {
        errorMsg.style.display = 'block';
        document.getElementById('deleteConfirmInput').style.borderColor = 'var(--danger)';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${window.currentDeleteTraineeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Trainee deleted successfully', 'success');
            closeDeleteModal();
            loadTrainees();
        } else {
            throw new Error('Failed to delete trainee');
        }
        
    } catch (error) {
        console.error('Error deleting trainee:', error);
        showNotification('Failed to delete trainee', 'error');
    }
}

// Search trainees
function searchTrainees(query) {
    const cards = document.querySelectorAll('.trainee-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    // Set icon based on type
    let icon = '';
    let bgColor = '';
    switch(type) {
        case 'success':
            icon = '<i class="bi bi-check-circle-fill"></i>';
            bgColor = '#10b981';
            break;
        case 'error':
            icon = '<i class="bi bi-x-circle-fill"></i>';
            bgColor = '#ef4444';
            break;
        case 'warning':
            icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
            bgColor = '#f59e0b';
            break;
        default:
            icon = '<i class="bi bi-info-circle-fill"></i>';
            bgColor = '#3b82f6';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        min-width: 300px;
        max-width: 500px;
    `;
    
    // Add animation styles if not already added
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            .custom-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .custom-notification .notification-icon {
                font-size: 24px;
                display: flex;
                align-items: center;
            }
            
            .custom-notification .notification-message {
                font-size: 14px;
                font-weight: 500;
                flex: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds with slide out animation
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Quick action functions
function viewReports() {
    window.location.href = 'records.html';
}

function manageAppointments() {
    window.location.href = 'appointments.html';
}

function openSettings() {
    window.location.href = 'settings.html';
}

// Filter trainees by course
function filterTraineesByCourse(courseId) {
    if (courseId === 'all') {
        displayTrainees(allTrainees);
    } else {
        const courseMap = {
            'forklift': 'forklift',
            'bulldozer': 'bulldozer',
            'dump-truck': 'dump truck',
            'excavator': 'excavator',
            'wheel-loader': 'wheel loader',
            'backhoe': 'backhoe'
        };
        
        const searchTerm = courseMap[courseId] || courseId;
        
        const filtered = allTrainees.filter(trainee => {
            if (trainee.enrolledCourses && trainee.enrolledCourses.length > 0) {
                const courseName = trainee.enrolledCourses[0].courseName.toLowerCase();
                return courseName.includes(searchTerm.toLowerCase());
            }
            return false;
        });
        
        displayTrainees(filtered);
    }
}

// View trainee details
function viewTraineeDetails(traineeId) {
    console.log('Viewing trainee:', traineeId);
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`)
        .then(res => res.json())
        .then(trainee => {
            // Show trainee details in a modal or alert
            const details = `
Name: ${trainee.firstName} ${trainee.lastName}
Email: ${trainee.email}
Phone: ${trainee.phone || 'N/A'}
Address: ${trainee.address || 'N/A'}
Status: ${trainee.status || 'active'}
Enrolled: ${trainee.enrolledCourses && trainee.enrolledCourses[0] ? trainee.enrolledCourses[0].courseName : 'No course'}
            `;
            alert(details);
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to load trainee details');
        });
}

// Edit trainee details
function editTraineeDetails(traineeId) {
    console.log('Editing trainee:', traineeId);
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`)
        .then(res => res.json())
        .then(trainee => {
            // Prompt for new values
            const firstName = prompt('First Name:', trainee.firstName);
            if (firstName === null) return;
            
            const lastName = prompt('Last Name:', trainee.lastName);
            if (lastName === null) return;
            
            const email = prompt('Email:', trainee.email);
            if (email === null) return;
            
            const phone = prompt('Phone:', trainee.phone || '');
            if (phone === null) return;
            
            const address = prompt('Address:', trainee.address || '');
            if (address === null) return;
            
            const status = prompt('Status (active/inactive/graduated):', trainee.status || 'active');
            if (status === null) return;
            
            // Update trainee
            const updatedData = {
                firstName,
                lastName,
                email,
                phone,
                address,
                status,
                enrolledCourses: trainee.enrolledCourses || []
            };
            
            return fetch(`${API_BASE_URL}/trainees/${traineeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
        })
        .then(res => {
            if (res.ok) {
                alert('Trainee updated successfully');
                loadTrainees();
            } else {
                alert('Failed to update trainee');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Error updating trainee: ' + err.message);
        });
}

// Delete trainee details
function deleteTraineeDetails(traineeId) {
    if (!confirm('Are you sure you want to delete this trainee? This action cannot be undone.')) return;
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            alert('Trainee deleted successfully');
            loadTrainees();
        } else {
            alert('Failed to delete trainee');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error deleting trainee: ' + err.message);
    });
}


// ===== MODAL FUNCTIONS =====

// Create modal HTML
function createModal() {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('traineeModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'traineeModal';
    modal.innerHTML = `
        <div class="trainee-modal-overlay">
            <div class="trainee-modal-content">
                <div class="trainee-modal-header">
                    <h2 id="modalTitle">Trainee Details</h2>
                    <button class="trainee-modal-close" onclick="closeTraineeModal()">&times;</button>
                </div>
                <div class="trainee-modal-body" id="modalBody"></div>
                <div class="trainee-modal-footer" id="modalFooter"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add CSS only if not already added
    if (!document.getElementById('traineeModalStyles')) {
        const style = document.createElement('style');
        style.id = 'traineeModalStyles';
        style.textContent = `
        .trainee-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .trainee-modal-overlay.active {
            display: flex;
        }
        
        .trainee-modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 700px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            animation: modalSlideIn 0.3s ease-out;
            overflow: hidden;
        }
        
        @keyframes modalSlideIn {
            from {
                transform: translateY(-50px) scale(0.95);
                opacity: 0;
            }
            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        .trainee-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #f0f0f0;
            background: #f9f9f9;
        }
        
        .trainee-modal-header h2 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .trainee-modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #7f8c8d;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            border-radius: 6px;
        }
        
        .trainee-modal-close:hover {
            background: #e8e8e8;
            color: #2c3e50;
            transform: rotate(90deg);
        }
        
        .trainee-modal-body {
            padding: 32px;
            overflow-y: auto;
            flex: 1;
        }
        
        .trainee-modal-body::-webkit-scrollbar {
            width: 8px;
        }
        
        .trainee-modal-body::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        .trainee-modal-body::-webkit-scrollbar-thumb {
            background: #bbb;
            border-radius: 4px;
        }
        
        .trainee-modal-body::-webkit-scrollbar-thumb:hover {
            background: #888;
        }
        
        .trainee-modal-footer {
            display: flex;
            gap: 12px;
            padding: 24px;
            border-top: 1px solid #f0f0f0;
            justify-content: flex-end;
            background: #f9f9f9;
        }
        
        .modal-btn {
            padding: 12px 28px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 120px;
            justify-content: center;
        }
        
        .modal-btn-primary {
            background: linear-gradient(135deg, #E67E22 0%, #F4C430 100%);
            color: white;
        }
        
        .modal-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
        }
        
        .modal-btn-primary:active {
            transform: translateY(0);
        }
        
        .modal-btn-secondary {
            background: #ecf0f1;
            color: #2c3e50;
            border: 1px solid #bdc3c7;
        }
        
        .modal-btn-secondary:hover {
            background: #d5dbdb;
            transform: translateY(-2px);
        }
        
        .modal-btn-danger {
            background: #e74c3c;
            color: white;
        }
        
        .modal-btn-danger:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }
        
        .trainee-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }
        
        .detail-field {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-size: 11px;
            font-weight: 700;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-size: 15px;
            color: #2c3e50;
            font-weight: 500;
            word-break: break-word;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
            box-sizing: border-box;
            background: white;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #E67E22;
            box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
            background: #fafafa;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .delete-warning {
            text-align: center;
            padding: 20px 0;
        }
        
        .delete-warning i {
            font-size: 64px;
            color: #e74c3c;
            display: block;
            margin-bottom: 20px;
        }
        
        .delete-warning h3 {
            margin: 0 0 16px 0;
            color: #2c3e50;
            font-size: 20px;
        }
        
        .delete-warning p {
            color: #7f8c8d;
            margin: 0 0 8px 0;
            font-size: 14px;
        }
        
        .delete-warning .trainee-name {
            color: #2c3e50;
            font-weight: 700;
            font-size: 16px;
            margin: 16px 0;
        }
        
        .delete-warning .warning-text {
            color: #e74c3c;
            font-size: 13px;
            margin-top: 16px;
        }
        
        @media (max-width: 600px) {
            .trainee-modal-content {
                max-width: 95%;
            }
            
            .trainee-details-grid {
                grid-template-columns: 1fr;
            }
            
            .trainee-modal-body {
                padding: 20px;
            }
            
            .trainee-modal-header {
                padding: 16px;
            }
            
            .trainee-modal-footer {
                flex-direction: column;
            }
            
            .modal-btn {
                width: 100%;
            }
        }
    `;
        document.head.appendChild(style);
    }
}

// View trainee details with modal
function viewTraineeDetailsModal(traineeId) {
    console.log('Viewing trainee:', traineeId);
    
    createModal();
    
    // Wait a tick to ensure modal is in DOM
    setTimeout(() => {
        fetch(`${API_BASE_URL}/trainees/${traineeId}`)
            .then(res => res.json())
            .then(trainee => {
                const modalTitle = document.getElementById('modalTitle');
                const modalBody = document.getElementById('modalBody');
                const modalFooter = document.getElementById('modalFooter');
                const modalOverlay = document.querySelector('.trainee-modal-overlay');
                
                if (!modalTitle || !modalBody || !modalFooter || !modalOverlay) {
                    console.error('Modal elements not found', {modalTitle, modalBody, modalFooter, modalOverlay});
                    return;
                }
                
                modalTitle.textContent = `${trainee.firstName} ${trainee.lastName}`;
            
            modalBody.innerHTML = `
                <div class="trainee-details-grid">
                    <div class="detail-field">
                        <span class="detail-label">First Name</span>
                        <span class="detail-value">${trainee.firstName}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Last Name</span>
                        <span class="detail-value">${trainee.lastName}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${trainee.email}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${trainee.phone || 'N/A'}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${trainee.address || 'N/A'}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Status</span>
                        <span class="detail-value" style="color: ${trainee.status === 'active' ? '#27AE60' : '#e74c3c'}; font-weight: 600;">
                            ${trainee.status ? trainee.status.charAt(0).toUpperCase() + trainee.status.slice(1) : 'N/A'}
                        </span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Enrolled Course</span>
                        <span class="detail-value">${trainee.enrolledCourses && trainee.enrolledCourses[0] ? trainee.enrolledCourses[0].courseName : 'No course'}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Account ID</span>
                        <span class="detail-value">${trainee.traineeId || 'N/A'}</span>
                    </div>
                </div>
            `;
            
            modalFooter.innerHTML = `
                <button class="modal-btn modal-btn-secondary" onclick="closeTraineeModal()">
                    <i class="bi bi-x-circle"></i> Close
                </button>
            `;
            
            modalOverlay.classList.add('active');
            })
            .catch(err => {
                console.error('Error:', err);
                showNotification('Failed to load trainee details', 'error');
            });
    }, 0);
}

// Edit trainee details with modal
function editTraineeDetailsModal(traineeId) {
    console.log('Editing trainee:', traineeId);
    
    createModal();
    
    // Wait a tick to ensure modal is in DOM
    setTimeout(() => {
        fetch(`${API_BASE_URL}/trainees/${traineeId}`)
            .then(res => res.json())
            .then(trainee => {
                const modalTitle = document.getElementById('modalTitle');
                const modalBody = document.getElementById('modalBody');
                const modalFooter = document.getElementById('modalFooter');
                const modalOverlay = document.querySelector('.trainee-modal-overlay');
                
                if (!modalTitle || !modalBody || !modalFooter || !modalOverlay) {
                    console.error('Modal elements not found');
                    return;
                }
                
                modalTitle.textContent = `Edit: ${trainee.firstName} ${trainee.lastName}`;
            
            modalBody.innerHTML = `
                <div class="trainee-details-grid">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" id="editFirstName" value="${trainee.firstName}">
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" id="editLastName" value="${trainee.lastName}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editEmail" value="${trainee.email}">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="editPhone" value="${trainee.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" id="editAddress" value="${trainee.address || ''}">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="editStatus">
                            <option value="active" ${trainee.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${trainee.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="graduated" ${trainee.status === 'graduated' ? 'selected' : ''}>Graduated</option>
                        </select>
                    </div>
                </div>
            `;
            
            modalFooter.innerHTML = `
                <button class="modal-btn modal-btn-secondary" onclick="closeTraineeModal()">
                    <i class="bi bi-x-circle"></i> Cancel
                </button>
                <button class="modal-btn modal-btn-primary" onclick="saveTraineeEdit('${traineeId}')">
                    <i class="bi bi-check-circle"></i> Save Changes
                </button>
            `;
            
            modalOverlay.classList.add('active');
            })
            .catch(err => {
                console.error('Error:', err);
                showNotification('Failed to load trainee details', 'error');
            });
    }, 0);
}

// Save trainee edit
function saveTraineeEdit(traineeId) {
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const address = document.getElementById('editAddress').value;
    const status = document.getElementById('editStatus').value;
    
    if (!firstName || !lastName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const updatedData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        status
    };
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(res => {
        if (res.ok) {
            showNotification('Trainee updated successfully', 'success');
            closeTraineeModal();
            loadTrainees();
        } else {
            showNotification('Failed to update trainee', 'error');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification('Error updating trainee: ' + err.message, 'error');
    });
}

// Delete trainee details with modal
function deleteTraineeDetailsModal(traineeId) {
    createModal();
    
    // Wait a tick to ensure modal is in DOM
    setTimeout(() => {
        fetch(`${API_BASE_URL}/trainees/${traineeId}`)
            .then(res => res.json())
            .then(trainee => {
                const modalTitle = document.getElementById('modalTitle');
                const modalBody = document.getElementById('modalBody');
                const modalFooter = document.getElementById('modalFooter');
                const modalOverlay = document.querySelector('.trainee-modal-overlay');
                
                if (!modalTitle || !modalBody || !modalFooter || !modalOverlay) {
                    console.error('Modal elements not found');
                    return;
                }
                
                modalTitle.textContent = `Delete Trainee`;
            
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 64px; color: #e74c3c; display: block; margin-bottom: 20px;"></i>
                    <h3 style="margin: 0 0 16px 0; color: #2c3e50;">Are you sure?</h3>
                    <p style="color: #7f8c8d; margin: 0 0 8px 0; font-size: 16px;">You are about to delete:</p>
                    <p style="color: #2c3e50; font-weight: 600; font-size: 18px; margin: 0 0 24px 0;">
                        ${trainee.firstName} ${trainee.lastName}
                    </p>
                    <p style="color: #e74c3c; font-size: 14px; margin: 0 0 24px 0;">
                        This action cannot be undone.
                    </p>
                    
                    <div class="form-group" style="text-align: left; margin-top: 24px;">
                        <label style="display: block; font-size: 12px; font-weight: 700; color: #7f8c8d; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
                            Type the name to confirm deletion
                        </label>
                        <input type="text" id="deleteConfirmInput" placeholder="Enter full name" style="width: 100%; padding: 12px 14px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit; transition: all 0.2s ease; box-sizing: border-box; background: white;">
                        <p id="deleteErrorMsg" style="color: #e74c3c; font-size: 12px; margin-top: 8px; display: none;">Name does not match. Please try again.</p>
                    </div>
                </div>
            `;
            
            modalFooter.innerHTML = `
                <button class="modal-btn modal-btn-secondary" onclick="closeTraineeModal()">
                    <i class="bi bi-x-circle"></i> Cancel
                </button>
                <button class="modal-btn modal-btn-danger" onclick="confirmDeleteTraineeWithInput('${traineeId}', '${trainee.firstName} ${trainee.lastName}')">
                    <i class="bi bi-trash"></i> Delete Permanently
                </button>
            `;
            
            // Add focus event to input
            setTimeout(() => {
                const input = document.getElementById('deleteConfirmInput');
                if (input) {
                    input.focus();
                    input.addEventListener('input', function() {
                        document.getElementById('deleteErrorMsg').style.display = 'none';
                        this.style.borderColor = '#ddd';
                    });
                }
            }, 100);
            
            modalOverlay.classList.add('active');
            })
            .catch(err => {
                console.error('Error:', err);
                showNotification('Failed to load trainee details', 'error');
            });
    }, 0);
}

// Confirm delete with name verification
function confirmDeleteTraineeWithInput(traineeId, traineeName) {
    const input = document.getElementById('deleteConfirmInput');
    const errorMsg = document.getElementById('deleteErrorMsg');
    
    if (input.value.trim() !== traineeName) {
        errorMsg.style.display = 'block';
        input.style.borderColor = '#e74c3c';
        input.focus();
        return;
    }
    
    confirmDeleteTrainee(traineeId);
}

// Confirm delete trainee
function confirmDeleteTrainee(traineeId) {
    fetch(`${API_BASE_URL}/trainees/${traineeId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            showNotification('Trainee deleted successfully', 'success');
            closeTraineeModal();
            loadTrainees();
        } else {
            showNotification('Failed to delete trainee', 'error');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification('Error deleting trainee: ' + err.message, 'error');
    });
}

// Close modal
function closeTraineeModal() {
    const modalOverlay = document.querySelector('.trainee-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('trainee-modal-overlay')) {
        closeTraineeModal();
    }
});
