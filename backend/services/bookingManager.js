import { readStore, writeStore } from './jsonStore.js';
import { v4 as uuidv4 } from 'uuid';

export function getAllBookings() {
  return readStore('bookings') || [];
}

export function createBooking({ service, date, slot, customer }) {
  const bookings = getAllBookings();

  const conflict = bookings.find(
    b => b.date === date && b.slot === slot && b.status !== 'cancelled'
  );
  if (conflict) throw new Error('Slot already booked');

  const booking = {
    id: uuidv4(),
    service,
    date,
    slot,
    customer,
    depositStatus: 'pending',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  writeStore('bookings', bookings);
  return booking;
}

export function updateDepositStatus(bookingId, depositStatus) {
  const bookings = getAllBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx === -1) throw new Error('Booking not found');
  bookings[idx].depositStatus = depositStatus;
  writeStore('bookings', bookings);
  return bookings[idx];
}