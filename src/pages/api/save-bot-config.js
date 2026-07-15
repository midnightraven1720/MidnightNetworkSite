export async function POST({ request, redirect }) {
  const formData = await request.formData();
  const guildId = formData.get('guildId');

  const roleUpdates = {
    ticketStaff: formData.get('role_ticketStaff') || null,
    owner: formData.get('role_owner') || null,
    coOwner: formData.get('role_coOwner') || null,
    partnershipManager: formData.get('role_partnershipManager') || null,
    idVerifiedStaff: formData.get('role_idVerifiedStaff') || null,
  };

  const categoryUpdates = {
    support: formData.get('category_support') || null,
    staffReport: formData.get('category_staffReport') || null,
    verification: formData.get('category_verification') || null,
  };

  const API_BASE = 'http://midnight-tickets.railway.internal:3001';
  const API_KEY = import.meta.env.DASHBOARD_API_KEY;

  try {
    await fetch(`${API_BASE}/api/update-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ guildId, roleUpdates, categoryUpdates }),
    });
  } catch (err) {
    console.error('Failed to save bot config:', err);
  }

  return redirect(`/bots?server=${guildId}&saved=true&view=modules&bot=${encodeURIComponent('Midnight Tickets')}`);
}