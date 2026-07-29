// FAQ accordion toggle
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const answer = item.nextElementSibling;
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.nextElementSibling.style.maxHeight = null;
    });

    if(!isOpen){
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 20 + 'px';
    }
  });
});

// Inspection form submit
const form = document.getElementById('inspectionForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you! Your inspection request has been sent. We will contact you within 24 hours.');
  form.reset();
});