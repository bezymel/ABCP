/* Блок магазинов: автопрокрутка по кругу + ручное листание (мышь-перетаскивание, свайп, колесо, стрелки) */
(function (w, d) {
  var A = w.ABCP, SPEED = 42;
  A.register('marquee', function () {
    A.qsa('[data-marquee]').forEach(function (box) {
      var rows = A.qsa('[data-marquee-row]', box), visible = true, hover = false, until = 0, last = 0;
      var st = rows.map(function (r) {
        return { row: r, dir: r.getAttribute('data-dir') === 'right' ? -1 : 1, orig: A.qsa(':scope > *', r), pos: 0, last: 0, w: 0, rem: 0, drag: null };
      });
      function now() { return w.performance.now(); }
      function build(s) {
        A.qsa('[data-clone]', s.row).forEach(function (n) { n.remove(); });
        var gap = parseFloat(w.getComputedStyle(s.row).columnGap) || 0, tw = 0;
        s.orig.forEach(function (el) { tw += el.getBoundingClientRect().width + gap; });
        s.w = tw; if (!tw) return;
        var copies = Math.ceil((2 * tw + s.row.clientWidth) / tw) - 1;
        for (var i = 0; i < copies; i++) s.orig.forEach(function (el) {
          var c = el.cloneNode(true); c.setAttribute('data-clone', ''); c.setAttribute('aria-hidden', 'true'); s.row.appendChild(c);
        });
        s.row.scrollLeft = tw; s.pos = tw; s.last = s.row.scrollLeft; s.rem = 0;
      }
      function buildAll() { st.forEach(build); }
      function pause(ms) { until = Math.max(until, now() + ms); }
      function frame(t) {
        var dt = Math.min(64, t - last) / 1000; last = t;
        var run = visible && !hover && !A.reduced && now() >= until;
        st.forEach(function (s) {
          if (!s.w) return;
          var r = s.row, sl = r.scrollLeft, delta = 0;
          if (s.drag) { s.pos = sl; s.last = sl; return; }
          if (run) delta += s.dir * SPEED * dt;
          if (Math.abs(s.rem) > 0.5) { var step = s.rem * Math.min(1, dt * 7); s.rem -= step; delta += step; } else s.rem = 0;
          if (Math.abs(sl - s.last) > 1.5 || !delta) s.pos = sl;
          s.pos += delta;
          if (s.pos >= 2 * s.w) s.pos -= s.w; else if (s.pos < s.w) s.pos += s.w;
          if (Math.abs(s.pos - sl) > 0.01) r.scrollLeft = s.pos;
          s.last = r.scrollLeft;
        });
        w.requestAnimationFrame(frame);
      }
      st.forEach(function (s) {
        var r = s.row;
r.addEventListener('pointerdown', function (e) {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  s.dragged = false;
  // захват пока не включаем, иначе клик по ссылке не дойдёт до <a>
  s.drag = { x: e.clientX, sl: r.scrollLeft, id: e.pointerId, moved: false };
});
r.addEventListener('pointermove', function (e) {
  if (!s.drag) return;
  var dx = e.clientX - s.drag.x;
  if (!s.drag.moved) {
    if (Math.abs(dx) < 6) return;          // порог: меньше 6px считаем кликом
    s.drag.moved = true;
    r.classList.add('is-dragging');
    try { r.setPointerCapture(s.drag.id); } catch (x) {}
  }
  r.scrollLeft = s.drag.sl - dx;
});
function up() {
  if (!s.drag) return;
  s.dragged = s.drag.moved;                 // запоминаем, было ли настоящее перетаскивание
  s.drag = null;
  r.classList.remove('is-dragging');
  pause(1500);
}
r.addEventListener('pointerup', up); r.addEventListener('pointercancel', up);
// после перетаскивания гасим случайный клик по ссылке, обычный клик проходит
r.addEventListener('click', function (e) {
  if (s.dragged) { e.preventDefault(); e.stopPropagation(); s.dragged = false; }
}, true);
        r.addEventListener('dragstart', function (e) { e.preventDefault(); });
        r.addEventListener('touchstart', function () { until = Infinity; }, { passive: true });
        function tend() { until = now() + 2500; }
        r.addEventListener('touchend', tend, { passive: true }); r.addEventListener('touchcancel', tend, { passive: true });
        r.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) pause(2000); }, { passive: true });
      });
      box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
      box.addEventListener('pointerleave', function () { hover = false; });
      function nudge(dir) {
        pause(1800);
        st.forEach(function (s) { var it = s.orig[0]; s.rem += dir * (it.getBoundingClientRect().width + 16) * 2; });
      }
      var prev = A.qs('[data-marquee-prev]', box), next = A.qs('[data-marquee-next]', box);
      if (prev) prev.addEventListener('click', function () { nudge(-1); });
      if (next) next.addEventListener('click', function () { nudge(1); });
      if ('IntersectionObserver' in w) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(box);
      var tm; w.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(buildAll, 200); });
      buildAll(); w.addEventListener('load', buildAll);
      w.requestAnimationFrame(function (t) { last = t; frame(t); });
    });
  });
})(window, document);
