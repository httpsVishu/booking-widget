import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';
import businessRoutes from './routes/business.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import slotsRoutes from './routes/slots.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/slots', slotsRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});