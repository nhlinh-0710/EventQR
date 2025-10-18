// Chatbot offline thông minh (không cần backend)
document.addEventListener('DOMContentLoaded', () => {
    const openBtn   = document.getElementById('cb-open');
    const win       = document.getElementById('cb-window');
    const closeBtn  = document.getElementById('cb-close');
    const input     = document.getElementById('cb-input');
    const sendBtn   = document.getElementById('cb-send');
    const body      = document.getElementById('cb-messages');
  
    if (!openBtn || !win || !closeBtn || !input || !sendBtn || !body) {
      console.error('Chatbot: thiếu phần tử HTML cần thiết');
      return;
    }
  
    // Đảm bảo nổi lên trên mọi overlay
    win.style.zIndex = '99999';
    openBtn.style.zIndex = '99999';
  
    // --- State ---
    const messages = [];
    let typingTimer = null;
  
    // --- Utils render ---
    function append(sender, text) {
      const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const row = document.createElement('div');
      row.className = `cb-row ${sender === 'user' ? 'end' : ''}`;
      row.innerHTML = `
        <div class="cb-bubblewrap ${sender === 'user' ? 'reverse' : ''}">
          <div class="cb-avatar ${sender === 'user' ? 'user' : 'bot'}">${sender === 'user' ? '👤' : '🤖'}</div>
          <div class="cb-bubble ${sender === 'user' ? 'user' : 'bot'}">
            <div>${text}</div>
            <div class="cb-time">${time}</div>
          </div>
        </div>`;
      body.appendChild(row);
      body.scrollTop = body.scrollHeight;
      messages.push({ sender, text, time });
    }
  
    function showTyping() {
      const row = document.createElement('div');
      row.className = 'cb-row cb-typing';
      row.id = 'cb-typing';
      row.innerHTML = `
        <div class="cb-bubblewrap">
          <div class="cb-avatar bot">🤖</div>
          <div class="cb-bubble bot">
            <span>Đang trả lời<span class="cb-dots">...</span></span>
          </div>
        </div>`;
      body.appendChild(row);
      body.scrollTop = body.scrollHeight;
  
      // chấm chạy
      const dotsEl = row.querySelector('.cb-dots');
      let dots = 0;
      typingTimer = setInterval(() => {
        dots = (dots + 1) % 4;
        dotsEl.textContent = '.'.repeat(dots);
      }, 300);
    }
  
    function hideTyping() {
      clearInterval(typingTimer);
      const t = document.getElementById('cb-typing');
      if (t) t.remove();
    }
  
    // --- “AI” offline: nhận biết ý định + fallback tự nhiên ---
    function normalize(str) {
      return (str || "")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
  
    const KB = [
      { keys: ["su kien","event","chu de","sap dien ra","lich"],
        reply: "Hiện có nhiều sự kiện đang diễn ra. Bạn muốn tìm theo chủ đề (tech, design, startup) hay theo thời gian (tuần này/tháng này)?" },
      { keys: ["dang ky","register","mua ve","dat ve"],
        reply: "Đăng ký rất đơn giản: chọn sự kiện → nhấn “Đăng ký” → điền thông tin → xác nhận. Vé và mã QR sẽ có ngay trong Dashboard." },
      { keys: ["ve","ticket","qr","ma qr"],
        reply: "Vé của bạn nằm trong mục Dashboard, mỗi vé có mã QR riêng để check-in." },
      { keys: ["ho tro","lien he","help","support"],
        reply: "Bạn có thể liên hệ: support@eventmanagement.com hoặc hotline 1900-xxxx (8:00–18:00, T2–T7)." },
      { keys: ["check in","check-in","checkin","vao cong"],
        reply: "Tới sự kiện, mở vé (mã QR) trong Dashboard để BTC quét và xác nhận check-in." },
      { keys: ["danh gia","feedback","rating"],
        reply: "Sau khi tham dự, bạn có thể đánh giá sự kiện trong Dashboard. Cảm ơn vì đã giúp chúng tôi cải thiện!" },
    ];
  
    const GENERIC_POSITIVE = [
      "Nghe hay đó! Bạn muốn mình hướng dẫn chi tiết hơn phần nào không?",
      "Tuyệt! Bạn có thể cho mình biết thêm mục tiêu cụ thể không?",
      "Ok nhé! Bạn muốn thực hiện ngay hay cần mình giải thích trước?",
    ];
    const GENERIC_NEUTRAL = [
      "Mình hiểu rồi. Bạn có thể nói rõ hơn mong muốn/khó khăn cụ thể không?",
      "Bạn nói cụ thể hơn giúp mình để trả lời chính xác hơn nhé!",
      "Bạn đang muốn tìm thông tin hay thực hiện thao tác nào vậy?",
    ];
    const GENERIC_NEGATIVE = [
      "Rất tiếc vì trải nghiệm chưa tốt. Bạn mô tả vấn đề cụ thể để mình hỗ trợ nhé?",
      "Mình hiểu sự bất tiện. Bạn có thể chụp ảnh/lỗi cụ thể không?",
      "Xin lỗi vì sự cố. Mình sẽ giúp bạn xử lý ngay, cho mình biết chi tiết hơn nhé!",
    ];
  
    function isQuestion(text) {
      const t = normalize(text);
      return /(\?|tai sao|vi sao|the nao|bao gio|o dau|la gi|how|what|why|when|where|which|who)/.test(t);
    }
    function sentiment(text) {
      const t = normalize(text);
      if (/(tuyet|tot|ok|cam on|thank|thu vi|dep|duoc)/.test(t)) return "pos";
      if (/(tuc|chan|te|loi|hong|khong duoc|bug|khong mo|khong thay|khong bam)/.test(t)) return "neg";
      return "neu";
    }
    function answerGeneralQuestion(text) {
      const t = normalize(text);
      if (/(may gio|mấy giờ|gio hien tai|time|today|hom nay)/.test(t)) {
        const now = new Date();
        return `Bây giờ là ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ngày ${now.toLocaleDateString('vi-VN')}.`;
      }
      if (/(la gi|what is|la sao)/.test(t)) {
        return "Bạn đang muốn định nghĩa/giải thích khái niệm nào? Nói rõ tên khái niệm để mình giải thích chi tiết nhé.";
      }
      if (/(lam the nao|how to|huong dan|cach lam)/.test(t)) {
        return "Bạn mô tả quy trình bạn muốn làm (ví dụ: tạo sự kiện, xuất vé, gửi thông báo), mình sẽ hướng dẫn từng bước cho bạn.";
      }
      if (/(tai sao|vi sao|why)/.test(t)) {
        return "Có thể có nhiều lý do. Bạn cho mình biết ngữ cảnh cụ thể để mình phân tích nguyên nhân chi tiết giúp bạn nhé.";
      }
      return "Bạn mô tả cụ thể điều bạn muốn hỏi (ai/cái gì/ở đâu/khi nào/như thế nào) để mình trả lời chính xác nhé.";
    }
    function matchKB(text) {
      const t = normalize(text);
      let best = null, bestScore = 0;
      for (const item of KB) {
        const score = item.keys.reduce((s, k) => s + (t.includes(k) ? 1 : 0), 0);
        if (score > bestScore) { best = item; bestScore = score; }
      }
      return bestScore > 0 ? best.reply : null;
    }
    function fallbackBySentiment(t) {
      const s = sentiment(t);
      const pool = s === "pos" ? GENERIC_POSITIVE : s === "neg" ? GENERIC_NEGATIVE : GENERIC_NEUTRAL;
      return pool[Math.floor(Math.random() * pool.length)];
    }
  
    function getBotResponse(userText) {
      const kb = matchKB(userText);
      if (kb) return kb;
      if (isQuestion(userText)) return answerGeneralQuestion(userText);
  
      const t = normalize(userText);
      if (/(thoi gian|thời gian|dia diem|địa điểm|o dau|ở đâu|luc nao|lúc nào|bao gio|bao giờ)/.test(t)) {
        return "Bạn đang hỏi về thời gian/địa điểm cụ thể của sự kiện nào? Cho mình tên sự kiện hoặc khoảng thời gian nhé.";
      }
      if (/(khong|ko|hong|lỗi|error|bug|khong mo duoc|khong thay|khong bam duoc)/.test(t)) {
        return "Bạn mô tả lỗi chi tiết (màn hình/ảnh/console log) và thao tác bạn đã làm, mình sẽ chẩn đoán giúp ngay.";
      }
      return fallbackBySentiment(userText);
    }
  
    // --- Gửi/nhận ---
    function send() {
      const v = input.value.trim();
      if (!v) return;
  
      append('user', v);
      input.value = '';
  
      showTyping();
      setTimeout(() => {
        hideTyping();
        const reply = getBotResponse(v);
        append('bot', reply);
      }, 800); // mô phỏng bot gõ
    }
  
    // --- Sự kiện UI ---
    openBtn.addEventListener('click', () => {
      win.classList.toggle('hidden');
      if (!win.classList.contains('hidden') && body.childElementCount === 0) {
        // greeting lần đầu
        append('bot', 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?');
      }
    });
    closeBtn.addEventListener('click', () => win.classList.add('hidden'));
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  
    // Khởi tạo: có thể thêm lời chào nếu muốn hiện ngay khi load
    // append('bot', 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?');
  });
  