// Scrub the paused video toward the pose selected by the pointer.
(function () {
  'use strict';
  var video = document.querySelector('.stats-nurse-video');
  if (!video) return;
  var media = video.parentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  // Source WebM: 60 fps. Timecodes use seconds:frames.
  var fps = 60;
  var poses = [0, 1 + 11 / fps, 2, 2 + 14 / fps, 3 + 6 / fps,
    3 + 22 / fps, 4 + 21 / fps, 5 + 15 / fps, 6];
  // Clockwise screen directions: right, down-right, down, down-left,
  // left, up-left, up, up-right.
  var directionPoses = [4, 3, 2, 1, 8, 7, 6, 5];
  var pointer = null;
  var visible = !('IntersectionObserver' in window);
  var ready = false;
  var frame = 0;
  var lastTick = 0;
  var target = 0;
  video.muted = true;
  video.pause();

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTick = 0;
  }
  function canAnimate() {
    return ready && visible && !document.hidden;
  }
  function tick(now) {
    frame = 0;
    if (!canAnimate()) return;
    var elapsed = lastTick ? Math.min((now - lastTick) / 1000, 0.05) : 1 / fps;
    lastTick = now;
    var difference = target - video.currentTime;
    if (Math.abs(difference) < 1 / fps) {
      if (!video.seeking && video.currentTime !== target) video.currentTime = target;
      lastTick = 0;
      return;
    }
    // Wait for each decoded seek rather than interrupting it with another seek.
    if (!video.seeking) {
      video.currentTime += difference * (1 - Math.exp(-12 * elapsed));
    }
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (canAnimate() && !frame) frame = requestAnimationFrame(tick);
  }
  function updateTarget() {
    target = 0;
    if (pointer && finePointer.matches && !reducedMotion.matches) {
      var rect = media.getBoundingClientRect();
      var dx = pointer.x - (rect.left + rect.width / 2);
      var dy = pointer.y - (rect.top + rect.height / 2);
      // Neutral zone around the middle of the circle.
      if (Math.hypot(dx, dy) > rect.width * 0.16) {
        var direction = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
        target = poses[directionPoses[direction]];
      }
    }
    if (ready) target = Math.min(target, Math.max(0, video.duration - 1 / fps));
    if (reducedMotion.matches && ready) {
      stop();
      video.currentTime = 0;
      return;
    }
    schedule();
  }
  function reset() {
    pointer = null;
    updateTarget();
  }
  function showFallback() {
    ready = false;
    stop();
    media.classList.remove('is-ready');
  }
  video.addEventListener('loadedmetadata', function () {
    ready = Number.isFinite(video.duration) && video.duration > 0;
    updateTarget();
  });
  video.addEventListener('loadeddata', function () {
    media.classList.add('is-ready');
  });
  video.addEventListener('seeked', schedule);
  video.addEventListener('error', showFallback);
  video.querySelector('source').addEventListener('error', showFallback);
  document.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch' || !finePointer.matches || reducedMotion.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    updateTarget();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', updateTarget, { passive: true });
  window.addEventListener('resize', updateTarget);
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else updateTarget();
  });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) updateTarget();
      else stop();
    });
    observer.observe(media);
  }
})();
