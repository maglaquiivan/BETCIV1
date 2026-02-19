// Trainee Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded successfully!');
    loadAllCourses();
    animateProgressBars();
});

function loadAllCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;
    
    const courses = [
        {
            title: "Forklift Operation NC II",
            description: "Master forklift operation, safety protocols, and material handling techniques.",
            image: "../assets/img/fork.png",
            progress: 65,
            duration: "4 weeks",
            level: "Beginner",
            status: "active",
            badge: "NEW"
        },
        {
            title: "Bulldozer Operation NC II", 
            description: "Learn bulldozer operation, earthmoving techniques, and site preparation.",
            image: "../assets/img/bulldozer.png",
            progress: 40,
            duration: "6 weeks", 
            level: "Intermediate",
            status: "active",
            badge: "IN PROGRESS"
        },
        {
            title: "Hydraulic Excavator NC II",
            description: "Advanced excavator operation, digging techniques, and hydraulic systems.",
            image: "../assets/img/hydraulic excavator.png",
            progress: 85,
            duration: "8 weeks",
            level: "Advanced", 
            status: "active",
            badge: "LEVEL III"
        },
        {
            title: "Dump Truck Operation NC II",
            description: "Professional training for rigid on-highway dump truck operation.",
            image: "../assets/img/dump truck.png",
            progress: 100,
            duration: "5 weeks",
            level: "Intermediate",
            status: "completed",
            badge: "COMPLETED"
        },
        {
            title: "Wheel Loader NC II",
            description: "Comprehensive wheel loader training and material handling techniques.",
            image: "../assets/img/logo.png",
            progress: 0,
            duration: "6 weeks",
            level: "Intermediate",
            status: "available",
            badge: "AVAILABLE"
        },
        {
            title: "Backhoe Loader NC II",
            description: "Master backhoe loader operation, digging, and trenching techniques.",
            image: "../assets/img/logo.png", 
            progress: 100,
            duration: "7 weeks",
            level: "Advanced",
            status: "completed",
            badge: "COMPLETED"
        }
    ];
    
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card" data-status="${course.status}">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjRDNDMwIiBvcGFjaXR5PSIwLjIiLz4KPHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI3MCIgeT0iNDUiPgo8cGF0aCBkPSJNMTUgMjVIMzVWMzVIMTVWMjVaIiBmaWxsPSIjRTY3RTIyIi8+CjxwYXRoIGQ9Ik0yMCAzMEgzMFY0MEgyMFYzMFoiIGZpbGw9IiNFNjdFMjIiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                <div class="course-badge ${course.status}">${course.badge}</div>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="progress-text">${course.progress}% Complete</span>
                </div>
                <div class="course-meta">
                    <span class="course-duration"><i class="bi bi-clock"></i> ${course.duration}</span>
                    <span class="course-level">${course.level}</span>
                </div>
                <button class="continue-btn ${course.status === 'available' ? 'enroll-btn' : course.status === 'completed' ? 'review-btn' : ''}" 
                        onclick="handleCourseAction('${course.status}', '${course.title}')">
                    ${course.status === 'available' ? 'Enroll Now' : course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                </button>
            </div>
        </div>
    `).join('');
    
    setTimeout(() => {
        animateProgressBars();
    }, 100);
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
            bar.style.width = targetWidth;
        });
    });
}

function handleCourseAction(status, title) {
    switch(status) {
        case 'available':
            showNotification(`Enrolling in ${title}...`, 'info');
            break;
        case 'completed':
            showNotification(`Opening ${title} review...`, 'info');
            break;
        default:
            showNotification(`Continuing ${title}...`, 'info');
    }
}

function downloadCertificates() {
    showNotification('Downloading certificates...', 'success');
    setTimeout(() => {
        showNotification('Certificates downloaded successfully!', 'success');
    }, 2000);
}

function contactSupport() {
    showNotification('Opening support chat...', 'info');
    setTimeout(() => {
        alert('Support Contact Information:\n\nPhone: +63 2 8123 4567\nMobile: +63 917 123 4567\nEmail: support@betci.edu.ph\n\nOffice Hours:\nMonday - Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM');
    }, 500);
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#059652',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-weight: 500;
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

console.log('Dashboard JavaScript loaded and ready!');
