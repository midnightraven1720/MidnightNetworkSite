// Canonical bot roster for the MidnightBots restart (9 bots, decided in planning —
// see c:\Dev\MidnightBots\SLASH-COMMANDS.md for the full command-by-command source).
// Every bot is currently unbuilt/undeployed (Railway services were deleted to restart
// from scratch), so every status is 'Planned' until one actually redeploys — see
// bot-hosts.js, which is empty until that happens.
//
// commands are grouped into `categories` (matching SLASH-COMMANDS.md's own groupings)
// so the Commands dashboard can show bot -> category -> command, each with an
// enable/disable toggle once that bot's dashboard API exists to back it.

export const botData = [
  {
    id: 'gate',
    name: 'Midnight-Gate',
    status: 'Planned',
    tagline: 'Verification, ticket panels, staff applications — the front door.',
    configurable: null,
    categories: [
      {
        key: 'verification', label: 'Verification',
        commands: [
          { name: '/verify-setup', description: "Configure the verification flow for this server (Admin only)" },
          { name: '/verify-panel-post', description: "Post the verification panel/button to a channel (Admin only)" },
        ],
      },
      {
        key: 'tickets', label: 'Tickets',
        commands: [
          { name: '/ticket-panel-create', description: "Create a support ticket panel (Admin only)" },
          { name: '/ticket-panel-post', description: "Post a ticket panel to a channel (Admin only)" },
          { name: '/ticket-close', description: "Close the current ticket" },
          { name: '/ticket-add', description: "Add another member into the current ticket" },
          { name: '/ticket-remove', description: "Remove a member from the current ticket" },
        ],
      },
      {
        key: 'staffapps', label: 'Staff Apps',
        commands: [
          { name: '/staff-app-setup', description: "Configure the staff application flow/questions (Admin only)" },
          { name: '/staff-app-post', description: 'Post the "Apply for Staff" panel to a channel (Admin only)' },
          { name: '/staff-app-review', description: "Approve/deny a pending staff application (Staff only)" },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: "Authorize a new server ID for this bot (Bot owner only)" },
          { name: '/invite', description: "Get the invite link to add this bot to a server (Bot owner only)" },
        ],
      },
    ],
  },
  {
    id: 'council',
    name: 'Midnight-Council',
    status: 'Planned',
    tagline: 'Moderation, case tracking, staff tools, logging, and backups — absorbs the old Watch and Blueprint.',
    configurable: null,
    categories: [
      {
        key: 'moderation', label: 'Moderation',
        commands: [
          { name: '/warn', description: 'Warn a user' },
          { name: '/warnings', description: "View a user's warnings" },
          { name: '/warnings-list', description: 'Roster of warned users by scope, with counts' },
          { name: '/warn-threshold', description: 'Set the warning count that triggers an Admin/Owner escalation alert' },
          { name: '/note', description: 'Add a staff note about a user' },
          { name: '/kick', description: 'Kick a user from this server' },
          { name: '/softban', description: 'Ban then immediately unban a user, purging their recent messages' },
          { name: '/shadowban', description: 'Lock a user out of channels/categories you pick' },
          { name: '/unshadowban', description: "Remove a user's shadowban" },
          { name: '/timeout', description: 'Timeout a user in this server' },
          { name: '/ban', description: 'Ban a user' },
          { name: '/unban', description: 'Unban a user by ID' },
          { name: '/massban', description: 'Ban multiple users at once by ID' },
          { name: '/mute', description: 'Mute a user: strips their roles and applies a Muted role' },
          { name: '/unmute', description: 'Unmute a user and restore their previous roles' },
          { name: '/mod-notify-default', description: 'Set this server\'s default for DMing users on warn/kick/timeout/ban' },
          { name: '/history', description: 'View combined warnings, notes, actions, and cases for a user' },
          { name: '/audit-log', description: 'View recent moderation activity across a scope' },
          { name: '/mod-stats', description: 'Summary dashboard: totals, action breakdown, trend, busiest servers' },
          { name: '/report-summary', description: 'Post a weekly-style moderation digest for this server' },
          { name: '/staff-activity', description: "Shows a staff member's recent command activity and moderation footprint" },
          { name: '/blacklist-reason-search', description: 'Search blacklist entries by keyword in their reason' },
        ],
      },
      {
        key: 'cases', label: 'Cases',
        commands: [
          { name: '/case-note add', description: 'Add a note to an existing case' },
          { name: '/case-note view', description: "View a case's staff notes" },
          { name: '/case-open', description: 'Manually open a case for a user, with no action attached yet' },
          { name: '/case-close', description: 'Close a case' },
          { name: '/case-reopen', description: 'Reopen a closed case' },
        ],
      },
      {
        key: 'blacklist', label: 'Blacklist',
        commands: [
          { name: '/blacklist add', description: 'Start the blacklist wizard' },
          { name: '/blacklist remove', description: 'Remove an entry from the blacklist' },
          { name: '/blacklist check', description: 'Check if something is on the blacklist' },
          { name: '/blacklist list', description: 'Paginated view of the blacklist' },
        ],
      },
      {
        key: 'safety', label: 'Lockdown & Raid Safety',
        commands: [
          { name: '/lockdown', description: 'Pause new invites for a set duration, up to ~1 week' },
          { name: '/lockdown-clear', description: 'Manually end an active lockdown early' },
          { name: '/lockdown-extend', description: 'Add more time to an active lockdown' },
          { name: '/lockdown-status', description: "Check this server's current lockdown state" },
          { name: '/raidlock', description: 'Engage raid lock: pauses new invites AND revokes all active ones' },
          { name: '/raidlock-clear', description: 'Clear raid lock — it does not auto-lift' },
          { name: '/raidlock-status', description: "Check this server's current raid lock state" },
          { name: '/emergency-lockout', description: 'Instant panic-button lockout: strip roles, remove from staff, alert Owners' },
        ],
      },
      {
        key: 'staff', label: 'Staff Management',
        commands: [
          { name: '/staff-add', description: 'Add or update a staff member' },
          { name: '/staff-remove', description: 'Remove a staff member' },
          { name: '/staff-list', description: 'List staff members' },
          { name: '/staff-guide', description: 'See which commands your current rank can access' },
          { name: '/staff-bio set', description: 'Set your own staff bio' },
          { name: '/staff-bio view', description: "View a staff member's bio" },
          { name: '/shadow set', description: 'Flag a trainee as shadowing a mentor' },
          { name: '/shadow clear', description: "Clear a trainee's shadow assignment" },
          { name: '/shadow list', description: 'List all active shadow assignments' },
          { name: '/permission-check', description: "Check a staff member's rank and accessible commands" },
        ],
      },
      {
        key: 'wellbeing', label: 'Wellbeing',
        commands: [
          { name: '/checkin', description: 'Log a staff wellness check-in' },
          { name: '/checkin-history', description: 'View check-in history for a staff member' },
          { name: '/wellness-ping', description: 'Send a caring staff wellness reminder' },
          { name: '/ground-request', description: 'Request grounding/task support' },
          { name: '/ground-task', description: 'Respond to a grounding request with a suggested task' },
        ],
      },
      {
        key: 'logging', label: 'Logging & Anti-Nuke',
        commands: [
          { name: '/watch-setup', description: "Set this server's log category and who can view it" },
          { name: '/watch-status', description: "Confirm logging is active and nothing's broken" },
          { name: '/invite-source', description: 'Look up which invite a specific person joined through' },
          { name: '/invite-stats', description: 'Breakdown of which invites are bringing in the most joins' },
          { name: '/watch-history', description: "View a user's logged history across the whole network" },
          { name: '/watch-purge', description: 'Permanently delete logs older than a date' },
          { name: '/watch-antinuke-config', description: 'Configure Anti-Nuke channel/role deletion thresholds' },
          { name: '/watch-antinuke-whitelist add', description: 'Whitelist a user from Anti-Nuke detection' },
          { name: '/watch-antinuke-whitelist remove', description: 'Remove a user from the whitelist' },
          { name: '/watch-antinuke-whitelist list', description: 'List whitelisted users' },
          { name: '/watch-antinuke-status', description: 'View Anti-Nuke config and recent triggers' },
        ],
      },
      {
        key: 'backups', label: 'Backups & Templates',
        commands: [
          { name: '/backup-create', description: "Snapshot this server's roles + permission structure" },
          { name: '/backup-list', description: 'List available backups for this server' },
          { name: '/backup-restore', description: 'Restore roles/permissions from a backup (safe half only)' },
          { name: '/template-create', description: 'Save the current permission setup as a reusable template' },
          { name: '/template-apply', description: 'Apply a saved permission template to this server' },
          { name: '/template-list', description: 'List saved permission templates' },
        ],
      },
      {
        key: 'chat', label: 'Chat Auto-Responder',
        commands: [
          { name: '/chat-setup', description: 'Set the channel this bot replies to every message in' },
          { name: '/chat-remove', description: "Clear this server's chat channel" },
          { name: '/chat-add-message', description: 'Add a random reply line — no AI' },
          { name: '/chat-remove-message', description: 'Remove a reply line by its number' },
          { name: '/chat-list-messages', description: "List this server's reply pool" },
          { name: '/chat-add-keyword', description: 'Set a keyword that always gets a specific reply' },
          { name: '/chat-remove-keyword', description: 'Remove a keyword-triggered reply' },
          { name: '/chat-list-keywords', description: "List this server's keyword-triggered replies" },
        ],
      },
      {
        key: 'utility', label: 'Utility',
        commands: [
          { name: '/member-count', description: 'Show member count breakdown' },
          { name: '/reminder set', description: "Set a reminder — you'll get a DM when it's due" },
          { name: '/reminder list', description: 'List your pending reminders' },
          { name: '/reminder cancel', description: 'Cancel a pending reminder' },
          { name: '/quick-note', description: 'Pin a short internal staff note to a channel' },
          { name: '/away', description: 'Set or clear your away status' },
          { name: '/help', description: 'List all commands by category, or view detail on one command' },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: 'Authorize a server to use Midnight-Council' },
          { name: '/remove-server', description: "Revoke a server's authorization" },
        ],
      },
    ],
  },
  {
    id: 'collar',
    name: 'Midnight-Collar',
    status: 'Planned',
    tagline: 'Consent-gated mechanics, safety check-ins, and an unconditional safeword.',
    configurable: null,
    categories: [
      {
        key: 'mechanics', label: 'Mechanics',
        commands: [
          { name: '/collar-setup', description: 'Enable or disable Collar mechanics in a channel' },
          { name: '/collar-theme', description: 'Set your personal gag text style' },
          { name: '/collar-consent', description: 'Grant or revoke standing consent for Collar mechanics' },
          { name: '/collar-limits', description: 'Set or view your hard/soft limits with a specific handler' },
          { name: '/gag', description: "Garble a user's messages until it expires (consent required)" },
          { name: '/bind', description: 'Temporarily restrict a user from sending messages (consent required)' },
          { name: '/leash', description: 'Tether yourself to another user for a set time (consent required)' },
          { name: '/collar-status', description: "Check what's currently active on you or someone else" },
          { name: '/collar-check', description: 'Log a safety check-in status (Green/Yellow/Red) for someone' },
          { name: '/safeword', description: 'Instantly stop everything active on you — no permissions or cooldown' },
          { name: '/collar-resume', description: 'Resume mechanics you paused with a Yellow check-in' },
          { name: '/collar-history', description: 'View your own private safeword history' },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: 'Authorize a new server ID for this bot' },
          { name: '/invite', description: 'Get the invite link to add this bot to a server' },
        ],
      },
    ],
  },
  {
    id: 'community',
    name: 'Midnight-Community',
    status: 'Planned',
    tagline: 'Self-roles, welcome, voice rooms, profiles, bonds, and confessions — absorbs Roles, Profiles, and Bonds.',
    configurable: null,
    categories: [
      {
        key: 'roles', label: 'Self-Roles & Voice',
        commands: [
          { name: '/voice-setup', description: 'Set the category rooms live in and the trigger channel' },
          { name: '/voice-directory-setup', description: 'Set the channel the live room-listing embed posts to' },
          { name: '/voice-legend', description: 'Configure the emoji labels available for voice rooms' },
          { name: '/voice-transfer', description: 'Transfer ownership of your voice room to someone else' },
          { name: '/selfrole-create', description: 'Create a new self-role panel' },
          { name: '/selfrole-add-option', description: 'Add a pickable role to a self-role panel' },
          { name: '/selfrole-post', description: 'Post a self-role panel to a channel' },
          { name: '/selfrole-remove', description: 'Remove one role option from a self-role panel' },
          { name: '/selfrole-delete', description: 'Delete a whole self-role panel' },
          { name: '/selfrole-clear-all', description: 'Delete every self-role panel in this server' },
          { name: '/selfrole-import', description: "Recreate a panel from an existing reaction-role message" },
          { name: '/autorole-set', description: 'Automatically give a role to members the moment they join' },
          { name: '/autorole-remove', description: 'Stop automatically giving a role on join' },
          { name: '/autorole-list', description: 'View the current auto-role setup' },
          { name: '/welcome-setup', description: 'Configure the welcome message posted when someone joins' },
          { name: '/welcome-test', description: 'Preview the welcome message exactly as it will appear' },
        ],
      },
      {
        key: 'askfirst', label: 'Ask-First',
        commands: [
          { name: '/ask', description: 'Ask someone for permission before DMing/friend-requesting/etc' },
          { name: '/ask-role-add', description: 'Make a role an ask-first category' },
          { name: '/ask-role-remove', description: 'Remove an ask-first category' },
          { name: '/ask-role-list', description: 'List configured ask-first categories' },
          { name: '/ask-fallback-channel-set', description: "Set where to ping a target if their DMs are closed" },
          { name: '/ask-notify-channel-set', description: 'Pick your own fallback channel for ask requests' },
          { name: '/ask-notify-channel-clear', description: 'Clear your personal ask-notification channel preference' },
          { name: '/ask-delegate-set', description: 'Set your Owner/Dom/Handler to handle ask requests for you' },
          { name: '/ask-delegate-clear', description: 'Stop routing ask requests about you to a delegate' },
          { name: '/ask-overview', description: 'See how the ask-first system works here' },
          { name: '/ask-report', description: 'Report a user to staff for not respecting an ask-first denial' },
        ],
      },
      {
        key: 'profiles', label: 'Profiles',
        commands: [
          { name: '/profile-setup', description: 'Configure profile channels for this server' },
          { name: '/profile-overview-post', description: 'Post an explanation of how profiles work' },
          { name: '/profile-create', description: 'Create a profile (10 profile types)' },
          { name: '/profile-edit', description: 'Edit an existing profile' },
          { name: '/profile-view', description: "View a member's profile" },
          { name: '/profile-delete', description: 'Delete one of your profiles' },
        ],
      },
      {
        key: 'bonds', label: 'Bonds & Consent',
        commands: [
          { name: '/bond-request', description: 'Send a bond request (Owner-Pet, Handler-Pet, Romantic, Chosen Family)' },
          { name: '/bond-list', description: "View someone's registered bonds" },
          { name: '/bond-remove', description: 'End a bond' },
          { name: '/bond-status', description: 'Full personal overview of your bonds and oversight settings' },
          { name: '/consent-request', description: 'Request DM, Friend, or Voice consent from someone' },
          { name: '/consent-settings', description: 'Configure your personal consent defaults' },
          { name: '/consent-setup', description: 'Set the channel consent notifications post to' },
        ],
      },
      {
        key: 'confessions', label: 'Confessions',
        commands: [
          { name: '/confess', description: 'Submit an anonymous confession — posts with a running number' },
          { name: '/confession-setup', description: 'Set the confessions channel and per-user cooldown' },
          { name: '/confession-lookup', description: 'Look up who sent a numbered confession' },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: 'Authorize a new server ID for this bot' },
          { name: '/invite', description: 'Get the invite link to add this bot to a server' },
        ],
      },
    ],
  },
  {
    id: 'ascend',
    name: 'Midnight-Ascend',
    status: 'Planned',
    tagline: 'XP, currency, shop, and games — number go up, plus things to actually play.',
    configurable: null,
    categories: [
      {
        key: 'economy', label: 'XP & Economy',
        commands: [
          { name: '/rank', description: "Check your (or someone else's) level and XP progress" },
          { name: '/leaderboard xp', description: "This server's top XP earners" },
          { name: '/leaderboard currency', description: 'Network-wide top currency holders' },
          { name: '/balance', description: "Check your (or someone else's) network-wide currency balance" },
          { name: '/daily', description: 'Claim your daily currency' },
          { name: '/shop', description: "Browse this server's shop" },
          { name: '/buy', description: 'Buy an item from the shop' },
          { name: '/shop-add-role', description: 'Add a purchasable role to the shop' },
          { name: '/shop-add-boost', description: 'Add a temporary XP boost to the shop' },
          { name: '/shop-add-flair', description: 'Add a cosmetic profile flair to the shop' },
          { name: '/shop-remove-item', description: 'Remove an item from the shop' },
          { name: '/level-role-set', description: 'Auto-grant a role when members reach a level' },
          { name: '/level-role-remove', description: 'Remove a level-role reward' },
          { name: '/level-role-list', description: 'List configured level-role rewards' },
          { name: '/level-up-channel-set', description: 'Send level-up announcements to one specific channel' },
          { name: '/level-up-channel-clear', description: 'Go back to posting level-ups wherever it happened' },
          { name: '/xp-role-set', description: 'Set an exact XP-per-message rate and /daily amount for a role' },
          { name: '/xp-role-remove', description: "Remove a role's XP/daily rate" },
          { name: '/xp-role-list', description: 'List configured role XP/daily rates' },
        ],
      },
      {
        key: 'games', label: 'Games',
        commands: [
          { name: '/trivia-start', description: 'Start a trivia round in this channel' },
          { name: '/trivia-leaderboard', description: "This server's trivia leaderboard" },
          { name: '/truth', description: 'Get a Truth prompt (respects SFW/Mixed/NSFW rating)' },
          { name: '/dare', description: 'Get a Dare prompt (same rating gating as /truth)' },
          { name: '/content-rating-set', description: "Set this server's SFW/Mixed/NSFW rating" },
          { name: '/minigame-coinflip', description: 'Coinflip wager against Ascend currency' },
          { name: '/minigame-slots', description: 'Slots wager against Ascend currency' },
        ],
      },
      {
        key: 'questionpacks', label: 'Question Packs',
        commands: [
          { name: '/question-pack-set', description: 'Pick the active pack and posting cadence for a channel' },
          { name: '/question-pack-create', description: 'Author a custom question pack' },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: 'Authorize a new server ID for this bot' },
          { name: '/invite', description: 'Get the invite link to add this bot to a server' },
        ],
      },
    ],
  },
  {
    id: 'network',
    name: 'Midnight-Network',
    status: 'Planned',
    tagline: 'Announcements, events, suggestions, and polls — the network\'s own voice.',
    configurable: null,
    categories: [
      {
        key: 'announcements', label: 'Announcements',
        commands: [
          { name: '/announce-channel-setup', description: "Set this server's staff-facing announcement channel" },
          { name: '/announce', description: 'Post an announcement' },
          { name: '/announce-schedule', description: 'Schedule an announcement for a future date/time UTC' },
          { name: '/staff-announce', description: 'Announce a staff change: Welcome/Promotion/Departure' },
          { name: '/staff-alert', description: 'Post a staff-only alert' },
          { name: '/maintenance-notice', description: 'Announce planned bot downtime ahead of time' },
          { name: '/maintenance-complete', description: 'Announce that a bot is back online' },
          { name: '/holiday-announce', description: 'Post a festive holiday announcement' },
          { name: '/birthday-shoutout', description: 'Post a happy birthday shoutout for a member' },
          { name: '/update-log-setup', description: 'Set the forum channel update-log entries post into' },
          { name: '/update-log', description: 'Post a changelog-style update entry' },
          { name: '/update-log-history', description: 'Get a link to the update-log history' },
        ],
      },
      {
        key: 'events', label: 'Events & Suggestions',
        commands: [
          { name: '/event-create', description: 'Create an event with RSVP' },
          { name: '/event-list', description: 'View upcoming events' },
          { name: '/event-cancel', description: 'Cancel an event' },
          { name: '/suggest', description: 'Post a suggestion for the community to vote on' },
          { name: '/suggestion-status', description: 'Review a suggestion: Considering/Approved/Denied/Implemented' },
          { name: '/suggestion-list', description: 'List suggestions, optionally filtered by status' },
          { name: '/poll', description: 'Start a general-purpose poll' },
          { name: '/poll-results', description: "View a poll's results, even after it has closed" },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: 'Authorize a new server ID for this bot' },
          { name: '/invite', description: 'Get the invite link to add this bot to a server' },
        ],
      },
    ],
  },
  {
    id: 'alliance',
    name: 'Midnight-Alliance',
    status: 'Planned',
    tagline: 'Partner applications, directory, and a direct line to partner-server staff — split out of Network and Council.',
    configurable: null,
    categories: [
      {
        key: 'applications', label: 'Applications & Directory',
        commands: [
          { name: '/partner-apply', description: 'Apply to become a network partner — run from the partner server' },
          { name: '/partner-approve', description: 'Approve a pending application' },
          { name: '/partner-decline', description: 'Decline a pending application' },
          { name: '/partner-directory', description: 'Post/refresh the public partner directory' },
          { name: '/partner-list', description: 'View all active partnerships' },
          { name: '/partner-remove', description: 'End an active partnership' },
          { name: '/partner-checkup', description: 'Manually trigger a partner health check-up' },
          { name: '/partner-checkup-history', description: "View a partner's check-up history (internal only)" },
        ],
      },
      {
        key: 'contact', label: 'Contact',
        commands: [
          { name: '/partner-contact', description: "Run from the partner server — reach Midnight's Partnership Managers directly" },
          { name: '/partner-checkup-note', description: 'Log an internal Check-Up status/note on this partner' },
          { name: '/alliance-link', description: 'Run once in a partner server to register it against its directory entry' },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: "Authorize one of Midnight's own network servers" },
        ],
      },
    ],
  },
  {
    id: 'nightshade',
    name: 'Nightshade',
    status: 'Planned',
    tagline: 'Server discovery/bump bot — runs in any server, not just Midnight\'s own.',
    configurable: null,
    categories: [
      {
        key: 'listings', label: 'Listings',
        commands: [
          { name: '/bump', description: "Bump this server's listing (on cooldown, like Disboard)" },
          { name: '/listing-create', description: "Create this server's listing: blurb, category, tags, rating, about" },
          { name: '/listing-edit', description: 'Edit an existing listing' },
          { name: '/listing-preview', description: 'Preview how the listing card/detail view will look' },
          { name: '/listing-bundle', description: 'Bundle this server under an existing listing as a sister server' },
          { name: '/listing-remove', description: "Remove this server's listing" },
        ],
      },
    ],
  },
  {
    id: 'roleplay',
    name: 'Midnight Roleplay',
    status: 'Planned',
    tagline: 'Character sheets, scene/location tracking, and turn order.',
    configurable: null,
    categories: [
      {
        key: 'characters', label: 'Characters',
        commands: [
          { name: '/character create', description: 'Create a character sheet' },
          { name: '/character view', description: 'View a character sheet' },
          { name: '/character edit', description: 'Edit a character sheet' },
          { name: '/character delete', description: 'Delete a character sheet' },
          { name: '/character list', description: 'List characters by owner' },
        ],
      },
      {
        key: 'scenes', label: 'Scenes & Turns',
        commands: [
          { name: '/scene set-location', description: "Set a scene's location" },
          { name: '/scene who-is-where', description: 'View who is in which location' },
          { name: '/turn', description: 'Start, advance, skip, or check turn order' },
          { name: '/scene archive', description: 'Archive a completed scene' },
          { name: '/scene summarize', description: 'Summarize a scene' },
        ],
      },
      {
        key: 'admin', label: 'Admin',
        commands: [
          { name: '/add-server', description: 'Authorize a new server ID for this bot' },
          { name: '/invite', description: 'Get the invite link to add this bot to a server' },
        ],
      },
    ],
  },
];

// Flat `commands` accessor for anything still expecting the old shape.
export function flatCommands(bot) {
  return bot.categories.flatMap((c) => c.commands);
}
