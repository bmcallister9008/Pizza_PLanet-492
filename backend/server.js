// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import Pizza from './models/Pizza.js';
import Order from './models/Order.js';
import authRoutes from './routes/auth.js';
import payRoutes from './routes/pay.js';
import { MONGO_URI, PORT as ENV_PORT } from './config/env.js';

const app = express();
const PORT = ENV_PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', authRoutes);
app.use('/api/pay', payRoutes);

// Static (optional)
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'))
);

// Healthcheck
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Pizzas
app.get('/api/pizzas', async (_, res) => {
  try {
    const pizzas = await Pizza.find().lean();
    res.json(pizzas);
  } catch {
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
});

// Orders
app.post('/api/order', async (req, res) => {
  try {
    const { userId, items, total } = req.body || {};
    if (!userId || !Array.isArray(items) || typeof total !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const order = await Order.create({ userId, items, total });
    res.status(201).json(order);
  } catch {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('Missing MONGO_URI. API will start, but DB ops will fail.');
    } else {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected');
    }
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
}

start();
