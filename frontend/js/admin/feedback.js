/* =========================================================
   ADMIN FEEDBACK PAGE JS — LOAD FEEDBACK TỪ API
   ========================================================= */

// Tránh duplicate declaration
if (typeof window.FEEDBACK_API_BASE_URL === 'undefined') {
    window.FEEDBACK_API_BASE_URL = 'http://localhost:8080/api/feedback';
}
const API_BASE_URL = window.FEEDBACK_API_BASE_URL;

// Lấy organizerId từ localStorage
function getCurrentOrganizerId() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        console.error('Chưa đăng nhập!');
        return null;
    }
    return user.user_id;
}

// Format date
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} · ${hours}:${minutes}`;
}

// Tạo rating stars HTML
function createRatingStars(rating) {
    if (!rating || rating < 1 || rating > 5) return '—';
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return `<span class="af-rating">${fullStars}${emptyStars}</span>`;
}

// Tính toán thống kê
function calculateStats(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) {
        return {
            averageRating: 0,
            totalFeedback: 0,
            todayFeedback: 0,
            fiveStarCount: 0,
            fiveStarPercentage: 0
        };
    }

    const totalRating = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
    const averageRating = (totalRating / feedbacks.length).toFixed(1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFeedback = feedbacks.filter(f => {
        const feedbackDate = new Date(f.createdAt);
        feedbackDate.setHours(0, 0, 0, 0);
        return feedbackDate.getTime() === today.getTime();
    }).length;

    const fiveStarCount = feedbacks.filter(f => f.rating === 5).length;
    const fiveStarPercentage = Math.round((fiveStarCount / feedbacks.length) * 100);

    return {
        averageRating,
        totalFeedback: feedbacks.length,
        todayFeedback,
        fiveStarCount,
        fiveStarPercentage
    };
}

// Populate event filter dropdown
async function populateEventFilter(feedbacks = []) {
    const eventFilter = document.querySelectorAll(".af-select")[0];
    if (!eventFilter) {
        console.warn('⚠️ Không tìm thấy event filter dropdown');
        return;
    }

    try {
        // Lấy danh sách sự kiện từ feedback
        const eventsFromFeedback = [...new Set(feedbacks.map(f => f.eventTitle).filter(Boolean))];
        
        // Nếu không có event từ feedback, lấy từ API events của organizer
        if (eventsFromFeedback.length === 0) {
            const organizerId = getCurrentOrganizerId();
            if (organizerId) {
                try {
                    const eventsResponse = await fetch(`http://localhost:8080/api/events/my-events?organizerId=${organizerId}`);
                    if (eventsResponse.ok) {
                        const events = await eventsResponse.json();
                        if (Array.isArray(events) && events.length > 0) {
                            eventsFromFeedback.push(...events.map(e => e.title).filter(Boolean));
                        }
                    }
                } catch (err) {
                    console.warn('⚠️ Không thể load danh sách sự kiện:', err);
                }
            }
        }

        // Populate dropdown
        eventFilter.innerHTML = '<option value="">Tất cả sự kiện</option>' + 
            eventsFromFeedback.map(event => `<option value="${event}">${event}</option>`).join('');
        
        console.log('✅ Đã populate event filter với', eventsFromFeedback.length, 'sự kiện');
    } catch (error) {
        console.error('❌ Lỗi populate event filter:', error);
        // Vẫn giữ option mặc định
        eventFilter.innerHTML = '<option value="">Tất cả sự kiện</option>';
    }
}

// Load feedback từ API
async function loadFeedbacks() {
    const organizerId = getCurrentOrganizerId();
    if (!organizerId) {
        console.error('❌ Không có organizerId');
        return;
    }

    const feedbackGroups = document.getElementById('af-feedback-groups');
    const summaryCards = document.querySelectorAll(".af-card");
    
    // Hiển thị loading
    if (feedbackGroups) {
        feedbackGroups.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #3b82f6;"></i><p style="margin-top: 16px; color: #64748b;">Đang tải dữ liệu...</p></div>';
    }

    try {
        const url = `${API_BASE_URL}/organizer/${organizerId}`;
        console.log('🔗 Đang gọi API:', url);
        
        const response = await fetch(url);
        console.log('📥 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            // Thử lấy error message từ response
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.text();
                if (errorData) {
                    errorMessage += ` - ${errorData}`;
                }
            } catch (e) {
                // Ignore
            }
            throw new Error(errorMessage);
        }

        const feedbacks = await response.json();
        console.log('📋 Feedback data:', feedbacks);
        
        // Store for filtering
        allFeedbacksData = feedbacks;

        // Cập nhật thống kê
        const stats = calculateStats(feedbacks);
        if (summaryCards.length >= 3) {
            summaryCards[0].querySelector('h3').textContent = stats.averageRating;
            summaryCards[0].querySelector('span').textContent = `Trên ${stats.totalFeedback} feedback`;
            summaryCards[1].querySelector('h3').textContent = stats.todayFeedback;
            summaryCards[1].querySelector('span').textContent = 'So với hôm qua: —';
            summaryCards[2].querySelector('h3').textContent = `${stats.fiveStarPercentage}%`;
            summaryCards[2].querySelector('span').textContent = `${stats.fiveStarCount} feedback 5 sao`;
        }

        // Render feedback grouped by event
        renderFeedbackGroups(feedbacks);

        // Populate event filter từ feedback data
        await populateEventFilter(feedbacks);

    } catch (error) {
        console.error('❌ Lỗi load feedback:', error);
        const feedbackGroups = document.getElementById('af-feedback-groups');
        const emptyState = document.getElementById('af-empty-state');
        
        if (feedbackGroups) {
            feedbackGroups.innerHTML = `
                <div class="af-error-state">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444; margin-bottom: 16px;"></i>
                    <p style="color: #ef4444; font-size: 16px; font-weight: 600;">Lỗi khi tải dữ liệu</p>
                    <p style="color: #64748b; font-size: 14px; margin-top: 8px;">${error.message}</p>
                </div>
            `;
        }
        
        // Vẫn populate event filter ngay cả khi có lỗi
        await populateEventFilter([]);
    }
}

// Store grouped feedbacks for lookup
let groupedFeedbacksData = {};

// Render feedback grouped by event
function renderFeedbackGroups(feedbacks) {
    const feedbackGroups = document.getElementById('af-feedback-groups');
    const emptyState = document.getElementById('af-empty-state');
    
    if (!feedbackGroups) return;
    
    if (feedbacks.length === 0) {
        feedbackGroups.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    feedbackGroups.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    // Group feedback by event
    groupedFeedbacksData = {};
    feedbacks.forEach(feedback => {
        const eventTitle = feedback.eventTitle || 'Sự kiện không xác định';
        if (!groupedFeedbacksData[eventTitle]) {
            groupedFeedbacksData[eventTitle] = [];
        }
        groupedFeedbacksData[eventTitle].push(feedback);
    });
    
    // Calculate stats for each event
    const eventStats = {};
    Object.keys(groupedFeedbacksData).forEach(eventTitle => {
        const eventFeedbacks = groupedFeedbacksData[eventTitle];
        const totalRating = eventFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
        const avgRating = (totalRating / eventFeedbacks.length).toFixed(1);
        const fiveStarCount = eventFeedbacks.filter(f => f.rating === 5).length;
        
        eventStats[eventTitle] = {
            total: eventFeedbacks.length,
            avgRating: avgRating,
            fiveStarCount: fiveStarCount,
            fiveStarPercentage: Math.round((fiveStarCount / eventFeedbacks.length) * 100)
        };
    });
    
    // Render groups
    feedbackGroups.innerHTML = Object.keys(groupedFeedbacksData).map(eventTitle => {
        const eventFeedbacks = groupedFeedbacksData[eventTitle];
        const stats = eventStats[eventTitle];
        
        return `
            <div class="af-event-group" data-event-title="${eventTitle}">
                <div class="af-event-header" onclick="toggleEventGroup(this)">
                    <div class="af-event-info">
                        <h4 class="af-event-title">${eventTitle}</h4>
                        <div class="af-event-stats">
                            <span class="af-stat-item">
                                <i class="fas fa-comments"></i> ${stats.total} feedback
                            </span>
                            <span class="af-stat-item">
                                <i class="fas fa-star"></i> ${stats.avgRating}/5
                            </span>
                            <span class="af-stat-item">
                                <i class="fas fa-star" style="color: #fbbf24;"></i> ${stats.fiveStarPercentage}% 5 sao
                            </span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-down af-chevron"></i>
                </div>
                <div class="af-event-feedbacks">
                    ${eventFeedbacks.map((feedback, index) => `
                        <div class="af-feedback-item ${feedback.organizerReply ? 'af-has-reply' : ''}" 
                             data-feedback-id="${feedback.feedbackId}"
                             data-feedback-index="${index}"
                             data-event-title="${eventTitle}"
                             onclick="selectFeedback(this)">
                            <div class="af-feedback-header">
                                <div class="af-feedback-user">
                                    <strong>${feedback.userName || 'Khách ẩn danh'}</strong>
                                    <span class="af-feedback-rating">${createRatingStars(feedback.rating)}</span>
                                    ${feedback.organizerReply ? '<span class="af-reply-badge" title="Đã phản hồi"><i class="fas fa-check-circle"></i></span>' : ''}
                                </div>
                                <span class="af-feedback-time">${formatDateTime(feedback.createdAt)}</span>
                            </div>
                            <div class="af-feedback-content">
                                ${feedback.comment || '<em style="color: #94a3b8;">Không có bình luận</em>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Expand first group by default
    const firstGroup = feedbackGroups.querySelector('.af-event-group');
    if (firstGroup) {
        const feedbacksDiv = firstGroup.querySelector('.af-event-feedbacks');
        const header = firstGroup.querySelector('.af-event-header');
        if (feedbacksDiv && header) {
            feedbacksDiv.style.display = 'block';
            header.querySelector('.af-chevron').classList.add('af-chevron-up');
            
            // Select first feedback
            const firstFeedback = feedbacksDiv.querySelector('.af-feedback-item');
            if (firstFeedback) {
                setTimeout(() => firstFeedback.click(), 100);
            }
        }
    }
}

// Toggle event group
window.toggleEventGroup = function(header) {
    const group = header.closest('.af-event-group');
    const feedbacks = group.querySelector('.af-event-feedbacks');
    const chevron = header.querySelector('.af-chevron');
    
    if (feedbacks.style.display === 'none') {
        feedbacks.style.display = 'block';
        chevron.classList.add('af-chevron-up');
    } else {
        feedbacks.style.display = 'none';
        chevron.classList.remove('af-chevron-up');
    }
};

// Store current selected feedback
let currentSelectedFeedback = null;

// Select feedback
window.selectFeedback = function(element) {
    // Remove previous selection
    document.querySelectorAll('.af-feedback-item').forEach(item => {
        item.classList.remove('af-feedback-selected');
    });
    
    // Add selection to current
    element.classList.add('af-feedback-selected');
    
    // Get feedback data
    const feedbackId = element.getAttribute('data-feedback-id');
    const eventTitle = element.getAttribute('data-event-title');
    const index = parseInt(element.getAttribute('data-feedback-index'));
    
    // Find feedback from stored data
    let feedback = null;
    if (groupedFeedbacksData[eventTitle] && groupedFeedbacksData[eventTitle][index]) {
        feedback = groupedFeedbacksData[eventTitle][index];
    } else {
        // Fallback: search in allFeedbacksData
        feedback = allFeedbacksData.find(f => f.feedbackId == feedbackId);
    }
    
    if (!feedback) {
        console.error('Không tìm thấy feedback data');
        return;
    }
    
    // Store current feedback
    currentSelectedFeedback = feedback;
    
    // Update side panel
    const sideContent = document.getElementById('af-side-content');
    const sideDetails = document.getElementById('af-side-details');
    const sidePlaceholder = sideContent?.querySelector('.af-side-placeholder');
    
    if (sidePlaceholder) sidePlaceholder.style.display = 'none';
    if (sideDetails) sideDetails.style.display = 'block';
    
    document.getElementById('side-event-name').textContent = feedback.eventTitle || 'N/A';
    document.getElementById('side-user-name').innerHTML = `${feedback.userName || 'Khách ẩn danh'} · <span id="side-rating">${createRatingStars(feedback.rating)}</span>`;
    document.getElementById('side-time').textContent = `Gửi lúc ${formatDateTime(feedback.createdAt)}`;
    document.getElementById('side-content').textContent = feedback.comment || '(Không có bình luận)';
    
    // Update reply section
    updateReplySection(feedback);
};

// Update reply section
function updateReplySection(feedback) {
    const replyDisplay = document.getElementById('af-reply-display');
    const replyForm = document.getElementById('af-reply-form');
    const replyInput = document.getElementById('af-reply-input');
    const cancelBtn = document.getElementById('af-reply-cancel');
    
    if (feedback.organizerReply) {
        // Đã có reply, hiển thị reply
        replyDisplay.style.display = 'block';
        replyForm.style.display = 'none';
        document.getElementById('af-reply-text').textContent = feedback.organizerReply;
        document.getElementById('af-reply-time').textContent = `Phản hồi lúc ${formatDateTime(feedback.organizerReplyAt)}`;
    } else {
        // Chưa có reply, hiển thị form
        replyDisplay.style.display = 'none';
        replyForm.style.display = 'block';
        if (replyInput) replyInput.value = '';
        if (cancelBtn) cancelBtn.style.display = 'none';
    }
}

// Edit reply
window.editReply = function() {
    const replyDisplay = document.getElementById('af-reply-display');
    const replyForm = document.getElementById('af-reply-form');
    const replyInput = document.getElementById('af-reply-input');
    const cancelBtn = document.getElementById('af-reply-cancel');
    
    if (currentSelectedFeedback && currentSelectedFeedback.organizerReply) {
        replyInput.value = currentSelectedFeedback.organizerReply;
    }
    
    replyDisplay.style.display = 'none';
    replyForm.style.display = 'block';
    if (cancelBtn) cancelBtn.style.display = 'inline-block';
    replyInput.focus();
};

// Cancel reply
window.cancelReply = function() {
    const replyDisplay = document.getElementById('af-reply-display');
    const replyForm = document.getElementById('af-reply-form');
    const replyInput = document.getElementById('af-reply-input');
    const cancelBtn = document.getElementById('af-reply-cancel');
    
    if (currentSelectedFeedback && currentSelectedFeedback.organizerReply) {
        // Có reply cũ, hiển thị lại
        replyDisplay.style.display = 'block';
        replyForm.style.display = 'none';
    } else {
        // Chưa có reply, ẩn form
        replyForm.style.display = 'none';
    }
    
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (replyInput) replyInput.value = '';
};

// Submit reply
window.submitReply = async function() {
    if (!currentSelectedFeedback) {
        alert('Vui lòng chọn feedback để phản hồi');
        return;
    }
    
    const replyInput = document.getElementById('af-reply-input');
    const replyText = replyInput?.value?.trim();
    
    if (!replyText) {
        alert('Vui lòng nhập nội dung phản hồi');
        return;
    }
    
    const organizerId = getCurrentOrganizerId();
    if (!organizerId) {
        alert('Vui lòng đăng nhập');
        return;
    }
    
    const submitBtn = document.querySelector('.af-reply-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        
        const response = await fetch(`${API_BASE_URL}/${currentSelectedFeedback.feedbackId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                organizerId: organizerId,
                reply: replyText
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Cập nhật feedback trong data
            currentSelectedFeedback.organizerReply = replyText;
            currentSelectedFeedback.organizerReplyAt = data.feedback.organizerReplyAt;
            
            // Cập nhật trong allFeedbacksData
            const index = allFeedbacksData.findIndex(f => f.feedbackId === currentSelectedFeedback.feedbackId);
            if (index !== -1) {
                allFeedbacksData[index].organizerReply = replyText;
                allFeedbacksData[index].organizerReplyAt = data.feedback.organizerReplyAt;
            }
            
            // Cập nhật UI
            updateReplySection(currentSelectedFeedback);
            
            // Show success message
            showToast('Đã gửi phản hồi thành công!', 'success');
        } else {
            throw new Error(data.message || 'Không thể gửi phản hồi');
        }
    } catch (error) {
        console.error('❌ Lỗi gửi reply:', error);
        alert('Lỗi: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
};

// Show toast
function showToast(message, type = 'success') {
    // Tạo toast element nếu chưa có
    let toast = document.getElementById('af-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'af-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 3000);
}

// Store all feedbacks for filtering
let allFeedbacksData = [];

// ====== HÀM FILTER ======
    function applyFilters() {
    const selects = document.querySelectorAll(".af-select");
    const searchInput = document.querySelector(".af-search input");

    const eventFilter = selects[0];
    const ratingFilter = selects[1];

        const eventValue = eventFilter ? eventFilter.value : "";
        const ratingValue = ratingFilter ? ratingFilter.value : "";
        const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // Filter feedbacks
    let filteredFeedbacks = allFeedbacksData.filter(feedback => {
        // Filter by event
            if (eventValue && eventValue !== "Tất cả sự kiện") {
            if (feedback.eventTitle !== eventValue) return false;
            }

        // Filter by rating
            if (ratingValue && ratingValue !== "") {
            const rating = feedback.rating || 0;
            if (ratingValue === "5 sao" && rating !== 5) return false;
            if (ratingValue === "4 sao" && rating !== 4) return false;
            if (ratingValue === "3 sao" && rating !== 3) return false;
            if ((ratingValue === "1–2 sao" || ratingValue === "1-2 sao") && rating > 2) return false;
        }

        // Filter by keyword
            if (keyword) {
            const userName = (feedback.userName || '').toLowerCase();
            const eventName = (feedback.eventTitle || '').toLowerCase();
            const content = (feedback.comment || '').toLowerCase();
            
            if (!userName.includes(keyword) && 
                !eventName.includes(keyword) && 
                !content.includes(keyword)) {
                return false;
            }
        }

        return true;
    });

    // Re-render with filtered data
    renderFeedbackGroups(filteredFeedbacks);
    
    // Update selected event pill
    const selectedEventPill = document.getElementById('af-selected-event');
    if (eventValue && eventValue !== "Tất cả sự kiện" && selectedEventPill) {
        selectedEventPill.textContent = eventValue;
        selectedEventPill.style.display = 'inline-block';
    } else if (selectedEventPill) {
        selectedEventPill.style.display = 'none';
    }
}

// ====== INIT KHI PAGE LOAD ======
document.addEventListener("DOMContentLoaded", () => {
    console.log("Admin Feedback JS loaded");

    // Load feedback từ API
    loadFeedbacks();

    // Gắn event cho filter + search
    const selects = document.querySelectorAll(".af-select");
    const searchInput = document.querySelector(".af-search input");

    if (selects[0]) {
        selects[0].addEventListener("change", applyFilters);
    }
    if (selects[1]) {
        selects[1].addEventListener("change", applyFilters);
    }
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }
});
