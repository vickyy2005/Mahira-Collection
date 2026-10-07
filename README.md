# Mahira Select

A premium Indian women's fashion storefront — cinematic landing page plus a complete shopping
journey. Static HTML, CSS and JavaScript with GSAP. No build step, no dependencies to install.

## Running it

The site must be served over HTTP (it fetches JSON and templates, which `file://` blocks):

```bash
python -m http.server 4173
```

Then open <http://localhost:4173/index.html>.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page — curtain intro, hero sequence, editorial sections |
| `category.html` | Category landing (`?c=women`, `?c=kalakaari`) |
| `shop.html` | Product listing with filters and sorting |
| `product.html` | Product detail — colour, size, quantity, add to cart / wishlist |
| `cart.html` | Cart with line editing and running totals |
| `checkout.html` | Address selection and payment method |
| `order.html` | Order placed confirmation |
| `track.html` | Order tracking |
| `login.html`, `signup.html` | Account entry |
| `explore.html` | Index of every screen in the flow, with a demo data seeder |
| `email-preview.html` | Renders the order confirmation email at desktop and mobile widths |

## Structure

```
assets/                     imagery
css/     styles.css         landing page
         shop.css           shopping flow
         auth.css           login / sign up
js/      main.js            landing page engine, curtain intro, navigation
         shop.js            catalogue, cart, wishlist, orders
         shop-data.js       product and category data
         auth.js            account screens
         emblem-data.js     vector logo path data
email/   order-confirmation.html   table-based email template
```

## How state works

Cart, wishlist, orders and saved addresses live in `localStorage` under the `mahira.*` keys.
Cart lines are keyed by `id|colour|size`, so the same product in two sizes stays two lines.
Product details, variants, quantities and totals carry through unchanged from listing to
confirmation.

## Notes

- The email template uses tables and inline styles, with character-based glyphs instead of
  images, so it still reads when a client blocks images. Outlook gets a VML button fallback.
- The logo is vector path data in `js/emblem-data.js`, drawn as SVG rather than shipped as a
  raster, so it stays sharp at any size.
