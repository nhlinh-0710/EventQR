// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load user data
    loadUserData();
    
    console.log('Dashboard loaded successfully');
});

// Check if user is authenticated
function checkAuthentication() {
    let currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // For testing purposes, create a default user
        const testUser = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        currentUser = JSON.stringify(testUser);
        console.log('Created test user for demo');
    }
    console.log('User authenticated:', JSON.parse(currentUser));
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Set active section
    const hash = window.location.hash.substring(1) || 'dashboard';
    switchSection(hash);
    
    // Update page title
    updatePageTitle(hash);
}

// Set up all event listeners
function setupEventListeners() {
    // Sidebar menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
            updateActiveMenuItem(this);
            updatePageTitle(section);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter events (would implement actual filtering logic here)
            const filter = this.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
    
    // Create event form
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateEvent();
        });
    }
    
    // File upload handling
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.getElementById('eventImage');
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file);
            }
        });
        
        // Drag and drop
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#f0f7ff';
        });
        
        fileUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleFileUpload(file);
            }
        });
    }
}

// Load and display user data
function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        
        // Update user name in header
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userData.name || 'Người dùng';
        }
        
        // Update user avatar with first letter of name
        const userAvatarElement = document.getElementById('userAvatar');
        if (userAvatarElement) {
            const firstLetter = (userData.name || 'U').charAt(0).toUpperCase();
            userAvatarElement.textContent = firstLetter;
        }
    }
}

// Switch between different sections
function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update URL hash
    window.history.pushState(null, null, '#' + sectionName);
}

// Update active menu item
function updateActiveMenuItem(clickedItem) {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    clickedItem.classList.add('active');
}

// Update page title
function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'events': 'Quản Lý Sự Kiện',
        'create-event': 'Tạo Sự Kiện Mới',
        'participants': 'Quản Lý Người Tham Dự',
        'analytics': 'Thống Kê & Báo Cáo',
        'profile': 'Thông Tin Cá Nhân'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[section] || 'Dashboard';
    }
}

// Filter events based on status
function filterEvents(filter) {
    // This would implement actual event filtering logic
    console.log('Filtering events by:', filter);
    
    // For demo purposes, just show a notification
    showNotification(`Đang lọc sự kiện: ${getFilterName(filter)}`, 'info');
}

function getFilterName(filter) {
    const names = {
        'all': 'Tất cả',
        'upcoming': 'Sắp diễn ra',
        'ongoing': 'Đang diễn ra',
        'completed': 'Đã hoàn thành'
    };
    return names[filter] || 'Tất cả';
}

// Handle create event form submission
function handleCreateEvent() {
    // Get form data
    const formData = {
        title: document.getElementById('eventTitle').value,
        category: document.getElementById('eventCategory').value,
        date: document.getElementById('eventDate').value,
        duration: document.getElementById('eventDuration').value,
        location: document.getElementById('eventLocation').value,
        maxParticipants: document.getElementById('maxParticipants').value,
        description: document.getElementById('eventDescription').value
    };
    
    // Validate required fields
    if (!formData.title || !formData.date || !formData.location) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }
    
    // Validate date (must be in future)
    const eventDate = new Date(formData.date);
    const now = new Date();
    if (eventDate <= now) {
        showNotification('Ngày sự kiện phải trong tương lai', 'error');
        return;
    }
    
    // Show loading
    showNotification('Đang tạo sự kiện...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // Generate event ID
        const eventId = generateId();
        
        // Create event object
        const newEvent = {
            id: eventId,
            ...formData,
            createdAt: new Date().toISOString(),
            status: 'upcoming',
            participants: 0
        };
        
        // Store event (in real app, this would be sent to server)
        let events = JSON.parse(localStorage.getItem('userEvents') || '[]');
        events.push(newEvent);
        localStorage.setItem('userEvents', JSON.stringify(events));
        
        showNotification('Sự kiện đã được tạo thành công!', 'success');
        
        // Reset form
        document.getElementById('createEventForm').reset();
        
        // Switch to events section
        setTimeout(() => {
            switchSection('events');
        }, 1500);
        
    }, 1000);
}

// Handle file upload
function handleFileUpload(file) {
    const fileUploadArea = document.querySelector('.file-upload-area');
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        fileUploadArea.innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
            <p>Hình ảnh đã được chọn: ${file.name}</p>
        `;
    };
    reader.readAsDataURL(file);
    
    showNotification('Hình ảnh đã được tải lên', 'success');
}

// Handle logout
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Clear user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userEvents');
        
        showNotification('Đã đăng xuất thành công', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Notification system (reused from main.js)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${getNotificationColor(type)};
        animation: slideInRight 0.3s ease-out;
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        color: #333;
    `;

    const icon = notification.querySelector('i');
    icon.style.color = getNotificationColor(type);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        margin-left: auto;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        color: #666;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Handle back/forward browser buttons
window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    switchSection(hash);
    updatePageTitle(hash);
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === hash) {
            item.classList.add('active');
        }
    });
});
