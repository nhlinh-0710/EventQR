# EventQR
International School, Duy Tan University 
# EventQR - Hệ Thống Quản Lý Sự Kiện

## Mô Tả Dự Án

EventQR là một website quản lý sự kiện hiện đại với giao diện đẹp mắt và thân thiện người dùng. Hệ thống cung cấp đầy đủ các tính năng để tạo, quản lý và theo dõi sự kiện một cách chuyên nghiệp.

## Tính Năng Chính

### 🔐 Quản Lý Người Dùng
- **Đăng ký tài khoản** - Tạo tài khoản mới với xác thực email
- **Đăng nhập** - Đăng nhập an toàn với ghi nhớ phiên
- **Quên mật khẩu** - Khôi phục mật khẩu qua email
- **Quản lý hồ sơ** - Cập nhật thông tin cá nhân

### 📅 Quản Lý Sự Kiện
- **Tạo sự kiện mới** - Tạo sự kiện với thông tin chi tiết
- **Chỉnh sửa sự kiện** - Cập nhật thông tin sự kiện
- **Quản lý danh sách** - Xem và quản lý tất cả sự kiện
- **Phân loại sự kiện** - Lọc theo trạng thái (sắp diễn ra, đang diễn ra, đã hoàn thành)

### 👥 Quản Lý Người Tham Dự
- **Đăng ký tham dự** - Cho phép người dùng đăng ký sự kiện
- **Quản lý danh sách** - Theo dõi người tham dự
- **Thống kê tham dự** - Báo cáo số lượng và tỷ lệ tham dự

### � QR Check-in System
- **Tạo QR Code** - Sinh mã QR cho từng sự kiện
- **Quét QR Code** - Hỗ trợ camera scanner và nhập manual
- **Check-in tự động** - Xử lý check-in realtime với form thông tin
- **Lịch sử check-in** - Theo dõi và báo cáo chi tiết
- **In/Tải QR Code** - Export QR code dưới dạng hình ảnh

### �📊 Dashboard & Thống Kê
- **Tổng quan** - Hiển thị thống kê tổng thể
- **Biểu đồ** - Thống kê trực quan
- **Báo cáo** - Xuất báo cáo chi tiết

## Cấu Trúc Dự Án

```
deadlineWeb2025_9_8/
├── index.html                 # Trang chủ với form đăng nhập/đăng ký
├── css/
│   ├── style.css             # CSS cho trang chủ
│   ├── dashboard.css         # CSS cho dashboard
│   ├── placeholders.css      # CSS cho placeholder images
│   └── qr-checkin.css        # CSS cho tính năng QR check-in
├── js/
│   ├── main.js               # JavaScript cho trang chủ
│   ├── dashboard.js          # JavaScript cho dashboard
│   └── qr-checkin.js         # JavaScript cho QR check-in system
├── pages/
│   └── dashboard.html        # Trang dashboard chính với QR check-in
├── images/                   # Thư mục chứa hình ảnh
├── .github/
│   └── copilot-instructions.md
└── README.md                 # Tài liệu dự án
```

## Công Nghệ Sử Dụng

### Frontend
- **HTML5** - Cấu trúc trang web hiện đại
- **CSS3** - Styling với Flexbox/Grid, animations
- **JavaScript (ES6+)** - Tương tác động và xử lý logic
- **Font Awesome** - Biểu tượng đẹp mắt
- **Google Fonts (Poppins)** - Typography chuyên nghiệp

### Tính Năng CSS
- **Responsive Design** - Tương thích mọi thiết bị
- **CSS Grid & Flexbox** - Layout linh hoạt
- **CSS Animations** - Hiệu ứng mượt mà
- **CSS Variables** - Quản lý màu sắc thống nhất
- **Hover Effects** - Tương tác trực quan

### Tính Năng JavaScript
- **ES6+ Syntax** - Modern JavaScript
- **LocalStorage** - Lưu trữ dữ liệu client-side
- **Event Handling** - Xử lý sự kiện người dùng
- **Form Validation** - Kiểm tra dữ liệu đầu vào
- **Modal System** - Popup đăng nhập/đăng ký
- **Notification System** - Thông báo người dùng
- **QR Code Generation** - Tạo mã QR với QRCode.js
- **Camera Integration** - Quét QR qua camera
- **Real-time Processing** - Xử lý check-in tức thời

## Hướng Dẫn Cài Đặt

### 1. Tải Dự Án
```bash
# Clone repository hoặc tải file zip
git clone [repository-url]
cd deadlineWeb2025_9_8
```

### 2. Chạy Website
```bash
# Chỉ cần mở file index.html trong trình duyệt
# Hoặc sử dụng Live Server trong VS Code
```

### 3. Sử Dụng Live Server (Khuyến nghị)
1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

## Hướng Dẫn Sử Dụng

### 1. Trang Chủ
- Truy cập `index.html` để xem trang chủ
- Click "Đăng Ký" để tạo tài khoản mới
- Click "Đăng Nhập" để đăng nhập
- Khám phá các tính năng được giới thiệu

### 2. Đăng Ký/Đăng Nhập
- **Đăng ký**: Điền thông tin cá nhân và tạo tài khoản
- **Đăng nhập**: Sử dụng email và mật khẩu
- **Quên mật khẩu**: Nhập email để nhận link đặt lại

### 3. Dashboard
- Sau khi đăng nhập, bạn sẽ được chuyển đến dashboard
- Xem thống kê tổng quan về sự kiện
- Quản lý sự kiện và người tham dự
- Tạo sự kiện mới

### 4. Quản Lý Sự Kiện
- **Tạo sự kiện**: Điền thông tin chi tiết và tạo
- **Chỉnh sửa**: Cập nhật thông tin sự kiện
- **Xóa**: Xóa sự kiện không cần thiết
- **Lọc**: Xem sự kiện theo trạng thái

## Tính Năng Responsive

Website được thiết kế responsive hoàn toàn:

### Desktop (≥1024px)
- Layout full-width với sidebar cố định
- Grid system cho hiển thị tối ưu
- Hover effects đầy đủ

### Tablet (768px - 1023px)
- Sidebar có thể thu gọn
- Grid layout điều chỉnh
- Touch-friendly buttons

### Mobile (≤767px)
- Hamburger menu
- Single column layout
- Optimized forms
- Touch gestures

## Cấu Trúc Database (LocalStorage)

### User Data
```javascript
{
  id: "unique_id",
  name: "Tên người dùng",
  email: "email@example.com",
  createdAt: "2025-09-08T10:00:00.000Z"
}
```

### Event Data
```javascript
{
  id: "event_id",
  title: "Tên sự kiện",
  description: "Mô tả sự kiện",
  date: "2025-09-15T09:00:00.000Z",
  location: "Địa điểm",
  category: "conference",
  maxParticipants: 100,
  currentParticipants: 0,
  status: "upcoming",
  createdAt: "2025-09-08T10:00:00.000Z"
}
```

## Security Features

### Frontend Security
- **Input Validation** - Kiểm tra dữ liệu đầu vào
- **XSS Prevention** - Escape HTML characters
- **CSRF Protection** - Token validation (chuẩn bị)
- **Password Policy** - Yêu cầu mật khẩu mạnh

### Data Protection
- **LocalStorage Encryption** - Mã hóa dữ liệu nhạy cảm
- **Session Management** - Quản lý phiên đăng nhập
- **Auto Logout** - Tự động đăng xuất khi hết hạn

## Performance Optimization

### CSS Optimization
- **Minification** - Nén CSS
- **Critical CSS** - CSS quan trọng inline
- **Font Loading** - Tối ưu tải font

### JavaScript Optimization
- **Code Splitting** - Chia nhỏ JavaScript
- **Lazy Loading** - Tải chậm hình ảnh
- **Caching** - Cache dữ liệu

### Image Optimization
- **WebP Format** - Định dạng hình ảnh hiện đại
- **Responsive Images** - Hình ảnh thích ứng
- **Compression** - Nén hình ảnh

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Opera** 76+

## Development Roadmap

### Phase 1 ✅ (Hoàn thành)
- [x] Thiết kế giao diện trang chủ
- [x] Hệ thống đăng nhập/đăng ký
- [x] Dashboard cơ bản
- [x] Quản lý sự kiện cơ bản

### Phase 2 🚧 (Đang phát triển)
- [ ] Backend API integration
- [ ] Database thực tế
- [ ] Email notifications
- [ ] Payment integration

### Phase 3 📋 (Kế hoạch)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social media integration
- [ ] Multi-language support

## Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phân phối dưới license MIT. Xem file `LICENSE` để biết thêm chi tiết.


## Credits

- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)
- **Design Inspiration**: Modern UI/UX trends
- **Color Palette**: Material Design

---

**EventQR** - Tạo ra những sự kiện đáng nhớ! 🎉

