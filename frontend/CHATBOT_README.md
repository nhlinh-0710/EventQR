# 🤖 Trợ Lý AI - Hướng Dẫn Nhanh

## ✨ Đã Hoàn Thành!

Trợ lý AI đã được tích hợp vào trang chủ của bạn với:

✅ Giao diện đẹp, hiện đại (theo mockup)
✅ Hoạt động 100% offline (không cần API key)
✅ Hiểu câu hỏi bằng tiếng Việt tự nhiên
✅ Tìm kiếm sự kiện từ backend
✅ Trả lời FAQ thông minh
✅ Quick Actions gợi ý

---

## 🚀 Sử Dụng Ngay

### 1. Mở Trang Chủ
```
frontend/index.html
```

### 2. Nhấn Vào Icon 🤖 Ở Góc Phải Dưới

### 3. Hỏi Bot Bất Kỳ Câu Gì, Ví Dụ:
- "Có sự kiện gì hay không?"
- "Làm sao để đăng ký?"
- "Tôi muốn xem vé của mình"
- "EventQR có tính năng gì?"
- "Tìm sự kiện công nghệ"

---

## 🎨 2 Phiên Bản

### 🟢 Phiên Bản 1: Simple (Đang Dùng - Khuyến Nghị)
**File:** `js/core/chatbot-simple.js`

**Ưu điểm:**
- ✅ Không cần API key
- ✅ Hoạt động offline 100%
- ✅ Nhanh, không tốn phí
- ✅ Trả lời chính xác các câu hỏi phổ biến

**Nhược điểm:**
- ❌ Không hiểu câu hỏi phức tạp lắm
- ❌ Cần thêm keywords vào knowledge base

---

### 🔵 Phiên Bản 2: AI-Powered (Tùy Chọn)
**File:** `js/core/chatbot.js`

**Ưu điểm:**
- ✅ Hiểu ngữ cảnh phức tạp
- ✅ Trả lời linh hoạt, tự nhiên hơn
- ✅ Học từ conversation

**Nhược điểm:**
- ❌ Cần Gemini API key (miễn phí)
- ❌ Cần internet connection
- ❌ Giới hạn 1,500 requests/ngày

**Cách Chuyển Sang AI Version:**

1. Lấy API key miễn phí: https://makersuite.google.com/app/apikey

2. Sửa trong `js/core/chatbot.js`:
```javascript
GEMINI_API_KEY: 'YOUR_API_KEY_HERE' // Thay bằng key của bạn
```

3. Trong `index.html`, đổi dòng:
```html
<!-- Tắt Simple -->
<!-- <script src="js/core/chatbot-simple.js"></script> -->

<!-- Bật AI -->
<script src="js/core/chatbot.js"></script>
```

---

## 🎯 Tính Năng Hiện Tại

### ✅ Hỏi Đáp FAQ
- Cách đăng ký sự kiện
- Check-in với QR code
- Xem vé đã mua
- Hủy đăng ký
- Liên hệ hỗ trợ
- Tổ chức sự kiện
- Và nhiều hơn nữa...

### ✅ Tìm Kiếm Sự Kiện
Bot tích hợp với backend để tìm sự kiện thực tế:
```
User: "Tìm sự kiện công nghệ"
Bot: [Hiển thị danh sách sự kiện từ database]
```

### ✅ Quick Actions
Các nút gợi ý giúp người dùng hỏi nhanh:
- 🔍 Tìm sự kiện
- 📝 Cách đăng ký  
- 🎫 Xem vé
- ❓ Tính năng

---

## 🔧 Tùy Chỉnh

### Thêm Câu Hỏi FAQ Mới
File: `js/core/chatbot-simple.js`

Tìm `knowledgeBase.faq` và thêm:
```javascript
{
  keywords: ['tu khoa 1', 'từ khóa 2', 'keyword'],
  answer: `Câu trả lời của bạn ở đây...`
}
```

### Đổi Màu Sắc
File: `css/chatbot.css`

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Đổi màu gradient ở đây */
}
```

### Đổi Lời Chào
File: `js/core/chatbot-simple.js`

Tìm `knowledgeBase.greetings` và sửa/thêm lời chào mới.

---

## 📊 Knowledge Base Hiện Tại

Bot đã biết trả lời về:
1. ✅ Đăng ký sự kiện
2. ✅ Check-in QR
3. ✅ Giá & phí
4. ✅ Quản lý vé
5. ✅ Hủy đăng ký
6. ✅ Tìm kiếm sự kiện
7. ✅ Liên hệ hỗ trợ
8. ✅ Quản lý tài khoản
9. ✅ Tổ chức sự kiện
10. ✅ Tính năng hệ thống

**Tổng cộng:** 10+ chủ đề với 50+ keywords

---

## 🐛 Troubleshooting

### Chatbot Không Hiện
✅ Kiểm tra file `chatbot.css` đã được import
✅ Kiểm tra file `chatbot-simple.js` đã được import
✅ Mở Console (F12) xem có lỗi không

### Bot Không Tìm Được Sự Kiện
✅ Kiểm tra backend đã chạy chưa (port 8080)
✅ Kiểm tra CORS đã được config
✅ Xem Console có lỗi API không

### Bot Không Trả Lời Đúng
✅ Thêm keywords vào knowledge base
✅ Hoặc chuyển sang AI version (chatbot.js)

---

## 📈 Nâng Cấp Trong Tương Lai

- [ ] Voice input (nói thay vì gõ)
- [ ] Multi-language (English support)
- [ ] Rich media (hình ảnh, video)
- [ ] History persistence (lưu lịch sử chat)
- [ ] Personalization (cá nhân hóa)
- [ ] Analytics (thống kê usage)

---

## 🎉 Demo

### Câu Hỏi Mẫu Để Test:

1. "Xin chào" → Lời chào + Quick Actions
2. "Làm sao để đăng ký sự kiện?" → Hướng dẫn từng bước
3. "Tìm sự kiện công nghệ" → Tìm kiếm từ backend
4. "EventQR có tính năng gì?" → Liệt kê tính năng
5. "Liên hệ hỗ trợ" → Thông tin liên hệ
6. "Cảm ơn" → Lời cảm ơn

---

## 💡 Tips

1. **Offline First**: Phiên bản Simple hoạt động tốt cho 90% use case
2. **Upgrade When Needed**: Chỉ chuyển sang AI khi cần xử lý câu hỏi phức tạp
3. **Expand Knowledge Base**: Thêm keywords theo feedback người dùng
4. **Monitor Usage**: Xem người dùng hỏi gì để cải thiện

---

## 📞 Support

Có thắc mắc? Liên hệ:
📧 hoviethao20042005@gmail.com
📱 +84 762 886 983

---

**Chúc bạn thành công với EventQR! 🚀**

