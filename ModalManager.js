/**
 * ==========================================
 * UNP TOURS - MASTER MODAL MANAGER (50 Points Complete)
 * ==========================================
 */
class ModalManager {
  constructor(options = {}) {
    this.options = Object.assign({
      rootSelector: 'body'
    }, options);

    this.modalStack = []; // Point 9: Stack ya kusaidia Multiple Modals
    this.originalOverflow = document.body.style.overflow;
    
    this._initEvents();
  }

  _initEvents() {
    // 1. Kufungua kupitia data attributes
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal-target]');
      if (openBtn) {
        const targetId = openBtn.getAttribute('data-modal-target');
        this.openModal(targetId, openBtn);
      }

      // 2. Kufunga kupitia data-modal-close au kubonyeza nje ya modal box
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn || (e.target.classList.contains('modal-overlay') && this.isOpen())) {
        e.preventDefault();
        const active = this.getActiveModal();
        if (active) this.closeModal(active);
      }
    });

    // 3. Global Keyboard Support (ESC Key - Point 21)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        e.preventDefault();
        const active = this.getActiveModal();
        if (active) this.closeModal(active);
      }

      // Focus Trap (Point 22, 23)
      if (e.key === 'Tab' && this.isOpen()) {
        this._handleFocusTrap(e);
      }
    });
  }

  openModal(selectorOrElement, triggerElement = null, focusTargetSelector = null) {
    const modal = typeof selectorOrElement === 'string' 
      ? document.querySelector(selectorOrElement) 
      : selectorOrElement;

    // Point 26: Error handling kama modal haipo
    if (!modal) {
      console.warn(`[UNP Tours Modal]: Modal "${selectorOrElement}" haijapatikana kwenye DOM.`);
      return;
    }

    const modalBox = modal.querySelector('.modal-box');
    if (!modalBox) {
      console.error('[UNP Tours Modal]: .modal-box haipo ndani ya modal container!');
      return;
    }

    // Point 33: Custom Event - modal:opening
    const openingEvent = new CustomEvent('modal:opening', { cancelable: true, detail: { modal } });
    modal.dispatchEvent(openingEvent);
    if (openingEvent.defaultPrevented) return;

    // Point 10: Z-Index Management kwenye Stack
    const baseZIndex = 1000;
    modal.style.zIndex = baseZIndex + (this.modalStack.length * 10);

    // Point 11: Scroll Lock Handling
    if (this.modalStack.length === 0) {
      this.originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Point 3 & 4: Weka inert na aria-hidden kwenye background content
      this._toggleBackgroundInert(true);
    }

    // Point 1, 2, 6: Accessibility Attributes
    modalBox.setAttribute('role', 'document');
    modalBox.setAttribute('tabindex', '-1'); // Point 5: Focus Trap Fallback

    // Hifadhi data ya modal hii kwenye Stack (Point 9, 12)
    const stackItem = {
      modal,
      modalBox,
      lastFocusedElement: triggerElement || document.activeElement
    };
    this.modalStack.push(stackItem);

    // Onyesha modal
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Point 7 & 31: Screen Reader Announcement & Event
    this._announceToScreenReader('Modal imefunguliwa');
    modal.dispatchEvent(new CustomEvent('modal:open', { detail: { modal } }));

    // Point 17: Subiri animation iishe kabla ya kuweka focus
    setTimeout(() => {
      if (focusTargetSelector) {
        const customTarget = modalBox.querySelector(focusTargetSelector);
        if (customTarget) customTarget.focus();
        else modalBox.focus();
      } else {
        const firstFocusable = modalBox.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
        else modalBox.focus(); // Fallback kwenye modal-box yenyewe
      }
    }, 300);
  }

  closeModal(selectorOrElement) {
    const modal = typeof selectorOrElement === 'string' 
      ? document.querySelector(selectorOrElement) 
      : selectorOrElement;

    const stackIndex = this.modalStack.findIndex(item => item.modal === modal);
    if (stackIndex === -1) return;

    const stackItem = this.modalStack[stackIndex];

    // Point 34: Custom Event - modal:closing
    const closingEvent = new CustomEvent('modal:closing', { cancelable: true, detail: { modal } });
    modal.dispatchEvent(closingEvent);
    if (closingEvent.defaultPrevented) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    // Ondoa kwenye stack
    this.modalStack.splice(stackIndex, 1);

    // Point 12 & 44: Rudisha focus kwenye element iliyoanzisha modal hii
    if (stackItem.lastFocusedElement && typeof stackItem.lastFocusedElement.focus === 'function') {
      stackItem.lastFocusedElement.focus();
    }

    // Kama stack imeisha, rudisha background ya kawaida
    if (this.modalStack.length === 0) {
      document.body.style.overflow = this.originalOverflow;
      this._toggleBackgroundInert(false);
    }

    // Point 32: Custom Event - modal:close
    modal.dispatchEvent(new CustomEvent('modal:close', { detail: { modal } }));
  }

  closeAll() {
    // Point 40: Funga modals zote kwa mpangilio wa stack
    while (this.modalStack.length > 0) {
      const topModal = this.modalStack[this.modalStack.length - 1].modal;
      this.closeModal(topModal);
    }
  }

  isOpen() {
    return this.modalStack.length > 0;
  }

  getActiveModal() {
    // Point 36: Pata modal ya juu kabisa kwenye stack
    if (!this.isOpen()) return null;
    return this.modalStack[this.modalStack.length - 1].modal;
  }

  getModalStack() {
    // Point 37: Pata orodha yote ya stack
    return [...this.modalStack];
  }

  _toggleBackgroundInert(status) {
    const siblings = document.body.children;
    Array.from(siblings).forEach(el => {
      if (!el.contains(this.getActiveModal())) {
        if (status) {
          el.setAttribute('inert', '');
          el.setAttribute('aria-hidden', 'true');
        } else {
          el.removeAttribute('inert');
          el.removeAttribute('aria-hidden');
        }
      }
    });
  }

  _handleFocusTrap(e) {
    const activeItem = this.modalStack[this.modalStack.length - 1];
    if (!activeItem) return;

    const focusables = activeItem.modalBox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  }

  _announceToScreenReader(message) {
    let announcer = document.getElementById('unp-sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'unp-sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  destroy() {
    // Point 27: Kusafisha kila kitu
    this.closeAll();
  }
}

// Anzisha moja kwa moja
document.addEventListener('DOMContentLoaded', () => {
  window.unpModals = new ModalManager();
});
