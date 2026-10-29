/* The Wilson Centre: site script
   Edit the SETTINGS block only. Everything else reads from it. */
(function () {
  'use strict';

  var SETTINGS = {
    // Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ9'. Leave empty to disable analytics.
    GA_ID: '',

    // ActiveCampaign form. Create the Wilson form in AC (Website > Forms), then put its number here.
    // Until it is set, the form falls back to opening a pre-filled email to the sales team.
    AC_ENDPOINT: 'https://elitedevelopments.activehosted.com/proc.php',
    AC_FORM_ID: '6',

    // Optional AC custom field IDs for the extra form answers. Leave null to skip a field.
    AC_FIELDS: {
      role: null,       // e.g. 'Purchaser Type'
      size: null,       // e.g. 'Desired Size'
      brokerage: null,  // e.g. 'Brokerage'
      message: null     // e.g. 'Notes'
    },

    SALES_EMAIL: 'sales@elitedevelopments.com',
    SALES_PHONE: '1-844-484-4184',
    THANK_YOU: '/thank-you/',
    CONSENT_VERSION: 'wc-2026-10',
    COOKIE_DAYS: 90
  };

  var doc = document;

  /* ---------- analytics (GA4 with Consent Mode v2) ---------- */
  var CONSENT_KEY = 'wc_consent';
  function storedConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function storeConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function track(name, params) {
    if (!SETTINGS.GA_ID) return;
    window.gtag('event', name, params || {});
  }

  if (SETTINGS.GA_ID) {
    var granted = storedConsent() === 'granted';
    window.gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      wait_for_update: 500
    });
    window.gtag('js', new Date());
    window.gtag('config', SETTINGS.GA_ID, { anonymize_ip: true });
    var s = doc.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(SETTINGS.GA_ID);
    doc.head.appendChild(s);

    var banner = doc.getElementById('consent');
    if (banner && !storedConsent()) {
      banner.hidden = false;
      banner.addEventListener('click', function (e) {
        var choice = e.target && e.target.getAttribute('data-consent');
        if (!choice) return;
        storeConsent(choice);
        window.gtag('consent', 'update', { analytics_storage: choice === 'granted' ? 'granted' : 'denied' });
        banner.hidden = true;
      });
    }
  }

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

  /* ---------- ActiveCampaign embedded form (form 6) ---------- */
  var acBox = doc.querySelector('.ac-embed[data-ac-src]');
  if (acBox) {
    var acLoaded = false;
    var AC_PREFILL = {            // AC hidden-field ID : value. Fields only fill if they exist on the AC form.
      'field[9]': function () { return 'The Wilson Centre'; },
      'field[2]': function () { return 'The Wilson Centre'; },
      'field[5]': trafficSource,
      'field[40]': firstCampaign,
      'field[63]': function () { return attr('gclid'); },
      'field[51]': function () { return location.href; }
    };
    function prefill(root) {
      Object.keys(AC_PREFILL).forEach(function (n) {
        var el = root.querySelector('input[name="' + n + '"]');
        if (el && !el.value) el.value = AC_PREFILL[n]() || '';
      });
      ATTR_KEYS.forEach(function (k) {            // hidden fields named after the UTM keys, if added
        var el = root.querySelector('input[name="' + k + '"], input[data-name="' + k + '"]');
        if (el && !el.value) el.value = attr(k);
      });
    }
    function loadAC() {
      if (acLoaded) return; acLoaded = true;
      var sc = doc.createElement('script');
      sc.src = acBox.getAttribute('data-ac-src'); sc.charset = 'utf-8'; sc.async = true;
      sc.onerror = fail;
      doc.body.appendChild(sc);
      var timer = setTimeout(fail, 12000);
      var mo = new MutationObserver(function () {
        var f = acBox.querySelector('form');
        if (!f) return;
        clearTimeout(timer); mo.disconnect();
        acBox.classList.add('is-ready');
        prefill(f);
        f.addEventListener('submit', function () {
          prefill(f);
          try { sessionStorage.setItem('wc_lead', '1'); } catch (e) {}
        });
      });
      mo.observe(acBox, { childList: true, subtree: true });
    }
    function fail() {
      if (acBox.classList.contains('is-ready')) return;
      acBox.classList.add('is-failed');
      acBox.querySelector('.ac-fallback').hidden = false;
    }
    // Load right away on the register page, or as the form nears the screen elsewhere
    if (doc.body.getAttribute('data-page') === 'register' || !('IntersectionObserver' in window)) loadAC();
    else {
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); loadAC(); }
      }, { rootMargin: '600px 0px' });
      io.observe(acBox);
    }
  }

  /* ---------- legacy custom form (not used while the AC embed is live) ---------- */
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
    form.elements.brokerage.required = isBroker;
  }
  role.addEventListener('change', syncBroker);
  syncBroker();

  function setErr(el, msg) {
    var box = doc.getElementById(el.id + '-err');
    if (msg) { el.setAttribute('aria-invalid', 'true'); if (box) box.textContent = msg; }
    else { el.removeAttribute('aria-invalid'); if (box) box.textContent = ''; }
  }
  function status(msg, kind) {
    statusBox.textContent = msg;
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

  function values() {
    var f = form.elements;
    return {
      firstname: f.firstname.value.trim(), lastname: f.lastname.value.trim(),
      email: f.email.value.trim(), phone: f.phone.value.trim(),
      role: f.role.value, size: f.size.value,
      brokerage: brokerRow.hidden ? '' : f.brokerage.value.trim(),
      message: f.message.value.trim(), consent: f.consent.checked
    };
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateStr(d) { return pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + d.getFullYear(); }
  function dtStr(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function sendToAC(v, done, fail) {
    var now = new Date();
    var wording = doc.getElementById('consent-label').textContent.trim().replace(/\s+/g, ' ');
    var p = new URLSearchParams();
    p.set('u', SETTINGS.AC_FORM_ID); p.set('f', SETTINGS.AC_FORM_ID);
    p.set('act', 'sub'); p.set('v', '2'); p.set('jsonp', 'true');
    p.set('firstname', v.firstname); p.set('lastname', v.lastname);
    p.set('email', v.email); p.set('phone', v.phone);
    p.set('field[9]', 'The Wilson Centre');      // Primary Community
    p.set('field[2]', 'The Wilson Centre');      // Community of Interest
    p.set('field[5]', trafficSource());          // Original Traffic Source
    p.set('field[40]', firstCampaign());          // Original UTM Campaign
    p.set('field[63]', attr('gclid'));           // Google Click ID
    if (v.consent) p.append('field[47][]', 'Yes');
    p.set('field[23]', dateStr(now));
    p.set('field[48]', dtStr(now));
    p.set('field[24]', wording);
    p.set('field[49]', SETTINGS.CONSENT_VERSION);
    p.set('field[41]', 'Website form');
    var basis = v.consent ? 'Express \u2014 checkbox' : 'Implied \u2014 enquiry (expires)';
    p.set('field[50]', basis); p.set('field[55]', basis);
    p.set('field[51]', location.href);
    var map = SETTINGS.AC_FIELDS;
    ['role', 'size', 'brokerage', 'message'].forEach(function (k) {
      if (map[k] && v[k]) p.set('field[' + map[k] + ']', v[k]);
    });

    var finished = false;
    var s = doc.createElement('script');
    function ok() { if (finished) return; finished = true; done(); }
    function bad() { if (finished) return; finished = true; fail(); }
    window._show_thank_you = ok;
    window._show_error = bad;
    s.onerror = bad;
    s.src = SETTINGS.AC_ENDPOINT + '?' + p.toString();
    doc.head.appendChild(s);
    setTimeout(bad, 12000);
  }

  function sendByEmail(v) {
    var lines = [
      'Name: ' + v.firstname + ' ' + v.lastname,
      'Email: ' + v.email,
      'Phone: ' + (v.phone || 'not given'),
      'I am: ' + v.role,
      'Suite size: ' + v.size
    ];
    if (v.brokerage) lines.push('Brokerage: ' + v.brokerage);
    if (v.message) lines.push('', v.message);
    lines.push('', 'Email updates: ' + (v.consent ? 'Yes' : 'No'));
    var href = 'mailto:' + SETTINGS.SALES_EMAIL +
      '?subject=' + encodeURIComponent('The Wilson Centre: pricing request from ' + v.firstname + ' ' + v.lastname) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    busy(false);
    status('Your email app should open with your details filled in. Press Send to finish, or call ' + SETTINGS.SALES_PHONE + '.', 'info');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.hidden = true;
    if (form.elements.company_website.value) return; // bot trap
    var bad = validate();
    if (bad) { bad.focus(); status('Please fix the highlighted fields.', 'error'); return; }
    var v = values();
    busy(true);
    if (!SETTINGS.AC_FORM_ID) { sendByEmail(v); return; }
    sendToAC(v, function () {
      try { sessionStorage.setItem('wc_lead', '1'); } catch (err) {}
      window.location.href = SETTINGS.THANK_YOU;
    }, function () {
      busy(false);
      status('Something went wrong on our side. Please call ' + SETTINGS.SALES_PHONE + ' and we will register you right away.', 'error');
    });
  });
})();
