#!/usr/bin/env node
// Servidor estático sin dependencias para previsualizar los mockups de proyectos/.
// Uso: node tools/serve.mjs [puerto]   →   http://localhost:4173/<slug>/mockup/
import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, join, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'proyectos');
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

async function index() {
  const dirs = (await readdir(root, { withFileTypes: true })).filter((d) => d.isDirectory() && !d.name.startsWith('_'));
  const items = [];
  for (const d of dirs) {
    try { await stat(join(root, d.name, 'mockup', 'index.html')); items.push(d.name); } catch {}
  }
  const list = items.length
    ? items.map((n) => `<li><a href="/${encodeURIComponent(n)}/mockup/">${n}</a></li>`).join('')
    : '<li>Aún no hay mockups. Crea uno en proyectos/&lt;slug&gt;/mockup/index.html</li>';
  return `<!doctype html><meta charset="utf-8"><title>Mockups — Site Kit</title><body style="font:16px/1.5 sans-serif;padding:2rem"><h1>Mockups</h1><ul>${list}</ul>`;
}

createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/') { res.writeHead(200, { 'Content-Type': types['.html'] }); return res.end(await index()); }
    if (url.endsWith('/')) url += 'index.html';
    const file = resolve(join(root, url));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); return res.end('403'); }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
}).listen(port, () => console.log(`Mockups: http://localhost:${port}`));
