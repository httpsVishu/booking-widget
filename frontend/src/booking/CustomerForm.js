import { Button } from '../components/Button.js';
import { validateCustomerForm } from '../utils/validators.js';
import { formatTime, formatDate, formatCurrency } from '../utils/formatters.js';
import { fadeIn } from '../utils/animations.js';

export function CustomerForm({ service, date, slot, onSubmit, onBack }) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

  const summary = document.createElement('div');
  summary.className = 'bg-violet-950/40 border border-violet-800/50 rounded-2xl p-4 space-y-1';
  summary.innerHTML = `
    <p class="text-sm font-semibold text-violet-300">${service.name}</p>
    <p class="text-xs text-neutral-400">${formatDate(date)} at ${formatTime(slot)}</p>
    ${service.deposit > 0
      ? `<p class="text-xs text-neutral-400">Deposit: <span class="text-violet-300 font-medium">${formatCurrency(service.deposit)}</span></p>`
      : '<p class="text-xs text-neutral-500">No deposit required</p>'}
  `;
  container.appendChild(summary);

  const heading = document.createElement('h2');
  heading.className = 'text-xl font-bold text-neutral-100';
  heading.textContent = 'Your Details';
  container.appendChild(heading);

  const fields = [
    { id: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
    { id: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email' },
    { id: 'phone', label: 'Phone', placeholder: '+1 555 000 0000', type: 'tel' }
  ];

  const inputs = {};
  const errorEls = {};

  fields.forEach(f => {
    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-1';

    const label = document.createElement('label');
    label.className = 'text-sm font-medium text-neutral-400';
    label.textContent = f.label;

    const el = document.createElement('input');
    el.type = f.type;
    el.placeholder = f.placeholder;
    el.className = 'w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200';
    el.id = f.id;

    const errEl = document.createElement('p');
    errEl.className = 'text-xs text-red-400 hidden';

    wrapper.appendChild(label);
    wrapper.appendChild(el);
    wrapper.appendChild(errEl);
    container.appendChild(wrapper);

    inputs[f.id] = el;
    errorEls[f.id] = errEl;
  });

  if (service.deposit > 0) {
    const stripeBox = document.createElement('div');
    stripeBox.className = 'border border-neutral-700 rounded-2xl p-4 space-y-3';
    stripeBox.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm font-semibold text-neutral-300">Payment Details</p>
        <span class="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-lg">Stripe Mock</span>
      </div>
      <div class="space-y-2">
        <input class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 text-sm" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" readonly />
        <div class="grid grid-cols-2 gap-2">
          <input class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 text-sm" placeholder="MM/YY" value="12/28" readonly />
          <input class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 text-sm" placeholder="CVC" value="123" readonly />
        </div>
      </div>
      <p class="text-xs text-neutral-500 text-center">This is a mock payment — no real charge</p>
    `;
    container.appendChild(stripeBox);
  }

  const actions = document.createElement('div');
  actions.className = 'flex gap-3';

  const backBtn = Button({ label: '← Back', variant: 'secondary', onClick: onBack });
  const submitBtn = Button({
    label: service.deposit > 0 ? `Pay ${formatCurrency(service.deposit)} & Book` : 'Confirm Booking',
    fullWidth: true,
    onClick: handleSubmit
  });

  actions.appendChild(backBtn);
  actions.appendChild(submitBtn);
  container.appendChild(actions);

  function handleSubmit() {
    const values = {
      name: inputs.name.value.trim(),
      email: inputs.email.value.trim(),
      phone: inputs.phone.value.trim()
    };

    const errors = validateCustomerForm(values);
    let hasErrors = false;

    Object.keys(errorEls).forEach(k => {
      if (errors[k]) {
        errorEls[k].textContent = errors[k];
        errorEls[k].classList.remove('hidden');
        inputs[k].classList.add('border-red-500');
        hasErrors = true;
      } else {
        errorEls[k].classList.add('hidden');
        inputs[k].classList.remove('border-red-500');
      }
    });

    if (!hasErrors) onSubmit(values);
  }

  fadeIn(container);
  return container;
}