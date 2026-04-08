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
        const response = await fetch(`${API_BASE_URL}/trainees`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.error('Failed to fetch trainees, status:', response.status);
            throw new Error('Failed to fetch trainees');
        }
        
        allTrainees = await response.json();
        console.log('Loaded trainees:', allTrainees.length, 'trainees');
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
        
        return `
            <div class="trainee-card">
                <div class="trainee-header">
                    <div class="trainee-avatar">${initials}</div>
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
                    <button class="btn-action view" onclick="viewTrainee('${trainee.traineeId}')">
                        <i class="bi bi-eye-fill"></i>
                    </button>
                    <button class="btn-action edit" onclick="editTrainee('${trainee.traineeId}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn-action delete" onclick="openDeleteModal('${trainee.traineeId}', '${trainee.firstName} ${trainee.lastName}')">
                        <i class="bi bi-trash3-fill"></i>
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
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
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
