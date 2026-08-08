document.addEventListener("DOMContentLoaded", function () {
  const enlacesAgregar = document.querySelectorAll(".agregar-carrito");
  const vistaPrevia = document.getElementById("vista-previa-carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const contador = document.getElementById("contador-carrito");
  let botonCarrito = document.getElementById("carrito-header-btn");
  // Soporta también el botón flotante antiguo `carrito-btn` o cualquier toggle con clase `carrito-toggle`
  if (!botonCarrito) botonCarrito = document.getElementById("carrito-btn");
  if (!botonCarrito) botonCarrito = document.querySelector(".carrito-toggle");
  const cerrarCarrito = document.getElementById("cerrar-carrito");

  function actualizarVistaCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    listaCarrito.innerHTML = "";
    carrito.forEach(producto => {
      const li = document.createElement("li");
      const nombre = typeof producto === 'string' ? producto : (producto.nombre || 'Producto');
      const cantidad = typeof producto === 'string' ? 1 : (producto.cantidad || 1);
      const talla = (typeof producto === 'object' && producto.talla) ? ` - Talla ${producto.talla}` : '';
      const precio = (typeof producto === 'object' && producto.precio) ? `C$${producto.precio}` : '';
      const imagen = (typeof producto === 'object' && producto.img) ? producto.img : '';

      if (imagen) {
        li.className = 'cart-item';
        li.innerHTML = `
          <div class="cart-item-content">
            <img src="${imagen}" alt="${nombre}" class="cart-item-thumb" />
            <div>
              <strong>${nombre}</strong>${talla ? `<span class="cart-item-size">${talla}</span>` : ''}
              ${precio ? `<div class="cart-item-price">${precio}</div>` : ''}
              <div class="cart-item-quantity">Cantidad: ${cantidad}</div>
            </div>
          </div>
        `;
      } else {
        li.textContent = `${nombre}${talla} (x${cantidad})${precio ? ` — ${precio}` : ''}`;
      }
      listaCarrito.appendChild(li);
    });
    if (contador) contador.textContent = carrito.length;
  }

  function mostrarAnimacionAgregar(nombreProducto) {
    const notificacion = document.createElement("div");
    notificacion.textContent = `${nombreProducto} añadido al carrito`;
    notificacion.style.position = "fixed";
    notificacion.style.top = "20px";
    notificacion.style.right = "20px";
    notificacion.style.background = "#000";
    notificacion.style.color = "#fff";
    notificacion.style.padding = "10px 20px";
    notificacion.style.borderRadius = "8px";
    notificacion.style.zIndex = 2000;
    notificacion.style.opacity = 0;
    notificacion.style.transition = "opacity 0.5s ease";

    document.body.appendChild(notificacion);
    setTimeout(() => {
      notificacion.style.opacity = 1;
    }, 100);

    setTimeout(() => {
      notificacion.style.opacity = 0;
      setTimeout(() => document.body.removeChild(notificacion), 500);
    }, 2000);
  }

  enlacesAgregar.forEach(enlace => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      const productoEl = this.closest('.product-card, .producto, .detalle-producto, .product-detail, .product-info');
      const nombre = this.dataset.producto?.trim() || (productoEl ? productoEl.querySelector('h3, h1')?.textContent?.trim() : 'Producto');
      const img = productoEl ? productoEl.querySelector('.product-img img, img')?.src || '' : '';
      let precioTexto = productoEl ? productoEl.querySelector('.product-price, .price, .precio, .price-row span, .product-body .price')?.textContent?.trim() : '0';
      if (!precioTexto) {
        precioTexto = this.dataset.precio || '0';
      }
      const precio = parseFloat((precioTexto || '').replace(/[^\d.]/g, '')) || 0;
      const descripcion = productoEl ? productoEl.querySelector('p')?.textContent || '' : '';
      const tallaContainer = productoEl ? productoEl.querySelector('.talla-select') : null;
      const tallaSelect = tallaContainer ? tallaContainer.querySelector('select') : null;
      const talla = tallaSelect ? tallaSelect.value : '';

      if (tallaSelect && (!talla || talla === '')) {
        alert('Selecciona una talla antes de agregar al carrito.');
        return;
      }

      const productoObj = {
        nombre: nombre,
        img: img,
        precio: precio,
        descripcion: descripcion,
        cantidad: 1,
        talla: talla || undefined
      };

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      // Verificar si ya existe y aumentar cantidad
      const existente = carrito.find(item => {
        if (typeof item === 'string') return item === nombre && !talla;
        return item.nombre === nombre && ((item.talla || '') === (talla || ''));
      });
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push(productoObj);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarVistaCarrito();
      mostrarAnimacionAgregar(nombre + (talla ? ` (${talla})` : ''));
    });
  });

  if (botonCarrito) {
    botonCarrito.addEventListener("click", () => {
      if (vistaPrevia.style.display === "none" || vistaPrevia.style.display === "") {
        vistaPrevia.style.display = "block";
        actualizarVistaCarrito();
        // Enfocar el primer elemento del carrito para accesibilidad
        setTimeout(() => {
          vistaPrevia.focus && vistaPrevia.focus();
        }, 100);
      } else {
        vistaPrevia.style.display = "none";
      }
    });
  }

  if (cerrarCarrito) {
    cerrarCarrito.addEventListener("click", () => {
      vistaPrevia.style.display = "none";
      botonCarrito && botonCarrito.focus();
    });
  }

  // Cerrar el carrito con Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && vistaPrevia.style.display === "block") {
      vistaPrevia.style.display = "none";
      botonCarrito && botonCarrito.focus();
    }
  });

  actualizarVistaCarrito();
});
