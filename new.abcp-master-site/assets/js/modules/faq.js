(function () {
  'use strict';

  var list = document.querySelector('[data-faq]');
  if (!list) return;

  // Чтобы одновременно могли быть открыты несколько ответов, поставьте false
  var SINGLE_OPEN = true;

  var buttons = Array.prototype.slice.call(list.querySelectorAll('.faq__btn'));

  function setState(btn, open) {
    var item = btn.closest('.faq__item');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    item.classList.toggle('is-open', open);
  }

  function toggle(btn) {
    var willOpen = btn.getAttribute('aria-expanded') !== 'true';
    if (willOpen && SINGLE_OPEN) {
      buttons.forEach(function (b) {
        if (b !== btn) setState(b, false);
      });
    }
    setState(btn, willOpen);
  }

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq__btn');
    if (btn && list.contains(btn)) toggle(btn);
  });

  // Навигация с клавиатуры: стрелки, Home, End
  list.addEventListener('keydown', function (e) {
    var btn = e.target.closest('.faq__btn');
    if (!btn) return;
    var i = buttons.indexOf(btn);
    var next = null;

    if (e.key === 'ArrowDown') next = buttons[(i + 1) % buttons.length];
    else if (e.key === 'ArrowUp') next = buttons[(i - 1 + buttons.length) % buttons.length];
    else if (e.key === 'Home') next = buttons[0];
    else if (e.key === 'End') next = buttons[buttons.length - 1];

    if (next) {
      e.preventDefault();
      next.focus();
    }
  });

  // Открыть вопрос по якорю, например /#faq-q3
  function openFromHash() {
    var id = location.hash.slice(1);
    var target = id && document.getElementById(id);
    if (target && target.classList.contains('faq__btn')) {
      setState(target, true);
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();
