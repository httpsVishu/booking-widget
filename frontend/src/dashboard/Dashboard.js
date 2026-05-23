import { BookingTable } from './BookingTable.js';
import { api } from '../api.js';
import { Loader } from '../components/Loader.js';
import { toast } from '../components/Toast.js';
import { fadeIn } from '../utils/animations.js';

export function Dashboard({ business }) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

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

  const statsRow = document.createElement('div');
  statsRow.className = 'grid grid-cols-3 gap-4';
  statsRow.id = 'dashboard-stats';
  container.appendChild(statsRow);

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

      if (bookings.length === 0) {
        tableBody.innerHTML = `
          <div class="text-center py-10 space-y-3">
            <div class="text-4xl">📋</div>
            <p class="text-neutral-300 font-medium">No bookings yet</p>
            <p class="text-sm text-neutral-500 max-w-sm mx-auto">
              This is the <span class="text-violet-400 font-medium">owner's live view</span>. 
              Once customers book through the <strong class="text-neutral-300">Book</strong> tab, 
              their appointments will appear here automatically.
            </p>
            <div class="mt-6 border border-neutral-800 rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-neutral-800 bg-neutral-900/50">
                    <th class="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customer</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Service</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date & Time</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Deposit</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-neutral-600 text-sm italic">
                      Bookings will appear here in real time
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
      } else {
        tableBody.appendChild(BookingTable({ bookings, onRefresh: loadBookings }));
      }
      fadeIn(tableBody);
    } catch (e) {
      toast(e.message, 'error');
      tableBody.innerHTML = '';
    }
  }

  loadBookings();

  const interval = setInterval(loadBookings, 5000);

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