const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    const initial = { allowedGuilds: [], guildRoles: {}, guildCategories: {}, guildWelcome: {} };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function isGuildAllowed(guildId) {
  const config = loadConfig();
  return config.allowedGuilds.includes(guildId);
}

function addAllowedGuild(guildId) {
  const config = loadConfig();
  if (!config.allowedGuilds.includes(guildId)) {
    config.allowedGuilds.push(guildId);
    saveConfig(config);
  }
}

function getGuildRoles(guildId) {
  const config = loadConfig();
  return config.guildRoles[guildId] || {};
}

function setGuildRole(guildId, roleType, roleId) {
  const config = loadConfig();
  if (!config.guildRoles[guildId]) {
    config.guildRoles[guildId] = {};
  }
  config.guildRoles[guildId][roleType] = roleId;
  saveConfig(config);
}

function getGuildCategories(guildId) {
  const config = loadConfig();
  return (config.guildCategories && config.guildCategories[guildId]) || {};
}

function setGuildCategory(guildId, categoryType, channelId) {
  const config = loadConfig();
  if (!config.guildCategories) config.guildCategories = {};
  if (!config.guildCategories[guildId]) config.guildCategories[guildId] = {};
  config.guildCategories[guildId][categoryType] = channelId;
  saveConfig(config);
}

function getGuildWelcome(guildId) {
  const config = loadConfig();
  return (config.guildWelcome && config.guildWelcome[guildId]) || {};
}

function setGuildWelcomeChannel(guildId, channelId) {
  const config = loadConfig();
  if (!config.guildWelcome) config.guildWelcome = {};
  if (!config.guildWelcome[guildId]) config.guildWelcome[guildId] = {};
  config.guildWelcome[guildId].channelId = channelId;
  saveConfig(config);
}

function setGuildWelcomeMessage(guildId, message) {
  const config = loadConfig();
  if (!config.guildWelcome) config.guildWelcome = {};
  if (!config.guildWelcome[guildId]) config.guildWelcome[guildId] = {};
  config.guildWelcome[guildId].message = message;
  saveConfig(config);
}

module.exports = {
  loadConfig,
  saveConfig,
  isGuildAllowed,
  addAllowedGuild,
  getGuildRoles,
  setGuildRole,
  getGuildCategories,
  setGuildCategory,
  getGuildWelcome,
  setGuildWelcomeChannel,
  setGuildWelcomeMessage
};