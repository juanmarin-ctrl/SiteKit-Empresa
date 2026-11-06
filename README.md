# TEDUCAS Site Kit — webs distintas por cliente (AI-first)

Convierte el **brief de un cliente** (documentos + branding + imágenes) en un **sitio WordPress instalable con un clic** — Elementor + WooCommerce + Tutor LMS — con una experiencia visual propia y fiel a su marca.

Claude **diseña, desarrolla y revisa**: dirección de arte con skills de diseño, preview HTML que tú apruebas, pruebas en navegador con Playwright y un instalador de un clic.

---

## ⚡ Instalación (una vez por persona)

1. Instala **Claude Code** (app de escritorio de Claude → pestaña *Code*, CLI o extensión de VS Code), **Git**, **Node.js 18+** y **Google Chrome**.
2. Clona el repo:

   ```bash
   git clone <URL-DE-ESTE-REPO> SiteKit
   ```

3. Abre la carpeta `SiteKit` en Claude Code y pega:

   ```text
   Lee INSTALAR.md y ejecuta la instalación del Site Kit en este equipo. Al final dame el resumen de verificación.
   ```

4. Cuando Claude Code pregunte, **aprueba los MCP `figma` y `playwright`**.

Detalle en **[INSTALAR.md](INSTALAR.md)**.

## 🧰 Qué trae (obligatorio en todo proyecto)

| | Herramienta | Rol |
|-|-------------|-----|
| 1️⃣ | **Emil Kowalski** (`emil-design-eng`) + **Impeccable** (`impeccable`) | Reglas de diseño, tipografía, espaciado y animaciones |
| 2️⃣ | **Taste Skill** (`design-taste-frontend`) | Referencias y criterio visual (dirección de arte) |
| 3️⃣ | **Figma MCP** + **Playwright MCP** | Trabajar desde referencias de Figma y abrir, probar y revisar la web |
| 4️⃣ | **WordPress Elementor** (`wordpress-elementor`, `wordpress-setup`, `wordpress-content`) | Plantillas Elementor y trabajo en el WordPress real |

Las skills viven en `.claude/skills/` y los MCP en `.mcp.json`: se cargan solos al abrir el repo.

## 📄 Páginas que se crean SIEMPRE

| Navegación | Legal & Documentación | Facturación | Cursos |
|------------|----------------------|-------------|--------|
| Inicio · Cursos · Sobre nosotros · Blog · Contáctame | Política de privacidad · Términos y condiciones · Política de reembolsos · Política de cookies · Aviso legal · Preguntas frecuentes | Carrito · Pasarela de pagos | Landing de curso individual (Tutor LMS) |

Contenido mínimo de cada una: [design/paginas-obligatorias.md](design/paginas-obligatorias.md).

---

## 🚀 Crear la web de un cliente

```text
Crea el proyecto "<nombre-cliente>" a partir de proyectos/_plantilla-proyecto.
Los documentos del cliente están en <ruta o adjuntos>.
Lee CLAUDE.md y ejecuta prompts/PIPELINE.md hasta el preview HTML de las 14 páginas y detente para que lo apruebe.
```

Flujo:

```
Brief → Concepto → PREVIEW HTML (14 páginas) → ⛔ tu luz verde → Payload WordPress → ZIP → prueba en WordPress local
```

1. Claude te da **`http://localhost:4173/<slug>/`**: sala de revisión con las 14 páginas en escritorio y móvil.
2. Pides cambios o dices **“aprobado”**. Sin aprobación no se genera el WordPress (el empaquetador lo bloquea).
3. Claude genera el payload, el ZIP (`proyectos/<slug>/site-maestro.zip`) y lo prueba en WordPress Playground.

Guía paso a paso: **[COMO-USAR-CON-CLAUDE.md](COMO-USAR-CON-CLAUDE.md)**

---

## Estructura del repo

```
├── CLAUDE.md / AGENTS.md     ← instrucciones para la IA (reglas obligatorias)
├── INSTALAR.md               ← instalación guiada (la ejecuta Claude)
├── .claude/
│   ├── skills/               ← 6 skills incluidas
│   └── launch.json           ← servidores: previews (4173), wp-playground (9400)
├── .mcp.json                 ← Figma + Playwright
├── design/                   ← páginas obligatorias, anti-template, schema, rubros
├── prompts/PIPELINE.md       ← pipeline con gate de aprobación
├── brief/                    ← plantillas (01…06) + bandeja de entrada
├── engine/site-maestro/      ← plugin WordPress genérico (1 clic)
├── tools/                    ← setup, validate, serve, playground, package
└── proyectos/
    └── _plantilla-proyecto/  ← copiar para cada cliente
```

## Comandos

```bash
node tools/setup.mjs --warm                 # verificar instalación
node tools/serve.mjs                        # previews → http://localhost:4173/<slug>/
node tools/validate.mjs <slug>              # páginas obligatorias + aprobación + payload
node tools/playground.mjs <slug>            # WordPress local con el payload del cliente
node tools/package.mjs <slug>               # ZIP instalable (requiere APROBADO)
```

## Sobre los proyectos de clientes

`.gitignore` **no versiona** `proyectos/<cliente>/` (solo la plantilla), para que el repo compartido siga limpio. Si tu equipo quiere guardar sus clientes en git, hazlo en un **fork / repo propio** y quita esa regla.
