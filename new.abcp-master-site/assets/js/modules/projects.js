/* Слайдер проектов: бесшовная карусель (4 / 2 / 1 карточка), плавное перетаскивание с инерцией, стрелки, точки, клавиатура */
(function (w, d) {
  var A = w.ABCP;
  A.register('projects-slider', function () {
    A.qsa('[data-pslider]').forEach(function (root) {
      var track = A.qs('.pslider__track', root),
        orig = A.qsa('.pslider__item', track),
        dots = A.qs('.pslider__dots', root),
        cur = A.qs('[data-current]', root),
        tot = A.qs('[data-total]', root),
        bar = A.qs('.pslider__bar', root);
      if (!track || !orig.length) return;

      var N = orig.length;
      var pos = 0, target = 0, vel = 0;       /* позиция, цель и скорость в px (позиция не ограничена) */
      var unit = 0, setW = 0, step = 0;       /* ширина карточки с зазором, ширина набора, ширина страницы */
      var pages = 1, pageNo = 0, loop = false, lastP = -1;
      var raf = 0, last = 0, drag = null, moved = false, wheelT = 0;
      var SMOOTH = 0.32;                      /* время сглаживания пружины, сек: больше значение, мягче ход */

      /* Viewport: обрезает треки и принимает жесты. Атрибуты доступности переезжают на него */
      var view = d.createElement('div');
      view.className = 'pslider__viewport';
      ['tabindex', 'role', 'aria-label', 'aria-roledescription'].forEach(function (a) {
        if (track.hasAttribute(a)) { view.setAttribute(a, track.getAttribute(a)); track.removeAttribute(a); }
      });
      track.parentNode.insertBefore(view, track);
      view.appendChild(track);

      function mod(a, b) { return ((a % b) + b) % b; }
      function pad(n) { return n < 10 ? '0' + n : '' + n; }
      function pv() { return parseInt(w.getComputedStyle(root).getPropertyValue('--pv'), 10) || 1; }

      /* Позиция страницы n в бесконечной ленте. Работает и когда N не делится на число карточек на странице */
      function posOfPage(n) { return Math.floor(n / pages) * setW + mod(n, pages) * step; }
      function nearestPage(x) {
        if (!loop) return 0;
        var c = Math.floor(x / setW), best = c * pages, bd = Infinity;
        for (var n = c * pages - 1; n <= (c + 2) * pages; n++) {
          var dd = Math.abs(posOfPage(n) - x);
          if (dd < bd) { bd = dd; best = n; }
        }
        return best;
      }

      function ui() {
        var p = loop ? mod(nearestPage(pos), pages) : 0;
        if (p === lastP) return;
        lastP = p;
        if (cur) cur.textContent = pad(p + 1);
        A.qsa('.pslider__dot', dots).forEach(function (b, i) {
          b.classList.toggle('is-active', i === p);
          b.setAttribute('aria-current', i === p ? 'true' : 'false');
        });
      }

      function render() {
        /* показываем средний набор, клоны слева и справа делают шов невидимым */
        var x = loop ? setW + mod(pos, setW) : 0;
        track.style.transform = 'translate3d(' + (-x).toFixed(2) + 'px,0,0)';
        ui();
      }

      /* Нормализация: убираем накопленные целые циклы, визуально ничего не меняется */
      function normalize() {
        if (!loop) return;
        var k = Math.floor(pageNo / pages);
        if (!k) return;
        pageNo -= k * pages; pos -= k * setW; target -= k * setW;
      }

      /* Критически демпфированная пружина: сохраняет скорость руки, без рывков на старте и финише */
      function tick(now) {
        var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
        var o = 2 / SMOOTH, x = o * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        var ch = pos - target, tmp = (vel + o * ch) * dt;
        vel = (vel - o * tmp) * e;
        pos = target + (ch + tmp) * e;
        if (Math.abs(pos - target) < 0.3 && Math.abs(vel) < 8) {
          pos = target; vel = 0; raf = 0; normalize(); render(); return;
        }
        render();
        raf = requestAnimationFrame(tick);
      }
      function run() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
      function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

      function goTo(n) {
        pageNo = n; target = posOfPage(n);
        if (A.reduced) { stop(); pos = target; vel = 0; normalize(); render(); } else run();
      }

      function clone(el) {
        var c = el.cloneNode(true);
        c.classList.add('is-clone');
        c.setAttribute('aria-hidden', 'true');
        A.qsa('a,button,[tabindex]', c).forEach(function (x) { x.setAttribute('tabindex', '-1'); });
        A.qsa('[id]', c).forEach(function (x) { x.removeAttribute('id'); });
        return c;
      }

      function build() {
        A.qsa('.is-clone', track).forEach(function (c) { c.parentNode.removeChild(c); });
        if (!loop) return;
        var before = d.createDocumentFragment(), after = d.createDocumentFragment();
        orig.forEach(function (el) { before.appendChild(clone(el)); after.appendChild(clone(el)); });
        track.insertBefore(before, orig[0]);
        track.appendChild(after);
      }

      function measure() {
        var frac = unit ? pos / unit : 0;      /* запоминаем положение в карточках, чтобы не прыгать при ресайзе */
        var n = pv();
        loop = N > n;
        build();
        var gap = parseFloat(w.getComputedStyle(track).columnGap) || 0;
        unit = N > 1
          ? orig[1].getBoundingClientRect().left - orig[0].getBoundingClientRect().left
          : orig[0].getBoundingClientRect().width + gap;
        setW = unit * N; step = unit * n;
        pages = loop ? Math.ceil(N / n) : 1;
        stop(); vel = 0;
        pos = frac * unit;
        if (loop) { pageNo = nearestPage(pos); pos = target = posOfPage(pageNo); }
        else { pageNo = 0; pos = target = 0; }

        dots.innerHTML = '';
        for (var i = 0; i < pages; i++) (function (i) {
          var b = d.createElement('button');
          b.type = 'button'; b.className = 'pslider__dot';
          b.setAttribute('aria-label', 'Страница ' + (i + 1));
          b.addEventListener('click', function () {
            /* едем по кратчайшему пути, через границу цикла тоже */
            var delta = i - mod(pageNo, pages);
            if (Math.abs(delta) > pages / 2) delta -= (delta > 0 ? 1 : -1) * pages;
            goTo(pageNo + delta);
          });
          dots.appendChild(b);
        })(i);
        if (tot) tot.textContent = pad(pages);
        if (bar) bar.style.display = loop ? '' : 'none';
        lastP = -1;
        render();
      }

      A.qs('[data-prev]', root).addEventListener('click', function () { if (loop) goTo(pageNo - 1); });
      A.qs('[data-next]', root).addEventListener('click', function () { if (loop) goTo(pageNo + 1); });
      view.addEventListener('keydown', function (e) {
        if (!loop) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(pageNo + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(pageNo - 1); }
      });

      /* Перетаскивание: мышь, палец, стилус. Захват начинается после сдвига на 6px, чтобы клик по карточке работал */
      view.addEventListener('pointerdown', function (e) {
        if (!loop || (e.pointerType === 'mouse' && e.button !== 0)) return;
        stop(); vel = 0;
        drag = { id: e.pointerId, x: e.clientX, start: pos, active: false, page: pageNo, s: [{ t: e.timeStamp, x: pos }] };
        moved = false;
      });
      view.addEventListener('pointermove', function (e) {
        if (!drag || e.pointerId !== drag.id) return;
        var dx = e.clientX - drag.x;
        if (!drag.active) {
          if (Math.abs(dx) < 6) return;
          drag.active = true; moved = true;
          drag.x = e.clientX; drag.start = pos; dx = 0;   /* без скачка в момент захвата */
          view.classList.add('is-dragging');
          try { view.setPointerCapture(drag.id); } catch (x) {}
        }
        pos = drag.start - dx;
        drag.s.push({ t: e.timeStamp, x: pos });
        while (drag.s.length > 2 && e.timeStamp - drag.s[0].t > 100) drag.s.shift();
        render();
      });
      function up(e) {
        if (!drag || (e && e.pointerId !== drag.id)) return;
        var dr = drag; drag = null;
        view.classList.remove('is-dragging');
        if (!dr.active) { goTo(pageNo); return; }        /* это был клик: возобновляем остановленную анимацию */
        var s = dr.s, v = 0, a = s[0], b = s[s.length - 1];
        if (s.length > 1 && b.t > a.t && (!e || e.timeStamp - b.t < 80)) v = (b.x - a.x) / ((b.t - a.t) / 1000);
        vel = v;
        var n = nearestPage(pos + v * 0.18);               /* куда долетим по инерции */
        n = Math.max(dr.page - 1, Math.min(dr.page + 1, n)); /* максимум на страницу за жест */
        if (n === dr.page) {                               /* медленное, но заметное смещение тоже листает */
          var dl = pos - posOfPage(dr.page);
          if (Math.abs(dl) > step * 0.12) n = dr.page + (dl > 0 ? 1 : -1);
        }
        goTo(n);
      }
      view.addEventListener('pointerup', up);
      view.addEventListener('pointercancel', up);

      /* Горизонтальное колесо и трекпад: двигаем вслед за пальцами, потом мягко довозим до страницы */
      view.addEventListener('wheel', function (e) {
        if (!loop || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        stop(); vel = 0;
        pos += e.deltaX; render();
        clearTimeout(wheelT);
        wheelT = setTimeout(function () { goTo(nearestPage(pos)); }, 140);
      }, { passive: false });

      /* Гасим клик после перетаскивания, чтобы не открывалась ссылка карточки */
      view.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
      }, true);
      view.addEventListener('dragstart', function (e) { e.preventDefault(); });

      var tm; w.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(measure, 150); });
      measure(); w.addEventListener('load', measure);
    });
  });
})(window, document);