# 🧪 HƯỚNG DẪN TEST UPLOAD ẢNH

## ✅ Backend đã được rebuild với code mới!

### Bước 1: Đợi Backend khởi động xong (10-20 giây)

Mở terminal và check log:

```
[INFO] Started EventQrApplication in X.XXX seconds
```

Hoặc xem log xuất hiện:
```
✅ Thư mục upload đã sẵn sàng: D:\DuyTan\NamBa\EventQR\backend\uploads\images\events
```

---

### Bước 2: Test API có hoạt động không

Mở trình duyệt và truy cập:

```
http://localhost:8080/api/events
```

Nếu thấy JSON response → Backend OK! ✅

---

### Bước 3: Upload ảnh mới để test

1. Vào trang **Sự Kiện của tôi**: http://localhost:5500/frontend/pages/admin/events.html
2. Chọn một sự kiện bất kỳ
3. Click **"Chỉnh sửa"**
4. Upload ảnh MỚI (chọn file khác)
5. Click **"Cập nhật"**

---

### Bước 4: Kiểm tra trong phpMyAdmin

Vào phpMyAdmin → Table `event` → Xem sự kiện vừa sửa:

**ĐÚNG:**
```
image_url = D:\DuyTan\NamBa\EventQR\backend\uploads\images\events\uuid-abc-123.jpg
```

**SAI (format cũ):**
```
image_url = /images/events/filename.jpg
```

---

### Bước 5: Kiểm tra Frontend

1. Reload trang **Sự Kiện của tôi**
2. Ảnh sẽ hiển thị! 🎉

---

## 🔍 Troubleshooting

### Vấn đề 1: Backend không khởi động được

**Kiểm tra:**
```bash
# Windows PowerShell
Get-Process -Name "java"
```

Nếu không có process Java → Backend chưa chạy.

**Giải pháp:**
```bash
cd D:\DuyTan\NamBa\EventQR\backend
mvn spring-boot:run
```

---

### Vấn đề 2: Ảnh vẫn không hiển thị

**Check 1: Xem Network tab (F12)**
- Có request đến `/api/events/my-events` không?
- Response trả về `imageUrl` như thế nào?

**Check 2: Xem Console log (F12)**
- Có lỗi gì không?
- Ảnh URL có bị sai không?

**Check 3: Test trực tiếp API lấy ảnh**

Lấy `imageUrl` từ database, ví dụ:
```
D:\DuyTan\NamBa\EventQR\backend\uploads\images\events\uuid.jpg
```

Mở URL trong trình duyệt:
```
http://localhost:8080/api/images/view?path=D%3A%5CDuyTan%5CNamBa%5CEventQR%5Cbackend%5Cuploads%5Cimages%5Cevents%5Cuuid.jpg
```

Nếu ảnh hiển thị → Backend OK, vấn đề ở Frontend
Nếu 404 → File không tồn tại hoặc đường dẫn sai

---

### Vấn đề 3: Upload ảnh bị lỗi

**Kiểm tra:**
1. File có đúng định dạng không? (jpg, png, gif, webp)
2. File có nhỏ hơn 10MB không?
3. Backend có quyền ghi vào thư mục không?

**Xem log backend:**
- ✅ `Đã lưu file: D:\...`
- ❌ `Không thể lưu file...`

---

### Vấn đề 4: Ảnh cũ vẫn không hiển thị

**Nguyên nhân:** Ảnh cũ dùng format cũ `/images/events/filename.jpg`

**Giải pháp:**

**Option 1 - Sửa từng sự kiện:**
1. Vào "Chỉnh sửa" sự kiện
2. Upload lại ảnh
3. Lưu

**Option 2 - Copy ảnh cũ sang thư mục mới:**
```bash
# Copy tất cả ảnh
xcopy "D:\DuyTan\NamBa\EventQR\backend\uploads\events\*" "D:\DuyTan\NamBa\EventQR\backend\uploads\images\events\" /E /I

# Sau đó update database (trong phpMyAdmin):
UPDATE events 
SET image_url = CONCAT('D:\\DuyTan\\NamBa\\EventQR\\backend\\uploads\\images\\events\\', 
                       SUBSTRING_INDEX(image_url, '/', -1))
WHERE image_url LIKE '/images/events/%';
```

---

## 📊 Kiểm tra cuối cùng

### ✅ Checklist:

- [ ] Backend đang chạy (port 8080)
- [ ] Upload ảnh mới thành công
- [ ] Database lưu đường dẫn đầy đủ (D:\...)
- [ ] Ảnh hiển thị trên Frontend
- [ ] API `/api/images/view?path=...` hoạt động

---

Made with ❤️ for EventQR

