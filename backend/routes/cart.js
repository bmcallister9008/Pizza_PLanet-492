// backend/routes/cart.js
import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Pizza from '../models/Pizza.js';

const router = express.Router();

// GET /api/cart/:clientId - fetch cart (with pizza details)
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const cart = await Cart.findOne({ clientId }).populate({
      path: 'items.pizzaId',
      model: Pizza,
      select: '_id name price imageUrl',
    });
    return res.json(cart || { clientId, items: [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/add  { clientId, pizzaId, quantity }
router.post('/add', async (req, res) => {
  try {
    let { clientId, pizzaId, quantity = 1 } = req.body;
    if (!clientId || !pizzaId) {
      return res.status(400).json({ error: 'clientId and pizzaId are required' });
    }
    if (!mongoose.isValidObjectId(pizzaId)) {
      return res.status(400).json({ error: 'Invalid pizzaId' });
    }
    quantity = Math.max(1, Number(quantity) || 1);

    let cart = await Cart.findOne({ clientId });
    if (!cart) {
      cart = await Cart.create({ clientId, items: [{ pizzaId, quantity }] });
      return res.json({ ok: true, cart });
    }

    const idx = cart.items.findIndex(i => String(i.pizzaId) === String(pizzaId));
    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ pizzaId, quantity });
    }
    await cart.save();
    return res.json({ ok: true, cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/set-qty  { clientId, pizzaId, quantity }
router.post('/set-qty', async (req, res) => {
  try {
    const { clientId, pizzaId, quantity } = req.body;
    if (!clientId || !pizzaId || quantity == null) {
      return res.status(400).json({ error: 'clientId, pizzaId, quantity required' });
    }
    if (!mongoose.isValidObjectId(pizzaId)) {
      return res.status(400).json({ error: 'Invalid pizzaId' });
    }

    const cart = await Cart.findOne({ clientId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const idx = cart.items.findIndex(i => String(i.pizzaId) === String(pizzaId));
    if (idx < 0) return res.status(404).json({ error: 'Item not in cart' });

    const qty = Math.max(0, Number(quantity) || 0);
    if (qty === 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = qty;
    }
    await cart.save();
    return res.json({ ok: true, cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/cart/remove  { clientId, pizzaId }
router.post('/remove', async (req, res) => {
  try {
    const { clientId, pizzaId } = req.body;
    if (!clientId || !pizzaId) {
      return res.status(400).json({ error: 'clientId and pizzaId are required' });
    }
    const cart = await Cart.findOneAndUpdate(
      { clientId },
      { $pull: { items: { pizzaId } } },
      { new: true }
    );
    return res.json({ ok: true, cart: cart || { clientId, items: [] } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
