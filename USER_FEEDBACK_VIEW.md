# 👤 Tính Năng Xem Phản Hồi Organizer cho User

## 📋 Tổng Quan

User giờ đây có thể xem lại các feedback đã gửi và phản hồi của organizer (nếu có) ngay trên trang Feedback của họ.

---

## ✨ Tính Năng Mới

### 1. **Hiển thị Feedback của User**
- User có thể xem tất cả feedback đã gửi
- Hiển thị:
  - ⭐ Rating (số sao)
  - 📅 Ngày gửi
  - 🎯 Tên sự kiện
  - 💬 Comment đã gửi
  - 📩 Phản hồi của organizer (nếu có)

### 2. **Hiển thị Phản Hồi Organizer**
- Nếu organizer đã phản hồi:
  - ✅ Hiển thị trong box màu xanh đẹp mắt
  - 📅 Hiển thị ngày giờ phản hồi
  - 🏷️ Badge "Phản hồi từ tổ chức viên"
- Nếu chưa có phản hồi:
  - ⏳ Hiển thị "Đang chờ phản hồi từ tổ chức viên"

### 3. **Auto Reload**
- Sau khi submit feedback mới thành công, danh sách sẽ tự động reload
- Feedback mới sẽ xuất hiện ngay lập tức

---

## 🔌 API Endpoint

### GET `/api/feedback/user/{userId}`

**Mô tả:** Lấy tất cả feedback của một user

**Request:**
```http
GET /api/feedback/user/10
```

**Response (200 OK):**
```json
[
  {
    "feedbackId": 1,
    "eventId": 12,
    "eventTitle": "Tech Innovation 2025",
    "userId": 10,
    "userName": "Nguyễn Văn A",
    "rating": 5,
    "comment": "Sự kiện tổ chức rất tốt!",
    "organizerReply": "Cảm ơn bạn đã tham gia!",
    "organizerReplyAt": "2025-01-21T10:30:00",
    "createdAt": "2025-01-20T14:30:00"
  },
  {
    "feedbackId": 2,
    "eventId": 13,
    "eventTitle": "Web Development Workshop",
    "userId": 10,
    "userName": "Nguyễn Văn A",
    "rating": 4,
    "comment": "Nội dung hay",
    "organizerReply": null,
    "organizerReplyAt": null,
    "createdAt": "2025-01-19T09:15:00"
  }
]
```

---

## 🎨 UI Components

### 1. **User Feedback Item**
```
┌─────────────────────────────────────┐
│ ⭐⭐⭐⭐⭐          Hôm qua         │
│ Sự kiện: Tech Innovation 2025      │
│                                     │
│ "Sự kiện tổ chức rất tốt!"         │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 🔵 Phản hồi từ tổ chức viên │   │
│ │                             │   │
│ │ "Cảm ơn bạn đã tham gia!"   │   │
│ │                             │   │
│ │ 2 ngày trước                │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 2. **Waiting for Reply**
```
┌─────────────────────────────────────┐
│ ⭐⭐⭐⭐☆         3 ngày trước      │
│ Sự kiện: Web Development Workshop  │
│                                     │
│ "Nội dung hay"                      │
│                                     │
│ ⏰ Đang chờ phản hồi từ tổ chức viên│
└─────────────────────────────────────┘
```

---

## 📁 Files Đã Cập Nhật

### Backend
- ✅ **Đã có sẵn:** `GET /api/feedback/user/{userId}` endpoint
- ✅ **Đã có sẵn:** `FeedbackResponse` DTO với `organizerReply` và `organizerReplyAt`

### Frontend
1. **`frontend/pages/user/feedback.html`**
   - Cập nhật phần "Feedback gần đây" thành "Feedback của tôi"
   - Thêm container `#userFeedbacksList` để hiển thị feedbacks
   - Thêm placeholder cho empty state

2. **`frontend/js/user/feedback.js`**
   - Thêm function `loadUserFeedbacks()` để load feedbacks từ API
   - Thêm function `formatDateForDisplay()` để format ngày tháng
   - Auto reload sau khi submit feedback thành công

3. **`frontend/css/user/feedback.css`**
   - Thêm styles cho `.user-feedback-item`
   - Thêm styles cho `.organizer-reply-box`
   - Thêm styles cho `.waiting-reply`
   - Thêm scrollbar styling cho list

---

## 🔄 Flow Hoạt Động

1. **User vào trang Feedback**
   - Frontend gọi `GET /api/feedback/user/{userId}`
   - Hiển thị danh sách feedbacks với organizer replies

2. **User submit feedback mới**
   - Submit thành công
   - Frontend tự động reload danh sách feedbacks
   - Feedback mới xuất hiện ngay

3. **Organizer phản hồi feedback**
   - Organizer reply qua admin page
   - User refresh trang hoặc reload danh sách
   - Phản hồi của organizer hiển thị ngay

---

## 📝 Format Hiển Thị

### Ngày tháng
- "Hôm nay" - nếu là hôm nay
- "Hôm qua" - nếu là ngày hôm qua
- "X ngày trước" - nếu < 7 ngày
- Format date đầy đủ - nếu >= 7 ngày

### Rating Stars
- `★★★★★` - 5 sao
- `★★★★☆` - 4 sao
- `★★★☆☆` - 3 sao
- etc.

---

## ✅ Checklist

- [x] API endpoint đã có sẵn
- [x] Frontend load feedbacks từ API
- [x] Hiển thị organizer reply nếu có
- [x] Hiển thị "đang chờ" nếu chưa có reply
- [x] Auto reload sau khi submit
- [x] CSS styling đẹp mắt
- [x] Responsive design
- [x] Error handling

---

**Hoàn thành! 🎉**

User giờ có thể xem lại tất cả feedback và phản hồi từ organizer một cách dễ dàng!

