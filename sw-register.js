/**
 * @file sw-register.js
 * @description Advanced Service Worker Registration & PWA Manager for UNP Tours (v2.1.0)
 * Features: Update banner with a11y, dismiss option, periodic background checks,
 * online/offline connectivity UI, and install prompt management.
 */

const DEBUG_MODE = false;
let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // 20. Error Recovery & Registration
      const registration = await navigator.serviceWorker.register('/sw.js?v=2.1.0');
      if (DEBUG_MODE) console.log('[PWA] Service Worker imesajiliwa:', registration.scope);

      // 9, 10. Angalia updates kila baada ya dakika 60 (Periodic Update Check)
      setInterval(() => {
        registration.update().catch((err) => {
          if (DEBUG_MODE) console.warn('[PWA] Update check failed:', err);
        });
      }, 3600000);

      // Angalia kama kuna update inayongoja wakati wa kupakia
      if (registration.waiting) {
        showUpdateBanner(registration);
      }

      // 8. Sikiliza mabadiliko ya kipya kinachosakinishwa
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onchange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                if (DEBUG_MODE) console.log('[PWA] Toleo jipya lipo tayari.');
                showUpdateBanner(registration);
              }
            }
          };
        }
      };

    } catch (error) {
      console.warn('[PWA] Usajili wa Service Worker umeshindikana:', error);
    }
  });

  // 8. Controller change reload baada ya SKIP_WAITING
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
} else {
  if (DEBUG_MODE) console.warn('[PWA] Kivinjari hiki hakitumii Service Workers.');
}

/**
 * 1, 2, 3, 4, 5, 6, 7, 34, 66, 67, 68, 69.
 * Onyesha Update Banner yenye Accessibility na Dismiss Option
 */
function showUpdateBanner(registration) {
  // Zuia kuonyesha mara mbili kama tayari ipo
  if (document.getElementById('pwa-update-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-update-banner';
  banner.className = 'update-banner';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-atomic', 'true');

  banner.innerHTML = `
    <span>Toleo jipya la UNP Tours lipo tayari!</span>
    <div class="update-actions">
      <button type="button" id="pwa-reload-btn" class="btn-primary" aria-label="Sasisha app">Sasisha Sasa</button>
      <button type="button" id="pwa-dismiss-btn" class="btn-secondary" aria-label="Funga taarifa">Baadaye</button>
    </div>
  `;

  document.body.appendChild(banner);

  // 12, 13. Tuma SKIP_WAITING na ufanye reload
  document.getElementById('pwa-reload-btn').addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    banner.remove();
  });

  // 34. Funga banner (Dismiss)
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    banner.remove();
  });
}

/**
 * 14, 15, 16, 38, 39, 40.
 * Usimamizi wa Hali ya Mtandao (Online/Offline UI)
 */
window.addEventListener('online', () => {
  updateConnectivityStatus(true);
});

window.addEventListener('offline', () => {
  updateConnectivityStatus(false);
});

function updateConnectivityStatus(isOnline) {
  let indicator = document.getElementById('connectivity-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'connectivity-indicator';
    indicator.className = 'connectivity-banner';
    document.body.prepend(indicator);
  }

  if (isOnline) {
    indicator.textContent = 'Umeunganishwa tena mtandaoni!';
    indicator.className = 'connectivity-banner online';
    setTimeout(() => indicator.remove(), 4000);
  } else {
    indicator.textContent = 'Huna mtandao wa intaneti. Unatumia hali ya nje ya mtandao (Offline).';
    indicator.className = 'connectivity-banner offline';
  }
}

/**
 * 21, 22, 23, 24. PWA Install Prompt Handling
 */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Unaweza kuonyesha kitufe chako cha "Weka App" hapa kama kinahitajika
});
