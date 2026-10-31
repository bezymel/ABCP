/* Форма заявки: маска телефона, проверка полей, отправка.
   Если у <form> задан data-endpoint — отправляет POST на ваш обработчик,
   иначе открывает письмо на адрес из data-mailto (указывать БЕЗ "mailto:"). */
(function (w, d) {
  var A = w.ABCP;
  A.register('form', function () {
    var f = A.qs('#contact-form'); if (!f) return;
    var st = A.qs('.form__status', f), ph = f.elements.phone;

    function msg(t, ok) { st.textContent = t; st.className = 'form__status ' + (ok ? 'is-ok' : 'is-err'); }
    function mark(el, bad) {
      var p = el.closest('.field,.check,.fieldset');
      if (p) p.classList.toggle('is-invalid', !!bad);
    }
    function methods() {
      return A.qsa('input[name="method"]:checked', f).map(function (i) { return i.value; });
    }

    // Маска телефона
    ph.addEventListener('input', function () {
      var s = ph.value.replace(/\D/g, '');
      if (s[0] === '8') s = '7' + s.slice(1);
      if (s && s[0] !== '7') s = '7' + s;
      s = s.slice(0, 11);
      var o = '';
      if (s) {
        o = '+7';
        if (s.length > 1) o += ' (' + s.slice(1, 4);
        if (s.length >= 4) o += ')';
        if (s.length > 4) o += ' ' + s.slice(4, 7);
        if (s.length > 7) o += '-' + s.slice(7, 9);
        if (s.length > 9) o += '-' + s.slice(9, 11);
      }
      ph.value = o;
    });

    // Снимаем подсветку ошибки при вводе/выборе
    A.qsa('input,textarea', f).forEach(function (el) {
      el.addEventListener('input', function () { mark(el, false); });
      el.addEventListener('change', function () { mark(el, false); });
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.elements.company_hp.value) return; // защита от ботов

      var n = f.elements.name, em = f.elements.email, c = f.elements.consent;
      var task = f.elements.task, site = f.elements.site;
      var chosen = methods();
      var methodField = A.qs('.fieldset', f);
      var bad = false;

      [
        [n, n.value.trim().length < 2],
        [em, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())],
        [ph, ph.value && ph.value.replace(/\D/g, '').length < 11],
        [c, !c.checked]
      ].forEach(function (x) { mark(x[0], x[1]); if (x[1]) bad = true; });

      // Нужно выбрать хотя бы один способ связи
      if (!chosen.length) { mark(methodField, true); bad = true; } else { mark(methodField, false); }

      if (bad) { msg('Проверьте выделенные поля.', false); return; }

      var methodText = chosen.join(', ');
      var siteText = site.value.trim();
      var taskText = task.value.trim();

      var endpoint = f.dataset.endpoint;
      if (endpoint) {
        var data = new FormData(f);
        data.delete('method');
        data.set('method', methodText); // все выбранные способы одной строкой
        msg('Отправляю…', true);
        fetch(endpoint, { method: 'POST', body: data }).then(function (r) {
          if (!r.ok) throw new Error('bad');
          msg('Спасибо! Заявка отправлена, отвечу в течение одного рабочего часа.', true);
          f.reset();
        }).catch(function () {
          msg('Не удалось отправить. Позвоните или напишите на почту.', false);
        });
        return;
      }

      var lines = [
        'Имя: ' + n.value.trim(),
        'Email: ' + em.value.trim(),
        'Телефон: ' + (ph.value || '—'),
        'Удобный способ связи: ' + methodText,
        'Сайт: ' + (siteText || '—'),
        '',
        'Описание задачи:',
        taskText || '—'
      ];

      // Убираем возможный префикс "mailto:", чтобы не получилось двойного
      var to = (f.dataset.mailto || '').replace(/^mailto:/i, '').trim();
      w.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent('Заявка с сайта ABCP-мастер') +
        '&body=' + encodeURIComponent(lines.join('\r\n'));
      msg('Спасибо! Отправьте подготовленное письмо в почтовом клиенте.', true);
    });
  });
})(window, document);
