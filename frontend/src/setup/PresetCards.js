import { staggerIn } from '../utils/animations.js';

export function PresetCards({ presets, onSelect }) {
  const container = document.createElement('div');
  container.className = 'grid grid-cols-2 gap-3';

  const cards = Object.entries(presets).map(([key, preset]) => {
    const card = document.createElement('button');
    card.className = `text-left p-4 rounded-2xl border border-neutral-800 bg-neutral-900 
      hover:border-violet-500 hover:bg-neutral-800 transition-all duration-200 
      cursor-pointer group focus:outline-none focus:border-violet-500`;

    card.innerHTML = `
      <div class="text-3xl mb-3">${preset.icon}</div>
      <div class="font-semibold text-neutral-100 text-sm group-hover:text-violet-300 transition-colors">${preset.name}</div>
      <div class="text-xs text-neutral-500 mt-1 capitalize">${key}</div>
    `;

    card.addEventListener('click', () => onSelect(preset.description, preset.name));
    return card;
  });

  cards.forEach(c => container.appendChild(c));
  requestAnimationFrame(() => staggerIn(cards));

  return container;
}