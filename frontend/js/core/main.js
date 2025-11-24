// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openLoginModal() {
    closeAllModals();
    openModal('loginModal');
}

function openRegisterModal() {
    closeAllModals();
    openModal('registerModal');
}

function openForgotPasswordModal() {
    closeAllModals();
    openModal('forgotPasswordModal');
}

function closeAllModals() {
    closeModal('loginModal');
    closeModal('registerModal');
    closeModal('forgotPasswordModal');
}

function switchToRegister() {
    closeModal('loginModal');
    openModal('registerModal');
}

function switchToLogin() {
    closeModal('registerModal');
    closeModal('forgotPasswordModal');
    openModal('loginModal');
}

// Đóng cửa số khi nhấp ra bên ngoài
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeAllModals();
    }
}

// Đóng cửa sổ modal bằng phím Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAllModals();
    }
});

// Cuộn mượt mà đến các tính năng
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// -----------------------------
//  main.js — frontend logic
// -----------------------------

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    observeElements();
});

// -----------------------------
//  🔗 API endpoint — chỉ sửa CHỖ NÀY nếu cần
// -----------------------------
const API_BASE = "http://localhost:8080/api/auth"; 
// ⚠️ Đảm bảo backend của bạn đang chạy tại localhost:8080
// Nếu backend báo “Started Application on port 8081” thì sửa thành 8081

// -----------------------------
//  LOGIN
// -----------------------------
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ', 'error');
        return;
    }

    showNotification('Đang xử lý...', 'info');

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        const data = await res.json();

        if (data.success) {
            // Store user data with role
            const userData = {
                ...data.account,
                role: data.role
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            showNotification('Đăng nhập thành công!', 'success');
            closeModal('loginModal');
            setTimeout(() => {
                redirectBasedOnRole(data.role);
            }, 1000);
        } else {
            showNotification(data.message || 'Sai tài khoản hoặc mật khẩu', 'error');
        }
    } catch (err) {
        showNotification('Không thể kết nối đến máy chủ (API)', 'error');
        console.error('❌ Lỗi kết nối:', err);
    }
}

// -----------------------------
//  REGISTER
// -----------------------------
async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if (!name || !email || !password || !confirmPassword) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    if (!role) {
        showNotification('Vui lòng chọn vai trò', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp', 'error');
        return;
    }

    showNotification('Đang tạo tài khoản...', 'info');

    // Debug log to see what role is being sent
    console.log('Registering with role:', role);

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, role })
        });

        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        const data = await res.json();

        if (data.success) {
            // Store user data with role
            const userData = {
                ...data.account,
                role: data.role
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            showNotification('Đăng ký thành công!', 'success');
            closeModal('registerModal');
            setTimeout(() => {
                redirectBasedOnRole(data.role);
            }, 1000);
        } else {
            showNotification(data.message || 'Email đã tồn tại', 'error');
        }
    } catch (err) {
        showNotification('Không thể kết nối đến máy chủ (API)', 'error');
        console.error('❌ Lỗi kết nối:', err);
    }
}

// -----------------------------
//  Helper functions
// -----------------------------
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    alert(`${type.toUpperCase()}: ${message}`);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function observeElements() {
    // Optional: hiệu ứng khi scroll (nếu bạn có)
}


// -----------------------------
//  FORGOT PASSWORD
// -----------------------------
async function handleForgotPassword() {
    const email = document.getElementById('forgotEmail').value.trim();

    if (!email) {
        showNotification('Vui lòng nhập email', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ', 'error');
        return;
    }
showNotification('Đang gửi yêu cầu...', 'info');

    try {
        const res = await fetch(`${API_BASE}/forgot`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (!res.ok) throw new Error('Lỗi máy chủ');
        const data = await res.json();

        if (data.success) {
            showNotification('Vui lòng kiểm tra email để đặt lại mật khẩu', 'success');
            closeModal('forgotPasswordModal');
        } else {
            showNotification(data.message || 'Email chưa được đăng ký', 'error');
        }
    } catch (err) {
        showNotification('Không thể kết nối đến máy chủ', 'error');
        console.error(err);
    }
}

// -----------------------------
//  Utilities
// -----------------------------
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hiển thị thông báo (có thể bạn đã có sẵn)
function showNotification(message, type) {
    alert(`${type.toUpperCase()}: ${message}`);
}

// Đóng modal (nếu có)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Hiệu ứng cuộn (placeholder)
function observeElements() {
    // optional animation
}


function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Notification system
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        gap: 15px;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add fade-in class to elements
const elements = document.querySelectorAll('.feature-card, .contact-item, .about-card');
    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}


//Kiểm tra xem người dùng đã đăng nhập chưa
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index.html')) {
        // User is logged in but on home page, could show different UI
        const userData = JSON.parse(currentUser);
        console.log('User is logged in:', userData);
    }
}

// Khơi tạo khi đang tải
checkAuthStatus();

// -----------------------------
//  ROLE-BASED REDIRECTION
// -----------------------------
function redirectBasedOnRole(role) {
    if (role === 'organizer') {
        // Redirect to admin dashboard
        window.location.href = 'pages/admin/index.html';
    } else if (role === 'user') {
        // Redirect to user dashboard
        window.location.href = 'pages/user/index.html';
    } else {
        // Default fallback
        console.warn('Unknown role:', role);
        window.location.href = 'pages/user/index.html';
    }
}