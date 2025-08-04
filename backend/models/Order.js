// models/Order.js
import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
  pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
  qty: { type: Number, required: true, min: 1 }
});
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: [itemSchema], required: true },
  total: { type: Number, required: true, min: 0 }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
