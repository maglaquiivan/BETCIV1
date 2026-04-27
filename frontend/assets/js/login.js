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

      console.log('Login form submitted');
      console.log('Email:', email);
      console.log('Password:', password ? '***' : 'empty');

      if (!email || !password) {
        showModal('error', 'Missing Information', 'Please fill in all fields');
        return;
      }

      try {
        console.log('Sending login request to http://localhost:5500/api/users/login');
        // Call MongoDB API for login
        const response = await fetch('http://localhost:5500/api/users/login', {
          method: 'POST',
          credentials: 'include', // Important: send cookies for session
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        console.log('Login response status:', response.status);
        console.log('Login response ok:', response.ok);

        if (!response.ok) {
          console.log('Login failed with status:', response.status);
          showModal('error', 'Login Failed', 'Username or password is incorrect. Please try again.');
          return;
        }

        const user = await response.json();
        console.log('Login successful, user:', user.email);

        // Store user session (exclude large fields like profilePicture to avoid header size issues)
        const sessionData = {
          userId: user.userId,
          accountId: user.accountId,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          userType: user.userType,
          profileComplete: user.profileComplete || false
          // profilePicture excluded - will be loaded separately when needed
        };
        localStorage.setItem('userSession', JSON.stringify(sessionData));

        // Auto-redirect based on user role from database
        // Admin and Instructor go to admin dashboard
        // Everyone else (trainee, staff, etc.) goes to trainee dashboard
        if (user.role === 'admin' || user.role === 'instructor') {
          const roleTitle = user.role === 'admin' ? 'Admin' : 'Instructor';
          showModal('success', 'Login Successful!', `Welcome back ${roleTitle}! Redirecting to dashboard...`, '../admin/pages/dashboard.html');
        } else {
          // Trainee, staff, or any other role - always go to trainee dashboard
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
      const firstName = document.getElementById('register-firstname').value.trim();
      const lastName = document.getElementById('register-lastname').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const address = document.getElementById('register-address').value.trim();
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-confirm').value;

      if (!firstName || !lastName || !email || !address || !password || !confirm) {
        showModal('error', 'Missing Information', 'Please fill in all required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showModal('error', 'Invalid Email', 'Please enter a valid email address');
        return;
      }

      // Only accept Gmail addresses
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        showModal('error', 'Invalid Email', 'Please use a Gmail address (e.g., user@gmail.com)');
        return;
      }

      if (password !== confirm) {
        showModal('error', 'Password Mismatch', 'Passwords do not match. Please try again.');
        return;
      }

      try {
        // Create username from email (before @ symbol)
        const username = email.split('@')[0];

        // Get the next trainee ID in ascending order
        const traineeIdResponse = await fetch('http://localhost:5500/api/trainee-accounts', {
          credentials: 'include'
        });
        const existingTrainees = await traineeIdResponse.json();
        
        // Find the highest TRN number
        let maxTrnNumber = 0;
        existingTrainees.forEach(trainee => {
          if (trainee.accountId && trainee.accountId.startsWith('TRN-')) {
            const trnNumber = parseInt(trainee.accountId.split('-')[1]);
            if (!isNaN(trnNumber) && trnNumber > maxTrnNumber) {
              maxTrnNumber = trnNumber;
            }
          }
        });
        
        // Generate next TRN-ID in format TRN-0001, TRN-0002, etc.
        const nextTrnNumber = maxTrnNumber + 1;
        const traineeId = `TRN-${String(nextTrnNumber).padStart(4, '0')}`;

        // Call MongoDB API for registration - save to trainee-accounts collection
        const response = await fetch('http://localhost:5500/api/trainee-accounts', {
          method: 'POST',
          credentials: 'include', // Important: send cookies for session
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountId: traineeId,
            username: username,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            address: address,
            role: 'trainee',
            status: 'active'
          })
        });

        if (!response.ok) {
          showModal('error', 'Registration Failed', 'Unable to create account. Email may already be in use.');
          return;
        }

        const user = await response.json();
        
        // Create trainee record in trainees collection
        try {
          const traineeData = {
            traineeId: user.accountId || traineeId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: '',
            address: address,
            status: 'active'
          };
          
          const traineeResponse = await fetch('http://localhost:5500/api/trainees', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(traineeData)
          });
          
          if (traineeResponse.ok) {
            console.log('Trainee record created successfully');
          }
        } catch (traineeError) {
          console.error('Error creating trainee record:', traineeError);
        }
        
        // Auto-login the newly registered user
        const sessionData = {
          userId: user.accountId || traineeId,
          accountId: user.accountId || traineeId,
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: 'trainee',
          phone: '',
          address: address,
          userType: 'trainee',
          profileComplete: false // Mark profile as incomplete
        };
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        
        // Redirect to trainee dashboard after registration
        showModal('success', 'Registration Successful!', 'Welcome to BETCI! Redirecting to your dashboard...', '../trainee/pages/dashboard.html');

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

// Helper function to get course name from course ID
function getCourseNameFromId(courseId) {
  const courseMap = {
    'forklift': 'Heavy Equipment Operation Forklift NC II',
    'bulldozer': 'Heavy Equipment Operation Bulldozer NC II',
    'dump-truck': 'Heavy Equipment Operation Rigid on Highway Dump Truck NC II',
    'excavator': 'Heavy Equipment Operation Hydraulic Excavator NC II',
    'wheel-loader': 'Heavy Equipment Operation Wheel Loader NC II',
    'backhoe': 'Heavy Equipment Operation Backhoe Loader NC II'
  };
  return courseMap[courseId] || courseId;
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
