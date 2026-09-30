// Run before vendor scripts so a missing dependency cannot block the page.
(function () {
  'use strict';

  var preloader = document.getElementById('preloader');
  if (!preloader) return;

  var dismissed = false;
  var fallbackTimer;
  var startedAt = Date.now();
  var minimumDuration = 2000;

  function dismissPreloader() {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(fallbackTimer);
    setTimeout(function () {
      preloader.classList.add('fade-out');
      setTimeout(function () {
        preloader.remove();
      }, 600);
    }, Math.max(0, minimumDuration - (Date.now() - startedAt)));
  }

  preloader.hidden = false;
  fallbackTimer = setTimeout(dismissPreloader, 3000);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dismissPreloader, { once: true });
  } else {
    dismissPreloader();
  }
})();
