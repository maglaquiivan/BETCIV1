// Mobile Menu Functionality for Trainee Dashboard
// This script handles the sidebar toggle and close button for mobile view

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
});

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
        const closeButtonX = rect.right - 60; // 20px from right + 40px button width
        const closeButtonY = rect.top + 20; // 20px from top
        
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

console.log('Mobile menu script loaded');
