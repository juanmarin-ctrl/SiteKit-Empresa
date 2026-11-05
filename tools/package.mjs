#!/usr/bin/env node
// Empaqueta engine/site-maestro en un ZIP instalable en WordPress.
// Uso: node tools/package.mjs <slug>     → proyectos/<slug>/site-maestro.zip
//      node tools/package.mjs            → dist/site-maestro.zip
// El ZIP contiene la carpeta site-maestro/ en la raíz (rutas con "/", válido en hostings Linux).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const engine = join(repo, 'engine');
const site = JSON.parse(readFileSync(join(engine, 'site-maestro', 'payload', 'site.json'), 'utf8'));

if (site.project_id === 'reemplazar-slug') {
  console.warn('⚠  engine/site-maestro/payload/site.json sigue siendo el placeholder: el ZIP no instalará ningún cliente.');
}
if (slug && site.project_id !== slug) {
  console.warn(`⚠  El payload actual es de "${site.project_id}", no de "${slug}". Revisa engine/site-maestro/payload/.`);
}

const outDir = slug ? join(repo, 'proyectos', slug) : join(repo, 'dist');
if (slug && !existsSync(outDir)) { console.error(`No existe proyectos/${slug}/`); process.exit(1); }
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'site-maestro.zip');
rmSync(out, { force: true });

// bsdtar (Windows 10+, macOS) crea ZIP con -a; en Linux se usa zip.
const r = process.platform === 'linux'
  ? spawnSync('zip', ['-rq', out, 'site-maestro', '-x', '*.DS_Store'], { cwd: engine, stdio: 'inherit' })
  : spawnSync('tar', ['-a', '-c', '-f', out, 'site-maestro'], { cwd: engine, stdio: 'inherit' });

if (r.status !== 0) { console.error('Falló el empaquetado (¿falta "tar" o "zip"?).'); process.exit(r.status || 1); }
console.log(`✔ ${out}`);
