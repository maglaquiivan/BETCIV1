// Simple Dashboard JavaScript that actually works

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded successfully!');
    
    // Initialize the dashboard
    initializeDashboard();
    setupEventListeners();
    loadAllCourses();
});

function initializeDashboard() {
    // Show dashboard section by default
    showSection('dashboard');
    
    // Animate progress bars with requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        animateProgressBars();
    });
}

function setupEventListeners() {
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section from data attribute
            const section = this.getAttribute('data-section');
            
            // Update active nav item
            setActiveNavItem(this);
            
            // Show the section
            showSection(section);
            
            // Show notification
            showNotification(`Switched to ${section.charAt(0).toUpperCase() + section.slice(1)}`, 'success');
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // User profile dropdown
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        const userProfile = document.getElementById('userProfile');
        
        // Close mobile sidebar
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleMobileSidebar();
        }
        
        // Close user dropdown
        if (userProfile && !userProfile.contains(e.target)) {
            closeUserDropdown();
        }
    });
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
}

function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top
        targetSection.scrollTop = 0;
        
        // Special handling for courses section
        if (sectionName === 'courses') {
            loadAllCourses();
        }
    } else {
        console.error('Section not found:', sectionName + '-section');
    }
}

function setActiveNavItem(clickedLink) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item's parent
    const parentNavItem = clickedLink.closest('.nav-item');
    if (parentNavItem) {
        parentNavItem.classList.add('active');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Save preference
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    
    // Add/remove body scroll lock
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function handleWindowResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth > 768) {
        // Desktop view - remove mobile classes
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Handle landscape orientation on mobile/tablet
    if (window.innerWidth <= 768 && window.innerHeight <= 600) {
        // Landscape mode - auto-collapse sidebar for more space
        if (!sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    } else if (window.innerWidth <= 768 && window.innerHeight > 600) {
        // Portrait mode - restore sidebar if it was auto-collapsed
        const userCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (!userCollapsed) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }
    
    // Close user dropdown on resize
    closeUserDropdown();
}

// Add orientation change listener
window.addEventListener('orientationchange', function() {
    // Delay to allow for orientation change to complete
    setTimeout(() => {
        handleWindowResize();
        
        // Recalculate dropdown position
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && userDropdown.parentElement.classList.contains('active')) {
            // Close and reopen to recalculate position
            closeUserDropdown();
            setTimeout(() => {
                // Don't auto-reopen, let user click again
            }, 100);
        }
    }, 100);
});

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            bar.style.width = targetWidth;
        });
    });
}

function loadAllCourses() {
    const coursesGrid = document.getElementById('all-courses-grid');
    if (!coursesGrid) return;
    
    const courses = [
        {
            title: "Forklift Operation NC II",
            description: "Master forklift operation, safety protocols, and material handling techniques.",
            image: "assets/img/fork.png",
            progress: 65,
            duration: "4 weeks",
            level: "Beginner",
            status: "active",
            badge: "NEW"
        },
        {
            title: "Bulldozer Operation NC II", 
            description: "Learn bulldozer operation, earthmoving techniques, and site preparation.",
            image: "assets/img/bulldozer.png",
            progress: 40,
            duration: "6 weeks", 
            level: "Intermediate",
            status: "active",
            badge: "IN PROGRESS"
        },
        {
            title: "Hydraulic Excavator NC II",
            description: "Advanced excavator operation, digging techniques, and hydraulic systems.",
            image: "assets/img/hydraulic excavator.png",
            progress: 85,
            duration: "8 weeks",
            level: "Advanced", 
            status: "active",
            badge: "LEVEL III"
        },
        {
            title: "Dump Truck Operation NC II",
            description: "Professional training for rigid on-highway dump truck operation.",
            image: "assets/img/dump truck.png",
            progress: 100,
            duration: "5 weeks",
            level: "Intermediate",
            status: "completed",
            badge: "COMPLETED"
        },
        {
            title: "Wheel Loader NC II",
            description: "Comprehensive wheel loader training and material handling techniques.",
            image: "assets/img/logo.png",
            progress: 0,
            duration: "6 weeks",
            level: "Intermediate",
            status: "available",
            badge: "AVAILABLE"
        },
        {
            title: "Backhoe Loader NC II",
            description: "Master backhoe loader operation, digging, and trenching techniques.",
            image: "assets/img/logo.png", 
            progress: 100,
            duration: "7 weeks",
            level: "Advanced",
            status: "completed",
            badge: "COMPLETED"
        }
    ];
    
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card" data-status="${course.status}">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjRDNDMwIiBvcGFjaXR5PSIwLjIiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI3MCIgeT0iNDUiPgo8cGF0aCBkPSJNMTUgMjVIMzVWMzVIMTVWMjVaIiBmaWxsPSIjRTY3RTIyIi8+CjxwYXRoIGQ9Ik0yMCAzMEgzMFY0MEgyMFYzMFoiIGZpbGw9IiNFNjdFMjIiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                <div class="course-badge ${course.status}">${course.badge}</div>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="progress-text">${course.progress}% Complete</span>
                </div>
                <div class="course-meta">
                    <span class="course-duration"><i class="bi bi-clock"></i> ${course.duration}</span>
                    <span class="course-level">${course.level}</span>
                </div>
                <button class="continue-btn ${course.status === 'available' ? 'enroll-btn' : course.status === 'completed' ? 'review-btn' : ''}" 
                        onclick="handleCourseAction('${course.status}', '${course.title}')">
                    ${course.status === 'available' ? 'Enroll Now' : course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Animate progress bars for new courses
    setTimeout(() => {
        animateProgressBars();
    }, 100);
}

function filterCourses(filter) {
    // Update active filter tab
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Find and activate the clicked tab
    const activeTab = Array.from(filterTabs).find(tab => 
        tab.textContent.toLowerCase().includes(filter) || 
        (filter === 'all' && tab.textContent === 'All Courses')
    );
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Filter course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const status = card.dataset.status;
        if (filter === 'all' || status === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    showNotification(`Showing ${filter === 'all' ? 'all' : filter} courses`, 'info');
}

function handleCourseAction(status, title) {
    switch(status) {
        case 'available':
            showNotification(`Enrolling in ${title}...`, 'info');
            break;
        case 'completed':
            showNotification(`Opening ${title} review...`, 'info');
            break;
        default:
            showNotification(`Continuing ${title}...`, 'info');
    }
}

function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const newTheme = darkModeToggle.checked ? 'dark' : 'light';
    changeTheme(newTheme);
}

function updateDarkModeToggle(theme) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = theme === 'dark';
    }
}

function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme icon in header
    updateThemeIcon(theme);
    
    // Update dark mode toggle in profile dropdown
    updateDarkModeToggle(theme);
    
    // Update active theme button in settings
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = Array.from(themeButtons).find(btn => 
        btn.textContent.toLowerCase() === theme
    );
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    showNotification(`Switched to ${theme} theme`, 'success');
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
        } else {
            themeIcon.className = 'bi bi-moon-fill';
        }
    }
}

function toggleUserDropdown() {
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userProfile && userDropdown) {
        userProfile.classList.toggle('active');
    }
}

function closeUserDropdown() {
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        userProfile.classList.remove('active');
    }
}

function downloadCertificates() {
    closeUserDropdown();
    showNotification('Downloading certificates...', 'success');
    
    // Simulate download
    setTimeout(() => {
        showNotification('Certificates downloaded successfully!', 'success');
    }, 2000);
}

function openApplicationForm() {
    // Close any open dropdowns
    closeUserDropdown();
    
    // Show loading notification
    showNotification('Opening application form...', 'info');
    
    // Redirect to application form
    setTimeout(() => {
        window.location.href = 'Applicationform.html';
    }, 1000);
}

function openAdmissionSlip() {
    // Close any open dropdowns
    closeUserDropdown();
    
    // Show loading notification
    showNotification('Opening admission slip...', 'info');
    
    // Redirect to admission slip
    setTimeout(() => {
        window.location.href = 'admission-slip.html';
    }, 1000);
}

function contactSupport() {
    showNotification('Opening support chat...', 'info');
    
    // Simulate opening support
    setTimeout(() => {
        alert('Support Contact Information:\n\nPhone: +63 2 8123 4567\nMobile: +63 917 123 4567\nEmail: support@betci.edu.ph\n\nOffice Hours:\nMonday - Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM');
    }, 500);
}

function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to log out?')) {
        showNotification('Logging out...', 'info');
        
        // Simulate logout process
        setTimeout(() => {
            // Clear any stored data
            localStorage.removeItem('sidebarCollapsed');
            
            // Redirect to landing page
            showNotification('Logged out successfully!', 'success');
            
            // Redirect to landing page
            setTimeout(() => {
                window.location.href = '../public/index.html';
            }, 1500);
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#059652',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in using requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Load user preferences on startup
function loadUserPreferences() {
    // Load sidebar state
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (sidebar && mainContent) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }
    
    // Load theme
    const theme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    
    // Update dark mode toggle in profile dropdown
    setTimeout(() => {
        updateDarkModeToggle(theme);
    }, 100);
    
    // Update theme buttons in settings
    setTimeout(() => {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = Array.from(themeButtons).find(btn => 
            btn.textContent.toLowerCase() === theme
        );
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }, 100);
}

// Initialize preferences
loadUserPreferences();

// Global functions for onclick handlers
window.showSection = showSection;
window.filterCourses = filterCourses;
window.handleCourseAction = handleCourseAction;
window.changeTheme = changeTheme;
window.toggleTheme = toggleTheme;
window.toggleDarkMode = toggleDarkMode;
window.downloadCertificates = downloadCertificates;
window.openApplicationForm = openApplicationForm;
window.openAdmissionSlip = openAdmissionSlip;
window.contactSupport = contactSupport;
window.logout = logout;

console.log('Dashboard JavaScript loaded and ready!');