#!/usr/bin/env node
// Lanzador multiplataforma del MCP de Playwright (Windows necesita shell para npx.cmd).
// Lo usa .mcp.json; no hace falta ejecutarlo a mano.
import { spawn } from 'node:child_process';

const child = spawn('npx', ['-y', '@playwright/mcp@latest', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
