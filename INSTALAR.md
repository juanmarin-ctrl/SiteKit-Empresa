# INSTALAR.md — puesta en marcha del Site Kit

Este archivo sirve para dos cosas:

- **Personas:** qué hace falta y qué pasa al instalar.
- **Claude:** cuando el usuario pida *"Lee INSTALAR.md y ejecuta la instalación"*, sigue la sección **Procedimiento para Claude** paso a paso.

---

## Requisitos (los instala la persona)

| Requisito | Para qué | Dónde |
|-----------|----------|-------|
| **Claude Code** | Ejecutar el kit (app de escritorio de Claude → pestaña *Code*, CLI `claude`, o extensión VS Code/JetBrains) | claude.com/claude-code |
| **Git** | Clonar y actualizar el kit | git-scm.com |
| **Node.js 18+** (incluye npm/npx) | Previews de mockups, WordPress Playground, scripts de las skills, empaquetado | nodejs.org (versión LTS) |
| Navegador Chrome/Edge | Inspección visual de la skill `design-taste-frontend` y Playwright MCP | — |

Opcional: cuenta de **Figma** (si se usa el MCP de Figma) y licencia **Elementor Pro** en el WordPress del cliente.

## Qué incluye el repo (no hay que instalarlo aparte)

| Pieza | Ubicación | Cómo se activa |
|-------|-----------|----------------|
| Instrucciones del agente | `CLAUDE.md`, `AGENTS.md`, `.claude/instructions.md`, `.cursor/rules/` | Automático al abrir la carpeta |
| Skill `design-taste-frontend` (dirección de arte) | `.claude/skills/design-taste-frontend/` | Automático en Claude Code (skill de proyecto) |
| Skill `impeccable` v4.8 (pulido/auditoría, Apache 2.0) | `.claude/skills/impeccable/` | Automático en Claude Code (skill de proyecto) |
| Servidores de preview | `.claude/launch.json` → `mockups` (4173), `wp-playground` (9400) | Claude los arranca cuando hace falta |
| MCP opcionales | `.mcp.json` → `playwright`, `figma` | Claude Code pide aprobarlos la primera vez |
| Motor WordPress | `engine/site-maestro/` | Se empaqueta con `node tools/package.mjs <slug>` |

---

## Procedimiento para Claude

Ejecuta en orden, desde la raíz del repo. No pidas confirmación para los pasos de solo lectura/verificación; sí antes de instalar software en el sistema.

1. **Comprobar que estás en la raíz del kit**: deben existir `CLAUDE.md`, `engine/site-maestro/site-maestro.php` y `.claude/skills/`.

2. **Ejecutar la verificación**:

   ```bash
   node tools/setup.mjs --warm
   ```

   - Si `node` no existe → dile al usuario que instale Node.js LTS desde nodejs.org (en Windows también vale `winget install OpenJS.NodeJS.LTS`; en macOS `brew install node`), que reinicie Claude Code y vuelva a pegar el prompt. No sigas.
   - Si falla Git → igual, `winget install Git.Git` / `brew install git`.
   - Cualquier `✘` → explícalo y para. Los `⚠` se reportan pero no bloquean.

3. **Confirmar que las skills están cargadas**: comprueba que `design-taste-frontend` e `impeccable` aparecen entre tus skills disponibles. Si no aparecen (sesión abierta antes de clonar, u otro entorno):
   - pide al usuario que cierre y vuelva a abrir la sesión en la carpeta del repo, **o**
   - si quiere tenerlas en todos sus proyectos, ejecuta `node tools/setup.mjs --global-skills` (las copia a `~/.claude/skills` sin sobrescribir).

4. **Probar el servidor de mockups**: arranca el servidor `mockups` de `.claude/launch.json` (o `node tools/serve.mjs`), comprueba que `http://localhost:4173` responde con la página "Mockups" y detenlo.

5. **(Opcional, pregunta antes) Probar WordPress Playground**: arranca `wp-playground` (o `node tools/playground.mjs`). La primera vez descarga WordPress, Hello Elementor y Elementor (1–3 min). Comprueba que `http://localhost:9400` abre el menú **Site Maestro**. Detenlo al terminar.

6. **MCP opcionales**: recuerda al usuario que al abrir el repo Claude Code le preguntará si aprueba los servidores de `.mcp.json`:
   - `playwright` — recomendado (navegador automatizado para revisar mockups).
   - `figma` — solo si trabajan desde diseños de Figma (pide iniciar sesión en Figma).

7. **Resumen final** al usuario, en una tabla corta: requisito → estado, skills → estado, previews → estado, y el siguiente paso:

   > Para crear una web: copia tus documentos y pega el prompt de **README.md → "Crear la web de un cliente"**.

---

## Actualizar el kit

```bash
git pull
node tools/setup.mjs
```

Las mejoras del motor, del pipeline y de las skills llegan con `git pull`. Tus proyectos en `proyectos/<cliente>/` no se tocan (están ignorados por git).

## Problemas frecuentes

| Síntoma | Solución |
|---------|----------|
| Claude no ve las skills | Abre la sesión con la **raíz del repo** como carpeta de trabajo; o `node tools/setup.mjs --global-skills` |
| `npx` tarda mucho la primera vez | Normal: descarga WordPress Playground. `node tools/setup.mjs --warm` lo adelanta |
| Puerto 4173/9400 ocupado | `node tools/serve.mjs 4180` / `node tools/playground.mjs 9500` |
| El ZIP no instala en el hosting | Genera el ZIP con `node tools/package.mjs <slug>` (no con "Enviar a carpeta comprimida" ni `Compress-Archive`) |
| Funciones de idioma (`language_chrome`) no hacen nada | Requieren el plugin interno Teducas Core ≥ 1.17 en el WordPress (no incluido). Para probarlo en local, copia `TeducasCore/` a la raíz del repo: el playground lo monta solo |
