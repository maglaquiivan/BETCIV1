/**
* Template Name: Avilon
* Template URL: https://bootstrapmade.com/avilon-bootstrap-landing-page-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  const navMenuLinks = document.querySelectorAll('#navmenu a');
  if (navMenuLinks.length > 0) {
    navMenuLinks.forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });
  }

  /**
   * Toggle mobile nav dropdowns
   */
  const dropdownToggles = document.querySelectorAll('.navmenu .toggle-dropdown');
  if (dropdownToggles.length > 0) {
    dropdownToggles.forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  }

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Frequently Asked Questions Toggle
   */
  const faqItems = document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle');
  if (faqItems.length > 0) {
    faqItems.forEach((faqItem) => {
      faqItem.addEventListener('click', () => {
        faqItem.parentNode.classList.toggle('faq-active');
      });
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    const swiperElements = document.querySelectorAll(".init-swiper");
    if (swiperElements.length > 0 && typeof Swiper !== 'undefined') {
      swiperElements.forEach(function(swiperElement) {
        const configElement = swiperElement.querySelector(".swiper-config");
        if (configElement) {
          let config = JSON.parse(configElement.innerHTML.trim());

          if (swiperElement.classList.contains("swiper-tab")) {
            initSwiperWithCustomPagination(swiperElement, config);
          } else {
            new Swiper(swiperElement, config);
          }
        }
      });
    }
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    if (navmenulinks.length > 0) {
      navmenulinks.forEach(navmenulink => {
        if (!navmenulink.hash) return;
        let section = document.querySelector(navmenulink.hash);
        if (!section) return;
        let position = window.scrollY + 200;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        } else {
          navmenulink.classList.remove('active');
        }
      });
    }
  }
  
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

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
    // Scroll to bottom when opening chat
    setTimeout(() => {
      const chatBody = document.getElementById('chatBody');
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
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
      botMessage.innerHTML = `<div>Thank you for your message! Our team will get back to you soon.</div>`;
      chatBody.appendChild(botMessage);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
  }
}

// Allow sending message with Enter key
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Handle window resize for chat responsiveness
  window.addEventListener('resize', function() {
    const chatContainer = document.getElementById('chatContainer');
    const chatBody = document.getElementById('chatBody');
    
    if (chatContainer && !chatContainer.classList.contains('minimized')) {
      // Maintain scroll position on resize
      setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 100);
    }
  });
  
  // Prevent chat from interfering with page scroll on mobile
  const chatBody = document.getElementById('chatBody');
  if (chatBody) {
    chatBody.addEventListener('touchmove', function(e) {
      e.stopPropagation();
    }, { passive: true });
  }
});


/**
 * Custom Chat Widget Functionality
 */
function toggleChatWidget() {
  const chatWindow = document.getElementById('chatWindow');
  const chatBadge = document.querySelector('.chat-badge');
  
  chatWindow.classList.toggle('active');
  
  // Hide badge when opening chat
  if (chatWindow.classList.contains('active')) {
    if (chatBadge) chatBadge.style.display = 'none';
    
    // Scroll to bottom
    setTimeout(() => {
      const chatMessages = document.getElementById('chatMessages');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }
}

function sendChatMessage() {
  const inputField = document.getElementById('chatInputField');
  const message = inputField.value.trim();
  
  if (message) {
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    inputField.value = '';
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! Our team will get back to you shortly. 😊",
        "I've received your inquiry. For immediate assistance, please call us at +63 2 8123 4567.",
        "Great question! You can find more information on our courses page or contact our admissions team.",
        "Thanks for reaching out! Would you like to schedule a visit to our training center?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addChatMessage(randomResponse, 'bot');
    }, 1000);
  }
}

function sendQuickReply(message) {
  addChatMessage(message, 'user');
  
  // Remove quick replies after first use
  const quickReplies = document.querySelector('.quick-replies');
  if (quickReplies) {
    quickReplies.style.display = 'none';
  }
  
  // Simulate bot response based on quick reply
  setTimeout(() => {
    let response = '';
    
    if (message.includes('Courses')) {
      response = "We offer 6 TESDA-accredited courses including Forklift Operation, Bulldozer Operation, Dump Truck Operation, Hydraulic Excavator, Wheel Loader, and Backhoe Loader. Would you like to know more about any specific course?";
    } else if (message.includes('Enrollment')) {
      response = "To enroll, you can visit our office at 123 Training Avenue, Manila, or call us at +63 2 8123 4567. Our office hours are Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 8:00 AM - 12:00 PM.";
    } else if (message.includes('Contact')) {
      response = "You can reach us at:\n📞 +63 2 8123 4567 / +63 917 123 4567\n📧 info@betci.edu.ph\n📍 123 Training Avenue, Manila, Philippines";
    }
    
    addChatMessage(response, 'bot');
  }, 1000);
}

function addChatMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-msg ${sender}-msg`;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  if (sender === 'bot') {
    messageDiv.innerHTML = `
      <div class="msg-avatar">
        <img src="../assets/img/logo.png" alt="Bot">
      </div>
      <div class="msg-content">
        <p>${text}</p>
        <span class="msg-time">${timeString}</span>
      </div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="msg-avatar">U</div>
      <div class="msg-content">
        <p>${text}</p>
        <span class="msg-time">${timeString}</span>
      </div>
    `;
  }
  
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendChatMessage();
  }
}

// Close chat when clicking outside
document.addEventListener('click', function(event) {
  const chatWidget = document.getElementById('chatWidget');
  const chatWindow = document.getElementById('chatWindow');
  
  if (chatWidget && chatWindow && chatWindow.classList.contains('active')) {
    if (!chatWidget.contains(event.target)) {
      chatWindow.classList.remove('active');
    }
  }
});
