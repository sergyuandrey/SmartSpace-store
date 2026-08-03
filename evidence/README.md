# Accessibility evidence

This folder holds the Lighthouse audit screenshots required by Section 12 of
the assignment brief. **You need to produce these yourself** — they must show
your own browser auditing your own copy of the site.

## How to produce them

1. Open the site with Live Server (Lighthouse will not audit a `file://` page).
2. Open Chrome DevTools with **F12**, then choose the **Lighthouse** tab.
3. Tick the **Accessibility** and **SEO** categories, choose **Mobile**, and
   click **Analyse page load**.
4. Screenshot the result **before** you make a change and save it as
   `Problem1.png`.
5. Fix the issue in your code, re-run the audit, and save the improved result
   as `Fix1.png`.
6. Repeat for a second issue to produce `Problem2.png` and `Fix2.png`.

The brief asks for **two** documented improvements, so four files in total.

## Two improvements already made, which you can document

Both of these were real problems in the earlier version of this site, so they
make honest before-and-after examples. To capture a "before" screenshot, revert
the change, run Lighthouse, then re-apply it.

**1. Colour contrast below WCAG AA**

The muted body text was `#5f6978` and the danger red was `#a62a2a`. Against
white, both sat just under the required 4.5:1 ratio, so Lighthouse flagged
"Background and foreground colours do not have a sufficient contrast ratio."
They are now `#55606f` and `#96201f`.

Where: `css/style.css`, section 1 (design tokens), the `--muted` and `--danger`
custom properties.

**2. Buttons without an accessible name**

The `+` and `−` quantity buttons in the cart were announced by screen readers
only as "plus" and "minus", with nothing to say which product they controlled.
Each button now carries an `aria-label` such as
`"Increase quantity of AirMini Purifier"`.

Where: `js/script.js`, the `buildCartRow` function.

## Files expected in this folder

- `Problem1.png`
- `Fix1.png`
- `Problem2.png`
- `Fix2.png`
