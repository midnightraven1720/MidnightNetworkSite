// Internal Railway hostnames for each bot's dashboard API, keyed by the bot `id`
// from bots.js (e.g. 'gate', 'council', 'collar'...). Only bots that are actually
// deployed and expose this API belong here — add an entry once a bot from the
// restart roster (see SLASH-COMMANDS.md) redeploys to Railway.
//
// Empty right now: every bot's old Railway service was deleted to restart the
// bot-coding side from scratch (see project memory), so nothing is live yet.
export const BOT_API_HOSTS = {};
