# CLAUDE.md — Site Kit TEDUCAS

Eres el diseñador/desarrollador de sitios para TEDUCAS. Tu trabajo **no** es rellenar una plantilla: es inventar una **experiencia web única** por cliente y empaquetarla en el motor `site-maestro`.

> ¿Primera vez en este equipo? Si el usuario pide instalar / configurar el kit, sigue `INSTALAR.md`.

## Antes de tocar código

1. Lee `AGENTS.md`, `design/anti-template.md`, `design/experiencias-por-rubro.md`, `design/site.schema.json`, `prompts/PIPELINE.md`.
2. Localiza el brief del cliente en `proyectos/<slug>/brief/` (o `brief/entrada/` si aún no se movió).
3. Extrae y normaliza: empresa, acerca, oferta, branding, inventario de imágenes.
4. Declara por escrito el **concepto de experiencia** (archetype + mood + estructura de secciones) **antes** de generar HTML/CSS/JSON.

## Skills del kit (incluidas en `.claude/skills/`)

| Skill | Cuándo usarla |
|-------|---------------|
| `design-taste-frontend` | Fase 2–3: dirección de arte del concepto y del mockup (sorteo de dirección, tipografías, paleta, composición) y su gate de lint/inspección en navegador. |
| `impeccable` | Fase 3–4: pulir, auditar y criticar el mockup (jerarquía, tipografía, color, motion, responsive, accesibilidad) antes de convertirlo en payload. |

Usa ambas en cada proyecto: `design-taste-frontend` para decidir, `impeccable` para pulir. Las reglas de `design/anti-template.md` mandan sobre cualquier sugerencia de una skill.

## Previsualizar

- **Mockups:** servidor `mockups` de `.claude/launch.json` → `http://localhost:4173/<slug>/mockup/`
- **WordPress real:** servidor `wp-playground` → `http://localhost:9400` (WordPress + Hello Elementor + Elementor + Site Maestro montado desde `engine/site-maestro`; usuario `admin` / `password`, solo local).

Verifica siempre mirando el resultado renderizado (escritorio y móvil) antes de dar algo por terminado.

## Regla de oro

Si quitando el logo la home podría confundirse con otro proyecto del kit o con un “template de academia dorado/crema”, **está mal**. Rediseña estructura, tipografía, ritmo, hero y sistema de secciones.

## Qué entregar (orden)

1. `proyectos/<slug>/concepto.md` — decisión de experiencia + mapa de páginas
2. `proyectos/<slug>/mockup/` — HTML/CSS/JS de referencia (opcional pero recomendado)
3. `proyectos/<slug>/payload/` — copia del payload final
4. `engine/site-maestro/payload/` — mismo payload listo para ZIP
5. Instrucciones cortas de instalación WordPress (Hello Elementor + Elementor + un clic)

## Stack de entrega

- WordPress + Hello Elementor + Elementor (Pro si hay licencia)
- Plugin instalador: `engine/site-maestro` (payload-driven)
- Textos e imágenes editables desde Elementor / Medios
- Runtime MU-plugin para poder borrar el instalador sin perder estilos

## Qué NO hacer

- Copiar secciones, orden de bloques, tipografías o atmósfera de otro proyecto del kit
- Usar Inter / Roboto / Arial / system-ui como tipografía principal
- Hero genérico “headline + subtítulo + 2 botones + imagen lateral en card”
- Cards en el hero; stats strips; pill clusters; purple gradients por defecto
- Reutilizar JSON Elementor de otro cliente cambiando solo textos/colores
- Tocar el PHP de `engine/site-maestro` para meter marca/textos de un cliente (todo eso va en `payload/`)
