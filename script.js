(function () {
  var header = document.querySelector('.site-header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Highlight the section you're in
  var navLinks = {};
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    var mid = window.innerHeight * 0.45, active = null;
    Object.keys(navLinks).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < mid) active = id;
    });
    Object.keys(navLinks).forEach(function (id) { navLinks[id].classList.toggle('active', id === active); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  // Work: filters, and "Read more" on stories that are cut short
  var filterButtons = document.querySelectorAll('.filters button');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('#work-list .project').forEach(function (c) {
        c.hidden = want !== 'all' && c.getAttribute('data-cat') !== want;
      });
    });
  });
  document.querySelectorAll('#work-list .project').forEach(function (card) {
    var p = card.querySelector('.body p');
    if (!p) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'more';
    btn.textContent = 'Read more';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      btn.textContent = open ? 'Show less' : 'Read more';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    p.insertAdjacentElement('afterend', btn);
    function check() { btn.hidden = !card.classList.contains('open') && p.scrollHeight <= p.clientHeight + 2; }
    check();
    window.addEventListener('resize', check);
    window.addEventListener('load', check);
  });

  // Speaking tiles: repeat the row once so it loops without a gap
  var track = document.querySelector('.track');
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
      track.appendChild(c);
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- A small surprise: take a breath ----------
  // Click the logo five times, or type "breathe", and a soft flower opens
  // and closes with three slow breaths, then fades away.
  var NS = 'http://www.w3.org/2000/svg';
  var breathEl = null, breathTimers = [], lastFocus = null;

  function buildBreath() {
    var wrap = document.createElement('div');
    wrap.className = 'breath';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'A short breathing pause');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-120 -120 240 240');
    svg.setAttribute('class', 'bloom');
    svg.setAttribute('aria-hidden', 'true');
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'petals');
    for (var i = 0; i < 6; i++) {
      var ang = i * Math.PI / 3;
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (Math.cos(ang) * 38).toFixed(2));
      c.setAttribute('cy', (Math.sin(ang) * 38).toFixed(2));
      c.setAttribute('r', '38');
      c.setAttribute('class', 'petal p' + (i % 3));
      g.appendChild(c);
    }
    var core = document.createElementNS(NS, 'circle');
    core.setAttribute('r', '6');
    core.setAttribute('class', 'core');
    svg.appendChild(g);
    svg.appendChild(core);
    var cue = document.createElement('p');
    cue.className = 'cue';
    cue.setAttribute('aria-live', 'polite');
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'breath-close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    wrap.appendChild(svg);
    wrap.appendChild(cue);
    wrap.appendChild(close);
    close.addEventListener('click', endBreath);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) endBreath(); });
    document.body.appendChild(wrap);
    return wrap;
  }

  function later(fn, ms) { breathTimers.push(setTimeout(fn, ms)); }

  function startBreath() {
    if (breathEl && breathEl.classList.contains('show')) return;
    lastFocus = document.activeElement;
    breathEl = breathEl || buildBreath();
    var cue = breathEl.querySelector('.cue');
    breathTimers.forEach(clearTimeout); breathTimers = [];
    breathEl.classList.remove('inhale', 'exhale', 'still');
    requestAnimationFrame(function () { breathEl.classList.add('show'); });
    breathEl.querySelector('.breath-close').focus({ preventScroll: true });

    if (reduceMotion) {
      breathEl.classList.add('still');
      cue.textContent = 'Take a slow breath in, and a long breath out.';
      later(endBreath, 9000);
      return;
    }
    var IN = 4000, OUT = 6000, t = 900;
    cue.textContent = 'Take a breath with me';
    for (var n = 0; n < 3; n++) {
      later(function () { breathEl.classList.remove('exhale'); breathEl.classList.add('inhale'); cue.textContent = 'Breathe in'; }, t);
      later(function () { breathEl.classList.remove('inhale'); breathEl.classList.add('exhale'); cue.textContent = 'Breathe out'; }, t + IN);
      t += IN + OUT;
    }
    later(function () { breathEl.classList.remove('inhale', 'exhale'); cue.textContent = 'Thank you for pausing.'; }, t);
    later(endBreath, t + 2600);
  }

  function endBreath() {
    breathTimers.forEach(clearTimeout); breathTimers = [];
    if (!breathEl) return;
    breathEl.classList.remove('show', 'inhale', 'exhale');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && breathEl && breathEl.classList.contains('show')) endBreath();
  });

  var mark = document.querySelector('.mark');
  var clicks = 0, clickTimer;
  if (mark) {
    mark.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      clicks += 1;
      clearTimeout(clickTimer); clickTimer = setTimeout(function () { clicks = 0; }, 1600);
      if (clicks >= 5) { clicks = 0; startBreath(); }
    });
  }
  var typed = '', phrase = 'breathe';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || !e.key || e.key.length !== 1) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    typed = (typed + e.key.toLowerCase()).slice(-phrase.length);
    if (typed === phrase) { typed = ''; startBreath(); }
  });
})();
