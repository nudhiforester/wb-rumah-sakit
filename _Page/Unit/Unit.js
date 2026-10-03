(function () {
  'use strict';
  var hero = document.getElementById('unit-orbit-hero');
  if (!hero) return;
  var video = hero.querySelector('video');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var target = 3;
  var frame = null;
  var ready = false;
  hero.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (link) {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      new window.bootstrap.Tooltip(link, { container: 'body', trigger: 'hover focus', customClass: 'unit-orbit-tooltip' });
    }
    link.addEventListener('focus', function () {
      var bounds = link.getBoundingClientRect();
      setPosition(bounds.left + bounds.width / 2);
    });
  });
  // Wait for each seek to decode before requesting the next frame.
  function update() {
    frame = null;
    if (!ready || video.seeking || document.hidden) return;
    var difference = target - video.currentTime;
    if (Math.abs(difference) < 0.035) return;
    var step = reduced.matches ? difference : Math.sign(difference) * Math.min(Math.abs(difference), 0.18);
    video.currentTime = Math.max(0, Math.min(video.duration - 0.04, video.currentTime + step));
  }
  function schedule() {
    if (frame === null) frame = requestAnimationFrame(update);
  }
  function setPosition(x) {
    if (reduced.matches) return;
    var position = Math.max(0, Math.min(1, x / window.innerWidth));
    if (position <= 0.08) position = 0;
    else if (position >= 0.92) position = 1;
    else if (Math.abs(position - 0.5) <= 0.04) position = 0.5;
    target = Math.min(6 * position, ready ? Math.max(0, video.duration - 0.04) : 6);
    schedule();
  }
  function initialize() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    ready = true;
    video.pause();
    target = Math.min(target, Math.max(0, video.duration - 0.04));
    video.currentTime = target;
  }
  window.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'touch') setPosition(event.clientX);
  }, { passive: true });
  hero.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'touch') setPosition(event.clientX);
  }, { passive: true });
  video.addEventListener('loadedmetadata', initialize);
  video.addEventListener('seeked', schedule);
  video.addEventListener('canplay', schedule);
  function showError() { ready = false; hero.querySelector('.unit-orbit-status').hidden = false; }
  video.addEventListener('error', showError);
  video.querySelector('source').addEventListener('error', showError);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) schedule(); });
  reduced.addEventListener('change', function () {
    target = Math.min(3, ready ? Math.max(0, video.duration - 0.04) : 3);
    schedule();
  });
  if (video.readyState >= 1) initialize();
})();
