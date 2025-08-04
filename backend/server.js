import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Pizza from './models/Pizza.js';
import Order from './models/Order.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend pages from same origin
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'))
);

// Healthcheck
app.get('/api/health', (_, res) => res.json({ ok: true }));

// GET /api/pizzas
app.get('/api/pizzas', async (_, res) => {
  try {
    const pizzas = await Pizza.find().lean();
    res.json(pizzas);
  } catch {
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
});

// POST /api/order
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
      console.warn('Missing MONGO_URI (set it in .env or GitHub Secret). API will still start, but DB ops will fail.');
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
