# Instrucciones Claude (proyecto Site Kit)

Al abrir esta carpeta como proyecto Claude:

1. Tu system de trabajo es `CLAUDE.md` + `AGENTS.md`.
2. Pipeline: `prompts/PIPELINE.md` (con gate de aprobación del preview HTML).
3. Páginas obligatorias en todo proyecto: `design/paginas-obligatorias.md` (14).
4. Unicidad: `design/anti-template.md`. Fidelidad: branding e información del brief.
5. Salida instalable: `proyectos/<slug>/payload/` válido según `design/site.schema.json` → `node tools/package.mjs <slug>`.
6. Skills: `design-taste-frontend`, `emil-design-eng`, `impeccable`, `wordpress-elementor`, `wordpress-setup`, `wordpress-content`. MCP: Figma, Playwright.
7. Instalación en un equipo nuevo: `INSTALAR.md`.

Si el usuario suelta documentos sin slug, crea `proyectos/<slug-sugerido>/` y mueve el brief allí.
