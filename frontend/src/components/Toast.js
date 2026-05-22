let container;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'fixed bottom-6 right-6 z-[100] flex flex-col gap-2';
    document.body.appendChild(container);
  }
  return container;
}

export function toast(message, type = 'info') {
  const c = getContainer();
  const colors = {
    info: 'bg-neutral-800 border-neutral-700 text-neutral-100',
    success: 'bg-emerald-900 border-emerald-700 text-emerald-100',
    error: 'bg-red-900 border-red-700 text-red-100',
    warning: 'bg-amber-900 border-amber-700 text-amber-100'
  };
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };

  const el = document.createElement('div');
  el.className = `flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl
    opacity-0 translate-y-2 transition-all duration-300 ${colors[type]}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  c.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, 3500);
}