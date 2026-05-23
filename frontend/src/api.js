const BASE = import.meta.env.VITE_API_URL || 'https://booking-widget-0nhi.onrender.com';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Backend did not return JSON. Status: ${res.status}`);
  }

  if (!res.ok) {
    throw new Error(data.error || data.errors?.join(', ') || 'Request failed');
  }

  return data;
}

export const api = {
  getPresets: () => request('/api/ai/presets'),

  extractSchema: (prompt) =>
    request('/api/ai/extract', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    }),

  getBusiness: () => request('/api/business'),

  updateBusiness: (data) =>
    request('/api/business', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  getSlots: (date) => request(`/api/slots?date=${date}`),

  getAvailableDays: (year, month) =>
    request(`/api/slots/available-days?year=${year}&month=${month}`),

  getBookings: () => request('/api/bookings'),

  createBooking: (data) =>
    request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateDeposit: (id, depositStatus) =>
    request(`/api/bookings/${id}/deposit`, {
      method: 'PATCH',
      body: JSON.stringify({ depositStatus })
    })
};