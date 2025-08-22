// backend/models/Cart.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: true,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true, unique: true },
    items: { type: [ItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'carts' }
);

CartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
