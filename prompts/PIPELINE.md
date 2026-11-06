# Pipeline de generación

Ejecuta en orden. **Hay un gate humano obligatorio**: nada de WordPress (payload, plantillas Elementor, ZIP) hasta que el usuario apruebe el **preview HTML** de las 14 páginas.

```
Fase 0 Arranque → 1 Ingest → 2 Concepto → 3 Preview HTML (14 páginas) → ⛔ LUZ VERDE del usuario → 4 Payload → 5 Empaque + prueba
```

Skills del kit (`.claude/skills/`) y MCP (`.mcp.json`) obligatorios por fase:

| Fase | Skills / MCP |
|------|--------------|
| 2 Concepto | `design-taste-frontend` (dirección de arte, referencias) · Figma MCP si el cliente trae diseños en Figma |
| 3 Preview HTML | `design-taste-frontend` (sistema y gate de lint/inspección) · `emil-design-eng` (motion, detalles, componentes) · `impeccable` (tipografía, espaciado, jerarquía, auditoría) · **Playwright MCP** (abrir, navegar, probar y capturar cada página) |
| 4 Payload | `wordpress-elementor` (estructura/plantillas Elementor) · `impeccable` (polish final) |
| 5 Empaque + prueba | **Playwright MCP** sobre WordPress Playground · `wordpress-setup` / `wordpress-content` si se publica en el hosting del cliente |

Si una skill choca con `design/anti-template.md`, manda el anti-template. Si choca con el branding del cliente, manda el branding.

---

## Fase 0 — Arranque del proyecto

```text
1. Copiar proyectos/_plantilla-proyecto → proyectos/<slug>/
2. Colocar docs del cliente en proyectos/<slug>/brief/ (o normalizar desde brief/entrada/)
3. Inventariar imágenes en brief/imagenes/ (renombrar legible: hero-01.jpg, logo.png…)
```

---

## Fase 1 — Ingest del brief

Producir `proyectos/<slug>/brief/_normalizado.md` con:

- Identidad (nombre, slogan, contacto, web/redes)
- Historia / acerca, equipo
- Oferta: **cursos** con precio, nivel, duración, instructor/a y temario
- Branding: colores hex, tipografías, tono de voz, logos, usos prohibidos
- Legal y pagos (de `06-legal-y-pagos.md`): titular, ID fiscal, país/ley, pasarelas, moneda, reembolsos, cookies/terceros
- Inventario de imágenes (archivo → uso sugerido)
- Huecos → `TODO-CLIENTE` (nunca inventar datos de contacto, legales ni precios)

---

## Fase 2 — Concepto de experiencia

`proyectos/<slug>/concepto.md` siguiendo `design/anti-template.md` y `design/experiencias-por-rubro.md`, más:

- **Mapa del sitio**: las 14 páginas de `design/paginas-obligatorias.md` (+ las extra que pida el cliente) con la intención de cada una.
- **Sistema visual derivado del branding**: tokens de color (de los hex del brief), pareja tipográfica, escala, ritmo, motion.
- Cómo se aplica la marca a páginas “aburridas” (legales, carrito, checkout): también llevan identidad.

Prohibido parecerse a cualquier proyecto en `proyectos/`. No generes HTML hasta tener el concepto.

---

## Fase 3 — Preview HTML de las 14 páginas (OBLIGATORIO)

Producir en `proyectos/<slug>/mockup/` **todas** las páginas de `design/paginas-obligatorias.md`:

```
index.html  cursos.html  nosotros.html  blog.html  contacto.html
privacidad.html  terminos.html  reembolsos.html  cookies.html  aviso-legal.html  faq.html
carrito.html  checkout.html  curso.html
assets/css/styles.css  ← tokens + layout, prefijo del slug, UN solo sistema para todo
assets/js/site.js      ← 2–3 motions con intención
```

Reglas:
- **Acorde al branding y a la información del proyecto**: colores, tipografías, tono, logos e imágenes del brief; textos reales del brief (legales con los datos de `06-legal-y-pagos.md`; lo que falte = `TODO-CLIENTE`). Nada de lorem ipsum.
- Mismo header (logo + menú principal de 5 + carrito + “Ingresar”) y footer (menú legal de 6 + contacto + redes) en todas, con estado activo.
- Carrito y checkout replican el flujo real de WooCommerce/Tutor (líneas, cupón, totales, facturación, métodos de pago del brief, aceptar términos), con la marca.
- `curso.html` = landing de curso individual de Tutor LMS (hero, precio/CTA fijo, qué aprenderás, temario en acordeón, instructor/a, testimonios, FAQ, garantía).
- Responsive real (1440 / 768 / 390) y accesible (contraste, foco, `alt`, acordeones con teclado).

Reglas de diseño frontend del kit:
- Una composición en el primer viewport · Marca hero-level · Tipografías expresivas (no Inter/Roboto/Arial/system)
- Fondo con atmósfera · Hero full-bleed por defecto · Sin cards en el hero · Una job por sección

Verificación antes de mostrar al usuario:
1. `node tools/validate.mjs <slug> --etapa mockup` → **0 errores**.
2. Gate de `design-taste-frontend` (lint + inspect) y auditoría de `impeccable`.
3. Con **Playwright MCP**: abrir cada página en escritorio y móvil, navegar menú/footer, abrir acordeones, recorrer carrito → checkout; corregir lo roto.

### ⛔ Gate de aprobación

1. Arranca el servidor `previews` (`.claude/launch.json`) y entrega al usuario: **`http://localhost:4173/<slug>/`** (sala de revisión con las 14 páginas, escritorio/móvil) y un resumen de 5 líneas del concepto.
2. Deja `proyectos/<slug>/aprobacion.md` en `Estado: PENDIENTE` y **detente**. Pregunta explícitamente si aprueba o qué cambia.
3. Si pide cambios → `Estado: CAMBIOS`, anota los cambios, itera la Fase 3 y vuelve a mostrar.
4. Solo cuando el usuario diga explícitamente que aprueba (“aprobado”, “luz verde”, “dale”…), escribe `Estado: APROBADO`, la fecha y su frase literal. **Nunca te autoapruebes.**

---

## Fase 4 — Payload WordPress (solo con APROBADO)

Comprueba primero: `aprobacion.md` → `Estado: APROBADO`. Si no, vuelve al gate.

Generar en `proyectos/<slug>/payload/` (fuente de verdad del cliente):

```
site.json        ← válido contra design/site.schema.json, con las 13 páginas (role) + course_template + courses[] + commerce
branding.css     ← traslada el sistema del mockup; incluye estilos de WooCommerce (.woocommerce-*) y Tutor LMS (.tutor-*)
frontend.js
media/brand/  media/stock/
templates/       ← JSON Elementor (content[]) por página + header.json + footer.json + curso.json (type "single")
```

- Parte de `engine/site-maestro/payload/site.json` (placeholder con las 13 páginas, menús y un curso demo).
- Cada plantilla reproduce **el mockup aprobado** (no un rediseño). Textos e imágenes editables en Elementor.
- Carrito/checkout/cursos: la plantilla incluye su widget Shortcode (`[woocommerce_cart]`, `[woocommerce_checkout]`, `[tutor_course]`); si no, el motor lo añade.
- Tokens de media: `__SITE_MEDIA__/hero-inicio.jpg`.
- `node tools/validate.mjs <slug>` → **0 errores**.

---

## Fase 5 — Empaque y prueba

```bash
node tools/package.mjs <slug>        # → proyectos/<slug>/site-maestro.zip (bloquea sin APROBADO)
node tools/playground.mjs <slug>     # WordPress local con Elementor + WooCommerce + Tutor + este payload
```

En `http://localhost:9400` → **Site Maestro → Instalar sitio completo**, y con **Playwright MCP** revisa: las 13 páginas, menús, carrito → checkout con el curso demo, landing del curso, móvil. Compara contra el mockup aprobado.

En el hosting del cliente:
1. Tema Hello Elementor · Elementor (+ Pro si hay) · WooCommerce (o eCommerce de Tutor) · Tutor LMS
2. Subir `site-maestro.zip` → Activar → **Instalar sitio completo**
3. Configurar pasarelas con las credenciales del cliente (WooCommerce → Pagos / Tutor → Monetización)
4. Runtime OK → se puede eliminar el instalador

---

## Prompt único “hazlo todo”

```
Eres el agente del TEDUCAS Site Kit.
Lee CLAUDE.md, AGENTS.md, design/anti-template.md, design/paginas-obligatorias.md y prompts/PIPELINE.md.
Cliente: proyectos/<slug>/
Ejecuta fases 1→3 y detente en el gate: muéstrame el preview HTML de las 14 páginas en http://localhost:4173/<slug>/.
Cuando yo dé luz verde, sigue con fases 4→5.
No copies proyectos previos.
```
