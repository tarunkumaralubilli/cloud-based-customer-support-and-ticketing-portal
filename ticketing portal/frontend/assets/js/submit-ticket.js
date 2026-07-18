// ==========================================================================
// SUBMIT TICKET PAGE LOGIC
// ==========================================================================

let selectedCategory = null;
let selectedPriority = null;
let uploadedFile = null;

// --- Category selection ---
document.querySelectorAll('#categoryGrid .select-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#categoryGrid .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedCategory = card.dataset.value;
    document.getElementById('categoryError').style.display = 'none';
  });
});

// --- Priority selection ---
document.querySelectorAll('#priorityGrid .select-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#priorityGrid .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedPriority = card.dataset.value;
    document.getElementById('priorityError').style.display = 'none';
  });
});

// --- Character counter ---
const description = document.getElementById('description');
const charCount = document.getElementById('charCount');
description.addEventListener('input', () => {
  charCount.textContent = description.value.length;
});

// --- File upload (click + drag-drop) ---
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const filePreviewList = document.getElementById('filePreviewList');

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

  if (!allowedTypes.includes(file.type)) {
    showToast('Only PNG, JPG, and PDF files are allowed.', 'error');
    return;
  }
  if (file.size > maxSize) {
    showToast('File must be smaller than 5MB.', 'error');
    return;
  }

  uploadedFile = file;
  filePreviewList.innerHTML = `
    <div class="file-preview-item">
      <i class="fa-solid fa-file"></i>
      <span class="file-name">${file.name}</span>
      <span class="text-muted" style="font-size:var(--fs-xs)">${(file.size / 1024).toFixed(0)} KB</span>
      <button type="button" class="remove-file" id="removeFileBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `;
  document.getElementById('removeFileBtn').addEventListener('click', () => {
    uploadedFile = null;
    fileInput.value = '';
    filePreviewList.innerHTML = '';
  });
}

// --- Form validation helper (reused pattern from auth.js) ---
function validateField(input, condition) {
  const group = input.closest('.form-group');
  if (!condition) { group.classList.add('is-invalid'); return false; }
  group.classList.remove('is-invalid');
  return true;
}
function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

// --- Form submission ---
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('custName');
  const email = document.getElementById('custEmail');
  const phone = document.getElementById('custPhone');
  const subject = document.getElementById('subject');
  const desc = document.getElementById('description');

  const validName = validateField(name, name.value.trim().length >= 2);
  const validEmail = validateField(email, isValidEmail(email.value));
  const validPhone = validateField(phone, phone.value.trim().length >= 7);
  const validSubject = validateField(subject, subject.value.trim().length >= 3);
  const validDesc = validateField(desc, desc.value.trim().length >= 20);

  let validCategory = true, validPriority = true;
  if (!selectedCategory) {
    document.getElementById('categoryError').style.display = 'block';
    validCategory = false;
  }
  if (!selectedPriority) {
    document.getElementById('priorityError').style.display = 'block';
    validPriority = false;
  }

  if (!validName || !validEmail || !validPhone || !validSubject || !validDesc || !validCategory || !validPriority) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.classList.add('is-loading');
  btn.disabled = true;

  const ticketData = {
    customerName: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    category: selectedCategory,
    priority: selectedPriority,
    subject: subject.value.trim(),
    description: desc.value.trim()
  };

  console.log('Ticket data being sent:', ticketData);

  try {
    const createdTicket = await submitTicketToAPI(ticketData);

    btn.classList.remove('is-loading');
    btn.disabled = false;

    document.getElementById('generatedTicketId').textContent = createdTicket.ticketId;
    document.getElementById('trackNowBtn').href = `track-ticket.html?id=${createdTicket.ticketId}`;
    document.getElementById('successModal').classList.add('show');

  } catch (error) {
    btn.classList.remove('is-loading');
    btn.disabled = false;
    showToast(error.message || 'Failed to submit ticket. Please try again.', 'error');
  }
});

// Theme toggle
setupThemeToggle('themeToggle');