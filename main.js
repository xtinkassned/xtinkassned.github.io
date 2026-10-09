/* ═══════════════════════════════════════════
   LOFT & CO — Main JavaScript
   Интерактивность и анимации сайта
   ═══════════════════════════════════════════ */

// ── DOM Ready ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    initHeader();
    initMobileMenu();
    initCategoryFilter();
    initScrollReveal();
    initParallax();
    initGallery();
    initConsultationForm();
});

// ── Header scroll effect ─────────────────────
function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ── Mobile menu toggle ───────────────────────
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const icon = btn.querySelector('svg');
        if (menu.classList.contains('hidden')) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />';
        }
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            const icon = btn.querySelector('svg');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />';
        });
    });
}

// ── Category filter ──────────────────────────
function initCategoryFilter() {
    const filters = document.querySelectorAll('.category-filter');
    const cards = document.querySelectorAll('.product-card');
    if (!filters.length || !cards.length) return;

    // Стили для активной и неактивной кнопки
    const activeClasses = 'bg-dark-800 text-white';
    const inactiveClasses = 'border border-brand-300 text-brand-700 hover:bg-dark-800 hover:text-white hover:border-transparent';

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Обновляем активное состояние кнопок
            filters.forEach(f => {
                f.classList.remove('active');
                f.className = f.className.replace(/\b(?:bg-dark-800|text-white|border-brand-300|text-brand-700|hover:bg-dark-800|hover:text-white|hover:border-transparent)/g, '').trim();
            });

            // Ставим активные стили на выбранную кнопку
            filter.classList.add('active', ...activeClasses.split(' '));

            const category = filter.dataset.category;

            cards.forEach((card) => {
                const cardCategory = card.dataset.category;
                const show = category === 'all' || cardCategory === category;

                if (show) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ── Scroll reveal animation ──────────────────
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// ── Parallax effect for hero ─────────────────
function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ── Sofa gallery carousel ────────────────────
function initGallery() {
    const track = document.querySelector('.gallery-track');
    if (!track) return;

    const slides = track.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const dotsContainer = document.querySelector('.gallery-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Create dots
    if (dotsContainer && totalSlides > 1) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
            goToSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
            goToSlide(currentSlide);
        });
    }

    // Auto-play
    let autoplay = setInterval(() => {
        currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
    }, 5000);

    // Pause on hover
    const carousel = document.querySelector('.gallery-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
        carousel.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => {
                currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
                goToSlide(currentSlide);
            }, 5000);
        });
    }

    // Touch/swipe support
    let touchStartX = 0, touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            currentSlide += diff > 0 ? 1 : -1;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            goToSlide(currentSlide);
        }
    }, { passive: true });

    window.galleryGoTo = goToSlide;
}

// ── Consultation form ────────────────────────
function initConsultationForm() {
    const form = document.getElementById('consultation-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<svg class="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Отправка...`;

        const formData = {
            name: form.querySelector('[name="name"]').value,
            phone: form.querySelector('[name="phone"]').value,
            email: form.querySelector('[name="email"]').value,
            message: form.querySelector('[name="message"]').value,
        };

        try {
            const response = await fetch('/api/consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (result.ok) {
                showToast(result.message);
                form.reset();
            } else {
                showToast(result.error || 'Ошибка отправки', true);
            }
        } catch (err) {
            showToast('Ошибка соединения. Попробуйте позже.', true);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// ── Add to cart ──────────────────────────────
function addToCart(productId, productName) {
    fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, quantity: 1 }),
    })
    .then(res => res.json())
    .then(data => {
        updateCartBadge(data.total);
        showToast(`${productName} добавлен в корзину`);
    })
    .catch(() => showToast('Ошибка. Попробуйте позже.', true));
}

function clearCart() {
    fetch('/api/cart/clear', { method: 'POST' })
    .then(res => res.json())
    .then(data => { updateCartBadge(0); showToast('Корзина очищена'); });
}

function updateCartBadge(count) {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 400);
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ── Toast notification ───────────────────────
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    const icon = toast.querySelector('svg');
    if (icon) {
        icon.classList.toggle('text-green-400', !isError);
        icon.classList.toggle('text-red-400', isError);
    }

    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
    }, 3500);
}

// ── Quick view modal ─────────────────────────
function openQuickView(product) {
    const overlay = document.getElementById('quickview-modal');
    if (!overlay) return;

    const content = overlay.querySelector('.modal-content');
    
    // Populate modal with product data
    const imgEl = content.querySelector('[data-qv-img]');
    const nameEl = content.querySelector('[data-qv-name]');
    const categoryEl = content.querySelector('[data-qv-category]');
    const priceEl = content.querySelector('[data-qv-price]');
    const descEl = content.querySelector('[data-qv-desc]');

    if (imgEl) imgEl.src = product.image;
    if (nameEl) nameEl.textContent = product.name;
    if (categoryEl) categoryEl.textContent = product.category;
    if (priceEl) priceEl.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    if (descEl) descEl.textContent = product.description;

    // Setup add to cart button
    const btn = content.querySelector('[data-qv-btn]');
    if (btn) {
        btn.onclick = () => addToCart(product.id, product.name);
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const overlay = document.getElementById('quickview-modal');
    if (!overlay) return;
    
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.id === 'quickview-modal') closeQuickView();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuickView();
});
