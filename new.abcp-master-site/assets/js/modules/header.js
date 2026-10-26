/* Шапка: тень при прокрутке, бургер-меню, подсветка активного раздела */
(function (w, d) {
  var A = w.ABCP;
  A.register('header', function () {
    var h = A.qs('#header'), nav = A.qs('#nav'), b = A.qs('.burger');
    if (!h || !nav || !b) return;
    var onScroll = A.raf(function () { h.classList.toggle('is-scrolled', w.scrollY > 10); });
    onScroll(); w.addEventListener('scroll', onScroll, { passive: true });
    function close() { nav.classList.remove('is-open'); b.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Открыть меню'); }
    b.addEventListener('click', function () {
      var o = nav.classList.toggle('is-open');
      b.classList.toggle('is-open', o); b.setAttribute('aria-expanded', String(o)); b.setAttribute('aria-label', o ? 'Закрыть меню' : 'Открыть меню');
    });
    A.qsa('a', nav).forEach(function (a) { a.addEventListener('click', close); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    d.addEventListener('click', function (e) { if (!h.contains(e.target)) close(); });
    var links = A.qsa('.nav__link'), map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    if (!('IntersectionObserver' in w)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var l = map[e.target.id]; if (l) l.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    A.qsa('main section[id]').forEach(function (s) { io.observe(s); });
  });
})(window, document);
