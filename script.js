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

  // ---------- A small surprise: clear your brain's cache and cookies ----------
  // Open it with the footer button, or by clicking anywhere three times
  // (each click within 2 seconds of the last). Typing "breathe" or visiting
  // /#breathe works too. The page blurs and a glass card guides three rounds
  // of breathing: in for 4, out for 6. Esc, the close button, or a click
  // outside the card ends it any time.
  var ROUNDS = 3, INTRO = 3400;
  var PHASES = [
    { word: 'Breathe in', ms: 4000, counts: 4 },
    { word: 'Breathe out', ms: 6000, counts: 6 }
  ];
  var CYCLE = PHASES[0].ms + PHASES[1].ms;
  var SQUARE = 'M120 20H192A28 28 0 0 1 220 48V192A28 28 0 0 1 192 220H48A28 28 0 0 1 20 192V48A28 28 0 0 1 48 20Z';
  var SCIENCE = 'Lengthening your exhale activates your parasympathetic nervous system, which slows your heart rate and signals your body to relax. Try this anytime you feel activated.';
  var touch = window.matchMedia('(hover: none)').matches;
  var breath = null, parts = {}, raf = 0, lastNow = 0, elapsed = 0, state = '', lastFocus = null, paused = [];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

  function buildBreath() {
    var wrap = el('div', 'breath');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'A short breathing pause');
    var rounds = '';
    for (var r = 0; r < ROUNDS; r++) rounds += '<li></li>';
    wrap.innerHTML =
      '<div class="breath-glow" aria-hidden="true"></div>' +
      '<button type="button" class="breath-close" aria-label="Close and return to the site"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="breath-panel">' +
        '<p class="breath-title">Have you tried clearing your cache and cookies?</p>' +
        '<div class="breath-stage">' +
          '<svg class="breath-box" viewBox="0 0 240 240" aria-hidden="true">' +
            '<defs>' +
              '<clipPath id="breath-clip"><rect x="46" y="46" width="148" height="148" rx="14"/></clipPath>' +
              '<linearGradient id="breath-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d27f"/><stop offset=".55" stop-color="#e8b9a8"/><stop offset="1" stop-color="#9cb59a"/></linearGradient>' +
            '</defs>' +
            '<rect class="well" x="46" y="46" width="148" height="148" rx="14"/>' +
            '<g clip-path="url(#breath-clip)"><path class="water back"/><path class="water front" fill="url(#breath-water)"/></g>' +
            '<path class="track" d="' + SQUARE + '"/>' +
            '<path class="trail" d="' + SQUARE + '" pathLength="1"/>' +
            '<text class="count" x="120" y="122"></text>' +
            '<circle class="halo" r="14"/><circle class="dot" r="6.5"/>' +
          '</svg>' +
          '<p class="breath-word" aria-live="polite"></p>' +
          '<p class="breath-sub"></p>' +
        '</div>' +
        '<div class="breath-after" hidden>' +
          '<p class="breath-science">' + SCIENCE + '</p>' +
          '<div class="breath-end">' +
            '<button type="button" class="btn breath-return">Back to the site</button>' +
            '<button type="button" class="btn ghost breath-again">Go again</button>' +
          '</div>' +
        '</div>' +
        '<ol class="breath-rounds" aria-hidden="true">' + rounds + '</ol>' +
      '</div>' +
      '<p class="breath-hint">' + (touch ? 'Tap outside the card to return' : 'Press Esc or click outside the card to return') + '</p>';
    document.body.appendChild(wrap);

    parts = {
      track: wrap.querySelector('.track'),
      trail: wrap.querySelector('.trail'),
      dot: wrap.querySelector('.dot'),
      halo: wrap.querySelector('.halo'),
      front: wrap.querySelector('.water.front'),
      back: wrap.querySelector('.water.back'),
      count: wrap.querySelector('.count'),
      word: wrap.querySelector('.breath-word'),
      sub: wrap.querySelector('.breath-sub'),
      rounds: wrap.querySelectorAll('.breath-rounds li'),
      stage: wrap.querySelector('.breath-stage'),
      after: wrap.querySelector('.breath-after'),
      close: wrap.querySelector('.breath-close')
    };
    parts.len = parts.track.getTotalLength();

    parts.close.addEventListener('click', endBreath);
    wrap.querySelector('.breath-return').addEventListener('click', endBreath);
    wrap.querySelector('.breath-again').addEventListener('click', function () { begin(); });
    wrap.addEventListener('click', function (e) { if (!e.target.closest('.breath-panel')) endBreath(); });
    return wrap;
  }

  function swapText(node, text) {
    if (node.textContent === text) return;
    node.textContent = text;
    node.classList.remove('swap'); void node.offsetWidth; node.classList.add('swap');
  }
  function ease(p) { return 0.5 - Math.cos(Math.PI * p) / 2; }
  function waterPath(level, time, amp, shift) {
    var y = 194 - level * 148, d = '';
    for (var x = 40; x <= 200; x += 8) {
      d += (x === 40 ? 'M' : 'L') + x + ' ' + (y + amp * Math.sin(x * 0.045 + time * 0.0016 + shift)).toFixed(2);
    }
    return d + 'L200 200L40 200Z';
  }

  // pos: how far round the square the dot is (0 to 1). fill: how full the square is.
  function draw(pos, fill, now) {
    var pt = parts.track.getPointAtLength(parts.len * Math.min(pos, 0.9999));
    parts.dot.setAttribute('cx', pt.x.toFixed(2)); parts.dot.setAttribute('cy', pt.y.toFixed(2));
    parts.halo.setAttribute('cx', pt.x.toFixed(2)); parts.halo.setAttribute('cy', pt.y.toFixed(2));
    parts.halo.setAttribute('r', (12 + fill * 8).toFixed(2));
    parts.trail.style.strokeDasharray = pos.toFixed(4) + ' 1';
    var amp = reduceMotion ? 0 : 1.2 + 3.2 * Math.sin(Math.PI * fill);
    var level = 0.05 + 0.95 * fill;
    parts.front.setAttribute('d', waterPath(level, now, amp, 0));
    parts.back.setAttribute('d', waterPath(Math.min(1, level + 0.02), now, amp * 0.8, 2.2));
    breath.style.setProperty('--fill', fill.toFixed(3));
  }

  function setRounds(n) { parts.rounds.forEach(function (li, i) { li.className = i < n ? 'done' : (i === n ? 'now' : ''); }); }

  function frame(now) {
    var dt = Math.min(now - lastNow, 100); lastNow = now; elapsed += dt;
    if (elapsed < INTRO) {
      if (state !== 'intro') {
        state = 'intro';
        swapText(parts.word, 'Let’s breathe together');
        swapText(parts.sub, 'In for 4, out for 6. Follow the dot around the square and back.');
        parts.count.textContent = ''; setRounds(0);
      }
      draw(0, 0, now);
    } else {
      var t = elapsed - INTRO, round = Math.floor(t / CYCLE);
      if (round >= ROUNDS) { finish(now); return; }
      var inCycle = t - round * CYCLE;
      var phase = inCycle < PHASES[0].ms ? 0 : 1;
      var p = phase === 0 ? inCycle / PHASES[0].ms : (inCycle - PHASES[0].ms) / PHASES[1].ms;
      var key = round + ':' + phase;
      if (state !== key) {
        state = key;
        swapText(parts.word, PHASES[phase].word);
        if (phase === 0) swapText(parts.sub, round === ROUNDS - 1 ? 'Last round' : 'Round ' + (round + 1) + ' of ' + ROUNDS);
        setRounds(round);
      }
      var count = String(Math.min(PHASES[phase].counts, Math.floor(p * PHASES[phase].counts) + 1));
      if (parts.count.textContent !== count) {
        parts.count.textContent = count;
        parts.count.classList.remove('tick'); void parts.count.getBBox(); parts.count.classList.add('tick');
      }
      var fill = phase === 0 ? ease(p) : 1 - ease(p);
      if (reduceMotion) { fill = phase === 0 ? 1 : 0; draw(fill, fill, now); }
      else draw(phase === 0 ? p : 1 - p, fill, now);
    }
    raf = requestAnimationFrame(frame);
  }

  function finish(now) {
    state = 'done';
    parts.count.textContent = '';
    draw(0, 0, now);
    setRounds(ROUNDS);
    breath.classList.add('done');
    parts.stage.hidden = true;
    parts.after.hidden = false;
    breath.querySelector('.breath-return').focus({ preventScroll: true });
  }

  function begin() {
    cancelAnimationFrame(raf);
    elapsed = 0; state = '';
    breath.classList.remove('done');
    parts.stage.hidden = false; parts.after.hidden = true;
    lastNow = performance.now();
    raf = requestAnimationFrame(frame);
    parts.close.focus({ preventScroll: true });
  }

  function startBreath(x, y) {
    if (breath && breath.classList.contains('show')) return;
    lastFocus = document.activeElement;
    breath = breath || buildBreath();
    breath.style.setProperty('--x', (x == null ? window.innerWidth / 2 : x) + 'px');
    breath.style.setProperty('--y', (y == null ? window.innerHeight / 2 : y) + 'px');
    var gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) document.body.style.paddingRight = gap + 'px';
    document.documentElement.classList.add('breathing');
    document.querySelectorAll('body > header, body > main, body > footer, body > .skip').forEach(function (n) { n.inert = true; });
    paused = [];
    document.querySelectorAll('video').forEach(function (v) { if (!v.paused) { v.pause(); paused.push(v); } });
    try { window.getSelection().removeAllRanges(); } catch (err) {}
    requestAnimationFrame(function () { breath.classList.add('show'); });
    begin();
  }

  function endBreath() {
    cancelAnimationFrame(raf);
    if (!breath) return;
    breath.classList.remove('show');
    document.documentElement.classList.remove('breathing');
    document.body.style.paddingRight = '';
    document.querySelectorAll('body > header, body > main, body > footer, body > .skip').forEach(function (n) { n.inert = false; });
    paused.forEach(function (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); });
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    if (location.hash === '#breathe') { try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {} }
  }

  var cacheBtn = document.querySelector('.cache-btn');
  if (cacheBtn) cacheBtn.addEventListener('click', function () {
    var r = cacheBtn.getBoundingClientRect();
    startBreath(r.left + r.width / 2, r.top + r.height / 2);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && breath && breath.classList.contains('show')) endBreath();
  });

  // Three clicks anywhere. Links, buttons and the video keep working as normal.
  var taps = [];
  function ripple(x, y, n) {
    if (reduceMotion) return;
    var r = el('span', 'ripple r' + n);
    r.style.left = x + 'px'; r.style.top = y + 'px';
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 1100);
  }
  document.addEventListener('click', function (e) {
    if (breath && breath.classList.contains('show')) return;
    if (e.target.closest('a, button, input, textarea, select, label, video, [role="button"]')) { taps = []; return; }
    // Any pace works, as long as each click comes within 2 seconds of the last.
    var now = Date.now();
    if (taps.length && now - taps[taps.length - 1] > 2000) taps = [];
    taps.push(now);
    if (taps.length >= 2) ripple(e.clientX, e.clientY, taps.length);
    if (taps.length >= 3) { taps = []; startBreath(e.clientX, e.clientY); }
  });

  var typed = '', phrase = 'breathe';
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || !e.key || e.key.length !== 1) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    typed = (typed + e.key.toLowerCase()).slice(-phrase.length);
    if (typed === phrase) { typed = ''; startBreath(); }
  });

  if (location.hash === '#breathe') startBreath();
  window.addEventListener('hashchange', function () { if (location.hash === '#breathe') startBreath(); });
})();
