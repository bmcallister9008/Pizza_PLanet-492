// backend/models/Order.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: [itemSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },
  total: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Reuse existing model in test/hot-reload to avoid OverwriteModelError
export default mongoose.models.Order || mongoose.model('Order', orderSchema);
