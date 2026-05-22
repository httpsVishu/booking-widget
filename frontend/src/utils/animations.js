import { animate, stagger } from '@motionone/dom';

export function fadeIn(el, options = {}) {
  return animate(el, { opacity: [0, 1], y: [16, 0] }, { duration: 0.35, easing: 'ease-out', ...options });
}

export function fadeOut(el, options = {}) {
  return animate(el, { opacity: [1, 0], y: [0, -8] }, { duration: 0.25, easing: 'ease-in', ...options });
}

export function staggerIn(els, options = {}) {
  return animate(els, { opacity: [0, 1], y: [12, 0] }, {
    duration: 0.3,
    delay: stagger(0.06),
    easing: 'ease-out',
    ...options
  });
}

export function scaleIn(el, options = {}) {
  return animate(el, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.25, easing: 'ease-out', ...options });
}

export function pulse(el) {
  return animate(el, { scale: [1, 1.03, 1] }, { duration: 0.4, easing: 'ease-in-out' });
}