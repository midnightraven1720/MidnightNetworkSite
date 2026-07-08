const http = require('http');
const url = require('url');

const errorLogStore = require('./errorLogStore.js');
const { getGuildRoles, getGuildCategories, setGuildRole, setGuildCategory } = require('./config.js');
const { getPageContent, setPageContent, getAllPageContent } = require('./botPages/botPagesStore.js');
const { commands } = require('./commands.js');
const { listRoles, listCategories } = require('./guildInfoHelpers.js');

function getMemberRankTier(guildRoles, memberRoleIds) {
  if (guildRoles.owner && memberRoleIds.includes(guildRoles.owner)) return 'owner';
  if (guildRoles.coOwner && memberRoleIds.includes(guildRoles.coOwner)) return 'coOwner';
  const staffRoleKeys = ['ticketStaff', 'partnershipManager', 'idVerifiedStaff'];
  for (const key of staffRoleKeys) {
    if (guildRoles[key] && memberRoleIds.includes(guildRoles[key])) return 'staff';
  }
  return 'member';
}

const API_KEY = process.env.DASHBOARD_API_KEY;
const startTime = Date.now();

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function isAuthorized(req) {
  return req.headers['x-api-key'] === API_KEY;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function resolveRoleName(guild, roleId) {
  if (!roleId) return null;
  const role = guild.roles.cache.get(roleId);
  return { id: roleId, name: role ? role.name : 'Unknown Role' };
}

function resolveCategoryName(guild, categoryId) {
  if (!categoryId) return null;
  const category = guild.channels.cache.get(categoryId);
  return { id: categoryId, name: category ? category.name : 'Unknown Category' };
}

const ROLE_KEYS = ['ticketStaff', 'owner', 'coOwner', 'partnershipManager', 'idVerifiedStaff'];
const CATEGORY_KEYS = ['support', 'staffReport', 'verification'];

function startApiServer(client) {
  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);

    if (!isAuthorized(req)) {
      sendJson(res, 401, { error: 'Unauthorized' });
      return;
    }

    if (parsed.pathname === '/api/servers') {
      const servers = client.guilds.cache.map(g => ({ id: g.id, name: g.name }));
      sendJson(res, 200, { servers });
      return;
    }

    if (parsed.pathname === '/api/tickets') {
      const raw = JSON.parse(require('fs').readFileSync(
        require('path').join(process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname, 'activeTickets.json'),
        'utf-8'
      ));
      const tickets = Object.entries(raw.tickets).map(([channelId, data]) => ({
        channelId,
        ...data,
        guildName: client.guilds.cache.get(data.guildId)?.name || 'Unknown Server'
      }));
      sendJson(res, 200, { count: tickets.length, tickets });
      return;
    }

    if (parsed.pathname === '/api/applications') {
      const raw = JSON.parse(require('fs').readFileSync(
        require('path').join(process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname, 'staffApplications.json'),
        'utf-8'
      ));
      const applications = Object.entries(raw.applications)
        .map(([channelId, data]) => ({
          channelId,
          ...data,
          guildName: client.guilds.cache.get(data.guildId)?.name || 'Unknown Server'
        }))
        .filter(app => app.status === 'complete');
      sendJson(res, 200, { count: applications.length, applications });
      return;
    }

    if (parsed.pathname === '/api/member-rank' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      const userId = parsed.query.userId;
      const guild = client.guilds.cache.get(guildId);

      if (!guild) {
        sendJson(res, 404, { error: 'Guild not found' });
        return;
      }

      try {
        const member = await guild.members.fetch(userId);
        const memberRoleIds = Array.from(member.roles.cache.keys());
        const guildRoles = getGuildRoles(guildId);
        const rank = getMemberRankTier(guildRoles, memberRoleIds);
        sendJson(res, 200, { rank });
      } catch (err) {
        sendJson(res, 200, { rank: 'member' });
      }
      return;
    }

    if (parsed.pathname === '/api/bot-config') {
      const configs = client.guilds.cache.map(guild => {
        const roles = getGuildRoles(guild.id);
        const categories = getGuildCategories(guild.id);
        return {
          guildId: guild.id,
          guildName: guild.name,
          roles: {
            ticketStaff: resolveRoleName(guild, roles.ticketStaff),
            owner: resolveRoleName(guild, roles.owner),
            coOwner: resolveRoleName(guild, roles.coOwner),
            partnershipManager: resolveRoleName(guild, roles.partnershipManager),
            idVerifiedStaff: resolveRoleName(guild, roles.idVerifiedStaff)
          },
          categories: {
            support: resolveCategoryName(guild, categories.support),
            staffReport: resolveCategoryName(guild, categories.staffReport),
            verification: resolveCategoryName(guild, categories.verification)
          }
        };
      });
      sendJson(res, 200, { configs });
      return;
    }

    if (parsed.pathname === '/api/guild-options' && req.method === 'GET') {
      const guildId = parsed.query.guildId;
      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        sendJson(res, 404, { error: 'Guild not found' });
        return;
      }
      sendJson(res, 200, {
        roles: listRoles(guild),
        categories: listCategories(guild)
      });
      return;
    }

    if (parsed.pathname === '/api/update-config' && req.method === 'POST') {
      try {
        const body = await readBody(req);
        const { guildId, roleUpdates, categoryUpdates } = body;

        if (!guildId || !client.guilds.cache.has(guildId)) {
          sendJson(res, 400, { error: 'Invalid guildId' });
          return;
        }

        if (roleUpdates) {
          for (const key of ROLE_KEYS) {
            if (roleUpdates[key] !== undefined) {
              setGuildRole(guildId, key, roleUpdates[key] || null);
            }
          }
        }

        if (categoryUpdates) {
          for (const key of CATEGORY_KEYS) {
            if (categoryUpdates[key] !== undefined) {
              setGuildCategory(guildId, key, categoryUpdates[key] || null);
            }
          }
        }

        sendJson(res, 200, { success: true });
      } catch (err) {
        errorLogStore.logError(err.message, 'update-config');
        sendJson(res, 500, { error: 'Failed to update config' });
      }
      return;
    }
if (parsed.pathname === '/api/bot-page-content' && req.method === 'GET') {
      sendJson(res, 200, { pages: getAllPageContent() });
      return;
    }

    if (parsed.pathname === '/api/update-bot-page-content' && req.method === 'POST') {
      try {
        const body = await readBody(req);
        const { slug, summary, highlights } = body;

        if (!slug) {
          sendJson(res, 400, { error: 'Missing slug' });
          return;
        }

        setPageContent(slug, { summary, highlights });
        sendJson(res, 200, { success: true });
      } catch (err) {
        errorLogStore.logError(err.message, 'update-bot-page-content');
        sendJson(res, 500, { error: 'Failed to update page content' });
      }
      return;
    }

    if (parsed.pathname === '/api/commands' && req.method === 'GET') {
      const commandList = commands.map(cmd => ({
        name: cmd.name,
        description: cmd.description
      }));
      sendJson(res, 200, { commands: commandList });
      return;
    }
    if (parsed.pathname === '/api/health') {
      sendJson(res, 200, {
        online: true,
        uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
        recentErrors: errorLogStore.getErrors()
      });
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  });

  const port = 3001;
  server.listen(port, () => {
    console.log(`Dashboard API listening on port ${port}`);
  });
}

module.exports = { startApiServer };