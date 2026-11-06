# Payload placeholder (referencia)

Este payload es **solo la plantilla de partida**: las 13 páginas obligatorias con su `role`, menús principal y legal, `commerce`, `course_template` y un curso demo.

El payload real de cada cliente se genera en `proyectos/<slug>/payload/` (copiando este `site.json` como base) y `node tools/package.mjs <slug>` lo ensambla en el ZIP. No edites este placeholder para un cliente.

## Contenido de un payload de cliente

```
site.json          # obligatorio — ver design/site.schema.json
branding.css       # sistema del mockup aprobado + estilos de WooCommerce (.woocommerce-*) y Tutor LMS (.tutor-*)
frontend.js        # motions
media/brand/       # logos
media/stock/       # fotos
templates/         # *.json Elementor con title, type, content[]:
                   #   header.json, footer.json (type header/footer)
                   #   inicio.json, cursos.json, nosotros.json, contacto.json,
                   #   privacidad.json, terminos.json, reembolsos.json, cookies.json, aviso-legal.json, faq.json,
                   #   carrito.json, checkout.json (type page)
                   #   curso.json (type single → landing de curso Tutor LMS, Elementor Pro)
```

## Tokens de imagen en JSON Elementor

```
__SITE_MEDIA__/nombre-archivo.jpg
```

## Ejemplo mínimo de template JSON

```json
{
  "title": "Carrito",
  "type": "page",
  "content": [
    { "id": "a1b2c3d", "elType": "container", "settings": {}, "elements": [
      { "id": "e4f5a6b", "elType": "widget", "widgetType": "shortcode", "settings": { "shortcode": "[woocommerce_cart]" }, "elements": [] }
    ] }
  ]
}
```

No reutilizar JSON de otro proyecto cambiando textos.
