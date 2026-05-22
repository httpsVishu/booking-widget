export function validateBookingBody(body) {
  const { service, date, slot, customer } = body;
  const errors = [];

  if (!service?.id) errors.push('service.id is required');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('date must be YYYY-MM-DD');
  if (!slot || !/^\d{2}:\d{2}$/.test(slot)) errors.push('slot must be HH:MM');
  if (!customer?.name?.trim()) errors.push('customer.name is required');
  if (!customer?.email?.includes('@')) errors.push('customer.email is invalid');
  if (!customer?.phone?.trim()) errors.push('customer.phone is required');

  return errors;
}