# MidnightNetworkSite — site map (restart alignment pass)

Full inventory of what exists today, mapped against the new 9-bot roster from
[MidnightBots/SLASH-COMMANDS.md](../../Dev/MidnightBots/SLASH-COMMANDS.md) and
[[project_bot_architecture_v2]]. Planning doc — nothing here is built yet, this just maps
current state → target state before the generic bot-connection pass begins.

---

## Public / marketing pages

| Page | Status | Notes |
|---|---|---|
| `/` (index) | Fine as-is | Home, "What is Midnight Network," featured servers, CTA |
| `/about-us` | Fine as-is | Network-level about + staff department overview |
| `/servers` + `/servers/[slug]` | Fine as-is | Not bot-related — Midnight's own Discord server directory |
| `/terms-of-use`, `/privacy-policy` | Fine as-is | Static legal pages |
| `/partnerships` | **Done** | Rewritten to describe the Midnight-Alliance `/partner-apply` flow instead of the old Tickets-bot copy, and restyled to the night-sky system. |

---

## Auth

| Page | Status | Notes |
|---|---|---|
| `/login`, `/logout`, `/auth/callback` | Fine as-is | Discord OAuth flow |
| `/account` | Fine as-is | Account settings |

---

## Member dashboard (`Sidebar.astro` + `/user-dashboard` + `/dashboard/*`)

`Sidebar.astro` is the real nav for this section, split into "MY ACTIVITY" and "BOT PROFILE."
`/user-dashboard` itself is mostly **static placeholder cards** right now — several say
"Coming soon" and one ("Active Tickets: 1 open ticket") is hardcoded fake data, not live. The
stray SAFEWORD button just does `alert(...)`, not a real Collar call.

| Page | Old label | New bot | Status |
|---|---|---|---|
| `/user-dashboard` | Overview | *(hub)* | Static placeholder cards — needs to pull real data once bots are live, and the SAFEWORD button needs to actually call Collar's `/safeword` |
| `/dashboard/tickets` | Tickets & Support | **Midnight-Gate** | Placeholder |
| `/dashboard/applications` | Staff Applications | **Midnight-Gate** | Placeholder — "Coming soon" |
| `/dashboard/status` | RP Scenes & Turns | **Midnight Roleplay** | Placeholder |
| `/dashboard/events` | Upcoming Events | **Midnight-Network** | Placeholder |
| `/dashboard/edit` | Manage Profiles | **Midnight-Community** | Placeholder |
| `/dashboard/bonds` | Relationships & Bonds | **Midnight-Community** | Placeholder |
| `/dashboard/consent` | Consent Settings | **Midnight-Community** | Placeholder |
| `/dashboard/wallet` | Wallet | **Midnight-Ascend** | Placeholder |

**Gaps — no page exists yet for:**
- **Midnight-Collar** — no member-facing page at all (safeword history, active gag/bind/leash status, consent settings). The fake SAFEWORD button on `/user-dashboard` is the only trace of Collar anywhere on the site.
- **Confessions** (new Community feature) — no page.
- **Ascend beyond currency** — Wallet exists, but no rank/level/leaderboard/shop page.
- **Council, member-facing** — `/user-dashboard`'s "Warnings" card is a placeholder; no dedicated page for a member to view their own warning history.

---

## Staff dashboard (`/staff-dashboard` + `components/staff/*`)

Per-guild staff view with a server picker sidebar. Currently three panels:

| Panel | New bot | Status |
|---|---|---|
| `TicketsPanel` | **Midnight-Gate** | Live-wired (via Tickets' old API — needs repointing to Gate once built) |
| `ApplicationsPanel` | **Midnight-Gate** | Live-wired |
| `ServerRolesPanel` | *(general server config, not one specific bot)* | Live-wired |

**Gaps:** no staff panel yet for Council's moderation/case tools (beyond what's in the separate
`bots/index.astro` "Modules" tab), Alliance's partner directory/review, Ascend's shop/level-role
config, Collar's channel-enable/limits config, or Roleplay's scene/character oversight.

---

## Bot management hub (`/bots`)

**Done (2026-08-03).** `bots.js` rewritten to the real 9-bot roster with commands grouped
into categories (sourced from `SLASH-COMMANDS.md`), all statuses set to `Planned` (nothing's
deployed since the restart). `bot-hosts.js` emptied out. Commands view rebuilt Dyno.gg-style:
bot tabs → category pills → toggle-switch command cards (toggles are visual-only until a
bot's dashboard API exists — not wired to anything real). `ModulesView`'s old
`TicketConfigForm`/`CouncilStaffPanel` special-casing removed in favor of one generic "not
connected yet" state per bot. Whole shell restyled to the night-sky tokens.

---

## Nightshade — explicitly NOT part of this site

Per `FUTURE-BOTS.md`, Nightshade's listings live on a **separate** site ("Nightshade Portal"),
which links back to this one rather than being a section within it. Not in scope for this
site's map — flagging here only so it doesn't get accidentally folded in later.

---

## Open items

- Confirm whether `/dashboard/*` pages should be genuinely rebuilt now (real data, real bot
  API calls) as part of "website first," or whether the priority is just getting `bots.js` +
  `/bots` generic first and leaving the member-dashboard placeholders for a later pass.
- Missing pages listed above (Collar, Confessions, Ascend rank/shop, member-facing Council
  warnings, staff-side Alliance/Roleplay/Collar/Ascend panels) need to be scoped — full pages,
  or folded into existing ones?
- `partnerships.astro`'s rewrite depends on Alliance's exact apply-flow wording being finalized
  (it's still a synthesized proposal per `SLASH-COMMANDS.md`'s own open items).
