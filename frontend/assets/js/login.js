/*--------------------------------------------------------------
# Login Page JavaScript
--------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
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
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const role = document.getElementById('login-role').value;
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      if (!role || !email || !password) {
        alert('Please fill in all fields');
        return;
      }

      // Handle different roles
      if (role === 'student') {
        console.log('Student login:', { email, password });
        alert('Redirecting to trainee dashboard...');
        window.location.href = '../trainee/dashboard.html';
      } else if (role === 'instructor') {
        console.log('Instructor login:', { email, password });
        alert('Instructor dashboard coming soon!');
      } else if (role === 'admin') {
        console.log('Admin login from role dropdown:', { email, password });
        alert('Redirecting to admin dashboard...');
        window.location.href = '../admin/dashboard.html';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const course = document.getElementById('register-course').value;
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-confirm').value;

      if (!name || !email || !password || !confirm) {
        alert('Please fill in all required fields');
        return;
      }

      if (password !== confirm) {
        alert('Passwords do not match');
        return;
      }

      // Here you would typically send the registration data to your backend
      console.log('Registration attempt:', { name, email, course, password });
      alert('Registration functionality would be implemented here');
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
