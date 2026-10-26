/* Слайдер проектов: листание страницами (4 / 2 / 1 карточка), стрелки, точки, перетаскивание мышью, клавиатура */
(function (w, d) {
  var A = w.ABCP;
  A.register('projects-slider', function () {
    A.qsa('[data-pslider]').forEach(function (root) {
      var track = A.qs('.pslider__track', root), items = A.qsa('.pslider__item', track), dots = A.qs('.pslider__dots', root),
        cur = A.qs('[data-current]', root), tot = A.qs('[data-total]', root), bar = A.qs('.pslider__bar', root),
        pages = 1, page = 0, step = 1, drag = null;
      if (!track || !items.length) return;
      function pad(n) { return n < 10 ? '0' + n : '' + n; }
      function pv() { return parseInt(w.getComputedStyle(root).getPropertyValue('--pv'), 10) || 1; }
      function show() {
        var max = track.scrollWidth - track.clientWidth;
        page = track.scrollLeft >= max - 4 ? pages - 1 : Math.min(pages - 1, Math.round(track.scrollLeft / step));
        if (cur) cur.textContent = pad(page + 1);
        A.qsa('.pslider__dot', dots).forEach(function (b, i) { b.classList.toggle('is-active', i === page); b.setAttribute('aria-current', i === page ? 'true' : 'false'); });
      }
      function go(p) { p = (p + pages) % pages; track.scrollTo({ left: p * step, behavior: A.reduced ? 'auto' : 'smooth' }); }
      function measure() {
        var n = pv(); pages = Math.max(1, Math.ceil(items.length / n));
        step = items[n] ? items[n].offsetLeft - items[0].offsetLeft : track.clientWidth;
        dots.innerHTML = '';
        for (var i = 0; i < pages; i++) (function (i) {
          var b = d.createElement('button'); b.type = 'button'; b.className = 'pslider__dot'; b.setAttribute('aria-label', 'Страница ' + (i + 1));
          b.addEventListener('click', function () { go(i); }); dots.appendChild(b);
        })(i);
        if (tot) tot.textContent = pad(pages);
        if (bar) bar.style.display = pages > 1 ? '' : 'none';
        show();
      }
      track.addEventListener('scroll', A.raf(show), { passive: true });
      A.qs('[data-prev]', root).addEventListener('click', function () { go(page - 1); });
      A.qs('[data-next]', root).addEventListener('click', function () { go(page + 1); });
      track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(page + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(page - 1); } });
      track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        drag = { x: e.clientX, sl: track.scrollLeft }; track.classList.add('is-dragging');
        try { track.setPointerCapture(e.pointerId); } catch (x) {}
      });
      track.addEventListener('pointermove', function (e) { if (drag) track.scrollLeft = drag.sl - (e.clientX - drag.x); });
      function up() { if (!drag) return; var dx = track.scrollLeft - drag.sl; drag = null; track.classList.remove('is-dragging'); go(Math.round(track.scrollLeft / step) + (Math.abs(dx) > step * 0.12 ? 0 : 0)); }
      track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
      track.addEventListener('dragstart', function (e) { e.preventDefault(); });
      var tm; w.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(measure, 150); });
      measure(); w.addEventListener('load', measure);
    });
  });
})(window, document);
