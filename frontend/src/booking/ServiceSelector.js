import { formatCurrency } from '../utils/formatters.js';

export function ServiceSelector({ services, onSelect }) {
  const container = document.createElement('div');
  container.className = 'space-y-3';

  const heading = document.createElement('h2');
  heading.className = 'text-xl font-bold text-neutral-100 mb-6';
  heading.textContent = 'Select a Service';
  container.appendChild(heading);

  services.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'w-full p-4 rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-200';
    card.style.cursor = 'pointer';

    const topRow = document.createElement('div');
    topRow.className = 'flex items-center justify-between pointer-events-none';

    const name = document.createElement('span');
    name.className = 'font-semibold text-neutral-100';
    name.textContent = svc.name;

    const price = document.createElement('span');
    price.className = 'text-violet-400 font-medium text-sm';
    price.textContent = svc.deposit > 0 ? formatCurrency(svc.deposit) : 'Free';

    topRow.appendChild(name);
    topRow.appendChild(price);

    const metaRow = document.createElement('div');
    metaRow.className = 'flex gap-3 mt-1 pointer-events-none';

    const dur = document.createElement('span');
    dur.className = 'text-xs text-neutral-500';
    dur.textContent = `${svc.duration} min`;

    const dep = document.createElement('span');
    dep.className = 'text-xs text-neutral-500';
    dep.textContent = svc.deposit > 0 ? `${formatCurrency(svc.deposit)} deposit` : 'No deposit';

    metaRow.appendChild(dur);
    metaRow.appendChild(dep);

    const hint = document.createElement('div');
    hint.className = 'mt-2 text-xs text-violet-500 font-medium opacity-0 transition-opacity duration-150 pointer-events-none';
    hint.textContent = 'Tap to select →';

    card.appendChild(topRow);
    card.appendChild(metaRow);
    card.appendChild(hint);

    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#7c3aed';
      card.style.backgroundColor = '#1c1917';
      hint.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
      card.style.backgroundColor = '';
      hint.style.opacity = '0';
    });

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      card.style.borderColor = '#7c3aed';
      card.style.backgroundColor = '#2e1065';
      console.log('Service selected:', svc.name); // debug
      setTimeout(() => onSelect(svc), 120);
    });

    container.appendChild(card);
  });

  return container;
}