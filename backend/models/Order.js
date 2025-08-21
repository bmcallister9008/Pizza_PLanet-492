// backend/models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
    name:    { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity:  { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    // cart/user identity (we use clientId cookie in this flow)
    clientId: { type: String, required: true, index: true },

    // optional user info (if/when you add auth)
    user: {
      email: { type: String },
      name:  { type: String },
    },

    // normalized, server-validated items
    items: { type: [OrderItemSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },

    // money fields (no Stripe yet)
    subtotal:   { type: Number, required: true, min: 0 },
    tax:        { type: Number, required: true, min: 0, default: 0 },
    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'canceled', 'fulfilled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Reuse existing model in dev/hot-reload to avoid OverwriteModelError
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
