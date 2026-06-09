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

    var answers = [null, null, null, null, null];
    var fillEl  = document.getElementById('diag-progress-fill');
    var textEl  = document.getElementById('diag-progress-text');
    var resultEl  = document.getElementById('diag-result');
    var scoreNumEl = document.getElementById('diag-score-num');
    var stageEl  = document.getElementById('diag-stage');
    var adviceEl = document.getElementById('diag-advice');

    var stages = [
      { min: 0,  max: 24,  en: 'Still on the starting line',  fr: 'Encore au point de départ' },
      { min: 25, max: 49,  en: 'Early adopter stage',         fr: "Phase d’exploration" },
      { min: 50, max: 74,  en: 'Building momentum',           fr: "La dynamique s’installe" },
      { min: 75, max: 100, en: 'AI-native',                   fr: 'IA-native' }
    ];

    var advice = [
      {
        en: "Your team is at the start of the AI journey. The biggest wins are still ahead — and they’re very achievable. A structured introduction to AI tools, even a half-day session, can move the needle fast.",
        fr: "Votre équipe est au début de l’aventure IA. Les gains les plus importants sont encore devant vous — et ils sont très accessibles. Une introduction structurée aux outils IA, même d’une demi-journée, peut faire bouger les choses rapidement."
      },
      {
        en: "Some people on your team are getting value from AI, but it’s not yet consistent or team-wide. The gap between your early adopters and everyone else is the main thing to close.",
        fr: "Certaines personnes de votre équipe tirent déjà de la valeur de l’IA, mais ce n’est pas encore régulier ni généralisé. L’écart entre vos early adopters et les autres est la principale chose à combler."
      },
      {
        en: "You’re past the starting phase — AI is delivering real value in your team. The next step is making it more consistent, measuring the impact, and spreading what’s working across the whole team.",
        fr: "Vous avez passé la phase de démarrage — l’IA apporte une vraie valeur dans votre équipe. L’étape suivante : la rendre plus régulière, mesurer l’impact et diffuser ce qui fonctionne à toute l’équipe."
      },
      {
        en: "Your team is operating at a genuinely high level with AI. The focus now is resilience — making sure this capability is embedded in your processes, not dependent on a few individuals.",
        fr: "Votre équipe opère à un très bon niveau avec l’IA. Le focus maintenant, c’est la résilience — s’assurer que cette capacité est ancrée dans vos processus, et pas dépendante de quelques individus."
      }
    ];

    function getStageIndex(score) {
      for (var i = 0; i < stages.length; i++) {
        if (score >= stages[i].min && score <= stages[i].max) return i;
      }
      return stages.length - 1;
    }

    function updateProgress() {
      var answered = 0;
      for (var i = 0; i < answers.length; i++) { if (answers[i] !== null) answered++; }
      var pct = Math.round((answered / 5) * 100);
      if (fillEl) fillEl.style.width = pct + '%';
      if (textEl) textEl.textContent = answered + ' / 5';
    }

    function showResult() {
      var total = 0;
      for (var i = 0; i < answers.length; i++) total += answers[i];
      var finalScore = Math.round(total / 5);
      var idx = getStageIndex(finalScore);
      var isFr = document.documentElement.lang === 'fr';

      if (scoreNumEl) scoreNumEl.textContent = finalScore;
      if (stageEl)   stageEl.textContent   = isFr ? stages[idx].fr : stages[idx].en;
      if (adviceEl)  adviceEl.textContent  = isFr ? advice[idx].fr  : advice[idx].en;

      if (resultEl) {
        resultEl.hidden = false;
        setTimeout(function () {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }

    function allAnswered() {
      for (var i = 0; i < answers.length; i++) { if (answers[i] === null) return false; }
      return true;
    }

    widget.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('.diag-opt') : null;
      if (!btn) return;
      var qEl = btn.parentNode;
      while (qEl && !qEl.getAttribute('data-q')) qEl = qEl.parentNode;
      if (!qEl) return;

      var qIdx  = parseInt(qEl.getAttribute('data-q'), 10);
      var score = parseInt(btn.getAttribute('data-score'), 10);

      var opts = qEl.querySelectorAll('.diag-opt');
      for (var i = 0; i < opts.length; i++) opts[i].classList.remove('selected');
      btn.classList.add('selected');
      qEl.classList.add('answered');
      answers[qIdx] = score;

      updateProgress();
      if (allAnswered()) showResult();
    });

    // Re-render result text after language switch
    var langBtn = document.querySelector('.lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        setTimeout(function () {
          if (resultEl && !resultEl.hidden && allAnswered()) showResult();
        }, 50);
      });
    }

    updateProgress();
  }

  function init() { initReveals(); initParallax(); initSectionParallax(); initCharts(); initNav(); initClientsCarousel(); initDiagnostic(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
