// FAQ accordion toggle
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const answer = item.nextElementSibling;
    const isOpen = item.classList.contains('open');

    // close all others
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

// Newsletter form submit
document.querySelector('.newsletter-form button').addEventListener('click', () => {
  const input = document.querySelector('.newsletter-form input');
  if(input.value.trim() !== ''){
    input.value = '';
    input.placeholder = 'Thanks for joining!';
  }
});