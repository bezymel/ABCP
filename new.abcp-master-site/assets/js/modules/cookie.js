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

  // Уже принято или закрыто в этой сессии: ничего не показываем
  if (get(localStorage) === 'accepted' || get(sessionStorage) === 'closed') return;

  function hide() {
    box.classList.remove('is-visible');
    setTimeout(function () { box.hidden = true; }, 400);
  }

  box.querySelector('[data-cookie-accept]').addEventListener('click', function () {
    set(localStorage, 'accepted');
    hide();
  });
  box.querySelector('[data-cookie-close]').addEventListener('click', function () {
    set(sessionStorage, 'closed');
    hide();
  });

  // Показываем с небольшой задержкой, чтобы не отвлекать от первого экрана
  setTimeout(function () {
    box.hidden = false;
    requestAnimationFrame(function () { box.classList.add('is-visible'); });
  }, 1500);
})();
