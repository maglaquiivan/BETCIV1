// Common JavaScript for all Trainee Pages
// Handles: Mobile Menu, User Dropdown, Dark Mode, Navigation, Profile Picture

document.addEventListener('DOMContentLoaded', function() {
    loadUserProfilePicture();
    initializeMobileMenu();
    initializeUserDropdown();
    initializeDarkMode();
    loadTheme();
    
    // Listen for profile picture updates
    window.addEventListener('profilePictureUpdated', function(e) {
        console.log('Profile picture updated, reloading...');
        loadUserProfilePicture();
    });
});

// ============================================
// LOAD USER PROFILE PICTURE
// ============================================
async function loadUserProfilePicture() {
    try {
        const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || '{}');
        
        if (!userSession.userId) return;
        
        // Update user name from session first (faster)
        if (userSession.firstName) {
            const firstName = userSession.firstName.toUpperCase();
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = firstName;
            });
            
            // Update dropdown user info
            const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
            if (dropdownUserInfo && userSession.lastName) {
                dropdownUserInfo.textContent = `${userSession.firstName} ${userSession.lastName}`.toUpperCase();
            }
            
            const dropdownEmail = document.querySelector('.dropdown-user-info p');
            if (dropdownEmail && userSession.email) {
                dropdownEmail.textContent = userSession.email;
            }
        }
        
        // Check if we have a cached profile picture URL in sessionStorage (temporary cache)
        const cachedPictureKey = `profilePic_${userSession.userId}`;
        const cachedPicture = sessionStorage.getItem(cachedPictureKey);
        
        if (cachedPicture && cachedPicture.startsWith('data:')) {
            // Use cached picture immediately for faster loading
            updateAllAvatarsWithPicture(cachedPicture);
        }
        
        // Fetch user data to get profile picture (always fetch to ensure it's up to date)
        // Use trainee-accounts endpoint for trainee users
        const apiEndpoint = userSession.role === 'trainee' ? 'trainee-accounts' : 'accounts';
        const userId = userSession.accountId || userSession.userId;
        const response = await fetch(`http://localhost:5500/api/${apiEndpoint}/${userId}`);
        
        if (!response.ok) return;
        
        const user = await response.json();
        
        // Update profile picture if exists
        if (user.profilePicture && user.profilePicture.startsWith('data:')) {
            updateAllAvatarsWithPicture(user.profilePicture);
            
            // Cache in sessionStorage for this session only (cleared on browser close)
            sessionStorage.setItem(cachedPictureKey, user.profilePicture);
        }
        
        // Update user name and email from API (more accurate)
        if (user.firstName) {
            const firstName = user.firstName.toUpperCase();
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = firstName;
            });
            
            // Update dropdown user info
            const dropdownUserInfo = document.querySelector('.dropdown-user-info h4');
            if (dropdownUserInfo && user.lastName) {
                dropdownUserInfo.textContent = `${user.firstName} ${user.lastName}`.toUpperCase();
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
    
    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('collapsed');
        document.body.style.overflow = sidebar.classList.contains('collapsed') ? 'hidden' : '';
    });
    
    // Close sidebar when clicking the close button area (top right)
    sidebar.addEventListener('click', function(e) {
        if (!sidebar.classList.contains('collapsed')) return;
        
        const rect = sidebar.getBoundingClientRect();
        const closeButtonX = rect.right - 60;
        const closeButtonY = rect.top + 20;
        
        // Check if click is within close button area (40x40 button)
        if (e.clientX >= closeButtonX && e.clientX <= closeButtonX + 40 &&
            e.clientY >= closeButtonY && e.clientY <= closeButtonY + 40) {
            sidebar.classList.remove('collapsed');
            document.body.style.overflow = '';
            e.stopPropagation();
        }
    });
    
    // Close sidebar when clicking overlay (outside sidebar)
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('collapsed') && 
            !sidebar.contains(e.target) && 
            e.target !== menuToggle &&
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('collapsed');
            document.body.style.overflow = '';
        }
    });
    
    // Close sidebar when clicking a nav link on mobile
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Reset sidebar state on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('collapsed');
            document.body.style.overflow = '';
        }
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
    
    userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
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
    
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update button icon
    const btn = document.getElementById('darkModeBtn');
    if (btn) {
        btn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    }
    
    // Update toggle checkbox
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.checked = isDark;
    }
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('darkModeBtn');
        if (btn) btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        
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
window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.showNotification = showNotification;
window.openChangePassword = function(event) {
    if (event) event.preventDefault();
    window.location.href = 'settings.html#password';
};

console.log('Common trainee scripts loaded successfully');
