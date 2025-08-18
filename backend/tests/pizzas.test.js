import request from 'supertest';
import Pizza from '../models/Pizza.js';
import { app } from '../server.js';
import { setupDB, cleanupDB, teardownDB } from './setup.js';

beforeAll(setupDB);
afterEach(cleanupDB);
afterAll(teardownDB);

describe('GET /api/pizzas', () => {
  it('returns pizzas from the database', async () => {
    await Pizza.create({ name: 'Margherita', price: 10.99, size: 'L' });

    const res = await request(app).get('/api/pizzas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Margherita');
    expect(res.body[0].price).toBe(10.99);
  });

  it('handles empty result set', async () => {
    const res = await request(app).get('/api/pizzas');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
