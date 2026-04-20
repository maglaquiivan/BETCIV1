// Common JavaScript for all Trainee Pages
// Handles: Mobile Menu, User Dropdown, Dark Mode, Navigation, Profile Picture

document.addEventListener('DOMContentLoaded', function() {
    loadUserProfilePicture();
    initializeMobileMenu();
    initializeUserDropdown();
    initializeDarkMode();
    loadTheme();
    loadCompactMode();
    
    // Listen for profile picture updates
    window.addEventListener('profilePictureUpdated', function(e) {
        console.log('Profile picture updated, reloading...');
        try {
            const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || '{}');
            const sessionUserId = userSession.accountId || userSession.userId || userSession._id;
            const detailUserId = e?.detail?.userId;
            const detailPic = e?.detail?.profilePicture;
            if (sessionUserId && detailUserId && sessionUserId === detailUserId && typeof detailPic === 'string' && detailPic.startsWith('data:')) {
                sessionStorage.setItem(`profilePic_${sessionUserId}`, detailPic);
                updateAllAvatarsWithPicture(detailPic);
            } else {
                loadUserProfilePicture();
            }
        } catch (_) {
            loadUserProfilePicture();
        }
    });
});

// ============================================
// LOAD USER PROFILE PICTURE
// ============================================
async function loadUserProfilePicture() {
    try {
        const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || '{}');
        const sessionUserId = userSession.accountId || userSession.userId || userSession._id;
        if (!sessionUserId) return;

        // Show the currently logged-in user's name/picture on trainee pages.
        // (Endpoint selection below handles trainee/admin/instructor.)
        
        // Update user name from session first (faster)
        if (userSession.firstName || userSession.username || userSession.email) {
            const displayName = (userSession.firstName || userSession.username || 'User').toUpperCase();
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = displayName;
            });
            
            // Update dropdown user info
            const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
            if (dropdownUserInfo) {
                const full = `${userSession.firstName || ''} ${userSession.lastName || ''}`.trim();
                dropdownUserInfo.textContent = (full || displayName).toUpperCase();
            }
            
            const dropdownEmail = document.querySelector('.dropdown-user-info p');
            if (dropdownEmail && userSession.email) {
                dropdownEmail.textContent = userSession.email;
            }
        }
        
        // Check if we have a cached profile picture URL in sessionStorage (temporary cache)
        const cachedPictureKey = `profilePic_${sessionUserId}`;
        const cachedPicture = sessionStorage.getItem(cachedPictureKey);
        
        if (cachedPicture && cachedPicture.startsWith('data:')) {
            // Use cached picture immediately for faster loading
            updateAllAvatarsWithPicture(cachedPicture);
        }
        
        // Fetch user data to get profile picture (always fetch to ensure it's up to date)
        // Try role-appropriate collections first, then fallback to legacy.
        const endpoints = [];
        if (userSession.role === 'admin' || userSession.role === 'instructor') {
            endpoints.push('admin-accounts', 'accounts');
        } else {
            endpoints.push('trainee-accounts', 'accounts');
        }
        const userId = sessionUserId;
        let user = null;
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`http://localhost:5500/api/${endpoint}/${userId}`);
                if (response.ok) {
                    user = await response.json();
                    break;
                }
            } catch (_) {
                // try next
            }
        }
        if (!user) return;
        
        // Update profile picture if exists
        if (user.profilePicture && user.profilePicture.startsWith('data:')) {
            updateAllAvatarsWithPicture(user.profilePicture);
            
            // Cache in sessionStorage for this session only (cleared on browser close)
            sessionStorage.setItem(cachedPictureKey, user.profilePicture);
        }
        
        // Update user name and email from API (more accurate)
        if (user.firstName || user.username || user.email) {
            const displayName = (user.firstName || user.username || 'User').toUpperCase();
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = displayName;
            });
            
            // Update dropdown user info
            const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
            if (dropdownUserInfo) {
                const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                dropdownUserInfo.textContent = (full || displayName).toUpperCase();
            }
            
            const dropdownEmail = document.querySelector('.dropdown-user-info p');
            if (dropdownEmail && user.email) {
                dropdownEmail.textContent = user.email;
            }
        }
        
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }
}

// Helper function to update all avatar elements
function updateAllAvatarsWithPicture(profilePicture) {
    const userAvatars = document.querySelectorAll('.user-avatar');
    userAvatars.forEach(avatar => {
        avatar.innerHTML = `<img src="${profilePicture}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Profile Picture">`;
    });
    
    const dropdownAvatar = document.querySelector('.dropdown-avatar');
    if (dropdownAvatar) {
        dropdownAvatar.innerHTML = `<img src="${profilePicture}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Profile Picture">`;
    }
}

// ============================================
// MOBILE MENU
// ============================================
function initializeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!sidebar || !menuToggle) return;

    // Check if mobile view
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Initialize sidebar state
    if (isMobile()) {
        // Mobile: sidebar starts hidden (collapsed)
        sidebar.classList.add('collapsed');
        document.body.classList.remove('sidebar-open');
    } else {
        // Desktop: check saved state
        const saved = localStorage.getItem('sidebarCollapsed') === 'true';
        sidebar.classList.toggle('collapsed', saved);
    }

    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (isMobile()) {
            // Mobile: toggle sidebar visibility with overlay
            const isCollapsed = sidebar.classList.contains('collapsed');
            if (isCollapsed) {
                sidebar.classList.remove('collapsed');
                document.body.classList.add('sidebar-open');
            } else {
                sidebar.classList.add('collapsed');
                document.body.classList.remove('sidebar-open');
            }
        } else {
            // Desktop: toggle sidebar width
            const willCollapse = !sidebar.classList.contains('collapsed');
            sidebar.classList.toggle('collapsed', willCollapse);
            localStorage.setItem('sidebarCollapsed', willCollapse ? 'true' : 'false');
        }
    });

    // On mobile, close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!isMobile()) return;
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.add('collapsed');
            document.body.classList.remove('sidebar-open');
        }
    });

    // On mobile, tapping a nav link should hide the sidebar
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMobile()) {
                sidebar.classList.add('collapsed');
                document.body.classList.remove('sidebar-open');
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (isMobile()) {
                sidebar.classList.add('collapsed');
                document.body.classList.remove('sidebar-open');
            } else {
                const saved = localStorage.getItem('sidebarCollapsed') === 'true';
                sidebar.classList.toggle('collapsed', saved);
                document.body.classList.remove('sidebar-open');
            }
        }, 250);
    });
}

// ============================================
// USER DROPDOWN
// ============================================
function initializeUserDropdown() {
    const userProfile = document.querySelector('.user-profile');
    
    if (!userProfile) {
        console.warn('User profile dropdown element not found');
        return;
    }
    
    // Remove any existing listeners by cloning
    const newUserProfile = userProfile.cloneNode(true);
    userProfile.parentNode.replaceChild(newUserProfile, userProfile);
    
    newUserProfile.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('User profile clicked');
        this.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-profile')) {
            const allProfiles = document.querySelectorAll('.user-profile');
            allProfiles.forEach(profile => {
                profile.classList.remove('active');
            });
        }
    });
    
    console.log('User dropdown initialized successfully');
}

// ============================================
// DARK MODE
// ============================================
function initializeDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    console.log('Initializing dark mode...', { darkModeBtn, darkModeToggle });
    
    if (darkModeBtn) {
        // Remove any existing listeners by cloning
        const newBtn = darkModeBtn.cloneNode(true);
        darkModeBtn.parentNode.replaceChild(newBtn, darkModeBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Dark mode button clicked');
            toggleDarkMode();
        });
        
        console.log('Dark mode button listener attached');
    }
    
    if (darkModeToggle) {
        // Remove any existing listeners by cloning
        const newToggle = darkModeToggle.cloneNode(true);
        darkModeToggle.parentNode.replaceChild(newToggle, darkModeToggle);
        
        newToggle.addEventListener('change', function(e) {
            console.log('Dark mode toggle changed');
            toggleDarkMode();
        });
        
        console.log('Dark mode toggle listener attached');
    }
}

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    console.log('Dark mode toggled:', isDark);
    
    // Update button icon
    const btn = document.getElementById('darkModeBtn');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        } else {
            btn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
        }
    }
    
    // Update toggle checkbox
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.checked = isDark;
    }
    
    // Show notification
    showNotification(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    console.log('Loading theme:', theme);
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        
        const btn = document.getElementById('darkModeBtn');
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'bi bi-sun-fill';
            } else {
                btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
            }
        }
        
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = true;
    }
}

// ============================================
// NAVIGATION
// ============================================
function navigateTo(page) {
    window.location.href = page;
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            localStorage.removeItem('userSession');
            sessionStorage.removeItem('userSession');
            window.location.href = '../../auth/login.html';
        }, 500);
    }
}

// ============================================
// COMPACT MODE
// ============================================
function toggleCompactMode() {
    const compactModeToggle = document.getElementById('compactModeToggle');
    if (!compactModeToggle) return;
    
    const isCompact = compactModeToggle.checked;
    document.body.classList.toggle('compact-mode', isCompact);
    localStorage.setItem('compactMode', isCompact);
    
    showNotification(isCompact ? 'Compact mode enabled' : 'Compact mode disabled', 'info');
}

function loadCompactMode() {
    const compactMode = localStorage.getItem('compactMode') === 'true';
    if (compactMode) {
        document.body.classList.add('compact-mode');
        const toggle = document.getElementById('compactModeToggle');
        if (toggle) toggle.checked = true;
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#27AE60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    
    notification.innerHTML = `
        <i class="bi ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 350px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
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

// Make functions globally available
window.toggleDarkMode = toggleDarkMode;
window.loadTheme = loadTheme;
window.toggleCompactMode = toggleCompactMode;
window.loadCompactMode = loadCompactMode;
window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.showNotification = showNotification;
window.openChangePassword = function(event) {
    if (event) event.preventDefault();
    window.location.href = 'settings.html#password';
};

console.log('Common trainee scripts loaded successfully');
