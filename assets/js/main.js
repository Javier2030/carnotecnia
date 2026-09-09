/* Carnotecnia — 1 KB: menú, reveal y año. Nada más entra aquí. */
(function () {
  'use strict';

  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('abierto');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var revs = document.querySelectorAll('.rev');
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < revs.length; i++) revs[i].classList.add('visible');
    return;
  }
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  revs.forEach(function (el, n) {
    el.style.transitionDelay = (Math.min(n % 3, 2) * 70) + 'ms';
    io.observe(el);
  });
})();
