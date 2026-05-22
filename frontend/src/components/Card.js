export function Card({ children = [], className = '' }) {
  const el = document.createElement('div');
  el.className = `bg-neutral-900 border border-neutral-800 rounded-2xl p-6 ${className}`;
  children.forEach(child => child && el.appendChild(child));
  return el;
}