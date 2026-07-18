// ==========================================================================
// ADMIN LOGIN LOGIC — simulated, replace with Cognito auth later
// ==========================================================================

function validateField(input, condition) {
  const group = input.closest('.form-group');
  if (!condition) { group.classList.add('is-invalid'); return false; }
  group.classList.remove('is-invalid');
  return true;
}
function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('adminEmail');
  const password = document.getElementById('adminPassword');

  const validEmail = validateField(email, isValidEmail(email.value));
  const validPassword = validateField(password, password.value.length >= 8);
  if (!validEmail || !validPassword) return;

  const btn = document.getElementById('adminLoginBtn');
  btn.classList.add('is-loading');
  btn.disabled = true;

  // Simulated request — replace with real Cognito admin auth call later
  setTimeout(() => {
    sessionStorage.setItem('supporthub_admin_session', JSON.stringify({
      name: 'Admin User',
      email: email.value.trim(),
      loggedInAt: new Date().toISOString()
    }));
    window.location.href = 'dashboard.html';
  }, 1000);
});

setupThemeToggle('themeToggle');