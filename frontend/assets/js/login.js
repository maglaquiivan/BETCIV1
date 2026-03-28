/*--------------------------------------------------------------
# Login Page JavaScript
--------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
  // Modal functions
  function showModal(type, title, message, redirectUrl = null) {
    const modalEl = document.getElementById('loginModal');
    if (!modalEl) return; // Modal not available on this page
    
    const modal = new bootstrap.Modal(modalEl);
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalButton = document.getElementById('modalButton');

    if (type === 'success') {
      modalIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>';
      modalButton.className = 'btn btn-success';
    } else {
      modalIcon.innerHTML = '<i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>';
      modalButton.className = 'btn btn-danger';
    }

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.show();

    // Auto redirect on success
    if (type === 'success' && redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }
  }

  // Check URL parameters for course pre-selection
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course');
  const tabParam = urlParams.get('tab');

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // If tab parameter exists, switch to that tab
  if (tabParam === 'register') {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    const registerBtn = document.querySelector('[data-tab="register"]');
    const registerTab = document.getElementById('register-tab');
    
    if (registerBtn && registerTab) {
      registerBtn.classList.add('active');
      registerTab.classList.add('active');
    }
  }

  // If course parameter exists, pre-select the course
  if (courseParam) {
    const courseSelect = document.getElementById('register-course');
    if (courseSelect) {
      courseSelect.value = courseParam;
    }
  }

  // Form submission handlers
  const loginForm = document.querySelector('#login-tab .login-form');
  const registerForm = document.querySelector('#register-tab .login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get email and password (no role selector needed)
      const email = document.getElementById('login-email')?.value;
      const password = document.getElementById('login-password')?.value;

      if (!email || !password) {
        showModal('error', 'Missing Information', 'Please fill in all fields');
        return;
      }

      try {
        // Call MongoDB API for login
        const response = await fetch('http://localhost:5500/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          showModal('error', 'Login Failed', 'Username or password is incorrect. Please try again.');
          return;
        }

        const user = await response.json();

        // Store user session
        localStorage.setItem('userSession', JSON.stringify(user));

        // Auto-redirect based on user role from database
        // Admin and Instructor go to admin dashboard
        // Everyone else (trainee, staff, etc.) goes to trainee dashboard
        if (user.role === 'admin' || user.role === 'instructor') {
          const roleTitle = user.role === 'admin' ? 'Admin' : 'Instructor';
          showModal('success', 'Login Successful!', `Welcome back ${roleTitle}! Redirecting to dashboard...`, '../admin/pages/dashboard.html');
        } else {
          // Trainee, staff, or any other role
          showModal('success', 'Login Successful!', 'Welcome back! Redirecting to your dashboard...', '../trainee/pages/dashboard.html');
        }

      } catch (error) {
        console.error('Login error:', error);
        showModal('error', 'Login Failed', 'Username or password is incorrect. Please try again.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const course = document.getElementById('register-course').value;
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-confirm').value;

      if (!name || !email || !password || !confirm) {
        showModal('error', 'Missing Information', 'Please fill in all required fields');
        return;
      }

      if (password !== confirm) {
        showModal('error', 'Password Mismatch', 'Passwords do not match. Please try again.');
        return;
      }

      try {
        // Split name into first and last name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0];

        // Create username from email (before @ symbol)
        const username = email.split('@')[0];

        // Call MongoDB API for registration - save to accounts collection
        const response = await fetch('http://localhost:5500/api/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountId: `ACC${Date.now()}`,
            username: username,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            role: 'trainee',
            status: 'active',
            permissions: []
          })
        });

        if (!response.ok) {
          showModal('error', 'Registration Failed', 'Unable to create account. Email may already be in use.');
          return;
        }

        const user = await response.json();
        
        showModal('success', 'Registration Successful!', 'Your account has been created. Please login with your credentials.');
        
        // Switch to login tab after delay
        setTimeout(() => {
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          const loginBtn = document.querySelector('[data-tab="login"]');
          const loginTab = document.getElementById('login-tab');
          
          if (loginBtn && loginTab) {
            loginBtn.classList.add('active');
            loginTab.classList.add('active');
          }
        }, 2000);

      } catch (error) {
        console.error('Registration error:', error);
        showModal('error', 'Registration Failed', 'Unable to create account. Please try again.');
      }
    });
  }
});

/**
 * Chat Container Functionality
 */
function toggleChat() {
  const chatContainer = document.getElementById('chatContainer');
  const chatIcon = document.getElementById('chatIcon');
  
  chatContainer.classList.toggle('minimized');
  
  if (chatContainer.classList.contains('minimized')) {
    chatIcon.className = 'bi bi-chat-dots';
  } else {
    chatIcon.className = 'bi bi-x';
  }
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const message = chatInput.value.trim();
  
  if (message) {
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `<div>${message}</div>`;
    chatBody.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.className = 'chat-message bot';
      botMessage.innerHTML = `<div>Thank you for your message! Our support team will assist you shortly.</div>`;
      chatBody.appendChild(botMessage);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
  }
}

// Chat functionality initialization
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
});
