export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^[\d\s\-()+]{7,}$/.test(phone);
}

export function validateCustomerForm({ name, email, phone }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  if (!validateEmail(email)) errors.email = 'Valid email required';
  if (!validatePhone(phone)) errors.phone = 'Valid phone required';
  return errors;
}