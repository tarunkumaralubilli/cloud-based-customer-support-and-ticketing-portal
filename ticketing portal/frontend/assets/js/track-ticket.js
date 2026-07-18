// ==========================================================================
// TRACK TICKET PAGE LOGIC
// ==========================================================================

const emptyState = document.getElementById('emptyState');
const notFoundState = document.getElementById('notFoundState');
const ticketResult = document.getElementById('ticketResult');
const ticketIdInput = document.getElementById('ticketIdInput');

const STATUS_ORDER = ['Open', 'In Progress', 'Resolved', 'Closed'];

function badgeClassForStatus(status) {
  return {
    'Open': 'badge-open',
    'In Progress': 'badge-progress',
    'Resolved': 'badge-resolved',
    'Closed': 'badge-closed'
  }[status] || 'badge-open';
}

function badgeClassForPriority(priority) {
  return {
    'Low': 'badge-priority-low',
    'Medium': 'badge-priority-medium',
    'High': 'badge-priority-high'
  }[priority] || 'badge-priority-medium';
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function renderTicket(ticket) {
  emptyState.style.display = 'none';
  notFoundState.style.display = 'none';
  ticketResult.classList.add('show');

  document.getElementById('resultTicketId').textContent = ticket.ticketId;
  document.getElementById('resultSubject').textContent = ticket.subject;

  const statusBadge = document.getElementById('resultStatusBadge');
  statusBadge.textContent = ticket.status;
  statusBadge.className = `badge ${badgeClassForStatus(ticket.status)}`;

  const priorityBadge = document.getElementById('resultPriorityBadge');
  priorityBadge.textContent = ticket.priority;
  priorityBadge.className = `badge ${badgeClassForPriority(ticket.priority)}`;

  document.getElementById('metaCustomer').textContent = ticket.customerName;
  document.getElementById('metaCategory').textContent = ticket.category;
  document.getElementById('metaCreated').textContent = formatDate(ticket.createdDate);
  document.getElementById('metaUpdated').textContent = formatDate(ticket.updatedDate);
  document.getElementById('metaDescription').textContent = ticket.description;

  // Timeline
  const currentIndex = STATUS_ORDER.indexOf(ticket.status);
  const timelineHTML = STATUS_ORDER.map((step, i) => {
    const completed = i <= currentIndex;
    return `
      <div class="timeline-item ${completed ? 'completed' : ''}">
        <div class="timeline-title">${step}</div>
        <div class="timeline-time">${i === 0 ? formatDate(ticket.createdDate) : (completed ? formatDate(ticket.updatedDate) : 'Pending')}</div>
      </div>
    `;
  }).join('');
  document.getElementById('statusTimeline').innerHTML = timelineHTML;

  // Comments
  const commentsList = document.getElementById('commentsList');
  if (!ticket.comments || ticket.comments.length === 0) {
    commentsList.innerHTML = `<div class="no-comments">No comments yet. Our team will respond here once your ticket is reviewed.</div>`;
  } else {
    commentsList.innerHTML = ticket.comments.map(c => `
      <div class="comment-item">
        <div class="comment-avatar ${c.role === 'admin' ? 'admin' : ''}">${c.author.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">${c.author} ${c.role === 'admin' ? '<span class="badge badge-open" style="margin-left:6px;">Staff</span>' : ''}</span>
            <span class="comment-time">${formatDate(c.timestamp)}</span>
          </div>
          <p class="comment-text">${c.text}</p>
        </div>
      </div>
    `).join('');
  }
}

async function performSearch() {
  const id = ticketIdInput.value.trim();
  if (!id) {
    showToast('Please enter a Ticket ID.', 'error');
    return;
  }

  const searchBtn = document.getElementById('searchBtn');
  searchBtn.classList.add('is-loading');
  searchBtn.disabled = true;

  try {
    const ticket = await getTicketByIdFromAPI(id);
    renderTicket(ticket);
  } catch (error) {
    emptyState.style.display = 'none';
    ticketResult.classList.remove('show');
    notFoundState.style.display = 'block';
  } finally {
    searchBtn.classList.remove('is-loading');
    searchBtn.disabled = false;
  }
}

document.getElementById('searchBtn').addEventListener('click', performSearch);
ticketIdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

// Auto-search if ?id= is present in the URL (linked from submit-ticket success modal)
const urlParams = new URLSearchParams(window.location.search);
const prefilledId = urlParams.get('id');
if (prefilledId) {
  ticketIdInput.value = prefilledId;
  performSearch();
}

// Theme toggle
setupThemeToggle('themeToggle');