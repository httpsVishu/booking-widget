import { Router } from 'express';
import { readStore, writeStore } from '../services/jsonStore.js';

const router = Router();

router.get('/', (req, res) => {
  const business = readStore('business');
  if (!business || !business.businessName) {
    return res.status(404).json({ error: 'No business configured yet' });
  }
  res.json(business);
});

router.put('/', (req, res) => {
  const current = readStore('business') || {};
  const updated = { ...current, ...req.body };
  writeStore('business', updated);
  res.json(updated);
});

export default router;