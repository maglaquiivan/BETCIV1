/**
 * Session Check Middleware
 * Protects dashboard pages from unauthorized access
 * Redirects to login if session is invalid
 */

(function() {
  'use strict';
  
  // Get current page path
  const currentPath = window.location.pathname;
  
  console.log('=== SESSION CHECK RUNNING ===');
  console.log('Current path:', currentPath);
  
  // Define protected pages
  const protectedPages = [
    '/admin/pages/dashboard.html',
    '/admin/pages/records.html',
    '/admin/pages/courses.html',
    '/admin/pages/competencies.html',
    '/admin/pages/users.html',
    '/admin/pages/appointments.html',
    '/admin/pages/trainees.html',
    '/admin/pages/accounts.html',
    '/admin/pages/training-catalog.html',
    '/admin/pages/settings.html',
    '/trainee/pages/dashboard.html',
    '/trainee/pages/courses.html',
    '/trainee/pages/competencies.html',
    '/trainee/pages/appointments.html',
    '/trainee/pages/assessment/application-form.html',
    '/trainee/pages/assessment/admission-slip.html'
  ];
  
  // Check if current page is protected
  const isProtectedPage = protectedPages.some(page => currentPath.includes(page));
  
  console.log('Is protected page:', isProtectedPage);
  
  if (!isProtectedPage) {
    console.log('Public page - no session check needed');
    return; // Public page - no check needed
  }
  
  console.log('Protected page detected - checking session...');
  
  // Check if user is logged in via localStorage
  const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
  
  console.log('User session found:', !!userSession);
  
  if (!userSession) {
    // No session - redirect immediately
    console.log('No session found - redirecting to login');
    window.location.replace('/auth/login.html');
    return;
  }
  
  try {
    JSON.parse(userSession); // Validate JSON
    console.log('Valid session found - allowing page to load');
  } catch (error) {
    // Invalid session - clear and redirect
    console.log('Invalid session JSON - clearing and redirecting');
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    window.location.replace('/auth/login.html');
  }
})();

// Also check on page visibility change (when user comes back to tab)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    const currentPath = window.location.pathname;
    const protectedPages = [
      '/admin/pages/dashboard.html',
      '/admin/pages/records.html',
      '/admin/pages/courses.html',
      '/admin/pages/competencies.html',
      '/admin/pages/users.html',
      '/admin/pages/appointments.html',
      '/admin/pages/trainees.html',
      '/admin/pages/accounts.html',
      '/admin/pages/training-catalog.html',
      '/admin/pages/settings.html',
      '/trainee/pages/dashboard.html',
      '/trainee/pages/courses.html',
      '/trainee/pages/competencies.html',
      '/trainee/pages/appointments.html',
      '/trainee/pages/assessment/application-form.html',
      '/trainee/pages/assessment/admission-slip.html'
    ];
    
    const isProtectedPage = protectedPages.some(page => currentPath.includes(page));
    
    if (isProtectedPage) {
      const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
      if (!userSession) {
        window.location.replace('/auth/login.html');
      }
    }
  }
});

// Store session data in sessionStorage on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
  
  if (userSession) {
    try {
      const user = JSON.parse(userSession);
      sessionStorage.setItem('userId', user.userId || user.accountId);
      sessionStorage.setItem('username', user.username);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('role', user.role);
      sessionStorage.setItem('userType', user.userType);
    } catch (error) {
      console.error('Error parsing user session:', error);
    }
  }
});

/**
 * Logout function
 * Call this when user clicks logout button
 */
async function logout() {
  try {
    // Call backend logout endpoint to destroy session
    await fetch('http://localhost:5500/api/users/logout', {
      method: 'POST',
      credentials: 'include' // Send cookies
    }).catch(err => {
      console.error('Backend logout error (non-critical):', err);
      // Continue with local logout even if backend fails
    });
    
    // Clear all session data
    sessionStorage.clear();
    localStorage.removeItem('userSession');
    
    console.log('Logged out successfully');
    
    // Replace current history entry with login page
    // This prevents going back to the dashboard
    window.location.replace('/auth/login.html');
    
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local data and redirect even if backend call fails
    sessionStorage.clear();
    localStorage.removeItem('userSession');
    window.location.replace('/auth/login.html');
  }
}

// Make logout function available globally
window.logout = logout;

// Prevent back button after logout by monitoring history
window.addEventListener('popstate', function(event) {
  const currentPath = window.location.pathname;
  const protectedPages = [
    '/admin/pages/dashboard.html',
    '/admin/pages/records.html',
    '/admin/pages/courses.html',
    '/admin/pages/competencies.html',
    '/admin/pages/users.html',
    '/admin/pages/appointments.html',
    '/admin/pages/trainees.html',
    '/admin/pages/accounts.html',
    '/admin/pages/training-catalog.html',
    '/admin/pages/settings.html',
    '/trainee/pages/dashboard.html',
    '/trainee/pages/courses.html',
    '/trainee/pages/competencies.html',
    '/trainee/pages/appointments.html',
    '/trainee/pages/assessment/application-form.html',
    '/trainee/pages/assessment/admission-slip.html'
  ];
  
  const isProtectedPage = protectedPages.some(page => currentPath.includes(page));
  
  if (isProtectedPage) {
    const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    if (!userSession) {
      // No session - redirect to login
      window.location.replace('/auth/login.html');
    }
  }
});
