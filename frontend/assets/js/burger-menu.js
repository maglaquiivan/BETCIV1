// ============================================
// BURGER MENU - HIDE AND SEEK SIDEBAR
// ============================================

/**
 * Initialize burger menu functionality
 */
function initBurgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Skip initialization if elements don't exist
    if (!menuToggle || !sidebar) {
        return;
    }
    
    // Toggle menu on burger button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleBurgerMenu(sidebar, mainContent);
    });
    
    // Close menu when clicking on a nav link (mobile only)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeBurgerMenu(sidebar, mainContent);
            }
        });
    });
    
    // Close menu when clicking outside (mobile only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
                if (sidebar.classList.contains('active')) {
                    closeBurgerMenu(sidebar, mainContent);
                }
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // On desktop, remove mobile classes
            sidebar.classList.remove('active');
            removeMenuOverlay();
        }
    });
}

/**
 * Toggle burger menu open/close
 */
function toggleBurgerMenu(sidebar, mainContent) {
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        closeBurgerMenu(sidebar, mainContent);
    } else {
        openBurgerMenu(sidebar, mainContent);
    }
}

/**
 * Open burger menu
 */
function openBurgerMenu(sidebar, mainContent) {
    sidebar.classList.add('active');
    
    // Add overlay on mobile
    if (window.innerWidth <= 768) {
        addMenuOverlay();
    }
}

/**
 * Close burger menu
 */
function closeBurgerMenu(sidebar, mainContent) {
    sidebar.classList.remove('active');
    removeMenuOverlay();
}

/**
 * Add overlay when menu is open (mobile)
 */
function addMenuOverlay() {
    if (document.getElementById('menuOverlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    overlay.className = 'menu-overlay';
    overlay.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        closeBurgerMenu(sidebar, mainContent);
    });
    document.body.appendChild(overlay);
}

/**
 * Remove overlay when menu is closed
 */
function removeMenuOverlay() {
    const overlay = document.getElementById('menuOverlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initBurgerMenu();
});

// ============================================
// BURGER MENU STYLES (CSS-in-JS)
// ============================================

/**
 * Inject burger menu styles
 */
function injectBurgerMenuStyles() {
    if (document.getElementById('burgerMenuStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'burgerMenuStyles';
    style.textContent = `
        /* Menu Overlay for Mobile */
        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Desktop: Sidebar slides in/out from left */
        @media (min-width: 769px) {
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                height: 100vh;
                z-index: 1000;
                transform: translateX(0);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                width: 210px;
            }
            
            .sidebar.active {
                transform: translateX(-100%);
            }
            
            .main-content {
                margin-left: 210px;
                transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .sidebar.active ~ .main-content {
                margin-left: 0;
            }
        }
        
        /* Mobile/Tablet: Sidebar slides in/out from left */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                height: 100vh;
                z-index: 1000;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                width: 210px !important;
            }
            
            .sidebar.active {
                transform: translateX(0);
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
            }
            
            .main-content {
                margin-left: 0 !important;
                width: 100%;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inject styles on script load
injectBurgerMenuStyles();
