document.addEventListener('DOMContentLoaded', () => {
  // 1. Loading State kwenye Submit Buttons
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('btn-loading');
        // Ikiwa unatumia Fetch API au Ajax, ondoa darasa hili ombi likikamilika
      }
    });
  });

  // 2. Caps Lock Warning kwenye Password Inputs
  const passwordInput = document.querySelector('input[type="password"]');
  if (passwordInput) {
    let warningSpan = document.createElement('span');
    warningSpan.className = 'caps-lock-warning';
    warningSpan.textContent = '⚠️ Caps Lock imewashwa!';
    warningSpan.setAttribute('role', 'alert');
    passwordInput.parentNode.appendChild(warningSpan);

    passwordInput.addEventListener('keydown', (e) => {
      const capsLockOn = e.getModifierState && e.getModifierState('CapsLock');
      if (capsLockOn) {
        warningSpan.classList.add('active');
      } else {
        warningSpan.classList.remove('active');
      }
    });

    passwordInput.addEventListener('keyup', (e) => {
      const capsLockOn = e.getModifierState && e.getModifierState('CapsLock');
      if (!capsLockOn) {
        warningSpan.classList.remove('active');
      }
    });
  }

  // 3. Real-Time Validation
  const inputs = document.querySelectorAll('.form-control[required]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setAttribute('aria-invalid', 'false');
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
      }
    });
  });
});
