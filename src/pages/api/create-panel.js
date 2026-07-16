import { postToBot } from '../../lib/bot-api.js';
import { BOT_API_HOSTS } from '../../data/bot-hosts.js';
import { requireStaff } from '../../lib/session.js';

export async function POST(context) {
  const { redirect: staffRedirect } = requireStaff(context);
  if (staffRedirect) return staffRedirect;

  const { request, redirect } = context;
  const formData = await request.formData();
  const guildId = formData.get('guildId');

  await postToBot(BOT_API_HOSTS['Midnight Tickets'], '/api/panels', {
    guildId,
    name: formData.get('name'),
    kind: formData.get('kind') || 'ticket',
    title: formData.get('title') || null,
    description: formData.get('description') || null,
    buttonTypeKeys: formData.getAll('buttonTypeKeys'),
    categoryId: formData.get('categoryId') || null,
    staffRoleIds: formData.getAll('staffRoleIds'),
    logChannelId: formData.get('logChannelId') || null,
    commandName: formData.get('commandName') || null,
    textTrigger: formData.get('textTrigger') || null,
  });

  return redirect(`/bots?server=${guildId}&view=panelconfigs&bot=${encodeURIComponent('Midnight Tickets')}&panelSaved=true`);
}
