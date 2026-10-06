/* ==========================================================================
   UNP TOURS - NEWSLETTER MANAGER V3 ULTIMATE STYLES
   ========================================================================== */

.newsletter-form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
}

.newsletter-form input[type="email"] {
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white, #ffffff);
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  min-height: 44px; /* Touch target 44px */
}

.newsletter-form input[type="email"]:focus-visible {
  border-color: var(--gold-color, #d4af37);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25);
}

.newsletter-form button[type="submit"] {
  padding: 12px 20px;
  background-color: var(--gold-color, #d4af37);
  color: var(--primary-color, #0d1b2a);
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  min-height: 44px; /* Touch target 44px */
  transition: all 0.3s ease;
}

.newsletter-form button[type="submit"]:hover:not(:disabled) {
  filter: brightness(1.1);
}

/* GDPR & Privacy Checkbox styling */
.newsletter-gdpr-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.newsletter-gdpr-container input[type="checkbox"] {
  margin-top: 3px;
  min-width: 18px;
  min-height: 18px;
  cursor: pointer;
}

.newsletter-gdpr-container a {
  color: var(--gold-color, #d4af37);
  text-decoration: underline;
}

/* Animations: Shake, Pulse, Fade */
@keyframes unp-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@keyframes unp-pulse {
  0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
}

.newsletter-form input.unp-shake {
  animation: unp-shake 0.4s ease;
  border-color: #c62828 !important;
}

.newsletter-form input.unp-pulse {
  animation: unp-pulse 1s ease;
  border-color: var(--gold-color, #d4af37) !important;
}

.newsletter-msg {
  font-size: 0.85rem;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.newsletter-msg.fade-in {
  opacity: 1;
}
.newsletter-msg.fade-out {
  opacity: 0;
}

/* Media Queries: Dark Mode, High Contrast, Forced Colors */
@media (prefers-color-scheme: dark) {
  .newsletter-form input[type="email"] {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
    border-color: #333333 !important;
  }
  .newsletter-gdpr-container {
    color: #cbd5e1;
  }
}

@media (prefers-contrast: more) {
  .newsletter-form input[type="email"],
  .newsletter-form button[type="submit"] {
    border: 2px solid currentColor !important;
  }
}

@media (forced-colors: active) {
  .newsletter-form input[type="email"],
  .newsletter-form button[type="submit"] {
    border: 2px solid ButtonText !important;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .newsletter-form input[type="email"] {
    background-color: #ffffff !important;
    opacity: 1 !important;
  }
}
