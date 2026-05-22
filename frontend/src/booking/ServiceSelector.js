import { staggerIn } from '../utils/animations.js';
import { formatCurrency } from '../utils/formatters.js';

export function ServiceSelector({ services, onSelect }) {
  const container = document.createElement('div');
  container.className = 'space-y-3';

  const heading = document.createElement('h2');
  heading.className = 'text-xl font-bold text-neutral-100 mb-6';
  heading.textContent = 'Select a Service';
  container.appendChild(heading);

  const cards = services.map(svc => {
    const card = document.createElement('button');
    card.className = `w-full text-left p-4 rounded-2xl border border-neutral-800 bg-neutral-900
      hover:border-violet-500 hover:bg-neutral-800/50 transition-all duration-200 
      cursor-pointer group focus:outline-none focus:border-violet-500`;

    const duration = `${svc.duration} min`;
    const deposit = svc.deposit > 0 ? `${formatCurrency(svc.deposit)} deposit` : 'No deposit';

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-semibold text-neutral-100 group-hover:text-violet-300 transition-colors">${svc.name}</span>
        <span class="text-violet-400 font-medium text-sm">${formatCurrency(svc.deposit)}</span>
      </div>
      <div class="flex gap-3 mt-1">
        <span class="text-xs text-neutral-500">⏱ ${duration}</span>
        <span class="text-xs text-neutral-500">💳 ${deposit}</span>
      </div>
    `;

    card.addEventListener('click', () => onSelect(svc));
    return card;
  });

  cards.forEach(c => container.appendChild(c));
  requestAnimationFrame(() => staggerIn(cards));

  return container;
}