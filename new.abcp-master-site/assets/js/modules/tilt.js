/* Мягкий 3D-наклон (data-tilt) */
(function (w, d) {
  var A = w.ABCP;
  A.register('tilt', function () {
    if (!A.finePointer || A.reduced) return;
    A.qsa('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 6;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1000px) rotateX(' + (-y * max) + 'deg) rotateY(' + (x * max) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  });
})(window, document);
