// ==========================================================================
// TICKET STORE — data layer for tickets
// getAllTickets / getTicketById / updateTicket / deleteTicket / getTicketsByEmail
// still use localStorage (their Lambda functions aren't built yet).
// submitTicketToAPI is the new real backend call, live via API Gateway + Lambda.
// ==========================================================================

// --- Your live API Gateway base URL ---
const API_BASE_URL = 'https://2yvi0akyd6.execute-api.us-east-1.amazonaws.com/prod';

const TICKET_STORAGE_KEY = 'supporthub_tickets';

function getAllTickets() {
  const raw = localStorage.getItem(TICKET_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTicket(ticket) {
  const tickets = getAllTickets();
  tickets.unshift(ticket); // newest first
  localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
  return ticket;
}

function getTicketById(ticketId) {
  return getAllTickets().find(t => t.ticketId.toLowerCase() === ticketId.toLowerCase());
}

function updateTicket(ticketId, updates) {
  const tickets = getAllTickets();
  const index = tickets.findIndex(t => t.ticketId === ticketId);
  if (index === -1) return null;
  tickets[index] = { ...tickets[index], ...updates, updatedDate: new Date().toISOString() };
  localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
  return tickets[index];
}

function deleteTicket(ticketId) {
  const tickets = getAllTickets().filter(t => t.ticketId !== ticketId);
  localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
}

function generateTicketId() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${year}-${random}`;
}

function getTicketsByEmail(email) {
  return getAllTickets().filter(t => t.email.toLowerCase() === email.toLowerCase());
}

// ==========================================================================
// REAL API CALL — used by submit-ticket.js, writes directly to DynamoDB
// via API Gateway + Lambda (SupportHub-SubmitTicket)
// ==========================================================================
async function submitTicketToAPI(ticketData) {
  const response = await fetch(`${API_BASE_URL}/submit-ticket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.details ? data.details.join(' ') : (data.error || 'Something went wrong.');
    throw new Error(errorMessage);
  }

  return data.ticket; // the created ticket, including its generated ticketId
}
// ==========================================================================
// REAL API CALL — fetch a single ticket by ID (used by track-ticket.js)
// ==========================================================================
async function getTicketByIdFromAPI(ticketId) {
  const response = await fetch(`${API_BASE_URL}/ticket/${encodeURIComponent(ticketId)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ticket not found.');
  }

  return data.ticket;
}
// ==========================================================================
// REAL API CALL — fetch all tickets, optionally filtered by status
// Used by admin dashboard.js and tickets-admin.js
// ==========================================================================
async function getAllTicketsFromAPI(statusFilter = null) {
  let url = `${API_BASE_URL}/tickets`;
  if (statusFilter && statusFilter !== 'all') {
    url += `?status=${encodeURIComponent(statusFilter)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to load tickets.');
  }

  return data.tickets; // array of ticket objects
}
// ==========================================================================
// REAL API CALLS — update and delete a ticket (used by tickets-admin.js)
// ==========================================================================
async function updateTicketViaAPI(ticketId, updates) {
  const response = await fetch(`${API_BASE_URL}/ticket/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId, ...updates })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update ticket.');
  }

  return data.ticket;
}

async function deleteTicketViaAPI(ticketId) {
  const response = await fetch(`${API_BASE_URL}/ticket?ticketId=${encodeURIComponent(ticketId)}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete ticket.');
  }

  return data;
}