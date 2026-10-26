/* Слайдер: стрелки, счётчик 01 / 02, автопрокрутка, свайп, клавиатура */
(function (w, d) {
  var A = w.ABCP;
  A.register('slider', function () {
    A.qsa('[data-slider]').forEach(function (root) {
      var slides = A.qsa('.slider__slide', root), cur = A.qs('[data-current]', root), tot = A.qs('[data-total]', root), i = 0, timer, x0 = null;
      if (!slides.length) return;
      function pad(n) { return n < 10 ? '0' + n : '' + n; }
      function go(n) { slides[i].classList.remove('is-active'); i = (n + slides.length) % slides.length; slides[i].classList.add('is-active'); if (cur) cur.textContent = pad(i + 1); }
      function stop() { clearInterval(timer); }
      function play() { stop(); if (A.reduced || slides.length < 2) return; timer = setInterval(function () { go(i + 1); }, 5500); }
      if (tot) tot.textContent = pad(slides.length);
      A.qs('[data-prev]', root).addEventListener('click', function () { go(i - 1); play(); });
      A.qs('[data-next]', root).addEventListener('click', function () { go(i + 1); play(); });
      root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', play);
      root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      root.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); play(); }
        x0 = null;
      });
      root.setAttribute('tabindex', '0');
      root.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); });
      play();
    });
  });
})(window, document);
