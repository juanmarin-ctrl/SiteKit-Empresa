# TEDUCAS Site Kit — webs distintas por cliente (AI-first)

Convierte el **brief de un cliente** (documentos + branding + imágenes) en un **sitio WordPress instalable con un clic**, con una experiencia visual propia para cada cliente.

No es una plantilla con colores cambiados: la IA inventa la experiencia y el motor `site-maestro` la instala.

---

## ⚡ Instalación (una vez por persona)

1. Instala **Claude Code** (app de escritorio de Claude → pestaña *Code*, CLI o extensión de VS Code), **Git** y **Node.js 18+**.
2. Clona el repo:

   ```bash
   git clone <URL-DE-ESTE-REPO> SiteKit
   ```

3. Abre la carpeta `SiteKit` en Claude Code y pega este prompt:

   ```text
   Lee INSTALAR.md y ejecuta la instalación del Site Kit en este equipo. Al final dame el resumen de verificación.
   ```

Claude comprueba requisitos, verifica las skills incluidas, prepara las herramientas de previsualización y te dice si falta algo. Detalle en **[INSTALAR.md](INSTALAR.md)**.

> Las **skills ya vienen dentro del repo** (`.claude/skills/`). Claude Code las carga solas al abrir la carpeta: no hay que copiarlas a mano.

---

## 🚀 Crear la web de un cliente

```text
Crea el proyecto "<nombre-cliente>" a partir de proyectos/_plantilla-proyecto.
Los documentos del cliente están en <ruta o adjuntos>.
Lee CLAUDE.md y AGENTS.md y ejecuta prompts/PIPELINE.md completo.
Obligatorio design/anti-template.md: no puede parecerse a otros proyectos/.
Al final deja el payload en engine/site-maestro/payload/ y una copia en proyectos/<slug>/payload/.
```

Guía paso a paso: **[COMO-USAR-CON-CLAUDE.md](COMO-USAR-CON-CLAUDE.md)**

---

## Estructura del repo

```
├── CLAUDE.md / AGENTS.md     ← instrucciones para la IA
├── INSTALAR.md               ← instalación guiada (la ejecuta Claude)
├── .claude/
│   ├── skills/               ← skills de diseño incluidas (impeccable, design-taste-frontend)
│   └── launch.json           ← servidores de preview (mockups + WordPress Playground)
├── .mcp.json                 ← MCP opcionales (Playwright, Figma)
├── design/                   ← anti-template + schema + rubros
├── prompts/                  ← pipeline de generación
├── brief/                    ← plantillas + bandeja de entrada
├── engine/site-maestro/      ← plugin WordPress genérico (1 clic)
├── tools/                    ← setup, servidor de mockups, WordPress Playground
└── proyectos/
    └── _plantilla-proyecto/  ← copiar para cada cliente
```

## Principio

```
MOTOR (igual siempre)     engine/site-maestro/
PAYLOAD (único/cliente)   generado por la IA desde el brief
```

## Flujo

```
1. Copiar  proyectos/_plantilla-proyecto  →  proyectos/<slug>
2. Meter docs e imágenes en  proyectos/<slug>/brief/
3. Pegar el prompt de arriba en Claude
4. Previsualizar: mockups (http://localhost:4173/<slug>/mockup/) y WordPress Playground (http://localhost:9400)
5. Empaquetar engine/site-maestro  →  subir a WordPress  →  "Instalar sitio completo"
```

## Sobre los proyectos de clientes

Por defecto `.gitignore` **no versiona** `proyectos/<cliente>/` (solo la plantilla), para que el repo compartido siga limpio y no se mezclen datos de clientes.
Si tu equipo quiere guardar sus clientes en git, hazlo en un **fork / repo propio** y quita esa regla de `.gitignore`. Valora Git LFS para los bancos de fotos.
