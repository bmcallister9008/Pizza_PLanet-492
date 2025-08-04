async function loadMenu() {
  const el = document.getElementById('menu');
  try {
    const res = await fetch('/api/pizzas');
    if (!res.ok) throw new Error('Failed to fetch menu');
    const data = await res.json();
    el.innerHTML = data.map(p => `<div><h3>${p.name}</h3><p>${p.description}</p><strong>$${p.price}</strong></div>`).join('');
  } catch (e) {
    el.textContent = 'Could not load menu. Is the API running?';
  }
}
document.addEventListener('DOMContentLoaded', loadMenu);
