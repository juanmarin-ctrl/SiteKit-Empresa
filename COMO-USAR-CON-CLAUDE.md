# Cómo usar el kit con Claude (u otra IA)

## Una vez por cliente nuevo

### 1. Crear carpeta de proyecto

```powershell
Copy-Item -Recurse "proyectos\_plantilla-proyecto" "proyectos\nombre-del-cliente"
```

(o pídeselo a Claude en el prompt del paso 3)

### 2. Meter documentos

En `proyectos/nombre-del-cliente/brief/` coloca:

- Información de la empresa
- Acerca / equipo
- Plan de estudios / cursos (precios, niveles, temario)
- Branding / estilos globales / logos
- **Legal y pagos** (`06-legal-y-pagos.md`: razón social, ID fiscal, pasarelas, moneda, reembolsos)
- Carpeta de imágenes

Pueden ser `.docx`, `.pdf` o `.md`. Lo que falte quedará como `TODO-CLIENTE`.

### 3. Pedir el preview

Abre la **raíz de este repositorio** en Claude Code y pega:

```
Lee CLAUDE.md.
Cliente: proyectos/nombre-del-cliente/ (brief en proyectos/nombre-del-cliente/brief/)
Ejecuta prompts/PIPELINE.md fases 1→3: brief normalizado, concepto y el preview HTML de las 14 páginas obligatorias.
Usa las skills del kit y revisa todo con Playwright. Detente y muéstrame el preview para aprobarlo.
```

Si el cliente tiene diseños en Figma, añade el enlace: Claude los lee con el MCP de Figma.

### 4. Revisar y aprobar el preview HTML

Claude te deja la sala de revisión en **`http://localhost:4173/nombre-del-cliente/`**:

- Las 14 páginas (navegación, legales, carrito, pasarela de pagos y landing de curso) en vista escritorio y móvil.
- Clic en “abrir ↗” para navegar cada página completa.
- Arriba ves el estado de aprobación y los avisos de validación.

Responde en el chat con los cambios que quieras, o **“aprobado”** para dar luz verde. Claude lo registra en `aprobacion.md`.
Si el archetype o la home te suena a “otra academia dorada”, pide otro concepto.

### 5. WordPress (después de la luz verde)

Claude genera el payload, lo valida, lo prueba en un WordPress local y empaqueta:

```bash
node tools/playground.mjs nombre-del-cliente   # http://localhost:9400 → Site Maestro → Instalar sitio completo
node tools/package.mjs nombre-del-cliente      # → proyectos/nombre-del-cliente/site-maestro.zip
```

### 6. Instalar en el hosting del cliente

1. Hello Elementor + Elementor (+ Pro si hay) + WooCommerce + Tutor LMS
2. Subir el ZIP → Activar **Site Maestro** → **Instalar sitio completo**
3. Configurar pasarelas de pago con las credenciales del cliente (WooCommerce → Ajustes → Pagos)
4. Runtime OK → puedes borrar el plugin instalador
5. Que el cliente o su asesor revise los textos legales

---

## Qué garantiza (y qué no)

| Garantiza el kit | Lo inventa la IA cada vez |
|------------------|---------------------------|
| Brief estandarizado | Layout / tipografía / atmósfera |
| 14 páginas obligatorias en todos los proyectos | Diseño de cada página según la marca |
| Preview HTML + aprobación antes del WordPress | Templates Elementor |
| Motor de instalación 1-clic (Elementor + WooCommerce + Tutor) | CSS/JS de marca |
| Skills de diseño + Figma + Playwright | Experiencia según rubro |
| Reglas anti-clon | |

Si dos webs se parecen, el fallo está en saltarse `anti-template.md`, no en el motor.
