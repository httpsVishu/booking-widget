import './style.css';

import { api } from './api.js';
import { getState, setState, subscribe } from './state.js';

import { PresetCards } from './setup/PresetCards.js';
import { PromptInput } from './setup/PromptInput.js';
import { SchemaEditor } from './setup/SchemaEditor.js';

import { BookingWidget } from './booking/BookingWidget.js';
import { Dashboard } from './dashboard/Dashboard.js';

import { Loader } from './components/Loader.js';
import { toast } from './components/Toast.js';
import { fadeIn } from './utils/animations.js';

const app = document.getElementById('app');

const CARD_CLASS = 'bg-neutral-900 border border-neutral-800 rounded-2xl p-6';
const TAB_ACTIVE = 'bg-violet-600 text-white';
const TAB_INACTIVE = 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800';

let isRendering = false;

function renderNav(business) {
  const nav = document.createElement('nav');
  nav.className =
    'border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-40';

  const inner = document.createElement('div');
  inner.className =
    'max-w-5xl mx-auto px-4 py-3 flex items-center justify-between';

  const logo = document.createElement('div');
  logo.className = 'flex items-center gap-2';
  logo.innerHTML = `
    <div class="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">F</div>
    <span class="font-bold text-neutral-100">Fig Booking</span>
  `;

  const tabs = document.createElement('div');
  tabs.className = 'flex items-center gap-1 bg-neutral-900 rounded-xl p-1';

  const { view } = getState();

  const navItems = [
    { id: 'setup', label: '⚙️ Setup' },
    { id: 'booking', label: '📅 Book', disabled: !business },
    { id: 'dashboard', label: '📊 Dashboard', disabled: !business }
  ];

  navItems.forEach((item) => {
    const btn = document.createElement('button');

    btn.className = `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      item.id === view ? TAB_ACTIVE : TAB_INACTIVE
    } ${item.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`;

    btn.textContent = item.label;
    btn.disabled = Boolean(item.disabled);

    btn.addEventListener('click', () => {
      if (!item.disabled) {
        setState({ view: item.id });
      }
    });

    tabs.appendChild(btn);
  });

  inner.appendChild(logo);
  inner.appendChild(tabs);
  nav.appendChild(inner);

  return nav;
}

async function renderSetup() {
  const container = document.createElement('div');
  container.className = 'max-w-2xl mx-auto px-4 py-10 space-y-8';

  const hero = document.createElement('div');
  hero.className = 'text-center space-y-3';
  hero.innerHTML = `
    <h1 class="text-4xl font-bold text-neutral-100">
      Configure Your <span class="text-violet-400">Booking System</span>
    </h1>
    <p class="text-neutral-500">
      Choose a preset or describe your business — AI does the rest.
    </p>
  `;
  container.appendChild(hero);

  let existingBusiness = getState().business;

  if (!existingBusiness) {
    try {
      existingBusiness = await api.getBusiness();
    } catch {
      existingBusiness = null;
    }
  }

  const schemaEditorSection = document.createElement('div');
  schemaEditorSection.className = `${CARD_CLASS} space-y-6 hidden`;

  function showSchemaEditor(schema) {
    schemaEditorSection.innerHTML = '';
    schemaEditorSection.className = `${CARD_CLASS} space-y-6`;

    const heading = document.createElement('h2');
    heading.className = 'text-lg font-bold text-neutral-100';
    heading.textContent = 'Edit Your Schema';

    schemaEditorSection.appendChild(heading);

    schemaEditorSection.appendChild(
      SchemaEditor({
        schema,
        onSaved: (saved) => {
          setState({ business: saved, view: 'booking' });
          toast(`${saved.businessName} is ready!`, 'success');
        }
      })
    );

    fadeIn(schemaEditorSection);
  }

  if (existingBusiness?.businessName) {
    const existing = document.createElement('div');
    existing.className =
      'bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-4 flex items-center justify-between';

    existing.innerHTML = `
      <div>
        <p class="text-sm font-semibold text-emerald-300">
          Active: ${existingBusiness.businessName}
        </p>
        <p class="text-xs text-neutral-500">
          ${existingBusiness.services?.length || 0} services · 
          ${existingBusiness.workingDays?.join(', ') || 'No working days'}
        </p>
      </div>
    `;

    const editBtn = document.createElement('button');
    editBtn.className =
      'text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium';
    editBtn.textContent = 'Edit Schema';

    editBtn.addEventListener('click', () => {
      showSchemaEditor(existingBusiness);
    });

    existing.appendChild(editBtn);
    container.appendChild(existing);
  }

  const presetsSection = document.createElement('div');
  presetsSection.className = 'space-y-4';
  presetsSection.innerHTML = `
    <h2 class="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
      Quick Presets
    </h2>
  `;

  const presetsGrid = document.createElement('div');
  presetsSection.appendChild(presetsGrid);
  container.appendChild(presetsSection);

  const divider = document.createElement('div');
  divider.className = 'flex items-center gap-4';
  divider.innerHTML = `
    <div class="flex-1 h-px bg-neutral-800"></div>
    <span class="text-xs text-neutral-600">OR</span>
    <div class="flex-1 h-px bg-neutral-800"></div>
  `;
  container.appendChild(divider);

  const loaderSection = document.createElement('div');
  loaderSection.className = 'hidden';

  async function handleExtract(prompt) {
    loaderSection.innerHTML = '';
    loaderSection.classList.remove('hidden');
    loaderSection.appendChild(Loader({ message: 'Extracting schema with AI...' }));

    try {
      const schema = await api.extractSchema(prompt);
      loaderSection.classList.add('hidden');
      showSchemaEditor(schema);
    } catch (error) {
      loaderSection.classList.add('hidden');
      toast(error.message || 'Failed to extract schema', 'error');
    }
  }

  const promptInput = PromptInput({ onSubmit: handleExtract });
  container.appendChild(promptInput);
  container.appendChild(loaderSection);
  container.appendChild(schemaEditorSection);

  try {
    const presets = await api.getPresets();

    presetsGrid.appendChild(
      PresetCards({
        presets,
        onSelect: (description) => {
          promptInput.setValue(description);
          handleExtract(description);
        }
      })
    );
  } catch {
    presetsGrid.innerHTML = `
      <p class="text-sm text-neutral-500">Could not load presets.</p>
    `;
  }

  fadeIn(container);
  return container;
}

async function render() {
  if (isRendering) return;
  isRendering = true;

  try {
    app.innerHTML = '';

    const state = getState();
    let currentBusiness = state.business;

    if (!currentBusiness) {
      try {
        currentBusiness = await api.getBusiness();
      } catch {
        currentBusiness = null;
      }
    }

    const nav = renderNav(currentBusiness);
    app.appendChild(nav);

    const main = document.createElement('main');
    main.className = 'max-w-5xl mx-auto px-4 py-8';
    app.appendChild(main);

    if (state.view === 'setup') {
      main.appendChild(await renderSetup());
      return;
    }

    if (state.view === 'booking') {
      if (!currentBusiness) {
        setState({ view: 'setup' });
        return;
      }

      main.appendChild(BookingWidget({ business: currentBusiness }));
      return;
    }

    if (state.view === 'dashboard') {
      if (!currentBusiness) {
        setState({ view: 'setup' });
        return;
      }

      main.appendChild(Dashboard({ business: currentBusiness }));
      return;
    }
  } finally {
    isRendering = false;
  }
}

subscribe(() => {
  render();
});

render();