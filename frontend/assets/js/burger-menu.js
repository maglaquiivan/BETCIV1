// ============================================
// BURGER MENU - UNIVERSAL IMPLEMENTATION
// ============================================

/**
 * Initialize burger menu functionality
 * This function should be called on page load
 */
function initBurgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;
    
    // Skip initialization if elements don't exist (e.g., on landing page)
    if (!menuToggle || !sidebar) {
        return;
    }
    
    console.log('Burger menu initialized successfully');
    
    // Toggle menu on burger button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Menu toggle clicked');
        toggleBurgerMenu(sidebar, mainContent, body);
    });
    
    // Close menu when clicking on a nav link (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeBurgerMenu(sidebar, mainContent, body);
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
            if (sidebar.classList.contains('active')) {
                closeBurgerMenu(sidebar, mainContent, body);
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeBurgerMenu(sidebar, mainContent, body);
        }
    });
}

/**
 * Toggle burger menu open/close
 */
function toggleBurgerMenu(sidebar, mainContent, body) {
    // On desktop, collapse/expand sidebar
    if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    } else {
        // On mobile, slide sidebar in/out
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('menu-open');
        body.classList.toggle('menu-open');
        
        // Add overlay for mobile
        if (sidebar.classList.contains('active')) {
            addMenuOverlay();
        } else {
            removeMenuOverlay();
        }
    }
}

/**
 * Close burger menu
 */
function closeBurgerMenu(sidebar, mainContent, body) {
    // On mobile, close the slide-out menu
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('menu-open');
        body.classList.remove('menu-open');
        removeMenuOverlay();
    }
}

/**
 * Add overlay when menu is open
 */
function addMenuOverlay() {
    if (document.getElementById('menuOverlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    overlay.className = 'menu-overlay';
    overlay.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const body = document.body;
        closeBurgerMenu(sidebar, mainContent, body);
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
        /* Burger Menu Overlay */
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
        
        /* Sidebar Active State (Mobile Slide) */
        .sidebar.active {
            transform: translateX(0);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
        }
        
        /* Sidebar Collapsed State (Desktop Icon View) */
        .sidebar.collapsed {
            width: 70px;
        }
        
        .sidebar.collapsed .logo-text,
        .sidebar.collapsed .nav-link span {
            opacity: 0;
            visibility: hidden;
            width: 0;
        }
        
        .sidebar.collapsed .sidebar-header {
            padding: 20px 10px;
        }
        
        .sidebar.collapsed .logo-image {
            border-bottom: none;
            padding-bottom: 0;
        }
        
        .sidebar.collapsed .sidebar-logo {
            width: 50px;
            height: 50px;
        }
        
        .sidebar.collapsed .nav-link {
            justify-content: center;
            padding: 14px 10px;
        }
        
        /* Main Content with Menu Open */
        .main-content.menu-open {
            filter: brightness(0.8);
        }
        
        /* Body with Menu Open */
        body.menu-open {
            overflow: hidden;
        }
        
        /* Mobile Layout */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                height: 100vh;
                z-index: 1000;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                width: 210px !important;
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .sidebar.collapsed {
                width: 210px !important;
            }
            
            .sidebar.collapsed .logo-text,
            .sidebar.collapsed .nav-link span {
                opacity: 1;
                visibility: visible;
                width: auto;
            }
            
            .main-content {
                transition: filter 0.3s ease;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inject styles on script load
injectBurgerMenuStyles();
