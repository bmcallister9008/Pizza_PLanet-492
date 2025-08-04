// scripts/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pizza from '../models/Pizza.js';

dotenv.config(); // loads backend/.env if present
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI is required'); process.exit(1); }

const pizzas = [
  { name: 'Margherita', description: 'Tomato, mozzarella, basil', price: 9.99, size: 'M', imageUrl: '' },
  { name: 'Pepperoni', description: 'Pepperoni, mozzarella', price: 12.49, size: 'L', imageUrl: '' },
  { name: 'Veggie', description: 'Bell peppers, onions, olives', price: 11.49, size: 'M', imageUrl: '' }
];

async function run() {
  await mongoose.connect(MONGO_URI);
  await Pizza.deleteMany({});
  await Pizza.insertMany(pizzas);
  console.log(`Inserted ${pizzas.length} pizzas.`);
  await mongoose.disconnect();
}
run().catch(err => { console.error(err); process.exit(1); });
