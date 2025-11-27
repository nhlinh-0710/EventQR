# 🤖 Thiết Lập AI Thực Sự - Hướng Dẫn Chi Tiết

## 🎯 Mục Tiêu
Tích hợp **Google Gemini AI** (miễn phí) để chatbot trả lời thông minh như người thật!

---

## 📝 BƯỚC 1: Lấy API Key (3 phút)

### 1.1. Truy Cập Google AI Studio
Mở trình duyệt và vào: **https://makersuite.google.com/app/apikey**

### 1.2. Đăng Nhập
- Đăng nhập bằng tài khoản Google (Gmail) của bạn
- Nếu chưa có tài khoản Google → Tạo mới miễn phí

### 1.3. Chấp Nhận Điều Khoản
- Đọc và chấp nhận Terms of Service
- Chọn quốc gia: Vietnam

### 1.4. Tạo API Key
**Cách 1 - Nhanh (Khuyến nghị):**
1. Nhấn nút **"Create API key"**
2. Chọn **"Create API key in new project"**
3. Đợi vài giây → API key sẽ hiện ra
4. Nhấn **Copy** để sao chép API key

**Cách 2 - Tạo Project riêng:**
1. Nhấn **"Create API key in existing project"**
2. Chọn project hoặc tạo project mới
3. Đặt tên project: `EventQR-Chatbot`
4. Tạo và copy API key

### 1.5. Lưu API Key
⚠️ **QUAN TRỌNG:** Lưu API key vào nơi an toàn!

API key có dạng:
```
AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

---

## 🔧 BƯỚC 2: Cấu Hình API Key

### 2.1. Mở File Chatbot
```
frontend/js/core/chatbot.js
```

### 2.2. Tìm Dòng Config (Dòng 11)
```javascript
GEMINI_API_KEY: '', // Leave empty to use fallback mode
```

### 2.3. Thay Bằng API Key Của Bạn
```javascript
GEMINI_API_KEY: 'AIzaSy...YOUR_API_KEY_HERE...', // Paste key vừa copy
```

**Ví dụ:**
```javascript
GEMINI_API_KEY: 'AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567',
```

### 2.4. Lưu File
- Nhấn `Ctrl + S` (Windows) hoặc `Cmd + S` (Mac)

---

## ✅ BƯỚC 3: Test Chatbot

### 3.1. Refresh Trang
- Mở `frontend/index.html`
- Nhấn `F5` hoặc `Ctrl + R` để refresh

### 3.2. Mở Chatbot
- Nhấn vào icon 🤖 ở góc phải dưới

### 3.3. Kiểm Tra Console
- Nhấn `F12` để mở Developer Console
- Tab **Console** phải hiển thị:
```
✅ AI Chatbot initialized successfully
```

### 3.4. Test Câu Hỏi
Thử các câu hỏi phức tạp:

**Test 1: Câu hỏi tự nhiên**
```
"Có sự kiện nào về Sơn Tùng MTP không?"
```

**Test 2: Câu hỏi mơ hồ**
```
"Tôi muốn đi sự kiện vui vui"
```

**Test 3: Câu hỏi ngữ cảnh**
```
"EventQR là gì?"
→ Bot trả lời
→ Hỏi tiếp: "Nó có tính năng gì?"
```

Nếu bot trả lời tự nhiên, mượt mà → **THÀNH CÔNG!** 🎉

---

## 🐛 Khắc Phục Lỗi

### Lỗi: "API key not valid"
**Nguyên nhân:** API key sai hoặc chưa được kích hoạt

**Giải pháp:**
1. Kiểm tra API key đã copy đúng chưa
2. Đảm bảo không có khoảng trắng thừa
3. Thử tạo API key mới
4. Đợi 1-2 phút để API key được kích hoạt

### Lỗi: "Failed to fetch"
**Nguyên nhân:** Không có internet hoặc bị chặn

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Tắt VPN/Proxy (nếu có)
3. Thử trình duyệt khác (Chrome khuyến nghị)
4. Kiểm tra firewall

### Lỗi: "Quota exceeded"
**Nguyên nhân:** Đã dùng hết 60 requests/phút

**Giải pháp:**
1. Đợi 1 phút rồi thử lại
2. Giới hạn miễn phí: 1,500 requests/ngày
3. Nếu cần nhiều hơn → Nâng cấp (có phí)

### Bot Không Trả Lời
**Kiểm tra Console (F12):**
- Có lỗi màu đỏ không?
- Copy lỗi và search Google
- Hoặc liên hệ hỗ trợ

---

## 📊 Giới Hạn Miễn Phí

| Tiêu Chí | Giới Hạn | Đủ Dùng? |
|----------|----------|----------|
| Requests/phút | 60 | ✅ Đủ |
| Requests/ngày | 1,500 | ✅ Đủ |
| Requests/tháng | 45,000 | ✅ Quá đủ |
| Chi phí | $0 | 🎉 Miễn phí |

**Ước tính thực tế:**
- 1 user: ~5-10 messages
- 100 users/ngày: 500-1,000 requests
- **→ Đủ cho 100-300 users/ngày!**

---

## 🔒 Bảo Mật (Quan Trọng!)

### ⚠️ Vấn Đề Hiện Tại
API key đang để **trong frontend code** → Ai cũng có thể xem được!

### ✅ Giải Pháp Cho Production

#### **Option 1: Proxy qua Backend (Tốt nhất)**

**Bước 1:** Tạo Backend Proxy

```java
// backend/.../AIProxyController.java
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIProxyController {
    
    private static final String GEMINI_API_KEY = System.getenv("GEMINI_API_KEY");
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        
        // Call Gemini API từ backend
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> body = new HashMap<>();
        // ... build request body
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String url = GEMINI_API_URL + "?key=" + GEMINI_API_KEY;
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        
        return ResponseEntity.ok(response.getBody());
    }
}
```

**Bước 2:** Lưu API Key trong Environment Variable

```bash
# Windows
set GEMINI_API_KEY=AIzaSy...YOUR_KEY...

# Linux/Mac
export GEMINI_API_KEY=AIzaSy...YOUR_KEY...
```

**Bước 3:** Update Frontend

```javascript
// frontend/js/core/chatbot.js
async callGeminiAI(userMessage) {
    // Thay vì gọi trực tiếp Gemini
    // Gọi backend proxy
    const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    
    return await response.json();
}
```

#### **Option 2: Environment Variables (Build Tool)**

```javascript
// webpack.config.js hoặc vite.config.js
export default {
    define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
    }
}
```

---

## 📈 Nâng Cấp (Nếu Cần)

### Khi Nào Cần Nâng Cấp?
- Traffic > 300 users/ngày
- Cần > 1,500 requests/ngày
- Cần response nhanh hơn
- Cần priority support

### Giá Nâng Cấp
- Gemini Pro API: ~$0.001 - $0.003 per request
- 1,000 requests ≈ $1 - $3
- Khá rẻ so với OpenAI!

---

## 🎨 Tùy Chỉnh AI

### Thay Đổi Personality

```javascript
// frontend/js/core/chatbot.js
const systemContext = `Bạn là Mai - trợ lý AI thân thiện của EventQR.
Tính cách: Nhiệt tình, vui vẻ, hay dùng emoji.
Phong cách: Trẻ trung, gần gũi, ngắn gọn.
Ngôn ngữ: Tiếng Việt tự nhiên.`;
```

### Thay Đổi Độ "Sáng Tạo"

```javascript
generationConfig: {
  temperature: 0.9,  // 0 = strict, 1 = creative
  maxOutputTokens: 500,  // Độ dài tối đa
}
```

---

## ✨ So Sánh Trước & Sau

### ❌ TRƯỚC (Rule-based)
```
User: "Có sự kiện Sơn Tùng MTP không?"
Bot: "Hiện tại chưa tìm thấy sự kiện phù hợp."
```

### ✅ SAU (AI-powered)
```
User: "Có sự kiện Sơn Tùng MTP không?"
Bot: "Hiện tại trên hệ thống EventQR chưa có sự kiện nào về ca sĩ 
      Sơn Tùng MTP. Tuy nhiên, bạn có thể:
      • Đăng ký nhận thông báo khi có sự kiện âm nhạc mới
      • Xem các sự kiện giải trí khác đang diễn ra
      • Đề xuất với BTC để họ tổ chức sự kiện này
      
      Bạn quan tâm đến loại sự kiện nào khác không? 🎵"
```

**→ Tự nhiên, hiểu ngữ cảnh, thân thiện hơn rất nhiều!**

---

## 📞 Hỗ Trợ

### Cần Giúp Đỡ?
- 📧 Email: hoviethao20042005@gmail.com
- 📱 Phone: +84 762 886 983
- 💬 Hoặc hỏi chatbot: "Tôi cần hỗ trợ setup AI"

### Tài Liệu Tham Khảo
- Google AI Studio: https://makersuite.google.com
- Gemini API Docs: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing

---

## 🎉 Hoàn Thành!

Sau khi setup xong:
1. ✅ Chatbot hiểu ngôn ngữ tự nhiên
2. ✅ Trả lời thông minh theo ngữ cảnh
3. ✅ Ghi nhớ conversation
4. ✅ Personality thân thiện
5. ✅ 100% miễn phí (trong giới hạn)

**Chúc bạn thành công! 🚀**

---

**Created with ❤️ for EventQR**

