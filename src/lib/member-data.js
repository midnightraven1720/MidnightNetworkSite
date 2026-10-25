// Everything the "My space" and staff pages read, in one place. All member
// queries are scoped to the logged-in member's own id.
import { q, one } from './db.js';
import { GUILD_ID } from './env.js';
import data from '../data/generated/bots.json';

export const STATUS_LABEL = { open: 'Open', ask: 'Ask first', closed: 'Closed' };
export const TOPIC_STATES = [
  { key: 'fine', emoji: '✅', label: 'Fine with' },
  { key: 'ask', emoji: '❓', label: 'Ask first' },
  { key: 'no', emoji: '🚫', label: 'Not for me' },
];

// Same curve as Auction Bot's levels.js.
const xpToNext = (level) => 5 * level * level + 50 * level + 100;
function levelProgress(xp) {
  let level = 0;
  let left = Number(xp) || 0;
  while (left >= xpToNext(level)) {
    left -= xpToNext(level);
    level += 1;
  }
  return { level, into: left, need: xpToNext(level), pct: Math.round((left / xpToNext(level)) * 100) };
}

export async function getLevel(userId) {
  const row = await one('SELECT level_xp, balance FROM auction_users WHERE guild_id = $1 AND user_id = $2', [GUILD_ID, userId]);
  const progress = levelProgress(row?.level_xp || 0);
  const next = await one('SELECT a.name, a.emoji, a.min_level FROM areas a WHERE a.guild_id = $1 AND a.min_level > $2 ORDER BY a.min_level LIMIT 1', [GUILD_ID, progress.level]).catch(() => null);
  return { ...progress, coins: Number(row?.balance || 0), nextArea: next };
}

export async function getProfiles(userId) {
  const rows = await q('SELECT profile_type, answers, channel_id, message_id, updated_at FROM profiles WHERE guild_id = $1 AND user_id = $2 ORDER BY updated_at DESC', [GUILD_ID, userId]);
  return rows.map((p) => {
    const type = data.profileTypes[p.profile_type];
    const answers = p.answers || {};
    return {
      type: p.profile_type,
      label: type?.label || p.profile_type,
      fields: (type?.questions || Object.keys(answers).map((id) => ({ id, label: id }))).filter((qq) => answers[qq.id]).map((qq) => ({ label: qq.label, value: answers[qq.id] })),
      link: p.channel_id && p.message_id ? `https://discord.com/channels/${GUILD_ID}/${p.channel_id}/${p.message_id}` : null,
      updatedAt: p.updated_at,
    };
  });
}

export async function getCard(userId) {
  const [status, card, topics] = await Promise.all([
    one('SELECT status, fr_status FROM dm_status WHERE guild_id = $1 AND user_id = $2', [GUILD_ID, userId]),
    one('SELECT dos, donts, topics, own_topics, channel_id, message_id FROM dm_board_cards WHERE guild_id = $1 AND user_id = $2', [GUILD_ID, userId]),
    q('SELECT id, name FROM dm_board_topics WHERE guild_id = $1 ORDER BY name', [GUILD_ID]),
  ]);
  return {
    dm: status?.status || 'open',
    fr: status?.fr_status || 'open',
    dos: card?.dos || '',
    donts: card?.donts || '',
    picked: card?.topics || {},
    own: card?.own_topics || {},
    topics,
    hasCard: !!card,
    link: card?.channel_id && card?.message_id ? `https://discord.com/channels/${GUILD_ID}/${card.channel_id}/${card.message_id}` : null,
  };
}

export async function saveCard(userId, form) {
  const pick = (v) => (['open', 'ask', 'closed'].includes(v) ? v : 'open');
  const dm = pick(form.get('dm'));
  const fr = pick(form.get('fr'));
  const text = (name) => String(form.get(name) || '').trim().slice(0, 1000);
  const topics = await q('SELECT id FROM dm_board_topics WHERE guild_id = $1', [GUILD_ID]);
  const picked = {};
  for (const t of topics) {
    const v = form.get(`topic_${t.id}`);
    if (['fine', 'ask', 'no'].includes(v)) picked[t.id] = v;
  }
  const own = {};
  for (const s of TOPIC_STATES) {
    const list = text(`own_${s.key}`).split(',').map((x) => x.trim().slice(0, 40)).filter(Boolean).slice(0, 15);
    if (list.length) own[s.key] = list;
  }
  const before = await one('SELECT status FROM dm_status WHERE guild_id = $1 AND user_id = $2', [GUILD_ID, userId]);
  await q(
    `INSERT INTO dm_status (guild_id, user_id, status, fr_status) VALUES ($1, $2, $3, $4)
     ON CONFLICT (guild_id, user_id) DO UPDATE SET status = $3, fr_status = $4, updated_at = now()`,
    [GUILD_ID, userId, dm, fr]
  );
  await q(
    `INSERT INTO dm_board_cards (guild_id, user_id, dos, donts, topics, own_topics) VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
     ON CONFLICT (guild_id, user_id) DO UPDATE SET dos = $3, donts = $4, topics = $5::jsonb, own_topics = $6::jsonb, updated_at = now()`,
    [GUILD_ID, userId, text('dos'), text('donts'), JSON.stringify(picked), JSON.stringify(own)]
  );
  // Profile Bot redraws the card (and profile DM buttons if that changed).
  await q("INSERT INTO setup_jobs (guild_id, bot_name, action, payload) VALUES ($1, 'profile-bot', 'web-card-refresh', $2::jsonb)", [
    GUILD_ID,
    JSON.stringify({ userId, status: (before?.status || 'open') !== dm ? dm : null }),
  ]);
}

export async function getEvents(userId = null) {
  const rows = await q(
    `SELECT e.id, e.title, e.description, e.starts_at, e.ends_at, e.tz, e.location, e.host_name, e.channel_id, e.message_id, e.discord_event_url,
            (SELECT count(*) FROM event_rsvps r WHERE r.event_id = e.id AND r.status = 'going')::int AS going,
            (SELECT status FROM event_rsvps r WHERE r.event_id = e.id AND r.user_id = $2) AS mine
     FROM events e WHERE e.guild_id = $1 AND NOT e.cancelled AND COALESCE(e.ends_at, e.starts_at + interval '3 hours') > now()
     ORDER BY e.starts_at LIMIT 12`,
    [GUILD_ID, userId]
  );
  return rows.map((e) => ({ ...e, link: e.channel_id && e.message_id ? `https://discord.com/channels/${GUILD_ID}/${e.channel_id}/${e.message_id}` : e.discord_event_url }));
}

export async function getReminders(userId) {
  return q('SELECT id, text, remind_at FROM reminders WHERE user_id = $1 AND NOT sent ORDER BY remind_at LIMIT 25', [userId]);
}

export async function deleteReminder(userId, id) {
  await q('DELETE FROM reminders WHERE id = $1 AND user_id = $2 AND NOT sent', [Number(id) || 0, userId]);
}

export async function getTimezone(userId) {
  return (await one('SELECT tz FROM member_timezones WHERE user_id = $1', [userId]))?.tz || null;
}

export async function setTimezone(userId, tz) {
  if (!tz) return q('DELETE FROM member_timezones WHERE user_id = $1', [userId]);
  if (!Intl.supportedValuesOf('timeZone').includes(tz)) return;
  await q(
    `INSERT INTO member_timezones (user_id, tz, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (user_id) DO UPDATE SET tz = $2, next_change_at = NULL, updated_at = now()`,
    [userId, tz]
  );
}

export async function getShelf(userId) {
  return q(
    `SELECT kind, title, creator, cover, status, rating FROM shelf_items WHERE guild_id = $1 AND user_id = $2
     ORDER BY CASE status WHEN 'reading' THEN 0 WHEN 'tbr' THEN 1 ELSE 2 END, updated_at DESC LIMIT 24`,
    [GUILD_ID, userId]
  );
}

// ---------- staff ----------

export async function staffOverview() {
  const count = (sql) => one(sql, [GUILD_ID]).then((r) => r?.n ?? 0).catch(() => 0);
  const [tickets, verifications, applications, members, lastBackup, alt] = await Promise.all([
    count("SELECT count(*)::int AS n FROM tickets WHERE guild_id = $1 AND status = 'open'"),
    count("SELECT count(*)::int AS n FROM verification_tickets WHERE guild_id = $1 AND status = 'open'"),
    count("SELECT count(*)::int AS n FROM staff_applications WHERE guild_id = $1 AND status IN ('pending', 'interview')"),
    count('SELECT count(*)::int AS n FROM auction_users WHERE guild_id = $1'),
    one('SELECT created_at, rows, error FROM lantern_data_backups ORDER BY id DESC LIMIT 1').catch(() => null),
    one('SELECT enabled, channel_id, min_age_days, auto_kick_days FROM alt_config WHERE guild_id = $1', [GUILD_ID]).catch(() => null),
  ]);
  return { tickets, verifications, applications, members, lastBackup, alt };
}

export async function openTickets() {
  return q(
    `SELECT t.opener_id, t.reason, t.claimed_by, t.created_at, t.channel_id, b.label FROM tickets t
     LEFT JOIN ticket_panel_buttons b ON b.id = t.button_id
     WHERE t.guild_id = $1 AND t.status = 'open' ORDER BY t.created_at LIMIT 30`,
    [GUILD_ID]
  ).catch(() => []);
}

export async function openVerifications() {
  return q("SELECT user_id, username, claimed_by, created_at, channel_id FROM verification_tickets WHERE guild_id = $1 AND status = 'open' ORDER BY created_at LIMIT 30", [GUILD_ID]).catch(() => []);
}

export async function pendingApplications() {
  return q("SELECT user_id, status, created_at FROM staff_applications WHERE guild_id = $1 AND status IN ('pending', 'interview') ORDER BY created_at LIMIT 30", [GUILD_ID]).catch(() => []);
}

export function channelLink(channelId) {
  return channelId ? `https://discord.com/channels/${GUILD_ID}/${channelId}` : null;
}
