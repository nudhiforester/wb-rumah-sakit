// One Swiper slide contains a complete page of four cards.
(function () {
  'use strict';
  var root = document.querySelector('#galeri');
  if (!root || typeof Swiper === 'undefined') return;
  var viewport = root.querySelector('.gallery-swiper');
  var wrapper = viewport.querySelector('.swiper-wrapper');
  var cards = Array.from(wrapper.querySelectorAll('.gallery-item'));
  var controls = root.querySelector('.unit-pagination-controls');
  var swiper;
  var pageSize = Number(viewport.dataset.pageSize);
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    console.error('Gallery page size must be a positive integer.');
    return;
  }

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
    wrapper.replaceChildren();
    wrapper.classList.remove('gallery-grid');
    for (var start = 0; start < cards.length; start += pageSize) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide gallery-page';
      var grid = document.createElement('div');
      grid.className = 'gallery-grid';
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
      a11y: { prevSlideMessage: 'Halaman galeri sebelumnya', nextSlideMessage: 'Halaman galeri berikutnya', paginationBulletMessage: 'Buka halaman galeri {{index}}' },
      on: { init: updateStatus, slideChange: updateStatus }
    });
    if (focusedCard) focusedCard.focus({ preventScroll: true });
  }
  renderPages();
})();
