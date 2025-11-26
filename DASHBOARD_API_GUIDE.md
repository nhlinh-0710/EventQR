# Dashboard API - Hướng Dẫn Sử Dụng

## Tổng Quan

Đã tạo xong logic cho Dashboard với các tính năng:
- Thống kê tổng quan (số sự kiện, người tham dự, vé đã bán, doanh thu)
- Danh sách sự kiện gần đây
- Tự động cập nhật dữ liệu từ backend

## Backend API Endpoints

### 1. Lấy Thống Kê Dashboard

**Endpoint:** `GET /api/dashboard/statistics`

**Query Parameters:**
- `organizerId` (optional): ID của organizer để lọc thống kê theo người tổ chức cụ thể

**Request Example:**
```
GET http://localhost:8080/api/dashboard/statistics?organizerId=1
```

**Response Example:**
```json
{
  "activeEvents": 12,
  "totalAttendees": 1245,
  "totalTicketsSold": 856,
  "totalRevenue": 85600000
}
```

**Mô tả:**
- `activeEvents`: Số sự kiện đang hoạt động (status = "active" hoặc chưa kết thúc)
- `totalAttendees`: Tổng số người đã check-in
- `totalTicketsSold`: Tổng số vé đã đăng ký
- `totalRevenue`: Tổng doanh thu (tính theo 100,000 VND/vé)

### 2. Lấy Danh Sách Sự Kiện Gần Đây

**Endpoint:** `GET /api/dashboard/recent-events`

**Query Parameters:**
- `organizerId` (optional): ID của organizer
- `limit` (optional, default=5): Số lượng sự kiện trả về

**Request Example:**
```
GET http://localhost:8080/api/dashboard/recent-events?organizerId=1&limit=5
```

**Response Example:**
```json
[
  {
    "eventId": 1,
    "title": "Hội thảo Công nghệ AI",
    "location": "Hội trường A, TP.HCM",
    "startTime": "2025-09-15T09:00:00",
    "endTime": "2025-09-15T17:00:00",
    "status": "active",
    "maxParticipants": 150
  }
]
```

## Frontend Implementation

### Files Modified

1. **backend/src/main/java/com/eventqr/controller/DashboardController.java**
   - Controller mới để xử lý dashboard endpoints

2. **backend/src/main/java/com/eventqr/dto/DashboardStatsDTO.java**
   - DTO để trả về thống kê dashboard

3. **backend/src/main/java/com/eventqr/repository/CheckinRepository.java**
   - Thêm method `findByEventId()` để query check-in theo sự kiện

4. **frontend/js/admin/dashboard.js**
   - Thêm functions:
     - `loadDashboardStatistics()`: Load thống kê từ API
     - `updateDashboardStats()`: Cập nhật UI với dữ liệu thống kê
     - `loadRecentEvents()`: Load danh sách sự kiện gần đây
     - `updateRecentEventsList()`: Cập nhật UI với danh sách sự kiện
     - `createEventItem()`: Tạo HTML element cho mỗi sự kiện
     - `formatNumber()`: Format số với dấu phẩy
     - `formatRevenue()`: Format doanh thu (M/K suffix)

## Cách Sử Dụng

### 1. Restart Backend Server

```bash
cd backend
mvn spring-boot:run
```

### 2. Truy Cập Dashboard

1. Mở trình duyệt và truy cập: `http://localhost:5500/frontend/pages/admin/index.html`
2. Đăng nhập với tài khoản organizer
3. Dashboard sẽ tự động load dữ liệu thống kê và sự kiện gần đây

### 3. Kiểm Tra Dữ Liệu

Dashboard sẽ hiển thị:
- ✅ Số sự kiện hoạt động (tính theo status và thời gian)
- ✅ Tổng số người tham dự (đã check-in)
- ✅ Số vé đã bán (tổng số đăng ký)
- ✅ Doanh thu ước tính (100K VND/vé)
- ✅ Danh sách 5 sự kiện gần đây

## Logic Tính Toán

### Sự Kiện Hoạt Động
Một sự kiện được tính là "hoạt động" nếu:
1. `status = "active"` HOẶC
2. `endTime` > thời gian hiện tại (chưa kết thúc)

### Tổng Người Tham Dự
- Count số record trong bảng `checkin_history`
- Nếu có `organizerId`: Chỉ đếm check-in của các sự kiện thuộc organizer đó

### Số Vé Đã Bán
- Count số record trong bảng `event_ticket`
- Nếu có `organizerId`: Chỉ đếm vé của các sự kiện thuộc organizer đó

### Doanh Thu
- Tạm tính: `totalTicketsSold * 100,000 VND`
- Trong thực tế, cần thêm field `price` vào bảng `event_ticket`

## Lưu Ý

1. **CORS đã được enable** trong `DashboardController` với `@CrossOrigin(origins = "*")`

2. **Authentication**: Frontend tự động lấy `organizerId` từ `localStorage.currentUser`

3. **Error Handling**: 
   - Frontend hiển thị notification nếu không load được dữ liệu
   - Backend trả về HTTP 500 nếu có lỗi server

4. **Performance**: 
   - API tính toán thống kê mỗi lần request (không cache)
   - Với số lượng lớn sự kiện, nên implement caching hoặc pre-calculate

## Testing API Với Postman/cURL

### Test Statistics Endpoint
```bash
curl -X GET "http://localhost:8080/api/dashboard/statistics?organizerId=1"
```

### Test Recent Events Endpoint
```bash
curl -X GET "http://localhost:8080/api/dashboard/recent-events?organizerId=1&limit=5"
```

## Next Steps (Optional Improvements)

1. **Thêm field `price` vào EventTicket** để tính doanh thu thực tế
2. **Implement caching** cho thống kê (Redis, Spring Cache)
3. **Thêm filter theo ngày** (today, this week, this month)
4. **Thêm biểu đồ** (Chart.js) để visualize dữ liệu
5. **Real-time updates** với WebSocket khi có sự kiện mới
6. **Export statistics** ra PDF/Excel

## Troubleshooting

### Vấn đề: Dashboard không hiển thị dữ liệu

**Giải pháp:**
1. Kiểm tra console browser (F12) xem có lỗi API không
2. Kiểm tra backend server đang chạy ở port 8080
3. Kiểm tra CORS settings
4. Kiểm tra user đã đăng nhập chưa (localStorage.currentUser)

### Vấn đề: Số liệu không chính xác

**Giải pháp:**
1. Kiểm tra database có dữ liệu chưa
2. Kiểm tra `organizerId` có đúng không
3. Kiểm tra logic tính toán trong `DashboardController`

---

**Tạo bởi:** AI Assistant
**Ngày:** 26/11/2025
**Version:** 1.0

