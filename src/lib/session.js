// Login sessions. The cookie holds who you are (from Discord at login) and is
// signed with SESSION_SECRET, so it can't be edited to claim another account
// or staff access. Sessions last 12 hours; logging in again refreshes your
// roles.
import crypto from 'node:crypto';
import { env, GUILD_ID } from './env.js';
import { one } from './db.js';

const COOKIE = 'bris_session';
const HOURS = 12;

function secret() {
  const s = env('SESSION_SECRET');
  return s && s.length >= 32 ? s : null;
}

function sign(body, key) {
  return crypto.createHmac('sha256', key).update(body).digest('base64url');
}

export function setSession(Astro, user) {
  const key = secret();
  if (!key) throw new Error('SESSION_SECRET is not set (it needs 32+ characters)');
  const body = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + HOURS * 3600 * 1000 })).toString('base64url');
  Astro.cookies.set(COOKIE, `${body}.${sign(body, key)}`, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: HOURS * 3600,
  });
}

export function clearSession(Astro) {
  Astro.cookies.delete(COOKIE, { path: '/' });
}

export function getUser(Astro) {
  const key = secret();
  const raw = Astro.cookies.get(COOKIE)?.value;
  if (!key || !raw) return null;
  const [body, sig] = raw.split('.');
  if (!body || !sig) return null;
  const good = sign(body, key);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  try {
    const user = JSON.parse(Buffer.from(body, 'base64url').toString());
    return user.exp > Date.now() ? user : null;
  } catch {
    return null;
  }
}

export function avatarUrl(user, size = 128) {
  if (!user?.avatar) return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(user?.id || 0) >> 22n) % 6}.png`;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=${size}`;
}

// Staff = the server owner(s) in OWNER_IDS, or anyone with a role Council
// Bot knows as staff (/staff-setup and the staff level roles). Checked
// against the current settings on every staff page, not just at login.
export async function isStaff(user) {
  if (!user?.inServer) return false;
  const owners = (env('OWNER_IDS') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (owners.includes(user.id)) return true;
  const row = await one(
    'SELECT staff_role_ids, staff_board_role_ids, senior_role_id, junior_role_id, newbie_role_id FROM staff_config WHERE guild_id = $1',
    [GUILD_ID]
  ).catch(() => null);
  if (!row) return false;
  const staff = new Set([...(row.staff_role_ids || []), ...(row.staff_board_role_ids || []), row.senior_role_id, row.junior_role_id, row.newbie_role_id].filter(Boolean));
  return (user.roles || []).some((r) => staff.has(r));
}

// Where to send someone who isn't logged in, so they come back here after.
export function loginUrl(Astro) {
  return `/login?next=${encodeURIComponent(Astro.url.pathname + Astro.url.search)}`;
}
