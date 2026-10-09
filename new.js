/* LOFT & CO — клиентская логика (замена Flask-бэкенда app.py) */

// ── Каталог товаров (цены в тенге) ─────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Nordic Loft Sofa",
    category: "Диваны",
    price: 890000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    description: "Трёхместный диван в скандинавском стиле",
  },
  {
    id: 2,
    name: "Industrial Corner Sofa",
    category: "Диваны",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    description: "Угловой диван с металлическим каркасом",
  },
  {
    id: 3,
    name: "Minimalist Oak Table",
    category: "Столы",
    price: 475000,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80",
    description: "Обеденный стол из массива дуба",
  },
  {
    id: 4,
    name: "Steel & Wood Desk",
    category: "Столы",
    price: 632000,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    description: "Рабочий стол с металлическими ножками",
  },
  {
    id: 5,
    name: "Loft King Bed",
    category: "Кровати",
    price: 915000,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    description: "Кровать с деревянным изголовьем king-size",
  },
  {
    id: 6,
    name: "Scandinavian Bed Frame",
    category: "Кровати",
    price: 780000,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    description: "Минималистичная кровать из бука",
  },
  {
    id: 7,
    name: "Velvet Lounge Chair",
    category: "Стулья",
    price: 254900,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
    description: "Кресло с бархатной обивкой",
  },
  {
    id: 8,
    name: "Industrial Dining Chair",
    category: "Стулья",
    price: 132500,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
    description: "Стул в индустриальном стиле, металл + дерево",
  },
];

const ALL_CATEGORIES = "Все";
let activeCategory = ALL_CATEGORIES;

// ── Утилиты ────────────────────────────────────────────────────────
const formatPrice = (price) => price.toLocaleString("ru-RU") + " ₸";

const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

// Список категорий берётся из самих товаров (порядок сохраняется)
const getCategories = () => [ALL_CATEGORIES, ...new Set(PRODUCTS.map((p) => p.category))];

const getFilteredProducts = (category = activeCategory) =>
  category === ALL_CATEGORIES ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

// ── Вывод товаров в HTML ───────────────────────────────────────────
function renderProducts(products = getFilteredProducts()) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = "<p>Товары не найдены.</p>";
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card" data-id="${p.id}">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">
        <div class="product-info">
          <span class="product-category">${escapeHTML(p.category)}</span>
          <h3 class="product-name">${escapeHTML(p.name)}</h3>
          <p class="product-description">${escapeHTML(p.description)}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}</span>
            <button class="add-to-cart" data-id="${p.id}">В корзину</button>
          </div>
        </div>
      </article>`
    )
    .join("");
}

// ── Фильтр по категориям ───────────────────────────────────────────
function renderCategoryFilters() {
  const box = document.getElementById("category-filters");
  if (!box) return;

  box.innerHTML = getCategories()
    .map(
      (c) =>
        `<button class="filter-btn${c === activeCategory ? " active" : ""}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`
    )
    .join("");
}

function setCategory(category) {
  activeCategory = category;
  renderCategoryFilters();
  renderProducts();
}

// ── Корзина (localStorage вместо серверной памяти) ─────────────────
const CART_KEY = "loftco_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* хранилище недоступно — корзина просто не сохранится */
  }
}

let cart = loadCart(); // { productId: quantity }

const getCartTotalItems = () => Object.values(cart).reduce((sum, q) => sum + q, 0);

function updateCartCounter() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = getCartTotalItems();
}

function addToCart(productId, quantity = 1) {
  cart[productId] = (cart[productId] || 0) + quantity;
  saveCart(cart);
  updateCartCounter();
}

function clearCart() {
  cart = {};
  saveCart(cart);
  updateCartCounter();
}

// ── Заявка на консультацию ─────────────────────────────────────────
// Без бэкенда заявку нужно отправлять во внешний сервис.
// Вариант: Formspree (https://formspree.io) — создайте форму и вставьте её URL.
const FORM_ENDPOINT = ""; // например: "https://formspree.io/f/xxxxxxxx"

async function submitConsultation(formData) {
  const name = (formData.name || "").trim();
  if (!name) return { ok: false, error: "Укажите ваше имя" };

  if (!FORM_ENDPOINT) {
    console.warn("FORM_ENDPOINT не задан — заявка не отправлена:", formData);
    return { ok: false, error: "Отправка заявок пока не настроена" };
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

// ── Инициализация ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryFilters();
  renderProducts();
  updateCartCounter();

  // Клики по фильтрам и кнопкам «В корзину» (делегирование событий)
  document.addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".filter-btn");
    if (filterBtn) return setCategory(filterBtn.dataset.category);

    const addBtn = e.target.closest(".add-to-cart");
    if (addBtn) {
      addToCart(Number(addBtn.dataset.id));
      addBtn.textContent = "Добавлено ✓";
      setTimeout(() => (addBtn.textContent = "В корзину"), 1200);
    }
  });

  // Форма консультации
  const form = document.getElementById("consultation-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const result = await submitConsultation(data);
      alert(result.ok ? result.message : result.error);
      if (result.ok) form.reset();
    });
  }
});