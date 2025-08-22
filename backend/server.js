// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { MONGO_URI, PORT as ENV_PORT, NODE_ENV, CORS_ORIGIN } from './config/env.js';

// (Optional) keep if you already use auth:
import authRoutes from './routes/auth.js';

// Our no-Stripe cart/order flow:
import cartRoutes from './routes/cart.js';
//import orderRoutes from './routes/orders.js';

// If you serve pizzas from DB:
import Pizza from './models/Pizza.js';

export const app = express();
const PORT = Number(ENV_PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------- Core middleware ------------------------- */
app.use(cookieParser());
app.use(express.json());

// CORS (credentials so cookie "clientId" works in browser)
const origins = CORS_ORIGIN
  ? CORS_ORIGIN.split(',').map(s => s.trim())
  : true; // reflect request origin in dev
app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

/* --------------------------- Healthcheck --------------------------- */
app.get('/api/health', (_, res) => res.json({ ok: true, env: NODE_ENV || 'development' }));

/* ----------------------------- Routes ------------------------------ */
// Optional auth (safe to remove if not used)
if (authRoutes) app.use('/api', authRoutes);

// Cart + Orders (no Stripe)
app.use('/api/cart', cartRoutes);
//app.use('/api/orders', orderRoutes);

// Pizzas list (for menu UI)
app.get('/api/pizzas', async (_, res) => {
  try {
    const pizzas = await Pizza.find().lean();
    res.json(pizzas);
  } catch (err) {
    console.error('Fetch pizzas error:', err);
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
});

/* ----------------------- Static frontend (opt) --------------------- */
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'))
);

/* ----------------------------- Startup ----------------------------- */
export async function start() {
  try {
    // In tests, return app without listening (Vitest/Supertest pattern)
    if (process.env.NODE_ENV === 'test') return app;

    if (!MONGO_URI) {
      console.warn('Missing MONGO_URI. API will start, but DB ops will fail.');
    } else if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected');
    }

    const server = app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
    return server;
  } catch (err) {
    console.error('Startup error', err);
    process.exitCode = 1;
    throw err;
  }
}

// Auto-start only outside tests
if (process.env.NODE_ENV !== 'test') {
  start();
}
