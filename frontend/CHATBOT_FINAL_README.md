# 🤖 EventQR AI Chatbot - Hướng Dẫn Hoàn Chỉnh

## 📦 Tổng Quan

Chatbot AI thông minh cho EventQR với 2 phiên bản:
- **Simple Version** ✅ Đang dùng - Rule-based, offline, miễn phí
- **AI Version** 🤖 Tùy chọn - Google Gemini AI, thông minh hơn

---

## 🚀 Quick Start

### Đang Dùng: Simple Version (Không Cần Setup)
✅ Đã hoạt động ngay!
- Mở `frontend/index.html`
- Nhấn icon 🤖 ở góc phải dưới
- Hỏi bất kỳ câu gì

### Muốn AI Thực Sự? (Khuyến Nghị)

#### 🎯 CÁCH NHANH NHẤT (3 phút):
```
1. Mở: frontend/setup-ai.html
2. Follow hướng dẫn trên màn hình
3. Done! 🎉
```

#### 📝 CÁCH THỦ CÔNG:
Xem: `AI_QUICKSTART.md`

---

## 📁 Cấu Trúc Files

```
frontend/
├── index.html                    # Trang chủ (có chatbot)
├── test-chatbot.html            # Test chatbot
├── setup-ai.html                # Setup AI (interactive)
│
├── js/core/
│   ├── chatbot-simple.js        # ✅ Đang dùng (Simple version)
│   └── chatbot.js               # AI version (cần API key)
│
├── css/
│   └── chatbot.css              # Style đẹp
│
└── Docs/
    ├── AI_QUICKSTART.md         # Hướng dẫn nhanh 3 phút
    ├── SETUP_AI.md              # Hướng dẫn chi tiết
    ├── CHATBOT_README.md        # Tổng quan
    └── CHATBOT_SETUP.md         # Setup ban đầu
```

---

## 🎯 Chọn Phiên Bản Nào?

### 🟢 Simple Version (Đang Dùng)

**Ưu điểm:**
- ✅ Không cần setup gì cả
- ✅ Hoạt động 100% offline
- ✅ Nhanh, không tốn phí
- ✅ Trả lời chính xác các câu hỏi phổ biến

**Nhược điểm:**
- ❌ Chỉ hiểu theo keywords
- ❌ Không linh hoạt với câu hỏi phức tạp
- ❌ Không ghi nhớ ngữ cảnh

**Phù hợp cho:**
- MVP, prototype
- Traffic thấp-trung bình
- Budget $0
- Câu hỏi lặp lại, có quy luật

---

### 🔵 AI Version (Khuyến Nghị)

**Ưu điểm:**
- ✅ Hiểu ngôn ngữ tự nhiên
- ✅ Trả lời linh hoạt, thông minh
- ✅ Ghi nhớ ngữ cảnh conversation
- ✅ Personality thân thiện
- ✅ Vẫn miễn phí (có giới hạn)

**Nhược điểm:**
- ❌ Cần API key (free)
- ❌ Cần internet
- ❌ Giới hạn: 1,500 requests/ngày

**Phù hợp cho:**
- Production app
- Traffic cao
- Cần UX tốt nhất
- Câu hỏi đa dạng, phức tạp

---

## 🔄 Chuyển Đổi Giữa 2 Phiên Bản

### Từ Simple → AI:

**File:** `frontend/index.html`

```html
<!-- TẮT Simple -->
<!-- <script src="js/core/chatbot-simple.js"></script> -->

<!-- BẬT AI -->
<script src="js/core/chatbot.js"></script>
```

Sau đó setup API key (xem `setup-ai.html`)

### Từ AI → Simple:

```html
<!-- BẬT Simple -->
<script src="js/core/chatbot-simple.js"></script>

<!-- TẮT AI -->
<!-- <script src="js/core/chatbot.js"></script> -->
```

Lưu và refresh → Xong!

---

## 🎨 Tùy Chỉnh

### 1. Thay Đổi Màu Sắc

**File:** `frontend/css/chatbot.css`

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### 2. Thêm FAQ (Simple Version)

**File:** `frontend/js/core/chatbot-simple.js`

Tìm `knowledgeBase.faq` và thêm:

```javascript
{
  keywords: ['từ khóa 1', 'keyword 2'],
  answer: `Câu trả lời của bạn...`
}
```

### 3. Đổi Personality (AI Version)

**File:** `frontend/js/core/chatbot.js`

Tìm `systemContext` và sửa:

```javascript
const systemContext = `Bạn là Mai - trợ lý AI của EventQR.
Tính cách: Vui vẻ, nhiệt tình, hài hước.
Phong cách: Trẻ trung, thân thiện, hay dùng emoji.
Ngôn ngữ: Tiếng Việt tự nhiên.`;
```

---

## 📊 So Sánh Chi Tiết

| Tiêu Chí | Simple | AI |
|----------|--------|-----|
| Setup | ✅ Không cần | ⚠️ Cần API key |
| Chi phí | 💰 $0 | 💰 $0 (có limit) |
| Offline | ✅ 100% | ❌ Cần internet |
| Tốc độ | ⚡ Instant | ⏱️ ~1-2s |
| Hiểu ngữ cảnh | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Linh hoạt | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Maintenance | 🔧 Cần update KB | 🤖 Tự động |
| Scalability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (limit) |
| UX | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 Use Cases

### Simple Version Phù Hợp Cho:
- ✅ FAQ đơn giản (10-20 câu hỏi)
- ✅ Hướng dẫn cơ bản
- ✅ Prototype/MVP
- ✅ Traffic không đều
- ✅ Budget = $0

### AI Version Phù Hợp Cho:
- ✅ Customer support thực tế
- ✅ Câu hỏi phức tạp, đa dạng
- ✅ Production app
- ✅ Cần UX cao
- ✅ Budget nhỏ (vẫn free trong limit)

---

## 🔐 Bảo Mật (Quan Trọng!)

### ⚠️ Vấn Đề Hiện Tại
API key đang ở **frontend code** → Ai cũng xem được!

### ✅ Giải Pháp Production

#### Option 1: Backend Proxy (Tốt nhất)
```
Frontend → Backend Proxy → Gemini API
          (API key ở đây)
```

**Code mẫu:** Xem `SETUP_AI.md` → Section "Bảo Mật"

#### Option 2: Environment Variables
```bash
# .env file (không commit lên Git)
GEMINI_API_KEY=AIzaSy...
```

#### Option 3: API Gateway
```
Frontend → AWS API Gateway → Lambda → Gemini
                            (Key ở đây)
```

**Khuyến nghị:** Dùng Option 1 cho production!

---

## 📈 Monitoring & Analytics

### Theo Dõi Usage

**Simple Version:**
```javascript
// Thêm vào chatbot-simple.js
function logMessage(intent, message) {
  console.log('Intent:', intent, 'Message:', message);
  // Gửi lên analytics service
  gtag('event', 'chatbot_message', {
    intent: intent,
    message: message
  });
}
```

**AI Version:**
Xem usage tại: https://console.cloud.google.com/apis/dashboard

### Metrics Quan Trọng
- 📊 Số messages/ngày
- 🎯 Intent phổ biến
- ⏱️ Response time
- 👍 Satisfaction rate
- 🔁 Retention rate

---

## 🐛 Troubleshooting

### Simple Version

**Lỗi:** "Chatbot không hiện"
- ✅ Kiểm tra `chatbot.css` đã import
- ✅ Kiểm tra `chatbot-simple.js` đã import
- ✅ Mở Console (F12) xem lỗi

**Lỗi:** "Bot không tìm được sự kiện"
- ✅ Backend có chạy không? (port 8080)
- ✅ CORS đã config chưa?
- ✅ Xem Console có lỗi API không

### AI Version

**Lỗi:** "API key not valid"
- ✅ Copy đầy đủ API key
- ✅ Không có khoảng trắng
- ✅ Đợi 1-2 phút kích hoạt

**Lỗi:** "Quota exceeded"
- ✅ Đã dùng hết 60 requests/phút
- ✅ Đợi 1 phút
- ✅ Hoặc upgrade plan

**Lỗi:** "Failed to fetch"
- ✅ Kiểm tra internet
- ✅ Tắt VPN/Firewall
- ✅ Thử trình duyệt khác

---

## 🚀 Roadmap

### Phase 1 (Done ✅)
- [x] Simple chatbot với UI đẹp
- [x] AI integration (Gemini)
- [x] FAQ knowledge base
- [x] Event search integration
- [x] Quick actions

### Phase 2 (Next)
- [ ] Voice input (speech-to-text)
- [ ] Multi-language support
- [ ] Rich media responses
- [ ] Conversation history
- [ ] User preferences

### Phase 3 (Future)
- [ ] Sentiment analysis
- [ ] Proactive suggestions
- [ ] A/B testing
- [ ] Analytics dashboard
- [ ] Mobile app integration

---

## 📞 Hỗ Trợ

### Tài Liệu
- 📖 Quick Start: `AI_QUICKSTART.md`
- 📘 Chi Tiết: `SETUP_AI.md`
- 📗 Overview: `CHATBOT_README.md`

### Setup Interactive
- 🎯 `setup-ai.html` - Hướng dẫn trực quan

### Liên Hệ
- 📧 Email: hoviethao20042005@gmail.com
- 📱 Phone: +84 762 886 983
- 💬 Chat: Hỏi chatbot "Tôi cần hỗ trợ"

### Tài Nguyên
- Google AI Studio: https://makersuite.google.com
- Gemini Docs: https://ai.google.dev/docs
- API Pricing: https://ai.google.dev/pricing

---

## 💡 Tips & Best Practices

### 1. Start Simple
Bắt đầu với Simple version → Thu thập feedback → Chuyển sang AI nếu cần

### 2. Monitor Usage
Track metrics để quyết định khi nào upgrade

### 3. Expand Knowledge Base
Thêm FAQ dựa trên câu hỏi thực tế của users

### 4. Optimize Costs
- Cache common responses
- Use Simple version cho câu hỏi đơn giản
- AI version cho câu phức tạp

### 5. Security First
Luôn dùng backend proxy cho production

---

## 🎉 Kết Luận

**Hiện tại:** Bạn có chatbot Simple đang hoạt động tốt! ✅

**Muốn nâng cấp?** 
1. Mở `frontend/setup-ai.html`
2. Follow hướng dẫn 3 phút
3. Enjoy AI thông minh! 🤖✨

**Cần hỗ trợ?** Liên hệ qua email/phone bên trên!

---

**Made with ❤️ for EventQR**

*Version 1.0 - Updated Nov 2025*

