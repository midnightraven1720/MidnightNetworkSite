// The bots' shared Postgres. The site reads members' own data from it and
// writes only what a member edits about themselves (their DM card, time zone,
// reminders), then asks the bot to redraw anything shown in Discord.
import pg from 'pg';
import { env } from './env.js';

let pool = null;

function getPool() {
  if (!pool) {
    const connectionString = env('DATABASE_URL');
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    pool = new pg.Pool({ connectionString, max: 5, ssl: env('PGSSL') === '1' ? { rejectUnauthorized: false } : undefined });
  }
  return pool;
}

export async function q(text, params = []) {
  const { rows } = await getPool().query(text, params);
  return rows;
}

export async function one(text, params = []) {
  return (await q(text, params))[0] || null;
}

export function hasDatabase() {
  return !!env('DATABASE_URL');
}
