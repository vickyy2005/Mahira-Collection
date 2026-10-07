/* ============================================================
   MAHIRA SELECT — CATALOGUE
   One data source drives every category, listing and product
   page. Adding a product or a whole subcategory is a data edit,
   never a new page.
   ============================================================ */
(function () {
  'use strict';

  var A = 'assets/';

  /* colour vocabulary shared across the catalogue */
  var C = {
    olive:    { name: 'Olive Green',   hex: '#4A5A3A' },
    forest:   { name: 'Deep Forest',   hex: '#1F3323' },
    ivory:    { name: 'Warm Ivory',    hex: '#EFE3CC' },
    champagne:{ name: 'Champagne',     hex: '#D9C39B' },
    maroon:   { name: 'Maroon',        hex: '#6E2532' },
    rust:     { name: 'Rust',          hex: '#A8552F' },
    indigo:   { name: 'Indigo',        hex: '#2E3A5C' },
    gold:     { name: 'Antique Gold',  hex: '#B89A62' },
    walnut:   { name: 'Rich Walnut',   hex: '#3B3025' },
    rose:     { name: 'Dusty Rose',    hex: '#C08B84' }
  };

  var SAREE_SIZES = ['Free Size'];
  var SUIT_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  var MEN_SIZES   = ['38', '40', '42', '44', '46'];

  var CARE = 'Dry clean only. Store folded in a muslin wrap, away from direct sunlight. Press on the reverse with a warm iron.';
  var SHIP = 'Dispatched within 2–3 working days. Free shipping across India on prepaid orders. Returns accepted within 7 days of delivery, unworn and with tags intact.';

  /* ---------- categories → groups → subcategories ---------- */
  var CATEGORIES = {
    women: {
      slug: 'women',
      label: 'Women',
      eyebrow: 'The Women’s Edit',
      title: 'Women',
      line: 'Handcrafted stories, for the modern you.',
      hero: A + 'women-clean.jpg?v=3',
      heroMobile: A + 'women-mobile.jpg?v=3',
      heroPos: '62% 45%',
      /* `img` is the portrait crop the cards use. `band` is a LANDSCAPE plate
         for the wide banner — a portrait crop stretched into a banner shows
         only a slice of itself, which is what used to cut these images in
         half. `focal` keeps the subject in frame as the banner reflows. */
      groups: [
        { title: 'Ethnic', subs: [
          { slug: 'sarees',      label: 'Sarees',       img: A + 's3-sarees.jpg?v=5',  band: A + 's2-card-women.jpg?v=2', focal: '50% 32%' },
          { slug: 'kurta-sets',  label: 'Kurta Sets',   img: A + 's3-kurta.jpg?v=5',   band: A + 's5-kurta.jpg?v=1',      focal: '50% 38%' },
          { slug: 'anarkali',    label: 'Anarkali',     img: A + 's5-p1.jpg?v=1',      band: A + 's3-bg.jpg?v=1',         focal: '52% 34%' },
          { slug: 'lehengas',    label: 'Lehengas',     img: A + 's4-p2.jpg?v=1',      band: A + 's5-room.jpg?v=1',       focal: '48% 40%' },
          { slug: 'co-ord-sets', label: 'Co-ord Sets',  img: A + 's4-p3.jpg?v=1',      band: A + 's5-p3.jpg?v=1',         focal: '50% 40%' },
          { slug: 'dresses',     label: 'Dresses',      img: A + 's3-dresses.jpg?v=5', band: A + 's2-room.jpg?v=4',       focal: '54% 42%' }
        ]},
        { title: 'Western', subs: [
          { slug: 'tops',        label: 'Tops',         img: A + 's5-p4.jpg?v=1',      band: A + 's5-printed.jpg?v=1',    focal: '50% 40%' },
          { slug: 'trousers',    label: 'Trousers',     img: A + 's4-p1.jpg?v=1',      band: A + 's5-p2.jpg?v=1',         focal: '50% 42%' }
        ]}
      ]
    },
    men: {
      slug: 'men',
      label: 'Men',
      eyebrow: 'The Men’s Edit',
      title: 'Men',
      line: 'MENSWEAR, MADE SIMPLE. Tradition meets tomorrow.',
      hero: A + 'men-clean.jpg?v=3',
      heroMobile: A + 'men-mobile.jpg?v=3',
      heroPos: '58% 30%',
      groups: [
        { title: 'Kurtas & Sets', subs: [
          { slug: 'kurtas',       label: 'Kurtas',              img: A + 'men-clean.jpg?v=3', band: A + 'men-clean.jpg?v=3', focal: '58% 30%' },
          { slug: 'kurta-pajama', label: 'Kurta Pajama Sets',   img: A + 'men-clean.jpg?v=3', band: A + 'men-clean.jpg?v=3', focal: '65% 35%' },
          { slug: 'festive-sets', label: 'Festive Wear',        img: A + 'men-clean.jpg?v=3', band: A + 'men-clean.jpg?v=3', focal: '55% 25%' }
        ]},
        { title: 'Jackets & Occasion', subs: [
          { slug: 'nehru-jackets', label: 'Nehru Jackets & Bandhgalas', img: A + 'men-clean.jpg?v=3', band: A + 'men-clean.jpg?v=3', focal: '60% 25%' },
          { slug: 'shirts',        label: 'Handloom Shirts',            img: A + 's5-printed.jpg?v=1', band: A + 's5-printed.jpg?v=1', focal: '50% 40%' }
        ]}
      ]
    },
    kalakaari: {
      slug: 'kalakaari',
      label: 'Kalakaari',
      eyebrow: 'The Kalakaari Atelier',
      title: 'Kalakaari',
      line: 'Art that tells a story — hand-drawn, hand-dyed, hand-finished.',
      hero: A + 's4-room.jpg?v=1',
      heroMobile: A + 's4-room-mobile.jpg?v=1',
      heroPos: '38% 50%',
      groups: [
        { title: 'The Collections', subs: [
          { slug: 'kalamkari-sarees',     label: 'Kalamkari Sarees',   img: A + 's4-p1.jpg?v=1',  band: A + 's2-card-kala.jpg?v=2', focal: '50% 40%' },
          { slug: 'kalamkari-dress-sets', label: 'Dress Sets',         img: A + 's4-p2.jpg?v=1',  band: A + 's4-room.jpg?v=1',      focal: '42% 42%' },
          { slug: 'kalamkari-fabric',     label: 'Fabric',             img: A + 's4-p3.jpg?v=1',  band: A + 's5-printed.jpg?v=1',   focal: '50% 44%' },
          { slug: 'kalamkari-dupattas',   label: 'Dupattas',           img: A + 's5-p4.jpg?v=1',  band: A + 's5-p3.jpg?v=1',        focal: '50% 40%' }
        ]}
      ]
    }
  };

  /* ---------- products ---------- */
  function p(o) {
    o.sizes = o.sizes || SAREE_SIZES;
    o.care = o.care || CARE;
    o.shipping = o.shipping || SHIP;
    o.rating = o.rating || 4.6;
    o.reviews = o.reviews || 84;
    return o;
  }

  var PRODUCTS = [
    /* ---- Women · Sarees ---- */
    p({ id: 'ms-101', cat: 'women', sub: 'sarees', title: 'Chanderi Silk Saree',
        price: 12500, mrp: 15600, fabric: 'Chanderi',
        desc: 'A graceful Chanderi silk saree with intricate traditional motifs, woven on a feather-light body that drapes without weight. Finished with a fine zari border.',
        details: 'Chanderi silk · 5.5m with an unstitched 0.8m blouse piece · Handloom woven in Madhya Pradesh · Zari border',
        colors: [C.olive, C.champagne, C.maroon], images: [A + 's3-sarees.jpg?v=5', A + 's4-p1.jpg?v=1', A + 's5-p1.jpg?v=1'] }),
    p({ id: 'ms-102', cat: 'women', sub: 'sarees', title: 'Kanchi Border Saree',
        price: 14800, mrp: 18500, fabric: 'Silk', rating: 4.8, reviews: 132,
        desc: 'A Kanchipuram-inspired silk saree with a contrast temple border, the pallu carrying a broad band of antique zari.',
        details: 'Pure mulberry silk · 6.3m with blouse piece · Contrast temple border · Handwoven',
        colors: [C.maroon, C.forest, C.gold], images: [A + 's4-p1.jpg?v=1', A + 's3-sarees.jpg?v=5', A + 's4-editorial.jpg?v=2'] }),
    p({ id: 'ms-103', cat: 'women', sub: 'sarees', title: 'Handloom Cotton Saree',
        price: 9800, mrp: 11500, fabric: 'Cotton', rating: 4.5, reviews: 61,
        desc: 'An everyday handloom cotton saree with a soft, breathable fall and a quiet striped border — made for long days worn easily.',
        details: 'Handloom cotton · 5.5m with blouse piece · Natural dyes · Woven in Andhra Pradesh',
        colors: [C.ivory, C.rust, C.indigo], images: [A + 's5-p1.jpg?v=1', A + 's3-sarees.jpg?v=5'] }),
    p({ id: 'ms-104', cat: 'women', sub: 'sarees', title: 'Silk Blend Saree',
        price: 16200, mrp: 19900, fabric: 'Silk', rating: 4.7, reviews: 98,
        desc: 'A silk-blend saree with a subtle sheen and a deep woven border, cut for occasion wear that still moves easily.',
        details: 'Silk blend · 5.5m with blouse piece · Woven border · Dry clean only',
        colors: [C.forest, C.walnut, C.rose], images: [A + 's4-editorial.jpg?v=2', A + 's4-p2.jpg?v=1'] }),

    /* ---- Women · Kurta Sets ---- */
    p({ id: 'ms-201', cat: 'women', sub: 'kurta-sets', title: 'Chikankari Kurta Set',
        price: 8900, mrp: 11200, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.7, reviews: 145,
        desc: 'Hand-embroidered chikankari on soft cotton, cut as a straight kurta with matching palazzo and a fine mul dupatta.',
        details: 'Cotton mul · Kurta, palazzo and dupatta · Hand chikankari from Lucknow',
        colors: [C.ivory, C.rose, C.olive], images: [A + 's3-kurta.jpg?v=5', A + 's5-p4.jpg?v=1'] }),
    p({ id: 'ms-202', cat: 'women', sub: 'kurta-sets', title: 'Printed Cotton Kurta Set',
        price: 6400, mrp: 7800, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.4, reviews: 52,
        desc: 'A block-printed cotton set for the working week — an easy A-line kurta, straight trousers and a light cotton dupatta.',
        details: 'Block-printed cotton · Kurta, trousers and dupatta · Machine wash cold',
        colors: [C.indigo, C.rust, C.ivory], images: [A + 's5-p4.jpg?v=1', A + 's3-kurta.jpg?v=5'] }),
    p({ id: 'ms-203', cat: 'women', sub: 'kurta-sets', title: 'Embroidered Chanderi Kurti Set',
        price: 9400, mrp: 12000, fabric: 'Silk', sizes: SUIT_SIZES, rating: 4.8, reviews: 89,
        desc: 'A tailored Chanderi silk kurti with delicate gota patti detailing along the neckline, paired with straight cigarette trousers.',
        details: 'Chanderi silk · Kurti and trousers · Handcrafted gota patti work · Dry clean only',
        colors: [C.olive, C.champagne, C.maroon], images: [A + 's5-kurta.jpg?v=1', A + 's3-kurta.jpg?v=5'] }),
    p({ id: 'ms-204', cat: 'women', sub: 'kurta-sets', title: 'Angrakha Flared Kurti Set',
        price: 10200, mrp: 13500, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.9, reviews: 110,
        desc: 'A regal royal angrakha silhouette with wrap tie-up tassels, flared hemline, and tonal embroidered dupatta.',
        details: 'Pure mulmul cotton · Angrakha kurti, churidar and organza dupatta · Hand block print',
        colors: [C.rust, C.forest, C.rose], images: [A + 's4-p2.jpg?v=1', A + 's5-p2.jpg?v=1'] }),
    p({ id: 'ms-205', cat: 'women', sub: 'kurta-sets', title: 'Tussar Silk Straight Kurti Set',
        price: 7900, mrp: 9800, fabric: 'Silk', sizes: SUIT_SIZES, rating: 4.6, reviews: 74,
        desc: 'Understated elegance in pure tussar silk with subtle contrast piping and hand-stitched kantha accents.',
        details: 'Tussar silk · Straight kurti and cropped pants · Kantha embroidery',
        colors: [C.champagne, C.walnut, C.ivory], images: [A + 's5-p2.jpg?v=1', A + 's4-editorial.jpg?v=2'] }),

    /* ---- Women · Anarkali ---- */
    p({ id: 'ms-301', cat: 'women', sub: 'anarkali', title: 'Silk Anarkali Set',
        price: 18400, mrp: 22800, fabric: 'Silk', sizes: SUIT_SIZES, rating: 4.8, reviews: 76,
        desc: 'A floor-length silk anarkali with a fitted bodice and a full, unbroken flare, paired with churidar and an embroidered dupatta.',
        details: 'Silk · Anarkali, churidar and dupatta · Hand-finished embroidery',
        colors: [C.forest, C.maroon, C.gold], images: [A + 's5-p1.jpg?v=1', A + 's4-editorial.jpg?v=2'] }),

    /* ---- Women · Lehengas ---- */
    p({ id: 'ms-401', cat: 'women', sub: 'lehengas', title: 'Occasion Lehenga Set',
        price: 32500, mrp: 41000, fabric: 'Silk', sizes: SUIT_SIZES, rating: 4.9, reviews: 41,
        desc: 'A celebration lehenga with a hand-worked border, a structured blouse and a sheer dupatta finished with a scalloped edge.',
        details: 'Raw silk · Lehenga, blouse and dupatta · Hand embroidery · Made to order in 3 weeks',
        colors: [C.maroon, C.forest, C.champagne], images: [A + 's4-p2.jpg?v=1', A + 's5-p1.jpg?v=1'] }),

    /* ---- Women · Co-ord Sets ---- */
    p({ id: 'ms-501', cat: 'women', sub: 'co-ord-sets', title: 'Printed Co-ord Set',
        price: 7600, mrp: 9200, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.5, reviews: 63,
        desc: 'A relaxed co-ord in printed cotton — a boxy shirt and wide trousers that read as one piece or two.',
        details: 'Printed cotton · Shirt and trousers · Machine wash cold',
        colors: [C.ivory, C.olive, C.rose], images: [A + 's4-p3.jpg?v=1', A + 's5-p4.jpg?v=1'] }),

    /* ---- Women · Dresses ---- */
    p({ id: 'ms-601', cat: 'women', sub: 'dresses', title: 'Handwoven Dress',
        price: 8200, mrp: 9900, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.4, reviews: 38,
        desc: 'A handwoven cotton dress with a gathered waist and deep pockets, cut long enough to wear alone or layered.',
        details: 'Handwoven cotton · Side pockets · Concealed zip',
        colors: [C.indigo, C.ivory, C.rust], images: [A + 's3-dresses.jpg?v=5', A + 's4-p3.jpg?v=1'] }),

    /* ---- Women · Western ---- */
    p({ id: 'ms-701', cat: 'women', sub: 'tops', title: 'Embroidered Cotton Top',
        price: 3800, mrp: 4600, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.3, reviews: 29,
        desc: 'A quiet cotton top with a hand-embroidered yoke and a straight, easy body.',
        details: 'Cotton · Hand-embroidered yoke · Machine wash cold',
        colors: [C.ivory, C.olive], images: [A + 's5-p4.jpg?v=1'] }),
    p({ id: 'ms-702', cat: 'women', sub: 'trousers', title: 'Wide Leg Trousers',
        price: 4200, mrp: 5100, fabric: 'Linen', sizes: SUIT_SIZES, rating: 4.5, reviews: 34,
        desc: 'High-waisted linen trousers with a wide, fluid leg and a clean tailored finish.',
        details: 'Linen · High waist · Side pockets',
        colors: [C.walnut, C.ivory, C.forest], images: [A + 's4-p1.jpg?v=1'] }),

    /* ---- Men · Kurtas & Occasion Wear ---- */
    p({ id: 'ms-m101', cat: 'men', sub: 'kurtas', title: 'Raw Silk Embroidered Kurta Set',
        price: 13500, mrp: 16800, fabric: 'Raw Silk', sizes: MEN_SIZES, rating: 4.8, reviews: 76,
        desc: 'A dusty rose raw silk kurta with intricate tonal embroidery along the placket and cuffs, paired with tapered ivory silk churidar.',
        details: 'Pure raw silk · Kurta and churidar · Hand embroidery · Dry clean only',
        colors: [C.rose, C.ivory, C.gold], images: [A + 'men-clean.jpg?v=3', A + 'men-mobile.jpg?v=3'] }),
    p({ id: 'ms-m102', cat: 'men', sub: 'nehru-jackets', title: 'Chanderi Silk Bundi & Kurta Set',
        price: 16200, mrp: 19500, fabric: 'Chanderi Silk', sizes: MEN_SIZES, rating: 4.9, reviews: 92,
        desc: 'A terracotta patterned Chanderi silk Nehru jacket worn over a finely tailored coordinating kurta and beige trousers.',
        details: 'Chanderi silk · Jacket, kurta and trousers · Antique brass buttons',
        colors: [C.rust, C.maroon, C.champagne], images: [A + 'men-clean.jpg?v=3'] }),
    p({ id: 'ms-m103', cat: 'men', sub: 'kurtas', title: 'Handwoven Linen Kurta',
        price: 6800, mrp: 8200, fabric: 'Linen', sizes: MEN_SIZES, rating: 4.6, reviews: 54,
        desc: 'Breathable pure handloom linen kurta with a mandarin collar and subtle mother-of-pearl buttons. Crafted for all-day comfort.',
        details: '100% handwoven linen · Side slits · Inseam pockets · Machine wash gentle',
        colors: [C.ivory, C.olive, C.indigo], images: [A + 'men-clean.jpg?v=3'] }),
    p({ id: 'ms-m104', cat: 'men', sub: 'festive-sets', title: 'Tussar Silk Angrakha Kurta Set',
        price: 15400, mrp: 18900, fabric: 'Tussar Silk', sizes: MEN_SIZES, rating: 4.7, reviews: 63,
        desc: 'Heritage Tussar silk asymmetric Angrakha kurta featuring side ties and subtle zari detailing, completed with silk dhoti trousers.',
        details: 'Tussar silk · Angrakha kurta, stole and trousers · Handloom certified',
        colors: [C.champagne, C.maroon, C.forest], images: [A + 'men-clean.jpg?v=3'] }),
    p({ id: 'ms-m105', cat: 'men', sub: 'nehru-jackets', title: 'Heritage Velvet Bandhgala Jacket',
        price: 18500, mrp: 22000, fabric: 'Silk Velvet', sizes: MEN_SIZES, rating: 4.9, reviews: 81,
        desc: 'Opulent midnight emerald velvet bandhgala jacket tailored with structured shoulders and antiqued gold crest buttons.',
        details: 'Silk velvet · Silk lining · Welt pockets · Bespoke fit',
        colors: [C.forest, C.maroon, C.champagne], images: [A + 'men-clean.jpg?v=3'] }),
    p({ id: 'ms-m106', cat: 'men', sub: 'kurta-pajama', title: 'Classic Chanderi Kurta Pajama',
        price: 11200, mrp: 13900, fabric: 'Chanderi', sizes: MEN_SIZES, rating: 4.7, reviews: 48,
        desc: 'A pristine cream Chanderi silk-cotton straight kurta with a delicate threadwork neck and tailored straight pajama.',
        details: 'Chanderi silk blend · Kurta and pajama · Natural sheen · Handcrafted',
        colors: [C.champagne, C.ivory, C.olive], images: [A + 'men-clean.jpg?v=3'] }),

    /* ---- Kalakaari ---- */
    p({ id: 'mk-101', cat: 'kalakaari', sub: 'kalamkari-sarees', title: 'Kalamkari Silk Saree',
        price: 15800, mrp: 19500, fabric: 'Silk', rating: 4.9, reviews: 118,
        desc: 'A hand-drawn kalamkari saree, each panel painted with a pen of bamboo and set with natural dyes over many washes.',
        details: 'Mulberry silk · 5.5m with blouse piece · Hand-drawn Srikalahasti kalamkari · Natural dyes',
        colors: [C.rust, C.ivory, C.indigo], images: [A + 's4-p1.jpg?v=1', A + 's4-editorial.jpg?v=2', A + 's2-card-kala.jpg?v=2'] }),
    p({ id: 'mk-102', cat: 'kalakaari', sub: 'kalamkari-sarees', title: 'Printed Kalamkari Saree',
        price: 9600, mrp: 11800, fabric: 'Cotton', rating: 4.6, reviews: 87,
        desc: 'A block-printed kalamkari cotton saree in madder and indigo, light enough for long days and soft from the first wear.',
        details: 'Cotton · 5.5m with blouse piece · Block-printed kalamkari · Natural dyes',
        colors: [C.indigo, C.rust, C.ivory], images: [A + 's2-card-kala.jpg?v=2', A + 's4-p1.jpg?v=1'] }),
    p({ id: 'mk-201', cat: 'kalakaari', sub: 'kalamkari-dress-sets', title: 'Kalamkari Dress Set',
        price: 11400, mrp: 14200, fabric: 'Cotton', sizes: SUIT_SIZES, rating: 4.7, reviews: 66,
        desc: 'A kalamkari kurta with a matching dupatta, the motifs drawn by hand and repeated along the hem.',
        details: 'Cotton · Kurta, trousers and dupatta · Hand-drawn kalamkari',
        colors: [C.rust, C.olive, C.ivory], images: [A + 's4-p2.jpg?v=1', A + 's4-p3.jpg?v=1'] }),
    p({ id: 'mk-301', cat: 'kalakaari', sub: 'kalamkari-fabric', title: 'Kalamkari Fabric · 2.5m',
        price: 4800, mrp: 5900, fabric: 'Cotton', sizes: ['2.5m', '5m'], rating: 4.5, reviews: 24,
        desc: 'Hand-drawn kalamkari yardage, sold by the length, for a piece you will have made to your own measure.',
        details: 'Cotton · 110cm width · Hand-drawn kalamkari · Natural dyes',
        colors: [C.rust, C.indigo], images: [A + 's4-p3.jpg?v=1'] }),
    p({ id: 'mk-401', cat: 'kalakaari', sub: 'kalamkari-dupattas', title: 'Kalamkari Dupatta',
        price: 3600, mrp: 4400, fabric: 'Cotton', rating: 4.6, reviews: 45,
        desc: 'A light kalamkari dupatta with a drawn border, finished with a narrow hand-rolled hem.',
        details: 'Cotton mul · 2.4m × 1m · Hand-drawn border',
        colors: [C.ivory, C.rust, C.olive], images: [A + 's5-p4.jpg?v=1'] })
  ];

  /* ---------- lookups ---------- */
  function subLabel(catSlug, subSlug) {
    var c = CATEGORIES[catSlug];
    if (!c) return subSlug;
    for (var i = 0; i < c.groups.length; i++) {
      var found = c.groups[i].subs.filter(function (s) { return s.slug === subSlug; })[0];
      if (found) return found.label;
    }
    return subSlug;
  }
  function subMeta(catSlug, subSlug) {
    var c = CATEGORIES[catSlug];
    if (!c) return null;
    for (var i = 0; i < c.groups.length; i++) {
      var f = c.groups[i].subs.filter(function (s) { return s.slug === subSlug; })[0];
      if (f) return f;
    }
    return null;
  }

  window.MAHIRA_SHOP = {
    colors: C,
    categories: CATEGORIES,
    products: PRODUCTS,
    byId: function (id) { return PRODUCTS.filter(function (x) { return x.id === id; })[0] || null; },
    inSub: function (cat, sub) { return PRODUCTS.filter(function (x) { return x.cat === cat && x.sub === sub; }); },
    inCat: function (cat) { return PRODUCTS.filter(function (x) { return x.cat === cat; }); },
    subLabel: subLabel,
    subMeta: subMeta
  };
})();
