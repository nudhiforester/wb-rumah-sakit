// Sprite rows and columns map to up/center/down and left/center/right.
(function () {
  'use strict';
  var sprite = document.querySelector('.stats-nurse-sprite');
  if (!sprite) return;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var frame = 0;
  var pointer;
  var previous = document.createElement('span');
  previous.className = 'stats-nurse-previous';
  sprite.appendChild(previous);
  var currentPose = '50% 50%';
  var desiredPose = currentPose;
  var transition;
  function changePose(position) {
    desiredPose = position;
    if (transition || position === currentPose) return;
    previous.style.backgroundPosition = currentPose;
    sprite.style.backgroundPosition = position;
    currentPose = position;
    if (reducedMotion.matches || !previous.animate) return;
    // Fade the old cell over the new cell; never pan across the sprite sheet.
    transition = previous.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 160, easing: 'ease-out'
    });
    transition.onfinish = function () {
      transition = null;
      changePose(desiredPose);
    };
  }
  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    pointer = null;
    if (transition) { transition.cancel(); transition = null; }
    changePose('50% 50%');
  }
  function render() {
    frame = 0;
    if (!pointer) return;
    var rect = sprite.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    // Aim from the face, with a neutral zone to avoid flicker near the eyes.
    var dx = pointer.x - (rect.left + rect.width * 0.5);
    var dy = pointer.y - (rect.top + rect.height * 0.23);
    var column = Math.abs(dx) < rect.width * 0.16 ? 1 : dx < 0 ? 0 : 2;
    var row = Math.abs(dy) < rect.height * 0.15 ? 1 : dy < 0 ? 0 : 2;
    changePose((column * 50) + '% ' + (row * 50) + '%');
  }
  document.addEventListener('pointermove', function (event) {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', reset, { passive: true });
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
})();
