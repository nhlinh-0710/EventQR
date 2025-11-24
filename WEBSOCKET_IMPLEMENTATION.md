# 🔔 Hướng Dẫn Triển Khai WebSocket & Sửa Logic Sự Kiện

## 📋 Tổng Quan

Dự án đã được hoàn thiện với 2 tính năng chính:

1. **Thông báo Realtime WebSocket** cho Organizer khi có User đăng ký sự kiện
2. **Sửa logic quyền sở hữu sự kiện** - chỉ organizer sở hữu mới xem/update/delete được

---

## 🎯 1. Thông Báo Realtime WebSocket

### Backend Components

#### 1.1. Dependencies (`pom.xml`)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

#### 1.2. WebSocket Configuration (`WebSocketConfig.java`)
- **Endpoint**: `/ws`
- **Message Broker**: `/topic`
- **Application Prefix**: `/app`
- **Topic Pattern**: `/topic/organizer/{organizerId}`

#### 1.3. Notification Model (`Notification.java`)
- Entity mapping với bảng `notifications`
- Fields: `notificationId`, `userId`, `eventId`, `title`, `message`, `status`, `createdAt`

#### 1.4. NotificationService (`NotificationService.java`)
**Chức năng chính:**
- `sendToOrganizer()`: Gửi thông báo realtime + lưu vào DB
- `getNotificationsByUserId()`: Lấy danh sách thông báo
- `getUnreadNotifications()`: Lấy thông báo chưa đọc
- `markAsRead()`: Đánh dấu đã đọc
- `countUnreadNotifications()`: Đếm số thông báo chưa đọc

**Flow khi user đăng ký:**
1. `EventRegistrationService.register()` tạo `EventTicket`
2. Gọi `NotificationService.sendToOrganizer()`
3. Lưu notification vào DB
4. Gửi qua WebSocket tới `/topic/organizer/{organizerId}`

#### 1.5. NotificationController (`NotificationController.java`)
**Endpoints:**
- `GET /api/notifications/user/{userId}` - Lấy tất cả thông báo
- `GET /api/notifications/user/{userId}/unread` - Lấy thông báo chưa đọc
- `GET /api/notifications/user/{userId}/count` - Đếm số chưa đọc
- `PUT /api/notifications/{notificationId}/read?userId={userId}` - Đánh dấu đã đọc

### Frontend Components

#### 1.6. WebSocket Client (`websocket.js`)
**Chức năng:**
- `connectWebSocket(organizerId, callback)`: Kết nối và subscribe
- `disconnectWebSocket()`: Ngắt kết nối
- `showNotificationToast(notification)`: Hiển thị toast
- `updateNotificationBadge(userId)`: Cập nhật badge số lượng
- `initOrganizerWebSocket()`: Tự động kết nối khi load trang

**Cách sử dụng:**
```javascript
// Tự động kết nối khi trang admin được load
// File websocket.js sẽ tự động gọi initOrganizerWebSocket()
```

**Thư viện cần thiết (đã thêm vào HTML):**
```html
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.0.0/bundles/stomp.umd.min.js"></script>
<script src="../../js/core/websocket.js" defer></script>
```

---

## 🔒 2. Sửa Logic Quyền Sở Hữu Sự Kiện

### Backend Changes

#### 2.1. EventRepository
**Thêm methods:**
- `findByOrganizerIdOrderByCreatedAtDesc(Long organizerId)`
- `existsByEventIdAndOrganizerId(Long eventId, Long organizerId)`

#### 2.2. EventService Interface
**Thêm methods:**
- `findByOrganizerId(Long organizerId)`
- `isEventOwner(Long eventId, Long organizerId)`
- `updateEvent(Long eventId, EventRequest request, Long organizerId)` - **Thêm tham số organizerId**
- `deleteEvent(Long eventId, Long organizerId)` - **Method mới**

#### 2.3. EventServiceImpl
**Thay đổi:**
- `updateEvent()`: Kiểm tra quyền sở hữu trước khi update
- `deleteEvent()`: Method mới, kiểm tra quyền trước khi xóa
- `findByOrganizerId()`: Lấy danh sách sự kiện của organizer
- `isEventOwner()`: Kiểm tra quyền sở hữu

#### 2.4. EventController
**Endpoints mới:**
- `GET /api/events/my-events?organizerId={id}` hoặc `X-Organizer-Id` header
- `PUT /api/events/{id}?organizerId={id}` - **Yêu cầu organizerId**
- `DELETE /api/events/{id}?organizerId={id}` - **Yêu cầu organizerId**

**Validation:**
- Kiểm tra `organizerId` từ header hoặc query param
- Trả về `403 FORBIDDEN` nếu không có quyền
- Trả về `400 BAD_REQUEST` nếu thiếu `organizerId`

#### 2.5. EventRequest DTO
**Thêm field:**
- `organizerId` (Long) - ID của organizer tạo sự kiện

### Frontend Changes

#### 2.6. events.js
**Thay đổi:**
- `fetchEvents()`: Gọi `/api/events/my-events?organizerId={id}` thay vì `/api/events`
- `saveEventChanges()`: Thêm `organizerId` vào header và query param
- `getCurrentOrganizerId()`: Lấy `user_id` từ localStorage

---

## 🧪 Hướng Dẫn Test

### Test WebSocket Notification

1. **Chuẩn bị:**
   - Organizer A đăng nhập vào trang admin
   - Mở Developer Console để xem logs

2. **Test:**
   - User B đăng ký một sự kiện của Organizer A
   - Organizer A sẽ nhận thông báo realtime ngay lập tức (không cần reload)

3. **Kiểm tra:**
   - Console log: `✅ Đã kết nối WebSocket`
   - Console log: `🔔 Nhận thông báo mới`
   - Toast notification hiển thị trên màn hình
   - Database có record trong bảng `notifications`

### Test Quyền Sở Hữu

1. **Test GET /api/events/my-events:**
   ```bash
   # Organizer A (ID = 1)
   GET http://localhost:8080/api/events/my-events?organizerId=1
   # Chỉ trả về sự kiện của Organizer A
   
   # Organizer B (ID = 2)
   GET http://localhost:8080/api/events/my-events?organizerId=2
   # Chỉ trả về sự kiện của Organizer B
   ```

2. **Test UPDATE:**
   ```bash
   # Organizer A cố update sự kiện của Organizer B
   PUT http://localhost:8080/api/events/{eventId}?organizerId=1
   # Header: X-Organizer-Id: 1
   # Response: 403 FORBIDDEN - "Bạn không có quyền chỉnh sửa sự kiện này"
   ```

3. **Test DELETE:**
   ```bash
   # Organizer A cố xóa sự kiện của Organizer B
   DELETE http://localhost:8080/api/events/{eventId}?organizerId=1
   # Response: 403 FORBIDDEN
   ```

4. **Test Frontend:**
   - Organizer A đăng nhập → chỉ thấy sự kiện của mình
   - Organizer B đăng nhập → chỉ thấy sự kiện của mình
   - Không thể update/delete sự kiện của người khác

---

## 📝 Lưu Ý Quan Trọng

### Backend
1. **organizerId** có thể được truyền qua:
   - Header: `X-Organizer-Id`
   - Query Parameter: `?organizerId={id}`
   - Ưu tiên header nếu cả 2 đều có

2. **EventRequest.organizerId**:
   - Khi tạo sự kiện mới, cần set `organizerId` trong form data
   - Nếu không có, mặc định là `1L` (cần sửa logic này nếu cần)

3. **WebSocket Connection**:
   - Tự động reconnect nếu mất kết nối
   - Chỉ kết nối khi user là `organizer` hoặc `manage`

### Frontend
1. **WebSocket Libraries**:
   - Phải load trước `websocket.js`
   - Đã thêm vào `events.html` và `index.html`

2. **localStorage**:
   - Cần có `currentUser` với `user_id` và `role`
   - Format: `{ user_id: 1, role: "organizer", ... }`

3. **API Calls**:
   - Tất cả API liên quan đến organizer cần có `organizerId`
   - Có thể dùng header hoặc query param

---

## 🚀 Deployment Checklist

- [ ] Thêm WebSocket dependency vào `pom.xml` ✅
- [ ] Tạo `WebSocketConfig.java` ✅
- [ ] Tạo `Notification.java` model ✅
- [ ] Tạo `NotificationRepository.java` ✅
- [ ] Hoàn thiện `NotificationService.java` ✅
- [ ] Cập nhật `EventRegistrationService.java` ✅
- [ ] Thêm `NotificationController.java` ✅
- [ ] Cập nhật `EventRepository.java` ✅
- [ ] Cập nhật `EventService.java` interface ✅
- [ ] Cập nhật `EventServiceImpl.java` ✅
- [ ] Cập nhật `EventController.java` ✅
- [ ] Cập nhật `EventRequest.java` ✅
- [ ] Tạo `websocket.js` frontend ✅
- [ ] Cập nhật `events.js` frontend ✅
- [ ] Thêm WebSocket libraries vào HTML ✅
- [ ] Test WebSocket connection ✅
- [ ] Test notification flow ✅
- [ ] Test quyền sở hữu ✅

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs (browser + server)
2. Kiểm tra WebSocket connection trong Network tab
3. Kiểm tra database có record trong `notifications` table
4. Kiểm tra `organizerId` có được truyền đúng không

---

**Hoàn thành! 🎉**

