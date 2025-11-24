/* ==========================================
   FEEDBACK PAGE INTERACTIONS
   ========================================== */
(function () {
    const root = document.getElementById("feedback-section");
    if (!root) return;

    const starsWrap = root.querySelector("#stars");
    const rateText = root.querySelector("#rate-text");
    const idea = root.querySelector("#idea");
    const nameInput = root.querySelector('input[type="text"]');
    const emailInput = root.querySelector('input[type="email"]');
    const submitBtn = root.querySelector("#submitBtn");
    const toast = root.querySelector("#toast");
    const eventSelect = root.querySelector("#eventSelectFeedback");
    const eventQuestion = root.querySelector("#eventQuestion");
    const selectedEventTitle = root.querySelector("#selectedEventTitle");
    const feedbackForm = root.querySelector("#feedbackForm");
    const noEventsMessage = root.querySelector("#noEventsMessage");

    // Map cảm xúc theo điểm
    const feelMap = {
        0: "Mời bạn đánh giá ⭐",
        1: "Tệ 😞",
        2: "Chưa tốt 😕",
        3: "Ổn 👍",
        4: "Tốt! 👏",
        5: "Tuyệt vời! 🎉"
    };

    let selected = 0;
    let selectedEventId = null;
    let completedEvents = [];

    // Helper: show toast
    function showToast(msg = "Cảm ơn bạn đã gửi phản hồi 💙", type = "success") {
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `toast ${type}`;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    // Render fill sao theo value
    function renderStars(value, hover = false) {
        const items = starsWrap.querySelectorAll(".fa-star");
        items.forEach((el) => {
            const v = Number(el.getAttribute("data-value") || "0");
            const filled = v <= value;
            el.classList.toggle("fa-solid", filled);
            el.classList.toggle("fa-regular", !filled);
            el.classList.toggle("is-filled", filled);
        });

        if (rateText) {
            rateText.textContent = feelMap[value || 0] || "";
            // Đổi màu cảm xúc theo điểm
            if (value <= 2) rateText.style.color = "#ef4444";
            else if (value === 3) rateText.style.color = "#10b981";
            else if (value >= 4) rateText.style.color = "#f59e0b";
            if (value === 5) rateText.style.color = "#f59e0b";
            if (value === 0) rateText.style.color = "var(--muted)";
        }
    }

    // Gắn sự kiện lên sao
    if (starsWrap) {
        starsWrap.addEventListener("mouseover", (e) => {
            const star = e.target.closest(".fa-star");
            if (!star) return;
            renderStars(Number(star.getAttribute("data-value") || "0"), true);
        });
        starsWrap.addEventListener("mouseout", () => {
            renderStars(selected);
        });
        starsWrap.addEventListener("click", (e) => {
            const star = e.target.closest(".fa-star");
            if (!star) return;
            selected = Number(star.getAttribute("data-value") || "0");
            renderStars(selected);
        });

        // Khởi tạo
        renderStars(selected);
    }

    // Load danh sách sự kiện đã kết thúc
    async function loadCompletedEvents() {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) {
            console.warn('⚠️ Chưa đăng nhập');
            showToast("Vui lòng đăng nhập để đánh giá sự kiện", "error");
            return;
        }

        console.log('🔍 Đang tải danh sách sự kiện đã kết thúc cho user:', user.user_id);

        try {
            const response = await fetch(`http://localhost:8080/api/feedback/completed-events/${user.user_id}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP Error:', response.status, errorText);
                throw new Error(`Không thể tải danh sách sự kiện (${response.status})`);
            }

            completedEvents = await response.json();
            console.log('📋 Completed events từ backend:', completedEvents);
            console.log('📊 Tổng số sự kiện đã kết thúc:', completedEvents.length);

            // Log chi tiết từng event
            completedEvents.forEach((event, index) => {
                console.log(`  ${index + 1}. Event ID: ${event.eventId}, Title: ${event.title}, Status: ${event.status}, EndTime: ${event.endTime}, HasFeedback: ${event.hasFeedback}`);
            });

            // Filter: chỉ hiển thị sự kiện chưa feedback
            const notFeedbackedEvents = completedEvents.filter(e => !e.hasFeedback);
            console.log('✅ Số sự kiện chưa feedback:', notFeedbackedEvents.length);

            if (notFeedbackedEvents.length === 0) {
                // Không có sự kiện nào để feedback
                console.warn('⚠️ Không có sự kiện nào để feedback');
                if (eventSelect) eventSelect.style.display = 'none';
                if (noEventsMessage) noEventsMessage.style.display = 'block';
                return;
            }

            // Populate dropdown
            if (eventSelect) {
                eventSelect.innerHTML = '<option value="">-- Chọn sự kiện --</option>';
                notFeedbackedEvents.forEach(event => {
                    const option = document.createElement('option');
                    option.value = event.eventId;
                    option.textContent = `${event.title} (${formatDate(event.endTime)})`;
                    if (event.hasFeedback) {
                        option.textContent += ' - Đã đánh giá';
                        option.disabled = true;
                    }
                    eventSelect.appendChild(option);
                });
                console.log('✅ Đã populate dropdown với', notFeedbackedEvents.length, 'sự kiện');
            }

        } catch (error) {
            console.error('❌ Lỗi load completed events:', error);
            showToast("Không thể tải danh sách sự kiện: " + error.message, "error");
        }
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    // Khi chọn sự kiện
    if (eventSelect) {
        eventSelect.addEventListener('change', (e) => {
            const eventId = e.target.value;
            
            if (!eventId) {
                // Reset form
                selectedEventId = null;
                selected = 0;
                renderStars(0);
                if (eventQuestion) eventQuestion.style.display = 'none';
                if (starsWrap) starsWrap.style.display = 'none';
                if (rateText) rateText.style.display = 'none';
                if (feedbackForm) feedbackForm.style.display = 'none';
                return;
            }

            // Tìm event
            const event = completedEvents.find(e => e.eventId == eventId);
            if (!event) return;

            selectedEventId = event.eventId;

            // Hiển thị form
            if (selectedEventTitle) selectedEventTitle.textContent = event.title;
            if (eventQuestion) eventQuestion.style.display = 'block';
            if (starsWrap) starsWrap.style.display = 'inline-flex';
            if (rateText) {
                rateText.style.display = 'block';
                rateText.textContent = feelMap[0];
            }
            if (feedbackForm) feedbackForm.style.display = 'block';

            // Reset rating
            selected = 0;
            renderStars(0);
        });
    }

    // Submit
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            // Validate
            if (!selectedEventId) {
                showToast("Vui lòng chọn sự kiện", "error");
                return;
            }

            if (selected === 0) {
                showToast("Bạn vui lòng chọn số sao đánh giá nhé!", "error");
                return;
            }

            const user = JSON.parse(localStorage.getItem("currentUser"));
            if (!user) {
                showToast("Vui lòng đăng nhập", "error");
                return;
            }

            // Build payload
            const payload = {
                eventId: selectedEventId,
                userId: user.user_id,
                rating: selected,
                comment: idea?.value?.trim() || ""
            };

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Đang gửi...";

                const response = await fetch('http://localhost:8080/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showToast("Cảm ơn bạn đã đánh giá! 💙", "success");
                    
                    // Reset form
                    selected = 0;
                    renderStars(0);
                    if (idea) idea.value = "";
                    if (nameInput) nameInput.value = "";
                    if (emailInput) emailInput.value = "";
                    if (eventSelect) eventSelect.value = "";
                    
                    // Ẩn form
                    if (eventQuestion) eventQuestion.style.display = 'none';
                    if (starsWrap) starsWrap.style.display = 'none';
                    if (rateText) rateText.style.display = 'none';
                    if (feedbackForm) feedbackForm.style.display = 'none';
                    
                    // Reload events (để cập nhật hasFeedback)
                    await loadCompletedEvents();
                } else {
                    showToast(data.message || "Gửi phản hồi thất bại", "error");
                }
            } catch (error) {
                console.error('❌ Lỗi submit feedback:', error);
                showToast("Không thể kết nối server", "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "GỬI PHẢN HỒI";
            }
        });
    }

    // A11y: Enter để gửi nếu đang focus submit
    submitBtn?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            submitBtn.click();
        }
    });

    // Load events khi page load
    document.addEventListener('DOMContentLoaded', () => {
        loadCompletedEvents();
    });
})();
