(function () {
  var header = document.querySelector('.site-header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Small-screen versions: a copy of each floor sits above its section
  var art = document.getElementById('house-art');
  if (art) {
    document.querySelectorAll('.floor-crop').forEach(function (svg) {
      var copy = art.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[tabindex]').forEach(function (el) { el.removeAttribute('tabindex'); el.removeAttribute('data-egg'); el.classList.remove('egg'); });
      svg.appendChild(copy);
    });
  }

  // ---------- The house travels with you ----------
  // Center of each floor in the drawing's own units (viewBox 0 0 440 1730)
  var FLOORS = { attic: 170, living: 402, study: 692, library: 984, kitchen: 1276, hall: 1560 };
  var HOUSE_W = 440, HOUSE_H = 1730;
  var scene = document.querySelector('.scene');
  var house = scene && scene.querySelector('.house');
  var sections = Array.prototype.slice.call(document.querySelectorAll('.story > section[data-floor]'));
  var labels = {};
  document.querySelectorAll('.house .floor-label').forEach(function (t) { labels[t.getAttribute('data-floor')] = t; });
  var anchors = [];
  var ticking = false;

  function measure() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    anchors = sections.map(function (s) {
      var top = s.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      return Math.max(0, Math.min(top, maxScroll - 2));
    });
    update();
  }

  function ease(t) { return t * t * (3 - 2 * t); }

  function update() {
    ticking = false;
    if (!house || scene.offsetWidth < 50) return;
    var y = window.scrollY;
    var i = 0;
    while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
    var from = FLOORS[sections[i].getAttribute('data-floor')];
    var center = from;
    if (i < anchors.length - 1) {
      var span = Math.max(1, anchors[i + 1] - anchors[i]);
      var p = (y - anchors[i]) / span;
      var t = ease(Math.min(1, Math.max(0, (p - 0.55) / 0.45)));
      var to = FLOORS[sections[i + 1].getAttribute('data-floor')];
      center = from + (to - from) * t;
    }
    var scale = scene.clientWidth / HOUSE_W;
    var view = scene.clientHeight;
    var ty = view / 2 - center * scale;
    ty = Math.min(0, Math.max(view - HOUSE_H * scale, ty));
    house.style.transform = 'translateY(' + ty.toFixed(1) + 'px)';

    var nearest = null, best = Infinity;
    Object.keys(FLOORS).forEach(function (k) {
      var d = Math.abs(FLOORS[k] - center);
      if (d < best) { best = d; nearest = k; }
    });
    Object.keys(labels).forEach(function (k) { labels[k].classList.toggle('here', k === nearest); });
  }

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  measure();
  onScroll();

  // ---------- Small notes hidden in the drawing ----------
  var tip = scene && scene.querySelector('.egg-tip');
  var hint = scene && scene.querySelector('.scene-hint');
  function showTip(text, x, y) {
    if (!tip) return;
    tip.textContent = text;
    var r = scene.getBoundingClientRect();
    var left = Math.min(Math.max(8, x - r.left - 120), r.width - 248);
    var top = Math.max(8, y - r.top - tip.offsetHeight - 16);
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.classList.add('show');
    if (hint) hint.style.display = 'none';
  }
  function hideTip() { if (tip) tip.classList.remove('show'); }
  document.querySelectorAll('.scene .egg').forEach(function (egg) {
    var text = egg.getAttribute('data-egg');
    egg.setAttribute('role', 'button');
    egg.setAttribute('aria-label', text);
    egg.addEventListener('pointerenter', function (e) { showTip(text, e.clientX, e.clientY); });
    egg.addEventListener('pointermove', function (e) { showTip(text, e.clientX, e.clientY); });
    egg.addEventListener('pointerleave', hideTip);
    egg.addEventListener('focus', function () { var b = egg.getBoundingClientRect(); showTip(text, b.left + b.width / 2, b.top); });
    egg.addEventListener('blur', hideTip);
  });

  // ---------- Navigation ----------
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.toggle('active', id === e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
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
      document.querySelectorAll('#work-list .project').forEach(function (c) {
        c.hidden = want !== 'all' && c.getAttribute('data-cat') !== want;
      });
      measure();
    });
  });

  // Copy email
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      function done() { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000); }
      function fallback() {
        var range = document.createRange(); range.selectNodeContents(document.getElementById('email-text'));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        copyBtn.textContent = 'Selected';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('brielle@strousehouse.co').then(done, fallback);
      } else { fallback(); }
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Two older secrets ----------
  var toastEl, toastTimer;
  function toast(html) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = html; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 6500);
  }
  var mark = document.querySelector('.house-mark');
  var knocks = 0, knockTimer;
  if (mark) {
    mark.addEventListener('click', function () {
      knocks += 1;
      mark.classList.remove('nudge'); void mark.getBoundingClientRect(); mark.classList.add('nudge');
      clearTimeout(knockTimer); knockTimer = setTimeout(function () { knocks = 0; }, 1600);
      if (knocks >= 5) {
        knocks = 0;
        if (document.body.classList.toggle('lights-on')) toast('Lights are on. You knock five times to see what happens. So do I. <a href="#contact">Come in.</a>');
      }
    });
  }
  var typed = '', phrase = 'hey google';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || !e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-phrase.length);
    if (typed === phrase) { typed = ''; toast('Old habits. I spent years teaching people what to say to their phones. Here, <a href="#contact">an email works better</a>.'); }
  });
})();
