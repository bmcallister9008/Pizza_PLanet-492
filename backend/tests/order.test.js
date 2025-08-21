// backend/tests/order.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';

describe('POST /api/order', () => {
  it('creates an order with valid payload', async () => {
    // Use any valid ObjectId; existence of the Pizza doc is not enforced by Mongoose refs
    const pizzaId = new mongoose.Types.ObjectId();

    const payload = {
      userId: 'user123',
      items: [{ pizzaId, qty: 2 }],   // matches schema
      total: 19.98,
    };

    const res = await request(app).post('/api/order').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.userId).toBe('user123');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0].qty).toBe(2);
  });

  it('rejects invalid payload', async () => {
    const res = await request(app).post('/api/order').send({
      userId: 'user123',
      items: ['pizza1'],   // invalid shape
      total: 10,
    });
    expect(res.status).toBe(400);
  });
});
