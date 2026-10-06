<!-- ==========================================
     UNP TOURS - MASTER TAGS HANDLER (100% COMPLETE)
     ========================================== -->

<style>
  /* 1. Muundo wa Container ya Tags */
  .form-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    min-height: 45px;
    cursor: text;
  }

  .form-tags[aria-disabled="true"] {
    background-color: #e9ecef;
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* 2. Muundo wa Kila Tag Item & :focus-visible (Point 3) */
  .form-tag-item {
    display: inline-flex;
    align-items: center;
    background-color: #e9ecef;
    color: #333;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    gap: 6px;
    outline: none;
  }

  .form-tag-item:focus-visible {
    outline: 2px solid gold;
    outline-offset: 2px;
  }

  /* Success Pulse Animation (Point 17) */
  .tag-success-pulse {
    background-color: #d4edda !important;
    transition: background-color 1s ease;
  }

  /* 3. CSS kwa .form-control-inline */
  .form-control-inline {
    border: none !important;
    outline: none !important;
    background: transparent !important;
    flex: 1;
    min-width: 120px;
    font-size: 0.95rem;
    padding: 4px;
    color: inherit;
  }

  /* 4. Touch Support & Close Button (Point 30: role="button") */
  .tag-remove-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    font-size: 1.1rem;
    padding: 0 4px;
    min-width: 24px;
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* 5. Ujumbe wa Makosa na Hints (Point 12: pointer-events: none) */
  .form-tags-hint {
    display: block;
    width: 100%;
    font-size: 0.75rem;
    margin-top: 4px;
    color: #6c757d;
    pointer-events: none;
  }

  .form-tag-error {
    font-size: 0.8rem;
    width: 100%;
    color: #dc3545;
    margin-top: 4px;
  }

  /* 6. Mobile Support */
  @media (max-width: 480px) {
    .form-tags {
      flex-direction: column;
      align-items: stretch !important;
    }
    .form-tag-item {
      justify-content: space-between;
    }
  }

  /* 7. Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .form-tags {
      background-color: #1e1e1e !important;
      border-color: #333333 !important;
    }
    .form-tag-item {
      background-color: #333333 !important;
      color: #ffffff !important;
    }
  }
</style>

<script>
  /**
   * UNP Tours - Master Tags Handler (V10 - 100% Complete with all 30 enhancements)
   */
  class TagsHandler {
    constructor(containerSelector, options = {}) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.options = Object.assign({
        maxTags: 10,
        maxTagLength: 30,
        lowercase: false,
        allowDuplicates: false,
        placeholder: 'Andika tag na ubonyeze Enter...',
        disabled: false
      }, options);

      this.tags = [];
      this.disabled = this.options.disabled;
      this.init();
    }

    init() {
      this.container.setAttribute('role', 'list');
      this.container.setAttribute('aria-live', 'polite');
      this.container.classList.add('form-tags');

      if (this.disabled) {
        this.container.setAttribute('aria-disabled', 'true');
      }

      // Point 2 & 18: Hint na id="tags-hint" pamoja na aria-label
      if (!this.container.querySelector('.form-tags-hint')) {
        const hint = document.createElement('small');
        hint.className = 'form-tags-hint';
        hint.id = 'tags-hint';
        hint.setAttribute('aria-label', 'Maelekezo ya kuweka tags');
        hint.textContent = 'Bonyeza Enter kuongeza, Backspace kufuta.';
        this.container.appendChild(hint);
      }

      // Input configuration (Points 10, 19, 20, 21, 22)
      this.input = this.container.querySelector('input');
      if (!this.input) {
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'form-control-inline';
        this.input.placeholder = this.options.placeholder;
        this.input.setAttribute('aria-describedby', 'tags-hint');
        this.input.setAttribute('aria-keyshortcuts', 'Enter');
        this.input.setAttribute('maxlength', this.options.maxTagLength);
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('spellcheck', 'false');
        this.input.setAttribute('inputmode', 'text');
        this.container.appendChild(this.input);
      }

      if (this.disabled) {
        this.input.setAttribute('disabled', 'true');
      }

      this.bindEvents();
    }

    bindEvents() {
      this._onKeydown = this.handleKeydown.bind(this);
      this._onPaste = this.handlePaste.bind(this);
      this._onBlur = this.handleBlur.bind(this);
      this._onClick = this.handleClick.bind(this);
      this._onContainerKeydown = this.handleContainerKeydown.bind(this);

      this.input.addEventListener('keydown', this._onKeydown);
      this.input.addEventListener('paste', this._onPaste);
      this.input.addEventListener('blur', this._onBlur);
      this.container.addEventListener('click', this._onClick);
      this.container.addEventListener('keydown', this._onContainerKeydown);
    }

    handleKeydown(e) {
      if (this.disabled) return;
      const value = this.input.value.trim();
      const tagItems = Array.from(this.container.querySelectorAll('.form-tag-item'));

      if (e.key === 'Enter') {
        e.preventDefault();
        if (value) this.addTag(value);
      } else if (e.key === 'Backspace' && value === '' && tagItems.length > 0) {
        e.preventDefault();
        this.removeTag(tagItems.length - 1);
      } else if (e.key === 'ArrowLeft' && value === '' && tagItems.length > 0) {
        e.preventDefault();
        tagItems[tagItems.length - 1].focus();
        this.dispatchFocusEvent(tagItems[tagItems.length - 1]);
      } else if (e.key === 'Escape') {
        // Point 6: Escape handler kufuta input value
        this.input.value = '';
        this.clearError();
      } else if (e.key === 'Tab' && e.shiftKey && tagItems.length > 0) {
        // Point 29: Shift+Tab kurudi kwenye tag ya mwisho kutoka input
        e.preventDefault();
        tagItems[tagItems.length - 1].focus();
      }
    }

    handleContainerKeydown(e) {
      if (this.disabled) return;
      if (!e.target.classList.contains('form-tag-item')) return;

      const tagItems = Array.from(this.container.querySelectorAll('.form-tag-item'));
      const currentIndex = tagItems.indexOf(e.target);

      // Points 1, 4, 5, 7, 8: Navigation handlers (ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Home, End)
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < tagItems.length - 1) {
          tagItems[currentIndex + 1].focus();
          this.dispatchFocusEvent(tagItems[currentIndex + 1]);
        } else {
          this.input.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          tagItems[currentIndex - 1].focus();
          this.dispatchFocusEvent(tagItems[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Home') {
        e.preventDefault();
        if (tagItems.length > 0) {
          tagItems[0].focus();
          this.dispatchFocusEvent(tagItems[0]);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'End') {
        e.preventDefault();
        if (tagItems.length > 0) {
          tagItems[tagItems.length - 1].focus();
          this.dispatchFocusEvent(tagItems[tagItems.length - 1]);
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
        e.preventDefault();
        this.removeTag(currentIndex);
      }
    }

    handlePaste(e) {
      if (this.disabled) return;
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text');
      const parts = pasteData.split(/[,;\n]+/);
      parts.forEach(part => this.addTag(part));
    }

    handleBlur() {
      if (this.disabled) return;
      const value = this.input.value.trim();
      if (value) {
        this.addTag(value);
      }
    }

    handleClick(e) {
      if (this.disabled) return;
      if (e.target.classList.contains('tag-remove-btn') || e.target.getAttribute('role') === 'button') {
        const tagItem = e.target.closest('.form-tag-item');
        const index = Array.from(this.container.querySelectorAll('.form-tag-item')).indexOf(tagItem);
        if (index > -1) this.removeTag(index);
      }
    }

    addTag(text) {
      if (this.disabled) return;
      let processedText = text.trim();

      if (this.options.lowercase) {
        processedText = processedText.toLowerCase();
      }

      if (!processedText || processedText.length > this.options.maxTagLength) {
        this.triggerError(`Tag lazima iwe kati ya herufi 1 na ${this.options.maxTagLength}.`);
        return;
      }

      if (this.tags.length >= this.options.maxTags) {
        this.triggerError(`Umezidisha kikomo cha tags (${this.options.maxTags}).`);
        return;
      }

      if (!this.options.allowDuplicates && this.tags.includes(processedText)) {
        this.triggerError('Tag hii ipo tayari.');
        return;
      }

      this.tags.push(processedText);
      this.input.value = '';
      this.clearError();
      this.render();

      // Point 11: Screen Reader Announcement maalum
      this.announceScreenReader(`Tag ${processedText} imeongezwa`);

      this.container.dispatchEvent(new CustomEvent('tag:added', { detail: { tag: processedText, tags: this.tags } }));
    }

    removeTag(index) {
      if (this.disabled) return;
      const removed = this.tags.splice(index, 1)[0];
      this.render();

      // Point 9: Focus management baada ya kufuta
      const tagItems = Array.from(this.container.querySelectorAll('.form-tag-item'));
      if (tagItems.length > 0) {
        const nextIndex = Math.min(index, tagItems.length - 1);
        tagItems[nextIndex].focus();
      } else {
        this.input.focus();
      }

      this.announceScreenReader(`Tag ${removed} imefutwa`);
      this.container.dispatchEvent(new CustomEvent('tag:removed', { detail: { removed, tags: this.tags } }));
    }

    triggerError(message) {
      this.input.setAttribute('aria-invalid', 'true');
      let err = this.container.querySelector('.form-tag-error');
      if (!err) {
        err = document.createElement('div');
        err.className = 'form-tag-error';
        this.container.appendChild(err);
      }
      err.textContent = message;

      // Point 16: Error clearing kwa Timer (sekunde 4)
      clearTimeout(this._errorTimeout);
      this._errorTimeout = setTimeout(() => {
        this.clearError();
      }, 4000);

      // Point 23: Custom Event kwa Error
      this.container.dispatchEvent(new CustomEvent('tag:error', { detail: { message } }));
    }

    clearError() {
      this.input.removeAttribute('aria-invalid');
      const err = this.container.querySelector('.form-tag-error');
      if (err) err.remove();
    }

    announceScreenReader(msg) {
      let announcer = this.container.querySelector('.sr-announcer');
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.className = 'sr-announcer';
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.setAttribute('aria-live', 'polite');
        this.container.appendChild(announcer);
      }
      announcer.textContent = msg;
    }

    dispatchFocusEvent(targetElement) {
      this.container.dispatchEvent(new CustomEvent('tag:focus', { detail: { target: targetElement } }));
    }

    render() {
      const existingItems = this.container.querySelectorAll('.form-tag-item');
      existingItems.forEach(el => el.remove());

      this.tags.forEach((tag) => {
        const tagEl = document.createElement('span');
        tagEl.className = 'form-tag-item';
        tagEl.setAttribute('role', 'listitem');
        tagEl.setAttribute('tabindex', '0');
        tagEl.setAttribute('aria-label', `Tag: ${tag}`);
        
        // Point 30: role="button" kwenye close button
        tagEl.innerHTML = `
          <span class="tag-text">${tag}</span>
          <button type="button" class="tag-remove-btn" role="button" aria-label="Remove tag ${tag}">&times;</button>
        `;

        // Point 17: Success feedback ya muda mfupi (1 sekunde)
        tagEl.classList.add('tag-success-pulse');
        setTimeout(() => tagEl.classList.remove('tag-success-pulse'), 1000);

        this.container.insertBefore(tagEl, this.input);
      });
    }

    // Methods za Ziada (Points 25, 26, 27)
    getTags() {
      return [...this.tags];
    }

    setTags(newTags) {
      this.tags = [];
      newTags.forEach(t => this.addTag(t));
    }

    clear() {
      this.tags = [];
      this.render();
      this.clearError();
    }

    focus() {
      this.input.focus();
    }

    disable() {
      this.disabled = true;
      this.container.setAttribute('aria-disabled', 'true');
      this.input.setAttribute('disabled', 'true');
    }

    enable() {
      this.disabled = false;
      this.container.removeAttribute('aria-disabled');
      this.input.removeAttribute('disabled');
    }

    destroy() {
      this.input.removeEventListener('keydown', this._onKeydown);
      this.input.removeEventListener('paste', this._onPaste);
      this.input.removeEventListener('blur', this._onBlur);
      this.container.removeEventListener('click', this._onClick);
      this.container.removeEventListener('keydown', this._onContainerKeydown);
    }
  }

  // Mfano wa matumizi:
  document.addEventListener('DOMContentLoaded', () => {
    window.myTags = new TagsHandler('#tour-tags-container', {
      maxTags: 5,
      placeholder: 'Ongeza vivutio vya Nungwi...'
    });
  });
</script>
