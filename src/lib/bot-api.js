export const API_BASE = 'http://midnight-tickets.railway.internal:3001';

export async function fetchFromBot(path, options = {}) {
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'x-api-key': API_KEY, ...(options.headers || {}) },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function postToBot(path, body) {
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;
  try {
    await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(body),
    });
    return true;
  } catch (err) {
    console.error(`Failed to POST ${path}:`, err);
    return false;
  }
}
