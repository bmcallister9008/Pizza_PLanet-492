// backend/server.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import Pizza from './models/Pizza.js'
import Order from './models/Order.js'
import authRoutes from './routes/auth.js'
import payRoutes from './routes/pay.js'
import { MONGO_URI, PORT as ENV_PORT } from './config/env.js'
import cartRoutes from './routes/cart.js'

export const app = express()
const PORT = ENV_PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Global middleware
app.use(cors())
app.use(express.json())

// API routes
app.use('/api', authRoutes)
app.use('/api/pay', payRoutes)
app.use('/api/cart', cartRoutes)

// Static (optional)
app.use(express.static(path.join(__dirname, '../frontend/src/pages')))
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'))
)

// Healthcheck
app.get('/api/health', (_, res) => res.json({ ok: true }))

// Pizzas
app.get('/api/pizzas', async (_, res) => {
  try {
    const pizzas = await Pizza.find().lean()
    res.json(pizzas)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pizzas' })
  }
})

// Orders (with deep validation + proper error mapping)
app.post('/api/order', async (req, res) => {
  const { userId, items, total } = req.body ?? {}

  // Shallow validation
  if (typeof userId !== 'string' || !Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  // Deep validation for items: [{ pizzaId: ObjectId, qty: positive int }]
  const validItems =
    items.length > 0 &&
    items.every(
      (it) =>
        it &&
        mongoose.isValidObjectId(it.pizzaId) &&
        Number.isInteger(it.qty) &&
        it.qty > 0
    )

  if (!validItems || total < 0) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  try {
    const order = await Order.create({ userId, items, total })
    return res.status(201).json(order)
  } catch (err) {
    // Map common Mongoose validation/cast errors to 400 instead of 500
    if (err?.name === 'ValidationError' || err?.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid payload' })
    }
    console.error('Order create error:', err)
    return res.status(500).json({ error: 'Failed to create order' })
  }
})

export async function start() {
  try {
    // In tests, Vitest + MongoMemoryServer own the DB & we don't listen on a port
    if (process.env.NODE_ENV === 'test') return app

    if (!MONGO_URI) {
      console.warn('Missing MONGO_URI. API will start, but DB ops will fail.')
    } else if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGO_URI)
      console.log('MongoDB connected')
    }

    const server = app.listen(PORT, () => console.log(`Server running on :${PORT}`))
    return server
  } catch (err) {
    console.error('Startup error', err)
    // Do not hard-exit here; let the caller decide
    process.exitCode = 1
    throw err
  }
}

// Auto-start only outside of tests
if (process.env.NODE_ENV !== 'test') {
  start()
}
