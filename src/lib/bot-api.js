export async function fetchFromBot(baseUrl, path, options = {}) {
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { 'x-api-key': API_KEY, ...(options.headers || {}) },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function postToBot(baseUrl, path, body) {
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(body),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(`Failed to POST ${path}:`, err);
    return null;
  }
}

export async function deleteFromBot(baseUrl, path, body) {
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(body),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(`Failed to DELETE ${path}:`, err);
    return null;
  }
}
