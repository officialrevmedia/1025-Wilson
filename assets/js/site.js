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
})();
