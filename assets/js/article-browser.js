(function () {
  'use strict';
  var grid = document.getElementById('articlePageGrid');
  if (!grid) return;
  var cards = Array.from(grid.children);
  var categories = ['Kesehatan Jantung', 'Kesehatan Anak', 'Kegiatan RS', 'Diabetes', 'Gaya Hidup', 'Kegiatan RS'];
  var selectedTag = 'Semua';
  var query = '';
  var page = 1;
  var size = 3;
  var pagination = document.getElementById('articlePagination');
  var numbers = pagination.querySelector('.doctor-page-numbers');
  var previous = pagination.querySelector('[data-article-prev]');
  var next = pagination.querySelector('[data-article-next]');
  var tagList = document.querySelector('.article-tags');
  var slider = document.querySelector('.article-featured-swiper .swiper-wrapper');

  cards.forEach(function (card, index) {
    card.dataset.tag = categories[index] || 'Umum';
    var badge = document.createElement('span');
    badge.className = 'article-category';
    badge.textContent = card.dataset.tag;
    card.querySelector('.card-body').prepend(badge);
    var link = card.querySelector('a');
    link.href = '#articleDemoModal';
    link.setAttribute('data-bs-toggle', 'modal');
    link.setAttribute('data-bs-target', '#articleDemoModal');
    if (index < 3) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      var cover = card.querySelector('.article-card').cloneNode(true);
      cover.classList.add('article-carousel-cover');
      slide.appendChild(cover);
      slider.appendChild(slide);
    }
  });

  function render(scroll) {
    var matches = cards.filter(function (card) {
      return (selectedTag === 'Semua' || card.dataset.tag === selectedTag) && card.textContent.toLocaleLowerCase('id').includes(query);
    });
    var totalPages = Math.ceil(matches.length / size);
    page = Math.max(1, Math.min(page, totalPages || 1));
    var visible = matches.slice((page - 1) * size, page * size);
    cards.forEach(function (card) {
      card.hidden = !visible.includes(card);
      if (!card.hidden) card.classList.add('visible');
    });
    document.getElementById('articleEmpty').hidden = matches.length > 0;
    document.getElementById('articleResultStatus').textContent = matches.length ? 'Menampilkan ' + ((page - 1) * size + 1) + '–' + Math.min(page * size, matches.length) + ' dari ' + matches.length + ' artikel dummy' : '0 artikel ditemukan';
    numbers.replaceChildren();
    for (var index = 1; index <= totalPages; index++) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = index;
      button.setAttribute('aria-label', 'Halaman ' + index);
      button.setAttribute('aria-controls', 'articlePageGrid');
      if (index === page) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', function (event) {
        var targetPage = Number(event.currentTarget.textContent);
        if (targetPage === page) return;
        page = targetPage;
        render(true);
        numbers.children[page - 1].focus({ preventScroll: true });
      });
      numbers.appendChild(button);
    }
    pagination.hidden = totalPages === 0;
    previous.disabled = page === 1;
    next.disabled = page >= totalPages;
    if (scroll) {
      var navbar = document.getElementById('mainNavbar');
      window.scrollTo({ top: Math.max(0, document.querySelector('.article-tools').getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 0) - 16), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }

  ['Semua'].concat(Array.from(new Set(categories))).forEach(function (tag) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = tag;
    button.setAttribute('aria-pressed', String(tag === selectedTag));
    button.addEventListener('click', function () {
      selectedTag = tag;
      page = 1;
      Array.from(tagList.children).forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      render(false);
    });
    tagList.appendChild(button);
  });
  document.getElementById('articleSearchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    query = document.getElementById('articleSearch').value.trim().toLocaleLowerCase('id');
    page = 1;
    render(false);
  });
  document.getElementById('articleSearch').addEventListener('input', function () {
    query = this.value.trim().toLocaleLowerCase('id');
    page = 1;
    render(false);
  });
  previous.addEventListener('click', function () { page--; render(true); if (previous.disabled) numbers.children[page - 1].focus({ preventScroll: true }); });
  next.addEventListener('click', function () { page++; render(true); if (next.disabled) numbers.children[page - 1].focus({ preventScroll: true }); });
  document.getElementById('articleDemoModal').addEventListener('show.bs.modal', function (event) {
    var card = event.relatedTarget && event.relatedTarget.closest('.article-card');
    if (!card) return;
    document.getElementById('articleDemoTitle').textContent = card.querySelector('.card-title').textContent;
    document.getElementById('articleDemoText').textContent = card.querySelector('.card-text').textContent;
  });
  if (window.Swiper) {
    new Swiper('.article-featured-swiper', {
      slidesPerView: 1, spaceBetween: 0,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500,
      navigation: { prevEl: '.article-featured-prev', nextEl: '.article-featured-next' },
      pagination: { el: '.article-featured-dots', clickable: true }
    });
  }
  render(false);
})();
