// One Swiper slide contains a complete page: 6 cards on desktop, 4 on smaller screens.
(function () {
  'use strict';
  var root = document.querySelector('#unit-instalasi');
  if (!root || typeof Swiper === 'undefined') return;
  var viewport = root.querySelector('.unit-swiper');
  var wrapper = viewport.querySelector('.swiper-wrapper');
  var cards = Array.from(wrapper.querySelectorAll('.unit-card'));
  var controls = root.querySelector('.unit-pagination-controls');
  var desktop = window.matchMedia('(min-width: 992px)');
  var swiper;
  var pageSize = 0;

  function updateStatus(instance) {
    var page = instance.activeIndex;
    root.querySelector('.unit-page-status').textContent = 'Halaman ' + (page + 1) + ' dari ' + Math.ceil(cards.length / pageSize);
    // Keep links on off-screen pages out of the keyboard navigation order.
    Array.from(wrapper.children).forEach(function (slide, index) {
      slide.inert = index !== page;
      slide.setAttribute('aria-hidden', index === page ? 'false' : 'true');
    });
  }

  function renderPages() {
    var firstVisible = swiper ? swiper.activeIndex * pageSize : 0;
    var focusedCard = cards.find(function (card) { return card.contains(document.activeElement); });
    if (focusedCard) firstVisible = cards.indexOf(focusedCard);
    if (swiper) swiper.destroy(true, true);
    pageSize = desktop.matches ? 6 : 4;
    wrapper.replaceChildren();
    wrapper.classList.remove('unit-page-grid');
    for (var start = 0; start < cards.length; start += pageSize) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide unit-page';
      var grid = document.createElement('div');
      grid.className = 'unit-page-grid';
      cards.slice(start, start + pageSize).forEach(function (card) { grid.appendChild(card); });
      slide.appendChild(grid);
      wrapper.appendChild(slide);
    }
    controls.hidden = cards.length === 0;
    if (!cards.length) return;
    swiper = new Swiper(viewport, {
      slidesPerView: 1,
      spaceBetween: 24,
      initialSlide: Math.floor(firstVisible / pageSize),
      autoHeight: true,
      speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400,
      navigation: { nextEl: root.querySelector('.unit-next'), prevEl: root.querySelector('.unit-prev'), addIcons: false },
      pagination: { el: root.querySelector('.unit-pagination'), clickable: true, dynamicBullets: true },
      a11y: { prevSlideMessage: 'Halaman unit sebelumnya', nextSlideMessage: 'Halaman unit berikutnya', paginationBulletMessage: 'Buka halaman unit {{index}}' },
      on: { init: updateStatus, slideChange: updateStatus }
    });
    if (focusedCard) focusedCard.focus({ preventScroll: true });
  }
  renderPages();
  desktop.addEventListener('change', renderPages);
})();
