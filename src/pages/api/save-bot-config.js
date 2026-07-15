import { postToBot } from '../../lib/bot-api.js';

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

  await postToBot('/api/update-config', { guildId, roleUpdates, categoryUpdates });

  return redirect(`/bots?server=${guildId}&saved=true&view=modules&bot=${encodeURIComponent('Midnight Tickets')}`);
}