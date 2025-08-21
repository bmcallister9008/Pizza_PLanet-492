import { useEffect, useState } from 'react';
import { fetchCart, updateItem, removeItem, placeOrder } from '../lib/cartApi';

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => setCart(await fetchCart()))();
  }, []);

  const subtotal = cart?.items?.reduce((s, it) => s + it.price * it.quantity, 0) || 0;

  const handleQty = async (pizzaId, qty) => {
    const next = await updateItem(pizzaId, Number(qty));
    setCart(next);
  };

  const handleRemove = async (pizzaId) => {
    const next = await removeItem(pizzaId);
    setCart(next);
  };

  const handlePlaceOrder = async () => {
    try {
      setStatus('Placing order…');
      const data = await placeOrder({ email: 'guest@example.com' });
      setStatus(`Order created! #${data.order._id}`);
      setCart(data.order ? { items: [] } : cart); // optimistic clear
    } catch (e) {
      setStatus(e?.response?.data?.error || e.message);
    }
  };

  if (!cart) return <p>Loading cart…</p>;

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: 16 }}>
      <h2>Checkout</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.items.map((it) => (
              <li key={it.pizzaId} style={{ marginBottom: 12 }}>
                <b>{it.name}</b> — ${it.price.toFixed(2)} ×{' '}
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => handleQty(it.pizzaId, e.target.value)}
                  style={{ width: 64 }}
                />
                {'  '}
                <button onClick={() => handleRemove(it.pizzaId)}>Remove</button>
              </li>
            ))}
          </ul>
          <p><b>Subtotal:</b> ${subtotal.toFixed(2)}</p>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </>
      )}
      <p style={{ marginTop: 12 }}>{status}</p>
    </div>
  );
}
