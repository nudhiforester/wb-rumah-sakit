// Follow the pointer with damped motion and adjacent steps on the 3x3 sprite.
(function () {
  'use strict';
  var sprite = document.querySelector('.stats-nurse-sprite');
  if (!sprite) return;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var previous = document.createElement('span');
  previous.className = 'stats-nurse-previous';
  sprite.appendChild(previous);
  var pointer = null;
  var visible = true;
  var frame = 0;
  var lastTime = 0;
  var x = 0, y = 0, vx = 0, vy = 0;
  var aimX = 0, aimY = 0;
  var column = 1, row = 1;
  var desiredColumn = 1, desiredRow = 1;
  var transition = null;

  function position(col, line) { return (col * 50) + '% ' + (line * 50) + '%'; }
  function enabled() { return finePointer.matches && !reducedMotion.matches; }
  function wake() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }
  function updateAim() {
    aimX = aimY = 0;
    if (pointer && enabled()) {
      // Measure the stable container: the sprite itself moves slightly.
      var rect = sprite.parentElement.getBoundingClientRect();
      aimX = Math.max(-1, Math.min(1, (pointer.x - rect.left - rect.width * 0.5) / (rect.width * 0.8)));
      aimY = Math.max(-1, Math.min(1, (pointer.y - rect.top - rect.height * 0.23) / (rect.height * 0.65)));
    }
    wake();
  }
  function direction(value, current) {
    // Different enter/exit thresholds prevent flutter at pose boundaries.
    if (value < -0.36) return 0;
    if (value > 0.36) return 2;
    if (current === 0 && value < -0.21) return 0;
    if (current === 2 && value > 0.21) return 2;
    return 1;
  }
  function stepPose() {
    if (transition || (column === desiredColumn && row === desiredRow)) return;
    previous.style.backgroundPosition = position(column, row);
    // A turn across the sprite passes through the middle pose first.
    column += Math.sign(desiredColumn - column);
    row += Math.sign(desiredRow - row);
    sprite.style.backgroundPosition = position(column, row);
    if (!previous.animate) return;
    transition = previous.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 110, easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });
    transition.onfinish = function () {
      transition = null;
      wake();
    };
  }
  function render(now) {
    frame = 0;
    if (!visible || document.hidden || !enabled()) { lastTime = 0; return; }
    var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.032) : 1 / 60;
    lastTime = now;
    // Small integration steps keep the damped spring stable across frame rates.
    var steps = Math.ceil(dt / 0.008);
    var step = dt / steps;
    for (var i = 0; i < steps; i++) {
      vx += ((aimX - x) * 180 - vx * 27) * step;
      vy += ((aimY - y) * 180 - vy * 27) * step;
      x += vx * step;
      y += vy * step;
    }
    var settled = Math.abs(aimX - x) + Math.abs(aimY - y) + Math.abs(vx) + Math.abs(vy) < 0.003;
    if (settled) { x = aimX; y = aimY; vx = vy = 0; }
    desiredColumn = direction(x, desiredColumn);
    desiredRow = direction(y, desiredRow);
    stepPose();
    // Restrained shoulder movement; the gaze remains the main action.
    sprite.style.transform = 'translate(' + (x * 2.5).toFixed(3) + 'px, ' + (y * 1.5).toFixed(3) + 'px) rotate(' + (x * 0.65).toFixed(3) + 'deg)';
    if (!settled || column !== desiredColumn || row !== desiredRow) wake();
    else lastTime = 0;
  }
  function neutralImmediately() {
    stop();
    if (transition) { transition.cancel(); transition = null; }
    x = y = vx = vy = aimX = aimY = 0;
    column = row = desiredColumn = desiredRow = 1;
    sprite.style.backgroundPosition = '50% 50%';
    sprite.style.transform = '';
  }
  function reset() {
    pointer = null;
    if (!enabled()) neutralImmediately();
    else updateAim();
  }
  document.addEventListener('pointermove', function (event) {
    if (!enabled() || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    updateAim();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', updateAim, { passive: true });
  window.addEventListener('resize', updateAim);
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { pointer = null; neutralImmediately(); }
    else updateAim();
  });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) updateAim();
      else { pointer = null; neutralImmediately(); }
    });
    observer.observe(sprite.parentElement);
  }
})();
