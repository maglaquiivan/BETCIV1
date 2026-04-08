/* ============================================
   ADMIN DASHBOARD - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeProfileDropdown();
    initializeMenuItems();
    setActiveMenuItemByPage();
    initializeModals();
    initializeHamburgerMenu();
    initializeDarkMode();
    initializeQuickActions();
    loadAdminProfilePicture();
});

/* ============================================
   SIDEBAR & MENU
   ============================================ */

function initializeHamburgerMenu() {
    // Hamburger menu is now handled by burger-menu.js
    // This function is kept for backward compatibility but does nothing
    console.log('Hamburger menu initialized by burger-menu.js');
}

function initializeSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const submenu = this.nextElementSibling;
            
            if (submenu && submenu.classList.contains('sidebar-submenu')) {
                e.preventDefault();
                toggleSubmenu(submenu, this);
            } else {
                handleMenuClick(this);
            }
        });
    });
}

function toggleSubmenu(submenu, menuItem) {
    const isActive = submenu.classList.contains('active');
    
    // Close all other submenus
    document.querySelectorAll('.sidebar-submenu.active').forEach(menu => {
        if (menu !== submenu) {
            menu.classList.remove('active');
            const parentItem = menu.previousElementSibling;
            if (parentItem) {
                parentItem.classList.remove('active');
                const icon = parentItem.querySelector('.dropdown-icon');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        }
    });
    
    // Toggle current submenu
    submenu.classList.toggle('active');
    
    // Update parent menu item active state
    if (submenu.classList.contains('active')) {
        menuItem.classList.add('active');
        const icon = menuItem.querySelector('.dropdown-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
        menuItem.classList.remove('active');
        const icon = menuItem.querySelector('.dropdown-icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
    }
}

function handleMenuClick(item) {
    // Remove active from all menu items
    document.querySelectorAll('.sidebar-menu-item').forEach(el => {
        el.classList.remove('active');
        const icon = el.querySelector('.dropdown-icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
    });
    
    // Close all submenus
    document.querySelectorAll('.sidebar-submenu').forEach(menu => {
        menu.classList.remove('active');
    });
    
    // Add active to clicked item
    item.classList.add('active');
    
    // Get section ID from data attribute
    const sectionId = item.getAttribute('data-section');
    if (sectionId) {
        showSection(sectionId);
    }
}

function initializeMenuItems() {
    const submenuItems = document.querySelectorAll('.sidebar-submenu-item');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all submenu items
            document.querySelectorAll('.sidebar-submenu-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active to clicked item
            this.classList.add('active');
            
            // Update parent menu item to active
            const submenu = this.closest('.sidebar-submenu');
            if (submenu) {
                const parentItem = submenu.previousElementSibling;
                if (parentItem) {
                    document.querySelectorAll('.sidebar-menu-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    parentItem.classList.add('active');
                    const icon = parentItem.querySelector('.dropdown-icon');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            }
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });
}

/* ============================================
   SECTION MANAGEMENT
   ============================================ */

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        updateBreadcrumb(sectionId);
    }
}

function updateBreadcrumb(sectionId) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const section = document.getElementById(sectionId);
    const title = section ? section.getAttribute('data-title') : 'Dashboard';
    
    breadcrumb.innerHTML = `
        <a href="#" class="breadcrumb-item" onclick="showSection('dashboard')">Dashboard</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">${title}</span>
    `;
}

/* ============================================
   PROFILE DROPDOWN
   ============================================ */

function initializeProfileDropdown() {
    const profileBtn = document.querySelector('.user-profile');
    const profileMenu = document.querySelector('.user-dropdown');
    
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.user-profile')) {
                profileMenu.classList.remove('active');
            }
        });
        
        // Handle menu items
        const menuItems = profileMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === 'settings.html') {
                    profileMenu.classList.remove('active');
                }
            });
        });
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any session data
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        // Redirect to admin login page
        window.location.href = '../login.html';
    }
}

/* ============================================
   FORM HANDLING
   ============================================ */

function handleFormSubmit(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Call callback
        if (callback) {
            callback(data);
        }
        
        // Show success message
        showNotification('Changes saved successfully!', 'success');
        
        // Reset form
        this.reset();
    });
}

/* ============================================
   NOTIFICATIONS
   ============================================ */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="icon"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.innerHTML = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-warning {
                border-left: 4px solid #f59e0b;
            }
            
            .notification-info {
                border-left: 4px solid #0ea5e9;
            }
            
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
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/* ============================================
   MODAL MANAGEMENT
   ============================================ */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        
        // Close when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

/* ============================================
   TABLE UTILITIES
   ============================================ */

function deleteRow(button) {
    if (confirm('Are you sure you want to delete this item?')) {
        const row = button.closest('tr');
        row.remove();
        showNotification('Item deleted successfully!', 'success');
    }
}

function editRow(button) {
    const row = button.closest('tr');
    const data = {
        id: row.cells[0].textContent,
        name: row.cells[1].textContent,
        email: row.cells[2].textContent,
        status: row.cells[3].textContent
    };
    
    // Populate form with data
    document.getElementById('editId').value = data.id;
    document.getElementById('editName').value = data.name;
    document.getElementById('editEmail').value = data.email;
    
    openModal('editModal');
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(time) {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize modals on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeModals();
});


/* ============================================
   COURSE FILTERING
   ============================================ */

function filterCourses(status) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter courses
    const courses = document.querySelectorAll('.course-card');
    courses.forEach(course => {
        if (status === 'all') {
            course.style.display = 'flex';
        } else {
            const courseStatus = course.getAttribute('data-status');
            if (courseStatus === status) {
                course.style.display = 'flex';
            } else {
                course.style.display = 'none';
            }
        }
    });
}


/* ============================================
   SET ACTIVE MENU ITEM BY PAGE
   ============================================ */

function setActiveMenuItemByPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/* ============================================
   TRAINING CATALOG SUBMENU
   ============================================ */

function toggleTrainingCatalog(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const submenu = document.getElementById('trainingSubmenu');
    
    link.classList.toggle('active');
    submenu.classList.toggle('active');
}

function showCourses(event) {
    event.preventDefault();
    document.querySelectorAll('.nav-submenu-link').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-submenu-link').classList.add('active');
}

function showCompetencies(event) {
    event.preventDefault();
    document.querySelectorAll('.nav-submenu-link').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-submenu-link').classList.add('active');
}


/* ============================================
   QUICK ACTIONS
   ============================================ */

function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const actionCard = this.closest('.action-card');
            const actionTitle = actionCard.querySelector('h4').textContent;
            
            switch(index) {
                case 0: // Add Trainee
                    openModal('traineeModal');
                    document.getElementById('modalTitle').textContent = 'Add New Trainee';
                    document.getElementById('traineeName').value = '';
                    document.getElementById('traineeRole').value = '';
                    document.getElementById('traineeEmail').value = '';
                    document.getElementById('traineeEnrolled').value = '';
                    document.getElementById('traineeStatus').value = 'ACTIVE';
                    break;
                case 1: // View Reports
                    window.location.href = 'records.html';
                    break;
                case 2: // Manage Appointments
                    window.location.href = 'appointments.html';
                    break;
                case 3: // System Settings
                    window.location.href = 'settings.html';
                    break;
            }
        });
    });
}

/* ============================================
   DARK MODE
   ============================================ */

function initializeDarkMode() {
    // Dark mode is now handled by dark-mode.js
    // This function is kept for backward compatibility
}

function toggleDarkMode() {
    // Dark mode toggle is now handled by dark-mode.js
    // Call the dark-mode.js function
    if (typeof window.toggleDarkMode === 'function') {
        window.toggleDarkMode();
    }
}

/* ============================================
   TABS NAVIGATION
   ============================================ */

function switchTab(tabName, event) {
    if (event) {
        event.preventDefault();
    }
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked tab
    if (event && event.target) {
        event.target.closest('.tab-item').classList.add('active');
    }
}


/* ============================================
   MONGODB API INTEGRATION
   ============================================ */

const API_BASE_URL = 'http://localhost:5500/api';

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Starting to load dashboard data');
    setTimeout(() => {
        loadDashboardStats();
        loadTrainees();
        loadCourses();
    }, 500);
});

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Fetch courses
        const coursesResponse = await fetch(`${API_BASE_URL}/courses`);
        const courses = await coursesResponse.json();
        
        // Fetch trainees
        const traineesResponse = await fetch(`${API_BASE_URL}/trainees`);
        const trainees = await traineesResponse.json();
        
        // Calculate stats
        const activeCourses = courses.filter(c => c.status === 'active').length;
        const totalTrainees = trainees.length;
        
        // Update stats cards
        updateStatsCard(0, activeCourses, 'Active Courses');
        updateStatsCard(1, totalTrainees, 'Total Trainees');
        updateStatsCard(2, '48', 'Today\'s Enrollments');
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showNotification('Failed to load dashboard statistics', 'error');
    }
}

// Update individual stat card
function updateStatsCard(index, value, label) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const h3 = statCards[index].querySelector('h3');
        const p = statCards[index].querySelector('p');
        if (h3) h3.textContent = value;
        if (p) p.textContent = label;
    }
}

// Load trainees from MongoDB
async function loadTrainees() {
    try {
        console.log('loadTrainees: Starting fetch from', `${API_BASE_URL}/trainees`);
        const response = await fetch(`${API_BASE_URL}/trainees`);
        console.log('loadTrainees: Response status', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const trainees = await response.json();
        
        console.log('loadTrainees: Loaded', trainees.length, 'trainees');
        
        // Get trainees grid by ID
        const traineesGrid = document.getElementById('traineesGrid');
        console.log('loadTrainees: Grid element found?', !!traineesGrid);
        
        if (!traineesGrid) {
            console.error('Trainees grid not found');
            return;
        }
        
        // Clear existing content
        traineesGrid.innerHTML = '';
        
        if (trainees.length === 0) {
            traineesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;"><i class="bi bi-inbox" style="font-size: 48px; display: block; margin-bottom: 16px;"></i><p>No trainees found</p></div>';
            return;
        }
        
        // Display first 6 trainees
        trainees.slice(0, 6).forEach((trainee, index) => {
            console.log('Creating card for trainee', index, trainee.firstName);
            const traineeCard = createTraineeCard(trainee);
            traineesGrid.appendChild(traineeCard);
        });
        
        console.log('loadTrainees: Finished loading', trainees.slice(0, 6).length, 'cards');
        
    } catch (error) {
        console.error('Error loading trainees:', error);
        const traineesGrid = document.getElementById('traineesGrid');
        if (traineesGrid) {
            traineesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #e74c3c;"><p>Failed to load trainees: ' + error.message + '</p></div>';
        }
    }
}

// Create trainee card element
function createTraineeCard(trainee) {
    const card = document.createElement('div');
    card.className = 'trainee-card';
    
    const initials = `${trainee.firstName.charAt(0)}${trainee.lastName.charAt(0)}`.toUpperCase();
    const enrolledCourse = trainee.enrolledCourses && trainee.enrolledCourses.length > 0 
        ? trainee.enrolledCourses[0].courseName 
        : 'No course enrolled';
    const status = trainee.status || 'active';
    const enrollDate = trainee.enrolledCourses && trainee.enrolledCourses.length > 0 && trainee.enrolledCourses[0].enrollmentDate
        ? new Date(trainee.enrolledCourses[0].enrollmentDate).toLocaleDateString()
        : new Date(trainee.createdAt || Date.now()).toLocaleDateString();
    
    card.innerHTML = `
        <div class="trainee-header">
            <div class="trainee-avatar">
                <span>${initials}</span>
            </div>
            <div class="trainee-info">
                <h4>${trainee.firstName} ${trainee.lastName}</h4>
                <p>${enrolledCourse}</p>
            </div>
            <span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
        <div class="trainee-meta">
            <span class="meta-item"><i class="bi bi-envelope"></i> ${trainee.email}</span>
            <span class="meta-item"><i class="bi bi-calendar"></i> Enrolled: ${enrollDate}</span>
        </div>
        <div class="trainee-actions">
            <button class="btn-action edit" onclick="window.location.href='trainees.html'"><i class="bi bi-pencil"></i> Edit</button>
            <button class="btn-action delete" onclick="deleteTraineeFromDashboard('${trainee.traineeId}')"><i class="bi bi-trash"></i> Delete</button>
        </div>
    `;
    
    return card;
}

// Load courses from MongoDB
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const courses = await response.json();
        
        console.log('Dashboard loaded courses:', courses.length);
        
        // Get courses grid by ID
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) {
            console.error('Courses grid not found');
            return;
        }
        
        // Clear existing content
        coursesGrid.innerHTML = '';
        
        if (courses.length === 0) {
            coursesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;"><i class="bi bi-inbox" style="font-size: 48px; display: block; margin-bottom: 16px;"></i><p>No courses found</p></div>';
            return;
        }
        
        // Display first 6 courses
        courses.slice(0, 6).forEach(course => {
            const courseCard = createCourseCard(course);
            coursesGrid.appendChild(courseCard);
        });
        
    } catch (error) {
        console.error('Error loading courses:', error);
        const coursesGrid = document.getElementById('coursesGrid');
        if (coursesGrid) {
            coursesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #e74c3c;"><p>Failed to load courses</p></div>';
        }
    }
}

// Create course card element
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'trainee-card';
    
    const statusColors = {
        active: '#E67E22',
        completed: '#10b981',
        available: '#0ea5e9'
    };
    
    const iconColor = statusColors[course.status] || '#E67E22';
    
    card.innerHTML = `
        <div class="trainee-header">
            <div class="trainee-avatar" style="background: ${iconColor};">
                <i class="bi bi-book"></i>
            </div>
            <div class="trainee-info">
                <h4>${course.title}</h4>
                <p>${course.category || 'Heavy Equipment'}</p>
            </div>
            <span class="status-badge ${course.status}">${course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span>
        </div>
        <div class="trainee-meta">
            <span class="meta-item"><i class="bi bi-people"></i> ${course.traineeCount || 0} Trainees</span>
            <span class="meta-item"><i class="bi bi-clock"></i> ${course.duration || '3 months'}</span>
        </div>
        <div class="trainee-actions">
            <button class="btn-action edit" onclick="editCourse('${course.courseId}')"><i class="bi bi-pencil"></i> Edit</button>
            <button class="btn-action delete" onclick="deleteCourse('${course.courseId}')"><i class="bi bi-trash"></i> Delete</button>
        </div>
    `;
    
    return card;
}

// Edit trainee
async function editTrainee(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        const trainee = await response.json();
        
        // Populate edit form or redirect to edit page
        showNotification(`Edit trainee: ${trainee.firstName} ${trainee.lastName}`, 'info');
        // TODO: Implement edit form
        
    } catch (error) {
        console.error('Error fetching trainee:', error);
        showNotification('Failed to load trainee details', 'error');
    }
}

// Delete trainee
async function deleteTrainee(userId) {
    if (!confirm('Are you sure you want to delete this trainee?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Trainee deleted successfully', 'success');
            loadTrainees(); // Reload trainees list
            loadDashboardStats(); // Update stats
        } else {
            throw new Error('Failed to delete trainee');
        }
        
    } catch (error) {
        console.error('Error deleting trainee:', error);
        showNotification('Failed to delete trainee', 'error');
    }
}

// Delete trainee from dashboard (uses traineeId instead of userId)
async function deleteTraineeFromDashboard(traineeId) {
    if (!confirm('Are you sure you want to delete this trainee?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/trainees/${traineeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Trainee deleted successfully', 'success');
            loadTrainees(); // Reload trainees list
            loadDashboardStats(); // Update stats
        } else {
            throw new Error('Failed to delete trainee');
        }
        
    } catch (error) {
        console.error('Error deleting trainee:', error);
        showNotification('Failed to delete trainee', 'error');
    }
}

// Edit course
async function editCourse(courseId) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        const course = await response.json();
        
        // Populate edit form or redirect to edit page
        showNotification(`Edit course: ${course.title}`, 'info');
        // TODO: Implement edit form
        
    } catch (error) {
        console.error('Error fetching course:', error);
        showNotification('Failed to load course details', 'error');
    }
}

// Delete course
async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Course deleted successfully', 'success');
            loadCourses(); // Reload courses list
            loadDashboardStats(); // Update stats
        } else {
            throw new Error('Failed to delete course');
        }
        
    } catch (error) {
        console.error('Error deleting course:', error);
        showNotification('Failed to delete course', 'error');
    }
}


/* ============================================
   PROFILE PICTURE MANAGEMENT
   ============================================ */

// Load admin profile picture from session
function loadAdminProfilePicture() {
    try {
        const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || '{}');
        
        if (userSession.profilePicture) {
            updateAllAvatars(userSession.profilePicture);
        }
        
        // Also update user name if available
        if (userSession.firstName && userSession.lastName) {
            const userName = `${userSession.firstName} ${userSession.lastName}`;
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = userName;
            });
            
            // Update dropdown header name
            const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
            if (dropdownUserInfo) {
                dropdownUserInfo.textContent = userName;
            }
            
            // Update profile avatar info name
            const profileAvatarInfo = document.querySelector('.profile-avatar-info h3');
            if (profileAvatarInfo) {
                profileAvatarInfo.textContent = userName;
            }
        }
        
        // Update email if available
        if (userSession.email) {
            const dropdownEmail = document.querySelector('.dropdown-user-info p');
            if (dropdownEmail) {
                dropdownEmail.textContent = userSession.email;
            }
        }
        
    } catch (error) {
        console.error('Error loading admin profile picture:', error);
    }
}

// Update all avatar elements with profile picture
function updateAllAvatars(imageUrl) {
    // Update header avatars
    document.querySelectorAll('.user-avatar, .dropdown-avatar').forEach(avatar => {
        avatar.style.backgroundImage = `url(${imageUrl})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.textContent = '';
    });
    
    // Update large profile avatar if exists
    const profileAvatarLarge = document.querySelector('.profile-avatar-large');
    if (profileAvatarLarge) {
        profileAvatarLarge.style.backgroundImage = `url(${imageUrl})`;
        profileAvatarLarge.style.backgroundSize = 'cover';
        profileAvatarLarge.style.backgroundPosition = 'center';
        profileAvatarLarge.textContent = '';
    }
}
