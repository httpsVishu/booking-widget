const state = {
  business: null,
  view: 'setup', // 'setup' | 'booking' | 'dashboard'
  bookingStep: 1,
  selectedService: null,
  selectedDate: null,
  selectedSlot: null,
};

const listeners = [];

export function getState() {
  return { ...state };
}

export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach(fn => fn({ ...state }));
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx > -1) listeners.splice(idx, 1);
  };
}