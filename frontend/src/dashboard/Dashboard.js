import { BookingTable } from './BookingTable.js';
import { api } from '../api.js';
import { Loader } from '../components/Loader.js';
import { toast } from '../components/Toast.js';
import { fadeIn } from '../utils/animations.js';

export function Dashboard({ business }) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between';
  header.innerHTML = `
    <div>
      <h1 class="text-2xl font-bold text-neutral-100">${business.businessName}</h1>
      <p class="text-sm text-neutral-500 mt-0.5">Owner Dashboard</p>
    </div>
    <div class="flex items-center gap-2 text-xs text-neutral-500">
      <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      Auto-refresh every 5s
    </div>
  `;
  container.appendChild(header);

  // Stats row
  const statsRow = document.createElement('div');
  statsRow.className = 'grid grid-cols-3 gap-4';
  statsRow.id = 'dashboard-stats';
  container.appendChild(statsRow);

  // Table section
  const tableCard = document.createElement('div');
  tableCard.className = 'bg-neutral-900 border border-neutral-800 rounded-2xl p-6';

  const tableHeader = document.createElement('div');
  tableHeader.className = 'flex items-center justify-between mb-6';
  tableHeader.innerHTML = `<h2 class="text-lg font-semibold text-neutral-100">All Bookings</h2>`;

  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'text-xs text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer';
  refreshBtn.textContent = '↻ Refresh';
  refreshBtn.addEventListener('click', () => loadBookings());
  tableHeader.appendChild(refreshBtn);

  tableCard.appendChild(tableHeader);
  const tableBody = document.createElement('div');
  tableBody.id = 'table-body';
  tableCard.appendChild(tableBody);
  container.appendChild(tableCard);

  async function loadBookings() {
    tableBody.innerHTML = '';
    tableBody.appendChild(Loader({ message: 'Loading bookings...' }));

    try {
      const bookings = await api.getBookings();

      // Update stats
      const pending = bookings.filter(b => b.depositStatus === 'pending').length;
      const paid = bookings.filter(b => b.depositStatus === 'paid').length;
      const revenue = bookings
        .filter(b => b.depositStatus === 'paid')
        .reduce((sum, b) => sum + (b.service?.deposit || 0), 0);

      statsRow.innerHTML = '';
      [
        { label: 'Total Bookings', value: bookings.length, icon: '📅' },
        { label: 'Deposits Paid', value: `${paid}/${bookings.length}`, icon: '💳' },
        { label: 'Revenue Collected', value: `$${revenue.toFixed(2)}`, icon: '💰' }
      ].forEach(stat => {
        const card = document.createElement('div');
        card.className = 'bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center';
        card.innerHTML = `
          <div class="text-2xl mb-2">${stat.icon}</div>
          <div class="text-2xl font-bold text-neutral-100">${stat.value}</div>
          <div class="text-xs text-neutral-500 mt-1">${stat.label}</div>
        `;
        statsRow.appendChild(card);
      });

      tableBody.innerHTML = '';
      tableBody.appendChild(BookingTable({ bookings, onRefresh: loadBookings }));
      fadeIn(tableBody);
    } catch (e) {
      toast(e.message, 'error');
      tableBody.innerHTML = '';
    }
  }

  loadBookings();

  // Auto-refresh every 5 seconds
  const interval = setInterval(loadBookings, 5000);

  // Cleanup on remove
  const observer = new MutationObserver(() => {
    if (!document.contains(container)) {
      clearInterval(interval);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  fadeIn(container);
  return container;
}