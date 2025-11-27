# 📚 EventQR Chatbot - Tài Liệu Đầy Đủ

## 🎯 Bắt Đầu Từ Đây!

### Bạn muốn gì?

#### 1️⃣ Sử dụng chatbot hiện tại (Simple)
✅ **Không cần làm gì!** Chatbot đã hoạt động!
- Mở: `index.html`
- Nhấn icon 🤖
- Bắt đầu chat!

#### 2️⃣ Nâng cấp lên AI thật (3 phút)
🚀 **Khuyến nghị!**
- Mở: `setup-ai.html` ← **BẮT ĐẦU TẠI ĐÂY**
- Follow hướng dẫn interactive
- Hoặc đọc: `AI_QUICKSTART.md`

#### 3️⃣ Tìm hiểu chi tiết
📖 Đọc: `CHATBOT_FINAL_README.md`

---

## 📁 Danh Mục Tài Liệu

### 🚀 Quick Start (Đọc đầu tiên)

| File | Mô Tả | Thời Gian |
|------|-------|-----------|
| [`setup-ai.html`](setup-ai.html) | ⭐ **Hướng dẫn trực quan** setup AI | 3 phút |
| [`AI_QUICKSTART.md`](AI_QUICKSTART.md) | 📝 Hướng dẫn nhanh text | 2 phút đọc |

### 📘 Hướng Dẫn Chi Tiết

| File | Mô Tả | Khi Nào Đọc |
|------|-------|-------------|
| [`CHATBOT_FINAL_README.md`](CHATBOT_FINAL_README.md) | 📚 **Tài liệu hoàn chỉnh** | Muốn hiểu hết |
| [`SETUP_AI.md`](SETUP_AI.md) | 🔧 Setup AI chi tiết + Bảo mật | Production |
| [`CHATBOT_README.md`](CHATBOT_README.md) | 📖 Tổng quan features | Tham khảo |

### 🧪 Test & Demo

| File | Mô Tả |
|------|-------|
| [`test-chatbot.html`](test-chatbot.html) | Test chatbot nhanh |
| [`index.html`](index.html) | Trang chủ với chatbot |

### 💻 Source Code

| File | Mô Tả | Trạng Thái |
|------|-------|-----------|
| [`js/core/chatbot-simple.js`](js/core/chatbot-simple.js) | Simple version | ✅ Đang dùng |
| [`js/core/chatbot.js`](js/core/chatbot.js) | AI version | ⭐ Nâng cao |
| [`css/chatbot.css`](css/chatbot.css) | Styles | - |

---

## 🎓 Learning Path

### Cấp Độ 1: Người Dùng Cơ Bản
```
1. Mở index.html
2. Chat với bot
3. Test các tính năng
```

### Cấp Độ 2: Setup AI (Khuyến Nghị)
```
1. Mở setup-ai.html
2. Lấy API key
3. Config và test
```

### Cấp Độ 3: Customization
```
1. Đọc CHATBOT_FINAL_README.md
2. Sửa colors, personality
3. Thêm FAQ riêng
```

### Cấp Độ 4: Production Ready
```
1. Đọc SETUP_AI.md → Bảo mật
2. Setup backend proxy
3. Monitor & optimize
```

---

## 🔍 Tìm Nhanh

### Câu Hỏi Thường Gặp

**Q: Làm sao setup AI nhanh nhất?**
→ Mở [`setup-ai.html`](setup-ai.html)

**Q: Tôi muốn đổi màu chatbot?**
→ Xem [`CHATBOT_FINAL_README.md`](CHATBOT_FINAL_README.md) → Section "Tùy Chỉnh"

**Q: Thêm câu hỏi FAQ mới?**
→ Sửa file `js/core/chatbot-simple.js` → `knowledgeBase.faq`

**Q: Chatbot không hoạt động?**
→ Xem [`CHATBOT_FINAL_README.md`](CHATBOT_FINAL_README.md) → Section "Troubleshooting"

**Q: AI version vs Simple version?**
→ Xem [`CHATBOT_FINAL_README.md`](CHATBOT_FINAL_README.md) → Section "So Sánh"

**Q: Bảo mật API key?**
→ Xem [`SETUP_AI.md`](SETUP_AI.md) → Section "Bảo Mật"

---

## 🚀 Quick Commands

### Setup AI (Copy & Paste)
```bash
# 1. Lấy API key
open https://makersuite.google.com/app/apikey

# 2. Mở file config
code frontend/js/core/chatbot.js

# 3. Tìm dòng 11 và thay:
GEMINI_API_KEY: 'YOUR_API_KEY_HERE'

# 4. Test
open frontend/index.html
```

### Chuyển Version
```html
<!-- Simple → AI -->
<!-- <script src="js/core/chatbot-simple.js"></script> -->
<script src="js/core/chatbot.js"></script>

<!-- AI → Simple -->
<script src="js/core/chatbot-simple.js"></script>
<!-- <script src="js/core/chatbot.js"></script> -->
```

---

## 📊 Tổng Kết Nhanh

| Tiêu Chí | Simple | AI |
|----------|--------|-----|
| Setup | ✅ Không cần | 3 phút |
| Chi phí | $0 | $0 (limit) |
| Thông minh | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Docs | CHATBOT_README.md | SETUP_AI.md |

---

## 🎯 Roadmap Học Tập

### Week 1: Basics
- [ ] Test Simple chatbot
- [ ] Đọc AI_QUICKSTART.md
- [ ] Setup AI version
- [ ] So sánh 2 versions

### Week 2: Customization
- [ ] Đọc CHATBOT_FINAL_README.md
- [ ] Đổi colors
- [ ] Thêm FAQ
- [ ] Custom personality (AI)

### Week 3: Production
- [ ] Đọc SETUP_AI.md
- [ ] Setup backend proxy
- [ ] Security best practices
- [ ] Monitor usage

---

## 💡 Tips

✅ **Bắt đầu đơn giản:** Dùng Simple version trước
✅ **Nâng cấp khi cần:** Chuyển sang AI khi traffic tăng
✅ **Đọc docs đúng lúc:** Không cần đọc hết ngay
✅ **Test trước khi deploy:** Dùng test-chatbot.html

---

## 📞 Liên Hệ & Hỗ Trợ

### Cần Giúp Đỡ?
- 📧 **Email:** hoviethao20042005@gmail.com
- 📱 **Phone:** +84 762 886 983
- 💬 **Chat:** Hỏi chatbot "Tôi cần hỗ trợ"

### Tài Nguyên Bên Ngoài
- 🤖 Google AI Studio: https://makersuite.google.com
- 📖 Gemini Docs: https://ai.google.dev/docs
- 💰 Pricing: https://ai.google.dev/pricing

---

## 🎉 Bắt Đầu Ngay!

### Option 1: Nhanh Nhất (Khuyến Nghị)
```
Mở: frontend/setup-ai.html
```

### Option 2: Đọc Trước
```
Đọc: AI_QUICKSTART.md (2 phút)
```

### Option 3: Tìm Hiểu Kỹ
```
Đọc: CHATBOT_FINAL_README.md (10 phút)
```

---

**Chọn một cách và bắt đầu! 🚀**

---

*EventQR Chatbot v1.0 - Documentation Index*
*Last Updated: Nov 2025*
*Made with ❤️*

