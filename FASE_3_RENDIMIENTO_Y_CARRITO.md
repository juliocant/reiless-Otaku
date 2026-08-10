# Fase 3 — Rendimiento y carrito

## Carrito
- Corregida la captura de imagen en páginas de detalle: el botón está en `.product-info` y la foto activa en `.product-gallery`.
- La variante seleccionada ahora sincroniza `data-img` y `data-precio` con el botón Agregar al carrito.
- Se normalizan URLs antiguas guardadas en localStorage (`file://`, URLs absolutas y rutas del mismo sitio) hacia `/img/...`.
- Mini carrito y carrito completo usan placeholder solo si la imagen realmente falla.
- Añadido `onerror` para evitar miniaturas rotas.

## Rendimiento
- Google Fonts dejó de cargarse mediante `@import`; ahora usa preconnect + stylesheet desde el `<head>`.
- Scripts principales usan `defer`.
- La imagen principal de páginas de producto usa carga prioritaria.
- Se añadieron dimensiones intrínsecas a imágenes locales para reducir saltos visuales (CLS).
- Se añadió `content-visibility: auto` en secciones fuera de pantalla.
- Se respeta `prefers-reduced-motion`.
