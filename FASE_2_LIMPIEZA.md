# Fase 2 — Limpieza y estructura

- CSS consolidado: `styles.css` contiene ahora la base global y estilos de tienda/producto.
- Eliminado `css/tienda.css` para evitar una segunda solicitud y reglas repartidas.
- `@import` de Google Fonts movido al inicio de CSS.
- Header y footer normalizados en las 41 páginas HTML.
- Estilos inline repetidos trasladados a clases reutilizables.
- Estilos del toast del carrito movidos de JavaScript a CSS.
- Eliminada configuración local `.vscode` que apuntaba a una ruta de otra computadora.
- `.gitignore` ampliado para ZIP, entornos virtuales, cachés y archivos del editor/SO.
- No se eliminaron páginas comerciales activas ni imágenes de producto.
