/* Форма заявки: маска телефона, проверка полей, отправка.
   Если у <form> задан data-endpoint — отправляет POST на ваш обработчик,
   иначе открывает письмо на data-mailto. */
(function (w, d) {
  var A = w.ABCP;
  A.register('form', function () {
    var f = A.qs('#contact-form'); if (!f) return;
    var st = A.qs('.form__status', f), ph = f.elements.phone;
    function msg(t, ok) { st.textContent = t; st.className = 'form__status ' + (ok ? 'is-ok' : 'is-err'); }
    function mark(el, bad) { var p = el.closest('.field,.check'); if (p) p.classList.toggle('is-invalid', !!bad); }
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
    A.qsa('input,textarea', f).forEach(function (el) { el.addEventListener('input', function () { mark(el, false); }); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.elements.company_hp.value) return;
      var n = f.elements.name, em = f.elements.email, c = f.elements.consent, bad = false;
      [[n, n.value.trim().length < 2], [em, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())],
       [ph, ph.value && ph.value.replace(/\D/g, '').length < 11], [c, !c.checked]].forEach(function (x) { mark(x[0], x[1]); if (x[1]) bad = true; });
      if (bad) { msg('Проверьте выделенные поля.', false); return; }
      var data = new FormData(f), endpoint = f.dataset.endpoint;
      if (endpoint) {
        msg('Отправляю…', true);
        fetch(endpoint, { method: 'POST', body: data }).then(function (r) {
          if (!r.ok) throw new Error('bad');
          msg('Спасибо! Заявка отправлена, отвечу в течение одного рабочего часа.', true); f.reset();
        }).catch(function () { msg('Не удалось отправить. Позвоните или напишите на почту.', false); });
        return;
      }
      var lines = ['Имя: ' + n.value, 'Email: ' + em.value, 'Телефон: ' + ph.value, 'Способ связи: ' + (data.get('contact_method') || '—'),
        'Сайт: ' + (data.get('site') || '—'), '', 'Задача:', data.get('message') || '—'];
      w.location.href = 'mailto:' + (f.dataset.mailto || '') + '?subject=' + encodeURIComponent('Заявка с сайта ABCP-мастер') + '&body=' + encodeURIComponent(lines.join('\n'));
      msg('Спасибо! Отправьте подготовленное письмо в почтовом клиенте.', true);
    });
  });
})(window, document);
