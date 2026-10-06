/**
 * ==========================================
 * UNP TOURS - MASTER WIDGET MANAGER (V3 Enterprise)
 * Fully Unified & Optimized for Nungwi, Zanzibar
 * ==========================================
 */
class WidgetManager {
  constructor(options = {}) {
    this.options = {
      lang: options.lang || 'sw',
      maxMessages: options.maxMessages || 100,
      storageKey: 'unp_chat_history_v3',
      rateLimitSec: 1,
      ...options
    };

    this.chatBtn = document.querySelector('.live-chat-btn');
    this.chatWindow = document.querySelector('.chat-window');
    this.unreadCount = 0;
    this.messages = [];
    this.isTyping = false;
    this.isMinimized = false;
    this.lastMessageTime = 0;
    
    this.isFocusTrapActive = false;
    this.boundHandlers = {};

    this.init();
  }

  init() {
    if (!this.chatBtn || !this.chatWindow) {
      console.warn('[WidgetManager V3]: Vitengo vya Live Chat havijapatikana kwenye DOM.');
      return;
    }

    this.setupDOMAttributes();
    this.loadHistory();
    this.initEvents();
    this.initOfflineSupport();
    this.initMobileGestures();
  }

  setupDOMAttributes() {
    this.chatBtn.setAttribute('aria-label', this.options.lang === 'sw' ? 'Fungua mazungumzo' : 'Open chat');
    this.chatBtn.setAttribute('aria-controls', 'unp-chat-window');
    this.chatBtn.setAttribute('aria-expanded', 'false');

    this.chatWindow.id = 'unp-chat-window';
    this.chatWindow.setAttribute('role', 'dialog');
    this.chatWindow.setAttribute('aria-modal', 'true');
    this.chatWindow.setAttribute('aria-label', this.options.lang === 'sw' ? 'Mazungumzo ya UNP Tours' : 'UNP Tours Live Chat');
    this.chatWindow.setAttribute('tabindex', '-1');

    const chatBody = this.chatWindow.querySelector('.chat-body');
    if (chatBody) {
      chatBody.setAttribute('role', 'log');
      chatBody.setAttribute('aria-live', 'polite');
      chatBody.setAttribute('aria-relevant', 'additions');
      this.initScrollToBottom(chatBody);
    }
  }

  initEvents() {
    if (this.boundHandlers.clickChatBtn) {
      this.chatBtn.removeEventListener('click', this.boundHandlers.clickChatBtn);
    }

    this.boundHandlers.clickChatBtn = (e) => {
      e.stopPropagation();
      this.toggleChatWindow();
    };
    this.chatBtn.addEventListener('click', this.boundHandlers.clickChatBtn);

    const closeBtn = this.chatWindow.querySelector('.chat-close, .close-btn');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', this.options.lang === 'sw' ? 'Funga mazungumzo' : 'Close chat');
      this.boundHandlers.closeBtn = () => this.closeChatWindow();
      closeBtn.addEventListener('click', this.boundHandlers.closeBtn);
    }

    this.boundHandlers.documentKeydown = (e) => {
      if (e.key === 'Escape' && this.chatWindow.classList.contains('open')) {
        this.closeChatWindow();
      }
    };
    document.addEventListener('keydown', this.boundHandlers.documentKeydown);

    const chatForm = this.chatWindow.querySelector('form') || this.chatWindow.querySelector('.chat-input-area');
    if (chatForm) {
      this.initChatForm(chatForm);
    }
  }

  toggleChatWindow() {
    if (this.chatWindow.classList.contains('open')) {
      this.closeChatWindow();
    } else {
      this.openChatWindow();
    }
  }

  openChatWindow() {
    this.chatWindow.classList.add('open');
    this.chatBtn.setAttribute('aria-expanded', 'true');
    this.chatWindow.focus();

    this.unreadCount = 0;
    this.updateUnreadBadge();

    this.setupFocusTrap();
    window.dispatchEvent(new CustomEvent('chat:open'));
  }

  closeChatWindow() {
    this.chatWindow.classList.remove('open');
    this.chatBtn.setAttribute('aria-expanded', 'false');

    if (this.isFocusTrapActive) {
      this.removeFocusTrap();
    }

    if (this.chatBtn) {
      this.chatBtn.focus();
    }

    window.dispatchEvent(new CustomEvent('chat:close'));
  }

  setupFocusTrap() {
    if (this.isFocusTrapActive) return;

    const focusableElements = this.chatWindow.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.boundHandlers.focusTrap = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.chatWindow.addEventListener('keydown', this.boundHandlers.focusTrap);
    this.isFocusTrapActive = true;
  }

  removeFocusTrap() {
    if (!this.isFocusTrapActive) return;
    this.chatWindow.removeEventListener('keydown', this.boundHandlers.focusTrap);
    this.isFocusTrapActive = false;
  }

  initMobileGestures() {
    let startY = 0;
    this.boundHandlers.touchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    this.boundHandlers.touchEnd = (e) => {
      const endY = e.changedTouches[0].clientY;
      if (endY - startY > 100 && this.chatWindow.classList.contains('open')) {
        this.closeChatWindow();
      }
    };

    this.chatWindow.addEventListener('touchstart', this.boundHandlers.touchStart, { passive: true });
    this.chatWindow.addEventListener('touchend', this.boundHandlers.touchEnd, { passive: true });

    if (window.visualViewport) {
      this.boundHandlers.viewportResize = () => {
        if (this.chatWindow.classList.contains('open')) {
          this.chatWindow.style.height = `${window.visualViewport.height}px`;
        }
      };
      window.visualViewport.addEventListener('resize', this.boundHandlers.viewportResize);
    }
  }

  initChatForm(container) {
    const input = container.querySelector('input, textarea');
    const sendBtn = container.querySelector('button, .send-btn');
    const chatBody = this.chatWindow.querySelector('.chat-body');

    if (!input || !chatBody) return;

    input.setAttribute('aria-label', this.options.lang === 'sw' ? 'Andika ujumbe wako' : 'Type your message');
    if (sendBtn) {
      sendBtn.setAttribute('aria-label', this.options.lang === 'sw' ? 'Tuma ujumbe' : 'Send message');
    }

    if (input.tagName === 'TEXTAREA') {
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
      });
    }

    const handleSend = () => {
      const now = Date.now();
      if (now - this.lastMessageTime < this.options.rateLimitSec * 1000) return;
      this.lastMessageTime = now;

      const text = input.value.trim();
      if (!text) return;

      if (text.length > 500) {
        alert(this.options.lang === 'sw' ? 'Ujumbe ni mrefu sana (kikomo herufi 500).' : 'Message too long.');
        return;
      }

      this.addMessage(text, 'client');
      input.value = '';
      if (input.tagName === 'TEXTAREA') input.style.height = 'auto';

      window.dispatchEvent(new CustomEvent('chat:send', { detail: { text } }));

      this.showTypingIndicator();
      this.processAutoReply(text);
    };

    if (sendBtn) {
      this.boundHandlers.sendClick = (e) => {
        e.preventDefault();
        handleSend();
      };
      sendBtn.addEventListener('click', this.boundHandlers.sendClick);
    }

    this.boundHandlers.inputKeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    input.addEventListener('keydown', this.boundHandlers.inputKeydown);
  }

  async processAutoReply(text, retryCount = 3) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      this.removeTypingIndicator();
      const replyText = this.options.lang === 'sw'
        ? `Karibu UNP Tours Nungwi! Tumepokea ujumbe wako: "${text}". Timu yetu itawasiliana nawe.`
        : `Welcome to UNP Tours Nungwi! Received: "${text}". Our team will contact you shortly.`;

      this.addMessage(replyText, 'support');
      this.playNotificationSound();
    } catch (error) {
      if (retryCount > 0) {
        setTimeout(() => this.processAutoReply(text, retryCount - 1), 2000);
      } else {
        this.removeTypingIndicator();
        this.addMessage(this.options.lang === 'sw' ? 'Samahani, kuna tatizo la kimtandao.' : 'Network error.', 'support');
      }
    }
  }

  addMessage(text, sender) {
    const chatBody = this.chatWindow.querySelector('.chat-body');
    if (!chatBody) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgObj = { text, sender, time: timeString };

    this.messages.push(msgObj);
    if (this.messages.length > this.options.maxMessages) {
      this.messages.shift();
    }
    this.saveHistory();

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.style.cssText = sender === 'client'
      ? 'background: var(--primary-color, #0d1b2a); color: #fff; padding: 10px 14px; border-radius: 8px; align-self: flex-end; max-width: 80%; font-size: 0.85rem; margin-bottom: 8px;'
      : 'background: #e2e8f0; color: #0d1b2a; padding: 10px 14px; border-radius: 8px; align-self: flex-start; max-width: 80%; font-size: 0.85rem; margin-bottom: 8px;';

    msgDiv.innerHTML = `
      <div class="msg-text">${this.escapeHTML(text)}</div>
      <div class="msg-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; opacity: 0.7; margin-top: 4px;">
        <span class="msg-time">${timeString}</span>
        ${sender === 'client' ? '<span class="msg-status" style="margin-left: 6px;">✓✓</span>' : ''}
      </div>
    `;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (!this.chatWindow.classList.contains('open') && sender === 'support') {
      this.unreadCount++;
      this.updateUnreadBadge();
    }
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    this.isTyping = true;
    const chatBody = this.chatWindow.querySelector('.chat-body');
    if (!chatBody) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'chat-typing-indicator';
    typingDiv.className = 'chat-msg support typing';
    typingDiv.style.cssText = 'background: #e2e8f0; color: #555; padding: 8px 12px; border-radius: 8px; align-self: flex-start; font-size: 0.85rem; margin-bottom: 8px; font-style: italic;';
    typingDiv.textContent = this.options.lang === 'sw' ? 'UNP Tours inaandika...' : 'UNP Tours is typing...';
    
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  removeTypingIndicator() {
    this.isTyping = false;
    const typingDiv = document.getElementById('chat-typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  initScrollToBottom(chatBody) {
    let scrollBtn = this.chatWindow.querySelector('.scroll-to-bottom-btn');
    if (!scrollBtn) {
      scrollBtn = document.createElement('button');
      scrollBtn.className = 'scroll-to-bottom-btn';
      scrollBtn.innerHTML = '&downarrow;';
      scrollBtn.style.cssText = 'position: absolute; bottom: 70px; right: 20px; background: var(--primary-color, #0d1b2a); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: none; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2);';
      this.chatWindow.appendChild(scrollBtn);

      scrollBtn.addEventListener('click', () => {
        chatBody.scrollTop = chatBody.scrollHeight;
        scrollBtn.style.display = 'none';
      });
    }

    chatBody.addEventListener('scroll', () => {
      const isAtBottom = chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 50;
      scrollBtn.style.display = isAtBottom ? 'none' : 'block';
    });
  }

  playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  updateUnreadBadge() {
    let badge = this.chatBtn.querySelector('.chat-badge');
    if (this.unreadCount > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'chat-badge';
        badge.style.cssText = 'position: absolute; top: -4px; right: -4px; background: #c62828; color: #fff; font-size: 0.7rem; padding: 2px 6px; border-radius: 50%; font-weight: bold;';
        this.chatBtn.appendChild(badge);
      }
      badge.textContent = this.unreadCount;
    } else if (badge) {
      badge.remove();
    }
  }

  saveHistory() {
    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(this.messages));
    } catch (e) {}
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem(this.options.storageKey);
      if (saved) {
        this.messages = JSON.parse(saved);
        const chatBody = this.chatWindow.querySelector('.chat-body');
        if (!chatBody) return;

        this.messages.forEach(msg => {
          const msgDiv = document.createElement('div');
          msgDiv.className = `chat-msg ${msg.sender}`;
          msgDiv.style.cssText = msg.sender === 'client'
            ? 'background: var(--primary-color, #0d1b2a); color: #fff; padding: 10px 14px; border-radius: 8px; align-self: flex-end; max-width: 80%; font-size: 0.85rem; margin-bottom: 8px;'
            : 'background: #e2e8f0; color: #0d1b2a; padding: 10px 14px; border-radius: 8px; align-self: flex-start; max-width: 80%; font-size: 0.85rem; margin-bottom: 8px;';

          msgDiv.innerHTML = `
            <div class="msg-text">${this.escapeHTML(msg.text)}</div>
            <div class="msg-meta" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; opacity: 0.7; margin-top: 4px;">
              <span class="msg-time">${msg.time || ''}</span>
              ${msg.sender === 'client' ? '<span class="msg-status" style="margin-left: 6px;">✓✓</span>' : ''}
            </div>
          `;
          chatBody.appendChild(msgDiv);
        });
      }
    } catch (e) {}
  }

  initOfflineSupport() {
    window.addEventListener('online', () => console.log('[WidgetManager]: Online'));
    window.addEventListener('offline', () => console.warn('[WidgetManager]: Offline'));
  }

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  destroy() {
    this.removeFocusTrap();
    if (this.chatBtn && this.boundHandlers.clickChatBtn) {
      this.chatBtn.removeEventListener('click', this.boundHandlers.clickChatBtn);
    }
    if (this.boundHandlers.documentKeydown) {
      document.removeEventListener('keydown', this.boundHandlers.documentKeydown);
    }
    this.boundHandlers = {};
  }
}

// Anzisha Mfumo rasmi
document.addEventListener('DOMContentLoaded', () => {
  window.unpWidgets = new WidgetManager({ lang: 'sw' });
});
