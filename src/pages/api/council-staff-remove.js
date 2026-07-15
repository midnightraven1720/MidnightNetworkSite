import { deleteFromBot } from '../../lib/bot-api.js';
import { BOT_API_HOSTS } from '../../data/bot-hosts.js';
import { getUser } from '../../lib/session.js';

export async function POST({ request, redirect, cookies }) {
  const user = getUser({ cookies });
  const formData = await request.formData();

  const scope = formData.get('scope');
  const guildId = formData.get('guildId') || null;

  await deleteFromBot(BOT_API_HOSTS['Midnight Council'], '/api/staff', {
    actingUserId: user?.id,
    userId: formData.get('userId'),
    scope,
    guildId,
  });

  const councilServer = guildId || 'all';
  return redirect(`/bots?view=modules&bot=${encodeURIComponent('Midnight Council')}&councilServer=${encodeURIComponent(councilServer)}&councilSaved=true`);
}
