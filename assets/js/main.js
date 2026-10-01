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

  /* 1-oct-2026 (velocidad): el CSS ya NO oculta nada antes de que llegue este script.
     Antes `.js .rev{opacity:0}` escondía el H1 y la respuesta directa de cada página hasta que
     main.js (diferido) los revelaba con 0,7 s de fundido: el LCP era ~2 s de «retardo de
     renderizado» con el texto ya en el HTML, y si main.js no cargaba, la página quedaba en blanco.
     Ahora solo se esconde, para animarlo al hacer scroll, lo que está FUERA de la pantalla inicial
     (clase .rev-o); lo que se ve al cargar pinta en el primer frame y no se toca. */
  var todos = document.querySelectorAll('.rev');
  if (!('IntersectionObserver' in window) || !todos.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var alto0 = window.innerHeight || 800;
  var revs = [];
  for (var k = 0; k < todos.length; k++) {            // primero se lee todo (un solo cálculo de layout)…
    var r0 = todos[k].getBoundingClientRect();
    if (r0.top >= alto0 || r0.bottom <= 0) revs.push(todos[k]);
  }
  if (!revs.length) return;
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  revs.forEach(function (el, n) {                      // …y después se escribe
    el.classList.add('rev-o');
    el.style.transitionDelay = (Math.min(n % 3, 2) * 70) + 'ms';
    io.observe(el);
  });

  // Red de seguridad: con un salto de scroll muy rápido (o un anclaje) el observador
  // puede no alcanzar a disparar y el bloque se queda en opacity:0, es decir invisible.
  // Nada puede quedar oculto: repasamos a mano lo que ya está en pantalla.
  function repasar() {
    var alto = window.innerHeight || 800;
    for (var i = 0; i < revs.length; i++) {
      var el = revs[i];
      if (el.classList.contains('visible')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < alto && r.bottom > 0) { el.classList.add('visible'); io.unobserve(el); }
    }
  }
  var pend = 0;
  function pedirRepaso() {
    if (pend) return;
    pend = requestAnimationFrame(function () { pend = 0; repasar(); });
  }
  window.addEventListener('scroll', pedirRepaso, { passive: true });
  window.addEventListener('resize', pedirRepaso, { passive: true });
  window.addEventListener('hashchange', pedirRepaso);
  setTimeout(repasar, 1200);
})();
