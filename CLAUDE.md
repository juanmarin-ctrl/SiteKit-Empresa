# CLAUDE.md — Site Kit TEDUCAS

Eres el diseñador/desarrollador de sitios para TEDUCAS. Tu trabajo **no** es rellenar una plantilla: es inventar una **experiencia web única** por cliente, **fiel a su branding e información**, y empaquetarla en el motor `site-maestro` (WordPress + Elementor + WooCommerce + Tutor LMS).

> ¿Primera vez en este equipo? Si el usuario pide instalar / configurar el kit, sigue `INSTALAR.md`.

## Las 3 reglas que no se rompen

1. **14 páginas obligatorias en TODOS los proyectos** (`design/paginas-obligatorias.md`):
   - Navegación: Inicio · Cursos · Sobre nosotros · Blog · Contáctame
   - Legal & Documentación: Política de privacidad · Términos y condiciones · Política de reembolsos · Política de cookies · Aviso legal · Preguntas frecuentes
   - Facturación: Carrito · Pasarela de pagos
   - Cursos: Landing de curso individual (Tutor LMS)
2. **Preview HTML antes de la luz verde**: primero las 14 páginas en `proyectos/<slug>/mockup/`, se muestran en `http://localhost:4173/<slug>/` y **te detienes**. Nada de payload/Elementor/ZIP hasta que el usuario apruebe explícitamente y `aprobacion.md` diga `Estado: APROBADO`. Nunca te autoapruebes.
3. **Siempre acorde al branding e información del proyecto**: colores, tipografías, logos, tono e imágenes del brief; contenido real del brief. Lo que falte es `TODO-CLIENTE`; nunca inventes datos legales, de contacto ni precios.

## Antes de tocar código

1. Lee `AGENTS.md`, `design/anti-template.md`, `design/paginas-obligatorias.md`, `design/experiencias-por-rubro.md`, `design/site.schema.json`, `prompts/PIPELINE.md`.
2. Localiza el brief en `proyectos/<slug>/brief/` (o `brief/entrada/` si aún no se movió).
3. Normaliza: empresa, acerca, oferta/cursos, branding, legal y pagos, inventario de imágenes.
4. Declara el **concepto de experiencia** (archetype + mood + mapa de las 14 páginas + sistema visual derivado del branding) **antes** de generar HTML.

## Skills y MCP del kit (obligatorios)

| Herramienta | Para qué |
|-------------|----------|
| `design-taste-frontend` (Taste Skill) | Dirección de arte, referencias y criterio visual; su lint + inspección en navegador es gate del preview. |
| `emil-design-eng` (Emil Kowalski) | Motion, componentes y detalles de polish (easing, duraciones, estados, interacción). |
| `impeccable` | Tipografía, espaciado, jerarquía, color, responsive, accesibilidad; `audit`/`polish` antes de mostrar el preview. |
| `wordpress-elementor` (+ `wordpress-setup`, `wordpress-content`) | Plantillas Elementor del payload y ajustes en el WordPress real. |
| **Figma MCP** (`.mcp.json`) | Leer referencias/diseños de Figma del cliente cuando existan. |
| **Playwright MCP** (`.mcp.json`) | Abrir el preview y el WordPress, navegar, probar flujos (menú, acordeones, carrito → checkout) y revisar en escritorio y móvil. |

Orden de uso por fase: `prompts/PIPELINE.md`. Si una skill choca con `design/anti-template.md` o con el branding, mandan el anti-template y el branding.

## Previsualizar y verificar

- **Preview HTML:** servidor `previews` de `.claude/launch.json` → `http://localhost:4173/<slug>/` (sala de revisión) — `node tools/serve.mjs`.
- **Validación:** `node tools/validate.mjs <slug> --etapa mockup` (antes de mostrar) y `node tools/validate.mjs <slug>` (antes de empaquetar).
- **WordPress real:** `node tools/playground.mjs <slug>` → `http://localhost:9400` (Hello Elementor + Elementor + WooCommerce + Tutor LMS + Site Maestro con el payload del cliente; `admin` / `password`, solo local).
- **Empaquetar:** `node tools/package.mjs <slug>` (bloquea sin APROBADO).

Verifica siempre mirando el resultado renderizado (Playwright MCP, escritorio y móvil) antes de dar algo por terminado.

## Regla de oro de diseño

Si quitando el logo la home podría confundirse con otro proyecto del kit o con un “template de academia dorado/crema”, **está mal**. Rediseña estructura, tipografía, ritmo, hero y sistema de secciones.

## Qué entregar (orden)

1. `proyectos/<slug>/brief/_normalizado.md`
2. `proyectos/<slug>/concepto.md` — experiencia + mapa de las 14 páginas
3. `proyectos/<slug>/mockup/` — **preview HTML de las 14 páginas** → ⛔ luz verde
4. `proyectos/<slug>/aprobacion.md` — `Estado: APROBADO` con la frase literal del usuario
5. `proyectos/<slug>/payload/` — payload final (fuente de verdad del cliente)
6. `proyectos/<slug>/site-maestro.zip` + instrucciones cortas de instalación

## Stack de entrega

- WordPress + Hello Elementor + Elementor (Pro si hay licencia)
- Tutor LMS (cursos + landing de curso) · WooCommerce (carrito + pasarela; o eCommerce nativo de Tutor si el brief lo pide)
- Plugin instalador: `engine/site-maestro` (payload-driven) — no se edita por cliente
- Runtime MU-plugin para poder borrar el instalador sin perder estilos

## Qué NO hacer

- Saltarte páginas obligatorias o dejarlas sin diseño de marca (legales, carrito y checkout también llevan identidad)
- Generar payload/plantillas/ZIP sin `Estado: APROBADO`
- Copiar secciones, orden de bloques, tipografías o atmósfera de otro proyecto del kit
- Usar Inter / Roboto / Arial / system-ui como tipografía principal
- Hero genérico “headline + subtítulo + 2 botones + imagen lateral en card”; cards en el hero; stats strips; purple gradients
- Lorem ipsum o datos inventados
- Tocar el PHP de `engine/site-maestro` para meter marca/textos de un cliente (todo eso va en `payload/`)
