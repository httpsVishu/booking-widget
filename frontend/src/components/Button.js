export function Button({ label, onClick, variant = 'primary', disabled = false, fullWidth = false, type = 'button' }) {
  const el = document.createElement('button');
  el.type = type;
  el.textContent = label;
  el.disabled = disabled;

  const base = 'inline-flex items-center justify-center font-semibold rounded-xl px-5 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 cursor-pointer';
  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white focus:ring-violet-500 disabled:opacity-40 disabled:cursor-not-allowed',
    secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 focus:ring-neutral-600',
    ghost: 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 focus:ring-neutral-600',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500'
  };

  el.className = `${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`;
  if (onClick) el.addEventListener('click', onClick);
  return el;
}