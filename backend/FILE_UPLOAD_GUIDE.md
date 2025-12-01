# 📁 Hướng dẫn Cấu hình Upload File

## ✅ Tính năng mới

Bây giờ bạn có thể lưu file ảnh **ở bất kỳ đâu trên máy tính**, không bị giới hạn trong thư mục dự án!

---

## 🔧 Cách cấu hình

Mở file `backend/src/main/resources/application.properties` và chỉnh sửa dòng:

```properties
file.upload-dir=<đường_dẫn_bạn_muốn>
```

### 📌 Ví dụ trên Windows:

```properties
# Lưu vào ổ D:
file.upload-dir=D:/EventQR_Images

# Lưu vào thư mục Documents
file.upload-dir=C:/Users/YourName/Documents/EventQR_Images

# Lưu vào Desktop
file.upload-dir=C:/Users/YourName/Desktop/EventQR_Uploads
```

### 📌 Ví dụ trên Linux/Mac:

```properties
# Lưu vào thư mục home
file.upload-dir=/home/username/EventQR_Images

# Lưu vào thư mục server
file.upload-dir=/var/www/uploads/events

# Lưu vào thư mục tùy chỉnh
file.upload-dir=/mnt/storage/event_images
```

### 📌 Hoặc dùng đường dẫn tương đối (trong dự án):

```properties
# Lưu trong thư mục dự án (mặc định)
file.upload-dir=uploads/images/events
```

---

## 🚀 Cách hoạt động

1. **Tự động tạo thư mục**: Khi khởi động ứng dụng, hệ thống sẽ tự động tạo thư mục nếu chưa tồn tại
2. **Tên file unique**: Mỗi file sẽ được đổi tên bằng UUID để tránh trùng lặp
3. **Lưu đường dẫn đầy đủ**: Database sẽ lưu đường dẫn tuyệt đối của file (ví dụ: `D:/EventQR_Images/uuid-123.jpg`)
4. **Tự động xóa**: Khi cập nhật hoặc xóa sự kiện, file cũ sẽ tự động được xóa

---

## 📋 Ví dụ hoàn chỉnh

### Bước 1: Cấu hình trong `application.properties`

```properties
file.upload-dir=D:/MyEventImages
```

### Bước 2: Khởi động lại ứng dụng

```bash
mvn spring-boot:run
```

### Bước 3: Xem log khởi động

```
✅ Đã tạo thư mục upload: D:\MyEventImages
```
hoặc
```
✅ Thư mục upload đã sẵn sàng: D:\MyEventImages
```

### Bước 4: Upload file qua API

```bash
POST http://localhost:8080/api/events
Content-Type: multipart/form-data

{
  "title": "Sự kiện mới",
  "eventImage": <file>,
  ...
}
```

### Bước 5: File được lưu

```
✅ Đã lưu file: D:\MyEventImages\e3b0c442-98fc-1c14-b39f-92d7-175766a3e2f1.jpg
```

---

## 💡 Lưu ý quan trọng

### ✅ Ưu điểm của đường dẫn tuyệt đối:

- ✔️ Lưu file ở bất kỳ đâu trên máy tính
- ✔️ Dễ dàng sao lưu (backup) riêng thư mục ảnh
- ✔️ Không mất ảnh khi rebuild project
- ✔️ Có thể chia sẻ thư mục qua mạng (network share)

### ⚠️ Lưu ý:

1. **Windows**: Dùng dấu `/` hoặc `\\` (ví dụ: `D:/Images` hoặc `D:\\Images`)
2. **Quyền truy cập**: Đảm bảo ứng dụng có quyền ghi vào thư mục đó
3. **Dung lượng**: Kiểm tra ổ đĩa có đủ dung lượng
4. **Backup**: Nên backup thư mục ảnh định kỳ

---

## 🔍 Debug & Troubleshooting

### Vấn đề: Không thể tạo thư mục

```
❌ Không thể khởi tạo thư mục lưu trữ file: D:/EventImages
```

**Giải pháp:**
- Kiểm tra quyền truy cập thư mục
- Kiểm tra ổ đĩa có tồn tại không
- Thử dùng đường dẫn khác

### Vấn đề: Không thể xóa file cũ

```
❌ Không thể xóa file: D:/EventImages/old-file.jpg
```

**Giải pháp:**
- File có thể đang được mở bởi chương trình khác
- Kiểm tra quyền xóa file
- Ứng dụng sẽ vẫn hoạt động bình thường, chỉ file cũ không bị xóa

---

## 📊 Quản lý File

### Xem file đã upload:

Tất cả file sẽ nằm trong thư mục bạn đã cấu hình:

```
D:\MyEventImages\
  ├── e3b0c442-98fc-1c14-b39f-92d7175766a3e2f1.jpg
  ├── a4f1e8d2-3b5c-4a9e-8f2d-1c7b6e9a0f3d.png
  └── ...
```

### Xóa tất cả file:

Nếu muốn xóa tất cả file upload, chỉ cần xóa thư mục:

```bash
# Windows
rmdir /s /q D:\MyEventImages

# Linux/Mac
rm -rf /home/user/EventQR_Images
```

---

## 🎯 Best Practices

1. **Development**: Dùng đường dẫn trong project (`uploads/images/events`)
2. **Production**: Dùng đường dẫn tuyệt đối (`/var/www/uploads` hoặc `D:/EventImages`)
3. **Backup**: Thiết lập backup tự động cho thư mục ảnh
4. **Monitoring**: Theo dõi dung lượng ổ đĩa định kỳ

---

Made with ❤️ for EventQR Project

