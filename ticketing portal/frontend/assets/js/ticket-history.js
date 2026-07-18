// ==========================================================================
// TICKET HISTORY PAGE LOGIC
// ==========================================================================

let currentEmail = '';
let allUserTickets = [];

const historyContent = document.getElementById('historyContent');
const emailLookupCard = document.getElementById('emailLookupCard');
const ticketList = document.getElementById('ticketList');
const resultsCount = document.getElementById('resultsCount');
const noResultsState = document.getElementById('noResultsState');

function badgeClassForStatus(status) {
  return {
    'Open': 'badge-open', 'In Progress': 'badge-progress',
    'Resolved': 'badge-resolved', 'Closed': 'badge-closed'
  }[status] || 'badge-open';
}
function badgeClassForPriority(priority) {
  return {
    'Low': 'badge-priority-low', 'Medium': 'badge-priority-medium', 'High': 'badge-priority-high'
  }[priority] || 'badge-priority-medium';
}
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function categoryIcon(category) {
  return {
    'Technical': 'fa-laptop-code', 'Billing': 'fa-file-invoice-dollar',
    'Account': 'fa-user-gear', 'Feature Request': 'fa-lightbulb', 'Other': 'fa-ellipsis'
  }[category] || 'fa-ticket';
}

// --- Step 1: Email lookup ---
document.getElementById('lookupBtn').addEventListener('click', () => {
  const emailInput = document.getElementById('lookupEmail');
  const email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  currentEmail = email;
  allUserTickets = getTicketsByEmail(email);

  emailLookupCard.style.display = 'none';
  historyContent.style.display = 'block';

  renderFilteredList();
});

// --- Step 2: Render list with search/filter/sort applied ---
function renderFilteredList() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const sortOrder = document.getElementById('sortOrder').value;

  let filtered = allUserTickets.filter(t => {
    const matchesQuery = !query ||
      t.subject.toLowerCase().includes(query) ||
      t.ticketId.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  filtered.sort((a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  resultsCount.textContent = `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''} found`;

  if (filtered.length === 0) {
    ticketList.innerHTML = '';
    noResultsState.style.display = 'block';
    return;
  }

  noResultsState.style.display = 'none';
  ticketList.innerHTML = filtered.map(t => `
    <div class="card card-hover ticket-row" onclick="window.location.href='track-ticket.html?id=${t.ticketId}'">
      <div class="ticket-row-main">
        <div class="ticket-row-icon"><i class="fa-solid ${categoryIcon(t.category)}"></i></div>
        <div class="ticket-row-text">
          <div class="row-subject">${t.subject}</div>
          <div class="row-meta">${t.ticketId} • ${t.category}</div>
        </div>
      </div>
      <div class="ticket-row-badges">
        <span class="badge ${badgeClassForPriority(t.priority)}">${t.priority}</span>
        <span class="badge ${badgeClassForStatus(t.status)}">${t.status}</span>
        <span class="ticket-row-date">${formatDate(t.createdDate)}</span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </div>
    </div>
  `).join('');
}

// --- Live filter/search/sort listeners ---
document.getElementById('searchInput').addEventListener('input', renderFilteredList);
document.getElementById('statusFilter').addEventListener('change', renderFilteredList);
document.getElementById('sortOrder').addEventListener('change', renderFilteredList);

// Theme toggle
setupThemeToggle('themeToggle');