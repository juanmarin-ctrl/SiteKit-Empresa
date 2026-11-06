#!/usr/bin/env node
// Servidor de previews HTML (sin dependencias).
// Uso: node tools/serve.mjs [puerto]
//   http://localhost:4173/                  → lista de proyectos
//   http://localhost:4173/<slug>/           → SALA DE REVISIÓN: las 14 páginas obligatorias, escritorio + móvil, estado de aprobación
//   http://localhost:4173/<slug>/mockup/... → el mockup tal cual
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, extname, sep } from 'node:path';
import { REPO, PAGINAS, listProjects, approval, validate } from './lib/proyecto.mjs';

const root = join(REPO, 'proyectos');
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.md': 'text/plain; charset=utf-8',
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shell = (title, body) => `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>
:root{color-scheme:light dark;font:15px/1.5 ui-sans-serif,system-ui,sans-serif}
body{margin:0;padding:24px 28px;background:Canvas;color:CanvasText}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:28px 0 10px;text-transform:uppercase;letter-spacing:.06em;opacity:.7}
a{color:inherit}.muted{opacity:.65}
.badge{display:inline-block;padding:2px 10px;border-radius:99px;font-weight:600;font-size:13px}
.ok{background:#1f8a4c;color:#fff}.pend{background:#b7791f;color:#fff}.bad{background:#c53030;color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
.card{border:1px solid color-mix(in srgb,CanvasText 18%,transparent);border-radius:10px;overflow:hidden}
.card header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;gap:8px}
.frame{position:relative;height:260px;overflow:hidden;background:color-mix(in srgb,CanvasText 6%,transparent)}
.frame iframe{position:absolute;top:0;left:0;width:1440px;height:1100px;border:0;transform:scale(.21);transform-origin:0 0;pointer-events:none}
.frame.m iframe{width:390px;height:844px;transform:scale(.3)}
.missing{display:grid;place-items:center;height:100%;color:#c53030;font-weight:600}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
ul.v{margin:6px 0 0;padding-left:18px}
.tabs button{font:inherit;padding:4px 12px;border-radius:6px;border:1px solid currentColor;background:none;color:inherit;cursor:pointer}
.tabs button[aria-pressed=true]{background:CanvasText;color:Canvas}
</style><body>${body}</body></html>`;

function home() {
  const items = listProjects().map((s) => {
    const a = approval(s).estado;
    const cls = a === 'APROBADO' ? 'ok' : a === 'CAMBIOS' ? 'bad' : 'pend';
    return `<li><a href="/${encodeURIComponent(s)}/">${esc(s)}</a> <span class="badge ${cls}">${esc(a)}</span></li>`;
  });
  return shell('Previews — Site Kit', `<h1>Previews de proyectos</h1><p class="muted">Abre un proyecto para revisar sus 14 páginas obligatorias.</p><ul>${items.join('') || '<li>Aún no hay proyectos. Copia proyectos/_plantilla-proyecto.</li>'}</ul>`);
}

function review(slug) {
  const a = approval(slug);
  const cls = a.estado === 'APROBADO' ? 'ok' : a.estado === 'CAMBIOS' ? 'bad' : 'pend';
  const { errors, warnings, info } = validate(slug, ['mockup']);
  const groups = PAGINAS.groups.map((g) => {
    const cards = PAGINAS.pages.filter((p) => p.group === g.id).map((p) => {
      const exists = existsSync(join(root, slug, 'mockup', p.mockup));
      const url = `/${encodeURIComponent(slug)}/mockup/${p.mockup}`;
      return `<article class="card"><header><strong>${esc(p.title)}</strong>${exists ? `<a href="${url}" target="_blank">abrir ↗</a>` : '<span class="badge bad">falta</span>'}</header>
<div class="frame">${exists ? `<iframe loading="lazy" src="${url}" title="${esc(p.title)}"></iframe>` : `<div class="missing">mockup/${esc(p.mockup)}</div>`}</div></article>`;
    }).join('');
    return `<h2>${esc(g.label)}</h2><div class="grid">${cards}</div>`;
  }).join('');
  const list = (arr, sym) => (arr.length ? `<ul class="v">${arr.map((l) => `<li>${sym} ${esc(l)}</li>`).join('')}</ul>` : '');
  const body = `<div class="row"><h1>${esc(slug)}</h1><span class="badge ${cls}">${esc(a.estado)}</span></div>
<p class="muted">Sala de revisión del preview HTML. Revisa cada página (escritorio y móvil) y da la <strong>luz verde</strong> en el chat con Claude. Sin aprobación no se genera el WordPress.</p>
<div class="row tabs"><span>Vista:</span><button aria-pressed="true" data-v="d">Escritorio</button><button aria-pressed="false" data-v="m">Móvil</button>
<span class="muted">${esc(info.join(' · '))}</span></div>
${errors.length || warnings.length ? `<details ${errors.length ? 'open' : ''}><summary>${errors.length} error(es), ${warnings.length} aviso(s) de validación</summary>${list(errors, '✘')}${list(warnings, '⚠')}</details>` : '<p>✔ Mockups completos.</p>'}
${groups}
<script>document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('.frame').forEach(f=>f.classList.toggle('m',b.dataset.v==='m'))})</script>`;
  return shell(`Revisión — ${slug}`, body);
}

createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(req.url.split('?')[0]);
    const send = (html) => { res.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store' }); res.end(html); };
    if (url === '/') return send(home());
    const m = url.match(/^\/([^/]+)\/?$/);
    if (m && !m[1].startsWith('_') && existsSync(join(root, m[1])) && (await stat(join(root, m[1]))).isDirectory()) {
      if (!url.endsWith('/')) { res.writeHead(302, { Location: url + '/' }); return res.end(); }
      return send(review(m[1]));
    }
    if (url.endsWith('/')) url += 'index.html';
    const file = resolve(join(root, url));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); return res.end('403'); }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
}).listen(port, () => console.log(`Previews: http://localhost:${port}`));
