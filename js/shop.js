/* ============================================================
   MAHIRA SELECT — SHOP ENGINE
   One script drives every shop page. It reads the catalogue from
   shop-data.js, keeps cart / wishlist / order state in
   localStorage, and renders whichever view the page asks for via
   <body data-view="...">.
   ============================================================ */
(function () {
  'use strict';

  var S = window.MAHIRA_SHOP;
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
     LOGO — the project's traced mark, settled state
     ============================================================ */
  var SVGNS = 'http://www.w3.org/2000/svg', uid = 0;
  function el(n, a, p) { var e = document.createElementNS(SVGNS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function buildLogo(svg, withWordmark) {
    if (!svg || !D) return;
    var id = 'sh' + (++uid), defs = el('defs', {}, svg);
    var g1 = el('linearGradient', { id: id + 'g', gradientUnits: 'userSpaceOnUse', x1: 430, y1: 120, x2: 1180, y2: 850 }, defs);
    [['0%', '#8a6420'], ['32%', '#c9a35f'], ['50%', '#f0d48c'], ['68%', '#c9a35f'], ['100%', '#7c5a1d']]
      .forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, g1); });
    var g = el('g', {}, svg), gEm = el('g', {}, g);
    el('circle', { cx: D.center.x, cy: D.center.y, r: D.ring.r, fill: 'none', stroke: 'url(#' + id + 'g)', 'stroke-width': D.ring.w + 1 }, gEm);
    el('path', { d: D.m.d, fill: 'url(#' + id + 'g)', 'fill-rule': 'evenodd' }, gEm);
    ['n', 's', 'e', 'w'].forEach(function (k) { if (D.diamonds[k]) el('path', { d: D.diamonds[k].d, fill: 'url(#' + id + 'g)', 'fill-rule': 'evenodd' }, gEm); });
    [].concat(D.orn.ne, D.orn.nw, D.orn.se, D.orn.sw).forEach(function (o) { el('path', { d: o.d, fill: 'url(#' + id + 'g)', 'fill-rule': 'evenodd' }, gEm); });
    if (!withWordmark) return;
    var g2 = el('linearGradient', { id: id + 'w', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 1000, x2: 1600, y2: 1180 }, defs);
    [['0%', '#9a7226'], ['30%', '#d9b269'], ['50%', '#f2d896'], ['70%', '#d9b269'], ['100%', '#9a7226']]
      .forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, g2); });
    var g3 = el('linearGradient', { id: id + 's', gradientUnits: 'userSpaceOnUse', x1: 280, y1: 0, x2: 1320, y2: 0 }, defs);
    [['0%', '#8a6420'], ['45%', '#e7c87f'], ['60%', '#f0d48c'], ['100%', '#8a6420']]
      .forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, g3); });
    var gm = el('g', {}, g);
    D.mahira.forEach(function (l) { el('path', { d: l.d, fill: 'url(#' + id + 'w)', 'fill-rule': 'evenodd' }, gm); });
    var gs = el('g', {}, g);
    D.select.letters.forEach(function (l) { el('path', { d: l.d, fill: 'url(#' + id + 's)', 'fill-rule': 'evenodd' }, gs); });
    D.select.lines.forEach(function (l) { el('rect', { x: l.x, y: l.y, width: l.w, height: Math.max(l.h, 6), fill: 'url(#' + id + 's)' }, gs); });
  }

  /* ============================================================
     STATE — cart, wishlist and orders survive a reload
     ============================================================ */
  var KEY = { cart: 'mahira.cart', wish: 'mahira.wishlist', orders: 'mahira.orders', addr: 'mahira.addresses' };
  function read(k, fallback) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var Cart = {
    all: function () { return read(KEY.cart, []); },
    count: function () { return Cart.all().reduce(function (n, l) { return n + l.qty; }, 0); },
    /* a line is identified by product + the exact variant chosen */
    key: function (id, color, size) { return id + '|' + (color || '') + '|' + (size || ''); },
    add: function (id, color, size, qty) {
      var lines = Cart.all(), k = Cart.key(id, color, size);
      var hit = lines.filter(function (l) { return l.k === k; })[0];
      if (hit) hit.qty += qty; else lines.push({ k: k, id: id, color: color, size: size, qty: qty });
      write(KEY.cart, lines); syncBadges();
      return lines;
    },
    setQty: function (k, qty) {
      var lines = Cart.all().map(function (l) { if (l.k === k) l.qty = Math.max(1, Math.min(10, qty)); return l; });
      write(KEY.cart, lines); syncBadges(); return lines;
    },
    remove: function (k) {
      write(KEY.cart, Cart.all().filter(function (l) { return l.k !== k; })); syncBadges();
    },
    clear: function () { write(KEY.cart, []); syncBadges(); },
    totals: function () {
      var sub = 0, save = 0;
      Cart.all().forEach(function (l) {
        var pr = S.byId(l.id); if (!pr) return;
        sub += pr.price * l.qty;
        if (pr.mrp) save += (pr.mrp - pr.price) * l.qty;
      });
      var ship = sub === 0 ? 0 : (sub >= 4000 ? 0 : 250);
      return { sub: sub, save: save, ship: ship, total: sub + ship };
    }
  };

  var Wish = {
    all: function () { return read(KEY.wish, []); },
    has: function (id) { return Wish.all().indexOf(id) > -1; },
    toggle: function (id) {
      var w = Wish.all(), i = w.indexOf(id);
      if (i > -1) w.splice(i, 1); else w.push(id);
      write(KEY.wish, w); syncBadges();
      return w.indexOf(id) > -1;
    }
  };

  var Orders = {
    all: function () { return read(KEY.orders, []); },
    byId: function (id) { return Orders.all().filter(function (o) { return o.id === id; })[0] || null; },
    place: function (address, payment) {
      /* An empty cart must never become an order — the checkout page guards
         this, but a second tab could reach here after the first has paid. */
      if (!Cart.all().length) return null;
      var lines = Cart.all().map(function (l) {
        var pr = S.byId(l.id);
        return { id: l.id, title: pr.title, price: pr.price, qty: l.qty, color: l.color, size: l.size, img: variantImage(pr, l.color) };
      });
      var t = Cart.totals();
      var o = {
        id: 'MS' + String(Date.now()).slice(-6),
        placed: Date.now(),
        lines: lines, totals: t,
        address: address, payment: payment,
        stage: 0
      };
      var all = Orders.all(); all.unshift(o); write(KEY.orders, all);
      Cart.clear();
      return o;
    }
  };

  var Addresses = {
    all: function () {
      return read(KEY.addr, [
        { id: 'a1', label: 'Home', name: 'Jagadeesh', line: '123, MG Road, Indiranagar', city: 'Bengaluru, Karnataka 560038', phone: '+91 98765 43210', def: true },
        { id: 'a2', label: 'Office', name: 'Jagadeesh', line: '456, Residency Road', city: 'Bengaluru, Karnataka 560025', phone: '+91 98765 43210', def: false }
      ]);
    },
    save: function (list) { write(KEY.addr, list); },
    selected: function () {
      var all = Addresses.all();
      return (all.filter(function (a) { return a.def; })[0] || all[0] || null);
    }
  };

  /* ---------- helpers ---------- */
  function money(n) { return '₹ ' + Number(n).toLocaleString('en-IN'); }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function variantImage(pr, colorName) {
    if (!pr) return '';
    var i = pr.colors.map(function (c) { return c.name; }).indexOf(colorName);
    return pr.images[Math.min(i < 0 ? 0 : i, pr.images.length - 1)] || pr.images[0];
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function syncBadges() {
    var c = Cart.count(), w = Wish.all().length;
    $$('[data-badge="cart"]').forEach(function (b) { b.textContent = c; b.classList.toggle('is-on', c > 0); });
    $$('[data-badge="wish"]').forEach(function (b) { b.textContent = w; b.classList.toggle('is-on', w > 0); });
  }

  /* stars */
  function stars(r) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += '<svg viewBox="0 0 20 19" class="' + (r >= i - 0.25 ? 'on' : (r >= i - 0.75 ? 'half' : '')) + '"><path d="M10 1l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L10 14.8 4.7 17.7l1.1-6.1L1.4 7.4l6-.8z"/></svg>';
    }
    return '<span class="stars" aria-label="' + r + ' out of 5">' + out + '</span>';
  }

  /* ============================================================
     SHARED CHROME — header + drawer, same tree as the site
     ============================================================ */
  buildLogo($('#brandLogo'), true);
  buildLogo($('#menuEmblem'), false);
  buildLogo($('#footEmblemS'), false);

  var NAV = {
    women: { label: 'Women', groups: [] },
    kalakaari: { label: 'Kalakaari', groups: [] }
  };
  Object.keys(S.categories).forEach(function (k) {
    NAV[k] = { label: S.categories[k].label, groups: S.categories[k].groups };
  });

  var CHEV = '<span class="chev"><svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg></span>';
  var mobileNav = $('#mobileNav'), mnStage = $('#mnStage'), mnTitle = $('#mnTitle'),
      mnBack = $('#mnBack'), mnClose = $('#mnClose'), menuBtn = $('#menuBtn');
  var trail = [];

  function mk(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }

  function rootPanel() {
    var p = mk('div', 'mn-panel');
    var rows = [['Home', 'index.html#top', null], ['Women', 'category.html?c=women', 'women'],
                ['Kalakaari', 'category.html?c=kalakaari', 'kalakaari'],
                ['New Arrivals', 'shop.html?c=women&s=sarees', null],
                ['Best Sellers', 'index.html#best', null], ['Our Story', 'index.html#storyEd', null]];
    rows.forEach(function (r) {
      var n;
      if (r[2]) { n = mk('button', 'mn-item mn-l0', esc(r[0]) + CHEV); n.addEventListener('click', function () { push(r[2], r[0]); }); }
      else { n = mk('a', 'mn-item mn-l0', esc(r[0])); n.href = r[1]; n.addEventListener('click', closeNav); }
      p.appendChild(n);
    });
    return p;
  }
  function catPanel(key) {
    var p = mk('div', 'mn-panel');
    p.appendChild(mk('span', 'mn-lead', 'Categories'));
    var a = mk('a', 'mn-item mn-l1', 'All ' + esc(NAV[key].label));
    a.href = 'category.html?c=' + key; a.addEventListener('click', closeNav);
    p.appendChild(a);
    NAV[key].groups.forEach(function (g) {
      g.subs.forEach(function (s) {
        var n = mk('a', 'mn-item mn-l1', esc(s.label));
        n.href = 'shop.html?c=' + key + '&s=' + s.slug;
        n.addEventListener('click', closeNav);
        p.appendChild(n);
      });
    });
    return p;
  }
  function panelFor(id) { return id ? catPanel(id) : rootPanel(); }
  function slideIn(node, dir) {
    mnStage.appendChild(node);
    if (reduced || !window.gsap) return;
    gsap.fromTo(node, { xPercent: dir > 0 ? 100 : -100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: 'luxIO' });
    gsap.fromTo($$('.mn-item, .mn-lead', node), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'luxOut', stagger: 0.035, delay: 0.08 });
  }
  function slideOut(node, dir) {
    if (reduced || !window.gsap) { node.remove(); return; }
    gsap.to(node, { xPercent: dir > 0 ? -30 : 30, opacity: 0, duration: 0.42, ease: 'luxIO', onComplete: function () { node.remove(); } });
  }
  function setTitle(t) {
    if (t) { mnTitle.textContent = t; }
    else { mnTitle.innerHTML = '<svg class="mn-emblem" id="menuEmblem" viewBox="380 30 840 900" aria-hidden="true"></svg>'; buildLogo($('#menuEmblem'), false); }
  }
  function push(id, title) {
    var cur = $('.mn-panel', mnStage); trail.push({ id: id, title: title });
    if (cur) slideOut(cur, 1);
    slideIn(panelFor(id), 1); setTitle(title); mobileNav.classList.add('has-back');
  }
  function pop() {
    if (!trail.length) return;
    trail.pop();
    var cur = $('.mn-panel', mnStage); if (cur) slideOut(cur, -1);
    var prev = trail[trail.length - 1];
    slideIn(panelFor(prev ? prev.id : null), -1);
    setTitle(prev ? prev.title : null);
    mobileNav.classList.toggle('has-back', trail.length > 0);
  }
  function openNav() {
    trail = []; mnStage.innerHTML = ''; slideIn(rootPanel(), 1); setTitle(null);
    mobileNav.classList.remove('has-back'); mobileNav.classList.add('is-open');
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
  if (mnBack) mnBack.addEventListener('click', pop);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) closeNav();
  });

  /* desktop nav dropdowns */
  $$('.sh-nav [data-cat]').forEach(function (a) {
    var key = a.getAttribute('data-cat');
    var dd = mk('div', 'sh-dd');
    var inner = mk('div', 'sh-dd-in');
    NAV[key].groups.forEach(function (g) {
      var col = mk('div', 'sh-dd-col', '<h4>' + esc(g.title) + '</h4><i></i>');
      g.subs.forEach(function (s) {
        var l = mk('a', null, esc(s.label));
        l.href = 'shop.html?c=' + key + '&s=' + s.slug;
        col.appendChild(l);
      });
      inner.appendChild(col);
    });
    dd.appendChild(inner);
    a.parentNode.appendChild(dd);
  });

  syncBadges();

  /* ============================================================
     REVEALS — shared entrance grammar
     ============================================================ */
  function revealPage() {
    body.classList.add('is-live');
    if (reduced || !window.gsap) return;
    var tl = gsap.timeline({ defaults: { ease: 'luxOut' } });
    tl.fromTo('#shopHeader', { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.65, ease: 'luxIO' }, 0);
    var band = $('.sh-band');
    if (band) {
      tl.fromTo(band, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'luxIO' }, 0.12)
        .fromTo('.sh-band img', { scale: 1.12 }, { scale: 1, duration: 1.9, ease: 'power2.out' }, 0.12);
      tl.fromTo($$('.sh-band-copy > *'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.09 }, 0.5);
    }
    var head = $$('.sh-head > *');
    if (head.length) tl.fromTo(head, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 }, 0.28);
    return tl;
  }
  function revealCards(sel, at) {
    if (reduced || !window.gsap) return;
    var cards = $$(sel);
    if (!cards.length) return;
    gsap.fromTo(cards, { y: 34, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.85, ease: 'luxOut', stagger: 0.06, delay: at || 0.35
    });
  }

  /* ============================================================
     CARDS
     ============================================================ */
  function cardHTML(pr) {
    var sw = pr.colors.slice(0, 5).map(function (c) {
      return '<i style="background:' + c.hex + '" title="' + esc(c.name) + '"></i>';
    }).join('');
    var off = pr.mrp ? Math.round((1 - pr.price / pr.mrp) * 100) : 0;
    return '' +
      '<a class="pc" href="product.html?p=' + pr.id + '" data-id="' + pr.id + '">' +
        '<span class="pc-img">' +
          '<img src="' + pr.images[0] + '" alt="' + esc(pr.title) + '" loading="lazy" decoding="async">' +
          (pr.images[1] ? '<img class="pc-alt" src="' + pr.images[1] + '" alt="" aria-hidden="true" loading="lazy" decoding="async">' : '') +
          (off >= 10 ? '<span class="pc-off">' + off + '% off</span>' : '') +
          '<button type="button" class="pc-wish" data-wish="' + pr.id + '" aria-label="Add to wishlist" aria-pressed="false">' +
            '<svg viewBox="0 0 24 24"><path d="M12 20.2 5 13.4a4.6 4.6 0 0 1 0-6.6 4.7 4.7 0 0 1 6.6 0l.4.4.4-.4a4.7 4.7 0 0 1 6.6 0 4.6 4.6 0 0 1 0 6.6Z"/></svg>' +
          '</button>' +
        '</span>' +
        '<span class="pc-body">' +
          '<span class="pc-t">' + esc(pr.title) + '</span>' +
          '<span class="pc-p">' + money(pr.price) + (pr.mrp ? '<s>' + money(pr.mrp) + '</s>' : '') + '</span>' +
          '<span class="pc-sw">' + sw + '</span>' +
        '</span>' +
      '</a>';
  }

  function wireWishButtons(scope) {
    $$('[data-wish]', scope || document).forEach(function (b) {
      var id = b.getAttribute('data-wish');
      b.setAttribute('aria-pressed', Wish.has(id) ? 'true' : 'false');
      b.classList.toggle('is-on', Wish.has(id));
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var on = Wish.toggle(id);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.classList.toggle('is-on', on);
        if (!reduced && window.gsap) gsap.fromTo(b.querySelector('svg'), { scale: 0.7 }, { scale: 1, duration: 0.45, ease: 'luxOut' });
      });
    });
  }

  /* ============================================================
     VIEWS
     ============================================================ */
  var VIEW = body.getAttribute('data-view');

  /* ---------- 2 · CATEGORY LANDING ---------- */
  function viewCategory() {
    var catKey = qs('c') || 'women';
    var cat = S.categories[catKey] || S.categories.women;
    document.title = cat.label + ' — Mahira Select';
    $('#bcCat').textContent = cat.label;
    $('#bcCat').href = 'category.html?c=' + (cat.key || catKey);
    $('#catEyebrow').textContent = cat.eyebrow;
    $('#catTitle').textContent = cat.title;
    $('#catLine').textContent = cat.line;
    var img = $('#catHero'), src = $('#catHeroSrc');
    img.src = cat.hero; img.alt = cat.label + ' collection';
    if (src) src.srcset = cat.heroMobile || cat.hero;
    img.style.objectPosition = cat.heroPos || '50% 50%';

    var wrap = $('#catGroups');
    wrap.innerHTML = cat.groups.map(function (g) {
      return '<section class="cg">' +
        '<h3 class="cg-t">' + esc(g.title) + '</h3><i class="cg-rule"></i>' +
        '<div class="cg-grid">' + g.subs.map(function (s) {
          var n = S.inSub(cat.slug, s.slug).length;
          return '<a class="cg-card" href="shop.html?c=' + cat.slug + '&s=' + s.slug + '">' +
            '<span class="cg-img"><img src="' + s.img + '" alt="' + esc(s.label) + '" loading="lazy" decoding="async"></span>' +
            '<span class="cg-b"><span class="cg-n">' + esc(s.label) + '</span>' +
            '<span class="cg-c">' + n + (n === 1 ? ' piece' : ' pieces') + '</span></span>' +
            '<span class="cg-go" aria-hidden="true"><svg viewBox="0 0 28 10"><path d="M0 5h23M19 1l5 4-5 4"/></svg></span></a>';
        }).join('') + '</div></section>';
    }).join('');
    revealPage();
    revealCards('.cg-card', 0.45);
  }

  /* ---------- 3 · PRODUCT LISTING ---------- */
  function viewShop() {
    var catKey = qs('c') || 'women';
    var cat = S.categories[catKey] || S.categories.women;
    var sub = qs('s');
    if (sub === 'kurti' || sub === 'kurtis' || sub === 'kurta') sub = 'kurta-sets';
    var meta = sub ? S.subMeta(catKey, sub) : null;
    var base = sub ? S.inSub(catKey, sub) : S.inCat(catKey);

    /* A subcategory the nav offers but the catalogue has not stocked yet must
       not be a dead end — show the whole category and say why. */
    var fellBack = false, askedFor = '';
    if (sub && !base.length) {
      fellBack = true;
      askedFor = S.subLabel(catKey, sub);
      if (askedFor === sub) {   /* not in the catalogue at all — tidy the slug */
        askedFor = sub.replace(/-/g, ' ').replace(/\b\w/g, function (m) { return m.toUpperCase(); });
      }
      base = S.inCat(catKey);
      meta = null;
    }

    var displayLabel = (meta && meta.slug === 'kurta-sets') ? 'Kurta Sets & Kurtis' : (meta ? meta.label : cat.label);
    document.title = displayLabel + ' — Mahira Select';
    $('#bcCat').textContent = cat.label;
    $('#bcCat').href = 'category.html?c=' + catKey;
    $('#bcSub').textContent = meta ? meta.label : 'All';
    $('#shTitle').textContent = displayLabel;
    $('#shLine').textContent = fellBack
      ? ('“' + askedFor + '” is not in the atelier yet — here is everything in ' + cat.label + '.')
      : (meta ? ('A considered edit of ' + meta.label.toLowerCase() + ', made to be worn.') : cat.line);
    /* prefer the landscape band plate; the portrait card crop is never used
       here because a wide frame would show only a slice of it */
    var bimg = $('#shBandImg');
    if (bimg) {
      bimg.src = (meta && (meta.band || meta.img)) || cat.hero;
      bimg.alt = (meta ? meta.label : cat.label);
      bimg.style.objectPosition = (meta && meta.focal) || cat.heroPos || '50% 38%';
    }

    /* filter vocabulary comes from the products actually present */
    var fabrics = [], colorNames = [], maxPrice = 0;
    base.forEach(function (pr) {
      if (fabrics.indexOf(pr.fabric) < 0) fabrics.push(pr.fabric);
      pr.colors.forEach(function (c) { if (colorNames.map(function (x) { return x.name; }).indexOf(c.name) < 0) colorNames.push(c); });
      maxPrice = Math.max(maxPrice, pr.price);
    });
    var ceiling = Math.ceil(maxPrice / 5000) * 5000;

    $('#fFabric').innerHTML = fabrics.map(function (f) {
      return '<label class="f-check"><input type="checkbox" value="' + esc(f) + '"><span class="f-box"><svg viewBox="0 0 14 11"><path d="M1 5.6 5 9.6 13 1.4"/></svg></span><span>' + esc(f) + '</span></label>';
    }).join('');
    $('#fColor').innerHTML = colorNames.map(function (c) {
      return '<button type="button" class="f-sw" data-color="' + esc(c.name) + '" style="background:' + c.hex + '" title="' + esc(c.name) + '" aria-label="' + esc(c.name) + '" aria-pressed="false"></button>';
    }).join('');
    var range = $('#fPrice');
    range.max = ceiling; range.value = ceiling;
    $('#fPriceHi').textContent = money(ceiling);
    $('#fPriceLo').textContent = money(0);

    var state = { fabric: [], color: [], max: ceiling, sort: 'featured' };

    function apply() {
      var list = base.filter(function (pr) {
        if (state.fabric.length && state.fabric.indexOf(pr.fabric) < 0) return false;
        if (state.color.length && !pr.colors.some(function (c) { return state.color.indexOf(c.name) > -1; })) return false;
        if (pr.price > state.max) return false;
        return true;
      });
      if (state.sort === 'low') list = list.slice().sort(function (a, b) { return a.price - b.price; });
      if (state.sort === 'high') list = list.slice().sort(function (a, b) { return b.price - a.price; });
      if (state.sort === 'rating') list = list.slice().sort(function (a, b) { return b.rating - a.rating; });

      $('#shCount').textContent = list.length + (list.length === 1 ? ' Product' : ' Products');
      var grid = $('#shGrid');
      grid.innerHTML = list.length
        ? list.map(cardHTML).join('')
        : '<p class="sh-empty">Nothing matches those filters yet. <button type="button" id="shReset">Clear filters</button></p>';
      wireWishButtons(grid);
      var reset = $('#shReset');
      if (reset) reset.addEventListener('click', clearAll);
      revealCards('#shGrid .pc', 0.05);
    }
    function clearAll() {
      state.fabric = []; state.color = []; state.max = ceiling;
      $$('#fFabric input').forEach(function (i) { i.checked = false; });
      $$('#fColor .f-sw').forEach(function (b) { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
      range.value = ceiling; $('#fPriceHi').textContent = money(ceiling);
      apply();
    }

    $('#fFabric').addEventListener('change', function (e) {
      var v = e.target.value, i = state.fabric.indexOf(v);
      if (e.target.checked && i < 0) state.fabric.push(v);
      if (!e.target.checked && i > -1) state.fabric.splice(i, 1);
      apply();
    });
    $('#fColor').addEventListener('click', function (e) {
      var b = e.target.closest('.f-sw'); if (!b) return;
      var v = b.getAttribute('data-color'), i = state.color.indexOf(v);
      if (i > -1) { state.color.splice(i, 1); b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }
      else { state.color.push(v); b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); }
      apply();
    });
    range.addEventListener('input', function () { state.max = +range.value; $('#fPriceHi').textContent = money(state.max); apply(); });
    $('#shSort').addEventListener('change', function () { state.sort = $('#shSort').value; apply(); });
    $('#shClear').addEventListener('click', clearAll);

    var fBtn = $('#shFilterBtn'), fPanel = $('#shFilters');
    if (fBtn) fBtn.addEventListener('click', function () {
      var on = fPanel.classList.toggle('is-open');
      fBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.documentElement.style.overflow = on ? 'hidden' : '';
    });
    var fDone = $('#shFilterDone');
    if (fDone) fDone.addEventListener('click', function () {
      fPanel.classList.remove('is-open');
      fBtn.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
    });

    apply();
    revealPage();
  }

  /* ---------- 4 · PRODUCT DETAIL ---------- */
  function viewProduct() {
    var pr = S.byId(qs('p'));
    if (!pr) { location.replace('category.html?c=women'); return; }
    var cat = S.categories[pr.cat];
    document.title = pr.title + ' — Mahira Select';

    $('#bcCat').textContent = cat.label; $('#bcCat').href = 'category.html?c=' + pr.cat;
    $('#bcSub').textContent = S.subLabel(pr.cat, pr.sub); $('#bcSub').href = 'shop.html?c=' + pr.cat + '&s=' + pr.sub;
    $('#bcProd').textContent = pr.title;

    $('#pTitle').textContent = pr.title;
    $('#pRating').innerHTML = stars(pr.rating) + '<span class="p-rev">(' + pr.reviews + ' reviews)</span>';
    $('#pPrice').innerHTML = money(pr.price) + (pr.mrp ? '<s>' + money(pr.mrp) + '</s><em>' + Math.round((1 - pr.price / pr.mrp) * 100) + '% off</em>' : '');
    $('#pDesc').textContent = pr.desc;
    $('#pDetails').textContent = pr.details;
    $('#pCare').textContent = pr.care;
    $('#pShip').textContent = pr.shipping;

    var chosen = { color: pr.colors[0].name, size: pr.sizes[0], qty: 1 };

    /* gallery */
    var main = $('#pMain'), rail = $('#pRail');
    rail.innerHTML = pr.images.map(function (src, i) {
      return '<button type="button" class="p-th' + (i === 0 ? ' is-on' : '') + '" data-i="' + i + '" aria-label="View image ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
    }).join('');
    function showImage(i) {
      if (!pr.images[i]) return;
      $$('.p-th', rail).forEach(function (b, n) { b.classList.toggle('is-on', n === i); });
      if (reduced || !window.gsap) { main.src = pr.images[i]; return; }
      gsap.to(main, { opacity: 0, xPercent: -3, duration: 0.24, ease: 'sine.in', onComplete: function () {
        main.src = pr.images[i];
        gsap.fromTo(main, { opacity: 0, xPercent: 3 }, { opacity: 1, xPercent: 0, duration: 0.5, ease: 'luxOut' });
      }});
    }
    rail.addEventListener('click', function (e) {
      var b = e.target.closest('.p-th'); if (!b) return;
      showImage(+b.getAttribute('data-i'));
    });
    main.src = pr.images[0]; main.alt = pr.title;

    /* colour */
    $('#pColorName').textContent = chosen.color;
    $('#pColors').innerHTML = pr.colors.map(function (c, i) {
      return '<button type="button" class="p-sw' + (i === 0 ? ' is-on' : '') + '" data-color="' + esc(c.name) + '" style="background:' + c.hex + '" title="' + esc(c.name) + '" aria-label="' + esc(c.name) + '" aria-pressed="' + (i === 0) + '"></button>';
    }).join('');
    $('#pColors').addEventListener('click', function (e) {
      var b = e.target.closest('.p-sw'); if (!b) return;
      chosen.color = b.getAttribute('data-color');
      $$('.p-sw', $('#pColors')).forEach(function (x) {
        var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      $('#pColorName').textContent = chosen.color;
      var i = pr.colors.map(function (c) { return c.name; }).indexOf(chosen.color);
      if (pr.images[i]) showImage(i);
    });

    /* size */
    var sizeWrap = $('#pSizes');
    if (pr.sizes.length > 1) {
      sizeWrap.innerHTML = pr.sizes.map(function (s, i) {
        return '<button type="button" class="p-size' + (i === 0 ? ' is-on' : '') + '" data-size="' + esc(s) + '" aria-pressed="' + (i === 0) + '">' + esc(s) + '</button>';
      }).join('');
      sizeWrap.addEventListener('click', function (e) {
        var b = e.target.closest('.p-size'); if (!b) return;
        chosen.size = b.getAttribute('data-size');
        $$('.p-size', sizeWrap).forEach(function (x) {
          var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    } else {
      $('#pSizeRow').style.display = 'none';
    }

    /* quantity */
    var qEl = $('#pQty');
    $('#pQtyMinus').addEventListener('click', function () { chosen.qty = Math.max(1, chosen.qty - 1); qEl.textContent = chosen.qty; });
    $('#pQtyPlus').addEventListener('click', function () { chosen.qty = Math.min(10, chosen.qty + 1); qEl.textContent = chosen.qty; });

    /* wishlist + share */
    var wb = $('#pWish');
    function paintWish() {
      var on = Wish.has(pr.id);
      wb.classList.toggle('is-on', on);
      wb.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('#pWishLabel').textContent = on ? 'Saved to Wishlist' : 'Add to Wishlist';
    }
    paintWish();
    wb.addEventListener('click', function () { Wish.toggle(pr.id); paintWish(); });
    $('#pShare').addEventListener('click', function () {
      var url = location.href;
      if (navigator.share) { navigator.share({ title: pr.title, url: url }).catch(function () {}); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () {});
    });

    /* cart */
    function addNow() { Cart.add(pr.id, chosen.color, chosen.size, chosen.qty); }
    $('#pAdd').addEventListener('click', function () { addNow(); openAdded(pr, chosen); });
    $('#pBuy').addEventListener('click', function () { addNow(); location.href = 'cart.html'; });

    /* accordions */
    $$('.p-acc-h').forEach(function (h) {
      h.addEventListener('click', function () {
        var open = h.parentNode.classList.toggle('is-open');
        h.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* related */
    var rel = S.inSub(pr.cat, pr.sub).filter(function (x) { return x.id !== pr.id; });
    if (rel.length < 4) rel = rel.concat(S.inCat(pr.cat).filter(function (x) { return x.id !== pr.id && rel.indexOf(x) < 0; }));
    rel = rel.slice(0, 4);
    if (rel.length) { $('#pRelGrid').innerHTML = rel.map(cardHTML).join(''); wireWishButtons($('#pRelGrid')); }
    else { $('#pRelated').style.display = 'none'; }

    revealPage();
    if (!reduced && window.gsap) {
      gsap.fromTo('.p-gal', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'luxIO', delay: 0.15 });
      gsap.fromTo($$('.p-info > *'), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'luxOut', stagger: 0.07, delay: 0.4 });
    }
    revealCards('#pRelGrid .pc', 0.2);
  }

  /* ---------- 5 · ADDED-TO-CART SHEET ---------- */
  function openAdded(pr, chosen) {
    var sheet = $('#addedSheet');
    if (!sheet) return;
    $('#adImg').src = variantImage(pr, chosen.color);
    $('#adImg').alt = pr.title;
    $('#adTitle').textContent = pr.title;
    $('#adPrice').textContent = money(pr.price * chosen.qty);
    $('#adMeta').innerHTML = 'Colour: ' + esc(chosen.color) + (pr.sizes.length > 1 ? '<br>Size: ' + esc(chosen.size) : '') + '<br>Quantity: ' + chosen.qty;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    if (!reduced && window.gsap) {
      gsap.fromTo('#addedCard', { y: 26, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'luxOut' });
      gsap.fromTo('#adTick', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'luxOut', delay: 0.1 });
    }
  }
  function closeAdded() {
    var sheet = $('#addedSheet'); if (!sheet) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
  }
  if ($('#addedSheet')) {
    $('#adClose').addEventListener('click', closeAdded);
    $('#adContinue').addEventListener('click', closeAdded);
    $('#addedSheet').addEventListener('click', function (e) { if (e.target === $('#addedSheet')) closeAdded(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAdded(); });
  }

  function toast(msg) {
    var t = mk('div', 'sh-toast', esc(msg));
    document.body.appendChild(t);
    if (!reduced && window.gsap) gsap.fromTo(t, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'luxOut' });
    setTimeout(function () {
      if (!reduced && window.gsap) gsap.to(t, { y: 10, opacity: 0, duration: 0.35, onComplete: function () { t.remove(); } });
      else t.remove();
    }, 1800);
  }

  /* ---------- 6 · CART ---------- */
  function viewCart() {
    function paint() {
      var lines = Cart.all();
      var wrap = $('#cartLines');
      if (!lines.length) {
        $('#cartMain').classList.add('is-empty');
        wrap.innerHTML = '<div class="cart-empty"><p>Your bag is empty.</p><em>Every story begins somewhere.</em>' +
          '<a class="sh-cta" href="category.html?c=women"><span class="sh-cta-l">Explore Women</span></a></div>';
        $('#cartSummary').style.display = 'none';
        return;
      }
      $('#cartMain').classList.remove('is-empty');
      $('#cartSummary').style.display = '';
      wrap.innerHTML = lines.map(function (l) {
        var pr = S.byId(l.id); if (!pr) return '';
        return '<div class="cl" data-k="' + esc(l.k) + '">' +
          '<a class="cl-img" href="product.html?p=' + pr.id + '"><img src="' + variantImage(pr, l.color) + '" alt="' + esc(pr.title) + '"></a>' +
          '<div class="cl-b">' +
            '<a class="cl-t" href="product.html?p=' + pr.id + '">' + esc(pr.title) + '</a>' +
            '<p class="cl-p">' + money(pr.price) + '</p>' +
            '<p class="cl-m">Colour: ' + esc(l.color) + (pr.sizes.length > 1 ? ' · Size: ' + esc(l.size) : '') + '</p>' +
            '<div class="cl-r">' +
              '<span class="qty"><button type="button" data-q="-" aria-label="Decrease quantity">−</button>' +
              '<b>' + l.qty + '</b><button type="button" data-q="+" aria-label="Increase quantity">+</button></span>' +
              '<button type="button" class="cl-del" data-del aria-label="Remove ' + esc(pr.title) + '">' +
                '<svg viewBox="0 0 24 24"><path d="M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7M6.5 7l.9 12.1A1.6 1.6 0 0 0 9 20.6h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<p class="cl-line">' + money(pr.price * l.qty) + '</p>' +
        '</div>';
      }).join('');
      paintTotals();
    }
    function paintTotals() {
      var t = Cart.totals();
      $('#sumCount').textContent = Cart.count() + (Cart.count() === 1 ? ' item' : ' items');
      $('#sumSub').textContent = money(t.sub);
      $('#sumShip').textContent = t.ship === 0 ? 'Free' : money(t.ship);
      $('#sumTotal').textContent = money(t.total);
      var sv = $('#sumSave');
      if (t.save > 0) { sv.style.display = ''; $('#sumSaveVal').textContent = '− ' + money(t.save); }
      else sv.style.display = 'none';
      $('#cartTitle').textContent = 'Your Cart (' + Cart.count() + ')';
    }
    $('#cartLines').addEventListener('click', function (e) {
      var row = e.target.closest('.cl'); if (!row) return;
      var k = row.getAttribute('data-k');
      var line = Cart.all().filter(function (l) { return l.k === k; })[0];
      if (e.target.closest('[data-del]')) {
        if (!reduced && window.gsap) gsap.to(row, { height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: 'luxIO', onComplete: function () { Cart.remove(k); paint(); } });
        else { Cart.remove(k); paint(); }
        return;
      }
      var q = e.target.closest('[data-q]');
      if (q && line) { Cart.setQty(k, line.qty + (q.getAttribute('data-q') === '+' ? 1 : -1)); paint(); }
    });
    $('#cartClear').addEventListener('click', function () { Cart.clear(); paint(); });
    $('#cartNext').addEventListener('click', function () { location.href = 'checkout.html?step=address'; });
    setStepper(0);
    paint();
    revealPage();
    revealCards('.cl', 0.25);
  }

  /* ---------- 7 & 8 · CHECKOUT ---------- */
  function viewCheckout() {
    if (!Cart.all().length) { location.replace('cart.html'); return; }
    var step = qs('step') === 'payment' ? 'payment' : 'address';
    setStepper(step === 'payment' ? 2 : 1);
    $('#stepAddress').style.display = step === 'address' ? '' : 'none';
    $('#stepPayment').style.display = step === 'payment' ? '' : 'none';

    var t = Cart.totals();
    $('#coSub').textContent = money(t.sub);
    $('#coShip').textContent = t.ship === 0 ? 'Free' : money(t.ship);
    $('#coTotal').textContent = money(t.total);
    $('#coCount').textContent = Cart.count() + (Cart.count() === 1 ? ' item' : ' items');

    /* --- addresses --- */
    var list = Addresses.all();
    function paintAddresses() {
      $('#addrList').innerHTML = list.map(function (a) {
        return '<label class="ad' + (a.def ? ' is-on' : '') + '">' +
          '<input type="radio" name="addr" value="' + a.id + '"' + (a.def ? ' checked' : '') + '>' +
          '<span class="ad-tick" aria-hidden="true"><svg viewBox="0 0 14 11"><path d="M1 5.6 5 9.6 13 1.4"/></svg></span>' +
          '<span class="ad-b"><span class="ad-l">' + esc(a.label) + '</span>' +
          '<span class="ad-x">' + esc(a.name) + '<br>' + esc(a.line) + '<br>' + esc(a.city) + '<br>' + esc(a.phone) + '</span></span>' +
          '<span class="ad-acts"><button type="button" data-edit="' + a.id + '">Edit</button><i>|</i>' +
          '<button type="button" data-del="' + a.id + '">Delete</button></span></label>';
      }).join('');
    }
    paintAddresses();
    $('#addrList').addEventListener('change', function (e) {
      list = list.map(function (a) { a.def = (a.id === e.target.value); return a; });
      Addresses.save(list); paintAddresses();
    });
    $('#addrList').addEventListener('click', function (e) {
      var del = e.target.closest('[data-del]');
      if (del) {
        e.preventDefault();
        if (list.length < 2) { toast('Keep at least one address'); return; }
        list = list.filter(function (a) { return a.id !== del.getAttribute('data-del'); });
        if (!list.some(function (a) { return a.def; })) list[0].def = true;
        Addresses.save(list); paintAddresses();
        return;
      }
      var ed = e.target.closest('[data-edit]');
      if (ed) { e.preventDefault(); openAddrForm(list.filter(function (a) { return a.id === ed.getAttribute('data-edit'); })[0]); }
    });

    var form = $('#addrForm');
    function openAddrForm(a) {
      form.classList.add('is-open');
      form.setAttribute('data-edit', a ? a.id : '');
      $('#afTitle').textContent = a ? 'Edit Address' : 'Add New Address';
      $('#afLabel').value = a ? a.label : '';
      $('#afName').value = a ? a.name : '';
      $('#afLine').value = a ? a.line : '';
      $('#afCity').value = a ? a.city : '';
      $('#afPhone').value = a ? a.phone : '';
      $('#afLabel').focus({ preventScroll: true });
    }
    $('#addrAdd').addEventListener('click', function () { openAddrForm(null); });
    $('#afCancel').addEventListener('click', function () { form.classList.remove('is-open'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var vals = { label: $('#afLabel').value.trim(), name: $('#afName').value.trim(),
                   line: $('#afLine').value.trim(), city: $('#afCity').value.trim(), phone: $('#afPhone').value.trim() };
      if (!vals.label || !vals.name || !vals.line || !vals.city || !vals.phone) { toast('Please complete every field'); return; }
      var editing = form.getAttribute('data-edit');
      if (editing) { list = list.map(function (a) { return a.id === editing ? Object.assign(a, vals) : a; }); }
      else { list.forEach(function (a) { a.def = false; }); list.push(Object.assign({ id: 'a' + Date.now(), def: true }, vals)); }
      Addresses.save(list); paintAddresses(); form.classList.remove('is-open');
    });

    $('#toPayment').addEventListener('click', function () {
      if (!Addresses.selected()) { toast('Choose a delivery address'); return; }
      location.href = 'checkout.html?step=payment';
    });

    /* --- payment --- */
    var addr = Addresses.selected();
    if (addr && $('#payAddr')) {
      $('#payAddr').innerHTML = '<b>' + esc(addr.label) + '</b> · ' + esc(addr.name) + '<br>' + esc(addr.line) + ', ' + esc(addr.city);
    }
    $('#place').addEventListener('click', function () {
      var m = $('input[name="pay"]:checked');
      if (!m) { toast('Choose a payment method'); return; }
      var btn = $('#place');
      btn.classList.add('is-busy');
      btn.querySelector('.sh-cta-l').textContent = 'Placing your order…';
      setTimeout(function () {
        var order = Orders.place(addr, m.getAttribute('data-label'));
        if (!order) {                       /* the cart emptied under us */
          btn.classList.remove('is-busy');
          btn.querySelector('.sh-cta-l').textContent = 'Place Order';
          toast('Your cart is empty');
          location.href = 'cart.html';
          return;
        }
        location.href = 'order.html?o=' + order.id;
      }, 900);
    });
    revealPage();
  }

  function setStepper(n) {
    $$('.stp-i').forEach(function (s, i) {
      s.classList.toggle('is-done', i < n);
      s.classList.toggle('is-on', i === n);
    });
  }

  /* ---------- 9 · ORDER PLACED ---------- */
  function viewOrder() {
    var o = Orders.byId(qs('o')) || Orders.all()[0];
    if (!o) { location.replace('index.html'); return; }
    $('#okNum').textContent = '#' + o.id;
    $('#okTrack').href = 'track.html?o=' + o.id;
    $('#okLines').innerHTML = o.lines.map(function (l) {
      return '<div class="ok-l"><img src="' + l.img + '" alt="' + esc(l.title) + '">' +
        '<span><b>' + esc(l.title) + '</b><em>Colour: ' + esc(l.color) + (l.size && l.size !== 'Free Size' ? ' · Size: ' + esc(l.size) : '') + '</em>' +
        '<em>Qty: ' + l.qty + '</em></span><i>' + money(l.price * l.qty) + '</i></div>';
    }).join('');
    $('#okTotal').textContent = money(o.totals.total);
    $('#okAddr').innerHTML = o.address ? ('<b>' + esc(o.address.label) + '</b><br>' + esc(o.address.name) + '<br>' + esc(o.address.line) + '<br>' + esc(o.address.city)) : '';
    $('#okPay').textContent = o.payment || '';

    /* this storefront sends no mail, so offer the rendered confirmation
       instead of silently promising one */
    var note = $('.ok-note');
    if (note && !$('#okMail')) {
      note.insertAdjacentHTML('afterend',
        '<p class="ok-note" style="margin-top:6px"><a id="okMail" href="email-preview.html" ' +
        'style="color:#B89A62;text-decoration:underline;text-underline-offset:3px">' +
        'Preview the confirmation email</a></p>');
    }
    setStepper(3);
    revealPage();
    if (!reduced && window.gsap) {
      gsap.fromTo('#okTick', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'luxOut', delay: 0.25 });
      gsap.fromTo($$('.ok-card > *'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'luxOut', stagger: 0.07, delay: 0.35 });
    }
  }

  /* ---------- 11 · ORDER TRACKING ---------- */
  var STAGES = [
    { t: 'Order Placed',    d: 'We have your order and payment.' },
    { t: 'Processing',      d: 'We’ll notify you once it is packed.' },
    { t: 'Shipped',         d: 'On its way from our atelier.' },
    { t: 'Out for Delivery',d: 'Arriving with you today.' },
    { t: 'Delivered',       d: 'Thank you for being part of our story.' }
  ];
  function viewTrack() {
    var all = Orders.all();
    var o = Orders.byId(qs('o')) || all[0];
    if (!o) {
      $('#trkWrap').innerHTML = '<div class="cart-empty"><p>No orders yet.</p><em>Your orders will appear here.</em>' +
        '<a class="sh-cta" href="category.html?c=women"><span class="sh-cta-l">Start Shopping</span></a></div>';
      revealPage(); return;
    }
    /* the stage advances with elapsed time so tracking feels alive */
    var mins = (Date.now() - o.placed) / 60000;
    var stage = mins > 8 ? 4 : mins > 5 ? 3 : mins > 3 ? 2 : mins > 1 ? 1 : 0;

    $('#trkNum').textContent = '#' + o.id;
    $('#trkWhen').textContent = new Date(o.placed).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    $('#trkSteps').innerHTML = STAGES.map(function (s, i) {
      return '<li class="trk' + (i <= stage ? ' is-done' : '') + (i === stage ? ' is-now' : '') + '">' +
        '<span class="trk-dot" aria-hidden="true"><svg viewBox="0 0 14 11"><path d="M1 5.6 5 9.6 13 1.4"/></svg></span>' +
        '<span class="trk-b"><b>' + esc(s.t) + '</b><em>' + esc(s.d) + '</em>' +
        (i === 0 ? '<i>' + new Date(o.placed).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</i>' : '') +
        '</span></li>';
    }).join('');
    $('#trkLines').innerHTML = o.lines.map(function (l) {
      return '<div class="ok-l"><img src="' + l.img + '" alt="' + esc(l.title) + '">' +
        '<span><b>' + esc(l.title) + '</b><em>Qty: ' + l.qty + '</em></span><i>' + money(l.price * l.qty) + '</i></div>';
    }).join('');
    $('#trkTotal').textContent = money(o.totals.total);
    $('#trkAddr').innerHTML = o.address ? (esc(o.address.name) + '<br>' + esc(o.address.line) + '<br>' + esc(o.address.city)) : '';

    /* order history */
    if (all.length > 1) {
      $('#trkHist').innerHTML = all.map(function (x) {
        return '<a class="trk-h' + (x.id === o.id ? ' is-on' : '') + '" href="track.html?o=' + x.id + '">' +
          '<b>#' + x.id + '</b><em>' + new Date(x.placed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + '</em>' +
          '<i>' + money(x.totals.total) + '</i></a>';
      }).join('');
    } else { $('#trkHistWrap').style.display = 'none'; }

    revealPage();
    if (!reduced && window.gsap) gsap.fromTo($$('.trk'), { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'luxOut', stagger: 0.09, delay: 0.3 });
  }

  /* ============================================================
     DISPATCH
     ============================================================ */
  var views = { category: viewCategory, shop: viewShop, product: viewProduct,
                cart: viewCart, checkout: viewCheckout, order: viewOrder, track: viewTrack };
  function boot() {
    try { if (views[VIEW]) views[VIEW](); else revealPage(); }
    catch (err) { body.classList.add('is-live'); throw err; }
    wireWishButtons(document);
    syncBadges();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.__mahiraShop = { Cart: Cart, Wish: Wish, Orders: Orders, Addresses: Addresses, money: money };
})();
