// ============================================
// TRAINEE DASHBOARD - MAIN SCRIPT
// ============================================

// Load sidebar on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    initializeEventListeners();
    setActiveNavLink();
    loadTheme();
});

// ============================================
// SIDEBAR LOADING
// ============================================

function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    
    fetch('./sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load sidebar');
            }
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            initializeSidebarEvents();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            // Fallback: create a basic sidebar if fetch fails
            createFallbackSidebar();
        });
}

function createFallbackSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    sidebarContainer.innerHTML = `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo-container">
                    <img src="../assets/img/logo.png" alt="BETCI Logo" class="sidebar-logo">
                    <div class="logo-text">
                        <h3>BETCI</h3>
                        <p>Trainee Dashboard</p>
                    </div>
                </div>
                <button class="sidebar-toggle" id="sidebarToggle">
                    <i class="bi bi-list"></i>
                </button>
            </div>  
            
            <nav class="sidebar-nav">
                <ul>
                    <li class="nav-item active">
                        <a href="index.html" class="nav-link" data-section="dashboard">
                            <i class="bi bi-house-door"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="courses.html" class="nav-link" data-section="courses">
                            <i class="bi bi-book"></i>
                            <span>Course & Programs</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="assessment.html" class="nav-link" data-section="assessment">
                            <i class="bi bi-clipboard-check"></i>
                            <span>Assessment</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="settings.html" class="nav-link" data-section="settings">
                            <i class="bi bi-gear"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    `;
    initializeSidebarEvents();
}

// ============================================
// SIDEBAR EVENTS
// ============================================

function initializeSidebarEvents() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking on a nav link (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
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
    alert('Application Form feature coming soon!');
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
