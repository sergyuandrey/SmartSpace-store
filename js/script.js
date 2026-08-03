/* ==========================================================================
   SmartSpace - main script
   --------------------------------------------------------------------------
   Plain JavaScript only: no frameworks, no libraries, no backend. Everything
   on the site is built or updated through the DOM API.

   Contents
     1.  Product data
     2.  Path helper
     3.  Small utilities (currency, escaping, element builder)
     4.  Simple first-party analytics
     5.  Cart storage
     6.  Toast notifications
     7.  Product card rendering
     8.  Product detail dialog
     9.  Navigation
     10. Home page
     11. Products page
     12. Cart page
     13. Contact page
     14. Start-up
   ========================================================================== */

"use strict";


/* 1. Product data ==========================================================
   The single source of truth for the shop. Each product carries its own image
   filename, so swapping an illustration for a photograph is a one-line change
   here rather than an edit in three separate render functions. */
const PRODUCTS = [
  {
    id: 1,
    name: "FoldAway Smart Desk",
    price: 149.99,
    category: "Furniture",
    tag: "Bestseller",
    image: "media/product-1.webp",
    alt: "Walnut-topped folding desk with a raised monitor shelf, a laptop and stationery on the worktop",
    desc: "Arrives ready to use: unfold the frame and the raised shelf lifts a screen to eye level. Folds flat to slide behind a door or under a bed."
  },
  {
    id: 2,
    name: "GlowSense Floor Lamp",
    price: 79.99,
    category: "Lighting",
    tag: "New",
    image: "media/product-2.webp",
    alt: "Slim vertical LED floor lamp glowing beside a cream sofa in a neutral living room",
    desc: "A slim pole lamp with a tilting head and dimmable warm light. The weighted base takes up about as much floor as a dinner plate."
  },
  {
    id: 3,
    name: "AirMini Purifier",
    price: 119.00,
    category: "Climate",
    tag: "Quiet",
    image: "media/product-3.webp",
    alt: "Black cylindrical air purifier with a touch control panel, shown beside its phone app",
    desc: "A compact HEPA purifier with a touch panel on top, three fan speeds and a quiet sleep mode. App and voice control included."
  },
  {
    id: 4,
    name: "NestCharge Side Table",
    price: 129.50,
    category: "Furniture",
    tag: "Space saver",
    image: "media/product-4.webp",
    alt: "Set of two solid mango wood nesting side tables, the smaller one tucked beneath the larger",
    desc: "A nest of two solid mango wood tables. Keep them stacked as one small surface, then pull the second one out when guests arrive."
  },
  {
    id: 5,
    name: "SnapShelf Modular Set",
    price: 64.99,
    category: "Storage",
    tag: "Modular",
    image: "media/product-5.webp",
    alt: "White six-cube modular storage unit with doors, arranged in a stepped layout on a balcony",
    desc: "Six lightweight cubes with clip-on doors that assemble without tools. Build a column, a row or a stepped run to suit the wall you have."
  },
  {
    id: 6,
    name: "SteamPod Mini Cooker",
    price: 89.99,
    category: "Kitchen",
    tag: "2-in-1",
    image: "media/product-6.webp",
    alt: "Pale blue electric mini cooker shown with its glass lid and stacking steamer basket",
    desc: "A 1.8-litre electric cooker with a non-stick bowl, glass lid and stacking steamer basket, so a main and a side can cook at once. Sized for one or two."
  },
  {
    id: 7,
    name: "QuietWash Countertop Dishwasher",
    price: 249.00,
    category: "Kitchen",
    tag: "Low water",
    image: "media/product-7.webp",
    alt: "Black countertop dishwasher with a glass door showing loaded plates, glasses and cutlery",
    desc: "A countertop dishwasher that needs no plumbing. Fill the five-litre tank, choose one of five cycles on the digital panel and it handles a two-person load."
  },
  {
    id: 8,
    name: "Clima Smart Fan",
    price: 69.50,
    category: "Climate",
    tag: "App control",
    image: "media/product-8.webp",
    alt: "Silver and black desk air circulator fan on a round base, shown with its remote control and phone app",
    desc: "A seven-inch circulator that moves air across a whole room. Silent mode runs at 28 decibels, the head tilts through 120 degrees, and it comes with a remote."
  },
  {
    id: 9,
    name: "HideAway Laundry Hamper",
    price: 42.00,
    category: "Storage",
    tag: "Foldable",
    image: "media/product-9.webp",
    alt: "Dark grey tilt-out laundry cabinet with a louvred door open to show the removable liner bag",
    desc: "A slim tilt-out cabinet that hides a removable laundry bag behind a louvred door. The flat top doubles as a shelf for towels or a basket."
  },
  {
    id: 10,
    name: "DoorView Video Bell",
    price: 99.99,
    category: "Security",
    tag: "Renter-friendly",
    image: "media/product-10.webp",
    alt: "Gold video door viewer with a wide-angle camera lens and its matching indoor display screen",
    desc: "Replaces an existing peephole, so there is nothing to drill and nothing to wire. Battery powered, with an ultra-wide view, two-way talk and motion alerts on the indoor screen."
  },
  {
    id: 11,
    name: "SoundNest Mini Speaker",
    price: 54.99,
    category: "Entertainment",
    tag: "Compact",
    image: "media/product-11.webp",
    alt: "Small gold cylindrical Bluetooth speaker held between two fingers with water splashing around it",
    desc: "A pocket-sized waterproof speaker with a built-in microphone for calls and a colour light ring. Pair two of them for stereo sound."
  },
  {
    id: 12,
    name: "FlexRail Organiser",
    price: 58.50,
    category: "Storage",
    tag: "No-drill",
    image: "media/product-12.webp",
    alt: "Black metal clothes rail on wheels with two hanging rails, a top shelf, a trouser rack and side hooks",
    desc: "A rolling garment rail with two hanging bars, a top shelf, a lower rack and four side hooks. The wheels lock, and nothing is fixed to the wall."
  }
];

/* Key used for the cart in localStorage. Named as a constant so a typo cannot
   silently create a second, empty cart. */
const CART_KEY = "smartspace-cart";


/* 2. Path helper ===========================================================
   index.html sits in the project root while the other pages sit in /pages, so
   the same script is loaded from two different depths. Each <body> declares
   data-root ("" or "../") and every asset path is built from it. */
const ROOT = document.body.dataset.root || "";

function assetPath(relativePath) {
  return ROOT + relativePath;
}


/* 3. Small utilities ======================================================= */

/** Formats a number as pounds sterling, e.g. 149.99 -> "£149.99". */
function money(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(value);
}

/**
 * Creates an element, applies attributes and appends children in one call.
 * Using createElement and textContent (rather than innerHTML) means the page
 * is built through the DOM API and text can never be treated as markup.
 */
function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);

  if (options.class) {
    node.className = options.class;
  }
  if (options.text !== undefined) {
    node.textContent = options.text;
  }
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([name, value]) => {
      node.setAttribute(name, value);
    });
  }
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([name, value]) => {
      node.dataset[name] = value;
    });
  }

  children.forEach(child => node.appendChild(child));
  return node;
}

/** Removes every child of a node before it is re-rendered. */
function clear(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/** Looks up a product by id, or returns null if the id is unknown. */
function findProduct(id) {
  return PRODUCTS.find(product => product.id === id) || null;
}


/* 4. Simple first-party analytics ==========================================
   The brief allows no backend and no third-party libraries, so this records
   page views and add-to-cart events in localStorage instead of sending them
   anywhere. Type `SmartSpaceAnalytics.report()` in the browser console to see
   the collected totals. */
const SmartSpaceAnalytics = (function () {
  const KEY = "smartspace-analytics";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { views: {}, events: {}, firstVisit: null };
    } catch {
      return { views: {}, events: {}, firstVisit: null };
    }
  }

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* Storage can be full or blocked in private mode; analytics is optional. */
    }
  }

  function trackPageView(pageName) {
    const data = read();
    data.firstVisit = data.firstVisit || new Date().toISOString();
    data.views[pageName] = (data.views[pageName] || 0) + 1;
    write(data);
  }

  function trackEvent(eventName) {
    const data = read();
    data.events[eventName] = (data.events[eventName] || 0) + 1;
    write(data);
  }

  function report() {
    return read();
  }

  return { trackPageView, trackEvent, report };
})();


/* 5. Cart storage ==========================================================
   The cart is stored as [{ id, quantity }] so that prices always come from
   PRODUCTS and can never go stale in storage. */

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    // Discard anything that no longer matches a real product.
    return Array.isArray(cart) ? cart.filter(item => findProduct(item.id)) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    showToast("Your browser is blocking storage, so the cart cannot be saved.");
  }
  updateCartCount();
}

/** Keeps the number in the header badge in step with the stored cart. */
function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(badge => {
    badge.textContent = count;
  });
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product) {
    return;
  }

  const cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveCart(cart);
  SmartSpaceAnalytics.trackEvent("add-to-cart");
  showToast(product.name + " added to your cart");
}


/* 6. Toast notifications ===================================================
   A single polite live region per page announces confirmations to screen
   readers as well as showing them on screen. */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}


/* 7. Product card rendering ================================================ */

/** Builds one product card element for the grids on the home and shop pages. */
function buildProductCard(product) {
  const image = el("img", {
    attrs: {
      src: assetPath(product.image),
      alt: product.alt,
      width: 800,
      height: 600,
      loading: "lazy",
      decoding: "async"
    }
  });

  const body = el("div", { class: "product-body" }, [
    el("p", { class: "product-category", text: product.category }),
    el("h3", { text: product.name }),
    el("p", { class: "product-price", text: money(product.price) }),
    el("div", { class: "card-actions" }, [
      el("button", {
        class: "button add-to-cart",
        text: "Add to cart",
        attrs: { type: "button", "aria-label": "Add " + product.name + " to cart" },
        dataset: { id: product.id }
      }),
      el("button", {
        class: "text-button view-details",
        text: "View details",
        attrs: { type: "button", "aria-label": "View details for " + product.name },
        dataset: { id: product.id }
      })
    ])
  ]);

  return el("article", { class: "product-card" }, [
    el("span", { class: "product-badge", text: product.tag }),
    image,
    body
  ]);
}

/** Replaces the contents of a grid with freshly built cards. */
function renderProductGrid(container, products) {
  clear(container);
  products.forEach(product => container.appendChild(buildProductCard(product)));
  bindProductButtons(container);
}

/** Wires up the two buttons on every card inside the given container. */
function bindProductButtons(scope) {
  scope.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });

  scope.querySelectorAll(".view-details").forEach(button => {
    button.addEventListener("click", () => openProductDialog(Number(button.dataset.id)));
  });
}


/* 8. Product detail dialog =================================================
   Uses the native <dialog> element, which supplies the modal backdrop, focus
   handling and Escape-to-close behaviour without extra code. */
function openProductDialog(id) {
  const dialog = document.getElementById("product-dialog");
  const content = document.getElementById("dialog-content");
  const product = findProduct(id);

  if (!dialog || !content || !product) {
    return;
  }

  const image = el("img", {
    attrs: {
      src: assetPath(product.image),
      alt: product.alt,
      width: 800,
      height: 600,
      decoding: "async"
    }
  });

  const copy = el("div", { class: "dialog-copy" }, [
    el("p", { class: "product-category", text: product.category + " \u00b7 " + product.tag }),
    el("h2", { text: product.name }),
    el("p", { text: product.desc }),
    el("p", { class: "product-price", text: money(product.price) }),
    el("button", {
      class: "button add-to-cart",
      text: "Add to cart",
      attrs: { type: "button" },
      dataset: { id: product.id }
    })
  ]);

  clear(content);
  content.appendChild(el("div", { class: "dialog-grid" }, [image, copy]));
  bindProductButtons(content);

  dialog.showModal();
  SmartSpaceAnalytics.trackEvent("view-product-details");
}

/** Close handlers shared by every page that includes the dialog. */
function initProductDialog() {
  const dialog = document.getElementById("product-dialog");
  if (!dialog) {
    return;
  }

  const closeButton = dialog.querySelector(".dialog-close");
  if (closeButton) {
    closeButton.addEventListener("click", () => dialog.close());
  }

  // Clicking the backdrop (the dialog element itself) closes the dialog.
  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}


/* 9. Navigation ============================================================
   The hamburger button toggles the panel on small screens and keeps
   aria-expanded truthful for screen reader users. */
function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Escape closes the menu and returns focus to the button that opened it.
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Mark the current page so it is styled and announced as the current link.
  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a").forEach(link => {
    const href = link.getAttribute("href");
    const isHome = page === "home" && href.endsWith("index.html");
    const isCurrent = href.endsWith(page + ".html");

    if (isHome || isCurrent) {
      link.setAttribute("aria-current", "page");
    }
  });
}


/* 10. Home page ============================================================ */
function initHome() {
  const featured = document.getElementById("featured-products");
  if (featured) {
    /* Six, not four: the grid is three columns wide on tablet and desktop and
       two on phones, so six fills every row completely at every breakpoint
       and never leaves a single card stranded on a row of its own. */
    renderProductGrid(featured, PRODUCTS.slice(0, 6));
  }

  const form = document.getElementById("newsletter-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = form.elements.email;
    const message = form.querySelector(".form-message");

    if (!email.validity.valid) {
      email.classList.add("is-invalid");
      email.setAttribute("aria-invalid", "true");
      message.className = "form-message is-error";
      message.textContent = "Enter a valid email address, for example you@example.com.";
      email.focus();
      return;
    }

    email.classList.remove("is-invalid");
    email.removeAttribute("aria-invalid");
    message.className = "form-message is-success";
    message.textContent = "Thank you. You are subscribed to the demonstration list.";
    SmartSpaceAnalytics.trackEvent("newsletter-signup");
    form.reset();
  });
}


/* 11. Products page ========================================================
   Search, category filter and sort all feed one render() function, so the
   three controls can be combined in any order. */
function initProducts() {
  const list = document.getElementById("product-list");
  if (!list) {
    return;
  }

  const search = document.getElementById("product-search");
  const category = document.getElementById("category-filter");
  const sort = document.getElementById("sort-products");
  const count = document.getElementById("result-count");
  const noResults = document.getElementById("no-results");

  // Build the category options from the data so the two can never disagree.
  const categories = [...new Set(PRODUCTS.map(product => product.category))].sort();
  categories.forEach(name => {
    category.appendChild(el("option", { text: name, attrs: { value: name } }));
  });

  // Allow the home page category tiles to deep-link, e.g. products.html?category=Storage
  const requestedCategory = new URLSearchParams(location.search).get("category");
  if (requestedCategory && categories.includes(requestedCategory)) {
    category.value = requestedCategory;
  }

  function render() {
    const term = search.value.trim().toLowerCase();

    const filtered = PRODUCTS.filter(product => {
      const haystack = (product.name + " " + product.category + " " + product.desc).toLowerCase();
      const matchesSearch = term === "" || haystack.includes(term);
      const matchesCategory = category.value === "All" || product.category === category.value;
      return matchesSearch && matchesCategory;
    });

    if (sort.value === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort.value === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort.value === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProductGrid(list, filtered);
    count.textContent = filtered.length;
    noResults.hidden = filtered.length !== 0;
  }

  [search, category, sort].forEach(control => {
    control.addEventListener("input", render);
  });

  document.getElementById("clear-filters").addEventListener("click", () => {
    search.value = "";
    category.value = "All";
    sort.value = "featured";
    render();
    search.focus();
  });

  render();
}


/* 12. Cart page ============================================================ */
function initCart() {
  const items = document.getElementById("cart-items");
  if (!items) {
    return;
  }

  const empty = document.getElementById("empty-cart");
  const summary = document.getElementById("order-summary");
  const modal = document.getElementById("checkout-modal");
  const form = document.getElementById("checkout-form");
  let lastFocused = null;

  /**
   * Adjusts an item's quantity. Dropping below one removes the line entirely,
   * and the toast says so explicitly rather than letting the row vanish
   * without explanation.
   */
  function changeQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find(entry => entry.id === id);
    if (!item) {
      return;
    }

    item.quantity += delta;

    if (item.quantity < 1) {
      const product = findProduct(id);
      saveCart(cart.filter(entry => entry.quantity > 0));
      showToast(product.name + " removed from your cart");
    } else {
      saveCart(cart);
    }

    renderCart();
  }

  function removeItem(id) {
    const product = findProduct(id);
    saveCart(getCart().filter(item => item.id !== id));
    renderCart();
    showToast(product ? product.name + " removed from your cart" : "Item removed from your cart");
  }

  /** Builds one row in the cart. */
  function buildCartRow(item, product) {
    const image = el("img", {
      attrs: {
        src: assetPath(product.image),
        alt: product.alt,
        width: 800,
        height: 600,
        loading: "lazy",
        decoding: "async"
      }
    });

    const quantityControl = el("div", {
      class: "quantity-control",
      attrs: { role: "group", "aria-label": "Quantity for " + product.name }
    }, [
      el("button", {
        class: "decrease",
        text: "\u2212",
        attrs: { type: "button", "aria-label": "Decrease quantity of " + product.name },
        dataset: { id: product.id }
      }),
      el("span", { class: "quantity-value", text: String(item.quantity) }),
      el("button", {
        class: "increase",
        text: "+",
        attrs: { type: "button", "aria-label": "Increase quantity of " + product.name },
        dataset: { id: product.id }
      })
    ]);

    const details = el("div", {}, [
      el("h3", { text: product.name }),
      el("div", { class: "cart-meta", text: product.category + " \u00b7 " + money(product.price) + " each" }),
      el("strong", { text: money(product.price * item.quantity) }),
      el("div", { class: "cart-controls" }, [
        quantityControl,
        el("button", {
          class: "remove-button",
          text: "Remove",
          attrs: { type: "button", "aria-label": "Remove " + product.name + " from cart" },
          dataset: { id: product.id }
        })
      ])
    ]);

    return el("article", { class: "cart-item" }, [image, details]);
  }

  function renderCart() {
    const cart = getCart();

    empty.hidden = cart.length > 0;
    summary.hidden = cart.length === 0;
    clear(items);

    if (cart.length === 0) {
      return;
    }

    let subtotal = 0;

    cart.forEach(item => {
      const product = findProduct(item.id);
      if (!product) {
        return;
      }
      subtotal += product.price * item.quantity;
      items.appendChild(buildCartRow(item, product));
    });

    const delivery = subtotal >= 150 ? 0 : 5.99;

    document.getElementById("cart-subtotal").textContent = money(subtotal);
    document.getElementById("delivery-cost").textContent = delivery === 0 ? "Free" : money(delivery);
    document.getElementById("cart-total").textContent = money(subtotal + delivery);

    items.querySelectorAll(".increase").forEach(button => {
      button.addEventListener("click", () => changeQuantity(Number(button.dataset.id), 1));
    });
    items.querySelectorAll(".decrease").forEach(button => {
      button.addEventListener("click", () => changeQuantity(Number(button.dataset.id), -1));
    });
    items.querySelectorAll(".remove-button").forEach(button => {
      button.addEventListener("click", () => removeItem(Number(button.dataset.id)));
    });
  }

  /* --- Checkout modal ---------------------------------------------------
     Unlike the product dialog this panel is a plain div, so the focus
     behaviour that <dialog> provides for free has to be written by hand. */

  function openCheckout() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.getElementById("checkout-name").focus();
  }

  function closeCheckout() {
    modal.hidden = true;
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  /** Keeps Tab cycling inside the open panel instead of escaping behind it. */
  function trapFocus(event) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = modal.querySelectorAll("button, input, textarea, select, a[href]");
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", openCheckout);
  }

  document.getElementById("close-checkout").addEventListener("click", closeCheckout);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeCheckout();
    }
  });

  document.addEventListener("keydown", event => {
    if (modal.hidden) {
      return;
    }
    if (event.key === "Escape") {
      closeCheckout();
    } else {
      trapFocus(event);
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    validateAndSubmit(form, "Demonstration order placed. Thank you.", () => {
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      SmartSpaceAnalytics.trackEvent("checkout-complete");

      setTimeout(() => {
        closeCheckout();
        form.reset();
        clearValidationState(form);
        renderCart();
        showToast("Thank you for your demonstration order");
      }, 900);
    });
  });

  renderCart();
}


/* 13. Contact page ========================================================= */
function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    validateAndSubmit(form, "Message validated and submitted in this demonstration.", () => {
      SmartSpaceAnalytics.trackEvent("contact-message");
      form.reset();
      clearValidationState(form);
    });
  });
}

/**
 * Shared validation for the contact and checkout forms. Both use novalidate so
 * the messages are written here rather than left to the browser's defaults,
 * and every invalid field is marked with aria-invalid for screen readers.
 */
function validateAndSubmit(form, successMessage, onSuccess) {
  const message = form.querySelector(".form-message");
  const fields = form.querySelectorAll("input, select, textarea");
  let firstInvalid = null;

  fields.forEach(field => {
    if (field.checkValidity()) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    } else {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      firstInvalid = firstInvalid || field;
    }
  });

  if (firstInvalid) {
    message.className = "form-message is-error";
    message.textContent = "Check the highlighted fields and try again.";
    firstInvalid.focus();
    return;
  }

  message.className = "form-message is-success";
  message.textContent = successMessage;
  onSuccess();
}

/** Resets the visual validation state after a successful submission. */
function clearValidationState(form) {
  form.querySelectorAll(".is-invalid").forEach(field => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });
}


/* 14. Start-up =============================================================
   One entry point. Each init function checks for the elements it needs and
   returns early if it is running on a page that does not contain them, so the
   same script can safely be shared by all five pages. */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  updateCartCount();

  const yearField = document.getElementById("year");
  if (yearField) {
    yearField.textContent = new Date().getFullYear();
  }

  initProductDialog();
  initHome();
  initProducts();
  initCart();
  initContact();

  SmartSpaceAnalytics.trackPageView(document.body.dataset.page || "unknown");
});
