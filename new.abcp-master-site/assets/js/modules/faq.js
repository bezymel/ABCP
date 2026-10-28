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

  /* ---------- Микроразметка FAQPage (JSON-LD) ---------- */

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function buildFaqSchema() {
    var entities = [];

    Array.prototype.forEach.call(list.querySelectorAll('.faq__item'), function (item) {
      var btn = item.querySelector('.faq__btn');
      var body = item.querySelector('.faq__a-body');
      if (!btn || !body) return;

      // Текст вопроса берём без декоративной иконки
      var btnClone = btn.cloneNode(true);
      var icon = btnClone.querySelector('.faq__icon');
      if (icon) icon.remove();

      var question = clean(btnClone.textContent);
      var answer = clean(body.textContent);
      if (!question || !answer) return;

      entities.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer }
      });
    });

    if (!entities.length) return;

    var old = document.getElementById('faq-jsonld');
    if (old) old.remove();

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entities
    });
    document.head.appendChild(script);
  }

  buildFaqSchema();
})();
