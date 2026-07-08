// Slash command definitions

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { GENDER_CHOICES } = require('./verification/verifiedTagsHandler.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Posts the ticket button panel in this channel'),

  new SlashCommandBuilder()
    .setName('staff-reply')
    .setDescription('Reply in this ticket as the Staff Team')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Your reply message')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('setup-roles')
    .setDescription('Configure staff roles for this server (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('setup-verified-tags')
    .setDescription('Configure the solo gender/identity verification tag roles (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('add-server')
    .setDescription('Authorize a new server ID for this bot (Bot owner only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('server_id')
        .setDescription('The server ID to authorize')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the invite link to add this bot to a server (Bot owner only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('setup-categories')
    .setDescription('Configure which categories tickets go into (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('verification-panel')
    .setDescription('Posts the age verification panel in this channel'),

  new SlashCommandBuilder()
    .setName('verify-word')
    .setDescription('Issue a new verification word and start the timer (Staff only)'),

  new SlashCommandBuilder()
    .setName('verify-approve')
    .setDescription('Approve this verification ticket and grant the verified role (Staff only)')
    .addStringOption(option =>
      option.setName('gender')
        .setDescription('Their verification tag')
        .setRequired(true)
        .addChoices(...GENDER_CHOICES)
    ),

  new SlashCommandBuilder()
    .setName('verify-deny')
    .setDescription('Deny this verification ticket (Staff only)')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for denial')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('setup-welcome-channel')
    .setDescription('Set the channel for verified-member announcements (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('setup-welcome-message')
    .setDescription('Set the verified-member announcement message (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(command => command.toJSON());

module.exports = { commands };