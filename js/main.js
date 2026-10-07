/* ============================================================
   MAHIRA SELECT — cinematic choreography
   One continuous sequence: darkness → golden light → the M is
   drawn → the ring is traced → the crest blooms → MAHIRA →
   SELECT → the identity settles into the header → curtains part
   → women's hero → men's campaign → the living site.
   ============================================================ */
(function () {
  'use strict';

  var D = window.MAHIRA_LOGO;
  var reduced = (new URLSearchParams(window.location.search).get('nomotion') === '1');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  if (window.gsap && window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    gsap.ticker.lagSmoothing(0);
    CustomEase.create('luxOut', 'M0,0 C0.16,0.68 0.26,0.94 1,1');
    CustomEase.create('luxIO', 'M0,0 C0.62,0 0.16,1 1,1');
    /* One curve for the whole parting. The first segment is the nudge as the
       panels take up slack; it hands over to the sweep at a live, non-zero
       slope, so the fabric never comes to rest part-way. The long tail is the
       weighted deceleration of heavy cloth. */
    CustomEase.create('drape',
      'M0,0 C0.08,0.004 0.16,0.032 0.22,0.085 C0.34,0.19 0.62,1 1,1');
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  var EC = { x: D.center.x, y: D.center.y };
  var ornaments = [].concat(D.orn.ne, D.orn.nw, D.orn.se, D.orn.sw);

  /* ============================================================
     LOGO BUILD (traced vectors -> live SVG)
     ============================================================ */
  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function goldDefs(defs, id) {
    var gold = el('linearGradient', { id: id, gradientUnits: 'userSpaceOnUse', x1: 430, y1: 120, x2: 1180, y2: 850 }, defs);
    [['0%', '#8a6420'], ['32%', '#c9a35f'], ['50%', '#f0d48c'], ['68%', '#c9a35f'], ['100%', '#7c5a1d']].forEach(function (s) {
      el('stop', { offset: s[0], 'stop-color': s[1] }, gold);
    });
  }

  function buildLogo(svg) {
    var defs = el('defs', {}, svg);
    goldDefs(defs, 'lgGold');
    var wmGold = el('linearGradient', { id: 'lgWmGold', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 1000, x2: 1600, y2: 1180 }, defs);
    [['0%', '#9a7226'], ['30%', '#d9b269'], ['50%', '#f2d896'], ['70%', '#d9b269'], ['100%', '#9a7226']].forEach(function (s) {
      el('stop', { offset: s[0], 'stop-color': s[1] }, wmGold);
    });
    var selGold = el('linearGradient', { id: 'lgSelGold', gradientUnits: 'userSpaceOnUse', x1: 280, y1: 0, x2: 1320, y2: 0 }, defs);
    [['0%', '#8a6420'], ['45%', '#e7c87f'], ['60%', '#f0d48c'], ['100%', '#8a6420']].forEach(function (s) {
      el('stop', { offset: s[0], 'stop-color': s[1] }, selGold);
    });
    // clip for the specular sweep across the M
    var clip = el('clipPath', { id: 'lgSheenClip' }, defs);
    var clipRect = el('rect', { x: -420, y: 240, width: 260, height: 480, transform: 'skewX(-18)' }, clip);

    var gAll = el('g', { id: 'lgAll' }, svg);
    var gEmblem = el('g', { id: 'lgEmblem' }, gAll);
    var ring = el('circle', {
      id: 'lgRing', cx: EC.x, cy: EC.y, r: D.ring.r,
      fill: 'none', stroke: 'url(#lgGold)', 'stroke-width': D.ring.w + 1,
      pathLength: 1000, 'stroke-dasharray': 1000, 'stroke-dashoffset': 1000,
      transform: 'rotate(-90 ' + EC.x + ' ' + EC.y + ')'
    }, gEmblem);
    var mStroke = el('path', {
      id: 'lgMStroke', d: D.m.d, fill: 'none',
      stroke: '#f4d98d', 'stroke-width': 2.6, opacity: 0,
      pathLength: 1000, 'stroke-dasharray': 1000, 'stroke-dashoffset': 1000
    }, gEmblem);
    el('path', { id: 'lgMFill', d: D.m.d, fill: 'url(#lgGold)', 'fill-rule': 'evenodd' }, gEmblem);
    el('path', {
      id: 'lgMHot', d: D.m.d, fill: '#fff3cf', 'fill-rule': 'evenodd',
      opacity: 0, 'clip-path': 'url(#lgSheenClip)'
    }, gEmblem);

    var gDia = el('g', { id: 'lgDia' }, gEmblem);
    ['n', 's', 'e', 'w'].forEach(function (k) {
      if (D.diamonds[k]) el('path', { d: D.diamonds[k].d, fill: 'url(#lgGold)', 'fill-rule': 'evenodd', 'class': 'lg-dia lg-dia-' + k }, gDia);
    });
    var gOrn = el('g', { id: 'lgOrn' }, gEmblem);
    ornaments.forEach(function (o) {
      el('path', { d: o.d, fill: 'url(#lgGold)', 'fill-rule': 'evenodd', 'class': 'lg-orn' }, gOrn);
    });

    var gMah = el('g', { id: 'lgMah' }, gAll);
    D.mahira.forEach(function (l) {
      el('path', { d: l.d, fill: 'url(#lgWmGold)', 'fill-rule': 'evenodd', 'class': 'lg-mah' }, gMah);
    });
    var gMahCream = el('g', { id: 'lgMahCream', opacity: 0 }, gAll);
    D.mahira.forEach(function (l) {
      el('path', { d: l.d, fill: '#efe6cf', 'fill-rule': 'evenodd' }, gMahCream);
    });

    var gSel = el('g', { id: 'lgSel' }, gAll);
    D.select.letters.forEach(function (l) {
      el('path', { d: l.d, fill: 'url(#lgSelGold)', 'fill-rule': 'evenodd', 'class': 'lg-sel' }, gSel);
    });
    D.select.lines.forEach(function (l, i) {
      el('rect', { x: l.x, y: l.y, width: l.w, height: Math.max(l.h, 6), fill: 'url(#lgSelGold)', 'class': 'lg-line lg-line-' + i }, gSel);
    });

    /* a single champagne light that passes through the whole identity */
    var bright = el('filter', { id: 'lgBright', x: '-25%', y: '-25%', width: '150%', height: '150%' }, defs);
    el('feColorMatrix', { type: 'matrix', values: '0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.8  0 0 0 1 0' }, bright);
    var sweepClip = el('clipPath', { id: 'lgSweepClip' }, defs);
    var sweepRect = el('rect', { x: -900, y: -500, width: 300, height: 2400, transform: 'skewX(-16)' }, sweepClip);
    var sheen = el('use', { id: 'lgSheen', 'clip-path': 'url(#lgSweepClip)', filter: 'url(#lgBright)', opacity: 0 }, svg);
    sheen.setAttribute('href', '#lgAll');
    sheen.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#lgAll');

    return { ring: ring, mStroke: mStroke, sheenRect: clipRect, sweepRect: sweepRect, sheen: sheen };
  }

  function buildEmblemOnly(svg, gid) {
    if (!svg) return;
    var defs = el('defs', {}, svg);
    goldDefs(defs, gid);
    var g = el('g', {}, svg);
    el('circle', { cx: EC.x, cy: EC.y, r: D.ring.r, fill: 'none', stroke: 'url(#' + gid + ')', 'stroke-width': D.ring.w + 1 }, g);
    el('path', { d: D.m.d, fill: 'url(#' + gid + ')', 'fill-rule': 'evenodd' }, g);
    ['n', 'e', 's', 'w'].forEach(function (k) {
      if (D.diamonds[k]) el('path', { d: D.diamonds[k].d, fill: 'url(#' + gid + ')', 'fill-rule': 'evenodd' }, g);
    });
    ornaments.forEach(function (o) { el('path', { d: o.d, fill: 'url(#' + gid + ')', 'fill-rule': 'evenodd' }, g); });
  }

  var brandSvg = $('#brandLogo');
  var logoParts = buildLogo(brandSvg);
  buildEmblemOnly($('#footEmblem'), 'ftGold');
  buildEmblemOnly($('#menuEmblem'), 'mmGold');

  /* ============================================================
     DUST — particles + light glows on one canvas
     ============================================================ */
  var dust = (function () {
    var cv = $('#dust'), ctx = cv.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    var W = 0, H = 0, running = false, raf = 0;
    var parts = [];
    var glows = { core: { x: 0, y: 0, r: 60, a: 0 }, m: { x: 0, y: 0, r: 120, a: 0 }, tip: { x: 0, y: 0, r: 34, a: 0 } };

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    var sprite = (function () {
      var s = document.createElement('canvas'); s.width = s.height = 128;
      var c = s.getContext('2d');
      var g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,244,214,1)');
      g.addColorStop(0.25, 'rgba(244,217,141,0.65)');
      g.addColorStop(0.6, 'rgba(219,168,84,0.18)');
      g.addColorStop(1, 'rgba(219,168,84,0)');
      c.fillStyle = g; c.fillRect(0, 0, 128, 128);
      return s;
    })();

    function emit(x, y, n, o) {
      o = o || {};
      var cap = W <= 700 ? 150 : 300;
      for (var i = 0; i < n; i++) {
        if (parts.length > cap) break;
        var a = Math.random() * Math.PI * 2;
        var sp = (o.speed || 26) * (0.3 + Math.random());
        parts.push({
          x: x + (Math.random() - 0.5) * (o.spread || 10),
          y: y + (Math.random() - 0.5) * (o.spread || 10),
          vx: Math.cos(a) * sp + (o.vx || 0),
          vy: Math.sin(a) * sp + (o.vy || 0) - (o.rise || 8),
          life: 0,
          max: (o.life || 1.6) * (0.5 + Math.random()),
          r: (o.r || 1.6) * (0.4 + Math.random() * 1.2),
          tw: Math.random() * Math.PI * 2
        });
      }
      wake();
    }

    var last = 0;
    function frame(t) {
      raf = 0;
      var dt = Math.min((t - last) / 1000 || 0.016, 0.05); last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (var k in glows) {
        var g = glows[k];
        if (g.a > 0.004) {
          ctx.globalAlpha = g.a;
          ctx.drawImage(sprite, g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
        }
      }
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life += dt;
        if (p.life > p.max) { parts.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= (1 - 1.4 * dt); p.vy = p.vy * (1 - 1.2 * dt) - 6 * dt;
        var f = p.life / p.max;
        var tw = 0.72 + 0.28 * Math.sin(p.tw + p.life * 9);
        ctx.globalAlpha = Math.max(0, (f < 0.18 ? f / 0.18 : 1 - (f - 0.18) / 0.82)) * 0.9 * tw;
        var r = p.r * (2.4 + f);
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (running) raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf && running) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    return {
      emit: emit, glows: glows,
      start: function () { running = true; wake(); },
      stop: function () { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, W, H); cv.style.display = 'none'; }
    };
  })();

  /* map logo viewBox coords -> screen px (accounts for current transform) */
  function logoPoint(vx, vy) {
    var r = brandSvg.getBoundingClientRect();
    var s = r.width / 1600;
    return { x: r.left + vx * s, y: r.top + vy * s, s: s };
  }

  /* ============================================================
     STATE / ELEMENTS
     ============================================================ */
  var body = document.body;
  var brand = $('#brand');
  var cinema = $('#cinema');
  var curtains = $('#curtains');
  var heroSec = $('#hero');
  var slides = $$('.slide');
  var contents = slides.map(function (s) { return $('.slide-content', s); });
  var imgs = slides.map(function (s) { return $('img', s); });
  var veils = slides.map(function (s) { return $('.veil', s); });
  var inds = $$('.ind');
  var skipBtn = $('#skipIntro');
  var flare = { line: $('.flare-line'), vert: $('.flare-vert'), core: $('.flare-core'), floor: $('.cin-floor'), wrap: $('.cin-flare') };
  var curt = {
    left: $('.c-left'), right: $('.c-right'),
    foldsL: $$('.c-left .folds i'), foldsR: $$('.c-right .folds i'),
    glow: $('.curtain-glow'), shL: $('.cs-left'), shR: $('.cs-right')
  };

  var hero = { idx: 0, busy: false, timer: 0, started: false, token: 0, unlock: 0 };
  var introDone = false;

  /* ============================================================
     INTRO — the identity is formed, then opens the house
     ============================================================ */
  function setIntroInitialStates() {
    document.documentElement.style.overflow = 'hidden';
    /* Start with emblem container ready but individual vector elements hidden */
    gsap.set(brandSvg, { opacity: 1 });
    gsap.set('#lgMFill', { opacity: 0 });
    gsap.set('#lgMStroke', { opacity: 0, attr: { 'stroke-dashoffset': 1000 } });
    gsap.set(['#lgMHot', '#lgMahCream'], { opacity: 0 });
    gsap.set('#lgRing', { opacity: 0, attr: { 'stroke-dashoffset': 1000 } });
    gsap.set('.lg-dia', { scale: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set('.lg-orn', { scale: 0.12, opacity: 0, transformOrigin: '801px 470px' });
    gsap.set('.lg-mah', { y: 22, opacity: 0 });
    gsap.set('.lg-sel', { y: 14, opacity: 0 });
    gsap.set(['.lg-line-0', '.lg-line-1'], { scaleX: 0, transformOrigin: 'center center' });
    if (logoParts.sheen) gsap.set(logoParts.sheen, { opacity: 0 });
    gsap.set(slides[0], { xPercent: 0 });
    gsap.set(imgs[0], { scale: 1.06, xPercent: 0 });
    /* Closed velvet curtains and active cinema */
    gsap.set(curt.left, { xPercent: 0 });
    gsap.set(curt.right, { xPercent: 0 });
    gsap.set(curt.foldsL, { scaleX: 1 });
    gsap.set(curt.foldsR, { scaleX: 1 });
    gsap.set(curt.glow, { opacity: 0, scaleX: 0.08 });
    curtains.style.visibility = 'visible';
    curtains.style.opacity = '1';
    curtains.style.display = 'block';
    curtains.style.pointerEvents = 'auto';
    cinema.style.display = 'block';
    cinema.style.opacity = '1';
    cinema.style.pointerEvents = 'auto';
  }

  function centerBrand() {
    gsap.set(brand, { clearProps: 'transform' });
    var r = brand.getBoundingClientRect();
    var vw = window.innerWidth, vh = window.innerHeight;
    var mobile = vw <= 767;
    var targetH = mobile
      ? Math.min(vh * 0.42, vw * 0.80 * (1351 / 1600))
      : Math.min(vh * 0.54, vw * 0.44 * (1351 / 1600));
    var scale = targetH / r.height;
    var dx = vw / 2 - (r.left + r.width / 2);
    var dy = vh * 0.5 - (r.top + r.height / 2);
    gsap.set(brand, { x: dx, y: dy, scale: scale, transformOrigin: '50% 50%' });
  }

  var introResize = null;
  function buildIntro() {
    centerBrand();

    introResize = function () {
      var t = window.__introTl;
      if (introDone || !t || t.time() >= 2.85) return;
      centerBrand();
    };
    window.addEventListener('resize', introResize);

    cinema.style.display = 'block';
    cinema.style.opacity = '1';
    curtains.style.visibility = 'visible';
    curtains.style.opacity = '1';
    curtains.style.display = 'block';
    curtains.style.pointerEvents = 'auto';
    skipBtn.classList.add('is-shown');
    skipBtn.style.display = 'block';
    dust.start();

    var tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: function () {
        introDone = true;
        curtains.style.pointerEvents = 'none';
        cinema.style.pointerEvents = 'none';
        if (introResize) window.removeEventListener('resize', introResize);
      }
    });
    window.__introTl = tl;

    /* Click anywhere during intro to accelerate to curtains or open */
    function onStageClick() {
      if (introDone) return;
      if (tl && tl.isActive()) {
        if (tl.time() < 2.85) {
          tl.seek(2.85); // fast forward to curtain reveal and glide
        } else {
          applyFinalState();
        }
      } else {
        applyFinalState();
      }
    }
    curtains.onclick = onStageClick;
    cinema.onclick = onStageClick;

    /* —— 0.00s · Phase 1: Void darkness, laser beam bloom & flare core (Frames 1-2) —— */
    tl.fromTo(flare.wrap, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
      .fromTo(flare.core, { scale: 0.1, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.55, ease: 'sine.out' }, 0)
      .fromTo(flare.line, { scaleX: 0.04, opacity: 0 }, { scaleX: 1, opacity: 0.9, duration: 0.7, ease: 'luxOut' }, 0.04)
      .fromTo(flare.vert, { scaleY: 0.05, opacity: 0 }, { scaleY: 1, opacity: 0.8, duration: 0.65, ease: 'luxOut' }, 0.04)
      .fromTo(flare.floor, { opacity: 0 }, { opacity: 0.6, duration: 0.8, ease: 'sine.out' }, 0.08);

    /* Golden sparkling dust burst from the core */
    tl.add(function () {
      var pt = logoPoint(801, 470);
      dust.emit(pt.x, pt.y, 35, { speed: 30, spread: 25, life: 1.8 });
    }, 0.2);

    /* —— 0.40s · Phase 2: Monogram "M" Stroke Tracing & Antique Gold Fill (Frames 3-4) —— */
    tl.set('#lgMStroke', { opacity: 1 }, 0.4)
      .fromTo('#lgMStroke',
        { attr: { 'stroke-dashoffset': 1000 } },
        { attr: { 'stroke-dashoffset': 0 }, duration: 0.55, ease: 'power2.inOut' }, 0.4)
      .add(function () {
        var pt = logoPoint(798, 470);
        dust.emit(pt.x, pt.y, 30, { speed: 20, spread: 35, life: 1.6 });
      }, 0.5)
      .fromTo('#lgMFill',
        { opacity: 0, scale: 0.94, transformOrigin: '798px 470px' },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'luxOut' }, 0.75)
      .to('#lgMStroke', { opacity: 0, duration: 0.35 }, 0.95);

    /* —— 0.95s · Phase 3: Golden Halo Ring Tracing Clockwise (Frames 5-6) —— */
    tl.set('#lgRing', { opacity: 1 }, 0.95)
      .fromTo('#lgRing',
        { attr: { 'stroke-dashoffset': 1000 } },
        { attr: { 'stroke-dashoffset': 0 }, duration: 0.65, ease: 'power2.inOut' }, 0.95)
      .add(function () {
        var p1 = logoPoint(801, 470 - 364);
        dust.emit(p1.x, p1.y, 16, { speed: 18, spread: 15, life: 1.2 });
      }, 1.0)
      .add(function () {
        var p2 = logoPoint(801 + 364, 470);
        dust.emit(p2.x, p2.y, 16, { speed: 18, spread: 15, life: 1.2 });
      }, 1.25)
      .add(function () {
        var p3 = logoPoint(801, 470 + 364);
        dust.emit(p3.x, p3.y, 16, { speed: 18, spread: 15, life: 1.2 });
      }, 1.45);

    /* —— 1.55s · Phase 4: 4 Cardinal Diamonds & Royal Filigree Bloom (Frames 7-8) —— */
    tl.fromTo('.lg-dia',
      { scale: 0, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(2)', stagger: 0.05 }, 1.55)
      .add(function () {
        var pt = logoPoint(801, 470);
        dust.emit(pt.x, pt.y, 28, { speed: 28, spread: 45, life: 1.6 });
      }, 1.6)
      .fromTo('.lg-orn',
        { scale: 0.15, opacity: 0, transformOrigin: '801px 470px' },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.012 }, 1.75);

    /* —— 2.15s · Phase 5: "MAHIRA" & "SELECT" Entrance (Frame 9) —— */
    tl.fromTo('.lg-mah',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.42, stagger: 0.035, ease: 'luxOut' }, 2.15)
      .fromTo('.lg-sel',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: 'luxOut' }, 2.35)
      .fromTo(['.lg-line-0', '.lg-line-1'],
        { scaleX: 0, transformOrigin: 'center center' },
        { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 2.35);

    /* —— 2.50s · Phase 6: Specular Champagne Sheen & Crest Radiance —— */
    tl.set(logoParts.sheen, { opacity: 0.95 }, 2.5)
      .fromTo(logoParts.sweepRect, { attr: { x: -900 } },
        { attr: { x: 1800 }, duration: 0.7, ease: 'sine.inOut' }, 2.5)
      .set(logoParts.sheen, { opacity: 0 }, 3.25)
      .add(function () {
        var pt = logoPoint(801, 470);
        dust.emit(pt.x, pt.y, 40, { speed: 32, spread: 60, life: 1.8 });
      }, 2.55);

    /* —— 2.85s · Phase 7: Dissolve Void to Velvet Curtains & Glide Logo to Header (Frames 10-12) —— */
    tl.addLabel('travel', 2.85)
      .to(cinema, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 'travel')
      .to([flare.wrap, flare.core, flare.line, flare.vert, flare.floor], { opacity: 0, duration: 0.5 }, 'travel')
      .to(brand, { x: 0, y: 0, scale: 1, duration: 1.05, ease: 'luxIO' }, 'travel')
      .fromTo(curt.glow, { opacity: 0, scaleX: 0.1 },
        { opacity: 0.85, scaleX: 1.1, duration: 0.8, ease: 'sine.out' }, 'travel+=0.2')
      .add(function () { body.classList.add('is-ready'); }, 'travel+=0.3');

    /* —— 3.40s · Phase 8: Burgundy Velvet Curtains Part in 3D Drape Physics (Frames 13-16) —— */
    tl.addLabel('open', 3.4)
      .to(curt.glow, { opacity: 1, scaleX: 0.35, duration: 0.45, ease: 'luxIO' }, 'open')
      .to(curt.left, { xPercent: -112, duration: 1.85, ease: 'drape' }, 'open')
      .to(curt.right, { xPercent: 112, duration: 1.85, ease: 'drape' }, 'open')
      .to(curt.foldsL, { scaleX: 0.62, duration: 1.85, ease: 'drape', stagger: { each: 0.03, from: 'end' }, transformOrigin: '0% 50%' }, 'open')
      .to(curt.foldsR, { scaleX: 0.62, duration: 1.85, ease: 'drape', stagger: { each: 0.03, from: 'start' }, transformOrigin: '100% 50%' }, 'open')
      .to([curt.left, curt.right], { skewY: 0.35, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'open+=0.35')
      .to(curt.shL, { xPercent: -560, opacity: 0, duration: 1.85, ease: 'drape' }, 'open')
      .to(curt.shR, { xPercent: 560, opacity: 0, duration: 1.85, ease: 'drape' }, 'open')
      .to(curt.glow, { opacity: 0, scaleX: 3.0, duration: 0.9, ease: 'sine.out' }, 'open+=0.5')
      .to(imgs[0], { scale: 1, duration: 2.2, ease: 'power2.out' }, 'open+=0.2')
      .to(curtains, { opacity: 0, duration: 0.4 }, 'open+=1.7')
      .set([curtains, cinema], { display: 'none', visibility: 'hidden' }, 'open+=1.9');

    /* —— 4.05s · Living Storefront Revealed —— */
    tl.add(function () { contents[0].classList.add('in'); }, 'open+=0.65')
      .add(function () {
        body.classList.remove('is-loading');
        if (!body.classList.contains('hero-only')) document.documentElement.style.overflow = '';
        skipBtn.classList.remove('is-shown');
        dust.stop();
      }, 'open+=1.2')
      .add(function () { startHeroLoop(); }, 'open+=1.8');

    return tl;
  }

  /* ============================================================
     FINAL STATE (skip / reduced motion)
     ============================================================ */
  function applyFinalState() {
    if (window.__introTl) { window.__introTl.kill(); window.__introTl = null; }
    dust.stop();
    cinema.style.display = 'none';
    cinema.style.opacity = '0';
    curtains.style.visibility = 'hidden';
    curtains.style.opacity = '0';
    curtains.style.display = 'none';
    curtains.style.pointerEvents = 'none';
    skipBtn.classList.remove('is-shown');
    skipBtn.style.display = 'none';

    gsap.set(brand, { clearProps: 'transform' });
    gsap.set(brandSvg, { opacity: 1, scale: 1 });
    gsap.set('#lgMFill', { opacity: 1, scale: 1 });
    if (logoParts.sheen) gsap.set(logoParts.sheen, { opacity: 0 });
    gsap.set(['#lgMStroke', '#lgMHot'], { opacity: 0 });
    gsap.set('#lgRing', { opacity: 1, attr: { 'stroke-dashoffset': 0 } });
    gsap.set(['.lg-dia', '.lg-orn'], { scale: 1, opacity: 1 });
    gsap.set('.lg-mah', { y: 0, opacity: 1 });
    gsap.set('.lg-sel', { y: 0, opacity: 1 });
    gsap.set(['.lg-line-0', '.lg-line-1'], { scaleX: 1 });
    gsap.set(slides[0], { xPercent: 0 });
    gsap.set(imgs[0], { scale: 1, xPercent: 0 });

    body.classList.add('is-ready');
    body.classList.remove('is-loading');
    document.documentElement.style.overflow = '';
    contents[0].classList.add('in');
    introDone = true;
    startHeroLoop();
  }

  skipBtn.addEventListener('click', applyFinalState);
  if (document.body.classList.contains('hero-only')) skipBtn.style.display = 'none';

  /* Click anywhere on the curtain or cinema to open or advance */
  function onStageClick() {
    if (window.__introTl && window.__introTl.isActive()) {
      if (window.__introTl.time() < 2.85) {
        window.__introTl.seek(2.85);
      } else {
        applyFinalState();
      }
    } else {
      applyFinalState();
    }
  }
  curtains.addEventListener('click', onStageClick);
  cinema.addEventListener('click', onStageClick);

  /* Replay Curtain Intro capability */
  window.replayIntro = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.__introTl) { window.__introTl.kill(); window.__introTl = null; }
    introDone = false;
    body.classList.add('is-loading');
    body.classList.remove('is-ready');
    setIntroInitialStates();
    requestAnimationFrame(function () {
      buildIntro();
    });
  };

  /* Brand click replays intro if already at top of home page */
  brand.addEventListener('click', function (e) {
    if (window.scrollY < 120 && introDone) {
      e.preventDefault();
      window.replayIntro();
    }
  });

  /* Wire replay buttons */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action="replay-intro"], .replay-curtain-btn');
    if (b) {
      e.preventDefault();
      window.replayIntro();
    }
  });

  /* ============================================================
     HERO ENGINE — women ⇄ men, one unified composition
     ============================================================ */
  var HOLD_WOMEN = 4500, HOLD_MEN = 5500, TRANS = 1.6;
  function heroCycles() { return slides.length > 1; }

  function schedule() {
    clearTimeout(hero.timer);
    if (!heroCycles()) return;                  // the second campaign is a mobile behaviour
    if (document.hidden || heroVisible === false) return;
    hero.timer = setTimeout(function () {
      goTo(hero.idx === 0 ? 1 : 0);
    }, hero.idx === 0 ? HOLD_WOMEN : HOLD_MEN);
  }

  function startHeroLoop() {
    // Manual navigation — indicators, swipe, links — is live either way, so the
    // flag is set unconditionally. schedule() re-checks breakpoint, tab
    // visibility and hero visibility and clears any pending timer, so calling
    // it again is always safe and never leaves a stale countdown behind.
    hero.started = true;
    schedule();
  }

  function goTo(n) {
    if (!slides[n] || hero.busy || n === hero.idx || !hero.started) { return; }
    hero.busy = true;
    clearTimeout(hero.timer);
    var myToken = ++hero.token;
    var c = hero.idx, dir = n > c ? 1 : -1;
    var cur = slides[c], nxt = slides[n];

    // Watchdog: a backgrounded or throttled tab can freeze the slide timeline
    // part-way, with both campaigns parked off-stage. Unlocking alone would
    // leave the hero blank, so snap to the destination and finish properly.
    clearTimeout(hero.unlock);
    hero.unlock = setTimeout(function () {
      if (hero.token !== myToken || !hero.busy) return;
      gsap.killTweensOf([cur, nxt, imgs[c], imgs[n], veils[c], veils[n]]);
      gsap.set(nxt, { xPercent: 0, opacity: 1 });
      gsap.set(imgs[n], { xPercent: 0, scale: 1 });
      gsap.set(veils[n], { opacity: 0 });
      contents[n].classList.add('in');
      finish();
    }, (TRANS + 3) * 1000);

    inds.forEach(function (b, i) {
      b.classList.toggle('is-on', i === n);
      b.setAttribute('aria-selected', i === n ? 'true' : 'false');
    });
    heroSec.classList.toggle('show-men', n === 1);

    // typography leaves with the image — same direction, same moment
    contents[c].style.setProperty('--exit-x', (-34 * dir) + 'px');
    contents[c].classList.add('out');

    nxt.classList.add('is-active');
    nxt.setAttribute('aria-hidden', 'false');
    cur.setAttribute('aria-hidden', 'true');

    if (reduced) {
      gsap.set(nxt, { xPercent: 0, opacity: 0 });
      gsap.set(imgs[n], { xPercent: 0, scale: 1 });
      gsap.timeline({ onComplete: finish })
        .to(nxt, { opacity: 1, duration: 0.8, ease: 'sine.inOut' })
        .add(function () { contents[n].classList.add('in'); }, 0.4);
      return;
    }

    gsap.set(nxt, { xPercent: 100 * dir, opacity: 1 });
    gsap.set(imgs[n], { xPercent: -16 * dir, scale: 1.05 });
    gsap.set(veils[n], { opacity: 0.35 });

    gsap.timeline({ defaults: { ease: 'luxIO' }, onComplete: finish })
      .to(cur, { xPercent: -28 * dir, duration: TRANS }, 0)
      .to(imgs[c], { xPercent: 9 * dir, duration: TRANS }, 0)
      .to(veils[c], { opacity: 0.6, duration: TRANS * 0.7 }, 0)
      .to(nxt, { xPercent: 0, duration: TRANS }, 0.02)
      .to(imgs[n], { xPercent: 0, duration: TRANS + 0.22 }, 0.02)
      .to(veils[n], { opacity: 0, duration: TRANS }, 0.2)
      .to(imgs[n], { scale: 1, duration: 1.5, ease: 'power2.out' }, TRANS * 0.5)
      .add(function () { contents[n].classList.add('in'); }, TRANS * 0.32);

    function finish() {
      cur.classList.remove('is-active');
      contents[c].classList.remove('in');
      contents[c].classList.remove('out');
      gsap.set(cur, { xPercent: 0 });
      gsap.set(imgs[c], { xPercent: 0, scale: 1.0 });
      gsap.set(veils[c], { opacity: 0 });
      hero.idx = n;
      if (hero.token === myToken) {
        clearTimeout(hero.unlock);
        hero.busy = false;
        schedule();
      }
    }
  }

  inds.forEach(function (b) {
    b.addEventListener('click', function () { goTo(parseInt(b.getAttribute('data-slide'), 10)); });
  });

  /* swipe between campaigns — a first-class touch gesture */
  (function () {
    var sx = 0, sy = 0, live = false;
    heroSec.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { live = false; return; }
      live = true;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    heroSec.addEventListener('touchend', function (e) {
      if (!live || !introDone) return;
      live = false;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      goTo(dx < 0 ? 1 : 0);
    }, { passive: true });
  })();

  $$('a[data-slide]').forEach(function (a) {
    a.addEventListener('click', function () {
      var n = parseInt(a.getAttribute('data-slide'), 10);
      if (a.closest('#mobileNav')) closeNav();
      if (introDone) {
        gsap.delayedCall(0.35, function () { goTo(n); });
      }
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(hero.timer);
    else if (hero.started && !hero.busy) schedule();
    // the film waits while nobody is watching
    var t = window.__introTl;
    if (t && !introDone) { if (document.hidden) t.pause(); else t.resume(); }
  });

  // the campaigns only alternate while the hero is on stage
  var heroVisible = true;
  new IntersectionObserver(function (en) {
    heroVisible = en[0].isIntersecting;
    if (!hero.started) return;
    if (!heroVisible) clearTimeout(hero.timer);
    else if (!hero.busy) schedule();
  }, { threshold: 0.25 }).observe(heroSec);

  /* ============================================================
     NAVIGATION — one tree drives the desktop mega menus, the
     search index and the mobile drill-down. Women & Kalakaari only.
     ============================================================ */
  /* Nav leaves link into the shop, so the menu is a real way in rather than
     a jump to an anchor on this page. The slug matches shop-data.js. */
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function shopHref(key, item) { return 'shop.html?c=' + key + '&s=' + slugify(item); }

  var NAV = {
    women: {
      label: 'Women', href: 'category.html?c=women',
      promo: { img: 'assets/s2-card-women.jpg?v=2', title: 'The Women’s Edit', line: 'Elegance in every drape.' },
      groups: [
        { title: 'Ethnic',     items: ['Sarees', 'Kurta Sets', 'Anarkali', 'Suits', 'Co-ord Sets', 'Lehengas', 'Dresses'] },
        { title: 'Western',    items: ['Dresses', 'Tops', 'Shirts', 'Trousers', 'Skirts', 'Co-ord Sets'] },
        { title: 'Innerwear',  items: ['Bras', 'Panties', 'Lingerie Sets', 'Shapewear'] },
        { title: 'Activewear', items: ['Active Tops', 'Active Bottoms', 'Active Sets'] }
      ]
    },
    men: {
      label: 'Men', href: 'category.html?c=men',
      promo: { img: 'assets/men-clean.jpg?v=3', title: 'The Men’s Edit', line: 'MENSWEAR, MADE SIMPLE.' },
      groups: [
        { title: 'Kurtas & Sets', items: ['Kurtas', 'Kurta Pajama', 'Festive Sets', 'Bandhgalas'] },
        { title: 'Jackets & Shirts', items: ['Nehru Jackets', 'Bandhgala Jackets', 'Handloom Shirts', 'Linen Shirts'] },
        { title: 'Bottom Wear', items: ['Churidars', 'Dhotis', 'Trousers'] }
      ]
    },
    kalakaari: {
      label: 'Kalakaari', href: 'category.html?c=kalakaari',
      promo: { img: 'assets/s2-card-kala.jpg?v=2', title: 'Kalakaari', line: 'Art that tells a story.' },
      groups: [
        { title: 'Sarees',     items: ['Kalamkari Sarees', 'Printed Sarees', 'Handcrafted Sarees'] },
        { title: 'Dress Sets', items: ['Kalamkari Dress Sets', 'Kurta Sets', 'Anarkali Sets'] },
        { title: 'Fabric',     items: ['Kalamkari Fabric', 'Printed Fabric', 'Handcrafted Fabric'] },
        { title: 'Dupattas',   items: ['Kalamkari Dupattas', 'Printed Dupattas', 'Handcrafted Dupattas'] }
      ]
    }
  };

  var header = $('#header');
  var CHEV = '<span class="chev"><svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg></span>';

  function mk(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- overlay bookkeeping ---------- */
  function syncOverlay() {
    var open = megaKey || searchOpen || !!$('.pop.is-open');
    header.classList.toggle('has-overlay', open);
  }

  /* ============================================================
     MEGA MENUS
     ============================================================ */
  var mega = $('#mega'), megaInner = $('.mega-inner', mega), megaSheet = $('.mega-sheet', mega);
  var megaKey = null, megaTl = null, megaTimer = 0;

  function renderMega(key) {
    var c = NAV[key];
    megaInner.innerHTML = '';
    c.groups.forEach(function (g) {
      var col = mk('div', 'mg-col');
      col.appendChild(mk('h4', null, esc(g.title)));
      col.appendChild(mk('i'));
      g.items.forEach(function (it) {
        var a = mk('a', null, esc(it));
        a.href = shopHref(key, it);
        col.appendChild(a);
      });
      megaInner.appendChild(col);
    });
    var promo = mk('a', 'mg-promo');
    promo.href = c.href;
    promo.innerHTML = '<img src="' + c.promo.img + '" alt="" loading="lazy" decoding="async"><span></span>' +
      '<b>' + esc(c.promo.title) + '</b><em>' + esc(c.promo.line) + '</em>';
    megaInner.appendChild(promo);
  }

  function openMega(key) {
    clearTimeout(megaTimer);
    if (megaKey === key) return;
    megaKey = key;
    renderMega(key);
    mega.classList.add('is-open');
    mega.setAttribute('aria-hidden', 'false');
    $$('.nav-side a[data-mega]').forEach(function (a) {
      var on = a.getAttribute('data-mega') === key;
      a.classList.toggle('is-open', on);
      a.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    syncOverlay();
    if (reduced || !window.gsap) { gsap && gsap.set([megaSheet, megaInner], { opacity: 1 }); return; }
    if (megaTl) megaTl.kill();
    megaTl = gsap.timeline();
    megaTl.fromTo(megaSheet, { opacity: 0, scaleY: 0.9 }, { opacity: 1, scaleY: 1, duration: 0.38, ease: 'luxIO' }, 0)
      .fromTo($$('.mg-col, .mg-promo', megaInner), { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, ease: 'luxOut', stagger: 0.05 }, 0.08);
  }

  function closeMega(now) {
    if (!megaKey) return;
    var finish = function () {
      mega.classList.remove('is-open');
      mega.setAttribute('aria-hidden', 'true');
      megaInner.innerHTML = '';
      megaKey = null;
      syncOverlay();
    };
    $$('.nav-side a[data-mega]').forEach(function (a) {
      a.classList.remove('is-open');
      a.setAttribute('aria-expanded', 'false');
    });
    if (reduced || !window.gsap || now) { finish(); return; }
    if (megaTl) megaTl.kill();
    megaTl = gsap.timeline({ onComplete: finish });
    megaTl.to($$('.mg-col, .mg-promo', megaInner), { y: 8, opacity: 0, duration: 0.2, ease: 'sine.in', stagger: 0.02 }, 0)
      .to(megaSheet, { opacity: 0, scaleY: 0.94, duration: 0.26, ease: 'luxIO' }, 0.05);
  }

  $$('.nav-side a[data-mega]').forEach(function (a) {
    var key = a.getAttribute('data-mega');
    a.addEventListener('mouseenter', function () { openMega(key); });
    a.addEventListener('focus', function () { openMega(key); });
    a.addEventListener('click', function () { closeMega(true); });
  });
  $$('.nav-side a:not([data-mega])').forEach(function (a) {
    a.addEventListener('mouseenter', function () { megaTimer = setTimeout(function () { closeMega(); }, 60); });
  });
  header.addEventListener('mouseleave', function () {
    megaTimer = setTimeout(function () { closeMega(); }, 120);
  });
  mega.addEventListener('mouseenter', function () { clearTimeout(megaTimer); });
  mega.addEventListener('click', function (e) { if (e.target.closest('a')) closeMega(true); });

  /* ============================================================
     SEARCH
     ============================================================ */
  var searchPanel = $('#searchPanel'), searchBtn = $('#searchBtn'),
      searchInput = $('#searchInput'), searchList = $('#searchList'), spLabel = $('#spLabel');
  var searchOpen = false;

  var SEARCH_INDEX = (function () {
    var out = [], seen = {};
    Object.keys(NAV).forEach(function (k) {
      var c = NAV[k];
      c.groups.forEach(function (g) {
        var key = g.title.toLowerCase();
        if (!seen[key]) { seen[key] = 1; out.push({ label: g.title, href: c.href, ctx: c.label }); }
        g.items.forEach(function (it) {
          var ik = (c.label + it).toLowerCase();
          if (!seen[ik]) { seen[ik] = 1; out.push({ label: it, href: shopHref(k, it), ctx: c.label }); }
        });
      });
    });
    return out;
  })();
  var POPULAR = ['Sarees', 'Kurta Sets', 'Kalamkari Sarees', 'Lehengas', 'Anarkali', 'Kalamkari Dupattas'];

  function paintSearch(q) {
    searchList.innerHTML = '';
    var rows;
    if (!q) {
      spLabel.textContent = 'Popular Searches';
      rows = POPULAR.map(function (p) {
        var hit = SEARCH_INDEX.filter(function (r) { return r.label.toLowerCase() === p.toLowerCase(); })[0];
        return hit || { label: p, href: '#women-new', ctx: 'Women' };
      });
    } else {
      var needle = q.toLowerCase();
      rows = SEARCH_INDEX.filter(function (r) { return r.label.toLowerCase().indexOf(needle) > -1; }).slice(0, 12);
      spLabel.textContent = rows.length ? 'Suggestions' : 'No Matches';
    }
    if (!rows.length) {
      searchList.appendChild(mk('span', 'sp-none', 'Nothing in the collection matches that — try “sarees” or “kalamkari”.'));
      return;
    }
    rows.forEach(function (r) {
      var a = mk('a', null, esc(r.label));
      a.href = r.href;
      // "Sarees" exists under both Women and Kalakaari and leads to different
      // sections, so the category has to be on screen to tell them apart.
      if (r.ctx) a.appendChild(mk('span', 'sp-ctx', esc(r.ctx)));
      a.addEventListener('click', function () { closeSearch(); });
      searchList.appendChild(a);
    });
  }

  function openSearch() {
    if (searchOpen) return;
    closeMega(true); closePops();
    searchOpen = true;
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    searchBtn.setAttribute('aria-expanded', 'true');
    paintSearch('');
    syncOverlay();
    setTimeout(function () { searchInput.focus(); }, 120);
    if (!reduced && window.gsap) {
      gsap.fromTo($$('.sp-form, .sp-body', searchPanel), { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'luxOut', stagger: 0.07, delay: 0.08 });
    }
  }
  function closeSearch() {
    if (!searchOpen) return;
    searchOpen = false;
    searchPanel.classList.remove('is-open');
    searchPanel.setAttribute('aria-hidden', 'true');
    searchBtn.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    syncOverlay();
  }
  searchBtn.addEventListener('click', function () { searchOpen ? closeSearch() : openSearch(); });
  $('#searchClose').addEventListener('click', closeSearch);
  searchInput.addEventListener('input', function () { paintSearch(searchInput.value.trim()); });
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var first = $('a', searchList);
      if (first) { first.click(); }
      else closeSearch();
    }
  });

  /* ============================================================
     POPOVERS — account / wishlist / bag
     ============================================================ */
  function closePops(except) {
    $$('.pop').forEach(function (p) {
      if (p === except) return;
      if (!p.classList.contains('is-open')) return;
      p.classList.remove('is-open');
      p.setAttribute('aria-hidden', 'true');
      var btn = $('#' + p.id.replace('Pop', 'Btn'));
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    syncOverlay();
  }
  [['acctBtn', 'acctPop'], ['wishBtn', 'wishPop'], ['bagBtn', 'bagPop']].forEach(function (pair) {
    var btn = $('#' + pair[0]), pop = $('#' + pair[1]);
    if (!btn || !pop) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !pop.classList.contains('is-open');
      closePops(pop); closeMega(true); closeSearch();
      pop.classList.toggle('is-open', open);
      pop.setAttribute('aria-hidden', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      syncOverlay();
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
  });
  document.addEventListener('click', function () { closePops(); });
  $('#acctPop').addEventListener('click', function (e) {
    var t = e.target.closest('[data-open="wish"]');
    if (!t) return;
    e.preventDefault();
    closePops();
    $('#wishBtn').click();
  });

  /* ============================================================
     WISHLIST / BAG COUNTS — real state, no invented inventory
     ============================================================ */
  var store = (function () {
    var s = { wishlist: 0, bag: 0 };
    try {
      var raw = localStorage.getItem('mahira.counts');
      if (raw) { var p = JSON.parse(raw); s.wishlist = p.wishlist | 0; s.bag = p.bag | 0; }
    } catch (e) { }
    function paint(which, n) {
      var el = $('#' + which + 'Count');
      if (!el) return;
      el.textContent = n;
      el.classList.toggle('is-on', n > 0);
      if (n > 0 && !reduced && window.gsap) {
        gsap.fromTo(el, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: 'luxOut' });
      }
    }
    function save() {
      try { localStorage.setItem('mahira.counts', JSON.stringify(s)); } catch (e) { }
    }
    function set(which, n) {
      s[which] = Math.max(0, n | 0);
      paint(which === 'wishlist' ? 'wish' : 'bag', s[which]);
      save();
    }
    paint('wish', s.wishlist); paint('bag', s.bag);
    return {
      get: function (w) { return s[w]; },
      set: set,
      add: function (w, n) { set(w, s[w] + (n == null ? 1 : n)); }
    };
  })();

  /* ============================================================
     MOBILE DRILL-DOWN NAVIGATION
     ============================================================ */
  var mobileNav = $('#mobileNav'), mnStage = $('#mnStage'), mnTitle = $('#mnTitle'),
      mnBack = $('#mnBack'), mnClose = $('#mnClose'), menuBtn = $('#menuBtn');
  var emblemHTML = mnTitle.innerHTML;
  var stack = [], curPanel = null;

  function leafPanel(key, cat, group) {
    return {
      title: group.title, lead: cat.label,
      items: group.items.map(function (it) { return { label: it, href: shopHref(key, it), cls: 'mn-l2' }; })
    };
  }
  function catPanel(key) {
    var cat = NAV[key];
    /* the first row is a way straight into the category, so the drawer is
       never a drill-down with no exit */
    var items = [{ label: 'All ' + cat.label, href: cat.href, cls: 'mn-l1' }];
    cat.groups.forEach(function (g) {
      items.push({ label: g.title, cls: 'mn-l1', panel: leafPanel(key, cat, g) });
    });
    return { title: cat.label, lead: 'Categories', items: items };
  }
  function rootPanel() {
    return {
      title: null,
      items: [
        { label: 'Home', href: '#top', cls: 'mn-l0' },
        { label: 'Women', cls: 'mn-l0', panel: catPanel('women') },
        { label: 'Kalakaari', cls: 'mn-l0', panel: catPanel('kalakaari') },
        { label: 'New Arrivals', href: '#women-new', cls: 'mn-l0' },
        { label: 'Best Sellers', href: '#best', cls: 'mn-l0' },
        { label: 'Our Story', href: '#storyEd', cls: 'mn-l0' }
      ]
    };
  }

  function buildPanel(data) {
    var p = mk('div', 'mn-panel');
    if (data.lead) p.appendChild(mk('p', 'mn-lead mn-item', esc(data.lead)));
    data.items.forEach(function (it) {
      var node;
      if (it.panel) {
        node = mk('button', 'mn-item ' + it.cls, '<span>' + esc(it.label) + '</span>' + CHEV);
        node.type = 'button';
        node.addEventListener('click', function () { pushPanel(it.panel, 1); });
      } else {
        node = mk('a', 'mn-item ' + it.cls, '<span>' + esc(it.label) + '</span>');
        node.href = it.href;
        node.addEventListener('click', function () { closeNav(); });
      }
      p.appendChild(node);
    });
    return p;
  }

  function updateTop() {
    var d = stack[stack.length - 1];
    if (d && d.title) mnTitle.textContent = d.title;
    else mnTitle.innerHTML = emblemHTML;
    mobileNav.classList.toggle('has-back', stack.length > 1);
  }

  function pushPanel(data, dir) {
    stack.push(data);
    swapPanel(dir);
  }
  function swapPanel(dir) {
    var data = stack[stack.length - 1];
    var el = buildPanel(data);
    mnStage.appendChild(el);
    var old = curPanel;
    curPanel = el;
    updateTop();
    if (reduced || !window.gsap) { if (old) old.remove(); return; }
    gsap.fromTo(el, { xPercent: dir > 0 ? 100 : -100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.5, ease: 'luxIO' });
    gsap.fromTo($$('.mn-item', el), { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.46, ease: 'luxOut', stagger: 0.045, delay: 0.1 });
    if (old) {
      gsap.to(old, {
        xPercent: dir > 0 ? -30 : 30, opacity: 0, duration: 0.42, ease: 'luxIO',
        onComplete: function () { old.remove(); }
      });
    }
  }
  function popPanel() {
    if (stack.length < 2) return;
    stack.pop();
    swapPanel(-1);
  }

  function openNav() {
    closeMega(true); closeSearch(); closePops();
    stack = [rootPanel()];
    mnStage.innerHTML = '';
    curPanel = null;
    swapPanel(1);
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuBtn.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!mobileNav.classList.contains('is-open')) return;
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (introDone) document.documentElement.style.overflow = '';
    setTimeout(function () {
      if (mobileNav.classList.contains('is-open')) return;
      mnStage.innerHTML = ''; curPanel = null; stack = [];
      mobileNav.classList.remove('has-back');
    }, 460);
  }
  /* X closes everything; Back steps exactly one level */
  function closeMenu() { closeNav(); }

  menuBtn.addEventListener('click', function () {
    mobileNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  mnClose.addEventListener('click', closeNav);
  mnBack.addEventListener('click', popPanel);
  $('.mn-foot .mn-acct').addEventListener('click', closeNav);

  /* ---------- global keyboard ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (searchOpen) { closeSearch(); return; }
    if (mobileNav.classList.contains('is-open')) { closeNav(); return; }
    if ($('.pop.is-open')) { closePops(); return; }
    if (megaKey) closeMega(true);
  });

  /* ---------- sticky header ---------- */
  (function () {
    var ticking = false;
    function apply() {
      ticking = false;
      header.classList.toggle('is-solid', window.scrollY > 46);
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }, { passive: true });
    apply();
  })();

  /* ---------- close the drawer if we grow into the desktop layout ---------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1200 && mobileNav.classList.contains('is-open')) closeNav();
    if (window.innerWidth < 1200) closeMega(true);
    if (!heroCycles()) {
      clearTimeout(hero.timer);
      if (hero.idx !== 0 && !hero.busy) goTo(0);
    } else if (hero.started && !hero.busy) schedule();
  });

  /* public API — counts are real state, wired for a future cart */
  window.mahira = {
    wishlist: { count: function () { return store.get('wishlist'); }, add: function (n) { store.add('wishlist', n); }, set: function (n) { store.set('wishlist', n); } },
    bag: { count: function () { return store.get('bag'); }, add: function (n) { store.add('bag', n); }, set: function (n) { store.set('bag', n); } },
    openSearch: openSearch, closeSearch: closeSearch,
    openNav: openNav, closeNav: closeNav
  };

  /* ============================================================
     SCROLL REVEALS
     ============================================================ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.18 });
  $$('.reveal').forEach(function (elm) {
    var siblings = elm.parentElement ? $$('.reveal', elm.parentElement) : [];
    var idx = siblings.indexOf(elm);
    elm.style.transitionDelay = (Math.max(idx, 0) * 0.09) + 's';
    io.observe(elm);
  });

  /* ============================================================
     LAUNCH — wait for type + imagery, then begin the film
     ============================================================ */
  function elemReady(img) {
    return new Promise(function (res) {
      if (img.complete) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }

  var capped = Promise.race([
    Promise.all([
      (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(),
      elemReady(imgs[0])   // the browser has already picked the right source for this screen
    ]),
    new Promise(function (res) { setTimeout(res, 400); })
  ]);

  if (!window.gsap) {
    document.addEventListener('DOMContentLoaded', function () {
      cinema.style.display = 'none';
      curtains.style.display = 'none';
      body.classList.add('is-ready');
      body.classList.remove('is-loading');
      contents[0].classList.add('in');
    });
  } else if (reduced) {
    applyFinalState();
  } else {
    setIntroInitialStates();   // hide logo parts immediately — no flash before the film
    capped.then(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { buildIntro(); });
      });
    });
  }

  /* ============================================================
     THE CONTINUING STORY — sections below the hero
     ============================================================ */
  function buildFooterLogo(svg) {
    if (!svg) return;
    var defs = el('defs', {}, svg);
    goldDefs(defs, 'fgGold');
    var g = el('g', {}, svg);
    el('circle', { cx: EC.x, cy: EC.y, r: D.ring.r, fill: 'none', stroke: 'url(#fgGold)', 'stroke-width': D.ring.w + 1 }, g);
    el('path', { d: D.m.d, fill: 'url(#fgGold)', 'fill-rule': 'evenodd' }, g);
    ['n', 'e', 's', 'w'].forEach(function (k) {
      if (D.diamonds[k]) el('path', { d: D.diamonds[k].d, fill: 'url(#fgGold)', 'fill-rule': 'evenodd' }, g);
    });
    ornaments.forEach(function (o) { el('path', { d: o.d, fill: 'url(#fgGold)', 'fill-rule': 'evenodd' }, g); });
    D.mahira.forEach(function (l) { el('path', { d: l.d, fill: 'url(#fgGold)', 'fill-rule': 'evenodd' }, g); });
    D.select.letters.forEach(function (l) { el('path', { d: l.d, fill: 'url(#fgGold)', 'fill-rule': 'evenodd' }, g); });
    D.select.lines.forEach(function (l) {
      el('rect', { x: l.x, y: l.y, width: l.w, height: Math.max(l.h, 6), fill: 'url(#fgGold)' }, g);
    });
  }
  buildFooterLogo($('#footLogo'));

  /* newsletter */
  var newsForm = $('#newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = $('#newsEmail');
      if (em && em.value && em.value.indexOf('@') > 0) $('.f-news').classList.add('is-done');
      else if (em) em.focus();
    });
  }

  /* back to top */
  var backTop = $('#backTop');
  if (backTop) backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* women's collection pager */
  (function () {
    var track = $('.w-track'), cur = $('.w-cur');
    if (!track || !cur) return;
    var cards = $$('.w-card', track), idx = 0;
    function show(n) {
      idx = (n + cards.length) % cards.length;
      cur.textContent = '0' + (idx + 1);
      if (track.scrollWidth > track.clientWidth + 10) {
        var c = cards[idx];
        track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
      } else {
        cards.forEach(function (c) { c.classList.remove('is-focus'); });
        var f = cards[idx];
        f.classList.add('is-focus');
        clearTimeout(f.__ft);
        f.__ft = setTimeout(function () { f.classList.remove('is-focus'); }, 1200);
      }
    }
    $('.w-prev').addEventListener('click', function () { show(idx - 1); });
    $('.w-next').addEventListener('click', function () { show(idx + 1); });
    var sTimer = 0;
    track.addEventListener('scroll', function () {
      clearTimeout(sTimer);
      sTimer = setTimeout(function () {
        var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
        cards.forEach(function (c, i) {
          var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
          if (d < bd) { bd = d; best = i; }
        });
        idx = best; cur.textContent = '0' + (idx + 1);
      }, 90);
    }, { passive: true });
  })();

  /* scroll choreography — every chapter has its own movement */
  (function () {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    if (document.body.classList.contains('hero-only')) return;   // hero-only build
    gsap.registerPlugin(ScrollTrigger);

    function headIn(tl, sec, at) {
      var head = $(' .sec-head', sec) || $('.sec-head', sec);
      if (!head) return;
      var kids = $$(':scope > *', head);
      gsap.set(kids, { y: 30, opacity: 0 });
      tl.to(kids, { y: 0, opacity: 1, duration: 0.9, ease: 'luxOut', stagger: 0.1 }, at || 0);
    }
    function railsIn(tl, sec, at) {
      var rails = $$('.rail, .corner', sec);
      if (!rails.length) return;
      gsap.set(rails, { opacity: 0, y: 20 });
      tl.to(rails, { opacity: 1, y: 0, duration: 1, ease: 'sine.out', stagger: 0.1 }, at || 0.5);
    }
    function drawPaths(tl, paths, at, dur, stag) {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      tl.to(paths, { strokeDashoffset: 0, duration: dur || 0.9, ease: 'power1.inOut', stagger: stag || 0 }, at);
    }

    /* S02 · EXPLORE — the scene breathes in, photographs are revealed */
    (function () {
      var sec = $('#explore'); if (!sec) return;
      var bg = $('.x-bg', sec);
      var eyebrowBits = $$('.x-eyebrow i', sec);
      var eyebrowTxt = $('.x-eyebrow span', sec);
      var h2 = $('.x-head h2', sec), sub = $('.x-sub', sec);
      var cards = $$('.x-card', sec);
      var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 72%' }, defaults: { ease: 'luxOut' } });
      gsap.set(bg, { scale: 1.06 });   // the room is always present, it only settles
      gsap.set(eyebrowBits, { scaleX: 0 });
      gsap.set([eyebrowTxt, h2, sub], { y: 24, opacity: 0 });
      tl.to(bg, { scale: 1, duration: 1.9, ease: 'power2.out' }, 0)
        .to(eyebrowTxt, { y: 0, opacity: 1, duration: 0.8 }, 0.15)
        .to(eyebrowBits, { scaleX: 1, duration: 0.9, ease: 'luxIO' }, 0.25)
        .to(h2, { y: 0, opacity: 1, duration: 0.9 }, 0.32)
        .to(sub, { y: 0, opacity: 1, duration: 0.9 }, 0.46);
      gsap.fromTo(bg, { yPercent: -2.2 }, {
        yPercent: 2.2, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
      cards.forEach(function (card, i) {
        var at = 0.5 + i * 0.2;
        var r = 'clamp(8px, 1cqw, 17px)';
        gsap.set(card, { y: 54, opacity: 0, clipPath: 'inset(12% 0% 0% 0% round 16px)' });
        gsap.set($(':scope > img', card), { scale: 1.08 });
        var bits = $$('.x-copy > *', card);
        gsap.set(bits, { y: 18, opacity: 0 });
        tl.to(card, { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.2 }, at)
          .to($(':scope > img', card), { scale: 1, duration: 1.8, ease: 'power2.out' }, at + 0.05)
          .to(bits, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 }, at + 0.42);
      });
    })();
    /* S03 · WOMEN — the campaign rises, bottom to top, like a reveal on set */
    (function () {
      var sec = $('#women-new'); if (!sec) return;
      var cards = $$('.w-card', sec), nav = $('.w-nav', sec), bg = $('.w-bg img', sec);
      var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 70%' }, defaults: { ease: 'luxOut' } });
      headIn(tl, sec, 0);
      railsIn(tl, sec, 0.45);
      cards.forEach(function (card, i) {
        var at = 0.34 + i * 0.18;
        gsap.set(card, { y: 96, opacity: 0, scale: 1.02 });
        gsap.set($(':scope > img', card), { scale: 1.09, yPercent: 3 });
        var cap = $$('.w-caption > *', card);
        gsap.set(cap, { y: 20, opacity: 0 });
        tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 1.3 }, at)
          .to($(':scope > img', card), { scale: 1, yPercent: 0, duration: 1.9, ease: 'power2.out' }, at + 0.05)
          .to(cap, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 }, at + 0.5);
      });
      gsap.set(nav, { opacity: 0, y: 30 });
      tl.to(nav, { opacity: 1, y: 0, duration: 0.95 }, 1.25);
      /* the room settles in — never fades out, only breathes */
      gsap.set(bg, { scale: 1.07 });
      tl.to(bg, { scale: 1, duration: 2.0, ease: 'power2.out' }, 0);
      gsap.fromTo(bg, { yPercent: -2.5 }, {
        yPercent: 2.5, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
    })();

    /* S04 · KALAKAARI — the room settles, then the panels rise */
    (function () {
      var sec = $('#kalakaari'); if (!sec) return;
      var room = $('.k-room img', sec);
      var head = $$('.k-head > *', sec);
      var lede = $$('.k-lede > *', sec);
      var panels = $$('.k-panel', sec);
      var all = $('.k-all', sec);
      var rails = $$('.k-rail, .k-corner', sec);
      var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 72%' }, defaults: { ease: 'luxOut' } });
      gsap.set(room, { scale: 1.06 });
      gsap.set(head, { y: 26, opacity: 0 });
      gsap.set(lede, { y: 24, opacity: 0 });
      gsap.set(panels, { y: 90, opacity: 0 });
      gsap.set(all, { y: 22, opacity: 0 });
      gsap.set(rails, { opacity: 0 });
      tl.to(room, { scale: 1, duration: 2.0, ease: 'power2.out' }, 0)
        .to(head, { y: 0, opacity: 1, duration: 0.85, stagger: 0.09 }, 0.15)
        .to(panels, { y: 0, opacity: 1, duration: 1.15, ease: 'luxIO', stagger: 0.14 }, 0.5)
        .to(lede, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 0.75)
        .to(rails, { opacity: 1, duration: 1.0, ease: 'sine.out', stagger: 0.08 }, 0.9)
        .to(all, { y: 0, opacity: 1, duration: 0.8 }, 1.35);
      gsap.fromTo(room, { yPercent: -2.2 }, {
        yPercent: 2.2, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
    })();
    /* S05 · BEST SELLERS — the room settles, the cards rise in sequence */
    (function () {
      var sec = $('#best'); if (!sec) return;
      var room = $('.b-room img', sec);
      var head = $$('.b-head > *', sec);
      var cards = [$('.b-c1', sec), $('.b-c2', sec), $('.b-c3', sec), $('.b-c4', sec)].filter(Boolean);
      var all = $('.b-all', sec);
      var marks = $$('.b-rail, .b-corner', sec);
      var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 72%' }, defaults: { ease: 'luxOut' } });
      gsap.set(room, { scale: 1.06 });
      gsap.set(head, { y: 26, opacity: 0 });
      gsap.set(cards, { y: 92, opacity: 0 });
      gsap.set(all, { y: 22, opacity: 0 });
      gsap.set(marks, { opacity: 0 });
      tl.to(room, { scale: 1, duration: 2.0, ease: 'power2.out' }, 0)
        .to(head, { y: 0, opacity: 1, duration: 0.85, stagger: 0.09 }, 0.15)
        .to(cards, { y: 0, opacity: 1, duration: 1.15, ease: 'luxIO', stagger: 0.13 }, 0.5)
        .to(marks, { opacity: 1, duration: 1.0, ease: 'sine.out', stagger: 0.08 }, 0.95)
        .to(all, { y: 0, opacity: 1, duration: 0.8 }, 1.4);
      gsap.fromTo(room, { yPercent: -2.2 }, {
        yPercent: 2.2, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
    })();
    /* S06 · CRAFT SEAL — icons draw themselves */
    (function () {
      var sec = $('#craft'); if (!sec) return;
      var ornT = $('.c-orna-top', sec), ornB = $('.c-orna-bottom', sec);
      var items = $$('.c-item', sec), seps = $$('.c-sep', sec);
      gsap.set([ornT, ornB], { scaleX: 0 });
      gsap.set(seps, { scaleY: 0 });
      var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 78%' }, defaults: { ease: 'sine.inOut' } });
      tl.to(ornT, { scaleX: 1, duration: 1.0 }, 0);
      items.forEach(function (it, i) {
        var t0 = 0.3 + i * 0.26;
        drawPaths(tl, $$('svg path, svg rect, svg circle', it), t0, 0.9, 0.06);
        var p = $('p', it);
        gsap.set(p, { y: 12, opacity: 0 });
        tl.to(p, { y: 0, opacity: 1, duration: 0.6, ease: 'luxOut' }, t0 + 0.3);
        if (seps[i]) tl.to(seps[i], { scaleY: 1, duration: 0.5 }, t0 + 0.4);
      });
      tl.to(ornB, { scaleX: 1, duration: 1.0 }, 1.5);
    })();

    /* S07 · STORY — the image is revealed left to right */
    (function () {
      var sec = $('#storyEd'); if (!sec) return;
      var mask = $('.se-mask', sec), img = $('.se-mask img', sec), frame = $('.se-frame', sec);
      var bits = $$('.se-copy > *', sec);
      gsap.set(mask, { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(img, { x: -44, scale: 1.05 });
      gsap.set(frame, { opacity: 0 });
      gsap.set(bits, { y: 28, opacity: 0 });
      var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 68%' }, defaults: { ease: 'luxIO' } });
      tl.to(mask, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35 }, 0)
        .to(img, { x: 0, scale: 1, duration: 1.9, ease: 'power2.out' }, 0.05)
        .to(frame, { opacity: 1, duration: 1.0, ease: 'sine.inOut' }, 0.9)
        .to(bits, { y: 0, opacity: 1, duration: 0.85, ease: 'luxOut', stagger: 0.11 }, 0.45);
      gsap.fromTo(img, { yPercent: -3.5 }, {
        yPercent: 3.5, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    })();

    /* FOOTER — the closing statement */
    (function () {
      var f = $('#footer'); if (!f) return;
      var st = $$('.f-statement > *', f);
      gsap.set(st, { y: 24, opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: $('.f-statement', f), start: 'top 82%' } })
        .to(st, { y: 0, opacity: 1, duration: 0.9, ease: 'luxOut', stagger: 0.12 });
      var cols = $$('.f-main > *', f);
      gsap.set(cols, { y: 34, opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: $('.f-main', f), start: 'top 84%' } })
        .to(cols, { y: 0, opacity: 1, duration: 0.95, ease: 'luxOut', stagger: 0.1 });
      var orn = $('.f-orna', f), bottom = $('.f-bottom', f);
      gsap.set(orn, { scaleX: 0 });
      gsap.set(bottom, { opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: bottom, start: 'top 96%' } })
        .to(orn, { scaleX: 1, duration: 1.1, ease: 'sine.inOut' }, 0)
        .to(bottom, { opacity: 1, duration: 0.9 }, 0.3);
    })();

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  })();

  /* ============================================================
     MOBILE INTERACTION — swipe rows, scroll-linked detail, touch
     ============================================================ */
  (function () {
    /* mark the card nearest the row's start so it reads as active,
       and dim its neighbours only while a swipe is in progress */
    [['.w-track', '.w-card'], ['.k-panels', '.k-panel'], ['.b-cards', '.b-card']].forEach(function (pair) {
      var row = $(pair[0]); if (!row) return;
      var items = $$(pair[1], row); if (!items.length) return;
      var idle = 0;
      function mark() {
        var rr = row.getBoundingClientRect(), best = null, bd = Infinity;
        items.forEach(function (it) {
          var d = Math.abs(it.getBoundingClientRect().left - (rr.left + 26));
          if (d < bd) { bd = d; best = it; }
        });
        items.forEach(function (it) { it.classList.toggle('is-near', it === best); });
      }
      row.addEventListener('scroll', function () {
        row.classList.add('is-swiping');
        clearTimeout(idle);
        idle = setTimeout(function () { row.classList.remove('is-swiping'); }, 240);
        mark();
      }, { passive: true });
      mark();
    });

    /* a refined response when the wishlist is tapped */
    var wb = $('#wishBtn');
    if (wb) wb.addEventListener('click', function () {
      if (reduced || !window.gsap) return;
      gsap.fromTo($('svg', wb), { scale: 1 },
        { scale: 1.16, duration: 0.16, yoyo: true, repeat: 1, ease: 'sine.out' });
    });

    /* section ornaments drift a little with the scroll — mobile only */
    if (reduced || !window.gsap || !window.ScrollTrigger) return;
    if (!mqMobile.matches) return;
    $$('.sh-orna, .k-orna, .b-orna').forEach(function (o) {
      var sec = o.closest('section'); if (!sec) return;
      gsap.fromTo(o, { xPercent: -7 }, {
        xPercent: 7, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    });
  })();
  /* dev hook */
  window.__mahira = { goTo: goTo, hero: hero, applyFinalState: applyFinalState };
})();

















