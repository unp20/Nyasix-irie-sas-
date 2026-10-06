/**
 * ==========================================
 * UNP TOURS - SLIDER.JS (Ziada na Kamili)
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".unp-slider");

  sliders.forEach(slider => {
    const slides = slider.querySelectorAll(".unp-slide, .unp-slider-item");
    if (slides.length === 0) return;

    // 1. TOUCH / SWIPE SUPPORT (Kuwezesha kutelezesha kwa vidole kwenye simu)
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Umbali wa chini wa swipe (50px)

    slider.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe kushoto -> Nenda mbele
          if (typeof nextSlide === "function") nextSlide();
        } else {
          // Swipe kulia -> Nenda nyuma
          if (typeof prevSlide === "function") prevSlide();
        }
      }
    }

    // 2. VISIBILITY API (Kusitisha autoplay tab ya kivinjari ikiwa imefichwa/haionekani)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (typeof stopAutoplay === "function") stopAutoplay();
      } else {
        if (typeof startAutoplay === "function") startAutoplay();
      }
    });

    // 3. LAZY LOAD SLIDE IMAGES (Kupakia picha taratibu kuokoa data)
    const lazyImages = slider.querySelectorAll("img[data-src]");
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback ya moja kwa moja kama IntersectionObserver haipo
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      });
    }
  });
});