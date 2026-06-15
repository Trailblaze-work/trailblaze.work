/* ============================================================
   TRAILBLAZE — cookie consent + Amplitude analytics (GDPR)
   Amplitude loads ONLY after the visitor accepts. Declining
   sets no analytics cookies. Choice is stored locally and can
   be changed via window.tbConsent.open().
   Bilingual: banner text follows <html lang>.
   ============================================================ */
(function () {
  'use strict';

  // 👉 Replace with your Amplitude API key (Settings → Projects → API Key).
  //    A browser SDK key is public/embeddable, so it's fine to commit.
  var AMPLITUDE_API_KEY = '1ee57ae4a7080eb6b52ee9224133cee5';

  var STORAGE_KEY = 'tb-consent'; // 'granted' | 'denied'

  var TXT = {
    en: {
      msg: 'We use analytics cookies (Amplitude) to understand how this site is used. Declining sets no analytics cookies.',
      accept: 'Accept', decline: 'Decline', more: 'Privacy policy', href: 'privacy.html',
      aria: 'Cookie consent'
    },
    fr: {
      msg: 'Nous utilisons des cookies de mesure d’audience (Amplitude) pour comprendre l’utilisation du site. En cas de refus, aucun cookie de mesure d’audience n’est déposé.',
      accept: 'Accepter', decline: 'Refuser', more: 'Politique de confidentialité', href: 'privacy.html',
      aria: 'Consentement aux cookies'
    }
  };

  function lang() { return document.documentElement.getAttribute('lang') === 'fr' ? 'fr' : 'en'; }
  function getChoice() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {} }

  function loadAmplitude() {
    if (window.__amplitudeLoaded) return;
    if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return; // not configured yet
    window.__amplitudeLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@amplitude/analytics-browser@2/lib/scripts/amplitude-min.umd.js';
    s.async = true;
    s.onload = function () {
      try { window.amplitude.init(AMPLITUDE_API_KEY, { autocapture: true }); } catch (e) {}
    };
    document.head.appendChild(s);
  }

  function injectStyles() {
    if (document.getElementById('tb-consent-style')) return;
    var css =
      '.tb-consent{position:fixed;left:1rem;bottom:1rem;z-index:70;max-width:420px;width:calc(100% - 2rem);' +
      'background:var(--paper-2,#fff);color:var(--ink,#171717);border:1px solid var(--line,#e5e5e5);' +
      'border-radius:12px;padding:1rem 1.1rem;box-shadow:0 12px 34px -12px rgba(0,0,0,.35);' +
      'font-family:var(--font-ui,system-ui,sans-serif);}' +
      '.tb-consent-msg{margin:0 0 .8rem;font-size:.86rem;line-height:1.5;color:var(--ink-soft,#555);}' +
      '.tb-consent-msg a{color:var(--accent-2,#0055ff);text-decoration:underline;text-underline-offset:2px;}' +
      '.tb-consent-actions{display:flex;gap:.5rem;justify-content:flex-end;}' +
      '.tb-consent button{font-family:inherit;font-size:.82rem;font-weight:600;border-radius:8px;' +
      'padding:.5em .95em;cursor:pointer;border:1px solid transparent;transition:background .15s,color .15s;}' +
      '.tb-consent-decline{background:none;border-color:var(--line,#e5e5e5);color:var(--ink-soft,#555);}' +
      '.tb-consent-decline:hover{color:var(--ink,#171717);}' +
      '.tb-consent-accept{background:var(--ink,#171717);color:var(--paper,#fff);}' +
      '.tb-consent-accept:hover{background:var(--accent-dk,#000);}' +
      '@media (max-width:520px){.tb-consent{left:.5rem;right:.5rem;bottom:.5rem;width:auto;}}';
    var st = document.createElement('style');
    st.id = 'tb-consent-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  var bannerEl = null;
  function hideBanner() { if (bannerEl) { bannerEl.remove(); bannerEl = null; } }

  function showBanner() {
    injectStyles();
    var t = TXT[lang()];
    hideBanner();
    var wrap = document.createElement('div');
    wrap.className = 'tb-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', t.aria);
    wrap.innerHTML =
      '<p class="tb-consent-msg">' + t.msg + ' <a href="' + t.href + '">' + t.more + '</a></p>' +
      '<div class="tb-consent-actions">' +
        '<button type="button" class="tb-consent-decline">' + t.decline + '</button>' +
        '<button type="button" class="tb-consent-accept">' + t.accept + '</button>' +
      '</div>';
    document.body.appendChild(wrap);
    bannerEl = wrap;
    wrap.querySelector('.tb-consent-accept').addEventListener('click', accept);
    wrap.querySelector('.tb-consent-decline').addEventListener('click', decline);
  }

  function accept() { setChoice('granted'); hideBanner(); loadAmplitude(); }
  function decline() { setChoice('denied'); hideBanner(); }

  // Public API: reopen the banner / let users withdraw consent.
  window.tbConsent = {
    open: showBanner,
    accept: accept,
    decline: decline,
    reset: function () { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} showBanner(); }
  };

  function init() {
    var c = getChoice();
    if (c === 'granted') loadAmplitude();
    else if (c === 'denied') { /* respect refusal — load nothing */ }
    else showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
