import { Modal } from '../components/Modal.js';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters.js';

export function ConfirmationModal({ booking, service, onClose }) {
  const content = document.createElement('div');
  content.className = 'space-y-4';

  content.innerHTML = `
    <div class="text-center py-4">
      <div class="text-5xl mb-4">🎉</div>
      <h3 class="text-lg font-bold text-neutral-100">You're booked!</h3>
      <p class="text-sm text-neutral-400 mt-1">Confirmation sent to ${booking.customer.email}</p>
    </div>
    <div class="bg-neutral-950 rounded-xl p-4 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-neutral-500">Service</span>
        <span class="text-neutral-100 font-medium">${service.name}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-neutral-500">Date</span>
        <span class="text-neutral-100">${formatDate(booking.date)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-neutral-500">Time</span>
        <span class="text-neutral-100">${formatTime(booking.slot)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-neutral-500">Deposit</span>
        <span class="text-emerald-400 font-medium">${service.deposit > 0 ? formatCurrency(service.deposit) + ' paid' : 'None required'}</span>
      </div>
    </div>
  `;

  return Modal({ title: 'Booking Confirmed', content, onClose });
}