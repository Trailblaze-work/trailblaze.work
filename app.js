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

  function init() { initReveals(); initParallax(); initSectionParallax(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
