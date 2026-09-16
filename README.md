# LaunchKit Shop

A command-line tool that scaffolds a ready-to-run React 19 e-commerce storefront. Answer two questions — a project name and one brand colour — and get a working app whose whole SCSS palette is computed from that colour.

- **npm:** https://www.npmjs.com/package/@greenfield-taster/launchkit-shop
- **Sister package:** [`@greenfield-taster/launchkit-landing`](https://www.npmjs.com/package/@greenfield-taster/launchkit-landing) does the same for one-page landings.

## Quick start

```bash
npx @greenfield-taster/launchkit-shop
```

The wizard asks for:

1. **Project name** — becomes the folder name and the `name` in `package.json`.
2. **Brand colour** as a hex value (default `#a66e4a`) — the full palette is generated from it.

It then copies the template, writes the palette, installs dependencies, and prints the next step:

```bash
cd my-shop
npm run dev
```

The template targets Ukrainian online shops, so the wizard prompts, the mock products and the sample store details are in Ukrainian. Everything is plain text in the generated project and can be replaced.

## What you get

- **8 routes** — home, catalogue, product, checkout, wishlist, contacts, profile and a 404 page (see the table below).
- **A complete colour system** — primary scale 50–900, a complementary secondary scale, and neutrals tinted toward the brand.
- **10 mock products** with categories, specifications, prices and ratings, plus categories, reviews and FAQ data.
- **Authentication flow** — phone number + one-time code and Google OAuth, both mocked, held in a context.
- **Cart and wishlist** — a side cart panel with quantity controls and promo codes; a wishlist persisted in `localStorage`.
- **Mobile-first layout** with a 1620 px maximum width.

### Routes

| Route | Page | What is on it |
|---|---|---|
| `/` | Home | Hero banner, popular-products carousel, benefits |
| `/catalog` | Catalog | Filters, sorting, pagination; filter state kept in the URL |
| `/product/:id` | Product | Gallery with thumbnails, specifications, related products |
| `/checkout` | Checkout | Contact details, delivery, payment |
| `/wishlist` | Wishlist | Saved products |
| `/contacts` | Contacts | Store details and map |
| `/profile` | Profile | Customer profile |
| `*` | 404 | Not found |

## How the palette is generated

The CLI converts the brand hex to HSL and derives three scales, then writes them into `src/styles/_variables.scss`:

- **Primary** — ten steps from 50 to 900 that keep the brand hue and vary lightness and saturation; step 500 is the colour you typed.
- **Secondary** — the same ten steps on the complementary hue (brand hue + 180°).
- **Neutrals** — white plus ten greys that carry up to 8 % of the brand's saturation, so the greys sit comfortably next to the brand colour.

```scss
// Primary — the brand colour in 10 shades
$brand-primary-50: #f6f5f4;
$brand-primary-500: #a66e4a;   // ← your colour
$brand-primary-900: #301f13;   // footer

// Secondary — complementary, generated
$brand-secondary-500: #4f81a1;

// Neutrals — greys with a hint of the brand
$neutral-0: #ffffff;
$neutral-900: #1a1919;
```

To change colours after scaffolding, edit `_variables.scss` by hand.

## Tech stack

| | |
|---|---|
| React | 19 |
| Vite | 7 |
| MUI | 7 |
| Styling | SCSS with 170+ design tokens |
| Icons | Lucide React |
| Routing | React Router 7 |

## Project structure of a generated app

```
my-shop/
├── public/
│   ├── image-placeholder.png
│   └── image-placeholder-2.png
├── src/
│   ├── components/
│   │   ├── Carousel/           # drag and touch carousel
│   │   ├── Cart/               # side cart panel
│   │   ├── CatalogFilters/     # catalogue filters
│   │   ├── ConfirmModal/       # confirmation dialog
│   │   ├── CustomSelect/       # custom dropdown
│   │   ├── ErrorBoundary/      # error boundary
│   │   ├── FAQ/                # FAQ accordion
│   │   ├── LegalModal/         # legal texts
│   │   ├── ProductCard/        # product card
│   │   ├── ProductGallery/     # gallery with thumbnails
│   │   ├── SideAuthPanel/      # sign-in panel
│   │   ├── Skeleton/           # loading skeletons
│   │   └── WishlistButton/     # wishlist toggle
│   ├── contexts/
│   │   ├── auth/               # authentication context
│   │   ├── cart/               # cart context
│   │   └── wishlist/           # wishlist context
│   ├── data/
│   │   ├── products.json       # 10 mock products
│   │   ├── categories.json     # categories
│   │   ├── faqData.js          # questions and answers
│   │   └── reviews.json        # reviews
│   ├── hooks/                  # useAuth, useCart, useWishlist and others
│   ├── layout/                 # Header, Footer, Layout
│   ├── pages/                  # Home, Catalog, Product, Checkout, ...
│   ├── styles/
│   │   ├── _variables.scss     # every design token
│   │   ├── main.scss           # global styles
│   │   ├── layout/             # layout styles
│   │   └── pages/              # page styles
│   └── utils/
│       ├── seoData.js          # SEO metadata
│       └── storeInfo.js        # store contact details
├── package.json
└── vite.config.js
```

## Customising the generated app

**Store details** — `src/utils/storeInfo.js`:

```js
export const STORE_INFO = {
  name: "My Shop",
  phones: ["+380501234567"],
  email: "info@myshop.com.ua",
  address: "Kyiv, 1 Example Street",
  schedule: "Mon–Fri 9:00–18:00, Sat 10:00–16:00",
  social: {
    telegram: "https://t.me/myshop",
    instagram: "https://instagram.com/myshop",
    facebook: "https://facebook.com/myshop",
  },
};
```

**SEO** — `src/utils/seoData.js`:

```js
export const SITE_NAME = "My Shop";
export const BASE_URL = "https://myshop.com.ua";
```

**Products** — `src/data/products.json`:

```json
{
  "id": 1,
  "name": "Premium product",
  "price": 2400,
  "oldPrice": 3000,
  "category": ["popular", "sale"],
  "image": "/image-placeholder.png",
  "characteristics": [
    { "key": "Material", "value": "Natural" }
  ],
  "inStock": true,
  "rating": 4.8
}
```

**Categories** — `src/data/categories.json`:

```json
[
  { "id": "all", "name": "All products" },
  { "id": "popular", "name": "Popular" },
  { "id": "new", "name": "New" },
  { "id": "sale", "name": "Sale" }
]
```

## Features in detail

**Cart** — animated side panel, quantity controls, promo codes `SALE10`, `SAVE50` and `WELCOME`.

**Authentication** — phone number with a one-time code (two steps) and Google OAuth, both mocked; state lives in a context.

**Catalogue** — filter by category and price, sort by price, rating or newest, paginate, and keep the filters in the URL.

**Product gallery** — thumbnails, arrow-key navigation, swipe on touch screens.

**Wishlist** — a heart button on every card, persisted in `localStorage`.

## Scripts in a generated app

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Working on the template itself

This repository *is* the template: `cli/create.js` copies it into a new folder, skipping `cli/`, `docs/` and build output, then rewrites `package.json`, the SEO data and the palette.

```bash
git clone https://github.com/Greenfield-Taster/LaunchKit-Shop.git
cd LaunchKit-Shop
npm install
npm run dev          # run the template as an app
npm run create       # exercise the wizard locally
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## License

[MIT](LICENSE)
