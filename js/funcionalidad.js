document.addEventListener("DOMContentLoaded", function () {
  const enlacesAgregar = document.querySelectorAll(".agregar-carrito");
  const vistaPrevia = document.getElementById("vista-previa-carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const contador = document.getElementById("contador-carrito");
  const botonCarrito =
    document.getElementById("carrito-header-btn") ||
    document.getElementById("carrito-btn") ||
    document.querySelector(".carrito-toggle");
  const cerrarCarrito = document.getElementById("cerrar-carrito");

  function leerCarrito() {
    try {
      const data = JSON.parse(localStorage.getItem("carrito"));
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  }

  function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new CustomEvent("carrito:actualizado"));
  }

  function normalizarRutaImagen(src) {
    if (!src) return "/img/placeholder.webp";
    const valor = String(src).trim();
    if (!valor) return "/img/placeholder.webp";

    // Convierte URLs absolutas o rutas file:// antiguas a una ruta estable /img/...
    try {
      const url = new URL(valor, document.baseURI);
      const pathname = decodeURIComponent(url.pathname || "");
      const indiceImg = pathname.toLowerCase().lastIndexOf("/img/");
      if (indiceImg >= 0) return pathname.slice(indiceImg);
      if (url.origin === window.location.origin) return pathname || valor;
    } catch (_) {}

    const normalizado = valor.replace(/\\/g, "/");
    const indice = normalizado.toLowerCase().lastIndexOf("/img/");
    if (indice >= 0) return normalizado.slice(indice);
    return valor;
  }

  function obtenerImagenProducto(boton, productoEl) {
    // En páginas con variantes, scripts.js mantiene data-img sincronizado.
    if (boton?.dataset?.img) return normalizarRutaImagen(boton.dataset.img);

    let imagenEl = productoEl?.querySelector?.(".product-img img, #imagen-principal, .gallery-main img, img");

    // En páginas de detalle el botón vive en .product-info y la galería es su hermana.
    if (!imagenEl) {
      const detalle = boton?.closest?.(".product-detail, .detalle-producto, .product-detail-grid");
      imagenEl = detalle?.querySelector?.("#imagen-principal, .gallery-main img, .product-gallery img, img");
    }

    const src = imagenEl?.getAttribute?.("src") || imagenEl?.currentSrc || imagenEl?.src;
    return normalizarRutaImagen(src);
  }

  function cantidadTotal(carrito) {
    return carrito.reduce((total, item) => {
      if (typeof item === "string") return total + 1;
      return total + Math.max(1, Number(item.cantidad) || 1);
    }, 0);
  }

  function actualizarVistaCarrito() {
    const carrito = leerCarrito();
    if (contador) contador.textContent = cantidadTotal(carrito);
    if (!listaCarrito) return;

    listaCarrito.innerHTML = "";
    if (!carrito.length) {
      const vacio = document.createElement("li");
      vacio.className = "mini-cart-empty";
      vacio.innerHTML = `<strong>Tu carrito está vacío</strong><span>Agrega productos para verlos aquí.</span>`;
      listaCarrito.appendChild(vacio);
    } else {
      carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        const nombre = typeof producto === "string" ? producto : (producto.nombre || "Producto");
        const cantidad = typeof producto === "string" ? 1 : (Number(producto.cantidad) || 1);
        const talla = (typeof producto === "object" && producto.talla) ? `Talla ${producto.talla}` : "";
        const precioNum = (typeof producto === "object" && Number(producto.precio)) ? Number(producto.precio) : 0;
        const imagen = (typeof producto === "object" && producto.img) ? normalizarRutaImagen(producto.img) : "/img/placeholder.webp";

        li.className = "cart-item";
        li.innerHTML = `
          <div class="cart-item-content">
            <img src="${imagen}" alt="${nombre}" class="cart-item-thumb" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/img/placeholder.webp';">
            <div class="cart-item-info">
              <strong>${nombre}</strong>
              ${talla ? `<span class="cart-item-size">${talla}</span>` : ""}
              ${precioNum ? `<div class="cart-item-price">C$${precioNum.toFixed(0)}</div>` : ""}
              <div class="mini-cart-controls" aria-label="Cantidad de ${nombre}">
                <button type="button" class="mini-cart-qty" data-action="minus" aria-label="Disminuir cantidad">−</button>
                <span>${cantidad}</span>
                <button type="button" class="mini-cart-qty" data-action="plus" aria-label="Aumentar cantidad">+</button>
                <button type="button" class="mini-cart-remove" aria-label="Eliminar ${nombre}">Eliminar</button>
              </div>
            </div>
          </div>`;

        const minus = li.querySelector('[data-action="minus"]');
        const plus = li.querySelector('[data-action="plus"]');
        const remove = li.querySelector('.mini-cart-remove');
        minus.addEventListener('click', () => cambiarCantidad(index, -1));
        plus.addEventListener('click', () => cambiarCantidad(index, 1));
        remove.addEventListener('click', () => eliminarDelCarrito(index));
        listaCarrito.appendChild(li);
      });
    }

    let summary = vistaPrevia?.querySelector('.mini-cart-summary');
    if (!summary && vistaPrevia) {
      summary = document.createElement('div');
      summary.className = 'mini-cart-summary';
      const fullLink = vistaPrevia.querySelector('a[href*="carrito.html"]');
      if (fullLink) vistaPrevia.insertBefore(summary, fullLink);
      else vistaPrevia.appendChild(summary);
    }
    if (summary) {
      const subtotal = carrito.reduce((sum, item) => {
        if (typeof item === 'string') return sum;
        return sum + (Number(item.precio) || 0) * (Number(item.cantidad) || 1);
      }, 0);
      summary.innerHTML = carrito.length
        ? `<span>Subtotal</span><strong>C$${subtotal.toFixed(0)}</strong>`
        : '';
    }
  }

  function cambiarCantidad(index, delta) {
    const carrito = leerCarrito();
    if (!carrito[index]) return;
    if (typeof carrito[index] === 'string') {
      if (delta < 0) carrito.splice(index, 1);
    } else {
      const actual = Math.max(1, Number(carrito[index].cantidad) || 1);
      const nueva = actual + delta;
      if (nueva <= 0) carrito.splice(index, 1);
      else carrito[index].cantidad = nueva;
    }
    guardarCarrito(carrito);
    actualizarVistaCarrito();
  }

  function eliminarDelCarrito(index) {
    const carrito = leerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    actualizarVistaCarrito();
  }

  function mostrarAnimacionAgregar(nombreProducto) {
    const anterior = document.querySelector(".cart-toast");
    if (anterior) anterior.remove();

    const notificacion = document.createElement("div");
    notificacion.className = "cart-toast";
    notificacion.setAttribute("role", "status");
    notificacion.textContent = `✓ ${nombreProducto} añadido al carrito`;

    document.body.appendChild(notificacion);
    requestAnimationFrame(() => {
      notificacion.classList.add("show");
    });
    setTimeout(() => {
      notificacion.classList.remove("show");
      setTimeout(() => notificacion.remove(), 250);
    }, 1900);
  }

  enlacesAgregar.forEach(enlace => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();

      const productoEl = this.closest(".product-card, .producto, .detalle-producto, .product-detail, .product-info");
      const nombre = this.dataset.producto?.trim() ||
        productoEl?.querySelector("h3, h1")?.textContent?.trim() ||
        "Producto";

      const img = obtenerImagenProducto(this, productoEl);
      let precioTexto =
        productoEl?.querySelector(".product-price, .price, .precio, .price-row span, .product-body .price")?.textContent?.trim() ||
        this.dataset.precio ||
        "0";
      const precio = parseFloat(precioTexto.replace(/[^\d.]/g, "")) || 0;
      const descripcion = productoEl?.querySelector("p")?.textContent?.trim() || "";

      const tallaSelect =
        productoEl?.querySelector(".talla-select select") ||
        productoEl?.querySelector("select#talla, select[name='talla']");
      const talla = tallaSelect?.value || "";

      if (tallaSelect && !talla) {
        tallaSelect.focus();
        alert("Selecciona una talla antes de agregar al carrito.");
        return;
      }

      const carrito = leerCarrito();
      const existente = carrito.find(item => {
        if (typeof item === "string") return item === nombre && !talla;
        return item.nombre === nombre && ((item.talla || "") === talla);
      });

      if (existente && typeof existente === "object") {
        existente.cantidad = (Number(existente.cantidad) || 1) + 1;
      } else {
        carrito.push({
          nombre,
          img,
          precio,
          descripcion,
          cantidad: 1,
          talla: talla || undefined
        });
      }

      guardarCarrito(carrito);
      actualizarVistaCarrito();
      mostrarAnimacionAgregar(nombre + (talla ? ` (${talla})` : ""));
    });
  });

  function abrirCarrito() {
    if (!vistaPrevia) return;
    vistaPrevia.classList.add("open");
    vistaPrevia.style.display = "block";
    botonCarrito?.setAttribute("aria-expanded", "true");
    actualizarVistaCarrito();
    setTimeout(() => vistaPrevia.focus(), 50);
  }

  function cerrarVista() {
    if (!vistaPrevia) return;
    vistaPrevia.classList.remove("open");
    vistaPrevia.style.display = "none";
    botonCarrito?.setAttribute("aria-expanded", "false");
  }

  if (botonCarrito && vistaPrevia) {
    botonCarrito.setAttribute("aria-expanded", "false");
    botonCarrito.addEventListener("click", function (e) {
      e.stopPropagation();
      const abierto = vistaPrevia.style.display === "block";
      abierto ? cerrarVista() : abrirCarrito();
    });
  }

  cerrarCarrito?.addEventListener("click", function () {
    cerrarVista();
    botonCarrito?.focus();
  });

  document.addEventListener("click", function (e) {
    if (!vistaPrevia || vistaPrevia.style.display !== "block") return;
    if (!vistaPrevia.contains(e.target) && !botonCarrito?.contains(e.target)) cerrarVista();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && vistaPrevia?.style.display === "block") {
      cerrarVista();
      botonCarrito?.focus();
    }
  });

  window.addEventListener("storage", actualizarVistaCarrito);
  window.addEventListener("carrito:actualizado", actualizarVistaCarrito);
  actualizarVistaCarrito();
});
