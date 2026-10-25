# Black Rose In Silver - website

The server's website: a welcome page, a Start here guide, the bots and their
member commands, **My space** for members, and a **Staff** desk.

| Page | Who | What |
| --- | --- | --- |
| `/` | everyone | Welcome, first ten minutes, areas, upcoming events, the bots |
| `/start` | everyone | The Start here topics (same as `/help` in Discord) and a FAQ |
| `/bots` | everyone | Each bot in plain words, plus its member commands |
| `/me` | members | Level, setup checklist, DM card (editable), profiles, events, reminders, bookshelf, time zone |
| `/staff` | staff | Open tickets, verifications, applications, alt check and backup status |

It reads the bots' shared Postgres directly. When a member saves their DM card,
the site queues a `web-card-refresh` job and Profile Bot redraws the card in
Discord within a few seconds.

## Settings (Railway variables)

| Variable | What |
| --- | --- |
| `DATABASE_URL` | The bots' Postgres. On Railway use a reference: `${{Postgres.DATABASE_URL}}` |
| `SESSION_SECRET` | Any random text, 32+ characters. Signs the login cookie |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | From the Discord app used for "Log in with Discord" (OAuth2 page) |
| `SITE_URL` | The site's address, e.g. `https://blackrose.up.railway.app` |
| `OWNER_IDS` | Your Discord user id(s), comma separated - always count as staff |
| `INVITE_URL` | Optional: a server invite link for the Join buttons |
| `GUILD_ID` | Optional: defaults to Black Rose In Silver |

In the Discord developer portal, add `SITE_URL` + `/auth/callback` as an OAuth2
redirect. Login asks only for `identify` and `guilds.members.read`.

Staff = `OWNER_IDS`, or anyone with a staff role Council Bot knows
(`/staff-setup`, the staff level roles).

## When bot commands change

```sh
node scripts/sync-from-bots.cjs ../midnight-monorepo
```

This rewrites `src/data/generated/bots.json` (bot blurbs, guide text, member
commands, Start here topics, profile questions). Commit it.

## Develop

```sh
npm install
npm run dev      # needs the variables above in .env
npm run build && node dist/server/entry.mjs
```
