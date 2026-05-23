import { api } from '../api.js';
import { Loader } from '../components/Loader.js';
import { formatTime, formatDate } from '../utils/formatters.js';
import { staggerIn, fadeIn } from '../utils/animations.js';
import { toast } from '../components/Toast.js';

export function SlotPicker({ service, onSelect, onBack }) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

  const heading = document.createElement('h2');
  heading.className = 'text-xl font-bold text-neutral-100';
  heading.textContent = 'Pick a Date & Time';
  container.appendChild(heading);

  const subtext = document.createElement('p');
  subtext.className = 'text-sm text-neutral-500 -mt-4';
  subtext.textContent = `Service: ${service.name} · ${service.duration} min`;
  container.appendChild(subtext);

  const dateSection = document.createElement('div');
  dateSection.className = 'space-y-2';

  const dateLabel = document.createElement('p');
  dateLabel.className = 'text-sm font-medium text-neutral-400';
  dateLabel.textContent = 'Available Dates';
  dateSection.appendChild(dateLabel);

  const dateGrid = document.createElement('div');
  dateGrid.className = 'flex flex-wrap gap-2';
  dateSection.appendChild(dateGrid);
  container.appendChild(dateSection);

  const slotSection = document.createElement('div');
  slotSection.className = 'space-y-2 hidden';

  const slotLabel = document.createElement('p');
  slotLabel.className = 'text-sm font-medium text-neutral-400';
  slotSection.appendChild(slotLabel);

  const slotGrid = document.createElement('div');
  slotGrid.className = 'grid grid-cols-3 gap-2';
  slotSection.appendChild(slotGrid);
  container.appendChild(slotSection);

  const backBtn = document.createElement('button');
  backBtn.className = 'text-sm text-neutral-500 hover:text-neutral-300 transition-colors mt-2 cursor-pointer';
  backBtn.textContent = '← Back to services';
  backBtn.addEventListener('click', onBack);
  container.appendChild(backBtn);

  const now = new Date();
  loadDates(now.getFullYear(), now.getMonth() + 1);

  let selectedDateEl = null;

  async function loadDates(year, month) {
    dateGrid.innerHTML = '';
    dateGrid.appendChild(Loader({ message: 'Loading availability...' }));

    try {
      const days = await api.getAvailableDays(year, month);
      dateGrid.innerHTML = '';

      if (days.length === 0) {
        dateGrid.innerHTML = '<p class="text-sm text-neutral-500">No available dates this month.</p>';
        return;
      }

      const dateEls = days.map(dateStr => {
        const [, , d] = dateStr.split('-');
        const btn = document.createElement('button');
        btn.dataset.date = dateStr;
        btn.className = `px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-800 
          text-sm font-medium text-neutral-300 hover:border-violet-500 hover:text-violet-300
          transition-all duration-200 cursor-pointer focus:outline-none`;

        const dayName = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
        btn.innerHTML = `<div class="text-xs text-neutral-500">${dayName}</div><div>${parseInt(d)}</div>`;

        btn.addEventListener('click', () => selectDate(dateStr, btn));
        return btn;
      });

      dateEls.forEach(b => dateGrid.appendChild(b));
      requestAnimationFrame(() => staggerIn(dateEls));
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function selectDate(dateStr, btnEl) {
    if (selectedDateEl) {
      selectedDateEl.classList.remove('border-violet-500', 'bg-violet-600/20', 'text-violet-300');
      selectedDateEl.classList.add('border-neutral-700', 'bg-neutral-800', 'text-neutral-300');
    }
    selectedDateEl = btnEl;
    btnEl.classList.add('border-violet-500', 'bg-violet-600/20', 'text-violet-300');
    btnEl.classList.remove('border-neutral-700', 'bg-neutral-800', 'text-neutral-300');

    slotSection.classList.remove('hidden');
    slotLabel.textContent = `Time Slots — ${formatDate(dateStr)}`;
    slotGrid.innerHTML = '';
    slotGrid.appendChild(Loader({ message: 'Loading slots...' }));

    try {
      const slots = await api.getSlots(dateStr);
      slotGrid.innerHTML = '';

      if (slots.length === 0) {
        slotGrid.innerHTML = '<p class="text-sm text-neutral-500 col-span-3">No slots available.</p>';
        return;
      }

      const slotEls = slots.map(slot => {
        const btn = document.createElement('button');
        btn.className = `py-2 px-3 rounded-xl border text-sm font-medium transition-all duration-200 text-center
          ${slot.booked
            ? 'border-neutral-800 bg-neutral-900 text-neutral-600 cursor-not-allowed line-through'
            : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-violet-500 hover:text-violet-300 cursor-pointer'}`;

        btn.textContent = formatTime(slot.time);
        btn.disabled = slot.booked;

        if (!slot.booked) {
          btn.addEventListener('click', () => onSelect(dateStr, slot.time));
        }
        return btn;
      });

      slotEls.forEach(s => slotGrid.appendChild(s));
      requestAnimationFrame(() => staggerIn(slotEls));
      fadeIn(slotSection);
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  return container;
}