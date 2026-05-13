/* Click any figure to enlarge */
(function() {
  let box;
  function open(src, cap) {
    if (!box) {
      box = document.createElement('div');
      box.className = 'lightbox';
      box.innerHTML = '<img alt=""><div class="caption"></div>';
      box.addEventListener('click', () => box.classList.remove('on'));
      document.body.appendChild(box);
    }
    box.querySelector('img').src = src;
    box.querySelector('.caption').textContent = cap || '';
    box.classList.add('on');
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('figure.fig img').forEach(img => {
      img.addEventListener('click', () => {
        const cap = img.closest('figure').querySelector('figcaption');
        open(img.src, cap ? cap.textContent.trim() : '');
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && box) box.classList.remove('on');
    });
  });
})();
