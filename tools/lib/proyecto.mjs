// Utilidades compartidas: páginas obligatorias, estado de aprobación y validación de un proyecto.
import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PAGINAS = JSON.parse(readFileSync(join(REPO, 'design', 'paginas.json'), 'utf8'));

export const projectDir = (slug) => join(REPO, 'proyectos', slug);

export function listProjects() {
  const root = join(REPO, 'proyectos');
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name);
}

/** Lee proyectos/<slug>/aprobacion.md → { estado: 'APROBADO' | 'PENDIENTE' | 'CAMBIOS' | 'SIN-ARCHIVO', texto } */
export function approval(slug) {
  const f = join(projectDir(slug), 'aprobacion.md');
  if (!existsSync(f)) return { estado: 'SIN-ARCHIVO', texto: '' };
  const texto = readFileSync(f, 'utf8');
  const m = texto.match(/^\s*\**\s*Estado\s*\**\s*:\s*\**\s*([A-ZÁÉÍÓÚ-]+)/im);
  return { estado: m ? m[1].toUpperCase() : 'PENDIENTE', texto };
}

const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');

/** Valida un proyecto. etapas: 'mockup' | 'payload' | 'aprobacion'. Devuelve { errors, warnings, info }. */
export function validate(slug, etapas = ['mockup', 'aprobacion', 'payload']) {
  const errors = [];
  const warnings = [];
  const info = [];
  const dir = projectDir(slug);
  if (!existsSync(dir)) return { errors: [`No existe proyectos/${slug}/`], warnings, info };

  // --- Base del proyecto
  if (!existsSync(join(dir, 'brief', '_normalizado.md'))) warnings.push('Falta brief/_normalizado.md (Fase 1)');
  if (!existsSync(join(dir, 'concepto.md'))) errors.push('Falta concepto.md (Fase 2)');

  // --- Mockups HTML (Fase 3)
  if (etapas.includes('mockup')) {
    const mock = join(dir, 'mockup');
    const required = PAGINAS.pages;
    const navHrefs = required.filter((p) => p.menu === 'primary').map((p) => p.mockup);
    const legalHrefs = required.filter((p) => p.menu === 'legal').map((p) => p.mockup);
    let css = null;
    let found = 0;
    for (const p of required) {
      const f = join(mock, p.mockup);
      if (!existsSync(f)) { errors.push(`Mockup faltante: mockup/${p.mockup} (${p.title})`); continue; }
      found++;
      const html = read(f);
      if (statSync(f).size < 1500) errors.push(`mockup/${p.mockup} está casi vacío`);
      if (!/<title>[^<]{2,}<\/title>/i.test(html)) warnings.push(`mockup/${p.mockup} sin <title>`);
      if (/lorem ipsum/i.test(html)) errors.push(`mockup/${p.mockup} contiene "lorem ipsum": usa contenido real del brief`);
      const missingNav = navHrefs.filter((h) => !html.includes(h));
      if (missingNav.length) errors.push(`mockup/${p.mockup}: el menú no enlaza ${missingNav.join(', ')}`);
      const missingLegal = legalHrefs.filter((h) => !html.includes(h));
      if (missingLegal.length) errors.push(`mockup/${p.mockup}: el footer no enlaza ${missingLegal.join(', ')}`);
      if (!/carrito\.html/.test(html) && p.role !== 'carrito') warnings.push(`mockup/${p.mockup}: la cabecera no enlaza el carrito`);
      const links = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]).filter((h) => !/^https?:/.test(h));
      const sheet = links.find((h) => /styles?\.css|site\.css|main\.css/.test(h)) || links[0];
      if (!sheet) warnings.push(`mockup/${p.mockup} no enlaza una hoja de estilos local compartida`);
      else if (css === null) css = sheet.replace(/^\.\//, '');
      else if (css !== sheet.replace(/^\.\//, '')) warnings.push(`mockup/${p.mockup} usa otra hoja de estilos (${sheet}) — todas deberían compartir el sistema de diseño`);
      const todos = (html.match(/TODO-CLIENTE/g) || []).length;
      if (todos) warnings.push(`mockup/${p.mockup}: ${todos} TODO-CLIENTE pendientes`);
    }
    info.push(`Mockups: ${found}/${required.length}`);
  }

  // --- Aprobación del cliente/usuario (gate antes del payload)
  if (etapas.includes('aprobacion')) {
    const a = approval(slug);
    info.push(`Aprobación: ${a.estado}`);
    if (a.estado !== 'APROBADO') errors.push(`El preview HTML no está APROBADO (aprobacion.md: ${a.estado}). No se genera ni empaqueta el payload sin luz verde.`);
  }

  // --- Payload (Fase 4)
  if (etapas.includes('payload')) {
    const pdir = join(dir, 'payload');
    const sf = join(pdir, 'site.json');
    if (!existsSync(sf)) {
      errors.push('Falta payload/site.json (Fase 4)');
    } else {
      let site;
      try { site = JSON.parse(read(sf).replace(/^﻿/, '')); } catch (e) { errors.push(`payload/site.json inválido: ${e.message}`); }
      if (site) {
        if (site.project_id !== slug) warnings.push(`site.json project_id "${site.project_id}" ≠ carpeta "${slug}"`);
        if (!site.experience?.anti_template_ack) errors.push('site.json: experience.anti_template_ack debe ser true');
        const roles = new Map((site.pages || []).filter((p) => p.role).map((p) => [p.role, p]));
        for (const p of PAGINAS.pages.filter((x) => x.slug !== null)) {
          if (!roles.has(p.role)) errors.push(`site.json: falta la página obligatoria role="${p.role}" (${p.title})`);
        }
        const titles = (k) => (site.menus?.[k] || []);
        for (const p of PAGINAS.pages.filter((x) => x.menu)) {
          const page = roles.get(p.role);
          if (page && !titles(p.menu).includes(page.title)) errors.push(`site.json: "${page.title}" no está en menus.${p.menu}`);
        }
        const tdir = join(pdir, 'templates');
        const tpls = [site.header_template, site.footer_template, site.course_template, ...(site.pages || []).map((p) => p.template)].filter(Boolean);
        for (const t of new Set(tpls)) if (!existsSync(join(tdir, t))) errors.push(`Plantilla referenciada y ausente: payload/templates/${t}`);
        if (!site.course_template) errors.push('site.json: falta course_template (landing de curso Tutor LMS)');
        if (!Array.isArray(site.courses) || site.courses.length < 1) errors.push('site.json: declara al menos 1 curso demo en courses[]');
        const engine = site.commerce?.engine || 'woocommerce';
        const req = site.requires || [];
        if (!req.includes('tutor')) warnings.push('site.json: requires debería incluir "tutor"');
        if (engine === 'woocommerce' && !req.includes('woocommerce')) warnings.push('site.json: requires debería incluir "woocommerce"');
        const raw = read(sf);
        for (const m of raw.matchAll(/"(?:logo|favicon|image)"\s*:\s*"([^"]+)"/g)) {
          const file = m[1];
          if (!existsSync(join(pdir, 'media', 'brand', file)) && !existsSync(join(pdir, 'media', 'stock', file))) warnings.push(`Media referenciada no encontrada: ${file}`);
        }
        info.push(`Payload: ${(site.pages || []).length} páginas, ${(site.courses || []).length} cursos, commerce=${engine}`);
      }
    }
  }
  return { errors, warnings, info };
}
