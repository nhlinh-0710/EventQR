// ==================== AI Chatbot with Gemini ==================== //
// Modern, intelligent chatbot for EventQR
// Features: Intent recognition, event search, FAQ, natural conversations

const ChatbotAI = (function() {
  'use strict';

  // ==================== Configuration ==================== //
  const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyD4WwI7x34t2JWP-OKy9Rwm_2yrsGJKzVM', // Leave empty to use fallback mode (smart rule-based)
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    BACKEND_URL: 'http://localhost:8080/api',
    TYPING_DELAY: 800,
    MAX_HISTORY: 10
  };

  // ==================== State Management ==================== //
  const state = {
    isOpen: false,
    isTyping: false,
    messageHistory: [],
    conversationContext: {
      userName: null,
      lastIntent: null,
      currentEvents: [],
      awaitingConfirmation: null
    }
  };

  // ==================== DOM Elements ==================== //
  let elements = {};

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
    }
  };

  // ==================== API Functions ==================== //
  const api = {
    // Call Gemini AI (with fallback to smart responses)
    async callGeminiAI(userMessage, systemContext = '', conversationHistory = []) {
      // If no API key, use smart fallback
      if (!CONFIG.GEMINI_API_KEY) {
        console.warn('⚠️ No API key - using fallback mode');
        return this.smartFallback(userMessage);
      }

      try {
        // Build context-aware prompt
        let fullPrompt = `Bạn là trợ lý AI thông minh của EventQR - nền tảng quản lý sự kiện.

PERSONALITY:
- Tên: EventBot
- Tính cách: Thân thiện, nhiệt tình, hài hước, chuyên nghiệp
- Phong cách: Trả lời ngắn gọn (2-3 câu), súc tích, dễ hiểu
- Ngôn ngữ: Tiếng Việt tự nhiên, không quá formal
- Emoji: Dùng vừa phải để tạo cảm xúc

KIẾN THỨC:
- EventQR là nền tảng quản lý sự kiện tại Việt Nam
- Tính năng: Đăng ký sự kiện, QR check-in, thống kê, quản lý vé
- Hỗ trợ: Email hoviethao20042005@gmail.com, Phone +84 762 886 983

QUY TẮC TRẢ LỜI:
1. Nếu hỏi về sự kiện cụ thể không có → Nói thật thà + gợi ý giải pháp thay thế
2. Nếu không biết → Thừa nhận thẳng thắn + hướng dẫn tìm hiểu thêm
3. Nếu hỏi mơ hồ → Làm rõ câu hỏi một cách thông minh
4. Luôn kết thúc bằng câu hỏi mở để tiếp tục conversation

---

Người dùng hỏi: "${userMessage}"

Hãy trả lời một cách THÔNG MINH, TỰ NHIÊN và HỮU ÍCH (2-3 câu):`;

        // Add conversation history for context
        const contents = [{
          parts: [{ text: fullPrompt }]
        }];

        const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.8,  // More creative
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 250,  // Shorter responses
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
              }
            ]
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ Gemini API Error:', response.status, errorData);
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]) {
          console.error('❌ Invalid API response:', data);
          throw new Error('Invalid response format');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('✅ AI Response:', aiResponse);
        
        return aiResponse;
        
      } catch (error) {
        console.error('❌ Gemini AI Error:', error);
        return this.smartFallback(userMessage);
      }
    },

    // Smart fallback when AI is not available
    smartFallback(userMessage) {
      const normalized = utils.normalize(userMessage);
      
      console.log('⚠️ Using fallback mode - Consider adding Gemini API key for smarter responses');
      
      // Check if asking about specific event/person/topic
      if (/(co|có|ton tai|tồn tại|khong|không)/.test(normalized)) {
        if (/(su kien|sự kiện|event)/.test(normalized)) {
          return `Hmm, để tìm chính xác sự kiện bạn muốn, tôi cần tra cứu hệ thống. 

**Đề xuất:**
• 🔍 Thử tìm với từ khóa chung hơn (VD: "âm nhạc", "công nghệ")
• 📅 Đăng nhập để xem toàn bộ sự kiện
• 📞 Liên hệ: +84 762 886 983 để được tư vấn

Bạn quan tâm loại sự kiện nào nhất?`;
        }
      }
      
      // General fallback
      return `Tôi hiểu ý bạn rồi! 

Để giúp bạn tốt hơn:
• 🎯 Hỏi cụ thể hơn về sự kiện/tính năng nào đó
• 📞 Hoặc gọi ngay: +84 762 886 983
• 💬 Chat với team support qua email

Bạn cần tôi giúp gì cụ thể?`;
    },

    // Get events from backend
    async getEvents() {
      try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        return await response.json();
      } catch (error) {
        console.error('Backend Error:', error);
        return [];
      }
    },

    // Search events
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
        }).slice(0, 5); // Limit to 5 results
      } catch (error) {
        console.error('Search Error:', error);
        return [];
      }
    }
  };

  // ==================== Intent Recognition ==================== //
  const intentEngine = {
    patterns: {
      search: /tim|tìm|search|su kien|sự kiện|event|danh sach|danh sách|co gi|có gì|co|có|xem|show|list/i,
      register: /dang ky|đăng ký|register|tham gia|join|mua ve|mua vé/i,
      help: /giup|giúp|help|huong dan|hướng dẫn|ho tro|hỗ trợ|guide|lam sao|làm sao|the nao|thế nào/i,
      greeting: /^(hi|hello|xin chao|chào|hey|alo)\b/i,
      thanks: /cam on|cảm ơn|thank|thanks|merci|ok|okela/i,
      time: /bao gio|bao giờ|when|thoi gian|thời gian|gio|giờ|ngay|ngày/i,
      location: /o dau|ở đâu|where|dia diem|địa điểm|location|noi|nơi/i,
    },

    detect: (message) => {
      const normalized = utils.normalize(message);
      
      if (intentEngine.patterns.greeting.test(message)) {
        return 'greeting';
      }
      if (intentEngine.patterns.thanks.test(message)) {
        return 'thanks';
      }
      if (intentEngine.patterns.search.test(normalized)) {
        return 'search';
      }
      if (intentEngine.patterns.register.test(normalized)) {
        return 'register';
      }
      if (intentEngine.patterns.help.test(normalized)) {
        return 'help';
      }
      if (intentEngine.patterns.time.test(normalized)) {
        return 'time';
      }
      if (intentEngine.patterns.location.test(normalized)) {
        return 'location';
      }
      
      // If contains question words, likely about events
      if (/(nao|nào|gi|gì|dau|đâu|khi nao|khi nào|the nao|thế nào|khong|không)/.test(normalized)) {
        return 'search';
      }
      
      return 'general';
    }
  };

  // ==================== Response Generator ==================== //
  const responseGenerator = {
    greeting: () => {
      const greetings = [
        'Xin chào! 👋 Tôi là trợ lý AI của EventQR. Tôi có thể giúp bạn tìm sự kiện, đăng ký tham gia, hoặc trả lời các câu hỏi. Bạn cần gì?',
        'Chào bạn! 😊 Tôi sẵn sàng hỗ trợ bạn về các sự kiện. Bạn muốn tìm sự kiện nào?',
        'Hi! Rất vui được hỗ trợ bạn. Bạn đang tìm kiếm sự kiện gì?'
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    },

    thanks: () => {
      return 'Rất vui được giúp bạn! 😊 Nếu có câu hỏi gì khác, cứ hỏi tôi nhé!';
    },

    help: () => {
      return `Tôi có thể giúp bạn:

🔍 **Tìm kiếm sự kiện** - "Tìm sự kiện công nghệ"
📅 **Xem thông tin** - "Sự kiện nào đang diễn ra?"
📍 **Tìm theo địa điểm** - "Sự kiện ở Đà Nẵng"
🎫 **Hướng dẫn đăng ký** - "Làm sao để đăng ký?"

Bạn muốn làm gì nào?`;
    },

    noEvents: () => {
      return 'Hiện tại chưa có sự kiện phù hợp. Bạn thử tìm kiếm với từ khóa khác nhé! 🔍';
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
            <div>${content}</div>
            ${!options.hideTime ? `<div class="cb-time">${time}</div>` : ''}
          </div>
        </div>
      `;
      
      elements.body.appendChild(row);
      utils.scrollToBottom();
      
      // Save to history
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
        `<button class="cb-quick-btn" onclick="ChatbotAI.sendQuickAction('${action.text}')">${action.icon} ${action.label}</button>`
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

    renderEventList: (events, searchQuery = '') => {
      if (events.length === 0) {
        let msg = 'Xin lỗi, ';
        if (searchQuery) {
          msg += `hiện tại chưa có sự kiện về "${searchQuery}" trên hệ thống. 😔`;
        } else {
          msg += 'chưa tìm thấy sự kiện phù hợp.';
        }
        
        msg += `\n\n**Đề xuất:**
• 📅 Đăng nhập để xem tất cả sự kiện
• 🔔 Đăng ký nhận thông báo sự kiện mới
• 🔍 Thử từ khóa khác: "công nghệ", "workshop", "thiết kế"
• 📞 Liên hệ hỗ trợ: +84 762 886 983`;
        
        return msg;
      }

      let html = `Tôi tìm thấy **${events.length} sự kiện** phù hợp:\n\n`;
      html += events.map(event => ui.renderEventCard(event)).join('');
      html += `\n\n💡 Đăng nhập để đăng ký sự kiện nhé!`;
      
      return html;
    }
  };

  // ==================== Message Processor ==================== //
  const messageProcessor = {
    async process(userMessage) {
      const intent = intentEngine.detect(userMessage);
      state.conversationContext.lastIntent = intent;
      
      let response = '';
      
      switch (intent) {
        case 'greeting':
          response = responseGenerator.greeting();
          response += ui.showQuickActions([
            { icon: '🔍', label: 'Tìm sự kiện', text: 'Tìm sự kiện' },
            { icon: '❓', label: 'Trợ giúp', text: 'Hướng dẫn' }
          ]);
          break;

        case 'thanks':
          response = responseGenerator.thanks();
          break;

        case 'help':
          response = responseGenerator.help();
          break;

        case 'search':
          const normalized = utils.normalize(userMessage);
          let events = [];
          
          // Check if user wants all events
          if (/(tat ca|tất cả|all|xem het|xem hết)/.test(normalized)) {
            events = await api.getEvents();
          } else {
            events = await api.searchEvents(userMessage);
          }
          
          response = ui.renderEventList(events, userMessage);
          state.conversationContext.currentEvents = events;
          
          // Add quick actions if no results
          if (events.length === 0) {
            response += ui.showQuickActions([
              { icon: '📅', label: 'Xem tất cả', text: 'Xem tất cả sự kiện' },
              { icon: '🔍', label: 'Tìm khác', text: 'Tìm sự kiện công nghệ' },
              { icon: '❓', label: 'Trợ giúp', text: 'Làm sao để đăng ký?' }
            ]);
          }
          break;

        case 'register':
          response = `Để đăng ký sự kiện, bạn cần:
          
1️⃣ Nhấn nút **"Đăng Nhập"** ở góc phải trên
2️⃣ Đăng nhập hoặc tạo tài khoản mới
3️⃣ Chọn sự kiện bạn quan tâm
4️⃣ Nhấn **"Đăng Ký"** và điền thông tin

Vé của bạn sẽ có mã QR để check-in! 🎫`;
          break;

        case 'general':
        default:
          // Use Gemini AI for general conversation
          const aiResponse = await api.callGeminiAI(
            userMessage, 
            '', 
            state.messageHistory.slice(-5) // Last 5 messages for context
          );
          
          response = aiResponse || 'Xin lỗi, có vẻ tôi gặp chút vấn đề kỹ thuật. Bạn thử hỏi lại hoặc liên hệ hỗ trợ nhé! 😊';
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
      
      // Show welcome message on first open
      if (state.messageHistory.length === 0) {
        setTimeout(() => {
          ui.appendMessage('bot', responseGenerator.greeting());
          ui.appendMessage('bot', ui.showQuickActions([
            { icon: '🔍', label: 'Tìm sự kiện', text: 'Có sự kiện gì hay?' },
            { icon: '📅', label: 'Sự kiện sắp tới', text: 'Sự kiện sắp diễn ra' },
            { icon: '❓', label: 'Trợ giúp', text: 'Hướng dẫn sử dụng' }
          ]), { hideTime: true });
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

      // Show user message
      ui.appendMessage('user', message);
      elements.input.value = '';
      elements.input.focus();

      // Show typing indicator
      ui.showTyping();

      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, CONFIG.TYPING_DELAY));

      // Process message and get response
      const response = await messageProcessor.process(message);

      // Hide typing and show response
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
    // Get DOM elements
    elements = {
      openBtn: document.getElementById('cb-open'),
      window: document.getElementById('cb-window'),
      closeBtn: document.getElementById('cb-close'),
      body: document.getElementById('cb-messages'),
      input: document.getElementById('cb-input'),
      sendBtn: document.getElementById('cb-send')
    };

    // Check if all elements exist
    if (!elements.openBtn || !elements.window) {
      console.error('Chatbot: Missing required DOM elements');
      return;
    }

    // Bind events
    elements.openBtn.addEventListener('click', handlers.open);
    elements.closeBtn.addEventListener('click', handlers.close);
    elements.sendBtn.addEventListener('click', handlers.send);
    elements.input.addEventListener('keypress', handlers.keyPress);

    console.log('✅ AI Chatbot initialized successfully');
  };

  // ==================== Public API ==================== //
  return {
    init,
    open: handlers.open,
    close: handlers.close,
    toggle: handlers.toggle,
    sendQuickAction: (text) => {
      if (!state.isOpen) handlers.open();
      elements.input.value = text;
      handlers.send();
    }
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ChatbotAI.init);
} else {
  ChatbotAI.init();
}
