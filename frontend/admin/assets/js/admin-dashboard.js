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
});

/* ============================================
   SIDEBAR & MENU
   ============================================ */

function initializeHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Store state in localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Restore sidebar state from localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }
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
    const profileBtn = document.querySelector('.profile-btn');
    const profileMenu = document.querySelector('.profile-menu');
    
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.profile-dropdown')) {
                profileMenu.classList.remove('active');
            }
        });
        
        // Handle menu items
        const menuItems = profileMenu.querySelectorAll('.profile-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const action = this.getAttribute('data-action');
                if (action === 'logout') {
                    handleLogout();
                } else if (action === 'profile') {
                    profileMenu.classList.remove('active');
                    showSection('manage-profile');
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
                    showNotification('Generating reports...', 'info');
                    setTimeout(() => {
                        showNotification('Reports generated successfully!', 'success');
                    }, 1500);
                    break;
                case 2: // Manage Appointments
                    showSection('appointments');
                    break;
                case 3: // System Settings
                    showSection('settings');
                    break;
            }
        });
    });
}

/* ============================================
   DARK MODE
   ============================================ */

function initializeDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeBtn = document.getElementById('darkModeBtn');
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    }
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        darkModeBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    }
    
    // Update settings page toggle if it exists
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDark;
    }
}
