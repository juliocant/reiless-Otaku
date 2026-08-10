# Reiless Otaku — revisión técnica

## Cambios aplicados

- Corregidas referencias antiguas JPG/PNG hacia los archivos WebP existentes.
- Corregida la referencia del logo a `img/logo.webp` en toda la web.
- Eliminadas referencias locales rotas; los recursos que realmente no existen ahora usan `img/placeholder.webp` para evitar errores 404.
- Corregidos enlaces internos inexistentes como `camisetas/index.html`, `llaveros.html` y `mamelucos-personalizados.html` hacia páginas válidas.
- Corregida codificación UTF-8 en textos, acentos, símbolos, emojis y `オタク`.
- Estandarizado el carrito en las 41 páginas activas.
- Mejorado el contador del carrito para contabilizar cantidades, no solo líneas de producto.
- Mejorada la vista previa del carrito: cierre exterior/Escape, animación y mensaje vacío.
- Mejorada la animación al añadir productos al carrito.
- Añadidas protecciones para que el JS no falle si falta algún elemento del DOM.
- Añadido `decoding="async"` a imágenes y prioridad alta al logo del encabezado.
- Ampliado el contenedor principal de 1180 px a 1400 px para aprovechar mejor pantallas grandes.
- Añadidos favicon, meta description, Open Graph, canonical, `robots.txt` y `sitemap.xml`.
- Eliminados del paquete de publicación `.venv`, scripts/notebook de reparación y copias antiguas `carritocopia.html` / `indexbox.html`.
- Actualizado `.gitignore` para evitar volver a subir `.venv`, `img.zip`, caches y archivos temporales.

## Pendiente de contenido

Algunos productos no tienen una fotografía real incluida en el ZIP original (principalmente agendas, llaveros, algunas tazas, mamelucos y variantes Geto). Para no generar errores 404 se muestra `img/placeholder.webp`. Cuando tengas esas fotos, conviene reemplazar el placeholder por las imágenes reales WebP.
