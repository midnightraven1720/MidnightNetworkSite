// sync-from-bots.cjs
// Copies what the site shows about the bots out of the bot code, so the
// website never drifts from the real commands:
//   - bot names and one-line blurbs (Lantern's catalog)
//   - what each bot does and how, for members (Lantern's guide text)
//   - each bot's member commands with their descriptions (staff ones are
//     counted but not listed)
//   - the Start here topics (Lantern's /help hub)
//
// Run after changing bot commands:  node scripts/sync-from-bots.cjs [path-to-monorepo]
// It writes src/data/generated/bots.json - commit that file.

const fs = require('fs');
const path = require('path');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'midnight-monorepo'));
const req = (p) => require(path.join(repo, p));
process.env.SHOW_STAFF_COMMANDS = '';

const { BOTS } = req('apps/lantern-guide/guide/catalog.js');
const guide = req('apps/lantern-guide/guide/content.js');
const { TOPICS } = req('apps/lantern-guide/guide/startHere.js');
const { staffAccess } = require(require.resolve('@midnight/shared', { paths: [path.join(repo, 'apps/lantern-guide')] }));

// Discord markdown -> the little the site renders: **bold** and `code`.
const clean = (s) => (s || '').replace(/<#\d+>|<@&?\d+>/g, '').trim();

function commandsOf(folder) {
  const dir = path.join(repo, 'apps', folder, 'commands');
  if (!fs.existsSync(dir)) return [];
  const list = [];
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    const cmd = require(path.join(dir, f));
    if (cmd?.data?.toJSON) list.push(cmd.data.toJSON());
  }
  staffAccess.hideStaffCommands(folder, list);
  return list;
}

function memberLines(json) {
  const subs = (json.options || []).filter((o) => o.type === 1 || o.type === 2);
  if (!subs.length) return [{ name: `/${json.name}`, description: json.description }];
  return subs.flatMap((s) =>
    s.type === 2
      ? (s.options || []).map((x) => ({ name: `/${json.name} ${s.name} ${x.name}`, description: x.description }))
      : [{ name: `/${json.name} ${s.name}`, description: s.description }]
  );
}

const bots = BOTS.map((b) => {
  const all = commandsOf(b.folder);
  const member = all.filter((j) => !j.default_member_permissions && j.type !== 2 && j.type !== 3);
  return {
    key: b.folder,
    name: b.name,
    blurb: b.blurb,
    what: clean(guide[b.folder]?.member?.what),
    how: (guide[b.folder]?.member?.how || []).map(clean),
    commands: member.flatMap(memberLines).sort((x, y) => x.name.localeCompare(y.name)),
    staffCommandCount: all.length - member.length,
    totalCommands: all.length,
  };
});

const topics = TOPICS.map((t) => ({ key: t.key, emoji: t.emoji, label: t.label, intro: t.intro, items: t.items.map(([a, b]) => ({ what: a, how: clean(b) })) }));

// Profile types and their questions, to show saved answers (stored by id).
const { PROFILE_TYPES } = req('apps/profile-bot/profiles/questions.js');
const profileTypes = Object.fromEntries(Object.entries(PROFILE_TYPES).map(([key, t]) => [key, { label: t.label, questions: t.questions.map((q) => ({ id: q.id, label: q.label })) }]));

const out = { syncedAt: new Date().toISOString(), bots, topics, profileTypes };
const file = path.join(__dirname, '..', 'src', 'data', 'generated', 'bots.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), file)}: ${bots.length} bots, ${bots.reduce((n, b) => n + b.totalCommands, 0)} commands, ${topics.length} topics`);
process.exit(0);
