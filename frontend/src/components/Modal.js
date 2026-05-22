import { scaleIn, fadeOut } from '../utils/animations.js';

export function Modal({ title, content, onClose }) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';

  const panel = document.createElement('div');
  panel.className = 'bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-6';
  header.innerHTML = `<h2 class="text-xl font-bold text-neutral-100">${title}</h2>`;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-neutral-400 hover:text-neutral-100 transition-colors text-2xl leading-none';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => close());

  header.appendChild(closeBtn);
  panel.appendChild(header);
  panel.appendChild(content);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  scaleIn(panel);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function close() {
    fadeOut(panel).finished.then(() => {
      overlay.remove();
      onClose?.();
    });
  }

  return { overlay, close };
}