// ========================================
// APEX ROOFING — Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Consultation form handling
  const form = document.getElementById('consult-form');
  const note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const zip = form.zip.value.trim();

      const phonePattern = /^[\d\s()+-]{7,}$/;
      const zipPattern = /^\d{4,6}$/;

      if (!name || !phone || !zip) {
        showNote('Please fill in every field.', 'error');
        return;
      }
      if (!phonePattern.test(phone)) {
        showNote('Please enter a valid phone number.', 'error');
        return;
      }
      if (!zipPattern.test(zip)) {
        showNote('Please enter a valid zip code.', 'error');
        return;
      }

      // Simulate submission (replace with real endpoint as needed)
      showNote(`Thanks, ${name.split(' ')[0]}! We'll call you shortly.`, 'success');
      form.reset();
    });
  }

  function showNote(message, type) {
    note.textContent = message;
    note.className = 'form-note ' + type;
  }
const downloadBtn = document.getElementById('download-guide');
if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Your project guide will be emailed to you shortly. (Hook this up to your real download/lead-capture flow.)');
  });
}
  // Smooth-scroll nav links (native CSS already handles this, JS adds slight offset correction)
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});