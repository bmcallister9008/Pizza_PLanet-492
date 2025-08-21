// backend/models/Pizza.js
import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  size: { type: String, enum: ['S', 'M', 'L', 'XL'], default: 'M' },
  imageUrl: String,
}, { timestamps: true });

// Reuse existing model in test/hot-reload to avoid OverwriteModelError
export default mongoose.models.Pizza || mongoose.model('Pizza', pizzaSchema);
