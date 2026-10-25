// Words and colours for the public pages. Bot names, commands and the Start
// here topics come from generated/bots.json (scripts/sync-from-bots.cjs).

export const AREAS = [
  { name: 'Books', emoji: '📚', color: 'var(--amber)', text: 'Talk books, share what you are reading, keep a shelf with /book, and post reviews - spoilers go in their own channel.' },
  { name: 'Gaming', emoji: '🎮', color: 'var(--blue)', text: 'Find people to play with, share clips, and join game nights.' },
  { name: 'Streamers', emoji: '📺', color: 'var(--purple)', text: 'For streamers and the people who watch them: go-live posts, schedules and support.' },
  { name: 'Roleplay', emoji: '🎭', color: 'var(--green)', text: 'Scenes, characters and partners - with clear consent tools built in.' },
  { name: 'NSFW (18+)', emoji: '🔞', color: 'var(--rose)', text: 'The adult side of the server, for verified members who choose to opt in.' },
];

// One colour per bot, in catalog order.
export const BOT_COLORS = {
  'community-bot': 'var(--gold)',
  'profile-bot': 'var(--rose)',
  'dynamic-bot': 'var(--purple)',
  'auction-bot': 'var(--amber)',
  'ticket-bot': 'var(--green)',
  'voice-bot': 'var(--blue)',
  'velvet-bot': 'var(--rose)',
  'partnership-bot': 'var(--amber)',
  'staff-bot': 'var(--blue)',
  'log-bot': 'var(--green)',
  'lantern-guide': 'var(--gold)',
};

export const BOT_EMOJI = {
  'community-bot': '🎲',
  'profile-bot': '👤',
  'dynamic-bot': '🔗',
  'auction-bot': '📈',
  'ticket-bot': '🎫',
  'voice-bot': '🎙️',
  'velvet-bot': '💋',
  'partnership-bot': '🤝',
  'staff-bot': '🛡️',
  'log-bot': '📜',
  'lantern-guide': '🏮',
};

export const TOPIC_COLORS = ['var(--gold)', 'var(--green)', 'var(--blue)', 'var(--rose)', 'var(--amber)', 'var(--purple)', 'var(--rose)', 'var(--green)', 'var(--purple)', 'var(--blue)'];

export const FAQ = [
  { q: 'Do I need to learn commands?', a: 'No. Most things have buttons in the channels. When you do want a command, type <code>/</code> in any chat and Discord shows a list - pick one and fill in the boxes.' },
  { q: 'Why can\'t I see many channels yet?', a: 'New members verify first, then more opens up as you chat and level up. Areas like Books or Gaming are opt-in: pick them on the areas panel.' },
  { q: 'Is this server really 18+?', a: 'Yes. Everyone here must be an adult. Some areas also need ID verification, done privately with staff through a ticket.' },
  { q: 'What does this website see about me?', a: 'Only your Discord name, picture and your roles in our server - so it knows you are a member. It can\'t read your messages or DMs.' },
  { q: 'How do I get help?', a: 'Press <strong>Open a ticket</strong> in the support channel, or use <code>/help</code> in any chat for the Start here menu.' },
];
