export function StatusBadge(status) {
  const el = document.createElement('span');
  const styles = {
    pending: 'bg-amber-900/50 text-amber-300 border-amber-700',
    paid: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    waived: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    confirmed: 'bg-blue-900/50 text-blue-300 border-blue-700',
    cancelled: 'bg-red-900/50 text-red-300 border-red-700'
  };
  el.className = `text-xs font-medium px-2 py-1 rounded-lg border ${styles[status] || styles.pending}`;
  el.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  return el;
}