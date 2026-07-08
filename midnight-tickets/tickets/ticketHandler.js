// Core ticket logic: panel, creation, close/confirm, delete, staff-reply
const { pool } = require('../db'); // 👈 Add this to link our database

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');

const { ticketTypes } = require('./ticketTypes.js');
const { STAFF_SERVER_ID, BOT_OWNER_IDS, APPLICATION_ID } = require('../ids.js');
const {
  isGuildAllowed,
  addAllowedGuild,
  getGuildRoles,
  setGuildRole,
  getGuildCategories,
  setGuildCategory
} = require('../config.js');
const staffAppHandler = require('../staffApplications/staffAppHandler.js');
const ticketStore = require('./activeTicketsStore.js');

async function getOrCreateLogChannel(guild, channelName) {
  let logChannel = guild.channels.cache.find(
    c => c.name === channelName && c.type === ChannelType.GuildText
  );
  if (!logChannel) {
    logChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: guild.members.me.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles]
        }
      ]
    });
  }
  return logChannel;
}

function memberHasAnyRole(member, roleIds) {
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  return roleIds.some(roleId => roleId && member.roles.cache.has(roleId));
}

function buildTicketPanelEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('🌙 Report & Issues Guide')
    .setDescription('Need to report something or need help? You\'re in the right place. Choose the button that matches your need below to open a private ticket with our staff team.')
    .addFields(
      {
        name: 'What You Can Report',
        value: 'Rule violations, safety concerns, inappropriate behaviour, technical issues, partnerships, ban appeals, and general questions — pick the button that fits best.'
      },
      {
        name: 'How To Report',
        value: 'Include what happened, who was involved, where it happened, and any evidence (screenshots, links, message IDs) if you have it.'
      },
      {
        name: 'Important Notes',
        value: 'All reports are confidential. False reports are taken seriously. Please don\'t handle matters yourself — let staff assist. For urgent safety concerns, ping an available staff member directly.'
      }
    )
    .setColor(0x8A5CF6)
    .setFooter({ text: 'Midnight Network • Staff typically respond within 24 hours' });

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_support').setLabel('General Support').setEmoji('🎫').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('ticket_report_user').setLabel('Report a User').setEmoji('⚠️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_report_staff').setLabel('Report a Staff Member').setEmoji('🚩').setStyle(ButtonStyle.Danger)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_staff_app').setLabel('Staff Application').setEmoji('📋').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ticket_partnership').setLabel('Partnership Request').setEmoji('🤝').setStyle(ButtonStyle.Success)
  );

  return { embeds: [embed], components: [row1, row2] };
}

function buildSetupRolesComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId('setrole_ticketstaff').setPlaceholder('Select the Ticket Staff Team role').setMinValues(1).setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId('setrole_owner').setPlaceholder('Select the Owner role').setMinValues(1).setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId('setrole_coowner').setPlaceholder('Select the Co-Owner role').setMinValues(1).setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId('setrole_partnership').setPlaceholder('Select the Partnership Manager role').setMinValues(1).setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId('setrole_idverified').setPlaceholder('Select the ID Verified Staff Team role').setMinValues(1).setMaxValues(1)
    )
  ];
}

function buildSetupCategoriesComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('setcat_support')
        .setPlaceholder('Select category for Support/Report/Partnership tickets')
        .setChannelTypes(ChannelType.GuildCategory)
        .setMinValues(1)
        .setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('setcat_staffreport')
        .setPlaceholder('Select category for Report a Staff Member tickets')
        .setChannelTypes(ChannelType.GuildCategory)
        .setMinValues(1)
        .setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('setcat_verification')
        .setPlaceholder('Select category for ID Verification tickets')
        .setChannelTypes(ChannelType.GuildCategory)
        .setMinValues(1)
        .setMaxValues(1)
    )
  ];
}

const CATEGORY_SELECT_MAP = {
  setcat_support: 'support',
  setcat_staffreport: 'staffReport',
  setcat_verification: 'verification'
};

const TICKET_CATEGORY_MAP = {
  support: 'support',
  report_user: 'support',
  partnership: 'support',
  staff_app: 'support',
  report_staff: 'staffReport'
};

const MODAL_FIELDS = {
  support: [
    { id: 'q1', label: 'What do you need help with?', style: TextInputStyle.Short, required: true },
    { id: 'q2', label: 'Details', style: TextInputStyle.Paragraph, required: true }
  ],
  report_user: [
    { id: 'q1', label: 'Who are you reporting? (username/ID)', style: TextInputStyle.Short, required: true },
    { id: 'q2', label: 'What happened?', style: TextInputStyle.Paragraph, required: true },
    { id: 'q3', label: 'Where did it happen?', style: TextInputStyle.Short, required: true },
    { id: 'q4', label: 'Evidence (links/message IDs, optional)', style: TextInputStyle.Paragraph, required: false }
  ],
  report_staff: [
    { id: 'q1', label: 'Which staff member?', style: TextInputStyle.Short, required: true },
    { id: 'q2', label: 'What happened?', style: TextInputStyle.Paragraph, required: true },
    { id: 'q3', label: 'When did it happen?', style: TextInputStyle.Short, required: true },
    { id: 'q4', label: 'Evidence (optional)', style: TextInputStyle.Paragraph, required: false }
  ],
  partnership: [
    { id: 'q1', label: 'Server name', style: TextInputStyle.Short, required: true },
    { id: 'q2', label: 'Server invite link', style: TextInputStyle.Short, required: true },
    { id: 'q3', label: 'Member count', style: TextInputStyle.Short, required: true },
    { id: 'q4', label: 'What are you looking for in a partnership?', style: TextInputStyle.Paragraph, required: true }
  ]
};

function buildTicketModal(typeKey) {
  const ticketType = ticketTypes[typeKey];
  const fields = MODAL_FIELDS[typeKey];

  const modal = new ModalBuilder()
    .setCustomId(`modal_${typeKey}`)
    .setTitle(ticketType.label.slice(0, 45));

  const rows = fields.map(field =>
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(field.id)
        .setLabel(field.label.slice(0, 45))
        .setStyle(field.style)
        .setRequired(field.required)
    )
  );

  modal.addComponents(...rows);
  return modal;
}

const ROLE_SELECT_MAP = {
  setrole_ticketstaff: 'ticketStaff',
  setrole_owner: 'owner',
  setrole_coowner: 'coOwner',
  setrole_partnership: 'partnershipManager',
  setrole_idverified: 'idVerifiedStaff'
};

const BUTTON_TYPE_MAP = {
  ticket_support: 'support',
  ticket_report_user: 'report_user',
  ticket_report_staff: 'report_staff',
  ticket_staff_app: 'staff_app',
  ticket_partnership: 'partnership'
};

async function handlePing(interaction) {
  await interaction.reply('Pong!');
}

async function handleTicketPanel(interaction) {
  await interaction.reply(buildTicketPanelEmbed());
}

async function handleAddServer(interaction) {
  if (!BOT_OWNER_IDS.includes(interaction.user.id)) {
    await interaction.reply({ content: 'Only the bot owner can use this command.', ephemeral: true });
    return;
  }
  const serverId = interaction.options.getString('server_id');
  addAllowedGuild(serverId);
  await interaction.reply({ content: `Server ID \`${serverId}\` has been authorized. The bot can now join it.`, ephemeral: true });
}

async function handleInvite(interaction) {
  if (!BOT_OWNER_IDS.includes(interaction.user.id)) {
    await interaction.reply({ content: 'Only the bot owner can use this command.', ephemeral: true });
    return;
  }
  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${APPLICATION_ID}&permissions=268561424&scope=bot%20applications.commands`;
  await interaction.reply({
    content: `Use this link to invite Midnight Tickets to a server:\n${inviteUrl}\n\nNote: the server must be authorized first with \`/add-server\`, or the bot will automatically leave.`,
    ephemeral: true
  });
}

async function handleSetupRoles(interaction) {
  await interaction.reply({
    content: 'Select each staff role below. You can use this command again anytime to update them. (For verification tag roles, use /setup-verified-tags instead.)',
    components: buildSetupRolesComponents(),
    ephemeral: true
  });
}

async function handleStaffReply(interaction) {
  const guildRoles = getGuildRoles(interaction.guild.id);
  const allowedRoleIds = [guildRoles.ticketStaff, guildRoles.idVerifiedStaff, guildRoles.owner, guildRoles.coOwner];

  if (!memberHasAnyRole(interaction.member, allowedRoleIds)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  const ticketInfo = ticketStore.getTicket(interaction.channel.id);
  if (!ticketInfo) {
    await interaction.reply({ content: 'This command can only be used inside an active ticket channel.', ephemeral: true });
    return;
  }

  const message = interaction.options.getString('message');
  if (!ticketInfo.staffInvolved) ticketInfo.staffInvolved = [];
  if (!ticketInfo.staffInvolved.includes(interaction.user.username)) {
    ticketInfo.staffInvolved.push(interaction.user.username);
  }
  ticketStore.setTicket(interaction.channel.id, ticketInfo);

  const staffEmbed = new EmbedBuilder()
    .setTitle('🌙 Midnight Staff')
    .setDescription(message)
    .setColor(0x8A5CF6)
    .setTimestamp();

  await interaction.channel.send({ embeds: [staffEmbed] });
  await interaction.reply({ content: 'Reply sent.', ephemeral: true });
}

async function handleRoleSelect(interaction) {
  const roleId = interaction.values[0];
  const roleType = ROLE_SELECT_MAP[interaction.customId];
  if (roleType) {
    setGuildRole(interaction.guild.id, roleType, roleId);
    await interaction.reply({ content: `Saved <@&${roleId}> as the ${roleType} role for this server.`, ephemeral: true });
  }
}

async function handleTicketCreateButton(interaction) {
  const typeKey = BUTTON_TYPE_MAP[interaction.customId];

  if (typeKey === 'staff_app') {
    return createTicketChannel(interaction, typeKey, null);
  }

  const modal = buildTicketModal(typeKey);
  await interaction.showModal(modal);
}

async function handleModalSubmit(interaction) {
  const typeKey = interaction.customId.replace('modal_', '');
  const fields = MODAL_FIELDS[typeKey];
  if (!fields) return;

  const answers = fields.map(field => ({
    question: field.label,
    answer: interaction.fields.getTextInputValue(field.id) || '(no answer)'
  }));

  await createTicketChannel(interaction, typeKey, answers);
}

function getPingRolesForType(typeKey, guildRoles) {
  if (typeKey === 'report_staff') {
    return [guildRoles.owner, guildRoles.coOwner].filter(Boolean);
  }
  if (typeKey === 'partnership') {
    return [guildRoles.partnershipManager, guildRoles.ticketStaff].filter(Boolean);
  }
  return [guildRoles.ticketStaff].filter(Boolean);
}

async function createTicketChannel(interaction, typeKey, answers) {
  const ticketType = ticketTypes[typeKey];
  const guildRoles = getGuildRoles(interaction.guild.id);
  const guildCategories = getGuildCategories(interaction.guild.id);
  await interaction.deferReply({ ephemeral: true });

  const channelName = `${ticketType.prefix}-${interaction.user.username}`;

  const overwrites = [
    { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
    { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
  ];

  if (typeKey === 'report_staff') {
    if (guildRoles.owner) overwrites.push({ id: guildRoles.owner, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
    if (guildRoles.coOwner) overwrites.push({ id: guildRoles.coOwner, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
  } else if (typeKey === 'partnership') {
    if (guildRoles.partnershipManager) overwrites.push({ id: guildRoles.partnershipManager, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
    if (guildRoles.ticketStaff) overwrites.push({ id: guildRoles.ticketStaff, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
  } else {
    if (guildRoles.ticketStaff) overwrites.push({ id: guildRoles.ticketStaff, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
  }

  const categoryKey = TICKET_CATEGORY_MAP[typeKey];
  const categoryId = guildCategories[categoryKey];

  try {
    const createOptions = {
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: overwrites
    };
    if (categoryId) createOptions.parent = categoryId;

    const channel = await interaction.guild.channels.create(createOptions);

    ticketStore.setTicket(channel.id, {
      userId: interaction.user.id,
      username: interaction.user.username,
      typeKey: typeKey,
      guildId: interaction.guild.id,
      openedAt: new Date().toISOString(),
      staffInvolved: []
    });

    const embed = new EmbedBuilder()
      .setTitle(`${ticketType.emoji} ${ticketType.label}`)
      .setDescription(`Opened by ${interaction.user}. A staff member will be with you shortly.`)
      .setColor(0x8A5CF6)
      .setTimestamp();

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_close').setLabel('Close Ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [closeRow] });

    const pingRoles = getPingRolesForType(typeKey, guildRoles);
    if (pingRoles.length > 0) {
      await channel.send(pingRoles.map(roleId => `<@&${roleId}>`).join(' ') + ' — new ticket opened.');
    }

    if (typeKey === 'staff_app') {
      await staffAppHandler.startApplication(channel, interaction.user);
    }

    let answersEmbed = null;
    if (answers && answers.length > 0) {
      answersEmbed = new EmbedBuilder()
        .setTitle('📝 Submitted Form')
        .setColor(0x8A5CF6)
        .addFields(answers.map(a => ({ name: a.question, value: a.answer.slice(0, 1024) })))
        .setTimestamp();
      await channel.send({ embeds: [answersEmbed] });
    }

    if (typeKey === 'report_staff' && answersEmbed) {
      try {
        const reviewEmbed = EmbedBuilder.from(answersEmbed)
          .setTitle(`🚩 Staff Report Submitted: ${interaction.user.username}`);
        const localReview = await getOrCreateLogChannel(interaction.guild, 'staff-report-submissions');
        await localReview.send({ embeds: [reviewEmbed] });

        if (interaction.guild.id !== STAFF_SERVER_ID) {
          const staffGuild = interaction.client.guilds.cache.get(STAFF_SERVER_ID);
          if (staffGuild) {
            const staffReview = await getOrCreateLogChannel(staffGuild, 'backup-staff-report-submissions');
            await staffReview.send({ embeds: [reviewEmbed] });
          }
        }
      } catch (reviewError) {
        console.error('Failed to post staff report submission to review channel:', reviewError);
      }
    }

    await interaction.editReply(`Your ticket has been created: ${channel}`);
  } catch (error) {
    console.error(error);
    await interaction.editReply('Something went wrong creating your ticket.');
  }
}

async function handleSetupCategories(interaction) {
  await interaction.reply({
    content: 'Select the category for each ticket group below.',
    components: buildSetupCategoriesComponents(),
    ephemeral: true
  });
}

async function handleCategorySelect(interaction) {
  const categoryId = interaction.values[0];
  const categoryKey = CATEGORY_SELECT_MAP[interaction.customId];
  if (categoryKey) {
    setGuildCategory(interaction.guild.id, categoryKey, categoryId);
    await interaction.reply({ content: `Saved <#${categoryId}> as the ${categoryKey} ticket category.`, ephemeral: true });
  }
}

async function handleTicketDeleteButton(interaction) {
  await interaction.reply('Deleting this ticket in 5 seconds...');
  setTimeout(async () => {
    try {
      await interaction.channel.delete();
    } catch (error) {
      console.error(error);
    }
  }, 5000);
}

async function handleTicketCloseButton(interaction) {
  const confirmRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_close_confirm').setLabel('Yes, Close Ticket').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('ticket_close_cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({
    content: 'Are you sure you want to close this ticket?',
    components: [confirmRow]
  });
}

async function handleTicketCloseCancel(interaction) {
  await interaction.update({ content: 'Ticket close cancelled.', components: [] });
}

async function handleTicketCloseConfirm(interaction) {
  await interaction.update({ content: 'Closing ticket...', components: [] });

  const ticketInfo = ticketStore.getTicket(interaction.channel.id);
  const typeKeyForClose = ticketInfo ? ticketInfo.typeKey : 'support';
  const ticketType = ticketTypes[typeKeyForClose];

  try {
    const attachment = await createTranscript(interaction.channel, {
      limit: -1,
      returnType: 'attachment',
      filename: `${interaction.channel.name}-transcript.html`,
      saveImages: false,
      poweredBy: false
    });

    const logChannel = await getOrCreateLogChannel(interaction.guild, ticketType.logChannel);

    const staffList = ticketInfo && ticketInfo.staffInvolved && ticketInfo.staffInvolved.length > 0
      ? ticketInfo.staffInvolved.join(', ')
      : 'None recorded';

    const logEmbed = new EmbedBuilder()
      .setTitle(`Ticket Closed: ${interaction.channel.name}`)
      .addFields(
        { name: 'Server', value: `${interaction.guild.name} (${interaction.guild.id})`, inline: false },
        { name: 'Channel', value: `${interaction.channel.name} (${interaction.channel.id})`, inline: false },
        { name: 'Type', value: ticketType.label, inline: true },
        { name: 'Opened by', value: ticketInfo ? ticketInfo.username : 'Unknown', inline: true },
        { name: 'Closed by', value: interaction.user.username, inline: true },
        { name: 'Staff Involved', value: staffList, inline: false }
      )
      .setColor(0x8A5CF6)
      .setTimestamp();

    await logChannel.send({ embeds: [logEmbed], files: [attachment] });

    if (interaction.guild.id !== STAFF_SERVER_ID) {
      try {
        const staffGuild = interaction.client.guilds.cache.get(STAFF_SERVER_ID);
        if (staffGuild) {
          const backupChannelName = `backup-${ticketType.logChannel}`;
          const backupLogChannel = await getOrCreateLogChannel(staffGuild, backupChannelName);
          await backupLogChannel.send({ embeds: [logEmbed], files: [attachment] });
        }
      } catch (backupError) {
        console.error('Failed to mirror log to Staff server:', backupError);
      }
    }

    if (ticketInfo) {
      await interaction.channel.permissionOverwrites.edit(ticketInfo.userId, {
        ViewChannel: false
      });
    } else {
      await interaction.channel.send('⚠️ Could not determine who opened this ticket, so their access was not automatically removed. Please check manually.');
    }

    const deleteRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_delete').setLabel('Delete Ticket').setEmoji('🗑️').setStyle(ButtonStyle.Danger)
    );

    await interaction.channel.send({
      content: 'This ticket has been closed and the transcript saved.',
      components: [deleteRow]
    });
  } catch (error) {
    console.error(error);
    await interaction.channel.send('Something went wrong closing this ticket.');
  }

  ticketStore.deleteTicket(interaction.channel.id);
}

async function handleInteraction(interaction) {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'ping') return handlePing(interaction);
    // 🛡️ STAFF ONLY SECURITY CHECK:
    // 👇 REPLACE THE TICKET-PANEL LINE WITH THIS:
    if (interaction.commandName === 'ticket-panel') {
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: '❌ Only administrators can post the ticket panel.', ephemeral: true });
      }
      return handleTicketPanel(interaction);
    };
    if (interaction.commandName === 'add-server') return handleAddServer(interaction);
    if (interaction.commandName === 'invite') return handleInvite(interaction);
    if (interaction.commandName === 'setup-roles') return handleSetupRoles(interaction);
    if (interaction.commandName === 'setup-categories') return handleSetupCategories(interaction);
    if (interaction.commandName === 'staff-reply') return handleStaffReply(interaction);
    return;
  }

  if (interaction.isRoleSelectMenu()) {
    return handleRoleSelect(interaction);
  }

  if (interaction.isChannelSelectMenu()) {
    return handleCategorySelect(interaction);
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('modal_')) return handleModalSubmit(interaction);
    return;
  }

  // 💾 HANDLES TICKET BUTTON PRESSES
  // 👇 REPLACE THIS ENTIRE BLOCK WITH THIS UPDATED VERSION:
  if (interaction.isButton()) {
    // 📢 CUSTOM MUTE APPEAL TICKET CREATION
    if (interaction.customId === 'appeal_mute') {
      await interaction.deferReply({ ephemeral: true });
      const userId = interaction.user.id;
      const guildId = interaction.guild.id;

      try {
        // Check the shared Postgres database to see if this user actually logged a request
        const res = await pool.query(
          "SELECT status FROM mute_appeals WHERE user_id = $1 AND guild_id = $2 AND status = 'pending'",
          [userId, guildId]
        );

        if (res.rows.length === 0) {
          return await interaction.editReply('❌ You do not have an active pending appeal request recorded. Please click the appeal button from your mute notification message first!');
        }

        // We found an active log! Now build a clean ticket channel manually
        const channelName = `appeal-${interaction.user.username}`;
        const guildRoles = getGuildRoles(guildId);
        const guildCategories = getGuildCategories(guildId);

        const overwrites = [
          { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: userId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
          { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
        ];

        // Ensure ticket staff can access the room
        if (guildRoles.ticketStaff) {
          overwrites.push({ id: guildRoles.ticketStaff, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
        }

        const createOptions = {
          name: channelName,
          type: ChannelType.GuildText,
          permissionOverwrites: overwrites
        };

        // Put it under your standard support/verification category if available
        if (guildCategories.support) createOptions.parent = guildCategories.support;

        const channel = await interaction.guild.channels.create(createOptions);

        // Store it as an active session so logs work when closed
        ticketStore.setTicket(channel.id, {
          userId: userId,
          username: interaction.user.username,
          typeKey: 'support', // Defaults log routing to regular support channels
          guildId: guildId,
          openedAt: new Date().toISOString(),
          staffInvolved: []
        });

        // Update database entry status so they can't open duplicate channels endlessly
        await pool.query(
          "UPDATE mute_appeals SET status = 'open' WHERE user_id = $1 AND guild_id = $2",
          [userId, guildId]
        );

        // Welcome Embed inside the fresh appeal room
        const appealEmbed = new EmbedBuilder()
          .setTitle('⚖️ Mute Appeal Session')
          .setDescription(`Welcome ${interaction.user}. A staff member will review your appeal history shortly. Please state your case clearly below while waiting.`)
          .setColor(0x8A5CF6)
          .setTimestamp();

        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('ticket_close').setLabel('Close Session').setEmoji('🔒').setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [appealEmbed], components: [closeRow] });

        // Alert staff roles
        if (guildRoles.ticketStaff) {
          await channel.send(`<@&${guildRoles.ticketStaff}> — a new mute appeal room has been opened.`);
        }

        return await interaction.editReply(`Your appeal room has been created successfully: ${channel}`);

      } catch (err) {
        console.error('Error fetching/handling mute appeal ticket:', err);
        return await interaction.editReply('❌ Something went wrong while verifying your appeal records. Please contact an administrator.');
      }
    }

    // 🎫 Standard Ticket Bot Buttons continue below perfectly:
    if (BUTTON_TYPE_MAP[interaction.customId]) return handleTicketCreateButton(interaction);
    if (interaction.customId === 'ticket_delete') return handleTicketDeleteButton(interaction);
    if (interaction.customId === 'ticket_close') return handleTicketCloseButton(interaction);
    if (interaction.customId === 'ticket_close_cancel') return handleTicketCloseCancel(interaction);
    if (interaction.customId === 'ticket_close_confirm') return handleTicketCloseConfirm(interaction);
    return;
  } // 👈 Closes the "if (interaction.isButton())" block
} // 👈 Closes the "async function handleInteraction(interaction)" block

module.exports = {
  handleInteraction,
  isGuildAllowed
};