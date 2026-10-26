/* Пустые src: показываем красивую заглушку, пока вы не добавите изображения */
(function (w, d) {
  var A = w.ABCP;
  function mark(img) {
    var p = img.closest('.media,.logo__mark,.review__avatar');
    if (!p) return;
    function ok() { p.classList.remove('is-empty'); p.classList.add('has-img'); img.classList.remove('is-broken'); }
    function bad() { p.classList.add('is-empty'); p.classList.remove('has-img'); img.classList.add('is-broken'); }
    if (!img.getAttribute('src')) { p.classList.add('is-empty'); return; }
    img.addEventListener('load', ok); img.addEventListener('error', bad);
    if (img.complete) { img.naturalWidth ? ok() : bad(); }
  }
  A.register('images', function () { A.qsa('img').forEach(mark); });
})(window, document);
