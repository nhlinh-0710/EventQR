// ======================================
// 🔔 WEBSOCKET CLIENT - REALTIME NOTIFICATIONS
// ======================================

// Sử dụng IIFE để tránh duplicate declaration
(function() {
    'use strict';
    
    // Kiểm tra xem đã được khai báo chưa
    if (typeof window.__websocketModule !== 'undefined') {
        console.warn('WebSocket module đã được load, sử dụng instance hiện có');
        return;
    }
    
    window.__websocketModule = true;
    
    let stompClient = null;
    let isConnected = false;

/**
 * Kết nối WebSocket và subscribe vào topic của organizer
 * @param {number} organizerId - ID của organizer
 * @param {function} onNotificationReceived - Callback khi nhận thông báo
 */
function connectWebSocket(organizerId, onNotificationReceived) {
    if (isConnected && stompClient !== null) {
        console.log('WebSocket đã được kết nối');
        return;
    }

    // Sử dụng SockJS và STOMP
    const socket = new SockJS('http://localhost:8080/ws');
    
    // Kiểm tra xem Stomp có được load chưa
    if (typeof Stomp === 'undefined') {
        console.error('❌ Stomp library chưa được load. Vui lòng thêm script vào HTML.');
        return;
    }
    
    stompClient = Stomp.over(socket);
    
    // Disable debug logging (có thể bật lại nếu cần debug)
    stompClient.debug = function(str) {
        // console.log(str); // Uncomment để debug
    };

    stompClient.connect({}, function(frame) {
        console.log('✅ Đã kết nối WebSocket:', frame);
        isConnected = true;

        // Subscribe vào topic của organizer
        const topic = `/topic/organizer/${organizerId}`;
        console.log('📡 Đang subscribe vào:', topic);
        
        const subscription = stompClient.subscribe(topic, function(message) {
            try {
                const notification = JSON.parse(message.body);
                console.log('🔔 Nhận thông báo mới:', notification);
                
                // Gọi callback để xử lý thông báo
                if (onNotificationReceived && typeof onNotificationReceived === 'function') {
                    onNotificationReceived(notification);
                } else {
                    // Fallback: hiển thị toast nếu không có callback
                    showNotificationToast(notification);
                }
            } catch (error) {
                console.error('❌ Lỗi khi parse thông báo:', error);
                console.error('Raw message:', message.body);
            }
        });

        console.log('✅ Đã subscribe thành công vào topic:', topic);

    }, function(error) {
        console.error('❌ Lỗi kết nối WebSocket:', error);
        isConnected = false;
        
        // Thử kết nối lại sau 5 giây
        setTimeout(function() {
            console.log('🔄 Đang thử kết nối lại WebSocket...');
            connectWebSocket(organizerId, onNotificationReceived);
        }, 5000);
    });
}

/**
 * Ngắt kết nối WebSocket
 */
function disconnectWebSocket() {
    if (stompClient !== null) {
        stompClient.disconnect(function() {
            console.log('🔌 Đã ngắt kết nối WebSocket');
        });
        stompClient = null;
        isConnected = false;
    }
}

/**
 * Hiển thị thông báo dạng toast notification
 * @param {object} notification - Đối tượng thông báo từ server
 */
function showNotificationToast(notification) {
    // Sử dụng hàm showNotification từ main.js nếu có
    if (typeof showNotification === 'function') {
        showNotification(notification.message || notification.title || 'Có thông báo mới', 'info');
    } else {
        // Tạo toast notification riêng nếu không có hàm showNotification
        createToastNotification(notification);
    }
    
    // Cập nhật badge số thông báo chưa đọc
    if (notification.userId) {
        updateNotificationBadge(notification.userId);
    }
    
    // Log để debug
    console.log('🔔 Thông báo WebSocket:', notification);
}

/**
 * Tạo toast notification tùy chỉnh
 * @param {object} notification - Đối tượng thông báo
 */
function createToastNotification(notification) {
    // Xóa các notification cũ
    const existingToasts = document.querySelectorAll('.websocket-toast');
    existingToasts.forEach(toast => {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    });

    // Tạo element toast mới
    const toast = document.createElement('div');
    toast.className = 'websocket-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="toast-message">
                <div class="toast-title">${notification.title || 'Thông báo mới'}</div>
                <div class="toast-text">${notification.message || ''}</div>
            </div>
            <button class="toast-close" onclick="this.closest('.websocket-toast').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Thêm styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 320px;
        max-width: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.4s ease-out;
        overflow: hidden;
    `;

    const content = toast.querySelector('.toast-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 16px 20px;
        color: white;
    `;

    const icon = toast.querySelector('.toast-icon');
    icon.style.cssText = `
        font-size: 24px;
        color: #ffd700;
    `;

    const message = toast.querySelector('.toast-message');
    message.style.cssText = `
        flex: 1;
    `;

    const title = toast.querySelector('.toast-title');
    title.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
    `;

    const text = toast.querySelector('.toast-text');
    text.style.cssText = `
        font-size: 12px;
        opacity: 0.9;
        line-height: 1.4;
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        cursor: pointer;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    `;

    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
    });

    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    // Thêm CSS animations nếu chưa có
    if (!document.getElementById('websocket-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'websocket-toast-styles';
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
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Tự động xóa sau 6 giây
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 6000);
}

/**
 * Cập nhật badge số thông báo chưa đọc
 * @param {number} userId - ID của user
 */
async function updateNotificationBadge(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}/count`);
        if (response.ok) {
            const data = await response.json();
            const badge = document.getElementById('notification-badge');
            if (badge) {
                const count = data.count || 0;
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count;
                    badge.style.display = 'flex';
                } else {
                    badge.textContent = '';
                    badge.style.display = 'none';
                }
            }
            
            // Gọi hàm updateNotificationBadge từ notifications.js nếu có
            if (typeof window.updateNotificationBadge === 'function') {
                window.updateNotificationBadge(userId);
            }
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật badge:', error);
    }
}

/**
 * Khởi tạo WebSocket cho organizer
 * Gọi hàm này khi trang admin/organizer được load
 */
function initOrganizerWebSocket() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        console.warn('⚠️ Chưa đăng nhập, không thể kết nối WebSocket');
        return;
    }

    // Chỉ kết nối nếu user là organizer
    if (user.role === 'organizer' || user.role === 'manage') {
        const organizerId = user.user_id;
        console.log('🔌 Đang kết nối WebSocket cho organizer:', organizerId);
        
        connectWebSocket(organizerId, function(notification) {
            // Hiển thị thông báo toast
            showNotificationToast(notification);
            
            // Thêm vào notification list nếu có hàm addNotificationToList
            if (typeof addNotificationToList === 'function') {
                addNotificationToList(notification);
            }
            
            // Cập nhật badge
            updateNotificationBadge(organizerId);
            
            // Có thể thêm logic khác như reload danh sách sự kiện, v.v.
            // Ví dụ: reloadEventsList();
        });
    }
}

// Tự động kết nối khi trang được load (nếu đã có SockJS và Stomp)
function checkAndInitWebSocket() {
    // Kiểm tra lại sau khi DOM ready
    if (typeof SockJS !== 'undefined' && typeof Stomp !== 'undefined') {
        // Chờ một chút để đảm bảo các script khác đã load xong
        setTimeout(initOrganizerWebSocket, 500);
    } else {
        // Thử lại sau 500ms nếu chưa load
        setTimeout(checkAndInitWebSocket, 500);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra ngay lập tức
    if (typeof SockJS !== 'undefined' && typeof Stomp !== 'undefined') {
        setTimeout(initOrganizerWebSocket, 500);
    } else {
        // Nếu chưa có, đợi thêm
        console.log('⏳ Đang đợi SockJS/Stomp load...');
        checkAndInitWebSocket();
    }
});

    // Export các hàm cần thiết ra global scope
    window.connectWebSocket = connectWebSocket;
    window.disconnectWebSocket = disconnectWebSocket;
    window.initOrganizerWebSocket = initOrganizerWebSocket;
    window.updateNotificationBadge = updateNotificationBadge;
    
})(); // Đóng IIFE
