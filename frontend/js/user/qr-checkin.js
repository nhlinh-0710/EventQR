// =====================================================
// QR CHECK-IN — BẢN HOÀN CHỈNH CHUẨN EVENTQR
// =====================================================

let qrScannerInterval = null;
let currentQRPayload = null;

// Khi DOM load
document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    loadCheckinHistory();
    updateCheckinStats();
});

// =====================================================
// TAB SWITCHER
// =====================================================
function setupTabs() {
    const tabs = document.querySelectorAll(".qr-tab");
    const contents = document.querySelectorAll(".qr-tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const name = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(name + "-tab").classList.add("active");

            // Rời tab Scan thì tắt camera
            if (name !== "scan") stopQRScanner();
        });
    });
}

// =====================================================
// QUÉT QR TỪ CAMERA
// =====================================================
async function startQRScanner() {
    const video = document.getElementById("qrVideo");
    const startBtn = document.getElementById("startScanBtn");
    const stopBtn = document.getElementById("stopScanBtn");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        video.play();
        video.style.display = "block";

        startBtn.style.display = "none";
        stopBtn.style.display = "inline-flex";

        scanVideoLoop(video);

        showNotification("Máy quét QR đã bật!", "success");
    } catch (e) {
        showNotification("Không thể bật camera!", "error");
    }
}

// Dừng quét
function stopQRScanner() {
    const video = document.getElementById("qrVideo");

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
    }

    video.srcObject = null;
    video.style.display = "none";

    document.getElementById("startScanBtn").style.display = "inline-flex";
    document.getElementById("stopScanBtn").style.display = "none";

    clearInterval(qrScannerInterval);
}

// Loop lấy hình & decode
function scanVideoLoop(video) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    qrScannerInterval = setInterval(() => {
        if (!video.srcObject) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qr = jsQR(img.data, img.width, img.height);

        if (qr) {
            stopQRScanner();
            onQRDetected(qr.data);
        }
    }, 250);
}

// =====================================================
// XỬ LÝ QR SAU KHI QUÉT
// =====================================================
async function onQRDetected(qrString) {
    let decoded;

    try {
        decoded = JSON.parse(atob(qrString)); // Base64 JSON đúng chuẩn của bạn
    } catch (e) {
        return showNotification("QR không hợp lệ!", "error");
    }

    currentQRPayload = decoded;

    // Gửi đến Backend đúng chuẩn
    try {
        const url = `http://localhost:8080/api/checkin?payload=${encodeURIComponent(qrString)}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Không tìm thấy vé!");

        const data = await res.json();

        updateScanResultSuccess(data);
        fillCheckinForm(data);

    } catch (e) {
        return showNotification("QR không tồn tại trong hệ thống!", "error");
    }
}

// Hiển thị khi quét thành công
function updateScanResultSuccess(data) {
    const scanResult = document.getElementById("qrScanResult");
    scanResult.style.display = "block";
    scanResult.innerHTML = `
        <div class="scan-success">
            <i class="fas fa-check-circle" style="color:#10b981;font-size:2rem;margin-bottom:10px"></i>
            <p><strong>QR hợp lệ!</strong></p>
            <p>Vé: TCK-${data.ticket.ticketId}</p>
            <p>Sự kiện: ${data.event.title}</p>
        </div>
    `;
}

// =====================================================
// NHẬP MÃ TAY
// =====================================================
function processManualQRCode() {
    const code = document.getElementById("manualQRCode").value.trim();
    if (!code) return showNotification("Chưa nhập mã!", "error");

    fetch(`http://localhost:8080/api/checkin-by-code?code=${encodeURIComponent(code)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success === false) {
                return showNotification(data.message, "error");
            }

            updateScanResultSuccess(data);
            fillCheckinForm(data);
        })
        .catch(() => showNotification("Mã QR không hợp lệ!", "error"));
}

// =====================================================
// ĐỔ FORM CHECK-IN
// =====================================================
function fillCheckinForm(data) {
    const form = document.getElementById("checkinForm");

    document.getElementById("participantName").value = data.user.name;
    document.getElementById("participantEmail").value = data.user.email;
    document.getElementById("participantPhone").value = data.phone || data.ticket.phone || "";

    document.getElementById("checkinEventName").textContent = data.event.title;
    document.getElementById("checkinTime").textContent =
        new Date().toLocaleString("vi-VN");

    form.dataset.apiData = JSON.stringify(data);

    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth" });
}

// =====================================================
// XÁC NHẬN CHECK-IN
// =====================================================
function confirmCheckin() {
    const form = document.getElementById("checkinForm");
    const data = JSON.parse(form.dataset.apiData);

    const name = document.getElementById("participantName").value.trim();
    const email = document.getElementById("participantEmail").value.trim();
    const phone = document.getElementById("participantPhone").value.trim();

    if (!name || !email) return showNotification("Nhập đầy đủ thông tin!", "error");

    const record = {
        id: Date.now(),
        participant: { name, email, phone },
        qrData: currentQRPayload,
        eventName: data.event.title,
        checkinTime: new Date().toISOString(),
        status: "success"
    };

    storeCheckinRecord(record);
    addCheckinToHistory(record);

    updateCheckinStats();
    showNotification("Check-in thành công!", "success");

    cancelCheckin();
}

function cancelCheckin() {
    document.getElementById("checkinForm").style.display = "none";
    document.getElementById("qrScanResult").style.display = "none";
    document.getElementById("manualQRCode").value = "";
}

// =====================================================
// LỊCH SỬ CHECK-IN
// =====================================================
function storeCheckinRecord(record) {
    let list = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
    list.unshift(record);
    localStorage.setItem("checkinHistory", JSON.stringify(list));
}

function loadCheckinHistory() {
    let list = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
    list.forEach(r => addCheckinToHistory(r, false));
}

function addCheckinToHistory(rec, scroll = true) {
    const body = document.getElementById("checkinTableBody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rec.participant.name}</td>
        <td>${rec.participant.email}</td>
        <td>${rec.eventName}</td>
        <td>${new Date(rec.checkinTime).toLocaleString("vi-VN")}</td>
        <td><span class="status-badge success">Đã check-in</span></td>
        <td><button class="btn btn-sm btn-outline" onclick="viewCheckin('${rec.id}')">Chi tiết</button></td>
    `;

    body.prepend(row);

    if (scroll) row.scrollIntoView({ behavior: "smooth", block: "center" });
}

function viewCheckin(id) {
    const list = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
    const rec = list.find(r => r.id == id);
    if (!rec) return;

    alert(`
Tên: ${rec.participant.name}
Email: ${rec.participant.email}
SĐT: ${rec.participant.phone}
Sự kiện: ${rec.eventName}
Thời gian: ${new Date(rec.checkinTime).toLocaleString("vi-VN")}
`);
}

// =====================================================
// THỐNG KÊ
// =====================================================
function updateCheckinStats() {
    const list = JSON.parse(localStorage.getItem("checkinHistory") || "[]");

    document.getElementById("totalCheckins").textContent = list.length;

    document.getElementById("todayCheckins").textContent =
        list.filter(r =>
            new Date(r.checkinTime).toDateString() === new Date().toDateString()
        ).length;

    document.getElementById("activeEvents").textContent = "1";
}

// =====================================================
// THÔNG BÁO UI
// =====================================================
function showNotification(msg, type = "info") {
    const box = document.createElement("div");
    box.className = `notification notification-${type}`;

    box.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${msg}</span>
    `;

    box.style.cssText = `
        position: fixed;
        top: 20px; right: 20px;
        background: white;
        padding: 12px 18px;
        border-left: 4px solid ${
            type === "success"
                ? "#10b981"
                : type === "error"
                ? "#ef4444"
                : "#3b82f6"
        };
        border-radius: 6px;
        box-shadow: 0 0 15px rgba(0,0,0,0.1);
        z-index: 99999;
    `;

    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3000);
}
