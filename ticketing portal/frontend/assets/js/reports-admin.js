// ==========================================================================
// ADMIN REPORTS PAGE — client-side CSV export of all tickets
// ==========================================================================

document.getElementById('exportBtn').addEventListener('click', async () => {
  const status = document.getElementById('exportStatus');
  status.textContent = 'Preparing export...';

  let tickets = [];
  try {
    tickets = await getAllTicketsFromAPI();
  } catch (error) {
    status.textContent = 'Failed to export: ' + error.message;
    return;
  }

  const headers = ['Ticket ID', 'Customer', 'Email', 'Phone', 'Category', 'Priority', 'Status', 'Assigned To', 'Subject', 'Created', 'Updated'];
  const rows = tickets.map(t => [
    t.ticketId, t.customerName, t.email, t.phone, t.category, t.priority,
    t.status, t.assignedTo || 'Unassigned', `"${t.subject.replace(/"/g, '""')}"`,
    t.createdDate, t.updatedDate
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `supporthub-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  status.textContent = `Exported ${tickets.length} tickets successfully.`;
});

setupThemeToggle('themeToggle');