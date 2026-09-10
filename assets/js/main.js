/* Carnotecnia — menú, reveal y el formulario de consulta. Nada más entra aquí. */
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

  /* El sitio es estático: no hay servidor que reciba el POST. El formulario arma
     un mailto con todo ordenado, y así el cliente conserva copia de lo que envió. */
  var form = document.getElementById('formConsulta');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var v = function (k) { return (d.get(k) || '').toString().trim(); };
      var asunto = v('tema') || document.title.split(':')[0];
      var cuerpo = [
        v('nombre') ? v('nombre') : '',
        v('pais') ? v('pais') : '',
        v('correo') ? v('correo') : '',
        '',
        v('mensaje'),
        '',
        '— ' + location.href
      ].filter(function (x, i) { return x !== '' || i > 2; }).join('\n');
      window.location.href = 'mailto:' + form.dataset.correo +
        '?subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(cuerpo);
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
