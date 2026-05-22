export function Loader({ message = 'Loading...' } = {}) {
  const el = document.createElement('div');
  el.className = 'flex flex-col items-center justify-center gap-4 py-12';
  el.innerHTML = `
    <div class="relative w-12 h-12">
      <div class="absolute inset-0 rounded-full border-2 border-neutral-700"></div>
      <div class="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
    </div>
    <p class="text-neutral-400 text-sm">${message}</p>
  `;
  return el;
}