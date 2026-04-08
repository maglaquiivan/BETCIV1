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

// Create course card element matching admin dashboard style
function createCourseCard(course, enrollment) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.cssText = 'background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.3s ease; cursor: pointer;';
    
    // Get course image path
    const imagePath = course.image || course.imageUrl || '../assets/img/logo.png';
    
    // Determine enrollment status
    let enrollButton = '';
    if (enrollment) {
        if (enrollment.status === 'completed') {
            enrollButton = `
                <button style="flex: 1; padding: 12px; background: #28a745; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: not-allowed; opacity: 0.7;" disabled>
                    <i class="bi bi-check-circle"></i> Completed
                </button>
            `;
        } else {
            enrollButton = `
                <button onclick="continueLearning('${course._id}', event)" style="flex: 1; padding: 12px; background: #E67E22; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    <i class="bi bi-play-circle"></i> Continue
                </button>
            `;
        }
    } else {
        enrollButton = `
            <button onclick="enrollInCourse('${course._id}', event)" style="flex: 1; padding: 12px; background: #e74c3c; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                <i class="bi bi-plus-circle"></i> Enroll
            </button>
        `;
    }
    
    card.innerHTML = `
        <div style="width: 100%; height: 200px; overflow: hidden; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
            <img src="${imagePath}" alt="${course.title || course.courseName}" 
                 style="width: 100%; height: 100%; object-fit: cover; object-position: center;" 
                 onerror="this.src='../assets/img/logo.png'">
        </div>
        <div style="padding: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #333; margin: 0 0 12px 0; cursor: pointer;" 
                onclick="showCourseDetails('${course._id}')">
                ${course.title || course.courseName}
            </h3>
            <p style="font-size: 14px; color: #666; margin: 0 0 16px 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${course.description || 'No description available'}
            </p>
            <div style="display: flex; gap: 10px; margin-top: 16px;">
                <button onclick="showCourseDetails('${course._id}')" style="flex: 1; padding: 12px; background: white; color: #E67E22; border: 2px solid #E67E22; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    <i class="bi bi-eye"></i> View
                </button>
                ${enrollButton}
            </div>
        </div>
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
        this.style.boxShadow = '0 8px 24px rgba(230, 126, 34, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    return card;
}

// Enroll in course - Show enrollment form
// When a trainee enrolls, this function:
// 1. Shows an enrollment form to collect additional information
// 2. Creates an enrollment record in the Enrollments collection
// 3. Creates a record in the Records collection (visible in admin dashboard)
// 4. Automatically creates/updates a trainee record in the Trainees collection
function enrollInCourse(courseId, event) {
    if (event) event.stopPropagation();
    
    if (!currentUser || !currentUser.userId) {
        alert('Please log in to enroll in courses');
        return;
    }
    
    const course = allCourses.find(c => c._id === courseId);
    if (!course) return;
    
    // Show enrollment form modal
    showEnrollmentForm(course);
}

// Show enrollment form modal
function showEnrollmentForm(course) {
    const modal = document.createElement('div');
    modal.className = 'course-modal enrollment-form-modal';
    modal.id = 'enrollmentFormModal';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal('enrollmentFormModal')"></div>
        <div class="modal-content enrollment-form-wide">
            <button class="modal-close" onclick="closeModal('enrollmentFormModal')">
                <i class="bi bi-x"></i>
            </button>
            <div class="modal-header">
                <h2>Enrollment Form</h2>
                <p style="color: #666; font-size: 14px; margin-top: 8px;">Complete this form to enroll in ${course.title || course.courseName}</p>
            </div>
            <div class="modal-body">
                <form id="enrollmentForm" onsubmit="submitEnrollmentForm(event, '${course._id}', '${course.title || course.courseName}')">
                    <div class="form-grid-two-columns">
                        <div class="form-group">
                            <label for="enrollFirstName">First Name <span style="color: red;">*</span></label>
                            <input type="text" id="enrollFirstName" class="form-control" required 
                                   value="${currentUser.firstName || ''}" placeholder="Enter your first name">
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollLastName">Last Name <span style="color: red;">*</span></label>
                            <input type="text" id="enrollLastName" class="form-control" required 
                                   value="${currentUser.lastName || ''}" placeholder="Enter your last name">
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollEmail">Email Address <span style="color: red;">*</span></label>
                            <input type="email" id="enrollEmail" class="form-control" required 
                                   value="${currentUser.email || ''}" placeholder="your.email@example.com">
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollPhone">Phone Number <span style="color: red;">*</span></label>
                            <input type="tel" id="enrollPhone" class="form-control" required 
                                   value="${currentUser.phone || ''}" placeholder="+63 XXX XXX XXXX">
                        </div>
                        
                        <div class="form-group form-group-full">
                            <label for="enrollAddress">Address <span style="color: red;">*</span></label>
                            <textarea id="enrollAddress" class="form-control" required rows="2" 
                                      placeholder="Enter your complete address">${currentUser.address || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollDateOfBirth">Date of Birth <span style="color: red;">*</span></label>
                            <input type="date" id="enrollDateOfBirth" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollGender">Gender <span style="color: red;">*</span></label>
                            <select id="enrollGender" class="form-control" required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollEducation">Highest Educational Attainment</label>
                            <select id="enrollEducation" class="form-control">
                                <option value="">Select Education Level</option>
                                <option value="Elementary">Elementary</option>
                                <option value="High School">High School</option>
                                <option value="Senior High School">Senior High School</option>
                                <option value="College">College</option>
                                <option value="Vocational">Vocational</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollEmergencyContact">Emergency Contact Name</label>
                            <input type="text" id="enrollEmergencyContact" class="form-control" 
                                   placeholder="Full name of emergency contact">
                        </div>
                        
                        <div class="form-group">
                            <label for="enrollEmergencyPhone">Emergency Contact Phone</label>
                            <input type="tel" id="enrollEmergencyPhone" class="form-control" 
                                   placeholder="+63 XXX XXX XXXX">
                        </div>
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 24px;">
                        <button type="submit" class="btn-primary" style="flex: 1;">
                            <i class="bi bi-check-circle"></i> Submit Enrollment
                        </button>
                        <button type="button" class="btn-secondary" onclick="closeModal('enrollmentFormModal')" style="flex: 1;">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Submit enrollment form
async function submitEnrollmentForm(event, courseId, courseName) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('enrollFirstName').value,
        lastName: document.getElementById('enrollLastName').value,
        email: document.getElementById('enrollEmail').value,
        phone: document.getElementById('enrollPhone').value,
        address: document.getElementById('enrollAddress').value,
        dateOfBirth: document.getElementById('enrollDateOfBirth').value,
        gender: document.getElementById('enrollGender').value,
        education: document.getElementById('enrollEducation').value,
        emergencyContact: {
            name: document.getElementById('enrollEmergencyContact').value,
            phone: document.getElementById('enrollEmergencyPhone').value
        }
    };
    
    try {
        // 1. Create enrollment record WITH enrollee data
        const enrollmentResponse = await fetch(`${API_BASE_URL}/enrollments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.userId,
                courseId: courseId,
                courseName: courseName,
                enrolleeData: formData  // Send complete form data to Enrollments collection
            })
        });
        
        if (!enrollmentResponse.ok) {
            const error = await enrollmentResponse.json();
            throw new Error(error.message || 'Failed to create enrollment');
        }
        
        const newEnrollment = await enrollmentResponse.json();
        userEnrollments.push(newEnrollment);
        
        // 2. Create record for admin dashboard (enrollee record)
        const recordResponse = await fetch(`${API_BASE_URL}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.userId,
                courseId: courseId,
                courseName: courseName,
                status: 'In Progress',
                progress: 0,
                startDate: new Date(),
                enrolleeData: formData
            })
        });
        
        if (!recordResponse.ok) {
            console.warn('Failed to create record, but enrollment succeeded');
        }
        
        // Close modal
        closeModal('enrollmentFormModal');
        
        // Show success message
        showSuccess(`Successfully enrolled in ${courseName}!`);
        
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
