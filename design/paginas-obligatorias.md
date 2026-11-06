# Páginas obligatorias — TODOS los proyectos

Cada web del kit entrega **siempre** estas 14 piezas. No son opcionales y no se negocian por cliente: lo que cambia es el diseño, el tono y el contenido, nunca la lista.
Fuente de máquina: `design/paginas.json` (la usan `tools/validate.mjs` y el servidor de previews).

> El **diseño** de cada página sigue el concepto del cliente (`concepto.md`), su branding (`brief/04-branding.md`) y `design/anti-template.md`. Las páginas legales, de facturación y la landing de curso **también** van con la marca: nada de páginas “por defecto” de WordPress/WooCommerce/Tutor sin estilo.

---

## 1. Navegación (menú principal, en este orden)

| Página | Mockup | Contenido mínimo |
|--------|--------|------------------|
| **Inicio** | `index.html` | Hero de marca (ver anti-template), propuesta de valor, cursos destacados (enlazan a la landing de curso), prueba social real del brief, CTA final. |
| **Cursos** | `cursos.html` | Catálogo completo: filtros/categorías si hay más de 6, tarjeta por curso (imagen, título, nivel/duración, precio, CTA “Ver curso”). En WordPress: shortcode `[tutor_course]` dentro de la plantilla de Elementor, con estilos de marca en `branding.css`. |
| **Sobre nosotros** | `nosotros.html` | Historia, misión/visión/valores, equipo o fundador/a con foto real, método/diferencial, CTA. |
| **Blog** | `blog.html` | Listado de entradas (destacada + grid/lista), categorías, y una **entrada individual** de ejemplo en el mismo archivo o en `blog-entrada.html`. En WordPress: página de entradas (`is_blog`) + 3 `posts` demo. |
| **Contáctame** | `contacto.html` | Formulario (nombre, email, mensaje, consentimiento de privacidad), datos de contacto reales, WhatsApp/redes si existen, mapa solo si hay sede física. |

## 2. Legal & Documentación (menú legal en el footer)

| Página | Mockup | Contenido mínimo |
|--------|--------|------------------|
| **Política de privacidad** | `privacidad.html` | Responsable (razón social, ID fiscal, dirección, email), datos que se recogen, finalidad, base legal, conservación, terceros (pasarela de pago, analítica, email), derechos y cómo ejercerlos, fecha de actualización. |
| **Términos y condiciones** | `terminos.html` | Objeto, registro de cuenta, compra y acceso a cursos, precios e impuestos, propiedad intelectual del contenido, uso aceptable, limitación de responsabilidad, ley aplicable y jurisdicción. |
| **Política de reembolsos** | `reembolsos.html` | Plazo (días), condiciones (p. ej. % de curso consumido), casos excluidos, cómo solicitarlo, método y plazo de devolución. |
| **Política de cookies** | `cookies.html` | Qué son, tabla de cookies usadas (propias, analítica, pasarela de pago), cómo gestionarlas/desactivarlas, enlace al banner de consentimiento. |
| **Aviso legal** | `aviso-legal.html` | Titular del sitio, datos de identificación y registro, condiciones de uso, responsabilidad, enlaces externos, legislación. |
| **Preguntas frecuentes** | `faq.html` | 8–15 preguntas reales del rubro agrupadas (cursos, acceso, pagos, certificados, soporte) en acordeón accesible. |

**Reglas para textos legales**
- Rellenar con los datos de `brief/06-legal-y-pagos.md`. **Nunca inventar** razón social, IDs fiscales, direcciones ni plazos: si falta, `TODO-CLIENTE`.
- Adaptar al país del cliente (GDPR/LOPDGDD en España, Ley 1581 en Colombia, LFPDPPP en México, etc.).
- Añadir al pie de cada página legal: *“Última actualización: <fecha>”*.
- Avisar en la entrega que los textos legales deben revisarlos el cliente o su asesor legal.

## 3. Facturación

| Página | Mockup | Contenido mínimo |
|--------|--------|------------------|
| **Carrito** | `carrito.html` | Líneas de curso (imagen, nombre, precio), cupón, subtotal/impuestos/total, CTA “Ir al pago”, estado de carrito vacío. |
| **Pasarela de pagos** (checkout) | `checkout.html` | Datos de facturación, resumen del pedido, métodos de pago del brief (Stripe, PayPal, Mercado Pago, Wompi…), aceptación de términos con enlace, sellos de confianza, estado de error. |

En WordPress el motor crea estas páginas con el shortcode correcto y las asigna como páginas del sistema (`commerce` en `site.json`):
- `woocommerce` (por defecto): `[woocommerce_cart]` / `[woocommerce_checkout]`, opciones `woocommerce_cart_page_id`, `woocommerce_checkout_page_id`, `woocommerce_terms_page_id`, y Tutor LMS en modo *monetize by WooCommerce*.
- `tutor` (eCommerce nativo de Tutor): `[tutor_cart]` / `[tutor_checkout]`; las pasarelas se configuran en Tutor LMS → Ajustes → Monetización.

El diseño del mockup se traslada a `branding.css` sobre el marcado real de WooCommerce/Tutor (no se reescribe el checkout).

## 4. Cursos

| Pieza | Mockup | Contenido mínimo |
|-------|--------|------------------|
| **Landing de curso individual (Tutor LMS)** | `curso.html` | Hero del curso (título, promesa, instructor/a, valoración), precio + CTA de compra/inscripción fijo en scroll, qué aprenderás, temario (módulos/lecciones en acordeón), requisitos, para quién es, instructor/a, testimonios, FAQ del curso, garantía/reembolso, CTA final. |

En WordPress:
- **Elementor Pro:** plantilla `single` en `payload/templates/` declarada en `site.json → course_template`; el motor le pone la condición *todos los cursos* (`include/singular/courses`).
- **Elementor Free:** la página de curso de Tutor se viste con `branding.css` (clases `.tutor-*`), siguiendo el mockup.
- Al menos **1 curso demo** en `site.json → courses` para poder revisar la landing tras instalar.

---

## Cabecera y pie (comunes a todo)

- Cabecera: logo, menú principal (las 5 de navegación), acceso a carrito y “Mi cuenta/Ingresar” (Tutor dashboard).
- Pie: menú legal (las 6 legales), contacto, redes, copyright con razón social.
- Mismo header/footer en todos los mockups (`mockup/partials` o copiados), con estado activo de la página actual.

## Checklist de completitud

`node tools/validate.mjs <slug>` comprueba que existen los 14 mockups, que enlazan las rutas obligatorias, que `site.json` declara cada `role` y que el proyecto está **APROBADO** antes de empaquetar.
