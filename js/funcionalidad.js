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
      vacio.className = "muted";
      vacio.textContent = "Tu carrito está vacío por ahora.";
      listaCarrito.appendChild(vacio);
      return;
    }

    carrito.forEach(producto => {
      const li = document.createElement("li");
      const nombre = typeof producto === "string" ? producto : (producto.nombre || "Producto");
      const cantidad = typeof producto === "string" ? 1 : (Number(producto.cantidad) || 1);
      const talla = (typeof producto === "object" && producto.talla) ? `Talla ${producto.talla}` : "";
      const precio = (typeof producto === "object" && Number(producto.precio)) ? `C$${Number(producto.precio).toFixed(0)}` : "";
      const imagen = (typeof producto === "object" && producto.img) ? producto.img : "/img/placeholder.webp";

      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item-content">
          <img src="${imagen}" alt="" class="cart-item-thumb" loading="lazy" decoding="async">
          <div>
            <strong>${nombre}</strong>
            ${talla ? `<span class="cart-item-size">${talla}</span>` : ""}
            ${precio ? `<div class="cart-item-price">${precio}</div>` : ""}
            <div class="cart-item-quantity">Cantidad: ${cantidad}</div>
          </div>
        </div>`;
      listaCarrito.appendChild(li);
    });
  }

  function mostrarAnimacionAgregar(nombreProducto) {
    const anterior = document.querySelector(".cart-toast");
    if (anterior) anterior.remove();

    const notificacion = document.createElement("div");
    notificacion.className = "cart-toast";
    notificacion.setAttribute("role", "status");
    notificacion.textContent = `✓ ${nombreProducto} añadido al carrito`;
    Object.assign(notificacion.style, {
      position: "fixed",
      top: "92px",
      right: "20px",
      background: "linear-gradient(135deg,#8b3dff,#b14cff)",
      color: "#fff",
      padding: "12px 18px",
      borderRadius: "12px",
      boxShadow: "0 16px 35px rgba(0,0,0,.35)",
      zIndex: "2000",
      opacity: "0",
      transform: "translateY(-8px)",
      transition: "opacity .2s ease, transform .2s ease",
      fontWeight: "800",
      maxWidth: "min(360px,calc(100vw - 40px))"
    });

    document.body.appendChild(notificacion);
    requestAnimationFrame(() => {
      notificacion.style.opacity = "1";
      notificacion.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      notificacion.style.opacity = "0";
      notificacion.style.transform = "translateY(-8px)";
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

      const img = productoEl?.querySelector(".product-img img, img")?.src || "/img/placeholder.webp";
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
  actualizarVistaCarrito();
});
