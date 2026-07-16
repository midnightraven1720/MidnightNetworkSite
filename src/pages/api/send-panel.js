import { postToBot } from '../../lib/bot-api.js';
import { BOT_API_HOSTS } from '../../data/bot-hosts.js';
import { requireStaff } from '../../lib/session.js';

export async function POST(context) {
  const { redirect: staffRedirect } = requireStaff(context);
  if (staffRedirect) return staffRedirect;

  const { request, redirect } = context;
  const formData = await request.formData();
  const guildId = formData.get('guildId');
  const panelId = formData.get('panelId');
  const channelId = formData.get('channelId');

  await postToBot(BOT_API_HOSTS['Midnight Tickets'], `/api/panels/${encodeURIComponent(panelId)}/send`, { guildId, channelId });

  return redirect(`/bots?server=${guildId}&view=panelconfigs&bot=${encodeURIComponent('Midnight Tickets')}&panelSaved=true`);
}
