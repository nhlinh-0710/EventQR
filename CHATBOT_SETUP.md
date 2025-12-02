# 🤖 Hướng Dẫn Cấu Hình AI Chatbot

## Tổng Quan

Chatbot AI đã được tích hợp vào hệ thống EventQR với khả năng:
- ✅ Trả lời câu hỏi về sự kiện
- ✅ Hướng dẫn đăng ký tham gia
- ✅ Giải đáp về QR check-in
- ✅ Gợi ý sự kiện phù hợp
- ✅ Hỗ trợ 24/7 tự động

## Cấu Hình Backend

### 1. Lấy Google Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Copy API key

### 2. Cấu Hình application.properties

Mở file `backend/src/main/resources/application.properties` và thêm:

```properties
# Google Gemini AI Configuration
gemini.api.key=YOUR_API_KEY_HERE
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

**Lưu ý:** Nếu không có API key, chatbot vẫn hoạt động với các câu trả lời mặc định (không cần AI).

### 3. Restart Backend

Sau khi cấu hình, restart backend server:

```bash
cd backend
mvn spring-boot:run
```

## Sử Dụng Chatbot

### Trên Frontend

Chatbot sẽ tự động xuất hiện dưới dạng nút floating ở góc dưới bên phải màn hình.

**Các trang đã tích hợp:**
- ✅ `frontend/index.html` - Trang chủ
- ✅ `frontend/pages/user/index.html` - Dashboard người dùng
- ✅ `frontend/pages/admin/index.html` - Dashboard admin

### Tính Năng

1. **Quick Actions**: Các nút nhanh để hỏi về:
   - 📅 Sự kiện sắp diễn ra
   - 🎫 Hướng dẫn đăng ký
   - 📱 QR Code check-in

2. **Chat Interface**: 
   - Giao diện chat đẹp mắt, hiện đại
   - Typing indicator khi AI đang xử lý
   - Lịch sử tin nhắn
   - Responsive trên mọi thiết bị

3. **Context-Aware**:
   - Chatbot tự động lấy thông tin sự kiện từ database
   - Trả lời dựa trên dữ liệu thực tế
   - Personalized responses

## API Endpoints

### POST `/api/chatbot/chat`

Gửi tin nhắn đến chatbot.

**Request:**
```json
{
  "message": "Xin chào",
  "conversationId": "conv_1234567890",
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Xin chào! Tôi là trợ lý AI của EventQR...",
  "conversationId": "conv_1234567890",
  "error": null
}
```

### GET `/api/chatbot/health`

Kiểm tra trạng thái chatbot service.

**Response:**
```json
{
  "status": "ok",
  "service": "chatbot"
}
```

## Tùy Chỉnh

### Thay Đổi Giao Diện

Chỉnh sửa file `frontend/css/chatbot.css` để thay đổi:
- Màu sắc
- Kích thước
- Vị trí
- Animation

### Thay Đổi Logic

Chỉnh sửa file `frontend/js/core/chatbot.js` để:
- Thêm quick actions mới
- Thay đổi welcome message
- Customize behavior

### Thay Đổi AI Prompts

Chỉnh sửa method `buildPrompt()` trong `ChatbotService.java` để:
- Thay đổi tone của AI
- Thêm context mới
- Customize responses

## Troubleshooting

### Chatbot không hiển thị

1. Kiểm tra console browser có lỗi không
2. Đảm bảo đã include `chatbot.css` và `chatbot.js`
3. Kiểm tra đường dẫn file CSS/JS

### API không hoạt động

1. Kiểm tra backend đã chạy chưa (`http://localhost:8080`)
2. Kiểm tra CORS configuration
3. Kiểm tra API key Gemini (nếu dùng AI)

### AI không trả lời

1. Kiểm tra API key trong `application.properties`
2. Kiểm tra kết nối internet
3. Kiểm tra logs backend để xem lỗi chi tiết

## Fallback Mode

Nếu không có Gemini API key hoặc API lỗi, chatbot sẽ tự động chuyển sang **Fallback Mode** với các câu trả lời mặc định thông minh dựa trên pattern matching.

## Bảo Mật

⚠️ **Lưu ý quan trọng:**
- Không commit API key vào Git
- Sử dụng environment variables cho production
- Giới hạn rate limiting cho API calls
- Validate input từ user

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs backend
2. Kiểm tra console browser
3. Xem file này để troubleshoot
4. Liên hệ team phát triển

---

**Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Author:** EventQR Team

