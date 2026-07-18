// ==========================================================================
// ADMIN DASHBOARD LOGIC — stats + charts computed from LIVE API data
// ==========================================================================

// --- Today's date badge (doesn't depend on ticket data, can run immediately) ---
document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});

// --- Chart.js theme-aware colors ---
function getChartTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
}
function getGridColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
}

Chart.defaults.font.family = "'Inter', sans-serif";

function categoryIcon(category) {
  return {
    'Technical': 'fa-laptop-code', 'Billing': 'fa-file-invoice-dollar',
    'Account': 'fa-user-gear', 'Feature Request': 'fa-lightbulb', 'Other': 'fa-ellipsis'
  }[category] || 'fa-ticket';
}
function badgeClassForStatus(status) {
  return { 'Open': 'badge-open', 'In Progress': 'badge-progress', 'Resolved': 'badge-resolved', 'Closed': 'badge-closed' }[status] || 'badge-open';
}

function getMonthlyBuckets(ticketArr) {
  const buckets = {};
  const now = new Date();
  const labels = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    buckets[key] = 0;
    labels.push(d.toLocaleDateString('en-US', { month: 'short' }));
  }

  ticketArr.forEach(t => {
    const d = new Date(t.createdDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in buckets) buckets[key]++;
  });

  return { labels, data: Object.values(buckets) };
}

// --- Renders all dashboard UI from a tickets array ---
function renderDashboard(tickets) {
  // Stat cards
  document.getElementById('statTotal').textContent = tickets.length;
  document.getElementById('statOpen').textContent = tickets.filter(t => t.status === 'Open').length;
  document.getElementById('statProgress').textContent = tickets.filter(t => t.status === 'In Progress').length;
  document.getElementById('statResolved').textContent = tickets.filter(t => t.status === 'Resolved').length;
  document.getElementById('statClosed').textContent = tickets.filter(t => t.status === 'Closed').length;

  // Chart 1: Tickets by Category (Doughnut)
  const categories = ['Technical', 'Billing', 'Account', 'Feature Request', 'Other'];
  const categoryCounts = categories.map(c => tickets.filter(t => t.category === c).length);

  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: categoryCounts,
        backgroundColor: ['#2563EB', '#06B6D4', '#F59E0B', '#22C55E', '#94A3B8'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { color: getChartTextColor(), padding: 16, font: { size: 12 } } }
      }
    }
  });

  // Chart 2: Tickets by Priority (Bar)
  const priorities = ['Low', 'Medium', 'High'];
  const priorityCounts = priorities.map(p => tickets.filter(t => t.priority === p).length);

  new Chart(document.getElementById('priorityChart'), {
    type: 'bar',
    data: {
      labels: priorities,
      datasets: [{
        label: 'Tickets',
        data: priorityCounts,
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderRadius: 8,
        maxBarThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: getChartTextColor() } },
        y: { beginAtZero: true, grid: { color: getGridColor() }, ticks: { color: getChartTextColor(), precision: 0 } }
      }
    }
  });

  // Chart 3: Monthly Ticket Volume (Line)
  const monthly = getMonthlyBuckets(tickets);

  new Chart(document.getElementById('monthlyChart'), {
    type: 'line',
    data: {
      labels: monthly.labels,
      datasets: [{
        label: 'Tickets Created',
        data: monthly.data,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563EB',
        pointRadius: 4,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: getChartTextColor() } },
        y: { beginAtZero: true, grid: { color: getGridColor() }, ticks: { color: getChartTextColor(), precision: 0 } }
      }
    }
  });

  // Recent Tickets list (latest 5)
  const recentList = document.getElementById('recentTicketsList');
  const recent = [...tickets].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 5);

  if (recent.length === 0) {
    recentList.innerHTML = `<div class="no-tickets-msg">No tickets yet.</div>`;
  } else {
    recentList.innerHTML = recent.map(t => `
      <div class="recent-ticket-row">
        <div class="recent-ticket-info">
          <div class="r-icon"><i class="fa-solid ${categoryIcon(t.category)}"></i></div>
          <div>
            <div class="r-subject">${t.subject}</div>
            <div class="r-meta">${t.ticketId} • ${t.customerName}</div>
          </div>
        </div>
        <span class="badge ${badgeClassForStatus(t.status)}">${t.status}</span>
      </div>
    `).join('');
  }
}

// --- Load real tickets from the live API, then render everything ---
async function initDashboard() {
  let tickets = [];

  try {
    tickets = await getAllTicketsFromAPI();
  } catch (error) {
    showToast('Failed to load dashboard data: ' + error.message, 'error');
    return;
  }

  renderDashboard(tickets);
}

initDashboard();
setupThemeToggle('themeToggle');