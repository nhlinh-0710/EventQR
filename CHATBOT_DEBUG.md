# 🔧 Hướng Dẫn Debug Chatbot

## Các Lỗi Thường Gặp và Cách Sửa

### 1. Lỗi: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau."

**Nguyên nhân có thể:**
- Backend chưa chạy
- API endpoint không đúng
- CORS issue
- Database connection issue

**Cách kiểm tra:**

#### Bước 1: Kiểm tra Backend đã chạy chưa
```bash
# Mở browser và truy cập:
http://localhost:8080/api/chatbot/health
```

Nếu thấy `{"status":"ok","service":"chatbot"}` → Backend đang chạy ✅

Nếu không → Backend chưa chạy, cần start:
```bash
cd backend
mvn spring-boot:run
```

#### Bước 2: Kiểm tra Console Browser
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Xem có lỗi gì không:
   - `Failed to fetch` → Backend chưa chạy hoặc CORS issue
   - `CORS policy` → CORS configuration issue
   - `404 Not Found` → API endpoint sai

#### Bước 3: Kiểm tra Network Tab
1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Gửi một tin nhắn trong chatbot
4. Tìm request `chat` → Xem:
   - **Status Code**: 
     - `200` → OK ✅
     - `404` → Endpoint không tồn tại
     - `500` → Lỗi server
     - `CORS error` → CORS issue
   - **Response**: Xem nội dung response

### 2. Lỗi: "Không thể kết nối đến server"

**Nguyên nhân:**
- Backend chưa chạy
- Port 8080 bị chiếm
- Firewall chặn

**Cách sửa:**

1. **Kiểm tra port 8080:**
```bash
# Windows
netstat -ano | findstr :8080

# Nếu có process, kill nó:
taskkill /PID <PID> /F
```

2. **Start lại backend:**
```bash
cd backend
mvn spring-boot:run
```

3. **Kiểm tra firewall:**
- Cho phép Java qua firewall
- Hoặc tắt firewall tạm thời để test

### 3. Lỗi: "Phản hồi không đúng định dạng"

**Nguyên nhân:**
- Response format từ backend không đúng
- JSON parsing error

**Cách sửa:**

1. Kiểm tra backend logs
2. Xem Network tab → Response tab
3. Đảm bảo response có format:
```json
{
  "success": true,
  "message": "...",
  "conversationId": "..."
}
```

### 4. Chatbot không hiển thị

**Nguyên nhân:**
- CSS/JS chưa được load
- Path không đúng

**Cách kiểm tra:**

1. **Kiểm tra file đã được include:**
```html
<!-- Trong <head> -->
<link rel="stylesheet" href="css/chatbot.css">

<!-- Trước </body> -->
<script src="js/core/chatbot.js"></script>
```

2. **Kiểm tra Console:**
- Xem có lỗi `404` cho `chatbot.css` hoặc `chatbot.js` không
- Sửa đường dẫn nếu cần

3. **Kiểm tra path:**
- Nếu ở `pages/user/index.html` → dùng `../../css/chatbot.css`
- Nếu ở `index.html` → dùng `css/chatbot.css`

### 5. AI không trả lời (chỉ có fallback responses)

**Nguyên nhân:**
- Gemini API key chưa được cấu hình
- API key không hợp lệ
- Internet connection issue

**Cách sửa:**

1. **Kiểm tra API key:**
```properties
# backend/src/main/resources/application.properties
gemini.api.key=YOUR_API_KEY_HERE
```

2. **Lấy API key mới:**
- Truy cập: https://makersuite.google.com/app/apikey
- Tạo key mới
- Copy vào `application.properties`

3. **Restart backend** sau khi thêm API key

4. **Kiểm tra logs:**
- Xem backend console có lỗi gì không
- Lỗi `401` → API key không hợp lệ
- Lỗi `403` → API key không có quyền

## Test Chatbot

### Test 1: Health Check
```bash
curl http://localhost:8080/api/chatbot/health
```

Expected: `{"status":"ok","service":"chatbot"}`

### Test 2: Send Message
```bash
curl -X POST http://localhost:8080/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Xin chào","conversationId":"test123","userId":1}'
```

Expected: Response với `success: true` và `message` chứa câu trả lời

### Test 3: Test từ Browser Console
```javascript
fetch('http://localhost:8080/api/chatbot/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    message: 'Xin chào',
    conversationId: 'test123',
    userId: null
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Checklist Debug

- [ ] Backend đang chạy trên port 8080
- [ ] Health endpoint trả về OK
- [ ] Console browser không có lỗi
- [ ] Network tab shows 200 status
- [ ] Response format đúng
- [ ] CSS/JS đã được load
- [ ] CORS đã được config
- [ ] API key đã được set (nếu dùng AI)

## Logs Quan Trọng

### Backend Logs
Tìm các dòng:
- `ChatbotService` → Xem có exception không
- `ChatbotController` → Xem request/response
- `RestTemplate` → Xem API call đến Gemini

### Frontend Console
- `Chatbot error:` → Lỗi từ frontend
- `Failed to fetch` → Network issue
- `CORS policy` → CORS issue

## Liên Hệ Hỗ Trợ

Nếu vẫn gặp vấn đề:
1. Copy toàn bộ error message từ console
2. Copy response từ Network tab
3. Copy backend logs
4. Gửi cho team phát triển

---

**Last Updated:** 2025-01-XX

