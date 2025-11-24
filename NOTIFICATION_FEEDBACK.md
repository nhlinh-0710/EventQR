# 🔔 Thông Báo Feedback - Tài Liệu Triển Khai

## 📋 Tổng Quan

Hệ thống thông báo đã được mở rộng để hỗ trợ:
1. ✅ **Organizer nhận thông báo** khi có user đánh giá sự kiện
2. ✅ **User nhận thông báo** khi organizer trả lời đánh giá của họ

---

## 🔧 Backend Changes

### 1. NotificationService - Thêm method mới

#### `sendFeedbackReplyNotificationToUser()`
- **Mô tả:** Gửi thông báo cho user khi organizer reply feedback
- **Topic WebSocket:** `/topic/user/{userId}`
- **Format notification:**
  ```json
  {
    "notificationId": 1,
    "userId": 10,
    "eventId": 12,
    "title": "Có phản hồi về đánh giá của bạn",
    "message": "Tổ chức viên đã phản hồi đánh giá của bạn về sự kiện \"Tech Innovation 2025\": \"Cảm ơn bạn đã tham gia!\"",
    "status": "unread",
    "createdAt": "2025-01-21T10:30:00",
    "type": "feedback_reply"
  }
  ```

#### `sendFeedbackNotificationToOrganizer()` - Đã có sẵn
- **Mô tả:** Gửi thông báo cho organizer khi có feedback mới
- **Topic WebSocket:** `/topic/organizer/{organizerId}`
- **Format notification:**
  ```json
  {
    "type": "feedback",
    "title": "Có đánh giá mới cho sự kiện",
    "message": "User Nguyễn Văn A vừa đánh giá sự kiện Tech Innovation 2025 với 5 sao"
  }
  ```

### 2. FeedbackService - Cập nhật

#### `submitFeedback()` - Đã có notification cho organizer ✅
- Gọi `notificationService.sendFeedbackNotificationToOrganizer()` khi tạo feedback mới

#### `replyFeedback()` - Thêm notification cho user ✅
- Gọi `notificationService.sendFeedbackReplyNotificationToUser()` khi organizer reply

---

## 🎨 Frontend Changes

### 1. WebSocket Client (`frontend/js/core/websocket.js`)

#### Cập nhật để hỗ trợ cả Organizer và User:
- `connectWebSocket(userId, userType, onNotificationReceived)`
  - `userType`: `'organizer'` hoặc `'user'`
  - Subscribe vào topic tương ứng: `/topic/organizer/{id}` hoặc `/topic/user/{id}`

- `initWebSocket()` - Khởi tạo WebSocket dựa trên role
  - Organizer: Subscribe vào `/topic/organizer/{id}`
  - User: Subscribe vào `/topic/user/{id}`
  - Có thể subscribe cả hai nếu user là organizer

### 2. Notification System (`frontend/js/core/notifications.js`) - File mới

- `initNotifications()` - Khởi tạo notification system
- `loadNotifications(userId)` - Load notifications từ API
- `renderNotifications()` - Render notifications vào panel
- `updateNotificationBadge(userId)` - Cập nhật badge số lượng
- `handleNotificationClick()` - Xử lý khi click notification
- `markAllNotificationsAsRead()` - Đánh dấu tất cả đã đọc
- `addNotificationToList()` - Thêm notification mới từ WebSocket

### 3. User Pages - Cập nhật HTML

#### Thêm Notification Panel vào:
- `frontend/pages/user/feedback.html` ✅
- Cần thêm vào các trang user khác:
  - `frontend/pages/user/index.html`
  - `frontend/pages/user/tickets.html`
  - `frontend/pages/user/profile.html`

#### Thêm Scripts:
```html
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@stomp/stompjs@7/bundles/stomp.umd.min.js"></script>
<script src="../../js/core/websocket.js"></script>
<script src="../../js/core/notifications.js"></script>
```

### 4. Feedback User Page - Auto Reload

- Tự động reload feedbacks list khi nhận notification về feedback reply
- Notification toast hiển thị khi có reply mới

---

## 🔄 Flow Hoạt Động

### 1. User đánh giá sự kiện → Organizer nhận thông báo

```
User submit feedback
    ↓
FeedbackService.submitFeedback()
    ↓
NotificationService.sendFeedbackNotificationToOrganizer()
    ↓
Lưu vào DB + Gửi WebSocket → /topic/organizer/{organizerId}
    ↓
Organizer nhận thông báo realtime
    ↓
Badge cập nhật + Toast hiển thị
```

### 2. Organizer trả lời feedback → User nhận thông báo

```
Organizer reply feedback
    ↓
FeedbackService.replyFeedback()
    ↓
NotificationService.sendFeedbackReplyNotificationToUser()
    ↓
Lưu vào DB + Gửi WebSocket → /topic/user/{userId}
    ↓
User nhận thông báo realtime
    ↓
Badge cập nhật + Toast hiển thị + Auto reload feedbacks list
```

---

## 🎯 WebSocket Topics

### Organizer Topics:
- `/topic/organizer/{organizerId}` - Nhận thông báo về:
  - User đăng ký sự kiện (type: "registration")
  - User đánh giá sự kiện (type: "feedback")

### User Topics:
- `/topic/user/{userId}` - Nhận thông báo về:
  - Organizer trả lời feedback (type: "feedback_reply")

---

## ✅ Checklist

- [x] Backend: Thêm method gửi notification cho user khi organizer reply
- [x] Backend: Gọi notification service trong replyFeedback()
- [x] Frontend: Cập nhật WebSocket để hỗ trợ user topics
- [x] Frontend: Tạo notifications.js chung cho user và admin
- [x] Frontend: Thêm notification panel vào user/feedback.html
- [ ] Frontend: Thêm notification panel vào các trang user khác
- [x] Frontend: Auto reload feedbacks khi nhận notification reply

---

**Hoàn thành! 🎉**

Organizer và User giờ đã có thể nhận thông báo realtime về feedback và phản hồi!

