# 📊 Hướng Dẫn Chức Năng Thống Kê Đăng Ký Sự Kiện

## 📋 Tổng Quan

Chức năng thống kê giúp organizer theo dõi hiệu suất các sự kiện của mình thông qua:
- Tổng quan các con số quan trọng (số sự kiện, đăng ký, check-in, rating)
- Biểu đồ theo dõi xu hướng đăng ký theo thời gian
- Biểu đồ so sánh các sự kiện
- Bảng chi tiết từng sự kiện với tỷ lệ check-in

---

## 🎯 Các Tính Năng

### 1. **Tổng Quan (Overview Cards)**

Hiển thị 4 chỉ số chính:
- 📅 **Tổng Sự Kiện**: Số lượng sự kiện organizer đã tạo
- 👥 **Lượt Đăng Ký**: Tổng số người đăng ký tất cả sự kiện
- ✅ **Lượt Check-in**: Tổng số người đã check-in
- ⭐ **Điểm TB Feedback**: Điểm trung bình từ feedback của users

### 2. **Biểu Đồ Theo Thời Gian**

- Hiển thị xu hướng đăng ký trong 6 tháng gần nhất
- Dạng biểu đồ đường (line chart) với gradient background
- Giúp nhận biết thời điểm cao điểm đăng ký

### 3. **Biểu Đồ Theo Sự Kiện**

- So sánh top 10 sự kiện có nhiều đăng ký nhất
- Hiển thị 2 chỉ số: Đăng ký vs Check-in
- Dạng biểu đồ cột (bar chart) để dễ so sánh

### 4. **Bảng Chi Tiết**

Bảng liệt kê tất cả sự kiện với các cột:
- Tên sự kiện
- Ngày tổ chức
- Trạng thái (Active, Completed, Cancelled, Draft)
- Số đăng ký
- Số check-in
- Tỷ lệ check-in (%)
  - 🟢 Xanh (≥70%): Tốt
  - 🟡 Vàng (40-69%): Trung bình
  - 🔴 Đỏ (<40%): Cần cải thiện

---

## 🛠️ Cấu Trúc Kỹ Thuật

### Backend

#### 1. **DTO (Data Transfer Object)**

**File**: `backend/src/main/java/com/eventqr/dto/EventStatisticsDTO.java`

```java
public class EventStatisticsDTO {
    private Long organizerId;
    private int totalEvents;
    private int totalRegistrations;
    private int totalCheckIns;
    private double averageRating;
    private int totalFeedbacks;
    private List<EventRegistrationStat> eventStats;
    private List<TimeSeriesStat> timeSeriesStats;
}
```

#### 2. **Service Layer**

**File**: `backend/src/main/java/com/eventqr/service/StatisticsService.java`

**Method chính**: `getOrganizerStatistics(Long organizerId)`

**Logic**:
1. Lấy tất cả events của organizer
2. Đếm tổng số đăng ký (từ event_ticket)
3. Đếm tổng số check-in (từ checkin_history)
4. Tính rating trung bình (từ feedbacks)
5. Tạo thống kê từng sự kiện (registrations, check-ins, rate)
6. Tạo thống kê theo thời gian (6 tháng gần nhất)

#### 3. **Repository Updates**

**File**: `backend/src/main/java/com/eventqr/repository/CheckinRepository.java`

Thêm method:
```java
@Query("SELECT COUNT(c) FROM CheckInHistory c WHERE c.eventId = :eventId")
int countByEventId(@Param("eventId") Long eventId);
```

**File**: `backend/src/main/java/com/eventqr/repository/EventTicketRepository.java`

Thêm method:
```java
List<EventTicket> findByEventId(Long eventId);
```

#### 4. **API Endpoint**

**File**: `backend/src/main/java/com/eventqr/controller/StatisticsController.java`

**Endpoint**: `GET /api/statistics/organizer/{organizerId}`

**Response Example**:
```json
{
    "organizerId": 1,
    "totalEvents": 15,
    "totalRegistrations": 250,
    "totalCheckIns": 200,
    "averageRating": 4.5,
    "totalFeedbacks": 50,
    "eventStats": [
        {
            "eventId": 1,
            "eventTitle": "Tech Conference 2024",
            "registrationCount": 100,
            "checkInCount": 85,
            "checkInRate": 85.0,
            "eventStatus": "COMPLETED",
            "eventDate": "15/01/2024"
        }
    ],
    "timeSeriesStats": [
        {
            "period": "2024-01",
            "registrationCount": 50
        }
    ]
}
```

---

### Frontend

#### 1. **HTML Template**

**File**: `frontend/pages/admin/static.html`

**Các phần chính**:
- Overview cards (4 stat cards)
- Time series chart container
- Event stats chart container
- Event details table
- Loading state
- Empty state

#### 2. **CSS Styling**

**File**: `frontend/css/admin/stactics.css`

**Features**:
- Responsive grid layout cho stat cards
- Modern card designs với shadows và hover effects
- Gradient backgrounds cho icons
- Chart containers với proper sizing
- Table styling với hover states
- Status badges với color coding
- Mobile responsive breakpoints

#### 3. **JavaScript Logic**

**File**: `frontend/js/admin/statistics.js`

**Main Functions**:
- `loadStatistics(organizerId)`: Load data từ API
- `displayOverviewStats(data)`: Hiển thị overview cards
- `createTimeSeriesChart(data)`: Tạo biểu đồ thời gian
- `createEventStatsChart(data)`: Tạo biểu đồ sự kiện
- `displayEventTable(data)`: Hiển thị bảng chi tiết

**Chart Library**: Chart.js v4

---

## 📊 Cách Sử Dụng

### Cho Organizer:

1. **Truy cập trang thống kê**:
   - Đăng nhập với tài khoản organizer
   - Click vào menu "Thống Kê" trong sidebar

2. **Xem tổng quan**:
   - 4 cards ở đầu trang hiển thị các chỉ số tổng quan
   - Hover vào cards để xem hiệu ứng

3. **Phân tích xu hướng**:
   - Biểu đồ đầu tiên cho thấy xu hướng đăng ký 6 tháng gần nhất
   - Biểu đồ thứ hai so sánh top 10 sự kiện

4. **Xem chi tiết**:
   - Bảng ở cuối liệt kê tất cả sự kiện
   - Sắp xếp theo số đăng ký giảm dần
   - Tỷ lệ check-in được tô màu để dễ nhận biết

5. **Empty State**:
   - Nếu chưa có sự kiện nào, hiển thị nút "Tạo Sự Kiện"
   - Click để chuyển đến trang tạo sự kiện

---

## 🎨 UI/UX Features

### Design Highlights:

1. **Color Scheme**:
   - Purple gradient (#667eea → #764ba2): Events
   - Pink gradient (#f093fb → #f5576c): Registrations
   - Blue gradient (#4facfe → #00f2fe): Check-ins
   - Green gradient (#43e97b → #38f9d7): Rating

2. **Responsive Design**:
   - Desktop: 4 columns grid
   - Tablet: 2 columns grid
   - Mobile: 1 column stack

3. **Interactive Elements**:
   - Hover effects on cards
   - Animated loading spinner
   - Smooth chart animations
   - Table row highlights

4. **Status Indicators**:
   - Color-coded badges
   - Check-in rate color coding
   - Clear visual hierarchy

---

## 🔄 Data Flow

```
User Request
    ↓
Frontend (statistics.js)
    ↓
GET /api/statistics/organizer/{id}
    ↓
StatisticsController
    ↓
StatisticsService
    ↓
Repositories (Event, Ticket, CheckIn, Feedback)
    ↓
Database Queries
    ↓
DTO Assembly
    ↓
JSON Response
    ↓
Chart.js Rendering
    ↓
Display to User
```

---

## 🧪 Testing

### Backend Testing:

```bash
# Test API endpoint
curl http://localhost:8080/api/statistics/organizer/1
```

### Frontend Testing:

1. Đảm bảo backend đang chạy
2. Đăng nhập với tài khoản organizer có sự kiện
3. Navigate đến trang thống kê
4. Kiểm tra:
   - Overview cards hiển thị đúng
   - Charts render correctly
   - Table có dữ liệu
   - Empty state khi không có dữ liệu

---

## 🚀 Performance Considerations

1. **Backend**:
   - Sử dụng `@Transactional(readOnly = true)` cho queries
   - Batch queries thay vì N+1 queries
   - Caching có thể thêm nếu cần

2. **Frontend**:
   - Lazy load charts chỉ khi có dữ liệu
   - Destroy old chart instances trước khi tạo mới
   - Responsive chart sizing

3. **Database**:
   - Indexes trên: `event_id`, `user_id`, `organizer_id`
   - Efficient counting queries

---

## 📝 Future Enhancements

Có thể mở rộng:
1. **Export PDF/Excel**: Export báo cáo thống kê
2. **Date Range Filter**: Lọc theo khoảng thời gian tùy chỉnh
3. **Compare Events**: So sánh 2 sự kiện side-by-side
4. **Real-time Updates**: WebSocket cho live stats
5. **More Charts**: Pie charts, heatmaps, etc.
6. **Advanced Analytics**: Predictive analytics, trends

---

## ✅ Checklist Triển Khai

- [x] Tạo DTO (EventStatisticsDTO)
- [x] Tạo StatisticsService với logic tính toán
- [x] Thêm methods vào repositories
- [x] Tạo StatisticsController với endpoint
- [x] Thiết kế lại giao diện HTML
- [x] Tạo CSS styling responsive
- [x] Implement JavaScript logic
- [x] Integrate Chart.js
- [x] Testing và debugging
- [x] Documentation

---

## 🎉 Kết Quả

Chức năng thống kê giúp organizer:
- ✅ Theo dõi hiệu suất sự kiện realtime
- ✅ Phân tích xu hướng đăng ký
- ✅ So sánh các sự kiện với nhau
- ✅ Đánh giá tỷ lệ check-in
- ✅ Nhận feedback từ users
- ✅ Đưa ra quyết định dựa trên dữ liệu

**Happy analyzing! 📊🎉**

