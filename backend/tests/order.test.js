import request from 'supertest';
import { app } from '../server.js';
import { setupDB, cleanupDB, teardownDB } from './setup.js';

beforeAll(setupDB);
afterEach(cleanupDB);
afterAll(teardownDB);

describe('POST /api/order', () => {
  it('creates an order with valid payload', async () => {
    const payload = {
      userId: 'user123',
      items: [{ pizzaId: 'p1', qty: 2, price: 10.99 }],
      total: 21.98,
    };

    const res = await request(app).post('/api/order').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.userId).toBe('user123');
    expect(res.body.total).toBe(21.98);
  });

  it('rejects invalid payload', async () => {
    const res = await request(app).post('/api/order').send({ foo: 'bar' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid payload' });
  });
});
