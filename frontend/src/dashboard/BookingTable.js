import { StatusBadge } from './StatusBadge.js';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters.js';
import { api } from '../api.js';
import { toast } from '../components/Toast.js';

export function BookingTable({ bookings, onRefresh }) {
  const container = document.createElement('div');
  container.className = 'overflow-x-auto';

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-neutral-500">No bookings yet</p>
        <p class="text-xs text-neutral-600 mt-1">Bookings will appear here in real time</p>
      </div>
    `;
    return container;
  }

  const table = document.createElement('table');
  table.className = 'w-full text-sm';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr class="border-b border-neutral-800 text-left">
      <th class="pb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer</th>
      <th class="pb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Service</th>
      <th class="pb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Slot</th>
      <th class="pb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Deposit</th>
      <th class="pb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  tbody.className = 'divide-y divide-neutral-800/50';

  // Sort newest first
  const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  sorted.forEach(booking => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-neutral-800/30 transition-colors';

    const depositCell = document.createElement('td');
    depositCell.className = 'py-3 pr-4';
    depositCell.appendChild(StatusBadge(booking.depositStatus));

    const actionsCell = document.createElement('td');
    actionsCell.className = 'py-3';

    if (booking.depositStatus === 'pending' && booking.service?.deposit > 0) {
      const markPaidBtn = document.createElement('button');
      markPaidBtn.className = 'text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer font-medium';
      markPaidBtn.textContent = 'Mark Paid';
      markPaidBtn.addEventListener('click', async () => {
        try {
          await api.updateDeposit(booking.id, 'paid');
          toast('Deposit marked as paid', 'success');
          onRefresh();
        } catch (e) {
          toast(e.message, 'error');
        }
      });
      actionsCell.appendChild(markPaidBtn);
    } else {
      actionsCell.textContent = '—';
      actionsCell.className += ' text-neutral-600';
    }

    tr.innerHTML = `
      <td class="py-3 pr-4">
        <div class="font-medium text-neutral-200">${booking.customer?.name || '—'}</div>
        <div class="text-xs text-neutral-500">${booking.customer?.email || ''}</div>
      </td>
      <td class="py-3 pr-4">
        <div class="text-neutral-300">${booking.service?.name || '—'}</div>
        ${booking.service?.deposit > 0 ? `<div class="text-xs text-neutral-500">${formatCurrency(booking.service.deposit)}</div>` : ''}
      </td>
      <td class="py-3 pr-4">
        <div class="text-neutral-300">${formatDate(booking.date)}</div>
        <div class="text-xs text-neutral-500">${formatTime(booking.slot)}</div>
      </td>
    `;

    tr.appendChild(depositCell);
    tr.appendChild(actionsCell);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
  return container;
}