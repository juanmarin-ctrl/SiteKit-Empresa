# Engine — Site Maestro

Plugin WordPress **genérico**. No contiene la marca del cliente.

## Anatomía

| Parte | ¿Cambia por cliente? |
|-------|----------------------|
| `site-maestro.php` + `includes/` + `runtime/` | No |
| `payload/` | Placeholder de referencia. El del cliente vive en `proyectos/<slug>/payload/` |

## Empaquetar e instalar

```bash
node tools/package.mjs <slug>    # motor + proyectos/<slug>/payload → proyectos/<slug>/site-maestro.zip
```

El empaquetador **bloquea** si el preview no está APROBADO o faltan páginas obligatorias.

En el WordPress del cliente:

1. Hello Elementor + Elementor (+ Pro si hay) + **WooCommerce** + **Tutor LMS**
2. Plugins → Subir `site-maestro.zip` → Activar
3. Menú **Site Maestro** → **Instalar sitio completo**
4. Configurar pasarelas (WooCommerce → Ajustes → Pagos, o Tutor → Monetización) con las credenciales del cliente
5. Runtime OK → puedes eliminar el instalador

## Qué hace el instalador

Medios → plantillas Elementor → 13 páginas obligatorias (con `role`) → entradas del blog → **cursos demo de Tutor** → menús principal y legal → portada/blog → **páginas del sistema** (privacidad de WP; carrito, checkout y términos de WooCommerce; monetización de Tutor) → identidad → cabecera/pie (y **landing de curso** con Pro) → runtime MU.

## Cambios

- **1.5.0** — Páginas obligatorias: `pages[].role` (13 roles), aviso en el log si falta alguno. `commerce` (`woocommerce` | `tutor`): asigna carrito/checkout/términos y la monetización de Tutor; añade `[woocommerce_cart]` / `[woocommerce_checkout]` / `[tutor_course]` si la plantilla no los trae. `course_template`: plantilla single de Elementor Pro para todos los cursos (`include/singular/courses`). `courses[]`: cursos demo de Tutor con temario y, con WooCommerce, producto virtual vinculado. `requires` acepta `woocommerce` y `tutor`.
- **1.4.0** — Con Teducas Core ≥ 1.17: cabecera/pie según el idioma del visitante en páginas neutras (`language_chrome`) e idioma por entrada (`language_posts`).
- **1.2.0** — `chrome_posts` en site.json: cabecera/pie por idioma en entradas que no crea el instalador (p. ej. cursos de Tutor LMS; solo Elementor Pro).
- **1.1.0** — `pages[].parent`, `pages[].header_template` / `footer_template`, formulario genérico `action=sm_contact` (destino `contact.email`), se desactivan colores/fuentes por defecto del Kit de Elementor, arreglo de `GLOB_BRACE`.

> **Teducas Core** es un plugin interno aparte (no incluido). Solo hace falta para las funciones de idioma de 1.4.0.

## Probar en local (WordPress Playground)

```bash
node tools/playground.mjs            # payload placeholder
node tools/playground.mjs <slug>     # payload de proyectos/<slug>/payload
```

`http://localhost:9400` con Hello Elementor + Elementor + WooCommerce + Tutor LMS y este plugin montado. Usuario `admin` / `password` — solo local.
