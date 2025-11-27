# 🎫 EventQR - Hệ Thống Quản Lý Sự Kiện Thông Minh

<div align="center">

**International School, Duy Tan University**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Hệ thống quản lý sự kiện hiện đại với QR check-in tự động, thống kê real-time và AI chatbot hỗ trợ*

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Giới Thiệu

**EventQR** là một hệ thống quản lý sự kiện full-stack được xây dựng với Spring Boot và JavaScript thuần, tích hợp các công nghệ hiện đại để mang lại trải nghiệm tốt nhất cho cả người tổ chức và người tham gia sự kiện.

### ✨ Điểm Nổi Bật

- 🎫 **QR Check-in tự động** - Quét mã QR để check-in nhanh chóng
- 📊 **Dashboard thống kê real-time** - Theo dõi sự kiện trực tiếp
- 🤖 **AI Chatbot** - Hỗ trợ người dùng 24/7
- 🔔 **WebSocket Notifications** - Thông báo real-time
- 📱 **Responsive Design** - Hoạt động mượt mà trên mọi thiết bị
- 🎨 **Modern UI/UX** - Giao diện đẹp mắt, thân thiện

---

## 🚀 Tính Năng Nổi Bật

### 👥 Quản Lý Người Dùng
- ✅ Đăng ký/Đăng nhập với JWT Authentication
- ✅ Phân quyền người dùng (Admin/User)
- ✅ Quản lý hồ sơ cá nhân
- ✅ Xác thực email và bảo mật cao

### 📅 Quản Lý Sự Kiện
- ✅ Tạo và chỉnh sửa sự kiện với thông tin chi tiết
- ✅ Upload hình ảnh cho sự kiện
- ✅ Phân loại sự kiện theo danh mục
- ✅ Quản lý số lượng người tham gia
- ✅ Theo dõi trạng thái sự kiện (Sắp diễn ra/Đang diễn ra/Đã kết thúc)

### 🎫 Hệ Thống Vé & Check-in
- ✅ Tự động sinh mã QR cho từng vé
- ✅ Quét QR code để check-in (hỗ trợ camera)
- ✅ Nhập mã QR thủ công
- ✅ Lịch sử check-in chi tiết
- ✅ In và tải xuống vé dạng PDF

### 📊 Dashboard & Thống Kê
- ✅ Thống kê tổng quan (Sự kiện, Người tham gia, Check-in)
- ✅ Biểu đồ trực quan với Chart.js
- ✅ Báo cáo chi tiết theo thời gian
- ✅ Export dữ liệu Excel/PDF

### 💬 Feedback & Đánh Giá
- ✅ Đánh giá sự kiện với rating 1-5 sao
- ✅ Gửi feedback chi tiết
- ✅ Quản lý và trả lời feedback
- ✅ Thống kê độ hài lòng

### 🔔 Hệ Thống Thông Báo
- ✅ Thông báo real-time qua WebSocket
- ✅ Thông báo về sự kiện sắp diễn ra
- ✅ Thông báo check-in thành công
- ✅ Quản lý trạng thái đã đọc/chưa đọc

### 🤖 AI Chatbot
- ✅ Hỗ trợ tự động 24/7
- ✅ Tích hợp Google Gemini AI
- ✅ Trả lời câu hỏi về sự kiện
- ✅ Gợi ý sự kiện phù hợp

---

## 🛠️ Công Nghệ Sử Dụng

### Backend Stack
```
├── Spring Boot 3.x          - Framework Java hiện đại
├── Spring Data JPA          - ORM và database abstraction
├── Spring Security          - Authentication & Authorization
├── MySQL 8.0                - Relational Database
├── WebSocket (STOMP)        - Real-time communication
├── JWT (JSON Web Token)     - Stateless authentication
├── Maven                    - Dependency management
└── Lombok                   - Reduce boilerplate code
```

### Frontend Stack
```
├── HTML5/CSS3               - Modern web standards
├── JavaScript (ES6+)        - Vanilla JavaScript
├── Fetch API                - HTTP client
├── WebSocket API            - Real-time updates
├── QRCode.js                - QR code generation
├── Html5-QRCode             - QR code scanner
├── Chart.js                 - Data visualization
└── Font Awesome & Boxicons  - Icons
```

### Additional Features
- 🎨 **CSS Grid & Flexbox** - Responsive layouts
- 🔄 **WebSocket** - Real-time notifications
- 📱 **Progressive Web App** - App-like experience
- 🌐 **CORS Enabled** - Cross-origin support
- 🔒 **Secure Headers** - XSS & CSRF protection
- 📊 **RESTful API** - Standard API design

---

## 📁 Cấu Trúc Dự Án

```
EventQR/
├── backend/                          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/eventqr/
│   │   │   │   ├── config/          # Cấu hình CORS, WebSocket
│   │   │   │   ├── controller/      # REST API Controllers (10 files)
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── EventController.java
│   │   │   │   │   ├── CheckInController.java
│   │   │   │   │   ├── FeedbackController.java
│   │   │   │   │   ├── NotificationController.java
│   │   │   │   │   └── ...
│   │   │   │   ├── dto/              # Data Transfer Objects (15 files)
│   │   │   │   ├── model/            # Entity Models (8 files)
│   │   │   │   │   ├── Account.java
│   │   │   │   │   ├── Event.java
│   │   │   │   │   ├── EventTicket.java
│   │   │   │   │   ├── CheckInHistory.java
│   │   │   │   │   └── ...
│   │   │   │   ├── repository/       # JPA Repositories (8 files)
│   │   │   │   ├── service/          # Business Logic Services (10 files)
│   │   │   │   ├── util/             # Utility Classes (2 files)
│   │   │   │   └── EventQrApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/images/
│   │   └── test/
│   ├── pom.xml                       # Maven configuration
│   └── target/                       # Compiled classes & JAR
│
├── frontend/                         # Frontend Web Application
│   ├── index.html                    # Landing page
│   │
│   ├── css/
│   │   ├── admin/                    # Admin styles
│   │   │   ├── dashboard.css
│   │   │   ├── event.css
│   │   │   ├── feedback.css
│   │   │   ├── qr-checkin.css
│   │   │   └── stactics.css
│   │   ├── user/                     # User styles
│   │   │   ├── feedback.css
│   │   │   ├── my-events.css
│   │   │   ├── my-tickets.css
│   │   │   ├── qr-checkin.css
│   │   │   └── suggest-events.css
│   │   ├── chatbot.css               # AI chatbot styles
│   │   ├── placehoders.css           # Placeholder images
│   │   └── style.css                 # Global styles
│   │
│   ├── js/
│   │   ├── admin/                    # Admin scripts
│   │   │   ├── create-event.js
│   │   │   ├── dashboard.js
│   │   │   ├── events.js
│   │   │   ├── feedback.js
│   │   │   ├── notifications.js
│   │   │   └── statistics.js
│   │   ├── core/                     # Core modules
│   │   │   ├── auth.js               # Authentication
│   │   │   ├── chatbot.js            # AI Chatbot
│   │   │   ├── chatbot-simple.js     # Simple chatbot
│   │   │   ├── dashboard.js          # Dashboard logic
│   │   │   ├── main.js               # Main app
│   │   │   ├── notifications.js      # Notification system
│   │   │   └── websocket.js          # WebSocket client
│   │   └── user/                     # User scripts
│   │       ├── feedback.js
│   │       ├── my-tickets.js
│   │       ├── qr-checkin.js
│   │       ├── simple-qr.js
│   │       └── suggest-events.js
│   │
│   ├── pages/
│   │   ├── admin/                    # Admin pages
│   │   │   ├── index.html            # Admin dashboard
│   │   │   ├── create_event.html     # Create event
│   │   │   ├── events.html           # Event management
│   │   │   ├── feedback.html         # Feedback management
│   │   │   ├── profile.html          # Admin profile
│   │   │   ├── qr.html               # QR scanning
│   │   │   └── static.html           # Statistics
│   │   └── user/                     # User pages
│   │       ├── index.html            # User dashboard
│   │       ├── feedback.html         # Submit feedback
│   │       ├── profile.html          # User profile
│   │       └── tickets.html          # My tickets
│   │
│   ├── setup-ai.html                 # AI chatbot setup
│   ├── test-ai.html                  # Test AI features
│   ├── test-chatbot.html             # Test chatbot
│   ├── test-dashboard.html           # Test dashboard
│   ├── package.json                  # NPM dependencies
│   └── node_modules/                 # Node packages
│
├── database/
│   └── even_qr.sql                   # Database schema & sample data
│
├── START_BACKEND.bat                 # Start backend server
├── KILL_PORT_8080.bat                # Kill port 8080
├── CLEAN_ALL.bat                     # Clean project
└── README.md                         # Project documentation
```

---

## 🔧 Hướng Dẫn Cài Đặt

### 📋 Yêu Cầu Hệ Thống

- **Java JDK** 17 hoặc cao hơn
- **Maven** 3.8+
- **MySQL** 8.0+
- **Node.js** 16+ (cho frontend dependencies)
- **Git** (optional)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/EventQR.git
cd EventQR
```

### 2️⃣ Cấu Hình Database

**Tạo database MySQL:**
```sql
CREATE DATABASE even_qr;
USE even_qr;
```

**Import schema:**
```bash
mysql -u root -p even_qr < database/even_qr.sql
```

### 3️⃣ Cấu Hình Backend

**Chỉnh sửa `backend/src/main/resources/application.properties`:**
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/even_qr
spring.datasource.username=your_username
spring.datasource.password=your_password

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=your_secret_key_here
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 4️⃣ Build & Run Backend

**Sử dụng Maven:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Hoặc sử dụng script (Windows):**
```bash
START_BACKEND.bat
```

Backend sẽ chạy tại: `http://localhost:8080`

### 5️⃣ Setup Frontend

**Cài đặt dependencies (nếu cần):**
```bash
cd frontend
npm install
```

**Chạy với Live Server:**
- Cài đặt extension "Live Server" trong VS Code
- Right-click vào `frontend/index.html`
- Chọn "Open with Live Server"

Frontend sẽ chạy tại: `http://localhost:5500` (hoặc port tương tự)

### 6️⃣ Cấu Hình AI Chatbot (Optional)

1. Truy cập: `frontend/setup-ai.html`
2. Nhập **Google Gemini API Key**
3. Test chatbot tại: `frontend/test-chatbot.html`

---

## 📖 Hướng Dẫn Sử Dụng

### 🏠 Trang Chủ

1. Truy cập `http://localhost:5500/frontend/index.html`
2. Xem thông tin giới thiệu về hệ thống
3. Click **"Đăng Nhập"** hoặc **"Đăng Ký"**

### 👤 Đăng Ký Tài Khoản

```
Email: your@email.com
Password: ********
Họ và Tên: Nguyễn Văn A
Số điện thoại: 0123456789
```

### 🔐 Đăng Nhập

**Admin Account (mặc định):**
```
Email: admin@eventqr.com
Password: admin123
```

**User Account:**
```
Email: user@eventqr.com
Password: user123
```

### 📅 Tạo Sự Kiện Mới (Admin)

1. Đăng nhập với tài khoản Admin
2. Vào **Dashboard** → **Tạo Sự Kiện**
3. Điền thông tin:
   - Tên sự kiện
   - Mô tả
   - Ngày & Giờ
   - Địa điểm
   - Số lượng tối đa
   - Danh mục
4. Upload hình ảnh (optional)
5. Click **"Tạo Sự Kiện"**

### 🎫 Đăng Ký Tham Gia (User)

1. Đăng nhập với tài khoản User
2. Xem danh sách sự kiện
3. Click **"Đăng Ký"** trên sự kiện mong muốn
4. Nhận mã QR vé qua email

### 📱 QR Check-in

**Cách 1: Quét QR Code**
1. Mở camera trên thiết bị
2. Quét mã QR trên vé
3. Hệ thống tự động check-in

**Cách 2: Nhập Mã Thủ Công**
1. Vào trang QR Check-in
2. Nhập mã vé
3. Click **"Check-in"**

### 📊 Xem Thống Kê (Admin)

1. Vào **Dashboard** → **Thống Kê**
2. Xem các biểu đồ:
   - Số lượng sự kiện theo tháng
   - Tỷ lệ check-in
   - Top sự kiện hot
3. Export báo cáo Excel/PDF

---

## 🌐 API Documentation

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0123456789"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

### Event APIs

#### Get All Events
```http
GET /api/events
Authorization: Bearer {token}
```

#### Create Event (Admin)
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference",
  "eventDate": "2024-12-01T09:00:00",
  "location": "Duy Tan University",
  "maxParticipants": 200,
  "category": "conference"
}
```

#### Get Event Details
```http
GET /api/events/{eventId}
Authorization: Bearer {token}
```

### Registration APIs

#### Register for Event
```http
POST /api/registrations/{eventId}
Authorization: Bearer {token}
```

#### Get My Tickets
```http
GET /api/registrations/my-tickets
Authorization: Bearer {token}
```

### Check-in APIs

#### QR Check-in
```http
POST /api/checkin/qr
Authorization: Bearer {token}
Content-Type: application/json

{
  "qrCode": "EVT-12345-USR-67890"
}
```

#### Get Check-in History
```http
GET /api/checkin/history/{eventId}
Authorization: Bearer {token}
```

### Feedback APIs

#### Submit Feedback
```http
POST /api/feedback/{eventId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great event!"
}
```

### WebSocket Endpoints

```javascript
// Connect to WebSocket
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

// Subscribe to notifications
stompClient.subscribe('/user/queue/notifications', (message) => {
  console.log('Received:', message.body);
});
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Event Management
![Event Management](screenshots/event-management.png)

### QR Check-in
![QR Check-in](screenshots/qr-checkin.png)

### Statistics
![Statistics](screenshots/statistics.png)

---

## 🔒 Security Features

### Backend Security
- ✅ **JWT Authentication** - Token-based authentication
- ✅ **Password Encryption** - BCrypt hashing
- ✅ **CORS Protection** - Cross-origin configuration
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Input sanitization
- ✅ **Rate Limiting** - API throttling

### Frontend Security
- ✅ **Input Validation** - Client-side validation
- ✅ **XSS Prevention** - Escape HTML
- ✅ **CSRF Protection** - Token validation
- ✅ **Secure Storage** - LocalStorage encryption
- ✅ **HTTPS Only** - Secure connections

---

## 🚦 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### API Testing với Postman
1. Import collection: `postman/EventQR.postman_collection.json`
2. Set environment variables
3. Run tests

### Frontend Testing
1. Mở `frontend/test-dashboard.html`
2. Mở `frontend/test-chatbot.html`
3. Kiểm tra các tính năng

---

## 🎨 Responsive Design

### 💻 Desktop (≥ 1024px)
- Full sidebar navigation
- Grid layout cho cards
- Hover effects đầy đủ
- Charts & visualizations

### 📱 Tablet (768px - 1023px)
- Collapsible sidebar
- Adaptive grid layout
- Touch-friendly buttons
- Optimized spacing

### 📱 Mobile (≤ 767px)
- Hamburger menu
- Single column layout
- Bottom navigation
- Mobile-first approach

---

## 🗺️ Roadmap

### Phase 1 ✅ (Completed)
- [x] Xây dựng backend API với Spring Boot
- [x] Thiết kế database schema
- [x] Tạo giao diện frontend
- [x] Tích hợp JWT authentication
- [x] QR code generation & scanning
- [x] WebSocket real-time notifications
- [x] Dashboard với thống kê cơ bản
- [x] CRUD operations cho tất cả entities

### Phase 2 🚧 (In Progress)
- [ ] AI Chatbot hoàn chỉnh với NLP
- [ ] Email notifications (thông báo tự động)
- [ ] SMS notifications
- [ ] Payment integration (VNPay/MoMo)
- [ ] Export PDF reports
- [ ] Advanced analytics & insights
- [ ] Calendar integration
- [ ] Social media sharing

### Phase 3 📋 (Planned)
- [ ] Mobile app (React Native/Flutter)
- [ ] Push notifications
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Video streaming cho sự kiện online
- [ ] Live chat trong sự kiện
- [ ] Gamification (badges, points)
- [ ] Recommendation system

### Phase 4 🔮 (Future)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] Load balancing
- [ ] Redis caching
- [ ] Elasticsearch integration
- [ ] Machine Learning predictions
- [ ] Blockchain-based ticketing

---

## 🤝 Contributing

Chúng tôi rất hoan nghênh mọi đóng góp! Để contribute:

### 1. Fork dự án
```bash
git clone https://github.com/yourusername/EventQR.git
cd EventQR
```

### 2. Tạo branch mới
```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit changes
```bash
git add .
git commit -m "Add some AmazingFeature"
```

### 4. Push to branch
```bash
git push origin feature/AmazingFeature
```

### 5. Tạo Pull Request
- Mở pull request trên GitHub
- Mô tả rõ ràng về thay đổi
- Đợi review từ maintainers

### Coding Standards
- ✅ Follow Java conventions (backend)
- ✅ Use ESLint rules (frontend)
- ✅ Write meaningful commit messages
- ✅ Add comments cho code phức tạp
- ✅ Write unit tests
- ✅ Update documentation

---

## 📝 License

Dự án này được phân phối dưới **MIT License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

```
MIT License

Copyright (c) 2024 EventQR Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Team

### Project Members
- **Nguyễn Văn A** - Backend Developer
- **Trần Thị B** - Frontend Developer
- **Lê Văn C** - Full Stack Developer
- **Phạm Thị D** - UI/UX Designer

### Advisors
- **TS. Nguyễn Văn E** - Project Supervisor
- **ThS. Trần Thị F** - Technical Advisor

---

## 🙏 Credits & Acknowledgments

### Technologies & Libraries
- **Spring Boot** - Backend framework
- **MySQL** - Database system
- **Font Awesome** - Icon library
- **Boxicons** - Additional icons
- **Google Fonts (Poppins)** - Typography
- **Chart.js** - Data visualization
- **QRCode.js** - QR code generation
- **Html5-QRCode** - QR code scanning
- **Google Gemini AI** - Chatbot intelligence

### Design Inspiration
- **Material Design** - Color palette
- **Dribbble** - UI/UX inspiration
- **Behance** - Design concepts
- **Awwwards** - Modern web design

### Resources
- **Stack Overflow** - Problem solving
- **GitHub** - Code hosting & version control
- **MDN Web Docs** - Web development reference
- **Spring.io** - Spring documentation

---

## 📞 Contact & Support

### Get in Touch
- 📧 **Email**: support@eventqr.com
- 🌐 **Website**: https://eventqr.com
- 💬 **Discord**: [Join our community](https://discord.gg/eventqr)
- 📱 **Facebook**: [@EventQR](https://facebook.com/eventqr)

### Report Issues
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/EventQR/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/EventQR/discussions)

### Documentation
- 📚 **Wiki**: [Project Wiki](https://github.com/yourusername/EventQR/wiki)
- 📖 **API Docs**: [API Documentation](https://api.eventqr.com/docs)

---

## 📊 Project Statistics

![GitHub Stars](https://img.shields.io/github/stars/yourusername/EventQR?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/EventQR?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/EventQR)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/EventQR)
![Code Size](https://img.shields.io/github/languages/code-size/yourusername/EventQR)
![Contributors](https://img.shields.io/github/contributors/yourusername/EventQR)

---

<div align="center">

### 🎉 **EventQR - Tạo ra những sự kiện đáng nhớ!**

Made with ❤️ by EventQR Team

**International School, Duy Tan University**

[⬆ Back to Top](#-eventqr---hệ-thống-quản-lý-sự-kiện-thông-minh)

</div>
