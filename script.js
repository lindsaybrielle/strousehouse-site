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

  // Local time in London
  var ldn = document.getElementById('ldn');
  if (ldn) {
    var tick = function () {
      try { ldn.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }).format(new Date()); } catch (e) {}
    };
    tick();
    setInterval(tick, 20000);
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Two small surprises ----------
  var toastEl, toastTimer;
  function toast(html) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = html; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 6500);
  }
  var mark = document.querySelector('.mark');
  var clicks = 0, clickTimer;
  if (mark) {
    mark.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      clicks += 1;
      clearTimeout(clickTimer); clickTimer = setTimeout(function () { clicks = 0; }, 1600);
      if (clicks >= 5) {
        clicks = 0;
        if (document.body.classList.toggle('lights-on')) toast('Lights are on. You click things five times to see what happens. So do I. <a href="#contact">Say hello.</a>');
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
