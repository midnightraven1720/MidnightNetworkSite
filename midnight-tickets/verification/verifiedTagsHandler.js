const {
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');
const { getGuildRoles, setGuildRole } = require('../config.js');

const BASE_ROLE_CUSTOM_ID = 'settag_base';
const BASE_ROLE_CONFIG_KEY = 'verifiedRole';

const TAG_DEFINITIONS = [
  { key: 'female', label: 'Female (F)', configKey: 'tagFemale', customId: 'settag_female' },
  { key: 'male', label: 'Male (M)', configKey: 'tagMale', customId: 'settag_male' },
  { key: 'f2m', label: 'Female-to-Male (F2M)', configKey: 'tagF2M', customId: 'settag_f2m' },
  { key: 'm2f', label: 'Male-to-Female (M2F)', configKey: 'tagM2F', customId: 'settag_m2f' },
  { key: 'gq', label: 'Genderqueer (GQ)', configKey: 'tagGQ', customId: 'settag_gq' },
  { key: 'ngs', label: 'Non-Gender Specific (NGS)', configKey: 'tagNGS', customId: 'settag_ngs' }
];

const TAG_SELECT_MAP = Object.fromEntries(
  TAG_DEFINITIONS.map(t => [t.customId, t.configKey])
);
TAG_SELECT_MAP[BASE_ROLE_CUSTOM_ID] = BASE_ROLE_CONFIG_KEY;

const TAG_CHOICE_MAP = Object.fromEntries(
  TAG_DEFINITIONS.map(t => [t.key, t.configKey])
);

function buildTagComponentsPage1() {
  const rows = [
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId(BASE_ROLE_CUSTOM_ID)
        .setPlaceholder('Select the base "ID Verified" role (given to everyone)')
        .setMinValues(1)
        .setMaxValues(1)
    )
  ];
  TAG_DEFINITIONS.slice(0, 4).forEach(t => {
    rows.push(
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(t.customId)
          .setPlaceholder(`Select the role for: ${t.label}`)
          .setMinValues(1)
          .setMaxValues(1)
      )
    );
  });
  return rows;
}

function buildTagComponentsPage2() {
  return TAG_DEFINITIONS.slice(4).map(t =>
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId(t.customId)
        .setPlaceholder(`Select the role for: ${t.label}`)
        .setMinValues(1)
        .setMaxValues(1)
    )
  );
}

const GENDER_CHOICES = TAG_DEFINITIONS.map(t => ({ name: t.label, value: t.key }));

async function handleSetupVerifiedTags(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ content: 'Only Administrators can use this command.', ephemeral: true });
    return;
  }

  await interaction.reply({
    content: 'Select the role for each verification tag (1/2).',
    components: buildTagComponentsPage1(),
    ephemeral: true
  });
  await interaction.followUp({
    content: 'Continued (2/2):',
    components: buildTagComponentsPage2(),
    ephemeral: true
  });
}

async function handleTagRoleSelect(interaction) {
  const configKey = TAG_SELECT_MAP[interaction.customId];
  if (!configKey) return false;

  const roleId = interaction.values[0];
  setGuildRole(interaction.guild.id, configKey, roleId);
  await interaction.reply({ content: `Saved <@&${roleId}> for that verification tag.`, ephemeral: true });
  return true;
}

function getTagRoleId(guildId, genderKey) {
  const configKey = TAG_CHOICE_MAP[genderKey];
  if (!configKey) return null;
  const guildRoles = getGuildRoles(guildId);
  return guildRoles[configKey] || null;
}

function getBaseVerifiedRoleId(guildId) {
  const guildRoles = getGuildRoles(guildId);
  return guildRoles[BASE_ROLE_CONFIG_KEY] || null;
}

function isTagSelectCustomId(customId) {
  return Boolean(TAG_SELECT_MAP[customId]);
}

async function handleInteraction(interaction) {
  if (interaction.isChatInputCommand() && interaction.commandName === 'setup-verified-tags') {
    await handleSetupVerifiedTags(interaction);
    return true;
  }
  if (interaction.isRoleSelectMenu() && isTagSelectCustomId(interaction.customId)) {
    return handleTagRoleSelect(interaction);
  }
  return false;
}

module.exports = {
  handleSetupVerifiedTags,
  handleTagRoleSelect,
  isTagSelectCustomId,
  getTagRoleId,
  getBaseVerifiedRoleId,
  GENDER_CHOICES,
  handleInteraction
};