import { readStore } from './jsonStore.js';

const DAY_MAP = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6
};

export function generateSlotsForDate(dateStr) {
  const business = readStore('business');
  if (!business || !business.workingDays) return [];

  const date = new Date(dateStr + 'T00:00:00');
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

  if (!business.workingDays.includes(dayName)) return [];

  const bookings = readStore('bookings') || [];
  const bookedSlots = new Set(
    bookings
      .filter(b => b.date === dateStr && b.status !== 'cancelled')
      .map(b => b.slot)
  );

  const [startH, startM] = business.workingHours.start.split(':').map(Number);
  const [endH, endM] = business.workingHours.end.split(':').map(Number);
  const interval = business.slotInterval || 30;

  const slots = [];
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + interval <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    slots.push({
      time: timeStr,
      booked: bookedSlots.has(timeStr)
    });
    current += interval;
  }

  return slots;
}

export function getAvailableDays(year, month) {
  const business = readStore('business');
  if (!business || !business.workingDays) return [];

  const daysInMonth = new Date(year, month, 0).getDate();
  const available = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (business.workingDays.includes(dayName)) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      available.push(dateStr);
    }
  }

  return available;
}