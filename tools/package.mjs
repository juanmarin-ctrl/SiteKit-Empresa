#!/usr/bin/env node
// Empaqueta el plugin Site Maestro con el payload de UN cliente.
// Uso: node tools/package.mjs <slug> [--force]
//   → proyectos/<slug>/site-maestro.zip
// Toma el motor de engine/site-maestro/ y el payload de proyectos/<slug>/payload/ (fuente de verdad del cliente).
// Bloquea si el preview no está APROBADO o faltan páginas obligatorias (salvo --force, que deja constancia).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { REPO, validate, projectDir } from './lib/proyecto.mjs';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const force = args.includes('--force');
if (!slug) { console.error('Uso: node tools/package.mjs <slug> [--force]'); process.exit(1); }

const dir = projectDir(slug);
const payload = join(dir, 'payload');
if (!existsSync(join(payload, 'site.json'))) { console.error(`Falta proyectos/${slug}/payload/site.json`); process.exit(1); }

const { errors, warnings } = validate(slug, ['aprobacion', 'payload']);
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✘ ${e}`);
if (errors.length && !force) {
  console.error('\nNo se empaqueta: corrige los errores (o usa --force bajo tu responsabilidad).');
  process.exit(1);
}
if (errors.length) console.warn('\n⚠ --force: empaquetando con errores.');

// Ensamblar en una carpeta temporal: motor + payload del cliente
const stage = mkdtempSync(join(tmpdir(), 'sitekit-pkg-'));
const target = join(stage, 'site-maestro');
cpSync(join(REPO, 'engine', 'site-maestro'), target, { recursive: true, filter: (src) => !src.startsWith(join(REPO, 'engine', 'site-maestro', 'payload')) });
cpSync(payload, join(target, 'payload'), { recursive: true });

const out = join(dir, 'site-maestro.zip');
rmSync(out, { force: true });
mkdirSync(dir, { recursive: true });
// bsdtar (Windows 10+, macOS) crea ZIP con -a; en Linux se usa zip. Rutas con "/" y carpeta site-maestro/ en la raíz.
const r = process.platform === 'linux'
  ? spawnSync('zip', ['-rq', out, 'site-maestro', '-x', '*.DS_Store'], { cwd: stage, stdio: 'inherit' })
  : spawnSync('tar', ['-a', '-c', '-f', out, 'site-maestro'], { cwd: stage, stdio: 'inherit' });
rmSync(stage, { recursive: true, force: true });

if (r.status !== 0) { console.error('Falló el empaquetado (¿falta "tar" o "zip"?).'); process.exit(r.status || 1); }
console.log(`✔ ${out}`);
