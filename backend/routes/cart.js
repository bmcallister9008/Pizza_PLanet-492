// ESM style
import { Router } from 'express';
const router = Router();

// example routes
router.post('/add', async (req, res) => {
  // ...add-to-cart logic
  res.json({ ok: true });
});
router.get('/', async (req, res) => {
  // ...get-cart logic
  res.json({ items: [] });
});

export default router;   // <-- important
