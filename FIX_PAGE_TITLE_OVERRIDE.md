# 🔧 Fix: Title bị Override bởi dashboard.js

## ❌ Vấn đề:

Mặc dù đã sửa title trong HTML của từng trang, nhưng JavaScript (`dashboard.js`) đang **tự động override lại thành "Dashboard"** khi trang load.

**Nguyên nhân:**
- File `dashboard.js` được load vào tất cả các trang admin
- Hàm `updatePageTitle()` trong `dashboard.js` tự động set lại title
- Các trang như `events.html`, `profile.html` cần `dashboard.js` cho hàm `handleLogout()` và `showNotification()`

---

## ✅ Giải pháp:

Sửa lại hàm `updatePageTitle()` trong `dashboard.js` để:
1. **Kiểm tra** title hiện tại trong HTML
2. **Không override** nếu title đã là title của trang riêng
3. **Chỉ update** khi ở trang dashboard multi-section (`index.html`)

---

## 📝 Code đã sửa:

### **File: `frontend/js/admin/dashboard.js`**

**Trước:**
```javascript
function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'events': 'Quản Lý Sự Kiện',
        // ...
    };

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[section] || 'Dashboard'; // ❌ Luôn override
    }
}
```

**Sau:**
```javascript
function updatePageTitle(section) {
    const pageTitle = document.getElementById('pageTitle');
    if (!pageTitle) return;
    
    // ✅ Check title hiện tại
    const currentTitle = pageTitle.textContent.trim();
    const protectedTitles = [
        'Sự Kiện của tôi', 
        'Tạo Sự Kiện', 
        'QR Check-in', 
        'Thống Kê', 
        'Feedback', 
        'Hồ Sơ'
    ];
    
    // ✅ Nếu là title của trang riêng, KHÔNG override
    if (protectedTitles.includes(currentTitle)) {
        console.log('✅ Giữ nguyên title:', currentTitle);
        return;
    }
    
    // Chỉ update khi ở trang dashboard index.html
    const titles = {
        'dashboard': 'Dashboard',
        'events': 'Quản Lý Sự Kiện',
        // ...
    };

    pageTitle.textContent = titles[section] || 'Dashboard';
}
```

---

## 🎯 Logic hoạt động:

### **Trang riêng (events.html, profile.html...):**
1. HTML có title sẵn: `<h1 id="pageTitle">Sự Kiện của tôi</h1>`
2. Load `dashboard.js` (cần cho handleLogout)
3. `updatePageTitle()` chạy
4. Check: title hiện tại = "Sự Kiện của tôi" → trong `protectedTitles`
5. **Return ngay, KHÔNG override** ✅
6. Title giữ nguyên: **"Sự Kiện của tôi"**

### **Trang dashboard (index.html):**
1. HTML có title: `<h1 id="pageTitle">Dashboard</h1>`
2. User click menu "Sự Kiện của tôi"
3. `updatePageTitle('events')` chạy
4. Check: title hiện tại = "Dashboard" → KHÔNG trong `protectedTitles`
5. **Update thành "Quản Lý Sự Kiện"** ✅

---

## 📋 Protected Titles (Không được override):

| Title | Trang |
|-------|-------|
| **Sự Kiện của tôi** | events.html |
| **Tạo Sự Kiện** | create_event.html |
| **QR Check-in** | qr.html |
| **Thống Kê** | static.html |
| **Feedback** | feedback.html |
| **Hồ Sơ** | profile.html |

---

## 🧪 Test kết quả:

### **Test 1: Trang events.html**
1. Mở `pages/admin/events.html`
2. **Ctrl + Shift + R** (clear cache)
3. Xem header:
   - ✅ Title hiển thị: **"Sự Kiện của tôi"**
   - ❌ KHÔNG phải: "Dashboard"

### **Test 2: Trang profile.html**
1. Mở `pages/admin/profile.html`
2. **Ctrl + Shift + R**
3. Xem header:
   - ✅ Title: **"Hồ Sơ"**

### **Test 3: Nút Đăng Xuất**
1. Click nút "Đăng Xuất"
2. ✅ Phải hoạt động bình thường (do `handleLogout()` từ `dashboard.js`)

---

## 🔍 Console Log:

Khi vào trang riêng, sẽ thấy log:
```
✅ Giữ nguyên title: Sự Kiện của tôi
```

---

## 📁 Files đã sửa:

1. ✅ `frontend/js/admin/dashboard.js` - Sửa hàm `updatePageTitle()`
2. ✅ `frontend/pages/admin/events.html` - Đã có dashboard.js
3. ✅ `frontend/pages/admin/profile.html` - Đã có dashboard.js
4. ✅ `frontend/pages/admin/static.html` - Đã có dashboard.js

---

## ⚠️ Lưu ý:

- **KHÔNG xóa** `dashboard.js` khỏi các trang
- Cần `dashboard.js` cho:
  - `handleLogout()` - Đăng xuất
  - `showNotification()` - Thông báo
  - Các utility functions khác

---

## 🎉 Kết quả:

✅ Mỗi trang hiển thị đúng title của nó  
✅ JavaScript không còn override title  
✅ Nút Đăng Xuất vẫn hoạt động  
✅ Tất cả chức năng khác vẫn hoạt động bình thường

---

**Ngày fix:** 26/11/2025  
**Trạng thái:** ✅ HOÀN THÀNH

