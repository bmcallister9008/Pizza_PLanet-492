import api from './api';

// Cart helpers for UI
export async function fetchCart() {
  const { data } = await api.get('/api/cart');
  return data;
}

export async function addToCart(pizzaId, quantity = 1) {
  const { data } = await api.post('/api/cart/add', { pizzaId, quantity });
  return data;
}

export async function updateItem(pizzaId, quantity) {
  const { data } = await api.patch('/api/cart/item', { pizzaId, quantity });
  return data;
}

export async function removeItem(pizzaId) {
  const { data } = await api.delete(`/api/cart/item/${pizzaId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.delete('/api/cart');
  return data;
}

export async function placeOrder(user = {}) {
  const { data } = await api.post('/api/orders', { user });
  return data; // { message, order }
}
