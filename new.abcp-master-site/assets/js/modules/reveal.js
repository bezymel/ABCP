/* Плавное появление блоков при прокрутке (data-reveal, data-stagger) */
(function (w, d) {
  var A = w.ABCP;
  A.register('reveal', function () {
    A.qsa('[data-stagger]').forEach(function (c) {
      Array.prototype.forEach.call(c.children, function (el, i) {
        if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
        el.style.setProperty('--d', (i % 6) * 0.09 + 's');
      });
    });
    var els = A.qsa('[data-reveal]');
    function clean(el) { el.removeAttribute('data-reveal'); el.style.removeProperty('--d'); }
    if (A.reduced || !('IntersectionObserver' in w)) { els.forEach(clean); return; }
    function show(el) {
      el.classList.add('is-visible');
      el.addEventListener('transitionend', function f(e) {
        if (e.target !== el || e.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', f); clean(el);
      });
      setTimeout(function () { clean(el); }, 2400);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  });
})(window, document);
