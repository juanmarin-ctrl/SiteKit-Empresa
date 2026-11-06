# Proyectos por cliente

Este repositorio **es** el Site Kit. Cada carpeta en `proyectos/` = un cliente = una experiencia distinta.

```
proyectos/
  _plantilla-proyecto/     ← copiar esto para clientes nuevos
  (cliente-a)/
  (cliente-b)/
```

## Crear un proyecto nuevo

```powershell
Copy-Item -Recurse "proyectos\_plantilla-proyecto" "proyectos\nombre-cliente"
```

```bash
cp -r proyectos/_plantilla-proyecto proyectos/nombre-cliente
```

1. Llena `proyectos/nombre-cliente/brief/` (incluido `06-legal-y-pagos.md`)
2. Abre Claude en la **raíz del repo** y pega el prompt de `COMO-USAR-CON-CLAUDE.md`
3. Revisa el preview HTML de las 14 páginas en `http://localhost:4173/nombre-cliente/` y da la luz verde
4. Claude genera `payload/` y el ZIP `proyectos/nombre-cliente/site-maestro.zip`

> Las carpetas de clientes no se suben al repo compartido (ver `.gitignore`).

## Regla

Nunca copies `payload/` o `mockup/` de un proyecto a otro como base visual.
Antes de diseñar, mira los `concepto.md` de los demás proyectos y **aleja** tipografía, atmósfera y orden de secciones.
