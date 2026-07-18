// ==========================================================================
// ADMIN SETTINGS PAGE
// ==========================================================================

const session = JSON.parse(sessionStorage.getItem('supporthub_admin_session') || '{}');

document.getElementById('settingsName').value = session.name || '';
document.getElementById('settingsEmail').value = session.email || '';
document.getElementById('loginTimeDisplay').textContent = session.loggedInAt
  ? new Date(session.loggedInAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—';

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  const newName = document.getElementById('settingsName').value.trim();
  if (!newName) { showToast('Name cannot be empty.', 'error'); return; }

  session.name = newName;
  sessionStorage.setItem('supporthub_admin_session', JSON.stringify(session));
  showToast('Settings saved. Refresh to see updated name in sidebar.', 'success');
});

document.getElementById('settingsLogoutBtn').addEventListener('click', adminLogout);

setupThemeToggle('themeToggle');