/* ============================================================
   TRAILBLAZE — interactions
   (1) scroll reveals  (2) hero parallax  (3) pricing parallax
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    function frame() {
      var top = hero.getBoundingClientRect().top; // ~0 at top, negative once scrolled past
      var scrolled = Math.max(0, -top);           // how far the hero has scrolled up
      var offset = (scrolled * factor);
      if (offset !== last) {
        last = offset;
        bg.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
    function frame() {
      var rect = sec.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var sectionCenter = rect.top + rect.height / 2;
      var offset = -(sectionCenter - vh / 2) * factor;
      if (offset !== last) {
        last = offset;
        bg.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
      var px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
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

  function init() { initReveals(); initParallax(); initSectionParallax(); initCharts(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
