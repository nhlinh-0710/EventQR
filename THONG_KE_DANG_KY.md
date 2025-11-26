# 📊 Chức Năng Thống Kê Đăng Ký Sự Kiện

## 📋 Mô Tả Chức Năng

Trang thống kê giúp **Organizer** xem số liệu đăng ký sự kiện một cách trực quan:

### ✨ Tính Năng Chính:

1. **📈 Tổng Quan (2 Cards):**
   - Tổng số sự kiện đã tạo
   - Tổng số lượt đăng ký

2. **📉 Biểu Đồ Xu Hướng:**
   - Hiển thị số lượng đăng ký theo tháng
   - 6 tháng gần nhất
   - Dạng line chart (đường)

3. **📊 Biểu Đồ So Sánh:**
   - Top 10 sự kiện có nhiều đăng ký nhất
   - Dạng bar chart (cột)

4. **📋 Bảng Chi Tiết:**
   - Liệt kê tất cả sự kiện
   - Hiển thị: Tên, Ngày, Trạng thái, Số lượng đăng ký
   - Sắp xếp theo số đăng ký giảm dần

---

## 🎯 Cách Sử Dụng

### Bước 1: Start Backend
```bash
cd backend
mvn spring-boot:run
```

Đợi đến khi thấy: `Tomcat started on port(s): 8080`

### Bước 2: Truy Cập Trang Thống Kê

1. Đăng nhập với tài khoản **organizer**
2. Click menu **"Thống Kê"** trong sidebar
3. Xem dữ liệu:
   - **Có sự kiện**: Hiển thị cards, charts, bảng
   - **Chưa có sự kiện**: Hiển thị "Empty State" với nút tạo sự kiện

---

## 🛠️ Cấu Trúc Kỹ Thuật

### Backend

**API Endpoint:**
```
GET /api/statistics/organizer/{organizerId}
```

**Response JSON:**
```json
{
  "organizerId": 1,
  "totalEvents": 10,
  "totalRegistrations": 150,
  "eventStats": [
    {
      "eventId": 1,
      "eventTitle": "Hội thảo công nghệ",
      "registrationCount": 50,
      "eventStatus": "ACTIVE",
      "eventDate": "15/12/2024"
    }
  ],
  "timeSeriesStats": [
    {
      "period": "2024-11",
      "registrationCount": 50
    }
  ]
}
```

**Files:**
- `StatisticsController.java` - API controller
- `StatisticsService.java` - Business logic
- `EventStatisticsDTO.java` - Data transfer object

### Frontend

**Files:**
- `static.html` - Giao diện trang
- `stactics.css` - Styling
- `statistics.js` - Logic hiển thị

**Libraries:**
- Chart.js - Vẽ biểu đồ

---

## 📊 Các Thống Kê Hiển Thị

### 1. Tổng Quan
- **Tổng Số Sự Kiện**: Đếm tất cả events của organizer
- **Tổng Lượt Đăng Ký**: Tổng số tickets chưa hủy

### 2. Xu Hướng Theo Thời Gian
- Hiển thị 6 tháng gần nhất
- Đếm số lượng đăng ký mỗi tháng
- Dữ liệu từ bảng `event_ticket`

### 3. So Sánh Sự Kiện
- Top 10 events có nhiều đăng ký nhất
- Sắp xếp giảm dần theo `registrationCount`

### 4. Bảng Chi Tiết
- Tất cả events của organizer
- Các cột:
  - Tên sự kiện
  - Ngày tổ chức
  - Trạng thái (Active/Completed/Cancelled/Draft)
  - Số lượng đăng ký

---

## 🎨 Giao Diện

### Responsive Design
- **Desktop**: 2 cards ngang, 2 charts ngang
- **Tablet**: 2 cards ngang, charts dọc
- **Mobile**: Tất cả xếp dọc

### Color Scheme
- Purple gradient: Cards, buttons
- Blue line: Biểu đồ thời gian
- Purple bars: Biểu đồ so sánh

### Status Badges
- 🟢 **Active**: Sự kiện đang diễn ra
- 🔵 **Completed**: Đã kết thúc
- 🔴 **Cancelled**: Đã hủy
- ⚪ **Draft**: Nháp

---

## ✅ Checklist Hoàn Thành

- [x] Backend API endpoint
- [x] Database queries
- [x] DTO cho response
- [x] Giao diện responsive
- [x] 2 overview cards
- [x] Biểu đồ xu hướng
- [x] Biểu đồ so sánh
- [x] Bảng chi tiết
- [x] Empty state
- [x] Error handling
- [x] Loading state

---

## 🚀 Kết Quả

**Organizer có thể:**
- ✅ Xem tổng số sự kiện và đăng ký
- ✅ Theo dõi xu hướng đăng ký theo tháng
- ✅ So sánh các sự kiện với nhau
- ✅ Xem chi tiết từng sự kiện
- ✅ Đánh giá hiệu quả của từng sự kiện

**Giao diện:**
- ✨ Đẹp mắt, hiện đại
- 📱 Responsive trên mọi thiết bị
- ⚡ Load nhanh
- 🎨 Interactive charts

---

## 📝 Lưu Ý

- Chỉ thống kê **số lượng đăng ký** (tickets)
- Không bao gồm check-in, rating, feedback
- Data real-time từ database
- Cần đăng nhập với tài khoản organizer

**Happy analyzing! 📊🎉**

