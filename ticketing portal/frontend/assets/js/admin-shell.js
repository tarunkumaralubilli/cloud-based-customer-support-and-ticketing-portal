// ==========================================================================
// ADMIN SHELL LOGIC — session guard, sidebar, profile popover, active nav
// Included on every protected admin page
// ==========================================================================

const adminSession = requireAdminSession();

if (adminSession) {
  const nameParts = adminSession.name.split(' ');
  const initials = nameParts.map(n => n[0]).join('').slice(0, 2).toUpperCase();

  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('sidebarUserName').textContent = adminSession.name;

  const popoverAvatar = document.getElementById('popoverAvatar');
  const popoverName = document.getElementById('popoverName');
  const popoverEmail = document.getElementById('popoverEmail');
  const popoverLoginTime = document.getElementById('popoverLoginTime');

  if (popoverAvatar) popoverAvatar.textContent = initials;
  if (popoverName) popoverName.textContent = adminSession.name;
  if (popoverEmail) popoverEmail.textContent = adminSession.email;
  if (popoverLoginTime) {
    popoverLoginTime.textContent = new Date(adminSession.loggedInAt).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
}

// --- Profile popover toggle ---
const sidebarUserToggle = document.getElementById('sidebarUserToggle');
const profilePopover = document.getElementById('profilePopover');

sidebarUserToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  profilePopover.classList.toggle('show');
});
document.addEventListener('click', (e) => {
  if (profilePopover && !sidebarUserToggle.contains(e.target)) {
    profilePopover.classList.remove('show');
  }
});

document.getElementById('popoverLogoutBtn')?.addEventListener('click', adminLogout);

// --- Dynamic active nav highlighting (auto-detects current page) ---
(function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.toggle('active', linkPage === currentPage);
  });
})();

// --- Mobile sidebar toggle ---
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.getElementById('adminSidebar').classList.toggle('mobile-open');
});

setupThemeToggle('themeToggle');