(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal on scroll */
  var targets = doc.querySelectorAll('[data-reveal],[data-clip],.drive,[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* number roll-up: final value is already in the HTML */
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    if (isNaN(end)) return;
    var start = performance.now(), dur = 1400, fmt = new Intl.NumberFormat('en-CA');
    function tick(now) {
      var p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* gentle parallax */
  var para = [].slice.call(doc.querySelectorAll('[data-parallax]'));
  if (para.length && !reduce) {
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      para.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (p * -8).toFixed(2) + '%,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* floor picker (tabs) */
  doc.querySelectorAll('[data-floors]').forEach(function (root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = doc.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) { panel.classList.remove('is-in'); void panel.offsetWidth; panel.classList.add('is-in'); }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0];
        if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    select(initial);
  });

  /* drive time filters */
  doc.querySelectorAll('[data-drive-filters]').forEach(function (bar) {
    var list = doc.getElementById(bar.getAttribute('data-drive-filters'));
    var btns = [].slice.call(bar.querySelectorAll('button'));
    bar.hidden = false;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-group');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        list.querySelectorAll('.drive-row').forEach(function (row) {
          row.hidden = !(g === 'all' || row.getAttribute('data-group') === g);
        });
        list.classList.remove('is-in'); void list.offsetWidth; list.classList.add('is-in');
      });
    });
  });

  /* click-to-load map, so Google only loads if the visitor asks */
  doc.querySelectorAll('[data-map]').forEach(function (box) {
    var btn = box.querySelector('button');
    btn.addEventListener('click', function () {
      var f = doc.createElement('iframe');
      f.src = box.getAttribute('data-map');
      f.title = 'Map of 1025 Wilson Street West, Ancaster';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f);
      btn.parentElement.remove();
    });
  });

  /* preselect "Broker or agent" from ?role=broker */
  var role = doc.getElementById('f-role');
  if (role && /[?&]role=broker/.test(location.search)) {
    role.value = 'Broker or agent';
    role.dispatchEvent(new Event('change'));
  }
})();
