export async function POST({ request, redirect }) {
  const formData = await request.formData();
  const slug = formData.get('slug');
  const summary = formData.get('summary');
  const highlightsRaw = formData.get('highlights') || '';

  const highlights = highlightsRaw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const API_BASE = 'http://midnight-tickets.railway.internal:3001';
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;

  try {
    await fetch(`${API_BASE}/api/update-bot-page-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ slug, summary, highlights }),
    });
  } catch (err) {
    console.error('Failed to save bot page content:', err);
  }

  return redirect(`/bots/${slug}?saved=true`);
}