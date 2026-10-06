/**
 * ==========================================
 * UNP TOURS - MAIN.JS (Ziada na Kamili)
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. NEWSLETTER FORM HANDLING
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector("input[type='email']");
      const msgEl = newsletterForm.querySelector(".newsletter-msg") || createMsgEl(newsletterForm);
      
      const emailVal = emailInput ? emailInput.value.trim() : "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailVal)) {
        msgEl.textContent = "Please enter a valid email address.";
        msgEl.style.color = "#c62828";
        return;
      }

      // Mafanikio
      msgEl.textContent = "Thank you for subscribing to UNP Tours!";
      msgEl.style.color = "var(--gold-color, #d4af37)";
      newsletterForm.reset();
      if (typeof showToast === "function") {
        showToast("Success", "Subscribed successfully to newsletter!", "success");
      }
    });
  }

  function createMsgEl(parent) {
    const p = document.createElement("p");
    p.className = "newsletter-msg";
    parent.appendChild(p);
    return p;
  }

  // 2. BACK TO TOP BUTTON & PROGRESS CIRCLE
  const backToTopBtn = document.querySelector(".back-to-top, #backToTop") || createBackToTop();
  
  function createBackToTop() {
    const btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.innerHTML = `▲ <svg class="progress-circle" width="36" height="36"><circle cx="18" cy="18" r="16" pathLength="100"></circle></svg>`;
    btn.style.cssText = "position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:var(--primary-color,#0d1b2a);color:var(--gold-color,#d4af37);border:2px solid var(--gold-color,#d4af37);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:999;opacity:0;visibility:hidden;transition:0.3s;";
    document.body.appendChild(btn);
    return btn;
  }

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollTop > 300) {
      backToTopBtn.style.opacity = "1";
      backToTopBtn.style.visibility = "visible";
    } else {
      backToTopBtn.style.opacity = "0";
      backToTopBtn.style.visibility = "hidden";
    }

    const circle = backToTopBtn.querySelector("circle");
    if (circle) {
      circle.style.strokeDashoffset = 100 - scrollPercent;
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 3. TOAST NOTIFICATIONS SYSTEM
  window.showToast = function(title, message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container top-right";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => removeToast(toast));

    setTimeout(() => {
      removeToast(toast);
    }, 4000);
  };

  function removeToast(toast) {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 300);
  }

  // 4. AGE VERIFICATION MODAL
  const ageModal = document.querySelector(".age-verification-modal");
  if (ageModal && !localStorage.getItem("unp_age_verified")) {
    ageModal.classList.add("open");
    document.body.classList.add("no-scroll");

    const verifyBtn = ageModal.querySelector(".verify-yes, #verifyYes");
    if (verifyBtn) {
      verifyBtn.addEventListener("click", () => {
        localStorage.setItem("unp_age_verified", "true");
        ageModal.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    }
  }

  // 5. CHAT WIDGET (Tawk.to / Custom Toggle)
  const chatToggle = document.querySelector(".chat-toggle, .chat-widget-btn");
  const chatBox = document.querySelector(".chat-box, .chat-window");
  if (chatToggle && chatBox) {
    chatToggle.addEventListener("click", () => {
      chatBox.classList.toggle("open");
    });
  }

  // 6. WHATSAPP FLOAT BUTTON
  const whatsappFloat = document.querySelector(".whatsapp-float, .wa-float") || createWaFloat();
  function createWaFloat() {
    const a = document.createElement("a");
    a.className = "whatsapp-float";
    a.href = "https://wa.me/255700000000?text=Hello%20UNP%20Tours,%20I%20need%20assistance.";
    a.target = "_blank";
    a.innerHTML = "💬";
    a.style.cssText = "position:fixed;bottom:80px;right:24px;width:50px;height:50px;background:#25d366;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:998;text-decoration:none;transition:0.3s;";
    document.body.appendChild(a);
    return a;
  }

  // 7. LAZYLOAD IMAGES (IntersectionObserver)
  const lazyImages = document.querySelectorAll("img.lazy, img[data-src]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          obs.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }

  // 8. FORM REAL-TIME VALIDATION
  const inputs = document.querySelectorAll("input[required], textarea[required]");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        input.style.borderColor = "#2e7d32";
      } else {
        input.style.borderColor = "#c62828";
      }
    });
  });

  // 9. CURRENCY SWITCHER
  const currencySelector = document.querySelectorAll(".currency-switcher");
  const savedCurrency = localStorage.getItem("unp_selected_currency") || "USD";
  currencySelector.forEach(sel => {
    sel.value = savedCurrency;
    sel.addEventListener("change", (e) => {
      localStorage.setItem("unp_selected_currency", e.target.value);
      window.location.reload();
    });
  });

  // 10. SEARCH FUNCTIONALITY
  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results");
  if (searchInput && searchResults) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      // Logic ya kuchuja maudhui (tours/excursions)
      if (query.length > 2) {
        searchResults.style.display = "block";
      } else {
        searchResults.style.display = "none";
      }
    });
  }
});