/* ============================================
   ADMIN DASHBOARD - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard JS loaded');
    initializeSidebar();
    initializeProfileDropdown();
    initializeMenuItems();
    setActiveMenuItemByPage();
    initializeModals();
    initializeHamburgerMenu();
    initializeDarkMode();
    initializeQuickActions();
    
    // Load profile picture with a slight delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Loading admin profile picture...');
        loadAdminProfilePicture();
    }, 100);
    
    // Listen for profile picture updates from settings page
    window.addEventListener('profilePictureUpdated', function(e) {
        console.log('Profile picture updated event received');
        if (e.detail && e.detail.imageUrl) {
            updateAllAvatarsWithImage(e.detail.imageUrl);
        }
    });
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
    
    if (!profileBtn) {
        console.warn('User profile dropdown element not found');
        return;
    }
    
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-profile')) {
            const allProfiles = document.querySelectorAll('.user-profile');
            allProfiles.forEach(profile => {
                profile.classList.remove('active');
            });
        }
    });
    
    // Handle menu items
    const menuItems = document.querySelectorAll('.user-dropdown a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === 'settings.html') {
                const allProfiles = document.querySelectorAll('.user-profile');
                allProfiles.forEach(profile => {
                    profile.classList.remove('active');
                });
            }
        });
    });
    
    console.log('Admin profile dropdown initialized successfully');
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
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // Save preference
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update button
    const btn = document.getElementById('darkModeBtn');
    if (btn) {
        btn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
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
    
    // Only load dashboard-specific data if we're on the dashboard page
    const isDashboardPage = document.getElementById('traineesGrid') || document.getElementById('coursesGrid');
    
    if (isDashboardPage) {
        setTimeout(() => {
            loadDashboardStats();
            loadTrainees();
            loadCourses();
        }, 500);
    }
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
    
    // Check if trainee has a profile picture
    const hasProfilePicture = trainee.profilePicture && trainee.profilePicture.trim() !== '';
    const avatarContent = hasProfilePicture 
        ? `<img src="${trainee.profilePicture}" alt="${trainee.firstName} ${trainee.lastName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
        : `<span>${initials}</span>`;
    
    card.innerHTML = `
        <div class="trainee-header">
            <div class="trainee-avatar">
                ${avatarContent}
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

// View trainee details from dashboard
function viewTraineeDetails(traineeId) {
    console.log('Viewing trainee:', traineeId);
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`)
        .then(res => res.json())
        .then(trainee => {
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
            showNotification('Failed to load trainee details', 'error');
        });
}

// Edit trainee from dashboard
function editTraineeDetails(traineeId) {
    console.log('Editing trainee:', traineeId);
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`)
        .then(res => res.json())
        .then(trainee => {
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
                showNotification('Trainee updated successfully', 'success');
                loadTrainees();
                loadDashboardStats();
            } else {
                showNotification('Failed to update trainee', 'error');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showNotification('Error updating trainee: ' + err.message, 'error');
        });
}

// Delete trainee from dashboard
function deleteTraineeDetails(traineeId) {
    if (!confirm('Are you sure you want to delete this trainee? This action cannot be undone.')) return;
    
    fetch(`${API_BASE_URL}/trainees/${traineeId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            showNotification('Trainee deleted successfully', 'success');
            loadTrainees();
            loadDashboardStats();
        } else {
            showNotification('Failed to delete trainee', 'error');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showNotification('Error deleting trainee: ' + err.message, 'error');
    });
}

// View application form for trainee from dashboard
function viewApplicationFormFromDashboard(traineeId) {
    console.log('Viewing application form for trainee:', traineeId);
    // Redirect to records page with trainee ID to view application
    window.location.href = `records.html?traineeId=${traineeId}&view=application`;
}

// View admission slip for trainee from dashboard
function viewAdmissionSlipFromDashboard(traineeId) {
    console.log('Viewing admission slip for trainee:', traineeId);
    // Redirect to records page with trainee ID to view admission slip
    window.location.href = `records.html?traineeId=${traineeId}&view=admission`;
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
        
        // Clean up old profilePicture from session if it exists (prevents 431 errors)
        if (userSession.profilePicture) {
            delete userSession.profilePicture;
            if (localStorage.getItem('userSession')) {
                localStorage.setItem('userSession', JSON.stringify(userSession));
            }
            if (sessionStorage.getItem('userSession')) {
                sessionStorage.setItem('userSession', JSON.stringify(userSession));
            }
        }
        
        // Update user name from session
        if (userSession.firstName && userSession.lastName) {
            const userName = `${userSession.firstName} ${userSession.lastName}`;
            const firstName = userSession.firstName.toUpperCase();
            
            // Update header user name (first name only)
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = firstName;
            });
            
            // Update dropdown header name (full name)
            const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
            if (dropdownUserInfo) {
                dropdownUserInfo.textContent = userName.toUpperCase();
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
        
        // Check for cached profile picture
        if (userSession.accountId || userSession.userId) {
            const userId = userSession.accountId || userSession.userId;
            const cachedPictureKey = `adminProfilePic_${userId}`;
            const cachedPicture = sessionStorage.getItem(cachedPictureKey);
            
            // If we have a cached picture, use it
            if (cachedPicture && cachedPicture.startsWith('data:')) {
                updateAllAvatarsWithImage(cachedPicture);
            }
        }
        
    } catch (error) {
        console.error('Error loading admin profile picture:', error);
    }
}

// Manual refresh function for debugging
window.refreshAvatar = function() {
    console.log('=== MANUAL AVATAR REFRESH ===');
    const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || '{}');
    if (userSession.accountId) {
        const cachedPictureKey = `adminProfilePic_${userSession.accountId}`;
        const cacheTimestampKey = `${cachedPictureKey}_timestamp`;
        
        // Clear cache to force API fetch
        sessionStorage.removeItem(cachedPictureKey);
        sessionStorage.removeItem(cacheTimestampKey);
        console.log('✓ Cache cleared');
        
        // Reload avatar
        loadAdminProfilePicture();
    } else {
        console.error('✗ No accountId in session');
    }
};

// Update all avatar elements with profile picture
function updateAllAvatars(imageUrl) {
    // Skip if no image URL provided
    if (!imageUrl) return;
    
    // Update header avatars
    document.querySelectorAll('.user-avatar, .dropdown-avatar').forEach(avatar => {
        avatar.style.backgroundImage = `url("${imageUrl}")`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.textContent = '';
    });
    
    // Update large profile avatar if exists
    const profileAvatarLarge = document.querySelector('.profile-avatar-large');
    if (profileAvatarLarge) {
        profileAvatarLarge.style.backgroundImage = `url("${imageUrl}")`;
        profileAvatarLarge.style.backgroundSize = 'cover';
        profileAvatarLarge.style.backgroundPosition = 'center';
        profileAvatarLarge.textContent = '';
    }
}

// Update all avatars with image (for profile picture changes)
function updateAllAvatarsWithImage(imageUrl) {
    if (!imageUrl) {
        console.log('updateAllAvatarsWithImage: No image URL provided');
        return;
    }
    
    console.log('updateAllAvatarsWithImage: Updating avatars with image:', imageUrl.substring(0, 50) + '...');
    
    // Remove any inline background styles that might interfere
    document.querySelectorAll('.user-avatar, .dropdown-avatar').forEach(avatar => {
        avatar.style.background = 'none';
        avatar.style.backgroundImage = 'none';
        
        if (imageUrl.startsWith('data:')) {
            console.log('updateAllAvatarsWithImage: Using img tag for base64 image');
            avatar.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Profile">`;
        } else {
            console.log('updateAllAvatarsWithImage: Using background-image for URL');
            avatar.style.backgroundImage = `url("${imageUrl}")`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.textContent = '';
        }
    });
    
    // Update large profile avatar if exists
    const profileAvatarLarge = document.querySelector('.profile-avatar-large');
    if (profileAvatarLarge) {
        profileAvatarLarge.style.background = 'none';
        profileAvatarLarge.style.backgroundImage = 'none';
        
        if (imageUrl.startsWith('data:')) {
            profileAvatarLarge.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Profile">`;
        } else {
            profileAvatarLarge.style.backgroundImage = `url("${imageUrl}")`;
            profileAvatarLarge.style.backgroundSize = 'cover';
            profileAvatarLarge.style.backgroundPosition = 'center';
            profileAvatarLarge.textContent = '';
        }
    }
    
    console.log('updateAllAvatarsWithImage: Avatar update complete');
}


// ===== MODAL FUNCTIONS FOR TRAINEE MANAGEMENT =====

// Create modal HTML
function createTraineeModal() {
    if (document.getElementById('traineeModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'traineeModal';
    modal.innerHTML = `
        <div class="trainee-modal-overlay">
            <div class="trainee-modal-content">
                <div class="trainee-modal-header">
                    <h2 id="modalTitle">Trainee Details</h2>
                    <button class="trainee-modal-close" onclick="closeTraineeModal()">&times;</button>
                </div>
                <div class="trainee-modal-body" id="modalBody">
                    <!-- Content will be inserted here -->
                </div>
                <div class="trainee-modal-footer" id="modalFooter">
                    <!-- Buttons will be inserted here -->
                </div>
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
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        }
        
        .trainee-modal-overlay.active {
            display: flex;
        }
        
        .trainee-modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 900px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .trainee-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(135deg, #E67E22 0%, #F4C430 100%);
            color: white;
            border-radius: 12px 12px 0 0;
        }
        
        .trainee-modal-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .trainee-modal-close {
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: white;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .trainee-modal-close:hover {
            transform: rotate(90deg);
        }
        
        .trainee-modal-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
        }
        
        .trainee-modal-footer {
            display: flex;
            gap: 12px;
            padding: 24px;
            border-top: 1px solid #eee;
            justify-content: flex-end;
            background: #f9f9f9;
            border-radius: 0 0 12px 12px;
        }
        
        .modal-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .modal-btn-primary {
            background: #3498db;
            color: white;
        }
        
        .modal-btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }
        
        .modal-btn-secondary {
            background: #95a5a6;
            color: white;
        }
        
        .modal-btn-secondary:hover {
            background: #7f8c8d;
        }
        
        .modal-btn-danger {
            background: #e74c3c;
            color: white;
        }
        
        .modal-btn-danger:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }
        
        .trainee-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .detail-field {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-size: 12px;
            font-weight: 600;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-size: 16px;
            color: #2c3e50;
            font-weight: 500;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-group label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
            box-sizing: border-box;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #E67E22;
            box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
        }
    `;
        document.head.appendChild(style);
    }
}

// View trainee details with modal
function viewTraineeDetailsModal(traineeId) {
    console.log('Viewing trainee:', traineeId);
    
    createTraineeModal();
    
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

// Edit trainee details with modal
function editTraineeDetailsModal(traineeId) {
    console.log('Editing trainee:', traineeId);
    
    createTraineeModal();
    
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
                <button class="modal-btn modal-btn-primary" onclick="saveDashboardTraineeEdit('${traineeId}')">
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

// Save trainee edit from dashboard
function saveDashboardTraineeEdit(traineeId) {
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
    createTraineeModal();
    
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
                <div style="text-align: center; padding: 40px 20px;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 64px; color: #e74c3c; display: block; margin-bottom: 20px;"></i>
                    <h3 style="margin: 0 0 16px 0; color: #2c3e50;">Are you sure?</h3>
                    <p style="color: #7f8c8d; margin: 0 0 8px 0; font-size: 16px;">You are about to delete:</p>
                    <p style="color: #2c3e50; font-weight: 600; font-size: 18px; margin: 0 0 24px 0;">
                        ${trainee.firstName} ${trainee.lastName}
                    </p>
                    <p style="color: #e74c3c; font-size: 14px; margin: 0;">
                        This action cannot be undone.
                    </p>
                </div>
            `;
            
            modalFooter.innerHTML = `
                <button class="modal-btn modal-btn-secondary" onclick="closeTraineeModal()">
                    <i class="bi bi-x-circle"></i> Cancel
                </button>
                <button class="modal-btn modal-btn-danger" onclick="confirmDashboardDeleteTrainee('${traineeId}')">
                    <i class="bi bi-trash"></i> Delete Permanently
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

// Confirm delete trainee from dashboard
function confirmDashboardDeleteTrainee(traineeId) {
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
