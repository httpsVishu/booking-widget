import { Button } from '../components/Button.js';
import { api } from '../api.js';
import { setState } from '../state.js';
import { toast } from '../components/Toast.js';
import { fadeIn } from '../utils/animations.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function SchemaEditor({ schema, onSaved }) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

  // Clone schema for local editing
  let local = JSON.parse(JSON.stringify(schema));

  function render() {
    container.innerHTML = '';

    // Business name
    const nameSection = section('Business Name');
    const nameInput = input(local.businessName, (v) => { local.businessName = v; });
    nameSection.appendChild(nameInput);
    container.appendChild(nameSection);

    // Working days
    const daysSection = section('Working Days');
    const daysGrid = document.createElement('div');
    daysGrid.className = 'flex flex-wrap gap-2';

    DAYS.forEach(day => {
      const active = local.workingDays.includes(day);
      const chip = document.createElement('button');
      chip.textContent = day.slice(0, 3);
      chip.className = `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border
        ${active
          ? 'bg-violet-600 border-violet-500 text-white'
          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'}`;

      chip.addEventListener('click', () => {
        if (active) {
          local.workingDays = local.workingDays.filter(d => d !== day);
        } else {
          const order = DAYS.filter(d => [...local.workingDays, day].includes(d));
          local.workingDays = order;
        }
        render();
      });
      daysGrid.appendChild(chip);
    });
    daysSection.appendChild(daysGrid);
    container.appendChild(daysSection);

    // Working hours
    const hoursSection = section('Working Hours');
    const hoursRow = document.createElement('div');
    hoursRow.className = 'flex items-center gap-3';

    const startInput = timeInput(local.workingHours.start, (v) => { local.workingHours.start = v; });
    const sep = document.createElement('span');
    sep.className = 'text-neutral-500';
    sep.textContent = '→';
    const endInput = timeInput(local.workingHours.end, (v) => { local.workingHours.end = v; });

    hoursRow.appendChild(startInput);
    hoursRow.appendChild(sep);
    hoursRow.appendChild(endInput);
    hoursSection.appendChild(hoursRow);
    container.appendChild(hoursSection);

    // Services
    const servicesSection = section('Services');
    local.services.forEach((svc, i) => {
      const row = serviceRow(svc, i);
      servicesSection.appendChild(row);
    });

    const addBtn = Button({ label: '+ Add Service', variant: 'ghost', onClick: () => {
      local.services.push({ id: `service-${Date.now()}`, name: 'New Service', duration: 60, deposit: 0 });
      render();
    }});
    addBtn.className += ' text-sm mt-2';
    servicesSection.appendChild(addBtn);
    container.appendChild(servicesSection);

    // Save
    const saveBtn = Button({
      label: 'Save & Continue',
      fullWidth: true,
      onClick: async () => {
        try {
          await api.updateBusiness(local);
          setState({ business: local });
          toast('Business schema saved!', 'success');
          onSaved?.(local);
        } catch (e) {
          toast(e.message, 'error');
        }
      }
    });
    container.appendChild(saveBtn);

    fadeIn(container);
  }

  function serviceRow(svc, idx) {
    const row = document.createElement('div');
    row.className = 'grid grid-cols-12 gap-2 items-center mb-2';

    const nameEl = input(svc.name, (v) => { local.services[idx].name = v; });
    nameEl.className += ' col-span-5';
    nameEl.placeholder = 'Service name';

    const durEl = numberInput(svc.duration, (v) => { local.services[idx].duration = v; });
    durEl.className += ' col-span-3';

    const depEl = numberInput(svc.deposit, (v) => { local.services[idx].deposit = v; });
    depEl.className += ' col-span-3';

    const delBtn = document.createElement('button');
    delBtn.className = 'col-span-1 text-neutral-600 hover:text-red-400 transition-colors text-lg cursor-pointer';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', () => {
      local.services.splice(idx, 1);
      render();
    });

    // Labels on first row
    if (idx === 0) {
      const header = document.createElement('div');
      header.className = 'grid grid-cols-12 gap-2 mb-1';
      header.innerHTML = `
        <span class="col-span-5 text-xs text-neutral-500">Service</span>
        <span class="col-span-3 text-xs text-neutral-500">Mins</span>
        <span class="col-span-3 text-xs text-neutral-500">Deposit $</span>
        <span class="col-span-1"></span>
      `;
      row.before(header);
    }

    row.appendChild(nameEl);
    row.appendChild(durEl);
    row.appendChild(depEl);
    row.appendChild(delBtn);
    return row;
  }

  function section(title) {
    const el = document.createElement('div');
    el.className = 'space-y-3';
    const h = document.createElement('h3');
    h.className = 'text-sm font-semibold text-neutral-300 uppercase tracking-wider';
    h.textContent = title;
    el.appendChild(h);
    return el;
  }

  function input(value, onChange) {
    const el = document.createElement('input');
    el.className = 'w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 text-sm';
    el.value = value;
    el.addEventListener('input', (e) => onChange(e.target.value));
    return el;
  }

  function numberInput(value, onChange) {
    const el = document.createElement('input');
    el.type = 'number';
    el.className = 'w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 text-sm';
    el.value = value;
    el.min = 0;
    el.addEventListener('input', (e) => onChange(Number(e.target.value)));
    return el;
  }

  function timeInput(value, onChange) {
    const el = document.createElement('input');
    el.type = 'time';
    el.className = 'w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 text-sm w-auto';
    el.value = value;
    el.addEventListener('change', (e) => onChange(e.target.value));
    return el;
  }

  render();
  return container;
}