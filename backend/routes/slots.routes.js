import { Router } from 'express';
import { generateSlotsForDate, getAvailableDays } from '../services/slotGenerator.js';

const router = Router();

// GET /api/slots?date=2025-08-10
router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query param required' });
  const slots = generateSlotsForDate(date);
  res.json(slots);
});

// GET /api/slots/available-days?year=2025&month=8
router.get('/available-days', (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) return res.status(400).json({ error: 'year and month required' });
  const days = getAvailableDays(Number(year), Number(month));
  res.json(days);
});

export default router;