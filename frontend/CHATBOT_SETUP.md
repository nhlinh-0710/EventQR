# 🤖 Hướng Dẫn Cài Đặt AI Chatbot

## 📋 Tổng Quan

AI Chatbot của EventQR sử dụng **Google Gemini AI** (miễn phí) để:
- ✅ Hiểu ngôn ngữ tự nhiên
- ✅ Trả lời thông minh theo ngữ cảnh
- ✅ Tìm kiếm và gợi ý sự kiện
- ✅ Hướng dẫn người dùng
- ✅ Trò chuyện tự nhiên

---

## 🔑 Lấy API Key (MIỄN PHÍ)

### Bước 1: Truy cập Google AI Studio
Mở trình duyệt và truy cập: https://makersuite.google.com/app/apikey

### Bước 2: Đăng nhập
- Đăng nhập bằng tài khoản Google của bạn
- Chấp nhận điều khoản sử dụng

### Bước 3: Tạo API Key
1. Nhấn nút **"Create API Key"**
2. Chọn project (hoặc tạo project mới)
3. Sao chép API key được tạo ra

### Bước 4: Cấu hình trong code
Mở file: `frontend/js/core/chatbot.js`

Tìm dòng:
```javascript
GEMINI_API_KEY: 'YOUR_API_KEY_HERE'
```

Thay thế bằng API key của bạn:
```javascript
GEMINI_API_KEY: 'AIzaSy...' // API key bạn vừa sao chép
```

---

## 🚀 Sử Dụng

### Khởi Động Server
```bash
# Chạy backend
cd backend
mvn spring-boot:run

# Mở frontend
cd frontend
# Mở file index.html bằng Live Server hoặc trình duyệt
```

### Tính Năng Chatbot

**1. Tìm Kiếm Sự Kiện**
```
User: "Tìm sự kiện công nghệ"
Bot: [Hiển thị danh sách sự kiện phù hợp]
```

**2. Hướng Dẫn Đăng Ký**
```
User: "Làm sao để đăng ký sự kiện?"
Bot: [Hướng dẫn chi tiết từng bước]
```

**3. Trả Lời Câu Hỏi**
```
User: "Sự kiện có miễn phí không?"
Bot: [Trả lời dựa trên AI]
```

**4. Quick Actions**
- Nhấn vào các nút gợi ý để hỏi nhanh
- Chatbot hiểu ngữ cảnh và trả lời phù hợp

---

## 🎨 Tùy Chỉnh

### Thay Đổi Màu Sắc
File: `frontend/css/chatbot.css`

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### Thay Đổi Thông Điệp Chào
File: `frontend/js/core/chatbot.js`

Tìm hàm `responseGenerator.greeting()` và sửa lời chào.

### Thêm Intent Mới
```javascript
// Trong intentEngine.patterns
myIntent: /tu khoa|keyword|pattern/i,

// Trong messageProcessor.process()
case 'myIntent':
  response = 'Câu trả lời của bạn';
  break;
```

---

## 💡 Tips

### Tối Ưu Chi Phí
- Gemini API **MIỄN PHÍ** với 60 requests/phút
- Giới hạn: 1,500 requests/ngày
- Đủ cho hầu hết các trường hợp sử dụng

### Nâng Cấp
Nếu cần nhiều requests hơn:
1. Nâng cấp lên Gemini Pro API (có phí)
2. Hoặc cache câu trả lời thường gặp
3. Kết hợp rule-based cho câu hỏi đơn giản

### Debug
Mở Console (F12) để xem logs:
- ✅ Khởi tạo thành công
- ❌ Lỗi API
- 📊 Intent được nhận dạng

---

## 🔒 Bảo Mật

**⚠️ QUAN TRỌNG:**

**Không nên** đặt API key trực tiếp trong frontend code khi deploy production!

### Giải pháp cho Production:

**Option 1: Proxy qua Backend (Khuyến nghị)**
```java
// Backend: ProxyController.java
@PostMapping("/api/ai/chat")
public ResponseEntity<?> chatProxy(@RequestBody Map<String, String> request) {
    String apiKey = System.getenv("GEMINI_API_KEY");
    // Forward request to Gemini with your API key
    return geminiService.chat(request.get("message"), apiKey);
}
```

Frontend gọi backend thay vì gọi trực tiếp:
```javascript
// frontend/js/core/chatbot.js
const response = await fetch('http://localhost:8080/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userMessage })
});
```

**Option 2: Environment Variables**
- Lưu API key trong file `.env`
- Không commit file `.env` lên Git
- Sử dụng build tool để inject vào code

**Option 3: Server-Side Rendering**
- Render chatbot từ backend
- API key không bao giờ lộ ra client

---

## 📊 Monitoring

### Kiểm Tra Usage
Truy cập: https://console.cloud.google.com/apis/dashboard

Xem:
- Số requests đã dùng
- Quota còn lại
- Lỗi (nếu có)

---

## 🐛 Troubleshooting

### Lỗi: "API key not valid"
✅ Kiểm tra API key đã copy đúng chưa
✅ Đảm bảo không có khoảng trắng thừa
✅ Enable Gemini API trong Google Cloud Console

### Chatbot không hiện
✅ Kiểm tra console có lỗi không
✅ Đảm bảo đã import đúng file CSS và JS
✅ Kiểm tra HTML có đầy đủ elements

### Bot không trả lời
✅ Kiểm tra API key
✅ Kiểm tra internet connection
✅ Xem console logs để debug
✅ Kiểm tra quota API còn không

### Lỗi CORS
✅ Nếu gọi trực tiếp Gemini API, không có vấn đề CORS
✅ Nếu gọi backend, đảm bảo backend đã config CORS

---

## 🎯 Roadmap

- [ ] Voice input (speech-to-text)
- [ ] Rich media responses (images, videos)
- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] Analytics dashboard
- [ ] Integration with calendar
- [ ] Push notifications
- [ ] Personalized recommendations

---

## 📞 Hỗ Trợ

Có vấn đề? Liên hệ:
- 📧 Email: hoviethao20042005@gmail.com
- 📱 Phone: +84 762 886 983

---

## 📄 License

MIT License - Free to use and modify

---

**Chúc bạn thành công! 🚀**

