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
        
        console.log('Loaded courses from database:', allCourses);
        console.log('Course images:', allCourses.map(c => ({ title: c.title, image: c.image })));
        
        // Fetch user enrollments and records if logged in
        if (currentUser && (currentUser.userId || currentUser.accountId || currentUser._id)) {
            const userId = currentUser.userId || currentUser.accountId || currentUser._id;
            
            try {
                // Fetch enrollments
                const enrollmentsResponse = await fetch(`${API_BASE_URL}/enrollments/user/${userId}`);
                if (enrollmentsResponse.ok) {
                    userEnrollments = await enrollmentsResponse.json();
                }
            } catch (e) {
                console.log('No enrollments found or error fetching enrollments:', e);
            }
            
            try {
                // Also fetch training records to check enrollment status
                const recordsResponse = await fetch(`${API_BASE_URL}/records/user/${userId}`);
                if (recordsResponse.ok) {
                    const userRecords = await recordsResponse.json();
                    console.log('User training records:', userRecords);
                    
                    // Add records to enrollments list if not already there
                    userRecords.forEach(record => {
                        const existingEnrollment = userEnrollments.find(e => e.courseId === record.courseId);
                        if (!existingEnrollment) {
                            // Convert record to enrollment format
                            userEnrollments.push({
                                courseId: record.courseId,
                                userId: record.userId,
                                status: record.status === 'Completed' ? 'completed' : 'active',
                                progress: record.progress || 0,
                                enrollmentDate: record.startDate,
                                completionDate: record.completionDate
                            });
                        }
                    });
                }
            } catch (e) {
                console.log('No records found or error fetching records:', e);
            }
        }
        
        console.log('Final user enrollments:', userEnrollments);
        
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

// Create course card element matching admin dashboard style
function createCourseCard(course, enrollment) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.cssText = 'background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer; border: 2px solid transparent;';
    
    // Get course image - use the image field directly from database
    let imagePath = course.image || '../../assets/img/logo.png';
    
    // Handle different image path formats
    if (imagePath.startsWith('data:image/')) {
        // Base64 image - use as is
        // Do nothing, imagePath is already correct
    } else if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // Full URL - use as is
        // Do nothing, imagePath is already correct
    } else if (imagePath.startsWith('/assets/')) {
        // Absolute path from root - convert to relative for trainee pages
        imagePath = '../..' + imagePath;
    } else if (imagePath.startsWith('../assets/')) {
        // Relative path from admin - convert to trainee path
        imagePath = '../../assets/' + imagePath.substring(10);
    } else if (imagePath.startsWith('../../assets/')) {
        // Already correct for trainee pages
        // Do nothing
    } else {
        // Unknown format - use default
        imagePath = '../../assets/img/logo.png';
    }
    
    // Determine enrollment status and button
    let enrollButton = '';
    if (enrollment) {
        // Already enrolled - show "Enrolled" button (disabled)
        enrollButton = `
            <button style="flex: 1; padding: 14px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: not-allowed; opacity: 0.9; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;" disabled>
                <i class="bi bi-check-circle-fill"></i> Enrolled
            </button>
        `;
    } else {
        // Not enrolled - show "Enroll" button
        enrollButton = `
            <button onclick="enrollInCourse('${course._id}', event)" style="flex: 1; padding: 14px; background: #E67E22; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="bi bi-plus-circle-fill"></i> Enroll
            </button>
        `;
    }
    
    card.innerHTML = `
        <div style="width: 100%; height: 220px; overflow: hidden; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); display: flex; align-items: center; justify-content: center; position: relative;">
            <img src="${imagePath}" alt="${course.title || course.courseName}" 
                 style="width: 100%; height: 100%; object-fit: cover; object-position: center;" 
                 onerror="this.onerror=null; this.src='../../assets/img/logo.png';">
            ${enrollment ? `
                <div style="position: absolute; top: 12px; right: 12px; background: rgba(16, 185, 129, 0.95); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; backdrop-filter: blur(10px);">
                    <i class="bi bi-check-circle-fill"></i> Enrolled
                </div>
            ` : ''}
        </div>
        <div style="padding: 24px;">
            <h3 style="font-size: 19px; font-weight: 700; color: #2c3e50; margin: 0 0 12px 0; cursor: pointer; line-height: 1.3;" 
                onclick="showCourseDetails('${course._id}')">
                ${course.title || course.courseName}
            </h3>
            <p style="font-size: 14px; color: #64748b; margin: 0 0 20px 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 42px;">
                ${course.description || 'No description available'}
            </p>
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button onclick="showCourseDetails('${course._id}')" style="flex: 1; padding: 14px; background: white; color: #E67E22; border: 2px solid #E67E22; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="bi bi-eye-fill"></i> View
                </button>
                ${enrollButton}
            </div>
        </div>
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 12px 32px rgba(230, 126, 34, 0.25)';
        this.style.borderColor = '#E67E22';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        this.style.borderColor = 'transparent';
    });
    
    return card;
}

// Enroll in course - Redirect to Assessment Center
// When a trainee clicks enroll, they will be redirected to:
// Assessment Center page where they can fill out the Application Form
function enrollInCourse(courseId, event) {
    if (event) event.stopPropagation();
    
    if (!currentUser || !(currentUser.userId || currentUser.accountId || currentUser._id)) {
        alert('Please log in to enroll in courses');
        window.location.href = '../../auth/login.html';
        return;
    }
    
    const course = allCourses.find(c => c._id === courseId);
    if (!course) return;
    
    // Store course information in sessionStorage for the application form
    sessionStorage.setItem('enrollmentCourse', JSON.stringify({
        courseId: course._id,
        courseName: course.title || course.courseName,
        courseDescription: course.description
    }));
    
    // Redirect to Assessment Center (which will show Application Form tab)
    window.location.href = 'assessment.html';
}

// Note: The enrollment form modal functions below are deprecated
// Enrollment now redirects to application-form.html and admission-slip.html
// Keeping these functions commented for reference

/*
// Show enrollment form modal
function showEnrollmentForm(course) {
    // ... old modal code ...
}

// Submit enrollment form
async function submitEnrollmentForm(event, courseId, courseName) {
    // ... old submission code ...
}
*/

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
    
    // Get course image - use the image field directly from database
    let imagePath = course.image || '../../assets/img/logo.png';
    
    // Handle different image path formats
    if (imagePath.startsWith('data:image/')) {
        // Base64 image - use as is
        // Do nothing, imagePath is already correct
    } else if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // Full URL - use as is
        // Do nothing, imagePath is already correct
    } else if (imagePath.startsWith('/assets/')) {
        // Absolute path from root - convert to relative for trainee pages
        imagePath = '../..' + imagePath;
    } else if (imagePath.startsWith('../assets/')) {
        // Relative path from admin - convert to trainee path
        imagePath = '../../assets/' + imagePath.substring(10);
    } else if (imagePath.startsWith('../../assets/')) {
        // Already correct for trainee pages
        // Do nothing
    } else {
        // Unknown format - use default
        imagePath = '../../assets/img/logo.png';
    }
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('courseModal')"></div>
        <div class="modal-content course-details-modal">
            <button class="modal-close" onclick="closeModal('courseModal')">
                <i class="bi bi-x"></i>
            </button>
            <div class="modal-header">
                <img src="${imagePath}" alt="${course.title || course.courseName}" class="course-detail-image" onerror="this.onerror=null; this.src='../../assets/img/logo.png';">
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
                        '<button class="btn-primary" disabled style="opacity: 0.9; cursor: not-allowed;"><i class="bi bi-check-circle-fill"></i> Enrolled</button>' :
                        `<button class="btn-primary" onclick="enrollInCourse('${courseId}', event); closeModal('courseModal')"><i class="bi bi-plus-circle-fill"></i> Enroll Now</button>`
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
