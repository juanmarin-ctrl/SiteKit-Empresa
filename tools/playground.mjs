#!/usr/bin/env node
// WordPress local (WordPress Playground): Hello Elementor + Elementor + WooCommerce + Tutor LMS + Site Maestro.
// Uso: node tools/playground.mjs [slug] [puerto]
//   sin slug → payload placeholder del motor (engine/site-maestro/payload)
//   con slug → monta proyectos/<slug>/payload como payload del plugin
// http://localhost:9400  (admin / password, solo local)
//
// Opcional: si existe TeducasCore/ en la raíz del repo (plugin interno, no incluido), también se monta y activa.
import { spawn } from 'node:child_process';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './lib/proyecto.mjs';

const args = process.argv.slice(2);
const slug = args.find((a) => !/^\d+$/.test(a));
const port = Number(args.find((a) => /^\d+$/.test(a)) || process.env.PORT || 9400);
const blueprint = JSON.parse(readFileSync(join(REPO, 'tools', 'wp-playground', 'blueprint.json'), 'utf8'));

// Rutas RELATIVAS a la raíz del repo: la CLI no acepta "C:\..." en --mount y así
// evitamos problemas con espacios en la ruta (se ejecuta con cwd = raíz del repo).
const mounts = ['--mount=engine/site-maestro:/wordpress/wp-content/plugins/site-maestro'];
if (slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { console.error('El slug debe ser kebab-case (a-z, 0-9, guiones).'); process.exit(1); }
  if (!existsSync(join(REPO, 'proyectos', slug, 'payload', 'site.json'))) { console.error(`Falta proyectos/${slug}/payload/site.json`); process.exit(1); }
  mounts.push(`--mount=proyectos/${slug}/payload:/wordpress/wp-content/plugins/site-maestro/payload`);
  console.log(`Payload: proyectos/${slug}/payload`);
}
if (existsSync(join(REPO, 'TeducasCore', 'teducas-core.php'))) {
  mounts.push('--mount=TeducasCore:/wordpress/wp-content/plugins/teducas-core');
  blueprint.steps.push({ step: 'activatePlugin', pluginPath: 'teducas-core/teducas-core.php' });
  console.log('TeducasCore detectado: se montará y activará.');
}

const bpRel = 'tools/wp-playground/.blueprint.generated.json';
writeFileSync(join(REPO, bpRel), JSON.stringify(blueprint, null, 2));

const cli = ['-y', '@wp-playground/cli@latest', 'server', `--port=${port}`, ...mounts, `--blueprint=${bpRel}`];
console.log(`WordPress Playground → http://localhost:${port}  (admin / password)`);
const child = spawn('npx', cli, { cwd: REPO, stdio: 'inherit', shell: process.platform === 'win32' });
child.on('exit', (code) => process.exit(code ?? 0));
