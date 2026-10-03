/**
 * ================================================================
 * RSU El-Syifa Kuningan — main.js
 * Global JavaScript handlers
 * ================================================================
 */

$(document).ready(function () {

  // Preloader is managed independently by assets/js/preloader.js.

  // ========================================
  // 2. Navbar scroll effect
  // ========================================
  $(window).on('scroll', function () {
    var scrollTop = $(this).scrollTop();

    // Add shadow on scroll
    if (scrollTop > 50) {
      $('#mainNavbar').addClass('navbar-scrolled');
    } else {
      $('#mainNavbar').removeClass('navbar-scrolled');
    }

    // Back to top button visibility
    if (scrollTop > 400) {
      $('#btnBackToTop').addClass('show');
    } else {
      $('#btnBackToTop').removeClass('show');
    }
  });

  // ========================================
  // 3. Back to top button
  // ========================================
  $('#btnBackToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // ========================================
  // 4. Smooth scroll for anchor links
  // ========================================
  function closeMobileNavbar() {
    var navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false }).hide();
    }
  }

  $('#navbarNav .nav-link').on('click', closeMobileNavbar);

  $('a[href^="#"]').on('click', function (e) {
    if (this.hasAttribute('data-bs-toggle') || this.getAttribute('href') === '#') return;
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 80
      }, 600);

      // Close mobile navbar if open
      closeMobileNavbar();
    }
  });

  // ========================================
  // 5. Counter Animation (Statistik)
  // ========================================
  var counterAnimated = false;

  function animateCounters() {
    if (counterAnimated) return;

    var statsSection = $('#statistik');
    if (statsSection.length === 0) return;

    var sectionTop = statsSection.offset().top;
    var sectionBottom = sectionTop + statsSection.outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    if (sectionBottom > viewportTop && sectionTop < viewportBottom) {
      counterAnimated = true;

      $('.stat-number[data-target]').each(function () {
        var $this = $(this);
        var target = parseInt($this.data('target'), 10);
        var duration = 2000;
        var stepTime = 20;
        var steps = duration / stepTime;
        var increment = target / steps;
        var current = 0;

        var timer = setInterval(function () {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }

          // Format number with plus sign and thousand separator
          var formatted = Math.floor(current).toLocaleString('id-ID');
          if (current === target) {
            formatted += '+';
          }
          $this.text(formatted);
        }, stepTime);
      });
    }
  }

  $(window).on('scroll', animateCounters);
  animateCounters(); // Check on page load

  // ========================================
  // 6. Fade in on scroll (Intersection Observer)
  // ========================================
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in-up').forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    $('.fade-in-up').addClass('visible');
  }

  // ========================================
  // 7. Lightbox / Gallery Modal
  // ========================================
  $('.gallery-item[data-img], .history-photo[data-img], .doctor-photo[data-img], .unit-photo-trigger[data-img]').on('click', function () {
    var imgSrc = $(this).data('img');
    var imgAlt = $(this).find('img').attr('alt') || 'Galeri RSU El-Syifa';
    $('#lightboxImage').attr('src', imgSrc).attr('alt', imgAlt);
  });

  // Clear image when modal closes
  $('#lightboxModal').on('hidden.bs.modal', function () {
    $('#lightboxImage').attr('src', '');
  });

  // Preserve slider position while Bootstrap restores focus to the modal trigger.
  document.querySelectorAll('#lightboxModal, #doctorScheduleModal, #testimonialModal').forEach(function (modal) {
    var savedSliderState;
    modal.addEventListener('show.bs.modal', function (event) {
      var sliderElement = event.relatedTarget && event.relatedTarget.closest('.dokter-swiper, .testimonial-swiper');
      var slider = sliderElement && sliderElement.swiper;
      if (!slider) return;
      savedSliderState = { slider: slider, index: slider.activeIndex, scrollOnFocus: slider.params.a11y.scrollOnFocus, autoplayRunning: slider.autoplay && slider.autoplay.running };
      slider.params.a11y.scrollOnFocus = false;
      if (savedSliderState.autoplayRunning) slider.autoplay.stop();
    });
    modal.addEventListener('hidden.bs.modal', function () {
      if (!savedSliderState) return;
      var state = savedSliderState;
      savedSliderState = null;
      if (state.slider.destroyed) return;
      state.slider.slideTo(state.index, 0, false);
      // Restore normal keyboard navigation after Bootstrap's focus restoration completes.
      setTimeout(function () {
        if (!state.slider.destroyed) {
          state.slider.params.a11y.scrollOnFocus = state.scrollOnFocus;
          if (state.autoplayRunning) state.slider.autoplay.start();
        }
      }, 0);
    });
  });

  var scheduleModal = document.getElementById('doctorScheduleModal');
  if (scheduleModal) {
    scheduleModal.addEventListener('show.bs.modal', function (event) {
      var trigger = event.relatedTarget;
      if (!trigger) return;
      var name = trigger.getAttribute('data-doctor') || 'Dokter';
      var schedule = (trigger.getAttribute('data-schedule') || '').trim();
      var kind = trigger.getAttribute('data-schedule-kind');
      var hasSchedule = kind !== 'missing' && schedule.length > 0;
      document.getElementById('doctorScheduleName').textContent = name;
      document.getElementById('doctorScheduleDemo').hidden = kind !== 'dummy';
      document.getElementById('doctorScheduleText').textContent = hasSchedule ? schedule : 'Data jadwal praktik untuk ' + name + ' belum tersedia di situs saat ini.';
      document.getElementById('doctorScheduleGuidance').textContent = hasSchedule
        ? 'Silakan hubungi petugas untuk memastikan jadwal praktik dan ketersediaan antrean sebelum berkunjung.'
        : 'Calon pasien dapat menghubungi RSU El-Syifa melalui tombol Konfirmasi Jadwal di bawah. Petugas akan membantu memberikan informasi jadwal terbaru, ketersediaan dokter, dan alur pendaftaran.';
      var action = document.getElementById('doctorScheduleAction');
      action.classList.toggle('schedule-action-whatsapp', !hasSchedule);
      document.getElementById('doctorScheduleActionIcon').className = hasSchedule ? 'bi bi-calendar-plus' : 'bi bi-whatsapp';
      document.getElementById('doctorScheduleActionLabel').textContent = hasSchedule ? 'Daftar Antrian' : 'Konfirmasi Jadwal';
      var message = hasSchedule
        ? 'Halo RSU El-Syifa, saya ingin menanyakan jadwal praktik resmi dan pendaftaran antrean untuk ' + name + '. Mohon informasi ketersediaannya.'
        : 'Halo RSU El-Syifa, jadwal ' + name + ' belum tersedia di situs. Mohon informasi jadwal praktik terbaru dan cara pendaftarannya.';
      action.href = hasSchedule ? 'index.php?page=daftar_antrian' : 'https://wa.me/6285910577797?text=' + encodeURIComponent(message);
      action.target = hasSchedule ? '_self' : '_blank';
      document.getElementById('doctorScheduleActionNote').textContent = hasSchedule
        ? 'Pilih jadwal dan isi data pasien pada halaman pendaftaran antrian.'
        : 'Tombol membuka WhatsApp rumah sakit untuk konfirmasi jadwal.';
      delete action.dataset.dokterId;
      if (window.loadDummyDoctorSchedule) window.loadDummyDoctorSchedule(trigger);
    });
  }

  if (window.bootstrap && window.bootstrap.Tooltip) {
    document.querySelectorAll('.doctor-card [data-bs-toggle="tooltip"]').forEach(function (element) {
      new bootstrap.Tooltip(element, { container: 'body', placement: 'top' });
    });
  }

  // ========================================
  // 8. Swiper Initializations
  // ========================================

  // Hero Swiper
  if (document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 800,
      pagination: {
        el: '.hero-swiper .swiper-pagination',
        clickable: true,
      },
    });
  }

  // Poliklinik Swiper
  if (document.querySelector('.poliklinik-swiper')) {
    new Swiper('.poliklinik-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: '#poliklinik .unit-next',
        prevEl: '#poliklinik .unit-prev',
        addIcons: false,
      },
      pagination: {
        el: '#poliklinik .unit-pagination',
        dynamicBullets: true,
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
      },
    });
  }

  // Dokter Swiper
  if (document.querySelector('.dokter-swiper')) {
    new Swiper('.dokter-swiper', {
      slidesPerView: 2,
      spaceBetween: 12,
      navigation: {
        nextEl: '#dokter .unit-next',
        prevEl: '#dokter .unit-prev',
        addIcons: false,
      },
      pagination: {
        el: '#dokter .unit-pagination',
        dynamicBullets: true,
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 24 },
      },
    });
  }

  // Ruang Rawat Swiper
  if (document.querySelector('.ruang-swiper')) {
    new Swiper('.ruang-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '#ruang-rawat .unit-next',
        prevEl: '#ruang-rawat .unit-prev',
        addIcons: false,
      },
      pagination: {
        el: '#ruang-rawat .unit-pagination',
        dynamicBullets: true,
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    });
  }

  // Artikel Swiper
  if (document.querySelector('.artikel-swiper')) {
    new Swiper('.artikel-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '#artikel .unit-next',
        prevEl: '#artikel .unit-prev',
        addIcons: false,
      },
      pagination: {
        el: '#artikel .unit-pagination',
        dynamicBullets: true,
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    });
  }

  // Keep full testimonial text separate from the 24-word card preview.
  document.querySelectorAll('.testimonial-card').forEach(function (card) {
    var fullText = card.querySelector('.testimonial-full').textContent.trim();
    var words = fullText.split(/\s+/);
    card.querySelector('.testimonial-text').textContent = words.slice(0, 24).join(' ') + (words.length > 24 ? '\u2026' : '');
  });

  var testimonialModal = document.getElementById('testimonialModal');
  var testimonialSwiper;
  if (testimonialModal) {
    testimonialModal.addEventListener('show.bs.modal', function (event) {
      var card = event.relatedTarget;
      if (!card || !card.matches('.testimonial-card')) return;
      var avatar = card.querySelector('.testimonial-avatar');
      var modalAvatar = document.getElementById('testimonialModalAvatar');
      modalAvatar.src = avatar.getAttribute('src');
      modalAvatar.alt = avatar.alt;
      document.getElementById('testimonialModalName').textContent = card.querySelector('.testimonial-name').textContent;
      document.getElementById('testimonialModalRole').textContent = card.querySelector('.testimonial-role').textContent;
      document.getElementById('testimonialModalText').textContent = card.querySelector('.testimonial-full').textContent.trim();
    });
  }

  // Testimonial Swiper
  if (document.querySelector('.testimonial-swiper')) {
    testimonialSwiper = new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '#testimonial .unit-next',
        prevEl: '#testimonial .unit-prev',
        addIcons: false,
      },
      pagination: {
        el: '#testimonial .unit-pagination',
        dynamicBullets: true,
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    });
  }

  // Partner Swiper
  if (document.querySelector('.partner-swiper')) {
    new Swiper('.partner-swiper', {
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 5 },
      },
    });
  }

  // ========================================
  // 9. Active nav link highlight
  // ========================================
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.navbar-elsyifa:not([data-server-navigation]) .nav-link').each(function () {
    var href = $(this).attr('href');
    if (href === currentPage) {
      $(this).addClass('active');
    } else {
      // Don't remove active from Beranda when on index page
      if (!(currentPage === '' && href === 'index.html')) {
        // Keep logic for non-index pages
      }
    }
  });

});
