import { Router } from 'express';
import { getAllBookings, createBooking, updateDepositStatus } from '../services/bookingManager.js';
import { validateBookingBody } from '../utils/validation.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(getAllBookings());
});

router.post('/', (req, res) => {
  const errors = validateBookingBody(req.body);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const booking = createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

router.patch('/:id/deposit', (req, res) => {
  const { depositStatus } = req.body;
  if (!['pending', 'paid', 'waived'].includes(depositStatus)) {
    return res.status(400).json({ error: 'Invalid depositStatus' });
  }
  try {
    const booking = updateDepositStatus(req.params.id, depositStatus);
    res.json(booking);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;