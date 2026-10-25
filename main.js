(function () {
  var root = document.documentElement;
  root.classList.add('js');
  // Animazioni sempre attive, anche se il sistema chiede di ridurle.
  var reduced = false;

  // Punto delle migliaia anche a 4 cifre (toLocaleString in italiano lo omette: 1246 invece di 1.246)
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  // Count a number up from 0 when it becomes visible
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.classList.contains('reveal')) el.classList.add('in');
      if (el.hasAttribute('data-count')) countUp(el);
      if (el.hasAttribute('data-width')) el.style.width = el.getAttribute('data-width');
      io.unobserve(el);
    });
  }, { threshold: 0.15 }) : null;

  document.querySelectorAll('.reveal, [data-count], [data-width]').forEach(function (el) {
    if (io) { io.observe(el); return; }
    el.classList.add('in');
    if (el.hasAttribute('data-count')) el.textContent = fmt(parseInt(el.getAttribute('data-count'), 10));
    if (el.hasAttribute('data-width')) el.style.width = el.getAttribute('data-width');
  });

  // Hero notification: appears, stays, leaves, comes back
  var toast = document.querySelector('.toast');
  if (toast) {
    if (reduced) {
      toast.classList.add('show');
    } else {
      var cycle = function () {
        toast.classList.remove('hide');
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(function () {
          toast.classList.remove('show');
          toast.classList.add('hide');
        }, 5200);
      };
      setTimeout(cycle, 1300);
      setInterval(cycle, 7500);
    }
  }

  // Follower counter that keeps losing followers (demo)
  var counter = document.querySelector('[data-followers]');
  var delta = document.querySelector('[data-delta]');
  if (counter && !reduced) {
    var value = parseInt(counter.getAttribute('data-followers'), 10);
    var lost = 0;
    setInterval(function () {
      value -= 1;
      lost += 1;
      if (lost > 9) { value += lost; lost = 0; }
      counter.textContent = fmt(value);
      counter.classList.remove('tick');
      void counter.offsetWidth;
      counter.classList.add('tick');
      if (delta) delta.textContent = lost ? '−' + lost + ' oggi · nessuna notifica' : 'nessuna notifica';
    }, 2600);
  }
})();
