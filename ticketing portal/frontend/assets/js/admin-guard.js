// ==========================================================================
// ADMIN SESSION GUARD — include this on every protected admin page
// Redirects to login if no session exists (placeholder for real JWT/Cognito check)
// ==========================================================================
function requireAdminSession() {
  const session = sessionStorage.getItem('supporthub_admin_session');
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return JSON.parse(session);
}

function adminLogout() {
  sessionStorage.removeItem('supporthub_admin_session');
  window.location.href = 'login.html';
}