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
      li.textContent = `${nombre} (x${cantidad})`;
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
      const productoEl = this.closest('.producto');
      const nombre = productoEl ? productoEl.querySelector('h3')?.textContent || this.dataset.producto : this.dataset.producto;
      const img = productoEl ? productoEl.querySelector('img')?.src || '' : '';
      const precioTexto = productoEl ? productoEl.querySelector('span')?.textContent || '0' : '0';
      const precio = parseFloat(precioTexto.replace(/[^\d.]/g, '')) || 0;
      const descripcion = productoEl ? productoEl.querySelector('p')?.textContent || '' : '';

      const productoObj = {
        nombre: nombre,
        img: img,
        precio: precio,
        descripcion: descripcion,
        cantidad: 1
      };

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      // Verificar si ya existe y aumentar cantidad
      const existente = carrito.find(item => item.nombre === nombre);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push(productoObj);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarVistaCarrito();
      mostrarAnimacionAgregar(nombre);
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
