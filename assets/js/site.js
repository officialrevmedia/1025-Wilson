/* The Wilson Centre: site script
   Edit the SETTINGS block only. Everything else reads from it. */
(function () {
  'use strict';

  var SETTINGS = {
    // Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ9'. Leave empty to disable analytics.
    GA_ID: '',

    // Google Tag Manager containers (site tag, Google Ads). Load only after the visitor allows Marketing.
    GTM_IDS: ['GTM-P9QMC7WJ', 'GTM-5XNGHMRT'],

    // Meta Pixel ID. Loads only after the visitor allows Marketing.
    META_PIXEL_ID: '1601744497840545',

    // LinkedIn Insight Tag partner ID. Loads only after the visitor allows Marketing.
    // Google Ads account and the "Wilson Centre - Registration" conversion. Load only after Marketing is allowed.
    GOOGLE_ADS_ID: 'AW-18565483346',
    GOOGLE_ADS_CONVERSION: 'AW-18565483346/kXvuCM2jlbUdENKW25RF',

    LINKEDIN_PARTNER_ID: '9396482',
    LINKEDIN_CONVERSION_ID: 32036778,   // fires once, on a real form submit

    // Registrations are emailed to the sales inbox through FormSubmit (formsubmit.co).
    // The FIRST submission sends an "Activate Form" email to this inbox. Click it once and every
    // registration after that is delivered. After activating, you can swap the address in this URL
    // for the random alias FormSubmit gives you.
    FORM_ENDPOINT: 'https://formsubmit.co/ajax/sales@elitedevelopments.com',

    SALES_EMAIL: 'sales@elitedevelopments.com',
    SALES_PHONE: '1.844.484.4184',
    THANK_YOU: '/thank-you/',
    CONSENT_VERSION: 'wc-2026-10',
    COOKIE_DAYS: 90
  };

  var doc = document;

  /* ---------- privacy choices ----------
     Analytics (Google Analytics 4) and Marketing (ActiveCampaign site tracking) stay OFF until the
     visitor chooses. Nothing loads, and no cookie is set by either service, before that.
     The choice is stored in this browser and can be changed any time from "Cookie settings" in the footer. */
  var CONSENT_KEY = 'wc_consent_v2';
  var AC_ACCOUNT = '802575841';
  var AC_SCRIPT = 'https://diffuser-cdn.app-us1.com/diffuser/diffuser.js';

  function readConsent() {
    try {
      var v = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      return v && typeof v === 'object' ? v : null;
    } catch (e) { return null; }
  }
  function writeConsent(analytics, marketing) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        analytics: !!analytics, marketing: !!marketing, v: SETTINGS.CONSENT_VERSION, t: Date.now()
      }));
    } catch (e) {}
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var analyticsOn = false, marketingOn = false, gtmOn = false, metaOn = false, liOn = false, adsOn = false;

  // events are only sent once analytics is allowed, so nothing queued before consent is replayed later
  function track(name, params) {
    if (!SETTINGS.GA_ID || !analyticsOn) return;
    window.gtag('event', name, params || {});
  }

  function loadAnalytics() {
    if (analyticsOn || !SETTINGS.GA_ID) return;
    analyticsOn = true;
    window.gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('config', SETTINGS.GA_ID, { anonymize_ip: true });
    var s = doc.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(SETTINGS.GA_ID);
    doc.head.appendChild(s);
  }

  function loadMeta() {
    if (metaOn || !SETTINGS.META_PIXEL_ID) return;
    metaOn = true;
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', SETTINGS.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function loadLinkedIn() {
    if (liOn || !SETTINGS.LINKEDIN_PARTNER_ID) return;
    liOn = true;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(SETTINGS.LINKEDIN_PARTNER_ID);
    (function (l) {
      if (!l) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); }; window.lintrk.q = []; }
      var s = doc.getElementsByTagName('script')[0];
      var b = doc.createElement('script');
      b.type = 'text/javascript'; b.async = true;
      b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
  }

  var googleConsentSet = false;
  function grantGoogleConsent() {
    if (googleConsentSet) return;
    googleConsentSet = true;
    window.gtag('consent', 'default', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
  }

  function loadGoogleAds() {
    if (adsOn || !SETTINGS.GOOGLE_ADS_ID) return;
    adsOn = true;
    grantGoogleConsent();
    window.gtag('js', new Date());
    window.gtag('config', SETTINGS.GOOGLE_ADS_ID);
    var s = doc.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(SETTINGS.GOOGLE_ADS_ID);
    doc.head.appendChild(s);
  }

  function loadGTM() {
    if (gtmOn || !SETTINGS.GTM_IDS.length) return;
    gtmOn = true;
    grantGoogleConsent();
    SETTINGS.GTM_IDS.forEach(function (id) {
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var s = doc.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
      doc.head.appendChild(s);
    });
  }

  function loadMarketing() {
    if (marketingOn) return;
    marketingOn = true;
    (function (e, t, o, n, p, r, i) {
      e.visitorGlobalObjectAlias = n;
      e[e.visitorGlobalObjectAlias] = e[e.visitorGlobalObjectAlias] || function () {
        (e[e.visitorGlobalObjectAlias].q = e[e.visitorGlobalObjectAlias].q || []).push(arguments);
      };
      e[e.visitorGlobalObjectAlias].l = (new Date()).getTime();
      r = t.createElement('script'); r.src = o; r.async = true;
      i = t.getElementsByTagName('script')[0]; i.parentNode.insertBefore(r, i);
    })(window, doc, AC_SCRIPT, 'vgo');
    window.vgo('setAccount', AC_ACCOUNT);
    window.vgo('setTrackByDefault', true);
    window.vgo('process');
  }

  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) loadAnalytics();
    if (c.marketing) { loadMarketing(); loadGTM(); loadMeta(); loadLinkedIn(); loadGoogleAds(); }
  }

  (function initConsentPanel() {
    var panel = doc.getElementById('consent');
    var stored = readConsent();
    applyConsent(stored);
    if (!panel) return;

    var cbA = doc.getElementById('consent-analytics');
    var cbM = doc.getElementById('consent-marketing');
    var gaRow = panel.querySelector('[data-consent-ga]');
    if (SETTINGS.GA_ID && gaRow) gaRow.hidden = false;
    var hasGA = !!SETTINGS.GA_ID;

    function show(focus) {
      var c = readConsent() || {};
      cbA.checked = !!c.analytics;
      cbM.checked = !!c.marketing;
      panel.hidden = false;
      if (focus) (hasGA ? cbA : cbM).focus();
    }
    function save(analytics, marketing) {
      var before = readConsent() || {};
      var withdrew = (before.analytics && !analytics) || (before.marketing && !marketing);
      writeConsent(analytics, marketing);
      panel.hidden = true;
      if (withdrew) { location.reload(); return; }   // stops anything already running on this page
      applyConsent({ analytics: analytics, marketing: marketing });
    }

    if (!stored) show(false);

    panel.addEventListener('click', function (e) {
      var choice = e.target && e.target.getAttribute && e.target.getAttribute('data-consent');
      if (!choice) return;
      if (choice === 'accept') save(hasGA, true);
      else if (choice === 'reject') save(false, false);
      else save(hasGA && cbA.checked, cbM.checked);
    });
    doc.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest('[data-open-consent]');
      if (t) show(true);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden && readConsent()) panel.hidden = true;
    });
  })();

  /* looping video: muted, with a visible pause control, plays only while on screen, never autoplays for reduced motion */
  doc.querySelectorAll('[data-video]').forEach(function (wrap) {
    var v = wrap.querySelector('video'), b = wrap.querySelector('.vtoggle');
    if (!v || !b) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var userPaused = reduce;
    function label() { b.textContent = v.paused ? 'Play video' : 'Pause video'; b.setAttribute('aria-pressed', v.paused ? 'true' : 'false'); }
    function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    b.addEventListener('click', function () { if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); } });
    v.addEventListener('play', label); v.addEventListener('pause', label); label();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { if (!userPaused) play(); } else v.pause(); });
      }, { threshold: 0.25 }).observe(v);
    }
  });

  /* close the mobile menu when tapping elsewhere */
  doc.addEventListener('click', function (e) {
    var m = doc.querySelector('details.menu[open]');
    if (m && !m.contains(e.target)) m.removeAttribute('open');
  });

  /* calls, emails, file downloads */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href.indexOf('tel:') === 0) track('click_to_call', { link_url: href, page_location: location.pathname });
    else if (href.indexOf('mailto:') === 0) track('click_email', { link_url: href });
    else if (/\.pdf($|\?)/i.test(href)) track('file_download', { file_name: href.split('/').pop() });
  });

  /* lead event on the thank-you page, only after a real submit */
  if (doc.body.getAttribute('data-page') === 'thank-you') {
    try {
      var fromSite = doc.referrer && doc.referrer.indexOf(location.hostname) !== -1 && doc.referrer.indexOf('/thank-you') === -1;
      if (sessionStorage.getItem('wc_lead') === '1' || fromSite) {
        sessionStorage.removeItem('wc_lead');
        track('generate_lead', { form_id: 'activecampaign-6', currency: 'CAD' });
        if (metaOn) window.fbq('track', 'Lead');
        if (adsOn && SETTINGS.GOOGLE_ADS_CONVERSION) window.gtag('event', 'conversion', { send_to: SETTINGS.GOOGLE_ADS_CONVERSION });
        if (liOn && window.lintrk && SETTINGS.LINKEDIN_CONVERSION_ID) window.lintrk('track', { conversion_id: SETTINGS.LINKEDIN_CONVERSION_ID });
        if (gtmOn) window.dataLayer.push({ event: 'generate_lead', form_id: 'activecampaign-6', currency: 'CAD' });
      }
    } catch (e) {}
  }

  /* ---------- attribution ----------
     Matches the Elite traffic sheet (150K V8): utm_medium is cpc, paid-social, display, qr or email.
     "Original" fields keep the FIRST touch for 90 days; gclid keeps the latest click for Google Ads. */
  var ATTR_KEYS = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  function setCookie(n, v) {
    var d = new Date(); d.setTime(d.getTime() + SETTINGS.COOKIE_DAYS * 864e5);
    doc.cookie = n + '=' + encodeURIComponent(v) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;Secure';
  }
  function getCookie(n) {
    var m = doc.cookie.match(new RegExp('(^|; )' + n + '=([^;]*)'));
    return m ? decodeURIComponent(m[2]) : '';
  }
  var qs = new URLSearchParams(location.search);
  function labelFor(source, medium, hasGclid, referrer) {
    source = (source || '').toLowerCase(); medium = (medium || '').toLowerCase();
    if (medium === 'paid-social' || medium === 'paid_social' || medium === 'social-paid') return 'Paid Social';
    if (medium === 'cpc' || medium === 'ppc' || medium === 'paid-search' || hasGclid) return 'Paid Search';
    if (medium === 'display' || medium === 'video') return 'Paid Search';   // YouTube runs through Google Ads; AC has no display option
    if (medium === 'qr' || medium === 'print' || medium === 'offline') return 'Offline Sources';
    if (medium === 'email') return 'Email';
    if (medium === 'organic') return 'Organic Search';
    if (referrer) {
      var host = '';
      try { host = new URL(referrer).hostname; } catch (e) {}
      if (host && host !== location.hostname) {
        if (/(^|\.)(google|bing|yahoo|duckduckgo|ecosia|baidu)\./.test(host)) return 'Organic Search';
        if (/(^|\.)(facebook|instagram|linkedin|t)\.(com|co)$/.test(host) || /lnkd\.in$/.test(host)) return 'Referral';
        return 'Referral';
      }
    }
    return 'Direct';
  }
  // latest touch (used for gclid and the current visit)
  ATTR_KEYS.forEach(function (k) { if (qs.get(k)) setCookie('wc_' + k, qs.get(k)); });
  // first touch: set once, never overwritten
  if (!getCookie('wc_first_source')) {
    setCookie('wc_first_source', labelFor(qs.get('utm_source'), qs.get('utm_medium'), !!qs.get('gclid'), doc.referrer));
    setCookie('wc_first_campaign', qs.get('utm_campaign') || '');
  }
  function attr(k) { return qs.get(k) || getCookie('wc_' + k) || ''; }
  function trafficSource() { return getCookie('wc_first_source') || labelFor(attr('utm_source'), attr('utm_medium'), !!attr('gclid'), doc.referrer); }
  function firstCampaign() { return getCookie('wc_first_campaign') || attr('utm_campaign'); }

  /* ---------- ActiveCampaign embedded form (form 6) ----------
     The AC script is loaded straight from the page HTML, so the form appears even if this file is cached or blocked.
     This only adds prefill, the loading state and the fallback message. */
  var acBox = doc.querySelector('.ac-embed');
  if (acBox) {
    var AC_PREFILL = {            // AC hidden-field ID : value. Fields only fill if they exist on the AC form.
      'field[9]': function () { return 'The Wilson Centre'; },
      'field[2]': function () { return 'The Wilson Centre'; },
      'field[5]': trafficSource,
      'field[40]': firstCampaign,
      'field[63]': function () { return attr('gclid'); },
      'field[51]': function () { return location.href; }
    };
    var prefill = function (root) {
      Object.keys(AC_PREFILL).forEach(function (n) {
        var el = root.querySelector('input[name="' + n + '"]');
        if (el && !el.value) el.value = AC_PREFILL[n]() || '';
      });
      ATTR_KEYS.forEach(function (k) {
        var el = root.querySelector('input[name="' + k + '"], input[data-name="' + k + '"]');
        if (el && !el.value) el.value = attr(k);
      });
    };
    var ready = function (f) {
      acBox.classList.add('is-ready');
      prefill(f);
      f.addEventListener('submit', function () {
        prefill(f);
        try { sessionStorage.setItem('wc_lead', '1'); } catch (e) {}
      }, true);
    };
    var existing = acBox.querySelector('form');
    if (existing) ready(existing);
    else {
      var timer = setTimeout(function () {
        if (acBox.classList.contains('is-ready')) return;
        acBox.classList.add('is-failed');
        acBox.querySelector('.ac-fallback').hidden = false;
      }, 15000);
      var mo = new MutationObserver(function () {
        var f = acBox.querySelector('form');
        if (!f) return;
        clearTimeout(timer); mo.disconnect(); ready(f);
      });
      mo.observe(acBox, { childList: true, subtree: true });
    }
  }

  /* ---------- registration form: emailed to sales ---------- */
  var form = doc.getElementById('register-form');
  if (!form || form.tagName !== 'FORM') return;

  var btn = form.querySelector('button[type="submit"]');
  var btnLabel = btn.querySelector('.label');
  var statusBox = doc.getElementById('form-status');
  var role = form.elements.role;
  var brokerRow = doc.getElementById('brokerage-row');

  function syncBroker() {
    var isBroker = role.value === 'Broker or agent';
    brokerRow.hidden = !isBroker;
  }
  role.addEventListener('change', syncBroker);
  syncBroker();

  function setErr(el, msg) {
    var box = doc.getElementById(el.id + '-err');
    if (msg) { el.setAttribute('aria-invalid', 'true'); if (box) box.textContent = msg; }
    else { el.removeAttribute('aria-invalid'); if (box) box.textContent = ''; }
  }
  function status(html, kind) {
    statusBox.innerHTML = html;
    statusBox.className = 'form-status ' + (kind === 'error' ? 'is-error' : 'is-info');
    statusBox.hidden = false;
  }
  function busy(on) {
    btn.disabled = on;
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    btnLabel.textContent = on ? 'Sending' : 'Request pricing';
  }
  ['firstname', 'lastname', 'email', 'phone', 'brokerage'].forEach(function (n) {
    var el = form.elements[n];
    if (el) el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) setErr(el, ''); });
  });

  function validate() {
    var first = null;
    function need(el, msg) { if (!el.value.trim()) { setErr(el, msg); first = first || el; } else setErr(el, ''); }
    need(form.elements.firstname, 'Please enter your first name.');
    need(form.elements.lastname, 'Please enter your last name.');
    var em = form.elements.email;
    if (!em.value.trim()) { setErr(em, 'Please enter your email.'); first = first || em; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em.value.trim())) { setErr(em, 'Please check the email address.'); first = first || em; }
    else setErr(em, '');
    var ph = form.elements.phone;
    if (ph.value.trim() && ph.value.replace(/\D/g, '').length < 10) { setErr(ph, 'Please enter a 10-digit phone number.'); first = first || ph; }
    else setErr(ph, '');
    if (!brokerRow.hidden) need(form.elements.brokerage, 'Please enter your brokerage.');
    return first;
  }

  function payload() {
    var f = form.elements;
    var name = f.firstname.value.trim() + ' ' + f.lastname.value.trim();
    var data = {
      _subject: 'The Wilson Centre: new registration from ' + name,
      _template: 'table',
      _captcha: 'false',
      'Name': name,
      'email': f.email.value.trim(),
      'Phone': f.phone.value.trim() || 'Not given',
      'I am': f.role.value,
      'Space needed': f.size.value,
      'Brokerage': brokerRow.hidden ? '' : f.brokerage.value.trim(),
      'Message': f.message.value.trim(),
      'Email and phone consent': f.consent.checked ? 'Yes (' + SETTINGS.CONSENT_VERSION + ')' : 'No',
      'Traffic source': trafficSource(),
      'Original campaign': firstCampaign(),
      'utm_source': attr('utm_source'),
      'utm_medium': attr('utm_medium'),
      'utm_campaign': attr('utm_campaign'),
      'utm_content': attr('utm_content'),
      'utm_term': attr('utm_term'),
      'Google click ID': attr('gclid'),
      'Page': location.href,
      'Submitted': new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })
    };
    Object.keys(data).forEach(function (k) { if (data[k] === '') delete data[k]; });
    return data;
  }

  function mailtoLink(d) {
    var lines = Object.keys(d).filter(function (k) { return k.charAt(0) !== '_'; }).map(function (k) { return k + ': ' + d[k]; });
    return 'mailto:' + SETTINGS.SALES_EMAIL + '?subject=' + encodeURIComponent(d._subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  }

  var lastMsg = '';
  function nativePost(d) {
    var f = doc.createElement('form');
    f.method = 'POST';
    f.action = SETTINGS.FORM_ENDPOINT.replace('/ajax/', '/');
    f.style.display = 'none';
    d._next = location.origin + SETTINGS.THANK_YOU;
    Object.keys(d).forEach(function (k) {
      var i = doc.createElement('input'); i.type = 'hidden'; i.name = k; i.value = d[k]; f.appendChild(i);
    });
    try { sessionStorage.setItem('wc_lead', '1'); } catch (e) {}
    doc.body.appendChild(f);
    f.submit();
  }
  function showSuccess(first) {
    track('generate_lead', { form_id: 'wilson-register', currency: 'CAD' });
    var box = doc.createElement('div');
    box.className = 'form-success';
    box.setAttribute('role', 'status');
    box.setAttribute('tabindex', '-1');
    box.innerHTML = '<span class="tick" aria-hidden="true"></span>' +
      '<h3>Thank you' + (first ? ', ' + first.replace(/[<>&"]/g, '') : '') + '. Your request is in.</h3>' +
      '<p>The Wilson Centre sales team will be in touch shortly with pricing and the suite package. ' +
      'If it’s urgent, call <a href="tel:+18444844184">' + SETTINGS.SALES_PHONE + '</a>.</p>' +
      '<p><a class="btn btn-line" href="/suites/">Explore the floors</a></p>';
    form.replaceChildren(box);
    form.classList.add('is-sent');
    box.focus({ preventScroll: true });
    var r = form.getBoundingClientRect();
    if (r.top < 80 || r.top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + r.top - 100, behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.hidden = true;
    if (form.elements.company_website.value) return; // bot trap
    var bad = validate();
    if (bad) { bad.focus(); status('Please fix the highlighted fields.', 'error'); return; }
    var d = payload();
    busy(true);
    status('Sending your request…', 'info');
    var done = false;
    var timer = setTimeout(function () { if (!done) fail(); }, 15000);
    function fail() {
      done = true; clearTimeout(timer); busy(false);
      if (window.console && lastMsg) console.warn('Form service response:', lastMsg);
      if (/activat/i.test(lastMsg)) {
        status('This form is waiting to be activated by the sales inbox, so your request wasn’t delivered. <a href="' + mailtoLink(d) + '">Email it to us instead</a> or call <a href="tel:+18444844184">' + SETTINGS.SALES_PHONE + '</a>.', 'error');
        return;
      }
      status('We couldn’t send your request just now. <a href="' + mailtoLink(d) + '">Email it to us instead</a> or call <a href="tel:+18444844184">' + SETTINGS.SALES_PHONE + '</a>.', 'error');
    }
    fetch(SETTINGS.FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(d)
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (done) return;
      if (res && (res.success === true || res.success === 'true')) {
        done = true; clearTimeout(timer);
        showSuccess(form.elements.firstname.value.trim());
      } else {
        lastMsg = (res && res.message) || '';
        fail();
      }
    }).catch(function () {
      // Network or browser blocked the background request: fall back to a normal form post,
      // which FormSubmit accepts and then sends the visitor to the thank-you page.
      if (done) return;
      done = true; clearTimeout(timer);
      nativePost(d);
    });
  });
})();
