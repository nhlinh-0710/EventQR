// ==================== Simple Chatbot (No API Required) ==================== //
// Intelligent rule-based chatbot for EventQR
// Works 100% offline, no API key needed

const ChatbotSimple = (function() {
  'use strict';

  // ==================== Configuration ==================== //
  const CONFIG = {
    BACKEND_URL: 'http://localhost:8080/api',
    TYPING_DELAY: 600,
    MAX_HISTORY: 10
  };

  // ==================== State Management ==================== //
  const state = {
    isOpen: false,
    isTyping: false,
    messageHistory: [],
    conversationContext: {
      lastIntent: null,
      currentEvents: [],
      lastQuestion: null
    }
  };

  // ==================== DOM Elements ==================== //
  let elements = {};

  // ==================== Knowledge Base ==================== //
  const knowledgeBase = {
    faq: [
      {
        keywords: ['dang ky', 'đăng ký', 'register', 'tham gia', 'join', 'mua ve', 'mua vé'],
        answer: `📝 **Cách đăng ký sự kiện:**

1️⃣ Nhấn nút **"Đăng Nhập"** ở góc phải trên
2️⃣ Đăng nhập hoặc tạo tài khoản mới (chọn vai trò "Người tham gia")
3️⃣ Tìm và chọn sự kiện bạn quan tâm
4️⃣ Nhấn **"Đăng Ký"** và điền thông tin

✅ Vé sẽ có mã QR để check-in tại sự kiện!`
      },
      {
        keywords: ['check in', 'check-in', 'checkin', 'qr', 'ma qr', 'mã qr', 'quet', 'quét'],
        answer: `📱 **Check-in với mã QR:**

1️⃣ Đăng nhập vào tài khoản
2️⃣ Vào mục **"Vé của tôi"**
3️⃣ Nhấn vào vé sự kiện
4️⃣ Hiển thị mã QR cho BTC quét

💡 Mã QR có hiệu lực đến khi sự kiện kết thúc!`
      },
      {
        keywords: ['mien phi', 'miễn phí', 'free', 'gia', 'giá', 'price', 'phi', 'phí', 'cost'],
        answer: `💰 **Về chi phí:**

Hầu hết sự kiện trên EventQR đều **MIỄN PHÍ**! 

Một số sự kiện đặc biệt có thể có phí tham gia, thông tin chi tiết sẽ hiển thị rõ ràng tại trang sự kiện.

Bạn muốn tìm sự kiện nào?`
      },
      {
        keywords: ['ve', 'vé', 'ticket', 'xem ve', 'xem vé', 'danh sach ve', 'danh sách vé'],
        answer: `🎫 **Xem vé của bạn:**

1️⃣ Đăng nhập vào tài khoản
2️⃣ Nhấn vào menu **"Vé của tôi"**
3️⃣ Xem danh sách tất cả vé đã đăng ký

💡 Mỗi vé có thông tin chi tiết sự kiện và mã QR check-in!`
      },
      {
        keywords: ['huy', 'hủy', 'cancel', 'khong di', 'không đi', 'bo', 'bỏ'],
        answer: `❌ **Hủy đăng ký:**

1️⃣ Vào **"Vé của tôi"**
2️⃣ Chọn vé muốn hủy
3️⃣ Nhấn nút **"Hủy vé"**

⚠️ Lưu ý: Chỉ có thể hủy trước khi sự kiện bắt đầu!`
      },
      {
        keywords: ['tim', 'tìm', 'search', 'co gi', 'có gì', 'su kien nao', 'sự kiện nào', 'xem tat ca', 'xem tất cả', 'tat ca su kien', 'tất cả sự kiện'],
        answer: `🔍 **Tìm kiếm sự kiện:**

Bạn có thể tìm theo:
• **Chủ đề**: công nghệ, thiết kế, khởi nghiệp...
• **Thời gian**: tuần này, tháng này, sắp diễn ra...
• **Địa điểm**: Đà Nẵng, Hà Nội, TP.HCM...

Bạn đang tìm sự kiện gì? Hoặc nói "xem tất cả" để xem toàn bộ!`
      },
      {
        keywords: ['lien he', 'liên hệ', 'contact', 'hotline', 'email', 'ho tro', 'hỗ trợ'],
        answer: `📞 **Liên hệ hỗ trợ:**

📧 Email: hoviethao20042005@gmail.com
📱 Hotline: +84 762 886 983
📍 Địa chỉ: East Sea Park, Sơn Trà, Đà Nẵng

⏰ Giờ làm việc: 8:00 - 18:00 (T2 - T7)`
      },
      {
        keywords: ['tai khoan', 'tài khoản', 'account', 'dang nhap', 'đăng nhập', 'login', 'mat khau', 'mật khẩu'],
        answer: `👤 **Quản lý tài khoản:**

**Đăng nhập:**
Nhấn nút **"Đăng Nhập"** ở góc phải trên

**Đăng ký:**
Nhấn **"Đăng Ký"** và chọn vai trò:
• Người tham gia (User)
• Người tổ chức (Organizer)

**Quên mật khẩu:**
Nhấn **"Quên mật khẩu?"** tại trang đăng nhập`
      },
      {
        keywords: ['to chuc', 'tổ chức', 'tao su kien', 'tạo sự kiện', 'organizer', 'create event'],
        answer: `🎯 **Tổ chức sự kiện:**

1️⃣ Đăng ký tài khoản với vai trò **"Người quản lý"**
2️⃣ Đăng nhập và vào Dashboard
3️⃣ Nhấn **"Tạo Sự Kiện"**
4️⃣ Điền thông tin sự kiện
5️⃣ Xuất bản và quản lý người đăng ký

💡 Bạn có thể xem thống kê, check-in, quản lý feedback!`
      },
      {
        keywords: ['tinh nang', 'tính năng', 'features', 'lam gi', 'làm gì', 'chuc nang', 'chức năng'],
        answer: `⭐ **Tính năng EventQR:**

👥 **Cho người tham gia:**
• Tìm kiếm & đăng ký sự kiện
• Quản lý vé với mã QR
• Check-in dễ dàng
• Đánh giá sự kiện

🎯 **Cho nhà tổ chức:**
• Tạo & quản lý sự kiện
• Quét QR check-in
• Thống kê chi tiết
• Quản lý feedback

Bạn muốn biết chi tiết phần nào?`
      }
    ],

    greetings: [
      'Xin chào! 👋 Tôi là trợ lý AI của EventQR. Tôi có thể giúp bạn tìm sự kiện, hướng dẫn đăng ký, hoặc trả lời các câu hỏi. Bạn cần gì?',
      'Chào bạn! 😊 Rất vui được hỗ trợ bạn về các sự kiện và dịch vụ của EventQR. Bạn muốn biết gì?',
      'Hi! 👋 Tôi sẵn sàng giúp bạn với mọi thắc mắc về EventQR. Hỏi tôi bất cứ điều gì nhé!'
    ],

    thanks: [
      'Rất vui được giúp bạn! 😊 Có câu hỏi nào khác không?',
      'Không có gì! Cứ hỏi tôi bất cứ lúc nào nhé! 🌟',
      'Sẵn sàng phục vụ! Bạn cần gì nữa không? 💪'
    ],

    fallbacks: [
      'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n\n🔍 Tìm kiếm sự kiện\n📝 Đăng ký tham gia\n🎫 Quản lý vé\n✅ Check-in QR\n📞 Liên hệ hỗ trợ',
      'Hmm, tôi có thể không hiểu đúng ý bạn. Bạn có thể nói cụ thể hơn hoặc hỏi theo các chủ đề:\n• Tìm sự kiện\n• Đăng ký\n• Vé & check-in\n• Tổ chức sự kiện',
      'Tôi muốn giúp bạn nhưng câu hỏi chưa rõ lắm. Thử hỏi tôi về:\n💡 Cách sử dụng EventQR\n🎯 Tìm & đăng ký sự kiện\n📱 Check-in và mã QR'
    ]
  };

  // ==================== Utility Functions ==================== //
  const utils = {
    formatTime: () => {
      return new Date().toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },

    formatDate: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
    },

    scrollToBottom: () => {
      if (elements.body) {
        elements.body.scrollTop = elements.body.scrollHeight;
      }
    },

    normalize: (str) => {
      return (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    },

    random: (array) => {
      return array[Math.floor(Math.random() * array.length)];
    }
  };

  // ==================== API Functions ==================== //
  const api = {
    async getEvents() {
      try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Backend Error:', error);
        return [];
      }
    },

    async searchEvents(query) {
      try {
        const events = await this.getEvents();
        const normalizedQuery = utils.normalize(query);
        
        return events.filter(event => {
          const title = utils.normalize(event.title || '');
          const desc = utils.normalize(event.description || '');
          const location = utils.normalize(event.location || '');
          
          return title.includes(normalizedQuery) || 
                 desc.includes(normalizedQuery) || 
                 location.includes(normalizedQuery);
        }).slice(0, 5);
      } catch (error) {
        console.error('Search Error:', error);
        return [];
      }
    }
  };

  // ==================== Intent Recognition ==================== //
  const intentEngine = {
    detect: (message) => {
      const normalized = utils.normalize(message);
      
      // Check greeting
      if (/^(hi|hello|xin chao|chao|hey|alo)\b/i.test(message)) {
        return { type: 'greeting' };
      }
      
      // Check thanks
      if (/(cam on|cảm ơn|thank|thanks|merci|ok|okela)/i.test(message)) {
        return { type: 'thanks' };
      }
      
      // Check specific keywords from knowledge base
      for (const faq of knowledgeBase.faq) {
        for (const keyword of faq.keywords) {
          if (normalized.includes(keyword)) {
            return { type: 'faq', data: faq };
          }
        }
      }
      
      // Check search intent - MORE FLEXIBLE
      if (/(tim|tìm|search|co|có|su kien|sự kiện|event|xem|show|danh sach|danh sách|list)/.test(normalized)) {
        return { type: 'search', query: message };
      }
      
      // If message contains question words, it might be about events
      if (/(nao|nào|gi|gì|dau|đâu|khi nao|khi nào|the nao|thế nào)/.test(normalized)) {
        return { type: 'search', query: message };
      }
      
      return { type: 'fallback' };
    }
  };

  // ==================== UI Rendering ==================== //
  const ui = {
    appendMessage: (sender, content, options = {}) => {
      const time = utils.formatTime();
      const row = document.createElement('div');
      row.className = `cb-row ${sender === 'user' ? 'end' : ''}`;
      
      const avatar = sender === 'user' ? '👤' : '🤖';
      const bubbleClass = sender === 'user' ? 'user' : 'bot';
      
      row.innerHTML = `
        <div class="cb-bubblewrap ${sender === 'user' ? 'reverse' : ''}">
          <div class="cb-avatar ${bubbleClass}">${avatar}</div>
          <div class="cb-bubble ${bubbleClass}">
            <div style="white-space: pre-line">${content}</div>
            ${!options.hideTime ? `<div class="cb-time">${time}</div>` : ''}
          </div>
        </div>
      `;
      
      elements.body.appendChild(row);
      utils.scrollToBottom();
      
      state.messageHistory.push({ sender, content, time });
      if (state.messageHistory.length > CONFIG.MAX_HISTORY * 2) {
        state.messageHistory.shift();
      }
    },

    showTyping: () => {
      const row = document.createElement('div');
      row.className = 'cb-row cb-typing';
      row.id = 'cb-typing-indicator';
      row.innerHTML = `
        <div class="cb-bubblewrap">
          <div class="cb-avatar bot">🤖</div>
          <div class="cb-bubble bot">
            <span class="cb-dots">
              <span></span><span></span><span></span>
            </span>
          </div>
        </div>
      `;
      elements.body.appendChild(row);
      utils.scrollToBottom();
      state.isTyping = true;
    },

    hideTyping: () => {
      const indicator = document.getElementById('cb-typing-indicator');
      if (indicator) {
        indicator.remove();
      }
      state.isTyping = false;
    },

    showQuickActions: (actions) => {
      const actionsHtml = actions.map(action => 
        `<button class="cb-quick-btn" onclick="ChatbotSimple.sendQuickAction('${action.text}')">${action.icon} ${action.label}</button>`
      ).join('');
      
      return `<div class="cb-quick-actions">${actionsHtml}</div>`;
    },

    renderEventCard: (event) => {
      const date = new Date(event.startTime);
      const day = date.getDate();
      const month = date.toLocaleDateString('vi-VN', { month: 'short' });
      
      return `
        <div class="cb-event-card">
          <div class="cb-event-header">
            <div class="cb-event-date">
              <div style="font-size:16px">${day}</div>
              <div>${month}</div>
            </div>
            <div style="flex:1">
              <h4 class="cb-event-title">${event.title}</h4>
              <div class="cb-event-info">
                📍 ${event.location || 'Chưa cập nhật'}<br>
                ⏰ ${new Date(event.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    renderEventList: (events, searchQuery) => {
      if (events.length === 0) {
        return `Xin lỗi, hiện tại chưa có sự kiện về "${searchQuery}" trên hệ thống. 😔

Tuy nhiên, bạn có thể:
• 📅 Xem tất cả sự kiện đang có
• 🔔 Đăng ký để nhận thông báo khi có sự kiện mới
• 📞 Liên hệ hỗ trợ để được tư vấn thêm

Bạn muốn xem các sự kiện khác đang có không?`;
      }

      let html = `Tôi tìm thấy ${events.length} sự kiện phù hợp:\n\n`;
      html += events.map(event => ui.renderEventCard(event)).join('');
      html += `\n\n💡 Đăng nhập để đăng ký sự kiện nhé!`;
      
      return html;
    }
  };

  // ==================== Message Processor ==================== //
  const messageProcessor = {
    async process(userMessage) {
      const intent = intentEngine.detect(userMessage);
      state.conversationContext.lastIntent = intent.type;
      
      let response = '';
      
      switch (intent.type) {
        case 'greeting':
          response = utils.random(knowledgeBase.greetings);
          response += '\n\n' + ui.showQuickActions([
            { icon: '🔍', label: 'Tìm sự kiện', text: 'Có sự kiện gì hay?' },
            { icon: '📝', label: 'Đăng ký', text: 'Làm sao để đăng ký?' },
            { icon: '🎫', label: 'Xem vé', text: 'Xem vé của tôi' },
            { icon: '❓', label: 'Trợ giúp', text: 'EventQR có tính năng gì?' }
          ]);
          break;

        case 'thanks':
          response = utils.random(knowledgeBase.thanks);
          break;

        case 'faq':
          response = intent.data.answer;
          break;

        case 'search':
          const normalized = utils.normalize(userMessage);
          let events = [];
          
          // Check if user wants to see all events
          if (/(tat ca|tất cả|all|xem het|xem hết|show all)/.test(normalized)) {
            events = await api.getEvents();
          } else {
            events = await api.searchEvents(userMessage);
          }
          
          response = ui.renderEventList(events, userMessage);
          state.conversationContext.currentEvents = events;
          
          // Suggest viewing all events if search returns nothing
          if (events.length === 0) {
            response += '\n\n' + ui.showQuickActions([
              { icon: '📅', label: 'Xem tất cả sự kiện', text: 'Xem tất cả sự kiện' },
              { icon: '🔍', label: 'Tìm khác', text: 'Tìm sự kiện công nghệ' },
              { icon: '📞', label: 'Liên hệ', text: 'Liên hệ hỗ trợ' }
            ]);
          }
          break;

        case 'fallback':
        default:
          response = utils.random(knowledgeBase.fallbacks);
          break;
      }
      
      return response;
    }
  };

  // ==================== Event Handlers ==================== //
  const handlers = {
    open: () => {
      elements.window.classList.remove('hidden');
      state.isOpen = true;
      
      if (state.messageHistory.length === 0) {
        setTimeout(() => {
          const greeting = utils.random(knowledgeBase.greetings);
          ui.appendMessage('bot', greeting);
          
          const quickActions = ui.showQuickActions([
            { icon: '🔍', label: 'Tìm sự kiện', text: 'Có sự kiện gì hay?' },
            { icon: '📝', label: 'Cách đăng ký', text: 'Làm sao để đăng ký sự kiện?' },
            { icon: '🎫', label: 'Xem vé', text: 'Xem vé của tôi' },
            { icon: '❓', label: 'Tính năng', text: 'EventQR có tính năng gì?' }
          ]);
          
          ui.appendMessage('bot', quickActions, { hideTime: true });
        }, 300);
      }
      
      elements.input.focus();
    },

    close: () => {
      elements.window.classList.add('hidden');
      state.isOpen = false;
    },

    toggle: () => {
      if (state.isOpen) {
        handlers.close();
      } else {
        handlers.open();
      }
    },

    async send() {
      const message = elements.input.value.trim();
      if (!message || state.isTyping) return;

      ui.appendMessage('user', message);
      elements.input.value = '';
      elements.input.focus();

      ui.showTyping();
      await new Promise(resolve => setTimeout(resolve, CONFIG.TYPING_DELAY));

      const response = await messageProcessor.process(message);

      ui.hideTyping();
      ui.appendMessage('bot', response);
    },

    keyPress: (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handlers.send();
      }
    }
  };

  // ==================== Initialization ==================== //
  const init = () => {
    elements = {
      openBtn: document.getElementById('cb-open'),
      window: document.getElementById('cb-window'),
      closeBtn: document.getElementById('cb-close'),
      body: document.getElementById('cb-messages'),
      input: document.getElementById('cb-input'),
      sendBtn: document.getElementById('cb-send')
    };

    if (!elements.openBtn || !elements.window) {
      console.error('Chatbot: Missing required DOM elements');
      return;
    }

    elements.openBtn.addEventListener('click', handlers.open);
    elements.closeBtn.addEventListener('click', handlers.close);
    elements.sendBtn.addEventListener('click', handlers.send);
    elements.input.addEventListener('keypress', handlers.keyPress);

    console.log('✅ Simple Chatbot initialized successfully (No API required)');
  };

  // ==================== Public API ==================== //
  return {
    init,
    open: handlers.open,
    close: handlers.close,
    toggle: handlers.toggle,
    sendQuickAction: (text) => {
      if (!state.isOpen) handlers.open();
      setTimeout(() => {
        elements.input.value = text;
        handlers.send();
      }, 100);
    }
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ChatbotSimple.init);
} else {
  ChatbotSimple.init();
}

