# 🖼️ Hướng dẫn Sửa lỗi Hiển thị Ảnh Sự kiện

## ❌ Vấn đề ban đầu

Ảnh đã được lưu vào database nhưng **không hiển thị** ở danh sách sự kiện vì:
- Database lưu đường dẫn tuyệt đối: `D:\EventQR_Images\uuid.jpg`
- Trình duyệt không thể truy cập trực tiếp vào đường dẫn file trên máy tính
- Frontend cần URL dạng: `http://localhost:8080/api/images/view?path=...`

## ✅ Giải pháp đã triển khai

### 1. **Tạo ImageController** (`backend/src/main/java/com/eventqr/controller/ImageController.java`)
   - API endpoint: `GET /api/images/view?path=<đường_dẫn_file>`
   - Serve file ảnh từ đường dẫn tuyệt đối trên máy tính
   - Tự động xác định content-type (jpg, png, gif, webp)
   - Xử lý lỗi nếu file không tồn tại

### 2. **Tạo ImageUrlConverter utility** (`backend/src/main/java/com/eventqr/util/ImageUrlConverter.java`)
   - Convert đường dẫn file → URL có thể truy cập
   - Tái sử dụng được ở nhiều nơi
   - Xử lý cả đường dẫn tuyệt đối, tương đối, và URL

### 3. **Cập nhật EventController**
   - Tự động convert imageUrl trước khi trả về cho frontend
   - Áp dụng cho tất cả API:
     - `GET /api/events` (danh sách tất cả sự kiện)
     - `GET /api/events/my-events` (sự kiện của organizer)
     - `GET /api/events/{id}` (chi tiết sự kiện)

### 4. **Cập nhật EventRegistrationController**
   - Convert imageUrl cho UserTicketResponse
   - Áp dụng cho API: `GET /api/user/{userId}/tickets`

---

## 🧪 Cách Test

### Bước 1: Khởi động Backend

```bash
cd backend
mvn spring-boot:run
```

### Bước 2: Kiểm tra log khởi động

Xem log để đảm bảo thư mục upload đã được tạo:

```
✅ Thư mục upload đã sẵn sàng: D:\EventQR_Images
```

### Bước 3: Upload ảnh mới

Tạo một sự kiện mới với ảnh qua API hoặc frontend.

**Kiểm tra console log:**

```
✅ Đã lưu file: D:\EventQR_Images\e3b0c442-98fc-1c14-b39f-92d7175766a3e2f1.jpg
```

### Bước 4: Kiểm tra Response từ API

Gọi API để lấy danh sách sự kiện:

```bash
GET http://localhost:8080/api/events/my-events?organizerId=1
```

**Response mong đợi:**

```json
{
  "eventId": 26,
  "title": "ảnh sáng",
  "imageUrl": "/api/images/view?path=D%3A%5CEventQR_Images%5Cuuid.jpg",
  ...
}
```

✅ imageUrl đã được convert thành URL có thể truy cập!

### Bước 5: Test trực tiếp API lấy ảnh

Copy URL từ imageUrl và thử truy cập trực tiếp:

```
http://localhost:8080/api/images/view?path=D%3A%5CEventQR_Images%5Cuuid.jpg
```

Ảnh sẽ được hiển thị trong trình duyệt! 🎉

### Bước 6: Kiểm tra Frontend

Mở trang danh sách sự kiện, ảnh sẽ hiển thị bình thường.

**Frontend tự động xử lý:**
- URL bắt đầu bằng `/` → Ghép với `http://localhost:8080`
- Kết quả: `http://localhost:8080/api/images/view?path=...`

---

## 🔍 Troubleshooting

### Vấn đề 1: Ảnh không hiển thị (404 Not Found)

**Nguyên nhân:** File không tồn tại tại đường dẫn đã lưu

**Giải pháp:**
1. Kiểm tra console log khi upload:
   ```
   ✅ Đã lưu file: D:\EventQR_Images\uuid.jpg
   ```
2. Kiểm tra file có thực sự tồn tại:
   ```bash
   dir D:\EventQR_Images
   ```
3. Kiểm tra đường dẫn trong database có đúng không

### Vấn đề 2: Ảnh cũ vẫn không hiển thị

**Nguyên nhân:** Ảnh cũ được lưu với logic cũ (đường dẫn `/images/events/filename.jpg`)

**Giải pháp:**

**Option A - Giữ nguyên ảnh cũ:**
1. Copy ảnh cũ từ `backend/uploads/events/` sang thư mục mới
2. Cập nhật database:
   ```sql
   UPDATE events 
   SET image_url = 'D:/EventQR_Images/filename.jpg'
   WHERE image_url = '/images/events/filename.jpg';
   ```

**Option B - Upload lại ảnh:**
1. Sửa sự kiện và upload ảnh mới
2. Hệ thống sẽ tự động xóa ảnh cũ và lưu ảnh mới

### Vấn đề 3: Lỗi "Cannot read file"

**Nguyên nhân:** Ứng dụng không có quyền đọc file

**Giải pháp:**
1. Kiểm tra quyền truy cập thư mục
2. Trên Windows: Run IDE/terminal as Administrator (nếu cần)
3. Trên Linux/Mac: Chmod 755 cho thư mục upload

### Vấn đề 4: URL encode không đúng

**Nguyên nhân:** Đường dẫn có ký tự đặc biệt

**Giải pháp:**
- Hệ thống đã tự động URL encode (`D:\` → `D%3A%5C`)
- Nếu vẫn lỗi, kiểm tra console log để debug

---

## 📊 Luồng hoạt động

```
1. User upload ảnh
   ↓
2. FileStorageService lưu file vào D:/EventQR_Images/uuid.jpg
   ↓
3. Database lưu: "D:/EventQR_Images/uuid.jpg"
   ↓
4. EventController convert: "/api/images/view?path=D%3A%2F..."
   ↓
5. Frontend nhận: "/api/images/view?path=..."
   ↓
6. Frontend request: http://localhost:8080/api/images/view?path=...
   ↓
7. ImageController đọc file và trả về
   ↓
8. Ảnh hiển thị! ✅
```

---

## 🎯 Kiến trúc File

```
backend/
├── src/main/java/com/eventqr/
│   ├── controller/
│   │   ├── EventController.java ✅ (đã cập nhật)
│   │   ├── EventRegistrationController.java ✅ (đã cập nhật)
│   │   └── ImageController.java ✨ (mới)
│   ├── service/
│   │   ├── FileStorageService.java ✅ (đã cập nhật)
│   │   └── EventServiceImpl.java ✅ (đã cập nhật)
│   └── util/
│       └── ImageUrlConverter.java ✨ (mới)
└── uploads/images/events/ (hoặc D:/EventQR_Images/)
    ├── uuid-1.jpg
    ├── uuid-2.png
    └── ...
```

---

## ✨ Tính năng bổ sung

### 1. Hỗ trợ nhiều định dạng ảnh
- ✅ JPEG/JPG
- ✅ PNG
- ✅ GIF
- ✅ WebP
- ✅ SVG

### 2. Tự động xác định Content-Type

ImageController tự động set correct content-type dựa vào extension.

### 3. Xử lý lỗi tốt

- File không tồn tại → 404 Not Found
- Đường dẫn không hợp lệ → 400 Bad Request
- Lỗi server → 500 Internal Server Error

### 4. Tương thích ngược

Hệ thống vẫn hoạt động với:
- URL đầy đủ: `http://example.com/image.jpg`
- Đường dẫn tương đối: `/images/events/image.jpg`
- Đường dẫn tuyệt đối: `D:/EventQR_Images/image.jpg`

---

## 🚀 Production Deployment

Khi deploy lên production:

1. **Cấu hình thư mục upload trong application.properties:**
   ```properties
   # Linux server
   file.upload-dir=/var/www/uploads/events
   ```

2. **Đảm bảo quyền truy cập:**
   ```bash
   sudo chown -R tomcat:tomcat /var/www/uploads
   sudo chmod -R 755 /var/www/uploads
   ```

3. **Backup định kỳ:**
   ```bash
   # Cron job để backup ảnh
   0 2 * * * tar -czf /backup/images-$(date +\%Y\%m\%d).tar.gz /var/www/uploads/events
   ```

---

Made with ❤️ for EventQR Project

