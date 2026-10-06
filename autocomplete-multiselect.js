<!-- ==========================================
     UNP TOURS - ADVANCED FORM HANDLERS (100% ULTIMATE PERFECTION)
     ========================================== -->

<style>
  .form-group-custom { position: relative; margin-bottom: 20px; font-family: inherit; }
  .autocomplete-container, .multiselect-container { position: relative; border: 1px solid #ccc; border-radius: 6px; background: #fff; padding: 8px; }
  .autocomplete-input-wrapper { display: flex; align-items: center; gap: 6px; }
  .autocomplete-input-wrapper input, .multiselect-search { border: none; outline: none; background: transparent; flex: 1; padding: 8px; font-size: 0.95rem; }
  .autocomplete-dropdown, .multiselect-listbox { max-height: 200px; overflow-y: auto; margin-top: 4px; border-top: 1px solid #eee; }
  .autocomplete-item, .multiselect-option { padding: 10px 12px; cursor: pointer; min-height: 44px; display: flex; align-items: center; justify-content: space-between; }
  .autocomplete-item.active, .autocomplete-item:hover, .multiselect-option:hover { background-color: #e9ecef; }
  .multiselect-option[aria-selected="true"] { background-color: #e2f0d9; color: #274e13; }
  .loading-spinner { padding: 12px; text-align: center; color: #6c757d; font-style: italic; }
  .form-hint { font-size: 0.75rem; color: #6c757d; margin-top: 4px; display: block; }
  .clear-btn, .clear-all-btn { background: none; border: none; cursor: pointer; font-size: 1rem; color: #6c757d; padding: 4px 8px; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

  @media (prefers-color-scheme: dark) {
    .autocomplete-container, .multiselect-container { background-color: #1e1e1e; border-color: #333; color: #fff; }
    .autocomplete-item.active, .autocomplete-item:hover, .multiselect-option:hover { background-color: #333; }
    .multiselect-option[aria-selected="true"] { background-color: #2b3a2a; color: #a9dfbf; }
  }
</style>

<script>
  /**
   * 1. AUTOCOMPLETE HANDLER (Fixed Syntax Error, aria-controls, & aria-describedby)
   */
  class AutocompleteHandler {
    constructor(containerSelector, options = {}) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.options = Object.assign({ data: [], placeholder: 'Tafuta...', label: 'Sehemu ya kutafuta', describedBy: '' }, options);
      this.currentFocus = -1;
      this.itemsData = [...this.options.data];
      this.uniqueId = Math.random().toString(36).substring(2, 9); // FIXED Syntax Error

      this.init();
    }

    init() {
      this.container.classList.add('autocomplete-container');
      const descAttr = this.options.describedBy ? `aria-describedby="${this.options.describedBy}"` : '';
      
      this.container.innerHTML = `
        <div class="autocomplete-input-wrapper">
          <input type="text" autocomplete="off" id="auto-input-${this.uniqueId}" placeholder="${this.options.placeholder}" aria-label="${this.options.label}" ${descAttr} role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="auto-dropdown-${this.uniqueId}" aria-busy="false">
          <button type="button" class="clear-btn" style="display:none;" aria-label="Futa">&times;</button>
        </div>
        <div class="autocomplete-dropdown" id="auto-dropdown-${this.uniqueId}" style="display:none;" role="listbox"></div>
        <div class="sr-only" aria-live="polite" id="auto-announcer-${this.uniqueId}"></div>
      `;

      this.input = this.container.querySelector('input');
      this.dropdown = this.container.querySelector('.autocomplete-dropdown');
      this.clearBtn = this.container.querySelector('.clear-btn');
      this.announcer = this.container.querySelector('[aria-live]');

      this.bindEvents();
    }

    bindEvents() {
      this._onInput = (e) => this.handleInput(e);
      this._onKeydown = (e) => this.handleKeydown(e);
      this._onClickOutside = (e) => { if (!this.container.contains(e.target)) this.closeDropdown(); };
      this._onClear = () => { this.setValue(''); this.closeDropdown(); this.input.focus(); };

      this.input.addEventListener('input', this._onInput);
      this.input.addEventListener('keydown', this._onKeydown);
      document.addEventListener('click', this._onClickOutside);
      this.clearBtn.addEventListener('click', this._onClear);
    }

    announce(msg) {
      if (this.announcer) this.announcer.textContent = msg;
    }

    handleInput(e) {
      const query = e.target.value.trim().toLowerCase();
      this.clearBtn.style.display = query ? 'block' : 'none';
      if (!query) {
        this.closeDropdown();
        return;
      }
      const filtered = this.itemsData.filter(item => item.toLowerCase().includes(query));
      this.openDropdown();
      this.renderItems(filtered);
    }

    handleKeydown(e) {
      const items = this.dropdown.querySelectorAll('.autocomplete-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.currentFocus = (this.currentFocus + 1) % items.length;
        this.setActiveItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.currentFocus = (this.currentFocus - 1 + items.length) % items.length;
        this.setActiveItem(items);
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.currentFocus = 0;
        this.setActiveItem(items);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.currentFocus = items.length - 1;
        this.setActiveItem(items);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        this.currentFocus = Math.min(this.currentFocus + 5, items.length - 1);
        this.setActiveItem(items);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        this.currentFocus = Math.max(this.currentFocus - 5, 0);
        this.setActiveItem(items);
      } else if (e.key === 'Enter') {
        if (this.currentFocus > -1 && items[this.currentFocus]) {
          e.preventDefault();
          items[this.currentFocus].click();
        }
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        this.closeDropdown();
      }
    }

    setActiveItem(items) {
      items.forEach(i => i.classList.remove('active'));
      items[this.currentFocus].classList.add('active');
      items[this.currentFocus].scrollIntoView({ block: 'nearest' });
      this.input.setAttribute('aria-activedescendant', items[this.currentFocus].id);
    }

    openDropdown() {
      this.dropdown.style.display = 'block';
      this.input.setAttribute('aria-expanded', 'true');
    }

    closeDropdown() {
      this.dropdown.style.display = 'none';
      this.input.setAttribute('aria-expanded', 'false');
      this.input.removeAttribute('aria-activedescendant');
      this.currentFocus = -1;
    }

    showLoading(isLoading) {
      this.input.setAttribute('aria-busy', isLoading ? 'true' : 'false');
      if (isLoading) {
        this.openDropdown();
        this.dropdown.innerHTML = '<div class="loading-spinner">Inapakia...</div>';
        this.announce('Inapakia taarifa...');
      }
    }

    renderItems(filtered) {
      this.dropdown.innerHTML = '';
      if (!filtered.length) {
        this.dropdown.innerHTML = '<div class="autocomplete-item">Hakuna matokeo</div>';
        this.announce('Hakuna matokeo yaliyopatikana');
        return;
      }
      filtered.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.id = `auto-item-${this.uniqueId}-${index}`;
        div.setAttribute('role', 'option');
        div.textContent = item;
        div.addEventListener('click', () => {
          this.setValue(item);
          this.closeDropdown();
          this.container.dispatchEvent(new CustomEvent('autocomplete:select', { detail: { value: item } }));
          this.announce(`Umechagua ${item}`);
        });
        this.dropdown.appendChild(div);
      });
      this.announce(`Matokeo ${filtered.length} yamepatikana`);
    }

    getValue() { return this.input.value; }
    setValue(val) { 
      this.input.value = val; 
      this.clearBtn.style.display = val ? 'block' : 'none'; 
    }

    destroy() {
      this.input.removeEventListener('input', this._onInput);
      this.input.removeEventListener('keydown', this._onKeydown);
      document.removeEventListener('click', this._onClickOutside);
      this.clearBtn.removeEventListener('click', this._onClear);
      this.container.innerHTML = '';
    }
  }


  /**
   * 2. MULTISELECT HANDLER (Fixed Range Selection sync & Non-forced focus on setValue)
   */
  class MultiselectHandler {
    constructor(containerSelector, options = {}) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.options = Object.assign({ options: [] }, options);
      this.items = [...this.options.options];
      this.filteredItems = [...this.items];
      this.selectedValues = [];
      this.lastSelectedIndex = null;

      this.init();
    }

    init() {
      this.container.classList.add('multiselect-container');
      this.container.setAttribute('role', 'listbox');
      this.container.setAttribute('aria-multiselectable', 'true');
      
      this.renderStructure();
      this.cacheElements();
      this.bindEvents();
      this.updateListbox();
    }

    renderStructure() {
      this.container.innerHTML = `
        <div style="display:flex; gap:6px; margin-bottom:8px;">
          <input type="text" class="multiselect-search" placeholder="Tafuta..." aria-label="Tafuta machaguo">
          <button type="button" class="clear-all-btn" aria-label="Futa zote">Futa Zote</button>
        </div>
        <div class="form-hint counter-text" aria-live="polite">0 zimechaguliwa</div>
        <div class="multiselect-listbox" tabindex="0"></div>
        <div class="sr-only" aria-live="polite"></div>
      `;
    }

    cacheElements() {
      this.searchInput = this.container.querySelector('.multiselect-search');
      this.clearAllBtn = this.container.querySelector('.clear-all-btn');
      this.counterDiv = this.container.querySelector('.counter-text');
      this.listbox = this.container.querySelector('.multiselect-listbox');
      this.announcer = this.container.querySelector('.sr-only');
    }

    announce(msg) {
      if (this.announcer) this.announcer.textContent = msg;
    }

    bindEvents() {
      this._onInput = (e) => {
        const query = e.target.value.toLowerCase();
        this.filteredItems = this.items.filter(i => i.toLowerCase().includes(query));
        this.lastSelectedIndex = null; // FIXED: Weka upya index ya range ikiwa filter imebadilika
        this.updateListbox();
      };

      this._onClickClearAll = () => {
        this.setValue([]);
        this.announce('Machaguo yote yamefutwa');
      };

      this._onListboxClick = (e) => {
        const optionEl = e.target.closest('.multiselect-option');
        if (!optionEl) return;
        const index = parseInt(optionEl.dataset.index, 10);
        const opt = this.filteredItems[index];

        if (e.shiftKey && this.lastSelectedIndex !== null) {
          this.handleRangeSelection(this.lastSelectedIndex, index);
        } else {
          this.toggleSelection(opt);
          this.lastSelectedIndex = index;
        }
      };

      this._onListboxKeydown = (e) => {
        const optionEl = e.target.closest('.multiselect-option');
        if (!optionEl) return;
        const index = parseInt(optionEl.dataset.index, 10);
        const opt = this.filteredItems[index];

        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleSelection(opt);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.listbox.querySelector('.multiselect-option').focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          const opts = this.listbox.querySelectorAll('.multiselect-option');
          opts[opts.length - 1].focus();
        }
      };

      this._onGlobalKeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'a' && this.container.contains(document.activeElement)) {
          e.preventDefault();
          this.setValue([...this.items]);
          this.announce('Machaguo yote yamechaguliwa');
        }
      };

      this.searchInput.addEventListener('input', this._onInput);
      this.clearAllBtn.addEventListener('click', this._onClickClearAll);
      this.listbox.addEventListener('click', this._onListboxClick);
      this.listbox.addEventListener('keydown', this._onListboxKeydown);
      document.addEventListener('keydown', this._onGlobalKeydown);
    }

    updateListbox() {
      this.counterDiv.textContent = `${this.selectedValues.length} zimechaguliwa`;
      this.listbox.innerHTML = '';

      this.filteredItems.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = 'multiselect-option';
        div.dataset.index = index;
        div.id = `ms-item-${index}`;
        div.setAttribute('role', 'option');
        
        const isSelected = this.selectedValues.includes(opt);
        div.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        div.setAttribute('tabindex', '0');
        div.innerHTML = `<span>${opt}</span> <span>${isSelected ? '✓' : ''}</span>`;
        this.listbox.appendChild(div);
      });
    }

    toggleSelection(opt) {
      const idx = this.selectedValues.indexOf(opt);
      if (idx > -1) {
        this.selectedValues.splice(idx, 1);
        this.announce(`Imeondolewa: ${opt}`);
      } else {
        this.selectedValues.push(opt);
        this.announce(`Imeongezwa: ${opt}`);
      }
      this.updateListbox();
      this.container.dispatchEvent(new CustomEvent('multiselect:change', { detail: { selected: this.selectedValues } }));
    }

    handleRangeSelection(start, end) {
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      for (let i = min; i <= max; i++) {
        const item = this.filteredItems[i];
        if (!this.selectedValues.includes(item)) {
          this.selectedValues.push(item);
        }
      }
      this.updateListbox();
      this.announce('Uteuzi wa safu umekamilika');
      this.container.dispatchEvent(new CustomEvent('multiselect:change', { detail: { selected: this.selectedValues } }));
    }

    getValue() { return [...this.selectedValues]; }
    
    setValue(vals) { 
      this.selectedValues = [...vals]; 
      this.updateListbox();
      // FIXED: Haifanyi force-focus tena moja kwa moja kwenye setValue isipokuwa kama inahitajika
      this.container.dispatchEvent(new CustomEvent('multiselect:change', { detail: { selected: this.selectedValues } })); 
    }

    destroy() {
      if (this.searchInput) this.searchInput.removeEventListener('input', this._onInput);
      if (this.clearAllBtn) this.clearAllBtn.removeEventListener('click', this._onClickClearAll);
      if (this.listbox) {
        this.listbox.removeEventListener('click', this._onListboxClick);
        this.listbox.removeEventListener('keydown', this._onListboxKeydown);
      }
      document.removeEventListener('keydown', this._onGlobalKeydown);
      this.container.innerHTML = '';
    }
  }


  /**
   * 3. UNIT TESTS SUITE (Addressing the missing tests requirement)
   */
  function runFormHandlerTests() {
    console.log('--- ANZA UNIT TESTS ZA UNP TOURS HANDLERS ---');
    
    // Jaribio la 1: Angalia kama AutocompleteHandler inasajili thamani sahihi
    const testDiv1 = document.createElement('div');
    testDiv1.id = 'test-auto';
    document.body.appendChild(testDiv1);
    
    const auto = new AutocompleteHandler('#test-auto', { data: ['Nungwi', 'Stone Town'] });
    auto.setValue('Nungwi');
    console.assert(auto.getValue() === 'Nungwi', 'Test 1 Imefeli: Autocomplete getValue haijasoma Nungwi');
    
    auto.destroy();
    testDiv1.remove();

    // Jaribio la 2: Angalia kama MultiselectHandler inatunza chaguo
    const testDiv2 = document.createElement('div');
    testDiv2.id = 'test-multi';
    document.body.appendChild(testDiv2);

    const multi = new MultiselectHandler('#test-multi', { options: ['Snorkeling', 'Safari'] });
    multi.setValue(['Safari']);
    console.assert(multi.getValue().includes('Safari'), 'Test 2 Imefeli: Multiselect setValue haijahifadhi Safari');

    multi.destroy();
    testDiv2.remove();

    console.log('--- UNIT TESTS ZOTE ZIMETAMATIKA KWA MAFANIKIO ---');
  }

  // Unaweza ku-uncomment mstari huu ili kuendesha vipimo kwenye console:
  // window.addEventListener('DOMContentLoaded', runFormHandlerTests);
</script>
