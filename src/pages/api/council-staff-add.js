import { postToBot } from '../../lib/bot-api.js';
import { BOT_API_HOSTS } from '../../data/bot-hosts.js';
import { getUser } from '../../lib/session.js';

export async function POST({ request, redirect, cookies }) {
  const user = getUser({ cookies });
  const formData = await request.formData();

  const guildIdRaw = formData.get('guildId');
  const scope = formData.get('scope');

  await postToBot(BOT_API_HOSTS['Midnight Council'], '/api/staff', {
    actingUserId: user?.id,
    userId: formData.get('userId'),
    scope,
    guildId: scope === 'server' ? guildIdRaw : null,
    rank: formData.get('rank'),
    helperType: formData.get('helperType') || null,
  });

  const councilServer = guildIdRaw || 'all';
  return redirect(`/bots?view=modules&bot=${encodeURIComponent('Midnight Council')}&councilServer=${encodeURIComponent(councilServer)}&councilSaved=true`);
}
