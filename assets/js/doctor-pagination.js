(function () {
  'use strict';
  var grid = document.getElementById('doctorPageGrid');
  if (!grid) return;
  var controls = grid.parentElement.querySelector('.doctor-pagination');
  var cards = Array.from(grid.children);
  var pageSize = Number(grid.dataset.pageSize) || 4;
  var pageCount = Math.ceil(cards.length / pageSize);
  if (!controls || pageCount < 2) return;
  var currentPage = 1;
  var previous = controls.querySelector('[data-doctor-prev]');
  var next = controls.querySelector('[data-doctor-next]');
  var numbers = controls.querySelector('.doctor-page-numbers');
  var status = controls.querySelector('.doctor-page-status');
  var buttons = [];

  function showPage(page) {
    var nextPage = Math.max(1, Math.min(page, pageCount));
    var pageChanged = nextPage !== currentPage;
    currentPage = nextPage;
    var start = (currentPage - 1) * pageSize;
    cards.forEach(function (card, index) {
      card.hidden = index < start || index >= start + pageSize;
      if (!card.hidden) card.classList.add('visible');
    });
    buttons.forEach(function (button, index) {
      if (index + 1 === currentPage) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    previous.disabled = currentPage === 1;
    next.disabled = currentPage === pageCount;
    status.textContent = 'Menampilkan ' + (start + 1) + '\u2013' + Math.min(start + pageSize, cards.length) + ' dari ' + cards.length + ' dokter';
    if (pageChanged) {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      });
    }
  }

  for (var page = 1; page <= pageCount; page++) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = page;
    button.setAttribute('aria-label', 'Halaman ' + page);
    button.setAttribute('aria-controls', 'doctorPageGrid');
    button.addEventListener('click', function (event) {
      showPage(Number(event.currentTarget.textContent));
    });
    numbers.appendChild(button);
    buttons.push(button);
  }
  previous.addEventListener('click', function () {
    showPage(currentPage - 1);
    if (previous.disabled) buttons[currentPage - 1].focus({ preventScroll: true });
  });
  next.addEventListener('click', function () {
    showPage(currentPage + 1);
    if (next.disabled) buttons[currentPage - 1].focus({ preventScroll: true });
  });
  showPage(1);
  controls.hidden = false;
})();
