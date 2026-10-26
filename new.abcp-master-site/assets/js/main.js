/* Точка входа: запускает все зарегистрированные модули */
(function (w, d) {
  var A = w.ABCP;
  A.register('placeholders', function () {
    A.qsa('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
  });
  A.ready(function () {
    A.modules.forEach(function (m) {
      try { m[1](); } catch (err) { if (w.console) console.error('[ABCP:' + m[0] + ']', err); }
    });
  });
})(window, document);
