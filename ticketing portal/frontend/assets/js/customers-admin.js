// ==========================================================================
// ADMIN CUSTOMERS PAGE — derives a unique customer list from ticket data
// ==========================================================================

let allCustomers = [];

async function loadCustomers() {
  let tickets = [];
  try {
    tickets = await getAllTicketsFromAPI();
  } catch (error) {
    showToast('Failed to load customer data: ' + error.message, 'error');
    return;
  }

  const map = {};
  tickets.forEach(t => {
    const key = t.email.toLowerCase();
    if (!map[key]) {
      map[key] = {
        name: t.customerName,
        email: t.email,
        phone: t.phone,
        total: 0,
        open: 0,
        lastSubmitted: t.createdDate
      };
    }
    map[key].total++;
    if (t.status === 'Open') map[key].open++;
    if (new Date(t.createdDate) > new Date(map[key].lastSubmitted)) {
      map[key].lastSubmitted = t.createdDate;
    }
  });

  allCustomers = Object.values(map).sort((a, b) => b.total - a.total);
  renderCustomers(allCustomers);
}

function renderCustomers(list) {
  const tbody = document.getElementById('customersTableBody');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:var(--space-7); color:var(--text-muted);">No customers yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c => `
    <tr>
      <td class="cell-subject">${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.total}</td>
      <td>${c.open}</td>
      <td>${new Date(c.lastSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
    </tr>
  `).join('');
}

document.getElementById('customerSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = allCustomers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  renderCustomers(filtered);
});

loadCustomers();
setupThemeToggle('themeToggle');