// ==========================================================================
// ADMIN ANALYTICS PAGE
// ==========================================================================

function getChartTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
}
Chart.defaults.font.family = "'Inter', sans-serif";

async function loadAnalytics() {
  let tickets = [];
  try {
    tickets = await getAllTicketsFromAPI();
  } catch (error) {
    showToast('Failed to load analytics: ' + error.message, 'error');
    return;
  }

  const resolved = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const resolutionRate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0;
  document.getElementById('statResolutionRate').textContent = resolutionRate + '%';

  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress');
  const avgAge = openTickets.length
    ? Math.round(openTickets.reduce((sum, t) => sum + (Date.now() - new Date(t.createdDate)) / 86400000, 0) / openTickets.length)
    : 0;
  document.getElementById('statAvgAge').textContent = avgAge;

  document.getElementById('statHighPriority').textContent =
    tickets.filter(t => t.priority === 'High' && (t.status === 'Open' || t.status === 'In Progress')).length;

  // Chart: tickets by assigned staff
  const staffNames = ['Aditi Rao', 'James Kim', 'Priya Sharma', 'Carlos Diaz', 'Unassigned'];
  const staffCounts = staffNames.map(name =>
    name === 'Unassigned'
      ? tickets.filter(t => !t.assignedTo).length
      : tickets.filter(t => t.assignedTo === name).length
  );

  new Chart(document.getElementById('staffChart'), {
    type: 'bar',
    data: {
      labels: staffNames,
      datasets: [{ data: staffCounts, backgroundColor: '#2563EB', borderRadius: 8, maxBarThickness: 40 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { color: getChartTextColor(), precision: 0 } },
        y: { ticks: { color: getChartTextColor() } }
      }
    }
  });

  // Chart: status distribution
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const statusCounts = statuses.map(s => tickets.filter(t => t.status === s).length);

  new Chart(document.getElementById('statusChart'), {
    type: 'pie',
    data: {
      labels: statuses,
      datasets: [{ data: statusCounts, backgroundColor: ['#06B6D4', '#F59E0B', '#22C55E', '#94A3B8'] }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: getChartTextColor() } } }
    }
  });
}

loadAnalytics();
setupThemeToggle('themeToggle');