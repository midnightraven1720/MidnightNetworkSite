const {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits
} = require('discord.js');
const { getGuildWelcome, setGuildWelcomeChannel, setGuildWelcomeMessage } = require('../config.js');
const DEFAULT_MESSAGE = '{user} has now been verified! Welcome to the community 🌙';

async function handleSetupWelcomeChannel(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ content: 'Only Administrators can use this command.', ephemeral: true });
    return;
  }

  const menu = new ChannelSelectMenuBuilder()
    .setCustomId('setwelcome_channel')
    .setPlaceholder('Select the channel for verification welcome announcements')
    .setChannelTypes(ChannelType.GuildText)
    .setMinValues(1)
    .setMaxValues(1);

  await interaction.reply({
    content: 'Select the channel where verified-member announcements should post.',
    components: [new ActionRowBuilder().addComponents(menu)],
    ephemeral: true
  });
}

async function handleWelcomeChannelSelect(interaction) {
  const channelId = interaction.values[0];
  setGuildWelcomeChannel(interaction.guild.id, channelId);
  await interaction.reply({ content: `Saved <#${channelId}> as the verification welcome channel.`, ephemeral: true });
}

async function handleSetupWelcomeMessage(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ content: 'Only Administrators can use this command.', ephemeral: true });
    return;
  }

  const current = getGuildWelcome(interaction.guild.id).message || DEFAULT_MESSAGE;

  const modal = new ModalBuilder()
    .setCustomId('setwelcome_message_modal')
    .setTitle('Set Welcome Message');

  const input = new TextInputBuilder()
    .setCustomId('message')
    .setLabel('Message (use {user} to mention them)')
    .setStyle(TextInputStyle.Paragraph)
    .setValue(current.slice(0, 4000))
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(input));
  await interaction.showModal(modal);
}

async function handleWelcomeMessageModalSubmit(interaction) {
  const message = interaction.fields.getTextInputValue('message');
  setGuildWelcomeMessage(interaction.guild.id, message);
  await interaction.reply({ content: 'Welcome message saved.', ephemeral: true });
}

async function postWelcomeMessage(guild, member) {
  const welcomeConfig = getGuildWelcome(guild.id);
  if (!welcomeConfig.channelId) return;

  try {
    const channel = await guild.channels.fetch(welcomeConfig.channelId);
    if (!channel) return;

    const template = welcomeConfig.message || DEFAULT_MESSAGE;
    const finalMessage = template.replaceAll('{user}', member.toString());

    await channel.send({ content: finalMessage });
  } catch (error) {
    console.error('Failed to post verification welcome message:', error);
  }
}

async function handleInteraction(interaction) {
  if (interaction.isChatInputCommand() && interaction.commandName === 'setup-welcome-channel') {
    await handleSetupWelcomeChannel(interaction);
    return true;
  }
  if (interaction.isChatInputCommand() && interaction.commandName === 'setup-welcome-message') {
    await handleSetupWelcomeMessage(interaction);
    return true;
  }
  if (interaction.isChannelSelectMenu() && interaction.customId === 'setwelcome_channel') {
    await handleWelcomeChannelSelect(interaction);
    return true;
  }
  if (interaction.isModalSubmit() && interaction.customId === 'setwelcome_message_modal') {
    await handleWelcomeMessageModalSubmit(interaction);
    return true;
  }
  return false;
}

module.exports = {
  postWelcomeMessage,
  handleInteraction
};