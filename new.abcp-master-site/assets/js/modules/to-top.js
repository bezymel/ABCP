(function () {
  var toTop = document.querySelector('.to-top');
  if (!toTop) return;

  var toggleToTop = function () {
    var threshold = window.innerWidth <= 640 ? 250 : 380;
    toTop.classList.toggle('visible', window.scrollY > threshold);
  };

  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();

  toTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();
