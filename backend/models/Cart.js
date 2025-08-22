// backend/models/Cart.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

// Use existing model if already compiled (prevents OverwriteModelError in dev)
export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
