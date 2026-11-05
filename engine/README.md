# Engine — Site Maestro

Plugin WordPress **genérico**. No contiene la marca del cliente.

## Anatomía

| Parte | ¿Cambia por cliente? |
|-------|----------------------|
| `site-maestro.php` + `includes/` + `runtime/` | No |
| `payload/` | **Sí** — lo genera la IA |

## Instalar en un WordPress

1. Asegúrate de que `payload/site.json` es del cliente correcto (no el placeholder).
2. Comprime la carpeta `site-maestro` (debe quedar `site-maestro/site-maestro.php` en la raíz del ZIP).
3. Plugins → Subir → Activar.
4. Menú **Site Maestro** → Instalar sitio completo.
5. Cuando diga Runtime OK → puedes eliminar el instalador.

## Cambios

- **1.1.0** — `pages[].parent` (páginas hijas, ej. `/es/…`), `pages[].header_template` / `footer_template` (cabecera y pie por página; en Pro se asignan con condiciones por página), formulario genérico `action=sm_contact` en el runtime (destino `contact.email` de site.json), se desactivan colores/fuentes por defecto del Kit de Elementor, y arreglo de `GLOB_BRACE` (no existe en PHP con musl/WASM).

- **1.2.0** — `chrome_posts` en site.json: cabecera/pie por idioma en entradas que no crea el instalador (p. ej. cursos de Tutor LMS; solo Elementor Pro).

- **1.4.0** — Con Teducas Core ≥ 1.17: cabecera/pie según el idioma del visitante en páginas neutras (`language_chrome`) e idioma por entrada (`language_posts`).

> **Teducas Core** es un plugin interno aparte (no incluido en este repo). Solo hace falta para las funciones de idioma de 1.4.0; sin él, Site Maestro funciona igual e ignora `language_chrome` / `language_posts`.

## Probar en local (WordPress Playground)

Desde la raíz del repo:

```bash
node tools/playground.mjs
```

Abre `http://localhost:9400` con WordPress + Hello Elementor + Elementor y este plugin montado (los cambios en `engine/site-maestro` se ven al recargar). Usuario `admin` / `password` — solo local.
