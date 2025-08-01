// models/Pizza.js

import mongoose from 'mongoose';
const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  size: String,
  imageUrl: String,
});
export default mongoose.model('Pizza', pizzaSchema);
