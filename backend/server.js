import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test this first before importing routes
app.get('/', (_, res) => res.json({ ok: true, message: 'backend alive' }));
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Import routes after basic routes work
import('./routes/ai.routes.js').then(m => {
  app.use('/api/ai', m.default);
  console.log('ai routes loaded');
}).catch(e => console.error('ai routes failed:', e.message));

import('./routes/business.routes.js').then(m => {
  app.use('/api/business', m.default);
  console.log('business routes loaded');
}).catch(e => console.error('business routes failed:', e.message));

import('./routes/booking.routes.js').then(m => {
  app.use('/api/bookings', m.default);
  console.log('booking routes loaded');
}).catch(e => console.error('booking routes failed:', e.message));

import('./routes/slots.routes.js').then(m => {
  app.use('/api/slots', m.default);
  console.log('slots routes loaded');
}).catch(e => console.error('slots routes failed:', e.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});