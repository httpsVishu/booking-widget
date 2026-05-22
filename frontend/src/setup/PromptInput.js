import { Button } from '../components/Button.js';

export function PromptInput({ onSubmit, initialValue = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-3';

  const label = document.createElement('label');
  label.className = 'text-sm font-medium text-neutral-400';
  label.textContent = 'Or describe your business:';

  const textarea = document.createElement('textarea');
  textarea.className = 'w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 resize-none h-32 text-sm';
  textarea.placeholder = 'e.g. We\'re a mobile dog grooming service offering baths, trims, and nail care. Slots are 90 minutes. We take a $40 deposit...';
  textarea.value = initialValue;

  const btn = Button({
    label: 'Extract Schema with AI →',
    onClick: () => {
      const val = textarea.value.trim();
      if (val.length < 20) return;
      onSubmit(val);
    }
  });

  wrapper.appendChild(label);
  wrapper.appendChild(textarea);
  wrapper.appendChild(btn);

  // expose a method to set value
  wrapper.setValue = (v) => { textarea.value = v; };

  return wrapper;
}