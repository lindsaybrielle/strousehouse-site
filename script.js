(function () {
  var header = document.querySelector('.site-header');

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Header rule once you scroll
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade sections in as they arrive
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Work page filters
  var filterButtons = document.querySelectorAll('.filters button');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('.group').forEach(function (g) {
        g.hidden = want !== 'all' && g.getAttribute('data-group') !== want;
      });
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Easter eggs ----------

  var toastEl;
  var toastTimer;
  function toast(html) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = html;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 6500);
  }

  // 1. Click the little house five times and the lights come on
  var house = document.querySelector('.house');
  var clicks = 0;
  var clickTimer;
  if (house) {
    house.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      clicks += 1;
      house.classList.remove('wiggle');
      void house.getBoundingClientRect();
      house.classList.add('wiggle');
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clicks = 0; }, 1600);
      if (clicks >= 5) {
        clicks = 0;
        house.classList.toggle('lit');
        if (house.classList.contains('lit')) {
          toast('Lights are on at the Strouse House. You click things five times to see what happens. So do I. <a href="contact.html">Come say hi.</a>');
        }
      }
    });
  }

  // 2. Type "hey google" anywhere on the page
  var typed = '';
  var phrase = 'hey google';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-phrase.length);
    if (typed === phrase) {
      typed = '';
      toast('Old habits. I spent years teaching people what to say to their phones. For this one, <a href="mailto:brielle@strousehouse.co">an email works better</a>.');
    }
  });
})();
