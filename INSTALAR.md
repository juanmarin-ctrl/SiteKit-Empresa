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
| **Node.js 18+** (incluye npm/npx) | Previews, WordPress Playground, scripts de las skills, MCP de Playwright, empaquetado | nodejs.org (LTS) |
| **Google Chrome** | Playwright MCP y la inspección de `design-taste-frontend` | google.com/chrome |
| **Cuenta de Figma** | Figma MCP (leer diseños/referencias del cliente) | figma.com |

En el WordPress del cliente: Hello Elementor, Elementor (Pro recomendado para cabecera/pie y landing de curso), WooCommerce y Tutor LMS.

## Qué incluye el repo (obligatorio, no se instala aparte)

| Pieza | Ubicación | Cómo se activa |
|-------|-----------|----------------|
| Instrucciones del agente | `CLAUDE.md`, `AGENTS.md`, `.claude/instructions.md`, `.cursor/rules/` | Automático al abrir la carpeta |
| Skill **Emil Kowalski** `emil-design-eng` | `.claude/skills/emil-design-eng/` | Automático (skill de proyecto) |
| Skill **Impeccable** `impeccable` v4.8 | `.claude/skills/impeccable/` | Automático |
| Skill **Taste** `design-taste-frontend` | `.claude/skills/design-taste-frontend/` | Automático |
| Skills **WordPress Elementor** `wordpress-elementor`, `wordpress-setup`, `wordpress-content` | `.claude/skills/wordpress-*/` | Automático |
| **Figma MCP** + **Playwright MCP** | `.mcp.json` | Claude Code pide aprobarlos al abrir el repo |
| Servidores | `.claude/launch.json` → `previews` (4173), `wp-playground` (9400) | Claude los arranca cuando hace falta |
| Motor WordPress | `engine/site-maestro/` | `node tools/package.mjs <slug>` |

---

## Procedimiento para Claude

Ejecuta en orden, desde la raíz del repo. No pidas confirmación para los pasos de verificación; sí antes de instalar software en el sistema.

1. **Comprobar que estás en la raíz del kit**: deben existir `CLAUDE.md`, `engine/site-maestro/site-maestro.php`, `.claude/skills/` y `.mcp.json`.

2. **Ejecutar la verificación**:

   ```bash
   node tools/setup.mjs --warm
   ```

   - Si `node` no existe → dile al usuario que instale Node.js LTS (Windows: `winget install OpenJS.NodeJS.LTS`; macOS: `brew install node`), que reinicie Claude Code y vuelva a pegar el prompt. No sigas.
   - Si falla Git → `winget install Git.Git` / `brew install git`.
   - Cualquier `✘` → explícalo y para. Los `⚠` se reportan pero no bloquean.

3. **Skills (6 obligatorias)**: comprueba que `design-taste-frontend`, `emil-design-eng`, `impeccable`, `wordpress-elementor`, `wordpress-setup` y `wordpress-content` aparecen entre tus skills disponibles. Si no:
   - pide al usuario que cierre y vuelva a abrir la sesión con la raíz del repo como carpeta, **o**
   - `node tools/setup.mjs --global-skills` (las copia a `~/.claude/skills` sin sobrescribir).

4. **MCP (obligatorios)**: comprueba si tienes herramientas de `playwright` y `figma`.
   - Si no aparecen: pide al usuario que apruebe los servidores de `.mcp.json` (Claude Code lo pregunta al abrir el repo; en la CLI también con `/mcp`) y reinicie la sesión.
   - **Figma** requiere iniciar sesión en Figma la primera vez (OAuth desde Claude Code).
   - **Playwright**: prueba abrir `http://localhost:4173` en el paso 5. Si falla por navegador, ejecuta `npx playwright install chrome`.

5. **Probar el servidor de previews**: arranca `previews` de `.claude/launch.json` (o `node tools/serve.mjs`) y comprueba que `http://localhost:4173` responde con “Previews de proyectos”. Si Playwright MCP está activo, ábrelo con él. Detenlo.

6. **(Opcional, pregunta antes) Probar WordPress Playground**: `node tools/playground.mjs` (en segundo plano). La primera vez descarga WordPress, Elementor, WooCommerce y Tutor LMS (2–4 min). Comprueba que `http://localhost:9400/wp-admin/admin.php?page=site-maestro` muestra **Site Maestro v1.5.0**. Detenlo.

7. **Resumen final** en una tabla corta: requisitos → estado, 6 skills → estado, 2 MCP → estado, previews → estado, y el siguiente paso:

   > Para crear una web: pon los documentos del cliente y pega el prompt de **README.md → "Crear la web de un cliente"**.

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
| Claude no ve las skills | Abre la sesión con la **raíz del repo** como carpeta; o `node tools/setup.mjs --global-skills` |
| No aparecen las herramientas de Playwright/Figma | Aprueba los MCP de `.mcp.json` y reinicia la sesión |
| Playwright no abre el navegador | `npx playwright install chrome` |
| `npx` tarda mucho la primera vez | Normal: descarga WordPress Playground / Playwright. `node tools/setup.mjs --warm` lo adelanta |
| Puerto 4173/9400 ocupado | `node tools/serve.mjs 4180` / `node tools/playground.mjs <slug> 9500` |
| `package.mjs` dice “no está APROBADO” | Revisa el preview y da la luz verde en el chat; Claude actualiza `aprobacion.md` |
| El ZIP no instala en el hosting | Genera el ZIP con `node tools/package.mjs <slug>` (no con “Enviar a carpeta comprimida” ni `Compress-Archive`) |
| Funciones de idioma (`language_chrome`) no hacen nada | Requieren el plugin interno Teducas Core ≥ 1.17 (no incluido). Para probarlo en local, copia `TeducasCore/` a la raíz del repo |
