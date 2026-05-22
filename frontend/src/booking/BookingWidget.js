import { ServiceSelector } from './ServiceSelector.js';
import { SlotPicker } from './SlotPicker.js';
import { CustomerForm } from './CustomerForm.js';
import { ConfirmationModal } from './ConfirmationModal.js';
import { api } from '../api.js';
import { toast } from '../components/Toast.js';
import { fadeIn } from '../utils/animations.js';
import { setState } from '../state.js';

export function BookingWidget({ business }) {
  const container = document.createElement('div');
  container.className = 'max-w-lg mx-auto';

  // Step indicator
  const steps = document.createElement('div');
  steps.className = 'flex items-center gap-2 mb-8';

  function renderSteps(current) {
    steps.innerHTML = '';
    ['Service', 'Date & Time', 'Confirm'].forEach((label, i) => {
      const active = i + 1 === current;
      const done = i + 1 < current;

      const step = document.createElement('div');
      step.className = 'flex items-center gap-1.5';

      const dot = document.createElement('div');
      dot.className = `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
        ${done ? 'bg-emerald-600 text-white' : active ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-500'}`;
      dot.textContent = done ? '✓' : i + 1;

      const lbl = document.createElement('span');
      lbl.className = `text-xs font-medium ${active ? 'text-neutral-100' : 'text-neutral-500'}`;
      lbl.textContent = label;

      step.appendChild(dot);
      step.appendChild(lbl);
      steps.appendChild(step);

      if (i < 2) {
        const line = document.createElement('div');
        line.className = `flex-1 h-px ${done ? 'bg-emerald-700' : 'bg-neutral-800'}`;
        steps.appendChild(line);
      }
    });
  }

  // State
  let step = 1;
  let selectedService = null;
  let selectedDate = null;
  let selectedSlot = null;

  const body = document.createElement('div');
  body.className = 'bg-neutral-900 border border-neutral-800 rounded-2xl p-6';

  container.appendChild(steps);
  container.appendChild(body);

  function go(n) {
    step = n;
    renderSteps(step);
    body.innerHTML = '';
    setState({ bookingStep: step });

    let view;
    if (step === 1) {
      view = ServiceSelector({
        services: business.services,
        onSelect: (svc) => {
          selectedService = svc;
          go(2);
        }
      });
    } else if (step === 2) {
      view = SlotPicker({
        service: selectedService,
        onSelect: (date, slot) => {
          selectedDate = date;
          selectedSlot = slot;
          go(3);
        },
        onBack: () => go(1)
      });
    } else if (step === 3) {
      view = CustomerForm({
        service: selectedService,
        date: selectedDate,
        slot: selectedSlot,
        onBack: () => go(2),
        onSubmit: async (customer) => {
          try {
            const booking = await api.createBooking({
              service: selectedService,
              date: selectedDate,
              slot: selectedSlot,
              customer
            });
            ConfirmationModal({
              booking,
              service: selectedService,
              onClose: () => go(1)
            });
          } catch (e) {
            toast(e.message, 'error');
          }
        }
      });
    }

    body.appendChild(view);
    fadeIn(body);
  }

  renderSteps(1);
  go(1);

  return container;
}