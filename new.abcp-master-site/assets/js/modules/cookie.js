(function () {
  var KEY = 'abcp_cookie_notice';
  var box = document.getElementById('cookie-notice');
  if (!box) return;

  function get(storage) {
    try { return storage.getItem(KEY); } catch (e) { return null; }
  }
  function set(storage, value) {
    try { storage.setItem(KEY, value); } catch (e) {}
  }

  // Уже принято или закрыто: не показываем
  if (get(localStorage) === 'accepted' || get(sessionStorage) === 'closed') return;

  function hide() {
    box.classList.remove('is-visible');
    document.body.classList.remove('has-cookie');
    setTimeout(function () { box.hidden = true; }, 400);
  }

  var acceptBtn = box.querySelector('[data-cookie-accept]');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      set(localStorage, 'accepted');
      hide();
    });
  }

  var closeBtn = box.querySelector('[data-cookie-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      set(sessionStorage, 'closed');
      hide();
    });
  }

  // Показываем через 1 секунду после загрузки
  setTimeout(function () {
    box.hidden = false;
    document.body.classList.add('has-cookie');
    requestAnimationFrame(function () { box.classList.add('is-visible'); });
  }, 1000);
})();
