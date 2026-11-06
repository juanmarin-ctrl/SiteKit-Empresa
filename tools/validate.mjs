#!/usr/bin/env node
// Valida un proyecto contra las páginas obligatorias, el gate de aprobación y el payload.
// Uso: node tools/validate.mjs <slug> [--etapa mockup|payload|todo]
//   mockup  → solo los 14 mockups HTML (antes de pedir luz verde)
//   payload → aprobación + payload (antes de empaquetar)
//   todo    → todo (por defecto)
import { validate, listProjects } from './lib/proyecto.mjs';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const i = args.indexOf('--etapa');
const etapa = i >= 0 ? args[i + 1] : 'todo';
if (!slug) {
  console.log('Uso: node tools/validate.mjs <slug> [--etapa mockup|payload|todo]');
  console.log('Proyectos:', listProjects().join(', ') || '(ninguno)');
  process.exit(1);
}
const etapas = etapa === 'mockup' ? ['mockup'] : etapa === 'payload' ? ['aprobacion', 'payload'] : ['mockup', 'aprobacion', 'payload'];
const { errors, warnings, info } = validate(slug, etapas);

console.log(`\nValidación — proyectos/${slug} (${etapa})\n`);
for (const l of info) console.log(`ℹ ${l}`);
for (const l of warnings) console.log(`⚠ ${l}`);
for (const l of errors) console.log(`✘ ${l}`);
console.log(errors.length ? `\n${errors.length} error(es). Corrige antes de continuar.` : '\n✔ Sin errores.');
process.exit(errors.length ? 1 : 0);
