# 📝 Tài Liệu Triển Khai Tính Năng Feedback/Đánh Giá Sự Kiện

## 📋 Tổng Quan

Hệ thống Feedback/Đánh giá sự kiện đã được triển khai đầy đủ với các tính năng:
- ✅ Đánh giá sự kiện chỉ khi status = "ENDED" hoặc "FINISHED"
- ✅ Kiểm tra user đã tham gia sự kiện (event_ticket hoặc checkin_history)
- ✅ Chặn đánh giá trùng lặp (unique constraint)
- ✅ Cho phép cập nhật đánh giá trong vòng 24h
- ✅ Chặn organizer đánh giá sự kiện của chính họ
- ✅ Gửi notification realtime cho organizer khi có feedback mới

---

## 🗄️ Database Schema

### Bảng `feedbacks`

```sql
CREATE TABLE `feedbacks` (
  `feedback_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `event_id` BIGINT(20) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `rating` TINYINT(4) DEFAULT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT DEFAULT NULL,
  `organizer_reply` TEXT DEFAULT NULL,
  `organizer_reply_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`event_id`) REFERENCES `event`(`event_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `account`(`user_id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_event_user_feedback` (`event_id`, `user_id`),
  
  INDEX `idx_event_id` (`event_id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Lưu ý:**
- ✅ Unique constraint `(event_id, user_id)` đảm bảo mỗi user chỉ đánh giá 1 lần
- ✅ CHECK constraint đảm bảo rating từ 1-5
- ✅ Foreign keys với ON DELETE CASCADE

---

## 🔌 API Endpoints

### 1. POST /api/event/{eventId}/feedback

**Mô tả:** Submit feedback cho sự kiện

**Request:**
```http
POST /api/event/12/feedback
Content-Type: application/json

{
  "userId": 10,
  "rating": 5,
  "comment": "Sự kiện tổ chức rất tốt!"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Cảm ơn bạn đã đánh giá!",
  "feedback": {
    "feedbackId": 1,
    "eventId": 12,
    "eventTitle": "Tech Innovation 2025",
    "userId": 10,
    "userName": "Nguyễn Văn A",
    "rating": 5,
    "comment": "Sự kiện tổ chức rất tốt!",
    "organizerReply": null,
    "organizerReplyAt": null,
    "createdAt": "2025-01-20T14:30:00"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Thiếu thông tin userId"
}
```

**Response Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "Sự kiện chưa kết thúc, không thể đánh giá. (Trạng thái hiện tại: ONGOING)"
}
```

```json
{
  "success": false,
  "message": "Bạn không thể đánh giá sự kiện do chính mình tổ chức!"
}
```

```json
{
  "success": false,
  "message": "Bạn chưa tham gia sự kiện này! Vui lòng đăng ký và tham gia trước khi đánh giá."
}
```

```json
{
  "success": false,
  "message": "Bạn đã đánh giá sự kiện này rồi. Chỉ có thể cập nhật trong vòng 24 giờ sau khi đánh giá!"
}
```

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Sự kiện không tồn tại"
}
```

---

### 2. GET /api/organizer/{id}/feedback

**Mô tả:** Lấy danh sách feedback của organizer

**Request:**
```http
GET /api/organizer/5/feedback
```

**Response Success (200 OK):**
```json
[
  {
    "eventId": 12,
    "eventName": "Tech Innovation 2025",
    "userName": "Nguyễn Văn A",
    "rating": 5,
    "comment": "Hay!",
    "time": "2025-11-20 14:22"
  },
  {
    "eventId": 13,
    "eventName": "Web Development Workshop",
    "userName": "Trần Thị B",
    "rating": 4,
    "comment": "Nội dung hay, nhưng thời gian hơi ngắn",
    "time": "2025-11-19 10:15"
  }
]
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Lỗi khi lấy danh sách feedback"
}
```

---

## 🔒 Business Logic

### 1. Điều kiện đánh giá

✅ **Sự kiện phải có status = "ENDED" hoặc "FINISHED"**
```java
String upperStatus = eventStatus.toUpperCase().trim();
boolean isEnded = "ENDED".equals(upperStatus) || "FINISHED".equals(upperStatus);
```

✅ **User phải đã tham gia sự kiện**
- Kiểm tra có ticket trong `event_ticket` (đã đăng ký)
- Hoặc có checkin trong `checkin_history` (đã tham gia)

✅ **User chỉ được đánh giá 1 lần**
- Unique constraint `(event_id, user_id)` ở database
- Kiểm tra trong service trước khi lưu

✅ **Cho phép cập nhật trong vòng 24h**
```java
long hoursBetween = Duration.between(createdAt, now).toHours();
if (hoursBetween > 24) {
    throw new IllegalStateException("Chỉ có thể cập nhật trong vòng 24 giờ");
}
```

✅ **Organizer không được đánh giá sự kiện của chính họ**
```java
if (event.getOrganizerId().equals(request.getUserId())) {
    throw new IllegalStateException("Bạn không thể đánh giá sự kiện do chính mình tổ chức!");
}
```

---

### 2. Notification cho Organizer

Khi có feedback mới, hệ thống sẽ:
1. ✅ Lưu notification vào database
2. ✅ Gửi realtime notification qua WebSocket tới `/topic/organizer/{organizerId}`
3. ✅ Format: `"User {userName} vừa đánh giá sự kiện {eventTitle} với {rating} sao"`

---

## 📁 Cấu Trúc Code

### Entity
- `Feedback.java` - Entity mapping với bảng `feedbacks`
  - Unique constraint: `@UniqueConstraint(columnNames = {"event_id", "user_id"})`

### Repository
- `FeedbackRepository.java` - JPA Repository với các query methods
  - `findByEventIdAndUserId()` - Tìm feedback theo event và user
  - `existsByEventIdAndUserId()` - Kiểm tra đã feedback chưa
  - `findByOrganizerIdOrderByCreatedAtDesc()` - Lấy feedback của organizer

### Service
- `FeedbackService.java` - Business logic
  - `submitFeedback()` - Submit feedback với đầy đủ validation
  - `getOrganizerFeedbacks()` - Lấy feedback của organizer

### Controller
- `EventFeedbackController.java` - Endpoint `/api/event/{eventId}/feedback`
- `OrganizerController.java` - Endpoint `/api/organizer/{id}/feedback`
- `FeedbackController.java` - Các endpoint legacy khác

### DTO
- `FeedbackRequest.java` - Request DTO
- `FeedbackResponse.java` - Response DTO
- `OrganizerFeedbackResponse.java` - Response DTO cho organizer

---

## 🧪 Test Cases

### Test Case 1: Đánh giá thành công
```
Given: Sự kiện status = "ENDED", User đã tham gia
When: POST /api/event/12/feedback với rating=5
Then: 200 OK, feedback được lưu, notification gửi cho organizer
```

### Test Case 2: Sự kiện chưa kết thúc
```
Given: Sự kiện status = "ONGOING"
When: POST /api/event/12/feedback
Then: 403 Forbidden, "Sự kiện chưa kết thúc, không thể đánh giá"
```

### Test Case 3: User chưa tham gia
```
Given: User chưa có ticket và chưa checkin
When: POST /api/event/12/feedback
Then: 403 Forbidden, "Bạn chưa tham gia sự kiện này!"
```

### Test Case 4: Organizer đánh giá sự kiện của mình
```
Given: User là organizer của sự kiện
When: POST /api/event/12/feedback
Then: 403 Forbidden, "Bạn không thể đánh giá sự kiện do chính mình tổ chức!"
```

### Test Case 5: Đánh giá trùng lặp
```
Given: User đã đánh giá sự kiện (đã qua 24h)
When: POST /api/event/12/feedback lần 2
Then: 403 Forbidden, "Bạn đã đánh giá sự kiện này rồi. Chỉ có thể cập nhật trong vòng 24 giờ"
```

### Test Case 6: Cập nhật trong vòng 24h
```
Given: User đã đánh giá sự kiện (chưa qua 24h)
When: POST /api/event/12/feedback với rating mới
Then: 200 OK, feedback được cập nhật
```

---

## 🚀 Deployment

### 1. Chạy SQL Migration

```bash
mysql -u root -p even_qr < database/feedback_migration.sql
```

### 2. Build và Run Spring Boot

```bash
cd backend
mvn clean package
java -jar target/eventqr-backend-1.0.jar
```

### 3. Verify Endpoints

```bash
# Test submit feedback
curl -X POST http://localhost:8080/api/event/12/feedback \
  -H "Content-Type: application/json" \
  -d '{"userId": 10, "rating": 5, "comment": "Hay!"}'

# Test get organizer feedbacks
curl http://localhost:8080/api/organizer/5/feedback
```

---

## 📝 Notes

1. **Unique Constraint:** Database level constraint đảm bảo không có duplicate feedback
2. **Transaction:** Tất cả operations trong `FeedbackService` đều có `@Transactional`
3. **Error Handling:** Đầy đủ HTTP status codes (400, 403, 404, 500)
4. **Notification:** WebSocket notification được gửi async, không block request
5. **24h Update Window:** Tính từ `created_at`, cho phép update trong vòng 24h

---

## ✅ Checklist Implementation

- [x] Entity với unique constraint
- [x] Repository với các query methods
- [x] Service với đầy đủ business logic
- [x] Controller với các endpoints yêu cầu
- [x] DTO cho request/response
- [x] Notification service integration
- [x] SQL migration script
- [x] Error handling đầy đủ
- [x] Transaction management
- [x] Logging cho debug

---

**Hoàn thành! 🎉**

