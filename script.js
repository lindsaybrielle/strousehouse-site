(function () {
  var header = document.querySelector('.site-header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header rule once you scroll
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Prepare drawings so their lines can be drawn in
  document.querySelectorAll('.draw .ink, .draw .fill-ink').forEach(function (el) {
    el.setAttribute('pathLength', '1');
  });

  // Fade sections and draw illustrations as they arrive
  var watched = document.querySelectorAll('.reveal, .draw');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    watched.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(function (el) { el.classList.add('in'); });
  }

  // Highlight the room you're in
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var rooms = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.toggle('active', id === e.target.id); });
        var active = links[e.target.id];
        if (active && active.parentNode.scrollWidth > active.parentNode.clientWidth) {
          active.parentNode.scrollTo({ left: active.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    rooms.forEach(function (r) { spy.observe(r); });
  }

  // Jump to a room, landing just below the sticky header
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = id === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
  });

  // Rotating word in the headline
  var rot = document.querySelector('.rotator span');
  var words = ['new technology', 'big change', 'a new program', 'new ideas', 'a new product'];
  var w = 0;
  if (rot) {
    setInterval(function () {
      w = (w + 1) % words.length;
      if (reduceMotion) { rot.textContent = words[w]; return; }
      rot.classList.add('out');
      setTimeout(function () { rot.textContent = words[w]; rot.classList.remove('out'); }, 350);
    }, 2800);
  }

  // Work filters
  var filterButtons = document.querySelectorAll('.filters button');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('#work-cards .card').forEach(function (c) {
        c.classList.toggle('hidden', want !== 'all' && c.getAttribute('data-cat') !== want);
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

  // 1. Click the little house five times and the lights come on, all over the house
  var house = document.querySelector('.house-mark');
  var clicks = 0;
  var clickTimer;
  if (house) {
    house.addEventListener('click', function () {
      clicks += 1;
      house.classList.remove('wiggle');
      void house.getBoundingClientRect();
      house.classList.add('wiggle');
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clicks = 0; }, 1600);
      if (clicks >= 5) {
        clicks = 0;
        var on = document.body.classList.toggle('lights-on');
        if (on) toast('Lights are on at the Strouse House. You click things five times to see what happens. So do I. <a href="#contact">Come say hi.</a>');
      }
    });
  }

  // 2. Type "hey google" anywhere
  var typed = '';
  var phrase = 'hey google';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-phrase.length);
    if (typed === phrase) {
      typed = '';
      toast('Old habits. I spent years teaching people what to say to their phones. For this house, <a href="mailto:brielle@strousehouse.co">an email works better</a>.');
    }
  });
})();
