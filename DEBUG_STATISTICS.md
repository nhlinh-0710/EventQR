# 🔍 Debug Thống Kê - Hướng Dẫn

## ❌ Lỗi: "Không thể tải thống kê"

### Các nguyên nhân phổ biến:

## 1️⃣ Backend chưa chạy

**Kiểm tra:**
```bash
# Mở terminal, vào folder backend
cd backend

# Chạy backend
mvn spring-boot:run
```

**Dấu hiệu backend đang chạy:**
- Console hiển thị: `Tomcat started on port(s): 8080`
- Không có lỗi màu đỏ

**Test backend:**
Mở browser, vào: http://localhost:8080/api/events

Nếu thấy JSON array `[]` hoặc danh sách events → Backend OK ✅

---

## 2️⃣ Kiểm tra Console Logs

**Mở Developer Tools:**
- Windows: `F12` hoặc `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

**Vào tab Console**, tìm logs:

```
📊 Statistics page loaded
👤 Current user: {user_id: 1, name: "...", role: "organizer"}
🔑 Organizer ID: 1
🔍 Fetching statistics for organizer: 1
🌐 API URL: http://localhost:8080/api/statistics/organizer/1
```

**Nếu thấy lỗi màu đỏ:**

### Lỗi: `Failed to fetch` hoặc `NetworkError`
→ **Backend chưa chạy**
→ **Giải pháp:** Chạy backend (bước 1)

### Lỗi: `404 Not Found`
→ **API endpoint chưa tồn tại**
→ **Giải pháp:** Kiểm tra StatisticsController có được compile không

### Lỗi: `500 Internal Server Error`
→ **Lỗi trong backend logic**
→ **Giải pháp:** Xem backend console logs

### Lỗi: `CORS error`
→ **CORS chưa được config đúng**
→ **Giải pháp:** Kiểm tra `@CrossOrigin(origins = "*")` trong Controller

---

## 3️⃣ Kiểm tra Database

**Mở phpMyAdmin hoặc MySQL Workbench:**

```sql
-- Kiểm tra có events không
SELECT COUNT(*) FROM event WHERE organizer_id = 1;

-- Kiểm tra có tickets không
SELECT COUNT(*) FROM event_ticket;

-- Kiểm tra có check-ins không
SELECT COUNT(*) FROM checkin_history;
```

**Nếu tất cả = 0:**
→ Chưa có dữ liệu
→ Empty state sẽ hiển thị (OK)

---

## 4️⃣ Test API Trực Tiếp

**Dùng Postman hoặc curl:**

```bash
curl http://localhost:8080/api/statistics/organizer/1
```

**Response mong đợi:**
```json
{
    "organizerId": 1,
    "totalEvents": 5,
    "totalRegistrations": 50,
    "totalCheckIns": 40,
    "averageRating": 4.5,
    "totalFeedbacks": 10,
    "eventStats": [...],
    "timeSeriesStats": [...]
}
```

**Nếu thấy lỗi:**
- `404`: Endpoint không tồn tại → Compile lại backend
- `500`: Lỗi logic → Xem backend logs
- Connection refused: Backend chưa chạy

---

## 5️⃣ Kiểm tra User Role

**Trong Console:**
```javascript
// Kiểm tra user hiện tại
console.log(JSON.parse(localStorage.getItem('currentUser')));
```

**Cần kiểm tra:**
- `role: "organizer"` (không phải "user")
- `user_id` hoặc `userId` hoặc `id` có giá trị

**Nếu role = "user":**
→ Đăng nhập bằng tài khoản organizer

---

## 6️⃣ Compile Backend Lại

```bash
cd backend

# Clean và compile lại
mvn clean compile

# Nếu OK, chạy:
mvn spring-boot:run
```

**Kiểm tra logs:**
```
[INFO] BUILD SUCCESS
```

---

## 7️⃣ Checklist Đầy Đủ

- [ ] Backend đang chạy (port 8080)
- [ ] Database có kết nối
- [ ] Đăng nhập với tài khoản organizer
- [ ] StatisticsController đã được compile
- [ ] StatisticsService không có lỗi
- [ ] CORS đã config
- [ ] API trả về JSON đúng format

---

## 🆘 Vẫn Lỗi?

**Gửi thông tin sau để debug:**

1. **Backend logs** (copy từ terminal)
2. **Browser console logs** (copy từ DevTools)
3. **API response** (từ curl hoặc Postman)
4. **Database structure** (SHOW TABLES)
5. **Current user object** (từ localStorage)

---

## ✅ Sau Khi Sửa Xong

1. Reload trang: `Ctrl + R` hoặc `F5`
2. Hard reload: `Ctrl + Shift + R` hoặc `Cmd + Shift + R`
3. Xóa cache nếu cần

---

## 🎯 Quick Fix

**Thử theo thứ tự:**

```bash
# 1. Start backend
cd backend
mvn spring-boot:run

# 2. Đợi backend chạy xong

# 3. Mở browser
http://localhost:5500/frontend/pages/admin/static.html

# 4. Login với organizer account

# 5. Check console logs
```

**Nếu vẫn lỗi, xem logs chi tiết trong console!**

