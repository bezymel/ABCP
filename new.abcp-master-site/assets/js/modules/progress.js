/* Полоса прокрутки страницы сверху */
(function (w, d) {
  var A = w.ABCP;
  A.register('progress', function () {
    var bar = A.qs('.scroll-progress'); if (!bar) return;
    var upd = A.raf(function () {
      var max = d.documentElement.scrollHeight - w.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(w.scrollY / max, 1) : 0) + ')';
    });
    upd(); w.addEventListener('scroll', upd, { passive: true }); w.addEventListener('resize', upd);
  });
})(window, document);
