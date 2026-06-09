/* ============================================================
   TRAILBLAZE — interactions
   (1) scroll reveals  (2) hero parallax  (3) pricing parallax
   ============================================================ */
(function () {
  'use strict';
  var motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionMql.matches;

  // Callbacks that stop running parallax rAF loops; invoked when reduced
  // motion turns on at runtime.
  var parallaxStops = [];

  /* ---------- 1. Scroll reveals ---------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });

    // Safety net: never let content stay hidden. If an element is still not
    // revealed a few seconds after load, snap it visible without transition
    // (avoids the stuck-transition that can occur on never-painted nodes).
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains('in')) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.2) { el.classList.add('instant', 'in'); }
        }
      });
    }, 2600);
  }

  /* ---------- 2. Hero parallax ----------
     Driven by the hero's bounding-rect (not window.scrollY) so it works
     whether the window scrolls or an ancestor container does. */
  function initParallax() {
    var bg = document.querySelector('.hero-bg');
    var hero = document.querySelector('.hero');
    if (!bg || !hero || reduceMotion) return;
    var factor = 0.32;
    var last = null;
    var rafId = null;
    var running = false;
    function frame() {
      var top = hero.getBoundingClientRect().top; // ~0 at top, negative once scrolled past
      var scrolled = Math.max(0, -top);           // how far the hero has scrolled up
      var offset = (scrolled * factor);
      if (offset !== last) {
        last = offset;
        bg.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
      rafId = requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }
    parallaxStops.push(stop);

    // Only run the loop while the hero is on screen. Without
    // IntersectionObserver, fall back to the always-on loop.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { start(); } else { stop(); }
        });
      });
      io.observe(hero);
    } else {
      start();
    }
  }

  /* ---------- 3. Section parallax (pricing) ----------
     Same transform technique as the hero, but two-directional so the
     background drifts gently while the section is anywhere on screen. */
  function initSectionParallax() {
    var bg = document.querySelector('#pricing .price-bg');
    var sec = document.getElementById('pricing');
    if (!bg || !sec || reduceMotion) return;
    var factor = 0.12;
    var last = null;
    var rafId = null;
    var running = false;
    function frame() {
      var rect = sec.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var sectionCenter = rect.top + rect.height / 2;
      var offset = -(sectionCenter - vh / 2) * factor;
      if (offset !== last) {
        last = offset;
        bg.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
      rafId = requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }
    parallaxStops.push(stop);

    // Only run the loop while the pricing section is on screen. Without
    // IntersectionObserver, fall back to the always-on loop.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { start(); } else { stop(); }
        });
      });
      io.observe(sec);
    } else {
      start();
    }
  }

  /* ---------- 1d. Case-study charts (animate-in + chart 1 hover) ---------- */
  function initCharts() {
    // entrance animation: add .chart-animated when card scrolls in
    var cards = Array.prototype.slice.call(document.querySelectorAll('.chart-card'));
    if (cards.length) {
      if (reduceMotion || !('IntersectionObserver' in window)) {
        cards.forEach(function (c) { c.classList.add('chart-animated'); });
      } else {
        var cio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('chart-animated'); cio.unobserve(e.target); }
          });
        }, { threshold: 0.25 });
        cards.forEach(function (c) { cio.observe(c); });
      }
    }

    // chart 1 hover tooltip
    var zone = document.getElementById('chart1-hover-zone');
    var line = document.getElementById('chart1-hover-line');
    var dot = document.getElementById('chart1-hover-dot');
    var tip = document.getElementById('chart1-tooltip');
    var tipVal = document.getElementById('chart1-tooltip-value');
    var container = document.getElementById('chart1-container');
    if (!zone || !line || !dot || !tip || !container) return;

    // {x,y in 0-800/0-280 viewBox, val} — from the brief's data table
    var pts = [
      { x: 50, y: 228, val: '0' }, { x: 98, y: 225, val: '6k' }, { x: 146, y: 222, val: '12k' },
      { x: 194, y: 219, val: '18k' }, { x: 242, y: 216, val: '24k' }, { x: 290, y: 213, val: '30k' },
      { x: 338, y: 209, val: '36k' }, { x: 386, y: 205, val: '42k' }, { x: 415, y: 203, val: '48k' },
      { x: 434, y: 190, val: '65k' }, { x: 482, y: 172, val: '100k' }, { x: 530, y: 152, val: '145k' },
      { x: 578, y: 130, val: '200k' }, { x: 626, y: 105, val: '260k' }, { x: 674, y: 76, val: '320k' },
      { x: 722, y: 44, val: '380k' }, { x: 770, y: 10, val: '430k' }
    ];
    var VBW = 800, VBH = 280;

    function move(ev) {
      var rect = container.getBoundingClientRect();
      var hasTouch = ev.touches && ev.touches.length;
      var clientX = hasTouch ? ev.touches[0].clientX : ev.clientX;
      if (clientX == null) return;
      var px = clientX - rect.left;
      var vx = px / rect.width * VBW;
      var nearest = pts[0], best = Infinity;
      for (var i = 0; i < pts.length; i++) {
        var d = Math.abs(pts[i].x - vx);
        if (d < best) { best = d; nearest = pts[i]; }
      }
      line.setAttribute('x1', nearest.x); line.setAttribute('x2', nearest.x);
      line.style.opacity = '1';
      dot.setAttribute('cx', nearest.x); dot.setAttribute('cy', nearest.y);
      dot.style.opacity = '1';
      tipVal.textContent = nearest.val;
      tip.classList.add('visible');
      tip.style.left = (nearest.x / VBW * rect.width) + 'px';
      tip.style.top = (nearest.y / VBH * rect.height - 44) + 'px';
    }
    function leave() {
      line.style.opacity = '0'; dot.style.opacity = '0'; tip.classList.remove('visible');
    }
    zone.addEventListener('mousemove', move);
    zone.addEventListener('mouseleave', leave);
    zone.addEventListener('touchmove', move, { passive: true });
    zone.addEventListener('touchend', leave);
  }

  /* ---------- 4. Mobile nav toggle ---------- */
  function initNav() {
    var btn = document.querySelector('.nav-toggle');
    var header = btn && btn.closest('header.nav');
    if (!btn || !header) return;
    var nav = document.getElementById('primary-nav');

    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      header.classList.toggle('nav-open', open);
    }
    function isOpen() { return btn.getAttribute('aria-expanded') === 'true'; }

    btn.addEventListener('click', function () { setOpen(!isOpen()); });

    // Close when a nav link is clicked.
    if (nav) {
      nav.addEventListener('click', function (ev) {
        if (ev.target.closest('a')) { setOpen(false); }
      });
    }

    // Close on Escape.
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && isOpen()) { setOpen(false); }
    });

    // Close on outside click while open.
    document.addEventListener('click', function (ev) {
      if (isOpen() && !header.contains(ev.target)) { setOpen(false); }
    });
  }

  /* ---------- 5. Trusted-by carousel (Splide) ---------- */
  function initClientsCarousel() {
    var el = document.querySelector('.clients-carousel');
    if (!el || typeof Splide === 'undefined') return;
    new Splide(el, {
      perPage: 3,
      perMove: 1,
      gap: '1.5rem',
      padding: { right: '3.2rem' }, // peek of the next card → reads as a carousel
      arrows: true,
      pagination: true,
      drag: true,
      snap: true,
      speed: reduceMotion ? 0 : 450,
      mediaQuery: 'max-width',
      breakpoints: {
        980: { perPage: 2, padding: { right: '2.6rem' } },
        640: { perPage: 1, padding: { right: '3.4rem' }, gap: '0.9rem' }
      }
    }).mount();
  }

  // React to reduced-motion turning on at runtime: stop the parallax loops.
  function onMotionChange(ev) {
    reduceMotion = ev.matches;
    if (reduceMotion) {
      parallaxStops.forEach(function (stop) { stop(); });
    }
  }
  if (motionMql.addEventListener) motionMql.addEventListener('change', onMotionChange);
  else if (motionMql.addListener) motionMql.addListener(onMotionChange);

  /* ---------- 6. AI Readiness Diagnostic ---------- */
  function initDiagnostic() {
    var widget = document.getElementById('diag-widget');
    if (!widget) return;
    var NUM_Q = 5;
    var answers = new Array(NUM_Q).fill(null);
    var resultEl  = document.getElementById('diag-result');
    var scoreEl   = document.getElementById('diag-score-num');
    var stageEl   = document.getElementById('diag-stage');
    var adviceEl  = document.getElementById('diag-advice');
    var fillEl    = document.getElementById('diag-progress-fill');
    var textEl    = document.getElementById('diag-progress-text');
    var stages = {
      en: [
        { max: 24,  name: 'Still on the starting line',  advice: 'AI hasn\'t really landed yet for your team. The first move: pick one workflow and run a 30-minute session with the team to try it together.' },
        { max: 49,  name: 'Early adopter stage',         advice: 'Your team has the tools but hasn\'t built habits around them yet. The biggest quick win: pair your strongest AI user with 2 teammates for a week.' },
        { max: 74,  name: 'Building momentum',           advice: 'A real foundation is there. The gap now is spreading what\'s working to everyone and locking in the habits — exactly where external coaching unlocks the next jump.' },
        { max: 100, name: 'AI-native',                   advice: 'You\'re ahead of most teams. The next level is systematic measurement and custom tooling that compounds what you\'ve already built.' }
      ],
      fr: [
        { max: 24,  name: 'Encore à la ligne de départ',    advice: 'L\'IA n\'a pas encore vraiment atterri pour votre équipe. Premier geste : choisissez un workflow et organisez une session de 30 min avec l\'équipe pour l\'essayer ensemble.' },
        { max: 49,  name: 'Stade early adopter',             advice: 'Votre équipe a les outils mais n\'a pas encore construit d\'habitudes autour. Le gain rapide le plus efficace : associez votre meilleur utilisateur IA à 2 coéquipiers pendant une semaine.' },
        { max: 74,  name: 'En train de prendre de l\'élan',  advice: 'Une vraie base est là. L\'enjeu maintenant est de diffuser ce qui fonctionne à toute l\'équipe et d\'ancrer les habitudes — c\'est exactement là qu\'un accompagnement externe débloque le saut suivant.' },
        { max: 100, name: 'IA-native',                       advice: 'Vous avez de l\'avance sur la plupart des équipes. Le niveau suivant, c\'est la mesure systématique et des outils sur mesure qui font croître ce que vous avez déjà construit.' }
      ]
    };
    function getLang() { return document.documentElement.getAttribute('lang') || 'en'; }
    function getStage(score) {
      var list = stages[getLang()] || stages.en;
      for (var i = 0; i < list.length; i++) { if (score <= list[i].max) return list[i]; }
      return list[list.length - 1];
    }
    function countAnswered() {
      var n = 0; for (var i = 0; i < NUM_Q; i++) { if (answers[i] !== null) n++; } return n;
    }
    function updateProgress() {
      var n = countAnswered();
      if (fillEl) fillEl.style.width = (n / NUM_Q * 100) + '%';
      if (textEl) textEl.textContent = n + ' / ' + NUM_Q;
    }
    function showResult() {
      var total = 0;
      for (var i = 0; i < NUM_Q; i++) { total += answers[i]; }
      var score = Math.round(total / NUM_Q);
      var stage = getStage(score);
      if (scoreEl) scoreEl.textContent = score;
      if (stageEl) stageEl.textContent = stage.name;
      if (adviceEl) adviceEl.textContent = stage.advice;
      if (resultEl) {
        resultEl.hidden = false;
        setTimeout(function () { resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
      }
    }
    var qEls = Array.prototype.slice.call(widget.querySelectorAll('.diag-q'));
    qEls.forEach(function (qEl, qi) {
      var opts = Array.prototype.slice.call(qEl.querySelectorAll('.diag-opt'));
      opts.forEach(function (btn) {
        btn.addEventListener('click', function () {
          answers[qi] = parseInt(btn.getAttribute('data-score'), 10);
          opts.forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          qEl.classList.add('answered');
          updateProgress();
          if (countAnswered() === NUM_Q) { showResult(); }
          else if (resultEl && !resultEl.hidden) { showResult(); }
        });
      });
    });
    var toggleBtn = document.querySelector('.lang-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        if (resultEl && !resultEl.hidden) { setTimeout(showResult, 0); }
      });
    }
    updateProgress();
  }

  function init() { initReveals(); initParallax(); initSectionParallax(); initCharts(); initNav(); initClientsCarousel(); initDiagnostic(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
