// scripts.js - Funcionalidad básica inicial

// Enviar formularios de contacto a WhatsApp solo en secciones existentes
function buildWhatsAppFormMessage(form) {
  const nombre = form.querySelector('input[type="text"]')?.value.trim();
  const correo = form.querySelector('input[type="email"]')?.value.trim();
  const mensaje = form.querySelector('textarea')?.value.trim();
  const partes = [];

  partes.push('Hola, quiero hacer un pedido personalizado.');
  if (nombre) partes.push(`Mi nombre es ${nombre}.`);
  if (correo) partes.push(`Mi correo es ${correo}.`);
  if (mensaje) partes.push(`Detalle: ${mensaje}`);
  if (!mensaje) partes.push('Por favor, contáctame para coordinar los detalles.');

  return partes.join(' ');
}

document.addEventListener("DOMContentLoaded", function () {
  const contactForms = document.querySelectorAll('section#contacto form, section#contacto-tienda form, .contact-card-section form');
  contactForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const texto = buildWhatsAppFormMessage(form);
      const url = `https://wa.me/50577002788?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank', 'noopener');
    });
  });

  // Menú hamburguesa: toggle para navegación móvil
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('header nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // cambiar foco al primer enlace cuando se abre
      if (isOpen) {
        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Cerrar menú si se pulsa fuera en móvil
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && e.target !== navToggle && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

  // Carrusel: flechas, autoplay suave y efecto de proximidad
  document.addEventListener('DOMContentLoaded', function () {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(function (carousel) {
      const wrap = carousel.closest('.carousel-wrap');
      const btnPrev = wrap ? wrap.querySelector('.carousel-nav.prev') : null;
      const btnNext = wrap ? wrap.querySelector('.carousel-nav.next') : null;
      const auto = carousel.dataset.autoplay === 'true';
      const intervalMs = parseInt(carousel.dataset.autoplayInterval || carousel.getAttribute('data-autoplay-interval') || 3500, 10) || 3500;
      let timer = null;
      let userInteracted = false;

      function computeItemWidth() {
        const producto = carousel.querySelector('.producto');
        const gap = parseInt(getComputedStyle(carousel).gap) || 16;
        return producto ? Math.round(producto.getBoundingClientRect().width + gap) : Math.round(carousel.clientWidth / 3);
      }

      let itemWidth = computeItemWidth();
      window.addEventListener('resize', function () { itemWidth = computeItemWidth(); });
      // Recompute after images load inside carousel
      carousel.querySelectorAll('img').forEach(img => img.addEventListener('load', function () { itemWidth = computeItemWidth(); }));

      function scrollNext() { carousel.scrollBy({ left: itemWidth, behavior: 'smooth' }); }
      function scrollPrev() { carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' }); }

      if (btnNext) btnNext.addEventListener('click', function () { userInteracted = true; scrollNext(); resetTimer(); });
      if (btnPrev) btnPrev.addEventListener('click', function () { userInteracted = true; scrollPrev(); resetTimer(); });

      function startTimer() { if (auto && !timer && !userInteracted) timer = setInterval(scrollNext, intervalMs); }
      function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
      function resetTimer() { stopTimer(); if (!userInteracted) startTimer(); }

      carousel.addEventListener('mouseenter', stopTimer);
      carousel.addEventListener('mouseleave', function () { if (auto && !userInteracted) startTimer(); });
      carousel.addEventListener('focusin', stopTimer);
      carousel.addEventListener('focusout', function () { if (auto && !userInteracted) startTimer(); });

      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); userInteracted = true; scrollNext(); resetTimer(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); userInteracted = true; scrollPrev(); resetTimer(); }
      });

      // Proximity effect for nav buttons
      if (wrap && (btnPrev || btnNext)) {
        const zone = 160; // px zone from edges where buttons start showing
        wrap.addEventListener('mousemove', function (e) {
          const rect = wrap.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const w = rect.width;
          const leftDist = Math.max(0, Math.min(zone, x));
          const rightDist = Math.max(0, Math.min(zone, w - x));
          const leftOpacity = leftDist < zone ? (1 - leftDist / zone) : 0;
          const rightOpacity = rightDist < zone ? (1 - rightDist / zone) : 0;
          if (btnPrev) {
            btnPrev.style.opacity = String(Math.max(0, Math.min(1, leftOpacity)));
            btnPrev.style.transform = `translateX(${ -16 * (1 - leftOpacity) }px) scale(${ 1 + 0.06 * leftOpacity })`;
          }
          if (btnNext) {
            btnNext.style.opacity = String(Math.max(0, Math.min(1, rightOpacity)));
            btnNext.style.transform = `translateX(${ 16 * (1 - rightOpacity) }px) scale(${ 1 + 0.06 * rightOpacity })`;
          }
        });

        wrap.addEventListener('mouseleave', function () {
          if (btnPrev) { btnPrev.style.opacity = '0'; btnPrev.style.transform = 'translateX(0) scale(1)'; }
          if (btnNext) { btnNext.style.opacity = '0'; btnNext.style.transform = 'translateX(0) scale(1)'; }
        });

        // Ensure visible when focused via keyboard
        if (btnPrev) btnPrev.addEventListener('focus', function () { btnPrev.style.opacity = '1'; });
        if (btnPrev) btnPrev.addEventListener('blur', function () { btnPrev.style.opacity = '0'; });
        if (btnNext) btnNext.addEventListener('focus', function () { btnNext.style.opacity = '1'; });
        if (btnNext) btnNext.addEventListener('blur', function () { btnNext.style.opacity = '0'; });
      }

      // Start autoplay if enabled
      startTimer();
    });
  });

// Selector de variante: miniaturas verticales
document.addEventListener('DOMContentLoaded', function() {
  const miniaturas = document.querySelectorAll('.miniatura');
  if (miniaturas.length === 0) return; // No hay selector en esta página

  const imagenPrincipal = document.getElementById('imagen-principal');
  const tituloPrincipal = document.getElementById('titulo-principal');
  const descripcionPrincipal = document.getElementById('descripcion-principal');
  const precioPrincipal = document.getElementById('precio-principal');
  const botonAgregar = document.querySelector('.agregar-carrito');
  const whatsappLink = document.getElementById('whatsapp-order');
  const tallaSelect = document.getElementById('talla');

  function actualizarWhatsapp(producto, talla) {
    if (!whatsappLink) return;
    const tallaTexto = talla ? ` talla ${talla}` : '';
    const texto = encodeURIComponent(`Hola, quiero ordenar la ${producto}${tallaTexto}`);
    whatsappLink.href = `https://wa.me/50577002788?text=${texto}`;
  }

  // Datos de variantes - se pueden definir por página o globalmente
  const variantes = window.variantesData || {};

  function aplicarDatos(data) {
    if (!data) return;
    if (imagenPrincipal) imagenPrincipal.src = data.img;
    if (tituloPrincipal) tituloPrincipal.textContent = data.titulo;
    if (descripcionPrincipal) descripcionPrincipal.textContent = data.desc;
    if (precioPrincipal) precioPrincipal.textContent = data.precio || '';
    if (botonAgregar) {
      botonAgregar.dataset.producto = data.producto;
      botonAgregar.dataset.img = data.img || '';
      botonAgregar.dataset.precio = data.precio || '';
      botonAgregar.textContent = data.precio ? `Agregar al carrito - ${data.precio}` : 'Agregar al carrito';
    }
    actualizarWhatsapp(data.producto, tallaSelect ? tallaSelect.value : 'M');
  }

  miniaturas.forEach(mini => {
    mini.addEventListener('click', function() {
      miniaturas.forEach(m => m.classList.remove('activa'));
      this.classList.add('activa');
      const variante = this.dataset.variante;
      const data = variantes[variante];
      aplicarDatos(data);
    });
  });

  if (tallaSelect) {
    tallaSelect.addEventListener('change', function() {
      const producto = botonAgregar ? botonAgregar.dataset.producto || tituloPrincipal?.textContent || 'producto' : 'producto';
      actualizarWhatsapp(producto, this.value);
    });
  }

  // Seleccionar primera por defecto
  if (miniaturas.length > 0) {
    miniaturas[0].click();
  }
});


// ===== FASE 4: EXPERIENCIA DE COMPRA =====
document.addEventListener('DOMContentLoaded', function () {
  // Marcar enlace activo de navegación.
  const currentPath = decodeURIComponent(window.location.pathname).replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('header nav a').forEach(link => {
    try {
      const path = decodeURIComponent(new URL(link.href, window.location.href).pathname).replace(/\/$/, '');
      if (path === currentPath || (currentPath === '' && path.endsWith('/index.html'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    } catch (_) {}
  });

  // Breadcrumb en páginas de detalle.
  const detail = document.querySelector('.product-detail');
  const detailMain = detail?.closest('main');
  if (detail && detailMain && !detailMain.querySelector('.breadcrumbs')) {
    const title = detail.querySelector('h1')?.textContent?.trim() || 'Producto';
    const crumbs = document.createElement('nav');
    crumbs.className = 'breadcrumbs';
    crumbs.setAttribute('aria-label', 'Ruta de navegación');
    crumbs.innerHTML = `<a href="/tienda.html">Tienda</a><span aria-hidden="true">›</span><a href="/camisetas.html">Camisetas</a><span aria-hidden="true">›</span><span aria-current="page"></span>`;
    crumbs.querySelector('[aria-current="page"]').textContent = title;
    detail.parentNode.insertBefore(crumbs, detail);
  }

  // Buscador + ordenamiento en páginas con catálogo suficiente.
  const cards = Array.from(document.querySelectorAll('.product-card'));
  if (cards.length >= 6 && !document.querySelector('.catalog-toolbar')) {
    const firstGrid = cards[0].closest('.product-grid, .grid-productos');
    const hostSection = firstGrid?.closest('section');
    if (firstGrid && hostSection) {
      const toolbar = document.createElement('div');
      toolbar.className = 'catalog-toolbar container';
      toolbar.id = 'catalog-search';
      toolbar.innerHTML = `
        <div class="catalog-search-box">
          <label for="catalog-search-input">Buscar productos</label>
          <div class="catalog-search-input-wrap">
            <span aria-hidden="true">⌕</span>
            <input id="catalog-search-input" type="search" placeholder="Busca por personaje, anime o producto…" autocomplete="off">
            <button type="button" class="catalog-clear" aria-label="Limpiar búsqueda" hidden>×</button>
          </div>
        </div>
        <div class="catalog-sort-box">
          <label for="catalog-sort">Ordenar</label>
          <select id="catalog-sort">
            <option value="default">Orden original</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A–Z</option>
          </select>
        </div>
        <p class="catalog-results" aria-live="polite"></p>`;
      hostSection.parentNode.insertBefore(toolbar, hostSection);

      const input = toolbar.querySelector('#catalog-search-input');
      const clearBtn = toolbar.querySelector('.catalog-clear');
      const sort = toolbar.querySelector('#catalog-sort');
      const results = toolbar.querySelector('.catalog-results');
      const managedSections = Array.from(new Set(cards.map(card => card.closest('section')).filter(Boolean)));

      cards.forEach((card, index) => {
        card.dataset.catalogOrder = String(index);
        const priceText = card.querySelector('.price, .product-price, .precio, .price-row')?.textContent || '';
        card.dataset.catalogPrice = String(parseFloat(priceText.replace(/[^\d.]/g, '')) || 0);
        card.dataset.catalogName = (card.querySelector('h3, h2')?.textContent || '').trim();
      });

      function updateSections() {
        managedSections.forEach(section => {
          const sectionCards = Array.from(section.querySelectorAll('.product-card'));
          section.hidden = sectionCards.length > 0 && sectionCards.every(card => card.hidden);
        });
      }

      function applySearch() {
        const query = input.value.trim().toLocaleLowerCase('es');
        let visible = 0;
        cards.forEach(card => {
          const haystack = card.textContent.toLocaleLowerCase('es');
          const match = !query || haystack.includes(query);
          card.hidden = !match;
          if (match) visible += 1;
        });
        clearBtn.hidden = !query;
        results.textContent = query
          ? `${visible} ${visible === 1 ? 'producto encontrado' : 'productos encontrados'}`
          : `${cards.length} productos disponibles`;
        updateSections();
      }

      function applySort() {
        const mode = sort.value;
        const grids = Array.from(new Set(cards.map(card => card.closest('.product-grid, .grid-productos')).filter(Boolean)));
        grids.forEach(grid => {
          const localCards = Array.from(grid.querySelectorAll(':scope > .product-card'));
          localCards.sort((a, b) => {
            if (mode === 'price-asc') return Number(a.dataset.catalogPrice) - Number(b.dataset.catalogPrice);
            if (mode === 'price-desc') return Number(b.dataset.catalogPrice) - Number(a.dataset.catalogPrice);
            if (mode === 'name-asc') return a.dataset.catalogName.localeCompare(b.dataset.catalogName, 'es');
            return Number(a.dataset.catalogOrder) - Number(b.dataset.catalogOrder);
          });
          localCards.forEach(card => grid.appendChild(card));
        });
      }

      input.addEventListener('input', applySearch);
      clearBtn.addEventListener('click', () => { input.value = ''; applySearch(); input.focus(); });
      sort.addEventListener('change', applySort);
      applySearch();
    }
  }
});
