/* LOFT & CO — клиентская логика (замена Flask-бэкенда app.py и static/js/main.js) */

// ── Каталог товаров (цены в тенге) ─────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Nordic Loft Sofa", category: "Диваны", price: 890000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    description: "Трёхместный диван в скандинавском стиле" },
  { id: 2, name: "Industrial Corner Sofa", category: "Диваны", price: 1250000,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    description: "Угловой диван с металлическим каркасом" },
  { id: 3, name: "Minimalist Oak Table", category: "Столы", price: 475000,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80",
    description: "Обеденный стол из массива дуба" },
  { id: 4, name: "Steel & Wood Desk", category: "Столы", price: 632000,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    description: "Рабочий стол с металлическими ножками" },
  { id: 5, name: "Loft King Bed", category: "Кровати", price: 915000,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    description: "Кровать с деревянным изголовьем king-size" },
  { id: 6, name: "Scandinavian Bed Frame", category: "Кровати", price: 780000,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    description: "Минималистичная кровать из бука" },
  { id: 7, name: "Velvet Lounge Chair", category: "Стулья", price: 254900,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
    description: "Кресло с бархатной обивкой" },
  { id: 8, name: "Industrial Dining Chair", category: "Стулья", price: 132500,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
    description: "Стул в индустриальном стиле, металл + дерево" },
];

const ALL = "all";
let activeCategory = ALL;

// ── Утилиты ────────────────────────────────────────────────────────
const formatPrice = (price) => price.toLocaleString("ru-RU") + " ₸";

const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

const getFilteredProducts = (category = activeCategory) =>
  category === ALL ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

// ── Вывод товаров в HTML ───────────────────────────────────────────
const CART_ICON = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>`;

function productCardHTML(p) {
  const name = escapeHTML(p.name);
  const category = escapeHTML(p.category);
  const price = formatPrice(p.price);
  return `
    <div class="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500" data-category="${category}">
      <div class="relative aspect-[4/5] overflow-hidden">
        <img src="${escapeHTML(p.image)}" alt="${name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span class="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm text-dark-800 text-xs font-medium tracking-wider uppercase rounded-full">${category}</span>
        <div class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p class="text-white/80 text-sm mb-2">${escapeHTML(p.description)}</p>
          <button type="button" data-add-to-cart="${p.id}" class="w-full py-3 bg-white text-dark-900 font-medium tracking-wider uppercase text-xs rounded-xl hover:bg-brand-100 transition-all duration-300 flex items-center justify-center gap-2">
            ${CART_ICON}
            В корзину
          </button>
        </div>
        <span class="absolute top-4 right-4 px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">${price}</span>
      </div>
      <div class="p-5">
        <h3 class="font-display text-lg font-medium text-dark-800 mb-1">${name}</h3>
        <p class="text-brand-600 font-semibold">${price}</p>
      </div>
    </div>`;
}

function renderProducts(products = getFilteredProducts()) {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = products.length
    ? products.map(productCardHTML).join("")
    : '<p class="col-span-full text-center text-brand-600">Товары не найдены.</p>';
}

// ── Фильтр по категориям ───────────────────────────────────────────
const FILTER_ACTIVE = ["bg-dark-800", "text-white"];
const FILTER_INACTIVE = ["border", "border-brand-300", "text-brand-700",
  "hover:bg-dark-800", "hover:text-white", "hover:border-transparent"];

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".category-filter").forEach((btn) => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle("active", isActive);
    FILTER_ACTIVE.forEach((c) => btn.classList.toggle(c, isActive));
    FILTER_INACTIVE.forEach((c) => btn.classList.toggle(c, !isActive));
  });
  renderProducts();
}

// ── Корзина (localStorage вместо серверной памяти) ─────────────────
const CART_KEY = "loftco_cart";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  catch { /* хранилище недоступно — корзина просто не сохранится */ }
}

let cart = loadCart(); // { productId: quantity }

const getCartTotalItems = () => Object.values(cart).reduce((sum, q) => sum + q, 0);

function updateCartCounter() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = getCartTotalItems();
  renderCart();
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  cart[productId] = (cart[productId] || 0) + quantity;
  saveCart();
  updateCartCounter();
  showToast(`«${product.name}» добавлен в корзину`);
}

function clearCart() {
  cart = {};
  saveCart();
  updateCartCounter();
}

function changeQty(productId, delta) {
  const next = (cart[productId] || 0) + delta;
  if (next <= 0) delete cart[productId];
  else cart[productId] = next;
  saveCart();
  updateCartCounter();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  updateCartCounter();
}

// Товары в корзине вместе с данными из каталога
const getCartLines = () =>
  Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }))
    .filter((line) => line.product);

const getCartSum = () => getCartLines().reduce((sum, { product, qty }) => sum + product.price * qty, 0);

// ── Корзина: выезжающая панель ─────────────────────────────────────
function renderCart() {
  const box = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const footer = document.getElementById("cart-footer");
  if (!box) return;

  const lines = getCartLines();
  if (totalEl) totalEl.textContent = formatPrice(getCartSum());
  if (footer) footer.classList.toggle("hidden", lines.length === 0);

  if (!lines.length) {
    box.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center text-dark-800/50 py-20">
        <p class="font-display text-xl mb-2">Корзина пуста</p>
        <p class="text-sm">Добавьте мебель из каталога</p>
      </div>`;
    return;
  }

  box.innerHTML = lines
    .map(({ product: p, qty }) => `
      <div class="flex gap-4 py-5 border-b border-brand-100">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="w-20 h-24 object-cover rounded-lg shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="font-display text-base font-medium text-dark-800 truncate">${escapeHTML(p.name)}</h4>
          <p class="text-brand-600 font-semibold text-sm mt-0.5">${formatPrice(p.price)}</p>
          <div class="flex items-center gap-3 mt-3">
            <button type="button" data-cart-action="dec" data-id="${p.id}" class="w-8 h-8 rounded-full border border-brand-300 text-dark-800 hover:bg-dark-800 hover:text-white transition-colors" aria-label="Уменьшить">−</button>
            <span class="w-6 text-center text-sm font-medium">${qty}</span>
            <button type="button" data-cart-action="inc" data-id="${p.id}" class="w-8 h-8 rounded-full border border-brand-300 text-dark-800 hover:bg-dark-800 hover:text-white transition-colors" aria-label="Увеличить">+</button>
          </div>
        </div>
        <div class="flex flex-col items-end justify-between">
          <button type="button" data-cart-action="remove" data-id="${p.id}" class="text-dark-800/40 hover:text-dark-800 transition-colors" aria-label="Удалить">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span class="text-sm font-semibold text-dark-800">${formatPrice(p.price * qty)}</span>
        </div>
      </div>`)
    .join("");
}

// Если в index.html нет панели корзины (например, на сайте старая версия файла) — создаём её из JS
function ensureCartDrawer() {
  if (document.getElementById("cart-drawer")) return;

  const style = document.createElement("style");
  style.textContent = `
    #cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 89; opacity: 0; pointer-events: none; transition: opacity .3s ease; }
    #cart-overlay.open { opacity: 1; pointer-events: auto; }
    #cart-drawer { position: fixed; top: 0; right: 0; height: 100%; width: 100%; max-width: 28rem; background: #fff; z-index: 90;
                   display: flex; flex-direction: column; box-shadow: -10px 0 40px rgba(0,0,0,.25);
                   transform: translateX(100%); visibility: hidden; transition: transform .4s ease, visibility .4s; }
    #cart-drawer.open { transform: translateX(0); visibility: visible; }
    #site-header { z-index: 80 !important; }`;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML("beforeend", `
    <div id="cart-overlay"></div>
    <aside id="cart-drawer" aria-label="Корзина" aria-hidden="true">
      <div class="flex items-center justify-between px-6 py-5 border-b border-brand-100">
        <h2 class="font-display text-2xl font-semibold text-dark-800">Корзина</h2>
        <button id="cart-close" type="button" class="p-2 text-dark-800/60 hover:text-dark-800 transition-colors" aria-label="Закрыть корзину">✕</button>
      </div>
      <div id="cart-items" class="flex-1 overflow-y-auto px-6"></div>
      <div id="cart-footer" class="px-6 py-5 border-t border-brand-100 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm uppercase tracking-widest text-dark-800/60">Итого</span>
          <span id="cart-total" class="font-display text-2xl font-semibold text-dark-800">0 ₸</span>
        </div>
        <button id="cart-checkout" type="button" class="w-full py-4 bg-dark-800 text-white font-medium tracking-wider uppercase text-sm rounded-full hover:bg-dark-900 transition-colors duration-300">Оформить заказ</button>
        <button id="cart-clear" type="button" class="w-full py-2 text-sm text-dark-800/50 hover:text-dark-800 transition-colors">Очистить корзину</button>
      </div>
    </aside>`);
}

function openCart() {
  ensureCartDrawer();
  renderCart();
  document.getElementById("cart-drawer")?.classList.add("open");
  document.getElementById("cart-drawer")?.setAttribute("aria-hidden", "false");
  document.getElementById("cart-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("cart-drawer")?.setAttribute("aria-hidden", "true");
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

// Ссылки категорий в футере: включают нужный фильтр и прокручивают к каталогу
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-footer-category]");
  if (!link) return;
  e.preventDefault();
  setCategory(link.dataset.footerCategory);
  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
});

// Открытие корзины по клику на иконку — делегирование, работает даже если остальной код инициализации не отработал
document.addEventListener("click", (e) => {
  if (e.target.closest("#cart-btn")) openCart();
});

// Оформление: переносим состав заказа в форму консультации
function checkout() {
  const lines = getCartLines();
  if (!lines.length) return;

  const text =
    "Хочу оформить заказ:\n" +
    lines.map(({ product: p, qty }) => `• ${p.name} × ${qty} — ${formatPrice(p.price * qty)}`).join("\n") +
    `\nИтого: ${formatPrice(getCartSum())}`;

  const form = document.getElementById("consultation-form");
  const message = form?.querySelector('[name="message"]');
  if (message) message.value = text;

  closeCart();
  document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form?.querySelector('[name="name"]')?.focus({ preventScroll: true }), 600);
  showToast("Заказ добавлен в форму — укажите имя и отправьте");
}

// ── Уведомление (toast) ────────────────────────────────────────────
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  const text = document.getElementById("toast-message");
  if (!toast || !text) return;
  text.textContent = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("translate-y-20", "opacity-0"), 2500);
}

// ── Заявка на консультацию (если на странице есть форма) ───────────
// Без бэкенда заявки нужно отправлять во внешний сервис, например Formspree.
const CONTACT_EMAIL = "info@loftandco.kz";
const FORM_ENDPOINT = ""; // например: "https://formspree.io/f/xxxxxxxx"

async function submitConsultation(formData) {
  const name = (formData.name || "").trim();
  if (!name) return { ok: false, error: "Укажите ваше имя" };
  if (!FORM_ENDPOINT) {
    // Запасной вариант без сервиса: открываем почтовый клиент с готовым письмом
    const body = `Имя: ${name}\nТелефон: ${formData.phone || ""}\nEmail: ${formData.email || ""}\n\n${formData.message || ""}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Заявка на консультацию")}&body=${encodeURIComponent(body)}`;
    return { ok: true, message: "Открываем почту — отправьте письмо, и мы свяжемся с вами." };
  }

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return { ok: true, message: `Спасибо, ${name}! Дизайнер свяжется с вами в ближайшее время.` };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Не удалось отправить заявку. Попробуйте позже." };
  }
}

// ── Шапка и мобильное меню ─────────────────────────────────────────
function initHeader() {
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 50;
    ["bg-dark-900/90", "backdrop-blur-xl", "shadow-lg"].forEach((c) => header.classList.toggle(c, scrolled));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menu = document.getElementById("mobile-menu");
  document.getElementById("mobile-menu-btn")?.addEventListener("click", () => menu?.classList.toggle("hidden"));
  document.querySelectorAll(".mobile-nav-link").forEach((a) =>
    a.addEventListener("click", () => menu?.classList.add("hidden"))
  );
}

// ── Инициализация ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  ensureCartDrawer();
  renderProducts();
  updateCartCounter();
