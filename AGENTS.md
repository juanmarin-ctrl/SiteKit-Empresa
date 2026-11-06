# AGENTS.md — instrucciones universales (cualquier entorno de IA)

Aplica en Claude, Cursor, Copilot, Windsurf, Continue, etc.

## Misión

Transformar un **brief de cliente** (documentos + branding + imágenes) en un **sitio WordPress instalable con un clic** (Elementor + WooCommerce + Tutor LMS), con experiencia visual **exclusiva** para ese cliente y **fiel a su branding**.

## Inputs esperados (brief)

| Documento | Contiene |
|-----------|----------|
| Información de la empresa | Nombre legal, marca, contacto, ubicación, historia corta, propuesta de valor |
| Acerca / About | Biografía, misión, visión, valores, equipo, narrativa |
| Plan de estudios / Oferta | Cursos, módulos, precios, niveles, instructores, CTAs |
| Branding / Manual / Estilos globales | Colores, tipografías, logo, tono de voz, usos prohibidos |
| Legal y pagos (`06-legal-y-pagos.md`) | Titular, ID fiscal, país/ley, pasarelas, moneda, reembolsos, cookies/terceros |
| Imágenes | Logos, fotos de producto/espacio/persona, mood |

Si falta un dato, **pregunta** o márcalo `TODO-CLIENTE`. Nunca inventes datos legales, de contacto ni precios.

## Páginas obligatorias (todos los proyectos)

Ver `design/paginas-obligatorias.md` (fuente de máquina: `design/paginas.json`):

- **Navegación:** Inicio · Cursos · Sobre nosotros · Blog · Contáctame
- **Legal & Documentación:** Política de privacidad · Términos y condiciones · Política de reembolsos · Política de cookies · Aviso legal · Preguntas frecuentes
- **Facturación:** Carrito · Pasarela de pagos
- **Cursos:** Landing de curso individual de Tutor LMS

## Pipeline obligatorio

`prompts/PIPELINE.md`:

1. **Ingest** — brief → `_normalizado.md`
2. **Concepto** — experiencia única + mapa de las 14 páginas + sistema visual del branding
3. **Preview HTML** — las 14 páginas en `mockup/`, validadas y probadas en navegador
4. ⛔ **Luz verde** — el usuario aprueba el preview; `aprobacion.md` → `Estado: APROBADO` (nunca autoaprobarse)
5. **Payload** — `site.json` + CSS + JS + media + plantillas Elementor que reproducen el preview aprobado
6. **Empaque y prueba** — ZIP + WordPress Playground

## Contrato de salida

El motor solo entiende lo definido en `design/site.schema.json`.
Todo lo específico del cliente vive en `proyectos/<slug>/payload/`. El PHP del motor **no** hardcodea marca, colores ni textos.

## Test de unicidad (obligatorio antes de pedir luz verde)

1. ¿La home tiene un hero estructuralmente distinto al del último proyecto del kit?
2. ¿La tipografía display es distinta y no es Inter/Roboto/Arial?
3. ¿El primer viewport pasaría el “brand test” (marca dominante, no genérica)?
4. ¿Hay al menos 2–3 motions intencionales propias de esta experiencia?
5. ¿Si se cambia el logo, seguiría sintiéndose del mismo rubro/cliente?
6. ¿Las 14 páginas (incluidas legales, carrito, checkout y landing de curso) usan el mismo sistema visual de la marca?

Si alguna es NO → rediseñar antes de mostrar.

## Proyectos previos

Los `proyectos/<otro-cliente>/` que existan en tu copia sirven solo para **alejarte** de su look (lee su `concepto.md`). Nunca como skin a reutilizar.

## Skills y MCP

En `.claude/skills/`: `design-taste-frontend`, `emil-design-eng`, `impeccable`, `wordpress-elementor`, `wordpress-setup`, `wordpress-content`.
En `.mcp.json`: **Figma** y **Playwright**.
Claude Code los carga solo. En otros entornos lee `.claude/skills/<nombre>/SKILL.md` en la fase correspondiente y configura los MCP de `.mcp.json` en tu herramienta.
