# 🚀 Thiết Lập AI Trong 3 Phút

## 📌 TL;DR (Quá Dài Không Đọc)

```bash
1. Vào: https://makersuite.google.com/app/apikey
2. Đăng nhập Gmail → Tạo API key → Copy
3. Mở: frontend/js/core/chatbot.js
4. Tìm dòng 11: GEMINI_API_KEY: ''
5. Thay bằng: GEMINI_API_KEY: 'AIzaSy...YOUR_KEY...'
6. Lưu & Refresh trang
7. XONG! 🎉
```

---

## 🎯 Hướng Dẫn Trực Quan

### Option 1: Mở Trang Setup
```
Mở file: frontend/setup-ai.html
```
→ Follow hướng dẫn từng bước với giao diện đẹp!

### Option 2: Làm Thủ Công (3 bước)

**BƯỚC 1: Lấy API Key**
- Vào: https://makersuite.google.com/app/apikey
- Login Gmail
- Create API key
- Copy key (dạng: AIzaSy...)

**BƯỚC 2: Paste Vào Code**
```javascript
// Mở file: frontend/js/core/chatbot.js
// Dòng 11, thay:

GEMINI_API_KEY: '', // ❌ Trước

GEMINI_API_KEY: 'AIzaSyAbCd...YOUR_KEY...', // ✅ Sau
```

**BƯỚC 3: Test**
- Lưu file (Ctrl+S)
- Refresh trang (F5)
- Nhấn icon 🤖
- Hỏi: "Có sự kiện Sơn Tùng MTP không?"
- Nếu trả lời tự nhiên → Thành công! 🎉

---

## ❓ FAQ Nhanh

**Q: Có mất tiền không?**
A: KHÔNG! Hoàn toàn miễn phí. Giới hạn: 1,500 requests/ngày (quá đủ dùng).

**Q: Có cần thẻ tín dụng không?**
A: KHÔNG! Chỉ cần tài khoản Gmail.

**Q: API key có an toàn không?**
A: Cho development thì OK. Production nên dùng backend proxy (xem SETUP_AI.md).

**Q: Bot vẫn không thông minh?**
A: Kiểm tra:
1. API key đã paste đúng chưa?
2. Đã lưu file chưa?
3. Đã refresh trang chưa?
4. Mở Console (F12) xem có lỗi không?

**Q: Lỗi "API key not valid"?**
A: 
- Copy lại API key (không có khoảng trắng)
- Đợi 1-2 phút để key được kích hoạt
- Thử tạo key mới

---

## 💡 So Sánh Trước & Sau

### ❌ KHÔNG CÓ AI
```
User: "Có sự kiện Sơn Tùng MTP không?"
Bot: "Hiện tại chưa tìm thấy sự kiện phù hợp."
```
→ Khô khan, không thân thiện

### ✅ CÓ AI
```
User: "Có sự kiện Sơn Tùng MTP không?"
Bot: "Hiện tại EventQR chưa có sự kiện về ca sĩ Sơn Tùng MTP. 
      Nhưng bạn có thể:
      • Đăng ký nhận thông báo khi có sự kiện âm nhạc mới
      • Xem các concert/liveshow khác đang có
      • Đề xuất với BTC để tổ chức sự kiện này
      
      Bạn thích loại nhạc nào? Tôi có thể gợi ý sự kiện phù hợp! 🎵"
```
→ Tự nhiên, thân thiện, gợi ý cụ thể!

---

## 🎁 Bonus Features Khi Có AI

1. ✅ **Hiểu ngữ cảnh**: "Nó ở đâu?" → Bot biết "nó" là sự kiện vừa nói
2. ✅ **Trả lời linh hoạt**: Không bị giới hạn bởi keywords
3. ✅ **Ghi nhớ cuộc hội thoại**: Trả lời dựa trên context
4. ✅ **Personality**: Vui vẻ, thân thiện, hay dùng emoji
5. ✅ **Tự cải thiện**: Học từ mỗi cuộc chat

---

## 📞 Cần Giúp?

**Cách 1: Mở trang hướng dẫn trực quan**
```
frontend/setup-ai.html
```

**Cách 2: Đọc hướng dẫn chi tiết**
```
frontend/SETUP_AI.md
```

**Cách 3: Liên hệ trực tiếp**
- 📧 hoviethao20042005@gmail.com
- 📱 +84 762 886 983

---

## ⚡ Troubleshooting 1 Dòng

```
Không hoạt động? → F12 xem Console → Copy lỗi → Google Search
API key lỗi? → Tạo key mới → Copy lại → Paste lại
Bot ngu? → Chưa có API key hoặc key sai
Lỗi "quota"? → Đợi 1 phút (đã dùng hết 60 requests/phút)
```

---

**Chỉ 3 phút thôi! Làm ngay đi! 🚀**

---

*Created with ❤️ for EventQR*

