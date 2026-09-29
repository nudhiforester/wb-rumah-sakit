/**
 * ================================================================
 * RSU El-Syifa Kuningan — main.js
 * Global JavaScript handlers
 * ================================================================
 */

$(document).ready(function () {

  // ========================================
  // 1. Preloader
  // ========================================
  $(window).on('load', function () {
    $('#preloader').addClass('fade-out');
    setTimeout(function () {
      $('#preloader').remove();
    }, 600);
  });

  // Fallback: remove preloader after 3s in case of slow load
  setTimeout(function () {
    $('#preloader').addClass('fade-out');
    setTimeout(function () {
      $('#preloader').remove();
    }, 600);
  }, 3000);

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
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 80
      }, 600);

      // Close mobile navbar if open
      var navbarCollapse = $('#navbarNav');
      if (navbarCollapse.hasClass('show')) {
        navbarCollapse.collapse('hide');
      }
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
  $('.gallery-item[data-img]').on('click', function () {
    var imgSrc = $(this).data('img');
    var imgAlt = $(this).find('img').attr('alt') || 'Galeri RSU El-Syifa';
    $('#lightboxImage').attr('src', imgSrc).attr('alt', imgAlt);
  });

  // Clear image when modal closes
  $('#lightboxModal').on('hidden.bs.modal', function () {
    $('#lightboxImage').attr('src', '');
  });

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
      pagination: {
        el: '.poliklinik-swiper .swiper-pagination',
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
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '.dokter-swiper .swiper-button-next',
        prevEl: '.dokter-swiper .swiper-button-prev',
      },
      pagination: {
        el: '.dokter-swiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    });
  }

  // Ruang Rawat Swiper
  if (document.querySelector('.ruang-swiper')) {
    new Swiper('.ruang-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '.ruang-swiper .swiper-button-next',
        prevEl: '.ruang-swiper .swiper-button-prev',
      },
      pagination: {
        el: '.ruang-swiper .swiper-pagination',
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
      pagination: {
        el: '.artikel-swiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    });
  }

  // Testimonial Swiper
  if (document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.testimonial-swiper .swiper-pagination',
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
  $('.navbar-elsyifa .nav-link').each(function () {
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
