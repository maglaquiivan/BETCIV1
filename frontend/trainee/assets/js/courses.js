// API Configuration
const API_BASE_URL = 'http://localhost:5500/api';
let currentUser = null;
let allCourses = [];
let userEnrollments = [];
let currentFilter = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    loadCoursesAndEnrollments();
});

// Load current user from session
function loadCurrentUser() {
    const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    if (userSession) {
        try {
            currentUser = JSON.parse(userSession);
        } catch (e) {
            console.error('Error parsing user session:', e);
        }
    }
}

// Load courses and user enrollments
async function loadCoursesAndEnrollments() {
    try {
        // Fetch all courses
        const coursesResponse = await fetch(`${API_BASE_URL}/courses`);
        allCourses = await coursesResponse.json();
        
        // Fetch user enrollments if logged in
        if (currentUser && currentUser.userId) {
            const enrollmentsResponse = await fetch(`${API_BASE_URL}/enrollments/user/${currentUser.userId}`);
            userEnrollments = await enrollmentsResponse.json();
        }
        
        // Display courses
        displayCourses(currentFilter);
    } catch (error) {
        console.error('Error loading courses:', error);
        showError('Failed to load courses. Please try again.');
    }
}

// Display courses based on filter
function displayCourses(filter) {
    currentFilter = filter;
    const coursesGrid = document.getElementById('all-courses-grid');
    if (!coursesGrid) return;
    
    let filteredCourses = [];
    
    switch(filter) {
        case 'all':
            filteredCourses = allCourses;
            break;
        case 'active':
            // Show only enrolled courses with active status
            const activeCourseIds = userEnrollments
                .filter(e => e.status === 'active')
                .map(e => e.courseId);
            filteredCourses = allCourses.filter(c => activeCourseIds.includes(c._id));
            break;
        case 'completed':
            // Show only completed courses
            const completedCourseIds = userEnrollments
                .filter(e => e.status === 'completed')
                .map(e => e.courseId);
            filteredCourses = allCourses.filter(c => completedCourseIds.includes(c._id));
            break;
        case 'available':
            // Show courses not yet enrolled
            const enrolledCourseIds = userEnrollments.map(e => e.courseId);
            filteredCourses = allCourses.filter(c => !enrolledCourseIds.includes(c._id));
            break;
    }
    
    coursesGrid.innerHTML = '';
    
    if (filteredCourses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>No courses found</p>
            </div>
        `;
        return;
    }
    
    filteredCourses.forEach(course => {
        const enrollment = userEnrollments.find(e => e.courseId === course._id);
        const card = createCourseCard(course, enrollment);
        coursesGrid.appendChild(card);
    });
}

// Create course card element
function createCourseCard(course, enrollment) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.cursor = 'pointer';
    
    // Determine button text and status
    let buttonHTML = '';
    let statusBadge = '';
    let progressBar = '';
    
    if (enrollment) {
        if (enrollment.status === 'completed') {
            buttonHTML = `
                <button class="enroll-btn completed" disabled>
                    <i class="bi bi-check-circle"></i> Completed
                </button>
            `;
            statusBadge = '<span class="status-badge status-completed">Completed</span>';
        } else {
            buttonHTML = `
                <button class="enroll-btn continue" onclick="continueLearning('${course._id}', event)">
                    <i class="bi bi-play-circle"></i> Continue Learning
                </button>
            `;
            statusBadge = '<span class="status-badge status-active">Active</span>';
            progressBar = `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                    </div>
                    <span class="progress-text">${enrollment.progress}% Complete</span>
                </div>
            `;
        }
    } else {
        buttonHTML = `
            <button class="enroll-btn" onclick="enrollInCourse('${course._id}', event)">
                <i class="bi bi-plus-circle"></i> Enroll Now
            </button>
        `;
        statusBadge = '<span class="status-badge status-available">Available</span>';
    }
    
    // Get course image path
    const imagePath = course.image || course.imageUrl || '/assets/img/logo.png';
    
    card.innerHTML = `
        <div class="course-image" onclick="showCourseDetails('${course._id}')">
            <img src="${imagePath}" alt="${course.title || course.courseName}" onerror="this.src='/assets/img/logo.png'">
            ${statusBadge}
        </div>
        <div class="course-body">
            <h3 class="course-title" onclick="showCourseDetails('${course._id}')">${course.title || course.courseName}</h3>
            <p class="course-description">${course.description || 'No description available'}</p>
            ${progressBar}
            <div class="course-meta">
                <span class="course-duration"><i class="bi bi-clock"></i> ${course.duration || 'N/A'}</span>
                <span class="course-level"><i class="bi bi-award"></i> ${course.level || 'All Levels'}</span>
            </div>
            ${buttonHTML}
        </div>
    `;
    
    return card;
}

// Enroll in course
async function enrollInCourse(courseId, event) {
    if (event) event.stopPropagation();
    
    if (!currentUser || !currentUser.userId) {
        alert('Please log in to enroll in courses');
        return;
    }
    
    const course = allCourses.find(c => c._id === courseId);
    if (!course) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser.userId,
                courseId: courseId,
                courseName: course.title || course.courseName
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to enroll');
        }
        
        const newEnrollment = await response.json();
        userEnrollments.push(newEnrollment);
        
        // Show success message
        showSuccess(`Successfully enrolled in ${course.title || course.courseName}!`);
        
        // Refresh display
        displayCourses(currentFilter);
    } catch (error) {
        console.error('Enrollment error:', error);
        showError(error.message || 'Failed to enroll in course');
    }
}

// Continue learning (navigate to course content)
function continueLearning(courseId, event) {
    if (event) event.stopPropagation();
    
    const course = allCourses.find(c => c._id === courseId);
    if (!course) return;
    
    // For now, show course details
    // In a full implementation, this would navigate to the course content page
    showCourseDetails(courseId);
}

// Show course details modal
function showCourseDetails(courseId) {
    const course = allCourses.find(c => c._id === courseId);
    if (!course) return;
    
    const enrollment = userEnrollments.find(e => e.courseId === courseId);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'course-modal';
    modal.id = 'courseModal';
    
    let enrollmentInfo = '';
    if (enrollment) {
        enrollmentInfo = `
            <div class="enrollment-info">
                <h4>Enrollment Information</h4>
                <p><strong>Status:</strong> ${enrollment.status}</p>
                <p><strong>Progress:</strong> ${enrollment.progress}%</p>
                <p><strong>Enrolled:</strong> ${new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                ${enrollment.completionDate ? `<p><strong>Completed:</strong> ${new Date(enrollment.completionDate).toLocaleDateString()}</p>` : ''}
            </div>
        `;
    }
    
    const imagePath = course.image || course.imageUrl || '/assets/img/logo.png';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('courseModal')"></div>
        <div class="modal-content course-details-modal">
            <button class="modal-close" onclick="closeModal('courseModal')">
                <i class="bi bi-x"></i>
            </button>
            <div class="modal-header">
                <img src="${imagePath}" alt="${course.title || course.courseName}" class="course-detail-image" onerror="this.src='/assets/img/logo.png'">
                <h2>${course.title || course.courseName}</h2>
            </div>
            <div class="modal-body">
                <div class="course-detail-section">
                    <h3>Description</h3>
                    <p>${course.description || 'No description available'}</p>
                </div>
                
                <div class="course-detail-section">
                    <h3>Course Information</h3>
                    <div class="course-info-grid">
                        <div class="info-item">
                            <i class="bi bi-clock"></i>
                            <span><strong>Duration:</strong> ${course.duration || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <i class="bi bi-award"></i>
                            <span><strong>Level:</strong> ${course.level || 'All Levels'}</span>
                        </div>
                        <div class="info-item">
                            <i class="bi bi-tag"></i>
                            <span><strong>Category:</strong> ${course.category || 'General'}</span>
                        </div>
                    </div>
                </div>
                
                ${enrollmentInfo}
                
                <div class="modal-actions">
                    ${enrollment ? 
                        (enrollment.status === 'completed' ? 
                            '<button class="btn-primary" disabled><i class="bi bi-check-circle"></i> Completed</button>' :
                            `<button class="btn-primary" onclick="continueLearning('${courseId}', event)"><i class="bi bi-play-circle"></i> Continue Learning</button>`
                        ) :
                        `<button class="btn-primary" onclick="enrollInCourse('${courseId}', event); closeModal('courseModal')"><i class="bi bi-plus-circle"></i> Enroll Now</button>`
                    }
                    <button class="btn-secondary" onclick="closeModal('courseModal')">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Filter courses
function filterCourses(filter, buttonElement) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    // Display filtered courses
    displayCourses(filter);
}

// Show success message
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `<i class="bi bi-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show error message
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
