// frontend/src/cart.js

async function addToCart(pizzaId, quantity = 1) {
  const clientId = localStorage.getItem('clientId') || 'demo-user';
  localStorage.setItem('clientId', clientId);

  const res = await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, pizzaId, quantity })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add to cart');
  return data;
}

// One listener for all "Add to cart" buttons
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  e.preventDefault();
  const pizzaId = btn.dataset.id;
  if (!pizzaId) return alert('Missing pizza id on button');

  try {
    await addToCart(pizzaId, 1);
    alert('Pizza added to cart!');
  } catch (err) {
    console.error(err);
    alert('Failed to add to cart');
  }
});
