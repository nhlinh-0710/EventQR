# ✅ Kích Hoạt AI Mode (Google Gemini)

## 🎉 Đã Cấu Hình Xong!

API key đã được thêm vào `backend/src/main/resources/application.properties`:

```properties
gemini.api.key=AIzaSyD4WwI7x34t2JWP-OKy9Rwm_2yrsGJKzVM
```

## 🔄 Bước Tiếp Theo: Restart Backend

### Cách 1: Restart Thủ Công

1. **Dừng backend hiện tại:**
   - Nhấn `Ctrl + C` trong terminal đang chạy backend

2. **Restart backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Cách 2: Sử Dụng Script

```bash
# Dừng backend
KILL_PORT_8080.bat

# Start lại
START_BACKEND.bat
```

## ✅ Kiểm Tra AI Mode Đã Hoạt Động

### 1. Kiểm Tra Logs Backend

Khi start backend, bạn sẽ thấy backend chạy bình thường. Khi có request đến chatbot:

- **AI Mode hoạt động:** Sẽ gọi Gemini API (có thể thấy trong logs nếu có lỗi)
- **Fallback Mode:** Sẽ dùng pattern matching

### 2. Test Trong Chatbot

Hỏi chatbot một câu phức tạp:

**Câu hỏi test:**
```
"Bạn có thể giới thiệu chi tiết về sự kiện workshop sắp tới không?"
```

**Nếu AI Mode hoạt động:**
- ✅ Trả lời tự nhiên, có ngữ cảnh
- ✅ Hiểu được ý định phức tạp
- ✅ Trả lời dài và chi tiết hơn

**Nếu Fallback Mode:**
- ⚠️ Trả lời theo pattern
- ⚠️ Có thể không hiểu câu hỏi phức tạp

### 3. Kiểm Tra Network Tab

1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Gửi tin nhắn trong chatbot
4. Tìm request `chat`
5. Xem response time:
   - **AI Mode:** 1-3 giây (do gọi Gemini API)
   - **Fallback Mode:** 100-500ms (chỉ query database)

## 🔒 Bảo Mật API Key

### ⚠️ QUAN TRỌNG: Không Commit API Key vào Git!

**Kiểm tra .gitignore:**

Đảm bảo file `.gitignore` có dòng sau:

```gitignore
# Application properties (chứa sensitive data)
backend/src/main/resources/application.properties
```

Hoặc nếu muốn commit template:

```gitignore
# Application properties
backend/src/main/resources/application.properties
!backend/src/main/resources/application.properties.example
```

### Nếu Đã Commit API Key

Nếu bạn đã commit API key vào Git, cần:

1. **Xóa key khỏi Git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/src/main/resources/application.properties" \
   --prune-empty --tag-name-filter cat -- --all
   ```

2. **Hoặc đơn giản hơn:**
   - Đổi API key mới trên Google Cloud Console
   - Thêm application.properties vào .gitignore
   - Commit lại

3. **Tạo application.properties.example:**
   ```properties
   gemini.api.key=YOUR_API_KEY_HERE
   ```

## 📊 So Sánh 2 Chế Độ

| Tính năng | AI Mode (Gemini) ✅ | Fallback Mode |
|-----------|---------------------|---------------|
| **Trả lời tự nhiên** | ✅ Rất tốt | ⚠️ Pattern matching |
| **Hiểu ngữ cảnh** | ✅ Tốt | ⚠️ Hạn chế |
| **Câu hỏi phức tạp** | ✅ Hiểu được | ❌ Không hiểu |
| **Tốc độ** | 1-3 giây | 100-500ms |
| **Chi phí** | Có (theo usage) | Miễn phí |
| **Cần API key** | ✅ Có | ❌ Không |

## 🎯 Ví Dụ Câu Hỏi Để Test AI Mode

### Câu hỏi đơn giản (Cả 2 mode đều trả lời được):
- "Xin chào"
- "Có sự kiện nào ở Đà Nẵng không?"
- "Hướng dẫn đăng ký"

### Câu hỏi phức tạp (Chỉ AI Mode trả lời tốt):
- "Bạn có thể so sánh các sự kiện workshop và seminar sắp tới không?"
- "Tôi muốn tham gia một sự kiện về công nghệ vào cuối tuần, bạn có gợi ý gì không?"
- "Sự kiện nào phù hợp nhất cho người mới bắt đầu học lập trình?"

## 🐛 Troubleshooting

### Nếu AI Mode không hoạt động:

1. **Kiểm tra API key:**
   - Đảm bảo key đúng trong `application.properties`
   - Không có khoảng trắng thừa

2. **Kiểm tra logs backend:**
   - Xem có lỗi gì không
   - Lỗi 401 → API key không hợp lệ
   - Lỗi 403 → API key không có quyền
   - Lỗi 429 → Quá nhiều requests (rate limit)

3. **Kiểm tra internet:**
   - Backend cần kết nối internet để gọi Gemini API

4. **Kiểm tra quota:**
   - Vào Google Cloud Console
   - Xem quota còn không
   - Free tier có giới hạn requests/ngày

## 📝 Lưu Ý

- **Free Tier:** Google Gemini có free tier với giới hạn requests
- **Rate Limiting:** Có thể bị rate limit nếu gọi quá nhiều
- **Billing:** Nếu vượt free tier, sẽ tính phí (nhưng bạn đã set "Free tier" nên an toàn)

## 🎉 Kết Luận

Sau khi restart backend, chatbot sẽ tự động chuyển sang **AI Mode** và trả lời thông minh hơn nhiều!

**Chúc bạn thành công!** 🚀

