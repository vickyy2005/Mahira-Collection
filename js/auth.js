/* ============================================================
   MAHIRA SELECT — LOGIN & SIGN UP
   The real traced logo, the site's ivory navigation drawer, a
   cinematic entrance and the form behaviour. Nothing here touches
   the homepage; index.html keeps main.js.
   ============================================================ */
(function () {
  'use strict';

  var D = window.MAHIRA_LOGO;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var body = document.body;

  if (window.gsap && window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    gsap.ticker.lagSmoothing(0);
    if (!CustomEase.get || !CustomEase.get('luxOut')) {
      CustomEase.create('luxOut', 'M0,0 C0.16,0.68 0.26,0.94 1,1');
      CustomEase.create('luxIO', 'M0,0 C0.62,0 0.16,1 1,1');
    }
  }
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     LOGO — the same traced vectors the rest of the site uses,
     rendered in their settled state (no intro scaffolding).
     ============================================================ */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var EC = D ? { x: D.center.x, y: D.center.y } : null;
  var ornaments = D ? [].concat(D.orn.ne, D.orn.nw, D.orn.se, D.orn.sw) : [];
  var uid = 0;

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function stops(grad, list) {
    list.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, grad); });
  }

  function buildLogo(svg, withWordmark) {
    if (!svg || !D) return;
    var id = 'au' + (++uid);
    var defs = el('defs', {}, svg);

    var gold = el('linearGradient', { id: id + 'g', gradientUnits: 'userSpaceOnUse', x1: 430, y1: 120, x2: 1180, y2: 850 }, defs);
    stops(gold, [['0%', '#8a6420'], ['32%', '#c9a35f'], ['50%', '#f0d48c'], ['68%', '#c9a35f'], ['100%', '#7c5a1d']]);

    var g = el('g', {}, svg);
    var gEm = el('g', {}, g);
    el('circle', { cx: EC.x, cy: EC.y, r: D.ring.r, fill: 'none', stroke: 'url(#' + id + 'g)', 'stroke-width': D.ring.w + 1 }, gEm);
    el('path', { d: D.m.d, fill: 'url(#' + id + 'g)', 'fill-rule': 'evenodd' }, gEm);
    ['n', 's', 'e', 'w'].forEach(function (k) {
      if (D.diamonds[k]) el('path', { d: D.diamonds[k].d, fill: 'url(#' + id + 'g)', 'fill-rule': 'evenodd' }, gEm);
    });
    ornaments.forEach(function (o) {
      el('path', { d: o.d, fill: 'url(#' + id + 'g)', 'fill-rule': 'evenodd' }, gEm);
    });
    if (!withWordmark) return;

    var wm = el('linearGradient', { id: id + 'w', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 1000, x2: 1600, y2: 1180 }, defs);
    stops(wm, [['0%', '#9a7226'], ['30%', '#d9b269'], ['50%', '#f2d896'], ['70%', '#d9b269'], ['100%', '#9a7226']]);
    var sel = el('linearGradient', { id: id + 's', gradientUnits: 'userSpaceOnUse', x1: 280, y1: 0, x2: 1320, y2: 0 }, defs);
    stops(sel, [['0%', '#8a6420'], ['45%', '#e7c87f'], ['60%', '#f0d48c'], ['100%', '#8a6420']]);

    var gMah = el('g', {}, g);
    D.mahira.forEach(function (l) { el('path', { d: l.d, fill: 'url(#' + id + 'w)', 'fill-rule': 'evenodd' }, gMah); });
    var gSel = el('g', {}, g);
    D.select.letters.forEach(function (l) { el('path', { d: l.d, fill: 'url(#' + id + 's)', 'fill-rule': 'evenodd' }, gSel); });
    D.select.lines.forEach(function (l) {
      el('rect', { x: l.x, y: l.y, width: l.w, height: Math.max(l.h, 6), fill: 'url(#' + id + 's)' }, gSel);
    });
  }

  buildLogo($('#brandLogo'), true);
  buildLogo($('#authLogo'), true);
  buildLogo($('#menuEmblem'), false);
  buildLogo($('#railEmblem'), false);

  /* ============================================================
     MOBILE DRAWER — the same tree and the same ivory styling as
     the homepage menu.
     ============================================================ */
  var NAV = {
    women: {
      label: 'Women', href: 'index.html#women-new',
      groups: [
        { title: 'Ethnic',     items: ['Sarees', 'Kurta Sets', 'Anarkali', 'Suits', 'Co-ord Sets', 'Lehengas', 'Dresses'] },
        { title: 'Western',    items: ['Dresses', 'Tops', 'Shirts', 'Trousers', 'Skirts', 'Co-ord Sets'] },
        { title: 'Innerwear',  items: ['Bras', 'Panties', 'Lingerie Sets', 'Shapewear'] },
        { title: 'Activewear', items: ['Active Tops', 'Active Bottoms', 'Active Sets'] }
      ]
    },
    kalakaari: {
      label: 'Kalakaari', href: 'index.html#kalakaari',
      groups: [
        { title: 'Sarees',     items: ['Kalamkari Sarees', 'Printed Sarees', 'Handcrafted Sarees'] },
        { title: 'Dress Sets', items: ['Kalamkari Dress Sets', 'Kurta Sets', 'Anarkali Sets'] },
        { title: 'Fabric',     items: ['Kalamkari Fabric', 'Printed Fabric', 'Handcrafted Fabric'] },
        { title: 'Dupattas',   items: ['Kalamkari Dupattas', 'Printed Dupattas', 'Handcrafted Dupattas'] }
      ]
    }
  };
  var CHEV = '<span class="chev"><svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg></span>';

  var mobileNav = $('#mobileNav'), mnStage = $('#mnStage'), mnTitle = $('#mnTitle'),
      mnBack = $('#mnBack'), mnClose = $('#mnClose'), menuBtn = $('#menuBtn');
  var mnTrail = [];

  function mk(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function rootPanel() {
    var p = mk('div', 'mn-panel');
    [['Home', 'index.html#top', null],
     ['Women', 'index.html#women-new', 'women'],
     ['Kalakaari', 'index.html#kalakaari', 'kalakaari'],
     ['New Arrivals', 'index.html#women-new', null],
     ['Best Sellers', 'index.html#best', null],
     ['Our Story', 'index.html#storyEd', null]].forEach(function (r) {
      var node;
      if (r[2]) {
        node = mk('button', 'mn-item mn-l0', esc(r[0]) + CHEV);
        node.addEventListener('click', function () { pushPanel(r[2], r[0]); });
      } else {
        node = mk('a', 'mn-item mn-l0', esc(r[0]));
        node.href = r[1];
        node.addEventListener('click', closeNav);
      }
      p.appendChild(node);
    });
    return p;
  }
  function catPanel(key) {
    var c = NAV[key], p = mk('div', 'mn-panel');
    p.appendChild(mk('span', 'mn-lead', 'Categories'));
    c.groups.forEach(function (g) {
      var b = mk('button', 'mn-item mn-l1', esc(g.title) + CHEV);
      b.addEventListener('click', function () { pushPanel(key + ':' + g.title, g.title); });
      p.appendChild(b);
    });
    return p;
  }
  function itemPanel(key, title) {
    var c = NAV[key], p = mk('div', 'mn-panel');
    var grp = c.groups.filter(function (g) { return g.title === title; })[0];
    if (!grp) return p;
    p.appendChild(mk('span', 'mn-lead', esc(c.label)));
    grp.items.forEach(function (it) {
      var a = mk('a', 'mn-item mn-l2', esc(it));
      a.href = c.href;
      a.addEventListener('click', closeNav);
      p.appendChild(a);
    });
    return p;
  }
  function panelFor(id) {
    if (!id) return rootPanel();
    var parts = id.split(':');
    return parts.length === 1 ? catPanel(parts[0]) : itemPanel(parts[0], parts[1]);
  }

  function slideIn(node, dir) {
    mnStage.appendChild(node);
    if (reduced || !window.gsap) return;
    gsap.fromTo(node, { xPercent: dir > 0 ? 100 : -100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.5, ease: 'luxIO' });
    gsap.fromTo($$('.mn-item, .mn-lead', node), { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'luxOut', stagger: 0.035, delay: 0.08 });
  }
  function slideOut(node, dir) {
    if (reduced || !window.gsap) { node.remove(); return; }
    gsap.to(node, {
      xPercent: dir > 0 ? -30 : 30, opacity: 0, duration: 0.42, ease: 'luxIO',
      onComplete: function () { node.remove(); }
    });
  }
  function setTitle(t) {
    if (t) { mnTitle.textContent = t; mnTitle.classList.add('is-text'); }
    else {
      mnTitle.classList.remove('is-text');
      mnTitle.innerHTML = '<svg class="mn-emblem" id="menuEmblem" viewBox="380 30 840 900" aria-hidden="true"></svg>';
      buildLogo($('#menuEmblem'), false);
    }
  }
  function pushPanel(id, title) {
    var cur = $('.mn-panel', mnStage);
    mnTrail.push({ id: id, title: title });
    if (cur) slideOut(cur, 1);
    slideIn(panelFor(id), 1);
    setTitle(title);
    mobileNav.classList.add('has-back');
  }
  function popPanel() {
    if (!mnTrail.length) return;
    mnTrail.pop();
    var cur = $('.mn-panel', mnStage);
    if (cur) slideOut(cur, -1);
    var prev = mnTrail[mnTrail.length - 1];
    slideIn(panelFor(prev ? prev.id : null), -1);
    setTitle(prev ? prev.title : null);
    mobileNav.classList.toggle('has-back', mnTrail.length > 0);
  }
  function openNav() {
    mnTrail = [];
    mnStage.innerHTML = '';
    slideIn(rootPanel(), 1);
    setTitle(null);
    mobileNav.classList.remove('has-back');
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('is-open', 'has-back');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  }
  if (menuBtn) menuBtn.addEventListener('click', openNav);
  if (mnClose) mnClose.addEventListener('click', closeNav);
  if (mnBack) mnBack.addEventListener('click', popPanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) closeNav();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1100 && mobileNav && mobileNav.classList.contains('is-open')) closeNav();
  });

  /* ============================================================
     FORM BEHAVIOUR — visibility toggles, focus treatment,
     validation. No routing or submission logic is invented here.
     ============================================================ */
  $$('.au-field input, .au-field select').forEach(function (inp) {
    var wrap = inp.closest('.au-field');
    inp.addEventListener('focus', function () { wrap.classList.add('is-focus'); });
    inp.addEventListener('blur', function () { wrap.classList.remove('is-focus'); });
    inp.addEventListener('input', function () {
      wrap.classList.remove('is-bad');
      var err = wrap.nextElementSibling;
      if (err && err.classList.contains('au-err')) err.classList.remove('is-on');
    });
  });

  $$('.au-eye').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = document.getElementById(btn.getAttribute('data-eye'));
      if (!f) return;
      var shown = f.type === 'text';
      f.type = shown ? 'password' : 'text';
      btn.setAttribute('aria-pressed', shown ? 'false' : 'true');
      btn.setAttribute('aria-label', shown ? 'Show password' : 'Hide password');
      f.focus({ preventScroll: true });
    });
  });

  function fail(inputId, errId, msg) {
    var inp = document.getElementById(inputId), err = document.getElementById(errId);
    if (inp) { var w = inp.closest('.au-field'); if (w) w.classList.add('is-bad'); }
    if (err) { err.textContent = msg; err.classList.add('is-on'); }
    return false;
  }
  function clearErrs(form) {
    $$('.au-err', form).forEach(function (e) { e.classList.remove('is-on'); });
    $$('.au-field', form).forEach(function (e) { e.classList.remove('is-bad'); });
  }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function note(id, msg, good) {
    var n = document.getElementById(id);
    if (!n) return;
    n.textContent = msg;
    n.classList.toggle('is-good', !!good);
    n.classList.add('is-on');
  }

  var loginForm = $('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrs(loginForm);
      var ok = true;
      var em = $('#loginEmail').value.trim(), pw = $('#loginPass').value;
      if (!em) ok = fail('loginEmail', 'loginEmailErr', 'Please enter your email address.');
      else if (!EMAIL.test(em)) ok = fail('loginEmail', 'loginEmailErr', 'That email address does not look right.');
      if (!pw) ok = fail('loginPass', 'loginPassErr', 'Please enter your password.') && ok;
      if (!ok) return;
      note('loginNote', 'Checking your details…');
      loginForm.querySelector('.au-cta').classList.add('is-busy');
      setTimeout(function () {
        loginForm.querySelector('.au-cta').classList.remove('is-busy');
        note('loginNote', 'Sign-in is not connected yet — no account service is wired to this page.', false);
      }, 900);
    });
  }

  var signupForm = $('#signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrs(signupForm);
      var ok = true;
      var nm = $('#suName').value.trim(), em = $('#suEmail').value.trim(),
          ph = $('#suPhone').value.trim(), p1 = $('#suPass').value, p2 = $('#suPass2').value;
      if (!nm) ok = fail('suName', 'suNameErr', 'Please enter your full name.');
      if (!em) ok = fail('suEmail', 'suEmailErr', 'Please enter your email address.') && ok;
      else if (!EMAIL.test(em)) ok = fail('suEmail', 'suEmailErr', 'That email address does not look right.') && ok;
      if (!ph) ok = fail('suPhone', 'suPhoneErr', 'Please enter your phone number.') && ok;
      else if (ph.replace(/\D/g, '').length < 7) ok = fail('suPhone', 'suPhoneErr', 'That phone number looks too short.') && ok;
      if (!p1) ok = fail('suPass', 'suPassErr', 'Please choose a password.') && ok;
      else if (p1.length < 8) ok = fail('suPass', 'suPassErr', 'Use at least 8 characters.') && ok;
      if (p2 !== p1) ok = fail('suPass2', 'suPass2Err', 'The two passwords do not match.') && ok;
      if (!$('#suTerms').checked) {
        var te = $('#suTermsErr');
        if (te) { te.textContent = 'Please accept the Terms & Conditions to continue.'; te.classList.add('is-on'); }
        ok = false;
      }
      if (!ok) return;
      note('suNote', 'Creating your account…');
      signupForm.querySelector('.au-cta').classList.add('is-busy');
      setTimeout(function () {
        signupForm.querySelector('.au-cta').classList.remove('is-busy');
        note('suNote', 'Account creation is not connected yet — no account service is wired to this page.', false);
      }, 900);
    });
  }

  $$('.au-soc').forEach(function (b) {
    b.addEventListener('click', function () {
      var who = b.getAttribute('data-provider') === 'apple' ? 'Apple' : 'Google';
      note(loginForm ? 'loginNote' : 'suNote', who + ' sign-in is not connected yet.', false);
    });
  });

  /* ============================================================
     ENTRANCE — slow, controlled, transform/opacity only.
     The from-states are set the moment this script runs (it sits at
     the end of the body) so nothing flashes in before the reveal;
     without JS or with reduced motion the page simply renders.
     ============================================================ */
  function prime() {
    if (reduced || !window.gsap) return;
    gsap.set('#header', { yPercent: -100, opacity: 0 });
    gsap.set('#brandLogo', { opacity: 0, scale: 0.94, transformOrigin: '50% 50%' });
    gsap.set('.auth-nav a, .auth-utils > *', { y: -8, opacity: 0 });
    gsap.set('.au-ed', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.au-ed-img img', { scale: 1.12, yPercent: 4 });
    gsap.set('.au-story', { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set('.au-ed-copy .au-eyebrow, .au-ed-copy .au-eyerule, .au-ed-head, .au-ed-sub', { y: 26, opacity: 0 });
    gsap.set('.au-story-copy .au-eyebrow, .au-story-copy .au-eyerule, .au-story-head, .au-story-sub', { y: 26, opacity: 0 });
    gsap.set('.au-story-foot', { opacity: 0 });
    gsap.set('.au-card', { y: 26, opacity: 0 });
    gsap.set('.au-logo, .au-head, .au-sub, .au-field, .au-row, .au-check-terms, .au-cta, .au-or, .au-social, .au-swap, .au-orna, .au-tag', { y: 18, opacity: 0 });
    gsap.set('.au-rail', { opacity: 0, y: 14 });
    gsap.set('.au-panel', { '--au-orn': 0 });
    gsap.set('.au-story', { '--au-orn': 0 });
  }

  function reveal() {
    body.classList.remove('is-booting');
    if (reduced || !window.gsap) return;

    var edImg  = $$('.au-ed-img img');
    var edCopy = $('.au-ed-copy');
    var story  = $('.au-story-copy');
    var card   = $('.au-card');
    var rail   = $$('.au-rail');
    var hdr    = $('#header');

    var tl = gsap.timeline({ defaults: { ease: 'luxOut' } });

    /* header settles first, the logo eases into place */
    tl.fromTo(hdr, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'luxIO' }, 0)
      .fromTo('#brandLogo', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8, transformOrigin: '50% 50%' }, 0.18)
      .fromTo('.auth-nav a, .auth-utils > *', { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.045 }, 0.28);

    /* hero photography rises from the bottom under a mask */
    if (edImg.length) {
      tl.fromTo('.au-ed', { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'luxIO' }, 0.1)
        .fromTo(edImg, { scale: 1.12, yPercent: 4 }, { scale: 1, yPercent: 0, duration: 2.1, ease: 'power2.out' }, 0.1);
    }
    /* the forest column arrives from the left */
    if (story) {
      tl.fromTo('.au-story', { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'luxIO' }, 0.1);
    }

    /* editorial type, staggered */
    var edBits = edCopy ? $$('.au-eyebrow, .au-eyerule, .au-ed-head, .au-ed-sub', edCopy) : [];
    if (edBits.length) tl.fromTo(edBits, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.11 }, 0.62);
    var stBits = story ? $$('.au-eyebrow, .au-eyerule, .au-story-head, .au-story-sub', story) : [];
    if (stBits.length) tl.fromTo(stBits, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.11 }, 0.6);
    if ($('.au-story-foot')) tl.fromTo('.au-story-foot', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.15);

    /* the card: eyebrow → heading → copy → fields → CTA → the rest */
    if (card) {
      tl.fromTo(card, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.5);
      var seq = $$('.au-logo, .au-head, .au-sub, .au-field, .au-row, .au-check-terms, .au-cta, .au-or, .au-social, .au-swap, .au-orna, .au-tag', card)
        .filter(function (n) { return n.offsetParent !== null || n.getClientRects().length; });
      if (seq.length) tl.fromTo(seq, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.055 }, 0.66);
    }
    if (rail.length) tl.fromTo(rail, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 1.25);

    /* the botanical flourishes settle in last, after the type has landed */
    tl.to('.au-panel, .au-story', { '--au-orn': 1, duration: 1.1, ease: 'sine.out' }, 1.0);
  }

  /* a very restrained parallax while scrolling — mobile stacks and
     scrolls, desktop rarely does */
  function parallax() {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    $$('.au-ed-img img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -2 }, {
        yPercent: 2, ease: 'none',
        scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    });
  }

  prime();

  /* Start on `load` so the photography is decoded before it rises, but never
     wait on it — a slow or stalled image must not leave the page primed and
     invisible, so a timer starts the reveal regardless. */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    reveal();
    parallax();
  }
  if (document.readyState === 'complete') start();
  else {
    window.addEventListener('load', start);
    setTimeout(start, 1200);
  }

  /* dev hook */
  window.__mahiraAuth = { openNav: openNav, closeNav: closeNav };
})();
