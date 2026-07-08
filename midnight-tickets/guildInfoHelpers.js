function listRoles(guild) {
  return guild.roles.cache
    .filter(r => r.name !== '@everyone' && !r.managed)
    .map(r => ({ id: r.id, name: r.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function listCategories(guild) {
  const { ChannelType } = require('discord.js');
  return guild.channels.cache
    .filter(c => c.type === ChannelType.GuildCategory)
    .map(c => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { listRoles, listCategories };