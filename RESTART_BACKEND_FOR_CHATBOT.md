# 🔄 Hướng Dẫn Restart Backend Cho Chatbot

## Vấn Đề
Lỗi **404 Not Found** khi gọi API `/api/chatbot/chat` có nghĩa là backend chưa nhận diện được controller mới.

## Giải Pháp: Restart Backend

### Cách 1: Restart Thủ Công (Khuyên Dùng)

1. **Dừng backend hiện tại:**
   - Nhấn `Ctrl + C` trong terminal đang chạy backend
   - Hoặc đóng terminal đó

2. **Rebuild project:**
   ```bash
   cd backend
   mvn clean compile
   ```

3. **Start lại backend:**
   ```bash
   mvn spring-boot:run
   ```

4. **Kiểm tra:**
   - Mở browser: `http://localhost:8080/api/chatbot/health`
   - Phải thấy: `{"status":"ok","service":"chatbot"}`

### Cách 2: Sử Dụng Script (Windows)

1. **Dừng backend:**
   ```bash
   # Chạy script kill port 8080
   KILL_PORT_8080.bat
   ```

2. **Start lại:**
   ```bash
   START_BACKEND.bat
   ```

### Cách 3: Hot Reload (Nếu có DevTools)

Nếu bạn đã cài Spring Boot DevTools, chỉ cần:
- Lưu file → Backend sẽ tự động reload
- Nhưng với controller mới, vẫn nên restart để chắc chắn

## Kiểm Tra Sau Khi Restart

### 1. Kiểm Tra Health Endpoint
```bash
# Browser hoặc curl
http://localhost:8080/api/chatbot/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "chatbot"
}
```

### 2. Kiểm Tra Logs Backend

Khi start backend, bạn sẽ thấy:
```
Server đang chạy tại http://localhost:8080
```

Và trong logs, tìm:
```
Mapped "{[/api/chatbot/chat],methods=[POST]}"
Mapped "{[/api/chatbot/health],methods=[GET]}"
```

### 3. Test Từ Browser Console

Mở browser console và chạy:
```javascript
fetch('http://localhost:8080/api/chatbot/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## Troubleshooting

### Nếu vẫn 404 sau khi restart:

1. **Kiểm tra package structure:**
   - `ChatbotController` phải ở trong package `com.eventqr.controller`
   - File phải có annotation `@RestController`

2. **Kiểm tra compile:**
   ```bash
   cd backend
   mvn clean compile
   ```
   - Xem có lỗi compile không
   - Nếu có lỗi, sửa trước khi restart

3. **Kiểm tra logs:**
   - Xem backend logs có lỗi gì không
   - Tìm "ChatbotController" trong logs

4. **Kiểm tra port:**
   - Đảm bảo backend chạy đúng port 8080
   - Không có process khác chiếm port

## Lưu Ý

- **Luôn restart backend** sau khi:
  - Thêm controller mới
  - Thêm service mới
  - Thay đổi cấu hình quan trọng
  - Thêm dependency mới

- **Không cần restart** khi:
  - Chỉ sửa logic trong method
  - Sửa frontend code
  - Sửa CSS/HTML

---

**Sau khi restart xong, chatbot sẽ hoạt động bình thường!** ✅

