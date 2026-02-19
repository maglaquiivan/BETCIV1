// ============================================
// TRAINEE DASHBOARD - MAIN SCRIPT
// ============================================

// Load sidebar on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebarEvents();
    initializeEventListeners();
    setActiveNavLink();
    loadTheme();
});

// ============================================
// SIDEBAR EVENTS
// ============================================

function initializeSidebarEvents() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            if (mainContent) {
                mainContent.classList.toggle('expanded');
            }
        });
    }
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking on a nav link (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// ============================================
// ACTIVE NAV LINK
// ============================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.closest('.nav-item').classList.add('active');
        } else {
            link.closest('.nav-item').classList.remove('active');
        }
    });
}

// ============================================
// EVENT LISTENERS INITIALIZATION
// ============================================

function initializeEventListeners() {
    // User Profile Dropdown
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userProfile.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target)) {
                userProfile.classList.remove('active');
            }
        });
    }
    
    // Close dropdown when clicking on a menu item
    const dropdownMenuItems = document.querySelectorAll('.dropdown-menu a');
    dropdownMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (userProfile) {
                userProfile.classList.remove('active');
            }
        });
    });
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = false;
        }
    }
}

// ============================================
// SECTION MANAGEMENT
// ============================================

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// ============================================
// USER FUNCTIONS
// ============================================

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        // Clear session/localStorage if needed
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        // Redirect to landing page
        window.location.href = '../public/index.html';
    }
}

function openApplicationForm() {
    window.location.href = 'assessment/application-form.html';
}

function openAdmissionSlip() {
    window.location.href = 'assessment/admission-slip.html';
}

function downloadCertificates() {
    alert('Download Certificates feature coming soon!');
}

function contactSupport() {
    alert('Contact Support feature coming soon!');
}

function editProfile(event) {
    if (event) {
        event.preventDefault();
    }
    alert('Edit Profile feature coming soon!');
}

function openSettings(event) {
    if (event) {
        event.preventDefault();
    }
    alert('Settings page coming soon!');
}

// ============================================
// RESPONSIVE BEHAVIOR
// ============================================

window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function filterCourses(status) {
    const courses = document.querySelectorAll('.course-card');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Update active tab
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter courses
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

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ACCESSIBILITY
// ============================================

// Keyboard navigation for dropdown
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.classList.remove('active');
        }
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('Trainee Dashboard Script Loaded Successfully');

// ============================================
// SETTINGS PAGE FUNCTIONS
// ============================================

function switchTab(tabName, event) {
    if (event) {
        event.preventDefault();
    }
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.settings-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.closest('.settings-tab').classList.add('active');
}

function toggleEditMode() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('.form-control');
    const formActions = document.getElementById('formActions');
    const editBtn = document.querySelector('.btn-edit');
    
    const isDisabled = inputs[0].disabled;
    
    inputs.forEach(input => {
        input.disabled = !isDisabled;
    });
    
    if (isDisabled) {
        formActions.style.display = 'flex';
        editBtn.innerHTML = '<i class="bi bi-x"></i> Cancel Edit';
    } else {
        formActions.style.display = 'none';
        editBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit Profile';
    }
}

function cancelEdit() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('.form-control');
    const formActions = document.getElementById('formActions');
    const editBtn = document.querySelector('.btn-edit');
    
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    formActions.style.display = 'none';
    editBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit Profile';
}

function changePhoto() {
    alert('Photo upload functionality would be implemented here');
}

// Handle profile form submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Profile updated successfully!');
        cancelEdit();
    });
}

// Handle password form submission
const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Password changed successfully!');
        this.reset();
    });
}
