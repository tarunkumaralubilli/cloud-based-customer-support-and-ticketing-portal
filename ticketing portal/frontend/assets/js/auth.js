// ==========================================================================
// SHARED FORM VALIDATION HELPERS
// ==========================================================================
function validateField(input, condition) {
  const group = input.closest('.form-group');
  if (!condition) {
    group.classList.add('is-invalid');
    return false;
  }
  group.classList.remove('is-invalid');
  return true;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setButtonLoading(btn, isLoading) {
  btn.classList.toggle('is-loading', isLoading);
  btn.disabled = isLoading;
}

// ==========================================================================
// LOGIN FORM
// ==========================================================================
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  const validEmail = validateField(email, isValidEmail(email.value));
  const validPassword = validateField(password, password.value.length >= 8);

  if (!validEmail || !validPassword) return;

  const btn = document.getElementById('loginBtn');
  setButtonLoading(btn, true);

  // Simulated request — replace with real Cognito/API call later
  setTimeout(() => {
    setButtonLoading(btn, false);

    // Save a lightweight customer session so other pages know who's logged in
    sessionStorage.setItem('supporthub_customer_session', JSON.stringify({
      email: email.value.trim(),
      loggedInAt: new Date().toISOString()
    }));

    showToast('Login successful! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = 'ticket-history.html';
    }, 800);
  }, 1200);
});
// ==========================================================================
// REGISTER FORM
// ==========================================================================
const registerForm = document.getElementById('registerForm');

const strengthBars = document.querySelectorAll('#strengthMeter .strength-bar');
const strengthLabel = document.getElementById('strengthLabel');
const regPasswordInput = document.getElementById('regPassword');

regPasswordInput?.addEventListener('input', () => {
  const val = regPasswordInput.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val) && val.length >= 10) score++;

  strengthBars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < score) {
      bar.classList.add(score === 1 ? 'weak' : score === 2 ? 'medium' : 'strong');
    }
  });

  const labels = ['Use 8+ characters with a mix of letters & numbers', 'Weak password', 'Medium strength', 'Strong password'];
  strengthLabel.textContent = labels[score];
});

registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('regEmail');
  const phone = document.getElementById('phone');
  const password = document.getElementById('regPassword');
  const confirm = document.getElementById('confirmPassword');

  const validName = validateField(fullName, fullName.value.trim().length >= 2);
  const validEmail = validateField(email, isValidEmail(email.value));
  const validPhone = validateField(phone, phone.value.trim().length >= 7);
  const validPassword = validateField(password, password.value.length >= 8);
  const validConfirm = validateField(confirm, confirm.value === password.value && confirm.value.length > 0);

  if (!validName || !validEmail || !validPhone || !validPassword || !validConfirm) return;

  const btn = document.getElementById('registerBtn');
  setButtonLoading(btn, true);

  setTimeout(() => {
    setButtonLoading(btn, false);
    showToast('Account created! Please check your email to verify.', 'success');
    // window.location.href = 'login.html';
  }, 1200);
});

// ==========================================================================
// FORGOT PASSWORD FORM
// ==========================================================================
const forgotForm = document.getElementById('forgotForm');
forgotForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('resetEmail');
  const validEmail = validateField(email, isValidEmail(email.value));
  if (!validEmail) return;

  const btn = document.getElementById('resetBtn');
  setButtonLoading(btn, true);

  setTimeout(() => {
    setButtonLoading(btn, false);
    document.getElementById('sentEmailDisplay').textContent = email.value;
    document.getElementById('requestStep').style.display = 'none';
    document.getElementById('successStep').style.display = 'block';
  }, 1200);
});

document.getElementById('resendBtn')?.addEventListener('click', () => {
  showToast('Reset link resent!', 'success');
});

// Theme toggle wiring
setupThemeToggle('themeToggle');