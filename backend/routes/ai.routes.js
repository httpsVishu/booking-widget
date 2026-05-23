import { Router } from 'express';
import { extractSchema } from '../services/openaiExtract.js';
import { readStore, writeStore } from '../services/jsonStore.js';

const router = Router();

router.get('/presets', (req, res) => {
  const presets = readStore('presets');
  res.json(presets);
});

router.post('/extract', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'prompt is required' });

    const schema = await extractSchema(prompt);

    // Auto-save as current business
    writeStore('business', schema);

    res.json(schema);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;