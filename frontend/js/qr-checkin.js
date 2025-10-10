// QR Check-in JavaScript
let qrScanner = null;
let currentQRData = null;

// Initialize QR Check-in when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupQRTabs();
    loadCheckinHistory();
    updateCheckinStats();
});

// Setup QR tabs functionality
function setupQRTabs() {
    const qrTabs = document.querySelectorAll('.qr-tab');
    const qrTabContents = document.querySelectorAll('.qr-tab-content');

    qrTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            qrTabs.forEach(t => t.classList.remove('active'));
            qrTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
            
            // Stop scanner if switching away from scan tab
            if (targetTab !== 'scan' && qrScanner) {
                stopQRScanner();
            }
        });
    });
}

// Generate QR Code
function generateQRCode() {
    const eventSelect = document.getElementById('eventSelect');
    const selectedValue = eventSelect.value;
    const selectedText = eventSelect.options[eventSelect.selectedIndex].text;
    
    if (!selectedValue) {
        showNotification('Vui lòng chọn sự kiện', 'error');
        return;
    }
    
    // Generate unique QR code data
    const qrData = {
        eventId: selectedValue,
        eventName: selectedText,
        timestamp: new Date().toISOString(),
        checkInId: generateId()
    };
    
    const qrString = JSON.stringify(qrData);
    
    // Clear previous QR code
    const qrCodeElement = document.getElementById('qrcode');
    qrCodeElement.innerHTML = '';
    
    try {
        // Sử dụng SimpleQRCode class
        if (typeof SimpleQRCode !== 'undefined') {
            SimpleQRCode.generate(qrString, qrCodeElement, { size: 200, useAPI: true });
        } else {
            // Fallback: Tạo QR code manual
            const qrDiv = document.createElement('div');
            qrDiv.style.cssText = `
                width: 200px;
                height: 200px;
                background: white;
                border: 3px solid #6366f1;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-family: monospace;
                font-size: 14px;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            `;
            
            qrDiv.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 10px;">📱</div>
                <div style="color: #6366f1; font-weight: bold;">QR CODE</div>
                <div style="color: #6b7280; font-size: 10px; margin-top: 5px;">ID: ${qrData.checkInId}</div>
            `;
            
            qrCodeElement.appendChild(qrDiv);
        }
        
        // Show QR display section
        document.getElementById('qrDisplay').style.display = 'block';
        
        // Update QR info
        document.getElementById('selectedEventName').textContent = selectedText;
        document.getElementById('qrCreatedDate').textContent = new Date().toLocaleDateString('vi-VN');
        document.getElementById('qrCodeValue').textContent = qrData.checkInId;
        
        // Store QR data for download/print
        currentQRData = qrData;
        
        showNotification('QR Code đã được tạo thành công!', 'success');
        
    } catch (error) {
        console.error('QR Code generation error:', error);
        showNotification('Lỗi tạo QR code: ' + error.message, 'error');
    }
}

// Download QR Code
function downloadQRCode() {
    if (!currentQRData) {
        showNotification('Chưa có QR code để tải xuống', 'error');
        return;
    }
    
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        showNotification('Không tìm thấy QR code', 'error');
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.download = `qr-checkin-${currentQRData.eventId}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('QR Code đã được tải xuống', 'success');
}

// Print QR Code
function printQRCode() {
    if (!currentQRData) {
        showNotification('Chưa có QR code để in', 'error');
        return;
    }
    
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        showNotification('Không tìm thấy QR code', 'error');
        return;
    }
    
    // Create print window
    const printWindow = window.open('', '_blank');
    const imageData = canvas.toDataURL();
    
    printWindow.document.write(`
        <html>
        <head>
            <title>QR Code Check-in - ${currentQRData.eventName}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 20px; 
                }
                .qr-print-container {
                    max-width: 400px;
                    margin: 0 auto;
                    border: 2px solid #6366f1;
                    border-radius: 10px;
                    padding: 20px;
                }
                .qr-image {
                    margin: 20px 0;
                }
                .event-info {
                    background: #f8fafc;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                }
                h1 { color: #6366f1; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <div class="qr-print-container">
                <h1>QR Code Check-in</h1>
                <div class="qr-image">
                    <img src="${imageData}" alt="QR Code" style="max-width: 200px;">
                </div>
                <div class="event-info">
                    <p><strong>Sự kiện:</strong> ${currentQRData.eventName}</p>
                    <p><strong>Ngày tạo:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
                    <p><strong>Mã check-in:</strong> ${currentQRData.checkInId}</p>
                </div>
                <p><em>Vui lòng quét QR code này để check-in sự kiện</em></p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for image to load then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
    
    showNotification('Đang chuẩn bị in QR Code...', 'info');
}

// Start QR Scanner
async function startQRScanner() {
    try {
        const video = document.getElementById('qrVideo');
        const startBtn = document.getElementById('startScanBtn');
        const stopBtn = document.getElementById('stopScanBtn');
        
        // Check if browser supports camera
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showNotification('Trình duyệt không hỗ trợ camera', 'error');
            return;
        }
        
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Use back camera if available
        });
        
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();
        
        // Update button states
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-flex';
        
        // Initialize QR scanner (using a simple approach)
        scanQRFromVideo(video);
        
        showNotification('Máy quét QR đã được khởi động', 'success');
        
    } catch (error) {
        console.error('Camera access error:', error);
        showNotification('Không thể truy cập camera. Vui lòng cho phép quyền camera.', 'error');
    }
}

// Stop QR Scanner
function stopQRScanner() {
    const video = document.getElementById('qrVideo');
    const startBtn = document.getElementById('startScanBtn');
    const stopBtn = document.getElementById('stopScanBtn');
    
    // Stop video stream
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    
    video.style.display = 'none';
    
    // Update button states
    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    
    // Clear scanner
    if (qrScanner) {
        clearInterval(qrScanner);
        qrScanner = null;
    }
    
    showNotification('Máy quét QR đã được dừng', 'info');
}

// Scan QR from video (simplified version)
function scanQRFromVideo(video) {
    // This is a simplified implementation
    // In a real application, you would use a proper QR scanning library
    qrScanner = setInterval(() => {
        // Simulate QR detection (for demo purposes)
        if (Math.random() < 0.1) { // 10% chance per second
            const mockQRData = {
                eventId: 'event1',
                eventName: 'Hội thảo Công nghệ AI - 15 Sep 2025',
                timestamp: new Date().toISOString(),
                checkInId: 'CHK' + Date.now()
            };
            
            processQRData(JSON.stringify(mockQRData));
            stopQRScanner();
        }
    }, 1000);
}

// Process Manual QR Code
function processManualQRCode() {
    const manualCode = document.getElementById('manualQRCode').value.trim();
    
    if (!manualCode) {
        showNotification('Vui lòng nhập mã QR', 'error');
        return;
    }
    
    // Try to process as JSON or treat as simple string
    let qrData;
    try {
        qrData = JSON.parse(manualCode);
    } catch (e) {
        // If not JSON, create a simple QR data object
        qrData = {
            eventId: 'event1',
            eventName: 'Hội thảo Công nghệ AI - 15 Sep 2025',
            checkInId: manualCode,
            timestamp: new Date().toISOString()
        };
    }
    
    processQRData(JSON.stringify(qrData));
}

// Process QR Data
function processQRData(qrString) {
    try {
        const qrData = JSON.parse(qrString);
        
        // Validate QR data
        if (!qrData.eventId || !qrData.checkInId) {
            showNotification('QR code không hợp lệ', 'error');
            return;
        }
        
        // Show scan result
        const scanResult = document.getElementById('qrScanResult');
        scanResult.innerHTML = `
            <div class="scan-success">
                <i class="fas fa-check-circle" style="color: #10b981; font-size: 2rem; margin-bottom: 10px;"></i>
                <p><strong>QR Code hợp lệ!</strong></p>
                <p>Sự kiện: ${qrData.eventName || 'Không xác định'}</p>
                <p>Mã: ${qrData.checkInId}</p>
            </div>
        `;
        scanResult.style.display = 'block';
        
        // Show check-in form
        showCheckinForm(qrData);
        
        showNotification('QR Code đã được quét thành công!', 'success');
        
    } catch (error) {
        console.error('QR processing error:', error);
        showNotification('QR code không đúng định dạng', 'error');
    }
}

// Show Check-in Form
function showCheckinForm(qrData) {
    const checkinForm = document.getElementById('checkinForm');
    
    // Update event info
    document.getElementById('checkinEventName').textContent = qrData.eventName || 'Không xác định';
    document.getElementById('checkinTime').textContent = new Date().toLocaleString('vi-VN');
    
    // Store QR data for confirmation
    checkinForm.dataset.qrData = JSON.stringify(qrData);
    
    // Show form
    checkinForm.style.display = 'block';
    
    // Scroll to form
    checkinForm.scrollIntoView({ behavior: 'smooth' });
}

// Confirm Check-in
function confirmCheckin() {
    const checkinForm = document.getElementById('checkinForm');
    const qrData = JSON.parse(checkinForm.dataset.qrData || '{}');
    
    // Get participant info
    const participantName = document.getElementById('participantName').value.trim();
    const participantEmail = document.getElementById('participantEmail').value.trim();
    const participantPhone = document.getElementById('participantPhone').value.trim();
    
    // Validation
    if (!participantName || !participantEmail) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }
    
    if (!isValidEmail(participantEmail)) {
        showNotification('Email không hợp lệ', 'error');
        return;
    }
    
    // Create check-in record
    const checkinRecord = {
        id: generateId(),
        qrData: qrData,
        participant: {
            name: participantName,
            email: participantEmail,
            phone: participantPhone
        },
        checkinTime: new Date().toISOString(),
        status: 'success'
    };
    
    // Store check-in record
    storeCheckinRecord(checkinRecord);
    
    showNotification('Check-in thành công!', 'success');
    
    // Reset form
    cancelCheckin();
    
    // Update stats and history
    updateCheckinStats();
    addCheckinToHistory(checkinRecord);
}

// Cancel Check-in
function cancelCheckin() {
    const checkinForm = document.getElementById('checkinForm');
    
    // Hide form
    checkinForm.style.display = 'none';
    
    // Clear form data
    document.getElementById('participantName').value = '';
    document.getElementById('participantEmail').value = '';
    document.getElementById('participantPhone').value = '';
    
    // Clear QR scan result
    document.getElementById('qrScanResult').style.display = 'none';
    
    // Clear manual input
    document.getElementById('manualQRCode').value = '';
}

// Store Check-in Record
function storeCheckinRecord(record) {
    let checkinHistory = JSON.parse(localStorage.getItem('checkinHistory') || '[]');
    checkinHistory.unshift(record); // Add to beginning
    
    // Keep only last 100 records
    if (checkinHistory.length > 100) {
        checkinHistory = checkinHistory.slice(0, 100);
    }
    
    localStorage.setItem('checkinHistory', JSON.stringify(checkinHistory));
}

// Load Check-in History
function loadCheckinHistory() {
    const checkinHistory = JSON.parse(localStorage.getItem('checkinHistory') || '[]');
    const tableBody = document.getElementById('checkinTableBody');
    
    // Clear existing rows (except sample data for demo)
    // In a real application, you would clear all and load from database
    
    // Add stored records
    checkinHistory.forEach(record => {
        addCheckinToHistory(record, false); // false = don't scroll
    });
}

// Add Check-in to History Table
function addCheckinToHistory(record, scrollToTop = true) {
    const tableBody = document.getElementById('checkinTableBody');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${record.participant.name}</td>
        <td>${record.participant.email}</td>
        <td>${record.qrData.eventName || 'Không xác định'}</td>
        <td>${new Date(record.checkinTime).toLocaleString('vi-VN')}</td>
        <td><span class="status-badge ${record.status}">${getStatusText(record.status)}</span></td>
        <td>
            <button class="btn btn-sm btn-outline" onclick="viewCheckinDetails('${record.id}')">Chi tiết</button>
        </td>
    `;
    
    // Add to top of table
    if (scrollToTop) {
        tableBody.insertBefore(row, tableBody.firstChild);
        
        // Scroll to top of table
        setTimeout(() => {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } else {
        tableBody.appendChild(row);
    }
}

// Get Status Text
function getStatusText(status) {
    switch (status) {
        case 'success': return 'Đã check-in';
        case 'pending': return 'Đang xử lý';
        case 'failed': return 'Thất bại';
        default: return 'Không xác định';
    }
}

// Update Check-in Stats
function updateCheckinStats() {
    const checkinHistory = JSON.parse(localStorage.getItem('checkinHistory') || '[]');
    
    // Total check-ins
    const totalCheckins = checkinHistory.length + 2; // +2 for sample data
    document.getElementById('totalCheckins').textContent = totalCheckins;
    
    // Today's check-ins
    const today = new Date().toDateString();
    const todayCheckins = checkinHistory.filter(record => 
        new Date(record.checkinTime).toDateString() === today
    ).length;
    document.getElementById('todayCheckins').textContent = todayCheckins;
    
    // Active events (mock data)
    document.getElementById('activeEvents').textContent = '3';
}

// Filter Check-in History
function filterCheckinHistory() {
    const eventFilter = document.getElementById('historyEventFilter').value;
    const dateFilter = document.getElementById('historyDateFilter').value;
    
    // This would implement actual filtering logic
    // For now, just show a notification
    let filterText = 'Lọc theo: ';
    if (eventFilter) filterText += `Sự kiện (${eventFilter}) `;
    if (dateFilter) filterText += `Ngày (${dateFilter}) `;
    
    showNotification(filterText || 'Hiển thị tất cả bản ghi', 'info');
}

// View Check-in Details
function viewCheckinDetails(recordId) {
    const checkinHistory = JSON.parse(localStorage.getItem('checkinHistory') || '[]');
    const record = checkinHistory.find(r => r.id === recordId);
    
    if (!record) {
        showNotification('Không tìm thấy bản ghi', 'error');
        return;
    }
    
    // Show details in a modal or alert (simplified)
    const details = `
Chi tiết Check-in:

Tên: ${record.participant.name}
Email: ${record.participant.email}
Số điện thoại: ${record.participant.phone || 'Không có'}
Sự kiện: ${record.qrData.eventName}
Thời gian: ${new Date(record.checkinTime).toLocaleString('vi-VN')}
Mã QR: ${record.qrData.checkInId}
Trạng thái: ${getStatusText(record.status)}
    `;
    
    alert(details);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Notification function (reuse from main.js)
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
