# 🚀 Hướng Dẫn Chạy Backend

## ⚠️ Vấn Đề Hiện Tại

Backend đang chạy background nhưng **chưa thấy logs**, không biết có lỗi gì không.

---

## ✅ Giải Pháp: Chạy Backend Trong Terminal Riêng

### Cách 1: Dùng File BAT (Windows)

1. **Double click** file `START_BACKEND.bat` ở thư mục gốc
2. Cửa sổ terminal sẽ mở ra
3. Đợi đến khi thấy:
   ```
   Tomcat started on port(s): 8080 (http)
   Started EventQrApplication
   ```
4. **QUAN TRỌNG**: Giữ cửa sổ này mở, KHÔNG tắt!

### Cách 2: Chạy Thủ Công

Mở **Command Prompt** hoặc **PowerShell**:

```cmd
cd D:\DuyTan\NamBa\EventQR\backend
mvn spring-boot:run
```

Đợi backend khởi động...

---

## 🔍 Kiểm Tra Backend Đã Chạy

Sau khi thấy "Started EventQrApplication", test trong browser:

```
http://localhost:8080/api/events
```

**Nếu thấy `[]` hoặc JSON** → Backend OK ✅

**Nếu thấy lỗi hoặc không load** → Backend chưa chạy ❌

---

## 🎯 Test API Thống Kê

Sau khi backend chạy xong:

```
http://localhost:8080/api/statistics/organizer/1
```

**Mong đợi thấy:**
```json
{
  "organizerId": 1,
  "totalEvents": ...,
  "totalRegistrations": ...,
  ...
}
```

**Nếu thấy 404** → StatisticsController chưa được load  
**Nếu thấy JSON** → API hoạt động! ✅

---

## 📊 Reload Trang Thống Kê

Sau khi API OK:

1. Quay lại trang: `http://localhost:5500/frontend/pages/admin/static.html`
2. Nhấn **Ctrl + Shift + R** (hard reload)
3. Xem kết quả:
   - ✅ Có dữ liệu → Thành công!
   - ⚪ Empty state → Chưa có sự kiện (bình thường)
   - ❌ Vẫn lỗi → Gửi backend logs cho tôi

---

## 🐛 Nếu Có Lỗi Trong Backend

Backend logs sẽ hiển thị lỗi màu **đỏ** với stack trace.

**Copy toàn bộ logs và gửi cho tôi để debug!**

---

## 💡 Tips

1. **Luôn chạy backend trong terminal riêng** để xem logs
2. **Không tắt terminal** khi backend đang chạy
3. **Kiểm tra port 8080** không bị process khác chiếm
4. **Đảm bảo MySQL đang chạy**

---

## 🎯 Checklist

- [ ] MySQL đang chạy
- [ ] Backend terminal mở và không có lỗi đỏ
- [ ] Thấy "Tomcat started on port 8080"
- [ ] Test `localhost:8080/api/events` → OK
- [ ] Test `localhost:8080/api/statistics/organizer/1` → OK
- [ ] Reload trang thống kê → Thấy dữ liệu hoặc empty state

---

**Hãy chạy backend trong terminal riêng và cho tôi biết kết quả!** 🚀

