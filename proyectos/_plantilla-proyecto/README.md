# Proyecto: (nombre cliente)

1. Renombra esta carpeta a un slug (`academia-norte`).
2. Completa `brief/` (docs + imágenes + `06-legal-y-pagos.md`).
3. Pide a la IA: *“Ejecuta el pipeline del Site Kit para este proyecto.”*
4. Revisa `concepto.md`.
5. **Revisa el preview HTML** de las 14 páginas en `http://localhost:4173/<slug>/` y da la luz verde en el chat.
6. Con `aprobacion.md` en **APROBADO**, la IA genera `payload/` y el ZIP (`node tools/package.mjs <slug>`).

## Estructura

```
brief/            ← documentos del cliente (01…06 + imagenes/)
concepto.md       ← experiencia elegida (Fase 2)
mockup/           ← preview HTML: las 14 páginas obligatorias (Fase 3)
aprobacion.md     ← gate: PENDIENTE / CAMBIOS / APROBADO
payload/          ← site.json + CSS/JS + media + templates Elementor (Fase 4, solo tras APROBADO)
site-maestro.zip  ← entregable
```

## Mockups obligatorios (`mockup/`)

`index.html` · `cursos.html` · `nosotros.html` · `blog.html` · `contacto.html` ·
`privacidad.html` · `terminos.html` · `reembolsos.html` · `cookies.html` · `aviso-legal.html` · `faq.html` ·
`carrito.html` · `checkout.html` · `curso.html` — todos con el mismo header/footer y la misma hoja de estilos.
Detalle de contenido: `design/paginas-obligatorias.md`.

## Checklist

- [ ] Brief completo (incluye legal y pagos)
- [ ] concepto.md con test anti-template
- [ ] 14 mockups HTML — `node tools/validate.mjs <slug> --etapa mockup` sin errores
- [ ] Preview revisado y **APROBADO** en `aprobacion.md`
- [ ] Payload — `node tools/validate.mjs <slug>` sin errores
- [ ] ZIP + instalado en WordPress de prueba (`node tools/playground.mjs`)
