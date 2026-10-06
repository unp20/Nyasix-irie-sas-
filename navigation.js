/**
 * ==========================================
 * UNP TOURS - NAVIGATION.JS (Ziada na Kamili)
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. SELECTORS & ELEMENTS
  const hamburger = document.querySelector(".hamburger-menu, .nav-toggle, .mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav, .nav-menu, .nav-links");
  const overlay = document.querySelector(".mobile-nav-overlay, .nav-overlay") || createOverlay();
  const searchBtn = document.querySelector(".search-btn, .search-trigger");
  const searchOverlay = document.querySelector(".search-overlay, .search-modal");
  const searchClose = document.querySelector(".search-close, .search-modal-close");
  const langSelector = document.querySelectorAll(".language-switcher, .lang-select");

  // Helper kuunda overlay ya simu kama haipo kwenye HTML
  function createOverlay() {
    const div = document.createElement("div");
    div.className = "mobile-nav-overlay";
    div.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:998;opacity:0;visibility:hidden;transition:0.3s;";
    document.body.appendChild(div);
    return div;
  }

  // 2. LANGUAGE SWITCHER & LOCALSTORAGE
  const savedLang = localStorage.getItem("unp_selected_lang") || "en";
  document.documentElement.setAttribute("lang", savedLang);

  langSelector.forEach(selector => {
    // Weka thamani ya sasa kwenye dropdown au element
    if (selector.value !== undefined) selector.value = savedLang;

    selector.addEventListener("change", (e) => {
      const newLang = e.target.value;
      localStorage.setItem("unp_selected_lang", newLang);
      document.documentElement.setAttribute("lang", newLang);
      // Hapa unaweza kuongeza mantiki ya kupakia upya au kutafsiri maandishi
      window.location.reload();
    });
  });

  // 3. HAMBURGER MENU & MOBILE NAV DRAWER TOGGLE
  function toggleMobileMenu() {
    const isOpen = hamburger?.classList.toggle("active");
    mobileNav?.classList.toggle("open", isOpen);
    
    if (overlay) {
      overlay.style.opacity = isOpen ? "1" : "0";
      overlay.style.visibility = isOpen ? "visible" : "hidden";
    }

    // 7. SCROLL LOCK
    document.body.classList.toggle("no-scroll", isOpen);
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      mobileNav?.classList.remove("open");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      document.body.classList.remove("no-scroll");
      if (searchOverlay) searchOverlay.classList.remove("open");
    });
  }

  // 4. SEARCH BUTTON & OVERLAY LOGIC
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("open");
      document.body.classList.add("no-scroll");
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener("click", () => {
      searchOverlay.classList.remove("open");
      document.body.classList.remove("no-scroll");
    });
  }

  // 5. KEYBOARD SUPPORT (ESC Key kufunga kila kitu)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hamburger?.classList.remove("active");
      mobileNav?.classList.remove("open");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
      }
      searchOverlay?.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }
  });

  // 6. RESIZE HANDLER (Kufunga menu moja kwa moja ukirudi kwenye Desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      hamburger?.classList.remove("active");
      mobileNav?.classList.remove("open");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
      }
      document.body.classList.remove("no-scroll");
    }
  });
});