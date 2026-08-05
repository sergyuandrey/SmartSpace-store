# SmartSpace &mdash; Responsive E-Commerce Website

A front-end e-commerce website selling smart, space-saving products for small
apartments and flats. Built for CPU4104-20C Web Development (Level 4) using
**HTML, CSS and JavaScript DOM manipulation only** &mdash; no backend, no
frameworks, no external libraries.

---

## How to run the project

1. Download or clone this repository.
2. Open the `smartspace-store` folder in Visual Studio Code.
3. Install the **Live Server** extension (Extensions panel, search "Live Server").
4. Right-click `index.html` in the file explorer and choose **Open with Live Server**.

The site also works by double-clicking `index.html` to open it directly in a
browser. Live Server is recommended because it reloads automatically when you
edit a file.

**Browsers tested:** Chrome, Firefox and Edge (latest versions).

---

## Folder structure

```
smartspace-store/
├── index.html          Home page (kept in the root so Live Server and
│                       GitHub Pages find it automatically)
├── pages/              The remaining pages
│   ├── products.html   Product listing with search, filter and sort
│   ├── cart.html       Shopping cart and checkout panel
│   ├── about.html      About the store
│   └── contact.html    Contact details and enquiry form
├── css/
│   └── style.css       All styling, written mobile first
├── js/
│   └── script.js       All interactivity and the product data
├── media/              Twelve product photographs (WebP, 800x600)
├── images/             Site imagery: favicon, hero, social share card
├── evidence/           Lighthouse accessibility screenshots
└── README.md
```

**A note on the structure:** the brief describes the folders in two places.
Section 5 asks for `css/`, and Section 8 asks for `styles/` and `images/`. The
stylesheet is kept in `css/` because Section 7 says to follow the Section 5
outline, and a separate `images/` folder holds site imagery so that both
readings are covered. Product photography stays in `media/`.

---

## Features

### Structure (HTML)
- Five pages using semantic elements: `header`, `nav`, `main`, `section`,
  `article`, `aside`, `figure`, `footer` and `dialog`.
- Home page with logo, navigation bar, hero banner, featured products and footer.
- Product listing page with 12 products, each card showing a photograph,
  name, price, category and an **Add to cart** button.
- Product detail view in a modal dialog, available from every product card.
- About page and contact page.
- Shopping cart page with add, remove, quantity controls and a running total.

### Styling (CSS)
- **Mobile first.** Every rule outside a media query is the phone layout;
  breakpoints at 680px, 860px and 1080px widen it for tablet and desktop.
- CSS custom properties on `:root` for the palette, radii and shadows.
- CSS Grid and Flexbox for all layouts; no floats, no framework.
- A full range of selectors: element, class, ID, descendant, pseudo-class
  (`:hover`, `:focus-visible`, `:not()`, `:last-child`), pseudo-element
  (`::before`, `::backdrop`) and attribute (`[aria-current="page"]`,
  `[hidden]`).
- Layered product card shadows (a tight contact shadow plus a wider soft one)
  that deepen and lift on hover.
- Hover effects and consistent spacing throughout.

### Interactivity (JavaScript, DOM only)
- Products rendered from a single `PRODUCTS` array with `createElement`,
  `textContent` and `appendChild`.
- Add to cart, remove from cart, increase and decrease quantity.
- Subtotal, delivery and total recalculated on every change.
- Cart persists between pages and visits using `localStorage`.
- Live search, category filter and four sort orders on the products page.
- Category tiles deep-link into a filtered view, e.g.
  `pages/products.html?category=Storage`.
- Custom validation on the newsletter, contact and checkout forms, including
  `aria-invalid` on failing fields.
- Toast notifications in a polite live region.
- Simple first-party analytics (page views and key events) stored locally.
  Type `SmartSpaceAnalytics.report()` in the browser console to see the totals.

### Accessibility and UX
- Skip link, visible focus ring on every control, and a logical heading order.
- Descriptive `alt` text on every image; decorative images use `alt=""`.
- `aria-expanded` on the menu button, `aria-current` on the active nav link.
- Escape closes the mobile menu, the product dialog and the checkout panel.
- Focus is trapped inside the checkout panel and returned to the button that
  opened it.
- `prefers-reduced-motion` respected.
- Colour contrast meets WCAG 2.1 AA.

### SEO
- Unique `title` and `meta description` on all five pages.
- Canonical link, Open Graph and Twitter card tags.
- Favicon and a 1200&times;630 social share image.

## Images

All twelve product photographs were cropped to a 4:3 frame, resized to
800x600 and compressed to WebP. Every file is under 40 KB and the whole set is
under 300 KB, so the product grid loads quickly on mobile data. Images below
the fold use `loading="lazy"` and `decoding="async"`.

The hero illustration (`images/hero-room.svg`), the favicon and the social
share card were drawn as original vector artwork for this project.

**Image sources:** the product photographs are manufacturer listing images used
here to illustrate a non-commercial student coursework demonstration. They are
not owned by the author of this project. If this site were published for real
use, each photograph would need to be licensed, replaced with own photography,
or replaced with free-licence images from a source such as Unsplash, Pexels or
Pixabay.

## Credits

All HTML, CSS and JavaScript in this project is original work written for this
assignment. No frameworks, libraries or design templates were used.
