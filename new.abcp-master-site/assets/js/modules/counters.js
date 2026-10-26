/* Анимированные счётчики (data-count, data-suffix) */
(function (w, d) {
  var A = w.ABCP;
  A.register('counters', function () {
    if (A.reduced || !('IntersectionObserver' in w)) return;
    function run(el) {
      var to = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', t0 = null, dur = 1700;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * e) + (p === 1 ? suf : '');
        if (p < 1) w.requestAnimationFrame(step);
      }
      w.requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    A.qsa('[data-count]').forEach(function (el) { io.observe(el); });
  });
})(window, document);
