/* Ядро: общий неймспейс ABCP и вспомогательные функции */
(function (w, d) {
  'use strict';
  var A = w.ABCP = w.ABCP || {};
  A.qs = function (s, c) { return (c || d).querySelector(s); };
  A.qsa = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  A.reduced = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  A.finePointer = !!(w.matchMedia && w.matchMedia('(hover: hover) and (pointer: fine)').matches);
  A.raf = function (fn) { var t = false; return function () { if (t) return; t = true; w.requestAnimationFrame(function () { t = false; fn(); }); }; };
  A.ready = function (fn) { d.readyState !== 'loading' ? fn() : d.addEventListener('DOMContentLoaded', fn); };
  A.modules = [];
  A.register = function (name, fn) { A.modules.push([name, fn]); };
})(window, document);
