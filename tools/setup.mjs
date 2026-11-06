#!/usr/bin/env node
// Comprobación e instalación del Site Kit en un equipo nuevo. Sin dependencias.
// Uso: node tools/setup.mjs [--warm] [--global-skills]
//   --warm           descarga por adelantado WordPress Playground CLI (npx) para que el primer preview sea rápido
//   --global-skills  además copia las skills del kit a ~/.claude/skills (para usarlas también fuera de este repo)
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, cpSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const flags = new Set(process.argv.slice(2));
const win = process.platform === 'win32';
const results = [];
const ok = (k, v) => results.push(['✔', k, v]);
const warn = (k, v) => results.push(['⚠', k, v]);
const fail = (k, v) => results.push(['✘', k, v]);
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: 'utf8', shell: win, ...opts });

// 1. Requisitos
const major = Number(process.versions.node.split('.')[0]);
major >= 18 ? ok('Node.js', process.versions.node) : fail('Node.js', `${process.versions.node} (se necesita 18+)`);

const git = run('git', ['--version']);
git.status === 0 ? ok('Git', git.stdout.trim()) : fail('Git', 'no encontrado — instala Git');

const npx = run('npx', ['--version']);
npx.status === 0 ? ok('npx', npx.stdout.trim()) : fail('npx', 'no encontrado — reinstala Node.js con npm');

if (process.platform === 'linux') {
  run('zip', ['-v']).status === 0 ? ok('zip', 'disponible') : warn('zip', 'no encontrado — instálalo para tools/package.mjs');
} else {
  run('tar', ['--version']).status === 0 ? ok('tar', 'disponible') : warn('tar', 'no encontrado — necesario para tools/package.mjs');
}

// 2. Skills incluidas
const skillsDir = join(repo, '.claude', 'skills');
const skills = existsSync(skillsDir) ? readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
const REQUIRED_SKILLS = ['design-taste-frontend', 'emil-design-eng', 'impeccable', 'wordpress-elementor', 'wordpress-setup', 'wordpress-content'];
for (const name of REQUIRED_SKILLS) {
  const f = join(skillsDir, name, 'SKILL.md');
  if (!existsSync(f)) { fail(`Skill ${name}`, 'falta .claude/skills/' + name + '/SKILL.md'); continue; }
  const text = readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  /^---\n[\s\S]*?^name:\s*\S+[\s\S]*?\n---\n/m.test(text) ? ok(`Skill ${name}`, 'lista (Claude Code la carga al abrir el repo)') : warn(`Skill ${name}`, 'SKILL.md sin frontmatter válido');
}

if (flags.has('--global-skills')) {
  const dest = join(homedir(), '.claude', 'skills');
  mkdirSync(dest, { recursive: true });
  for (const name of skills) {
    if (existsSync(join(dest, name))) { warn(`Global ${name}`, `ya existe en ${dest} — no se sobrescribe`); continue; }
    cpSync(join(skillsDir, name), join(dest, name), { recursive: true });
    ok(`Global ${name}`, `copiada a ${dest}`);
  }
}

// 3. Motor y payload
try {
  const site = JSON.parse(readFileSync(join(repo, 'engine', 'site-maestro', 'payload', 'site.json'), 'utf8'));
  ok('Payload site.json', `JSON válido (project_id: ${site.project_id})`);
  JSON.parse(readFileSync(join(repo, 'design', 'site.schema.json'), 'utf8'));
  ok('Schema', 'design/site.schema.json válido');
} catch (e) {
  fail('Payload/Schema', e.message);
}
const ver = (readFileSync(join(repo, 'engine', 'site-maestro', 'site-maestro.php'), 'utf8').match(/Version:\s*([\d.]+)/) || [])[1];
ver ? ok('Site Maestro', `v${ver}`) : warn('Site Maestro', 'no se pudo leer la versión');

try {
  const pag = JSON.parse(readFileSync(join(repo, 'design', 'paginas.json'), 'utf8'));
  ok('Páginas obligatorias', `${pag.pages.length} definidas en design/paginas.json`);
} catch (e) {
  fail('Páginas obligatorias', e.message);
}

// 4. MCP obligatorios (Figma + Playwright)
try {
  const mcp = JSON.parse(readFileSync(join(repo, '.mcp.json'), 'utf8')).mcpServers || {};
  for (const name of ['figma', 'playwright']) {
    mcp[name] ? ok(`MCP ${name}`, 'declarado en .mcp.json (Claude Code pide aprobarlo al abrir el repo)') : fail(`MCP ${name}`, 'falta en .mcp.json');
  }
} catch (e) {
  fail('MCP', `.mcp.json ilegible: ${e.message}`);
}
if (!existsSync(join(repo, '.git'))) warn('Git', 'esta carpeta no es un clone de git (¿descargaste el ZIP?)');

// 5. Calentar descargas (WordPress Playground y Playwright MCP)
if (flags.has('--warm')) {
  const r = run('npx', ['-y', '@wp-playground/cli@latest', '--version'], { cwd: repo, timeout: 300000 });
  r.status === 0 ? ok('WP Playground CLI', (r.stdout || '').trim().split('\n').pop() || 'descargado') : warn('WP Playground CLI', 'no se pudo descargar ahora; se intentará al primer preview');
  const p = run('npx', ['-y', '@playwright/mcp@latest', '--help'], { cwd: repo, timeout: 300000 });
  p.status === 0 ? ok('Playwright MCP', 'paquete descargado') : warn('Playwright MCP', 'no se pudo descargar ahora; se intentará al abrir el MCP');
}

// Resumen
console.log('\nSite Kit — verificación\n');
for (const [s, k, v] of results) console.log(`${s} ${k.padEnd(22)} ${v}`);
const failed = results.some(([s]) => s === '✘');
console.log(failed ? '\nHay requisitos sin cumplir (✘). Corrígelos y vuelve a ejecutar.' : '\nListo. Abre el repo en Claude Code y sigue README.md → "Crear la web de un cliente".');
process.exit(failed ? 1 : 0);
