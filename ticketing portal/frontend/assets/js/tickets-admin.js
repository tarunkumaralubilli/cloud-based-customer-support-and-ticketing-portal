// ==========================================================================
// ADMIN TICKET MANAGEMENT LOGIC — search, filter, sort, paginate, manage
// Fully live: reads and writes go directly to DynamoDB via API Gateway
// ==========================================================================

const ROWS_PER_PAGE = 8;
let currentPage = 1;
let currentTicketId = null;
let allTicketsCache = [];

function badgeClassForStatus(status) {
  return { 'Open': 'badge-open', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved', 'Closed': 'badge-closed' }[status] || 'badge-open';
}
function badgeClassForPriority(priority) {
  return { 'Low': 'badge-priority-low', 'Medium': 'badge-priority-medium', 'High': 'badge-priority-high' }[priority] || 'badge-priority-medium';
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function loadTicketsAndRender() {
  try {
    allTicketsCache = await getAllTicketsFromAPI();
  } catch (error) {
    showToast('Failed to load tickets: ' + error.message, 'error');
    allTicketsCache = [];
  }
  renderTable();
}

function getFilteredTickets() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const priority = document.getElementById('priorityFilter').value;
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortOrder').value;

  let list = allTicketsCache.filter(t => {
    const matchesQuery = !query ||
      t.ticketId.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.customerName.toLowerCase().includes(query);
    const matchesStatus = status === 'all' || t.status === status;
    const matchesPriority = priority === 'all' || t.priority === priority;
    const matchesCategory = category === 'all' || t.category === category;
    return matchesQuery && matchesStatus && matchesPriority && matchesCategory;
  });

  const priorityRank = { 'High': 3, 'Medium': 2, 'Low': 1 };
  list.sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdDate) - new Date(a.createdDate);
    if (sort === 'oldest') return new Date(a.createdDate) - new Date(b.createdDate);
    if (sort === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
    return 0;
  });

  return list;
}

function renderTable() {
  const filtered = getFilteredTickets();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ROWS_PER_PAGE);

  const tbody = document.getElementById('tableBody');

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: var(--space-7); color: var(--text-muted);">No tickets match your filters.</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map(t => `
      <tr>
        <td class="cell-ticket-id">${t.ticketId}</td>
        <td class="cell-subject" title="${t.subject}">${t.subject}</td>
        <td class="cell-customer">${t.customerName}</td>
        <td>${t.category}</td>
        <td><span class="badge ${badgeClassForPriority(t.priority)}">${t.priority}</span></td>
        <td>
          <select class="status-select" data-id="${t.ticketId}" data-action="status">
            ${['Open','In Progress','Resolved','Closed'].map(s => `<option value="${s}" ${s === t.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>
          <select class="assign-select" data-id="${t.ticketId}" data-action="assign">
            <option value="" ${!t.assignedTo ? 'selected' : ''}>Unassigned</option>
            ${['Aditi Rao','James Kim','Priya Sharma','Carlos Diaz'].map(n => `<option value="${n}" ${t.assignedTo === n ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </td>
        <td>${formatDate(t.createdDate)}</td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="View details" data-action="view" data-id="${t.ticketId}"><i class="fa-solid fa-eye"></i></button>
            <button class="row-action-btn danger" title="Delete ticket" data-action="delete" data-id="${t.ticketId}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('tableResultsInfo').textContent =
    `Showing ${pageItems.length === 0 ? 0 : start + 1}–${start + pageItems.length} of ${filtered.length} tickets`;

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  let html = `<button class="page-btn" id="prevPage" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  pagination.innerHTML = html;

  document.getElementById('prevPage')?.addEventListener('click', () => { currentPage--; renderTable(); });
  document.getElementById('nextPage')?.addEventListener('click', () => { currentPage++; renderTable(); });
  pagination.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { currentPage = parseInt(btn.dataset.page); renderTable(); });
  });
}

['searchInput', 'statusFilter', 'priorityFilter', 'categoryFilter', 'sortOrder'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => { currentPage = 1; renderTable(); });
  document.getElementById(id).addEventListener('change', () => { currentPage = 1; renderTable(); });
});

// --- Inline status/assign updates — now hitting the real API ---
document.getElementById('tableBody').addEventListener('change', async (e) => {
  const el = e.target;
  const id = el.dataset.id;

  if (el.dataset.action === 'status') {
    try {
      await updateTicketViaAPI(id, { status: el.value });
      const t = allTicketsCache.find(t => t.ticketId === id);
      if (t) t.status = el.value;
      showToast(`Ticket ${id} status updated to "${el.value}".`, 'success');
    } catch (error) {
      showToast('Failed to update status: ' + error.message, 'error');
      renderTable(); // revert the dropdown visually
    }
  }

  if (el.dataset.action === 'assign') {
    try {
      await updateTicketViaAPI(id, { assignedTo: el.value || null });
      const t = allTicketsCache.find(t => t.ticketId === id);
      if (t) t.assignedTo = el.value || null;
      showToast(`Ticket ${id} ${el.value ? 'assigned to ' + el.value : 'unassigned'}.`, 'success');
    } catch (error) {
      showToast('Failed to update assignment: ' + error.message, 'error');
      renderTable();
    }
  }
});

document.getElementById('tableBody').addEventListener('click', async (e) => {
  const btn = e.target.closest('.row-action-btn');
  if (!btn) return;
  const id = btn.dataset.id;

  if (btn.dataset.action === 'view') {
    openDrawer(id);
  }

  if (btn.dataset.action === 'delete') {
    if (confirm(`Delete ticket ${id}? This cannot be undone.`)) {
      try {
        await deleteTicketViaAPI(id);
        allTicketsCache = allTicketsCache.filter(t => t.ticketId !== id);
        showToast(`Ticket ${id} deleted.`, 'success');
        renderTable();
      } catch (error) {
        showToast('Failed to delete ticket: ' + error.message, 'error');
      }
    }
  }
});

// ==========================================================================
// DETAIL DRAWER
// ==========================================================================
const drawer = document.getElementById('ticketDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer(ticketId) {
  const ticket = allTicketsCache.find(t => t.ticketId === ticketId);
  if (!ticket) return;
  currentTicketId = ticketId;

  document.getElementById('drawerTicketId').textContent = ticket.ticketId;
  document.getElementById('drawerSubject').textContent = ticket.subject;
  document.getElementById('drawerName').textContent = ticket.customerName;
  document.getElementById('drawerEmail').textContent = ticket.email;
  document.getElementById('drawerPhone').textContent = ticket.phone;
  document.getElementById('drawerCategory').textContent = ticket.category;
  document.getElementById('drawerDescription').textContent = ticket.description;
  document.getElementById('drawerStatusSelect').value = ticket.status;
  document.getElementById('drawerAssignSelect').value = ticket.assignedTo || '';

  renderNotes(ticket);

  drawer.classList.add('show');
  drawerOverlay.classList.add('show');
}

function closeDrawer() {
  drawer.classList.remove('show');
  drawerOverlay.classList.remove('show');
  currentTicketId = null;
}

function renderNotes(ticket) {
  const notesList = document.getElementById('drawerNotesList');
  const notes = ticket.internalNotes || [];
  if (notes.length === 0) {
    notesList.innerHTML = `<p class="text-muted" style="font-size:var(--fs-sm)">No internal notes yet.</p>`;
    return;
  }
  notesList.innerHTML = notes.map(n => `
    <div class="note-item">
      <p>${n.text}</p>
      <div class="note-meta">${n.author} • ${formatDateTime(n.timestamp)}</div>
    </div>
  `).join('');
}

document.getElementById('drawerClose').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

document.getElementById('drawerStatusSelect').addEventListener('change', async (e) => {
  try {
    await updateTicketViaAPI(currentTicketId, { status: e.target.value });
    const t = allTicketsCache.find(t => t.ticketId === currentTicketId);
    if (t) t.status = e.target.value;
    showToast('Status updated.', 'success');
    renderTable();
  } catch (error) {
    showToast('Failed to update status: ' + error.message, 'error');
  }
});

document.getElementById('drawerAssignSelect').addEventListener('change', async (e) => {
  try {
    await updateTicketViaAPI(currentTicketId, { assignedTo: e.target.value || null });
    const t = allTicketsCache.find(t => t.ticketId === currentTicketId);
    if (t) t.assignedTo = e.target.value || null;
    showToast('Assignment updated.', 'success');
    renderTable();
  } catch (error) {
    showToast('Failed to update assignment: ' + error.message, 'error');
  }
});

document.getElementById('addNoteBtn').addEventListener('click', async () => {
  const textarea = document.getElementById('newNoteText');
  const text = textarea.value.trim();
  if (!text) { showToast('Note cannot be empty.', 'error'); return; }

  const ticket = allTicketsCache.find(t => t.ticketId === currentTicketId);
  const notes = [...(ticket.internalNotes || []), { text, author: 'Admin User', timestamp: new Date().toISOString() }];

  try {
    await updateTicketViaAPI(currentTicketId, { internalNotes: notes });
    ticket.internalNotes = notes;
    textarea.value = '';
    renderNotes(ticket);
    showToast('Note added.', 'success');
  } catch (error) {
    showToast('Failed to add note: ' + error.message, 'error');
  }
});

document.getElementById('deleteTicketBtn').addEventListener('click', async () => {
  if (confirm(`Delete ticket ${currentTicketId}? This cannot be undone.`)) {
    try {
      await deleteTicketViaAPI(currentTicketId);
      allTicketsCache = allTicketsCache.filter(t => t.ticketId !== currentTicketId);
      showToast('Ticket deleted.', 'success');
      closeDrawer();
      renderTable();
    } catch (error) {
      showToast('Failed to delete ticket: ' + error.message, 'error');
    }
  }
});

const urlParams = new URLSearchParams(window.location.search);
const statusFromUrl = urlParams.get('status');
if (statusFromUrl) {
  document.getElementById('statusFilter').value = statusFromUrl;
}

loadTicketsAndRender();
setupThemeToggle('themeToggle');