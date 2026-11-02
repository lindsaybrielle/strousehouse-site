(function () {
  document.documentElement.classList.add('js');
  var header = document.querySelector('.site-header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // "You are here" plans in each room's margin, drawn from the main floor plan's rooms
  var ROOMS = {
    living: [30, 40, 210, 160],
    study: [240, 40, 270, 160],
    kitchen: [30, 200, 170, 140],
    hall: [200, 200, 140, 140],
    library: [340, 200, 170, 140],
    door: [250, 330, 44, 12]
  };
  var NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('.mini-plan').forEach(function (svg) {
    var here = svg.getAttribute('data-room');
    Object.keys(ROOMS).forEach(function (name) {
      if (name === 'door' && here !== 'door') return;
      var r = ROOMS[name];
      var rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', r[0]); rect.setAttribute('y', r[1]);
      rect.setAttribute('width', r[2]); rect.setAttribute('height', r[3]);
      if (name === here) rect.setAttribute('class', 'here');
      svg.appendChild(rect);
    });
    var outer = document.createElementNS(NS, 'rect');
    outer.setAttribute('class', 'outer');
    outer.setAttribute('x', 30); outer.setAttribute('y', 40); outer.setAttribute('width', 480); outer.setAttribute('height', 300);
    svg.appendChild(outer);
  });

  // Red-pen circles drawn around a few results
  var CIRCLE = 'M10 32 C 4 14, 58 4, 118 6 C 178 8, 199 20, 195 34 C 191 50, 112 57, 60 53 C 22 50, 2 41, 16 20';
  document.querySelectorAll('.circled').forEach(function (el) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 60');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'drawable');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', CIRCLE);
    p.setAttribute('pathLength', '1');
    svg.appendChild(p);
    el.appendChild(svg);
  });
  var drawables = document.querySelectorAll('.drawable');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    drawables.forEach(function (d) { io.observe(d); });
  } else {
    drawables.forEach(function (d) { d.classList.add('drawn'); });
  }

  // Highlight the section you're in
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.toggle('active', id === e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  // Land just below the sticky header
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      try { history.replaceState(null, '', '#' + id); } catch (err) {}
    });
  });

  // Work filters
  var filterButtons = document.querySelectorAll('.filters button');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('#work-cards .card').forEach(function (c) {
        c.hidden = want !== 'all' && c.getAttribute('data-cat') !== want;
      });
    });
  });

  // Copy email
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = 'brielle@strousehouse.co';
      function done() { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000); }
      function fallback() {
        var el = document.getElementById('email-text');
        var range = document.createRange(); range.selectNodeContents(el);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        copyBtn.textContent = 'Selected';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Two things that reward curiosity ----------

  var toastEl, toastTimer;
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

  // 1. Knock on the little house five times and the lights come on
  var house = document.querySelector('.house-mark');
  var knocks = 0, knockTimer;
  if (house) {
    house.addEventListener('click', function () {
      knocks += 1;
      house.classList.remove('nudge'); void house.getBoundingClientRect(); house.classList.add('nudge');
      clearTimeout(knockTimer);
      knockTimer = setTimeout(function () { knocks = 0; }, 1600);
      if (knocks >= 5) {
        knocks = 0;
        var on = document.body.classList.toggle('lights-on');
        if (on) toast('Lights are on. You knock five times to see what happens. So do I. <a href="#contact">Come in.</a>');
      }
    });
  }

  // 2. Type "hey google" anywhere
  var typed = '', phrase = 'hey google';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || !e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-phrase.length);
    if (typed === phrase) {
      typed = '';
      toast('Old habits. I spent years teaching people what to say to their phones. Here, <a href="#contact">an email works better</a>.');
    }
  });
})();
