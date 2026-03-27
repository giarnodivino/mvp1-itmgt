const API_BASE = "http://127.0.0.1:8000/api";

export async function getWatches() {
  const response = await fetch(`${API_BASE}/watches/`);
  return response.json();
}

export async function getWatchById(id) {
  const response = await fetch(`${API_BASE}/watches/${id}/`);
  return response.json();
}

export async function getCart() {
  const response = await fetch(`${API_BASE}/cart/`);
  return response.json();
}

export async function addToCart(watchId) {
  const response = await fetch(`${API_BASE}/cart/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ watch_id: watchId, quantity: 1 }),
  });
  return response.json();
}

export async function createOrder(payload) {
  const response = await fetch(`${API_BASE}/orders/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function getOrderById(id) {
  const response = await fetch(`${API_BASE}/orders/${id}/`);
  return response.json();
}