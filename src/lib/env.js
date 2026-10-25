// Settings come from the host's environment at runtime (Railway variables),
// falling back to .env while developing.
export function env(name) {
  return process.env[name] ?? import.meta.env[name];
}

// The Discord server this site belongs to (Black Rose In Silver).
export const GUILD_ID = env('GUILD_ID') || '1552090900812009643';

export const INVITE_URL = env('INVITE_URL') || '';

export function siteUrl(Astro) {
  return (env('SITE_URL') || Astro.url.origin).replace(/\/$/, '');
}
