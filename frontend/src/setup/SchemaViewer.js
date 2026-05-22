import { fadeIn } from '../utils/animations.js';

export function SchemaViewer({ schema }) {
  const container = document.createElement('div');
  container.className = 'space-y-4';

  const pre = document.createElement('pre');
  pre.className = 'bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs text-emerald-400 overflow-auto max-h-64 font-mono';
  pre.textContent = JSON.stringify(schema, null, 2);

  container.appendChild(pre);
  fadeIn(container);
  return container;
}