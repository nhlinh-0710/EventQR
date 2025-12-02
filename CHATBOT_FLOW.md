# 🤖 Luồng Hoạt Động Của AI Chatbot

## 📋 Tổng Quan

Chatbot AI của EventQR hoạt động theo 2 chế độ:
1. **AI Mode** (khi có Gemini API key) - Sử dụng Google Gemini AI
2. **Intelligent Fallback Mode** (khi không có API key) - Sử dụng NLP và pattern matching thông minh

---

## 🔄 Luồng Hoạt Động Chi Tiết

### 1️⃣ Frontend: Người Dùng Gửi Tin Nhắn

```
User nhập tin nhắn → Click Send
    ↓
chatbot.js: sendMessage()
    ↓
- Validate input
- Disable input/send button
- Hiển thị user message
- Hiển thị typing indicator
    ↓
Gửi POST request đến /api/chatbot/chat
```

**Code:**
```javascript
// frontend/js/core/chatbot.js
async sendMessage() {
    const message = input.value.trim();
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Call API
    const response = await fetch(`${this.apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            conversationId: this.conversationId,
            userId: this.getUserId()
        })
    });
}
```

---

### 2️⃣ Backend: Nhận Request

```
POST /api/chatbot/chat
    ↓
ChatbotController.chat()
    ↓
- Validate request (message không rỗng)
- Gọi ChatbotService.processMessage()
```

**Code:**
```java
// backend/.../ChatbotController.java
@PostMapping("/chat")
public ResponseEntity<?> chat(@RequestBody ChatbotRequest request) {
    ChatbotResponse response = chatbotService.processMessage(request);
    return ResponseEntity.ok(response);
}
```

---

### 3️⃣ Backend: Xử Lý Message (Core Logic)

```
ChatbotService.processMessage()
    ↓
Kiểm tra có Gemini API key không?
    ├─ CÓ → AI Mode (Google Gemini)
    └─ KHÔNG → Intelligent Fallback Mode
```

#### 🔹 **AI Mode (Có Gemini API Key)**

```
processMessage()
    ↓
buildEventContext()
    ├─ Lấy tất cả events từ database
    ├─ Lọc events sắp diễn ra (startTime > now)
    ├─ Loại bỏ events bị CANCELLED
    └─ Format thành context string
    ↓
buildEnhancedPrompt()
    ├─ Tạo prompt với:
    │  - System role (trợ lý AI EventQR)
    │  - Event context (danh sách sự kiện)
    │  - User message
    │  - Instructions (trả lời tiếng Việt, ngắn gọn)
    └─ Return prompt string
    ↓
callGeminiAPI()
    ├─ Gửi POST request đến Gemini API
    ├─ Parse JSON response
    └─ Extract text từ response
    ↓
Return ChatbotResponse với AI response
```

**Flow Diagram:**
```
User Message
    ↓
[Check API Key] → YES
    ↓
[Get Events from DB] → Build Context
    ↓
[Build Prompt] → Include Context + Instructions
    ↓
[Call Gemini API] → Get AI Response
    ↓
[Return Response] → Frontend displays
```

#### 🔹 **Intelligent Fallback Mode (Không có API Key)**

```
processMessage()
    ↓
getIntelligentResponse()
    ↓
recognizeIntent()
    ├─ Phân tích message
    ├─ Pattern matching với regex
    └─ Xác định Intent type
    ↓
Switch case theo Intent:
    ├─ GREETING → handleGreeting()
    ├─ SEARCH_BY_LOCATION → searchEventsByLocation()
    ├─ SEARCH_BY_CATEGORY → searchEventsByCategory()
    ├─ SEARCH_BY_TIME → searchEventsByTime()
    ├─ SEARCH_BY_NAME → searchEventsByName()
    ├─ REGISTRATION_HELP → handleRegistrationHelp()
    ├─ QR_CHECKIN_HELP → handleQRCheckinHelp()
    ├─ EVENT_COUNT → handleEventCount()
    ├─ GENERAL_SEARCH → searchUpcomingEvents()
    └─ UNKNOWN → handleGeneralQuery()
```

**Flow Diagram:**
```
User Message
    ↓
[Intent Recognition] → Pattern Matching
    ↓
[Determine Intent Type]
    ↓
[Execute Handler Function]
    ├─ Query Database (if needed)
    ├─ Filter/Sort Events
    └─ Format Response
    ↓
[Return Response] → Frontend displays
```

---

### 4️⃣ Intent Recognition System

**Các Intent được nhận diện:**

| Intent | Pattern | Handler |
|--------|---------|---------|
| `GREETING` | "xin chào", "hello", "hi" | `handleGreeting()` |
| `SEARCH_BY_LOCATION` | "ở", "tại", "đà nẵng", "hà nội" | `searchEventsByLocation()` |
| `SEARCH_BY_CATEGORY` | "workshop", "seminar", "meetup" | `searchEventsByCategory()` |
| `SEARCH_BY_TIME` | "hôm nay", "tuần này", "tháng này" | `searchEventsByTime()` |
| `SEARCH_BY_NAME` | "tìm", "sự kiện tên", "show", "festival" | `searchEventsByName()` |
| `REGISTRATION_HELP` | "đăng ký", "register", "tham gia" | `handleRegistrationHelp()` |
| `QR_CHECKIN_HELP` | "qr", "check-in", "mã qr" | `handleQRCheckinHelp()` |
| `EVENT_COUNT` | "có bao nhiêu", "số lượng" | `handleEventCount()` |
| `GENERAL_SEARCH` | "sự kiện", "event", "có sự kiện" | `searchUpcomingEvents()` |
| `UNKNOWN` | Không match | `handleGeneralQuery()` |

**Ưu tiên nhận diện:**
1. Greeting (cao nhất)
2. Location search (kiểm tra location keywords trước)
3. Category search
4. Time search
5. Name search
6. Registration/QR help
7. Event count
8. General search (thấp nhất)
9. Unknown

---

### 5️⃣ Database Query Flow

**Ví dụ: searchEventsByLocation()**

```
searchEventsByLocation()
    ↓
1. Extract location keywords từ message
   - "đà nẵng" → ["đà nẵng", "da nang", "danang"]
   - "hà nội" → ["hà nội", "ha noi", "hanoi"]
    ↓
2. Query database
   eventRepository.findAll()
    ↓
3. Filter events
   ├─ startTime > now (sắp diễn ra)
   ├─ status != "CANCELLED"
   └─ location contains keyword
    ↓
4. Sort & Limit
   ├─ Sort by startTime (ASC)
   └─ Limit 5 events
    ↓
5. Format response
   ├─ Build string với event details
   ├─ Include: title, description, location, time, category
   └─ Add emoji và formatting
    ↓
6. Return ChatbotResponse
```

---

### 6️⃣ Response Format

**ChatbotResponse Structure:**
```java
{
    success: boolean,
    message: String,      // Response text
    conversationId: String,
    error: String         // Optional error message
}
```

**Response Examples:**

**Success Response:**
```json
{
    "success": true,
    "message": "🎯 Tìm thấy 3 sự kiện sắp diễn ra ở **đà nẵng**:\n\n**1. Music Show 2025**\n   📍 Đà Nẵng\n   📅 30/11/2025 19:00\n   ...",
    "conversationId": "conv_1234567890",
    "error": null
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Xin lỗi, có lỗi xảy ra...",
    "conversationId": "conv_1234567890",
    "error": "Exception message"
}
```

---

### 7️⃣ Frontend: Hiển Thị Response

```
Nhận response từ API
    ↓
Hide typing indicator
    ↓
Check response.success
    ├─ true → Create bot message
    └─ false → Show error message
    ↓
renderMessage()
    ├─ Create message div
    ├─ Format content (newlines → <br>)
    ├─ Add timestamp
    └─ Append to messages container
    ↓
scrollToBottom()
    ↓
Enable input/send button
```

---

## 🔀 Decision Tree

```
User sends message
    ↓
Backend receives
    ↓
Has Gemini API Key?
    ├─ YES → AI Mode
    │   ↓
    │   Get events from DB
    │   ↓
    │   Build prompt with context
    │   ↓
    │   Call Gemini API
    │   ↓
    │   Return AI response
    │
    └─ NO → Fallback Mode
        ↓
        Recognize Intent
        ↓
        Execute Handler
        ├─ Query DB (if needed)
        ├─ Filter/Sort
        └─ Format response
        ↓
        Return formatted response
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │ 1. Send message
       ↓
┌─────────────────┐
│  chatbot.js     │
│  (Frontend)     │
└──────┬──────────┘
       │ 2. POST /api/chatbot/chat
       ↓
┌─────────────────┐
│ ChatbotController│
│  (Backend)      │
└──────┬──────────┘
       │ 3. processMessage()
       ↓
┌─────────────────┐
│ ChatbotService  │
│  (Backend)      │
└──────┬──────────┘
       │
       ├─→ [Has API Key?]
       │   ├─ YES → Gemini API
       │   └─ NO → Intent Recognition
       │
       ↓
┌─────────────────┐
│ EventRepository │
│  (Database)     │
└──────┬──────────┘
       │ 4. Query events
       ↓
┌─────────────────┐
│   MySQL DB      │
└─────────────────┘
       │
       ↓
┌─────────────────┐
│ Format Response │
└──────┬──────────┘
       │ 5. Return JSON
       ↓
┌─────────────────┐
│  chatbot.js     │
│  (Frontend)     │
└──────┬──────────┘
       │ 6. Display message
       ↓
┌─────────────┐
│   User      │
│  (Browser)  │
└─────────────┘
```

---

## 🎯 Ví Dụ Cụ Thể

### Ví Dụ 1: "đà nẵng có sự kiện gì hay không"

```
1. Frontend: User gửi message
   ↓
2. Backend: ChatbotController nhận request
   ↓
3. ChatbotService.processMessage()
   ├─ Check API key → NO
   └─ getIntelligentResponse()
      ↓
4. recognizeIntent()
   ├─ Check "đà nẵng" → Found!
   ├─ Check "sự kiện" → Found!
   └─ Return: SEARCH_BY_LOCATION
      ↓
5. searchEventsByLocation()
   ├─ Extract location: "đà nẵng"
   ├─ Query: eventRepository.findAll()
   ├─ Filter:
   │  ├─ startTime > now
   │  ├─ status != "CANCELLED"
   │  └─ location contains "đà nẵng"
   ├─ Sort by startTime
   ├─ Limit 5
   └─ Format response
      ↓
6. Return response với danh sách events
   ↓
7. Frontend: Hiển thị message
```

### Ví Dụ 2: "hướng dẫn đăng ký"

```
1. Frontend: User gửi message
   ↓
2. Backend: processMessage()
   ├─ Check API key → NO
   └─ getIntelligentResponse()
      ↓
3. recognizeIntent()
   ├─ Check "đăng ký" → Found!
   └─ Return: REGISTRATION_HELP
      ↓
4. handleRegistrationHelp()
   └─ Return formatted help text
      ↓
5. Frontend: Hiển thị hướng dẫn
```

---

## 🔧 Cấu Hình

### AI Mode (Gemini)
```properties
# application.properties
gemini.api.key=YOUR_API_KEY_HERE
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Fallback Mode
- Không cần cấu hình
- Tự động hoạt động khi không có API key
- Sử dụng pattern matching và database queries

---

## 📈 Performance

- **AI Mode**: ~1-3 giây (phụ thuộc vào Gemini API)
- **Fallback Mode**: ~100-500ms (database query)
- **Database Query**: Optimized với filtering và limiting
- **Caching**: Không có (mỗi request query mới)

---

## 🛡️ Error Handling

```
Try processMessage()
    ↓
Catch Exception
    ↓
Fallback to getIntelligentResponse()
    ↓
Return error message nếu vẫn lỗi
```

---

## 🔄 Conversation Flow

```
User: "Xin chào"
  → Intent: GREETING
  → Response: Welcome message

User: "đà nẵng có sự kiện gì"
  → Intent: SEARCH_BY_LOCATION
  → Query DB
  → Response: List of events

User: "hướng dẫn đăng ký"
  → Intent: REGISTRATION_HELP
  → Response: Step-by-step guide
```

---

**Last Updated:** 2025-01-XX  
**Version:** 2.0 (Intelligent Fallback Mode)

