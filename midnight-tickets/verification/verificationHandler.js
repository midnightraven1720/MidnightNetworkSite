// Age verification ticket flow: panel, word issuance/timer, reminders,
// approval/denial, missed-word strikes, and 24-hour auto-close with logging.

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');

const { getGuildRoles, getGuildCategories } = require('../config.js');
const { getTagRoleId, getBaseVerifiedRoleId } = require('./verifiedTagsHandler.js');
const { STAFF_SERVER_ID } = require('../ids.js');
const store = require('./verificationStore.js');

const WORD_TIMER_MINUTES = 7;
const TICKET_LIFESPAN_HOURS = 24;
const MAX_MISSED_WORDS = 3;
const VERIFICATION_LOG_CHANNEL = 'verification-ticket-logs';

const WORD_LIST = [
  'MIDNIGHT', 'RAVEN', 'VELVET', 'ECLIPSE', 'ONYX',
  'CRIMSON', 'OBSIDIAN', 'NOCTURNE', 'SHADOW', 'LUNAR'
];

function generateWord() {
  const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const number = Math.floor(100 + Math.random() * 900);
  return `${word}${number}`;
}

function memberHasVerifyPermission(member, guildRoles) {
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  const allowed = [guildRoles.idVerifiedStaff, guildRoles.owner, guildRoles.coOwner];
  return allowed.some(roleId => roleId && member.roles.cache.has(roleId));
}

async function getOrCreateLogChannel(guild, channelName) {
  let logChannel = guild.channels.cache.find(
    c => c.name === channelName && c.type === ChannelType.GuildText
  );
  if (!logChannel) {
    logChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: guild.members.me.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] }
      ]
    });
  }
  return logChannel;
}

function buildVerificationPanelEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('🔞 Mandatory Age Verification')
    .setDescription('Age verification is **required** to access this server. All members must verify they are 18+ before gaining access to any channels.')
    .addFields(
      {
        name: 'Why Verification Is Required',
        value: 'As an 18+ community, we are legally required to verify all members\' ages. This protects minors, protects adults, and helps stop bots, raids, and predatory behaviour. Verification data is deleted immediately after approval.'
      },
      {
        name: 'Acceptable ID Types',
        value: '✓ Driver\'s license, state ID, passport, military ID\n✗ NOT accepted: student IDs, expired IDs, screenshots, copies'
      },
      {
        name: 'Your Privacy',
        value: 'We only collect date of birth for age verification. All photos are deleted immediately after approval. No permanent storage.'
      },
      {
        name: 'Not Comfortable Verifying?',
        value: 'That\'s okay — but this community requires it for legal and safety reasons. Questions? Contact staff before opening a ticket.'
      }
    )
    .setColor(0x8A5CF6)
    .setFooter({ text: 'Updated January 5, 2026 • Enhanced security following coordinated harassment attempts' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('verify_text').setLabel('Text Verification').setEmoji('📝').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('verify_voice').setLabel('Voice Verification').setEmoji('🎙️').setStyle(ButtonStyle.Secondary)
  );

  return { embeds: [embed], components: [row] };
}

function buildTicketInstructionsEmbed() {
  return new EmbedBuilder()
    .setTitle('📋 Verification Process')
    .setDescription('A staff member will issue you a verification word shortly using `/verify-word`. Once issued, you\'ll have limited time to submit your photos.')
    .addFields(
      {
        name: 'Acceptable ID Types',
        value: '✓ Driver\'s license, state ID, passport, military ID\n✗ NOT accepted: student IDs, expired IDs, screenshots, copies'
      },
      {
        name: 'Photo 1: Full ID + Paper With',
        value: '• Today\'s date\n• Discord username\n• Verification word given by staff\n• Server name\n\nBlock out everything EXCEPT: date of birth, expiration date, and photo on ID.'
      },
      {
        name: 'Photo 2',
        value: 'Clear view of the birthdate on the same ID.'
      },
      {
        name: 'Photo 3',
        value: 'A selfie holding the paper from Photo 1.'
      },
      {
        name: 'Important',
        value: `The verification word expires after ${WORD_TIMER_MINUTES} minutes. If it expires, staff will issue a new one. This ticket will auto-close after ${TICKET_LIFESPAN_HOURS} hours if verification isn't completed.`
      }
    )
    .setColor(0x8A5CF6);
}

async function handleVerifyTextButton(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const channelName = `verify-${interaction.user.username}`;

  try {
    const guildCategories = getGuildCategories(interaction.guild.id);
    const createOptions = {
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles] },
        { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
      ]
    };
    if (guildCategories.verification) createOptions.parent = guildCategories.verification;

    const channel = await interaction.guild.channels.create(createOptions);

    const guildRoles = getGuildRoles(interaction.guild.id);
    if (guildRoles.idVerifiedStaff) {
      await channel.permissionOverwrites.edit(guildRoles.idVerifiedStaff, {
        ViewChannel: true, SendMessages: true, ReadMessageHistory: true
      });
    }

    const now = new Date();
    const deadline = new Date(now.getTime() + TICKET_LIFESPAN_HOURS * 60 * 60 * 1000);

    store.setTicket(channel.id, {
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      username: interaction.user.username,
      openedAt: now.toISOString(),
      ticketDeadline: deadline.toISOString(),
      currentWord: null,
      wordSetAt: null,
      wordDeadline: null,
      remindersSent: { fiveMin: false, oneMin: false },
      missedCount: 0,
      staffInvolved: []
    });

    await channel.send({
      content: `Verification ticket opened by ${interaction.user}.`,
      embeds: [buildTicketInstructionsEmbed()]
    });

    await interaction.editReply(`Your verification ticket has been created: ${channel}`);
  } catch (error) {
    console.error(error);
    await interaction.editReply('Something went wrong creating your verification ticket.');
  }
}

async function handleVerifyVoiceButton(interaction) {
  await interaction.reply({
    content: 'For voice call verification, please contact a member of the **ID Verified Staff Team** directly to schedule a call.',
    ephemeral: true
  });
}

async function handleVerifyWordCommand(interaction) {
  const ticket = store.getTicket(interaction.channel.id);
  if (!ticket) {
    await interaction.reply({ content: 'This command can only be used inside a verification ticket.', ephemeral: true });
    return;
  }

  const guildRoles = getGuildRoles(interaction.guild.id);
  if (!memberHasVerifyPermission(interaction.member, guildRoles)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  const word = generateWord();
  const now = new Date();
  const wordDeadline = new Date(now.getTime() + WORD_TIMER_MINUTES * 60 * 1000);

  ticket.currentWord = word;
  ticket.wordSetAt = now.toISOString();
  ticket.wordDeadline = wordDeadline.toISOString();
  ticket.remindersSent = { fiveMin: false, oneMin: false };
  if (!ticket.staffInvolved.includes(interaction.user.username)) {
    ticket.staffInvolved.push(interaction.user.username);
  }
  store.setTicket(interaction.channel.id, ticket);

  const embed = new EmbedBuilder()
    .setTitle('🔑 Verification Word Issued')
    .setDescription(`Your verification word is: **${word}**\n\nYou have **${WORD_TIMER_MINUTES} minutes** to submit your 3 photos with this word included. If it expires, staff will issue a new one.`)
    .setColor(0x8A5CF6)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleVerifyApproveCommand(interaction) {
  const ticket = store.getTicket(interaction.channel.id);
  if (!ticket) {
    await interaction.reply({ content: 'This command can only be used inside a verification ticket.', ephemeral: true });
    return;
  }

  const guildRoles = getGuildRoles(interaction.guild.id);
  if (!memberHasVerifyPermission(interaction.member, guildRoles)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  const genderKey = interaction.options.getString('gender');

  await interaction.deferReply();

  try {
    const member = await interaction.guild.members.fetch(ticket.userId);

    const baseRoleId = getBaseVerifiedRoleId(interaction.guild.id);
    if (baseRoleId) {
      await member.roles.add(baseRoleId);
    }

    const tagRoleId = getTagRoleId(interaction.guild.id, genderKey);
    if (tagRoleId) {
      await member.roles.add(tagRoleId);
    }

    store.resetStrikes(interaction.guild.id, ticket.userId);

    await interaction.editReply(`✅ ${ticket.username} has been approved and verified.`);
    await closeVerificationTicket(interaction.channel, interaction.client, ticket, `Approved by ${interaction.user.username}`, interaction.user.username);
  } catch (error) {
    console.error(error);
    await interaction.editReply('Something went wrong approving this verification.');
  }
}

async function handleVerifyDenyCommand(interaction) {
  const ticket = store.getTicket(interaction.channel.id);
  if (!ticket) {
    await interaction.reply({ content: 'This command can only be used inside a verification ticket.', ephemeral: true });
    return;
  }

  const guildRoles = getGuildRoles(interaction.guild.id);
  if (!memberHasVerifyPermission(interaction.member, guildRoles)) {
    await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  const reason = interaction.options.getString('reason') || 'No reason provided';
  await interaction.deferReply();

  await interaction.editReply(`❌ Verification denied for ${ticket.username}. Reason: ${reason}`);
  await closeVerificationTicket(interaction.channel, interaction.client, ticket, `Denied by ${interaction.user.username}: ${reason}`, interaction.user.username);
}

async function closeVerificationTicket(channel, client, ticket, outcome, closedByUsername) {
  try {
    const attachment = await createTranscript(channel, {
      limit: -1,
      returnType: 'attachment',
      filename: `${channel.name}-transcript.html`,
      saveImages: false,
      poweredBy: false
    });

    const guild = channel.guild;
    const logChannel = await getOrCreateLogChannel(guild, VERIFICATION_LOG_CHANNEL);

    const staffList = ticket.staffInvolved && ticket.staffInvolved.length > 0
      ? ticket.staffInvolved.join(', ')
      : 'None recorded';

    const logEmbed = new EmbedBuilder()
      .setTitle(`Verification Ticket Closed: ${channel.name}`)
      .addFields(
        { name: 'Server', value: `${guild.name} (${guild.id})`, inline: false },
        { name: 'Channel', value: `${channel.name} (${channel.id})`, inline: false },
        { name: 'User', value: ticket.username, inline: true },
        { name: 'Outcome', value: outcome, inline: true },
        { name: 'Staff Involved', value: staffList, inline: false }
      )
      .setColor(0x8A5CF6)
      .setTimestamp();

    await logChannel.send({ embeds: [logEmbed], files: [attachment] });

    if (guild.id !== STAFF_SERVER_ID) {
      try {
        const staffGuild = client.guilds.cache.get(STAFF_SERVER_ID);
        if (staffGuild) {
          const backupChannel = await getOrCreateLogChannel(staffGuild, `backup-${VERIFICATION_LOG_CHANNEL}`);
          await backupChannel.send({ embeds: [logEmbed], files: [attachment] });
        }
      } catch (backupError) {
        console.error('Failed to mirror verification log to Staff server:', backupError);
      }
    }

    await channel.permissionOverwrites.edit(ticket.userId, { ViewChannel: false }).catch(() => {});

    const deleteRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_delete').setLabel('Delete Ticket').setEmoji('🗑️').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: 'This verification ticket has been closed and logged.', components: [deleteRow] });
  } catch (error) {
    console.error('Error closing verification ticket:', error);
  }

  store.deleteTicket(channel.id);
}

function startVerificationTimer(client) {
  setInterval(async () => {
    const tickets = store.getAllTickets();
    const now = Date.now();

    for (const [channelId, ticket] of Object.entries(tickets)) {
      let channel;
      try {
        channel = await client.channels.fetch(channelId);
      } catch {
        store.deleteTicket(channelId);
        continue;
      }

      if (new Date(ticket.ticketDeadline).getTime() <= now) {
        await closeVerificationTicket(channel, client, ticket, 'Auto-closed: 24 hour limit reached', 'System');
        continue;
      }

      if (ticket.wordDeadline) {
        const msLeft = new Date(ticket.wordDeadline).getTime() - now;

        if (msLeft <= 0) {
          const guildRoles = getGuildRoles(ticket.guildId);
          const missed = store.addStrike(ticket.guildId, ticket.userId);

          ticket.currentWord = null;
          ticket.wordSetAt = null;
          ticket.wordDeadline = null;
          ticket.remindersSent = { fiveMin: false, oneMin: false };
          ticket.missedCount = (ticket.missedCount || 0) + 1;
          store.setTicket(channelId, ticket);

          await channel.send('⏰ The verification word has expired. Staff will need to issue a new one with `/verify-word`.').catch(() => {});

          if (missed >= MAX_MISSED_WORDS) {
            let pingTarget = '@here';
            if (guildRoles.idVerifiedStaff) pingTarget = `<@&${guildRoles.idVerifiedStaff}>`;
            await channel.send(`🚩 ${pingTarget} This user has missed the verification word ${missed} times. Please review this ticket manually.`).catch(() => {});
          }
        } else if (msLeft <= 60 * 1000 && !ticket.remindersSent.oneMin) {
          ticket.remindersSent.oneMin = true;
          store.setTicket(channelId, ticket);
          await channel.send('⚠️ 1 minute left! Your verification word will expire soon.').catch(() => {});
        } else if (msLeft <= 5 * 60 * 1000 && !ticket.remindersSent.fiveMin) {
          ticket.remindersSent.fiveMin = true;
          store.setTicket(channelId, ticket);
          await channel.send('⏰ 5 minutes left to submit your photos with the current word.').catch(() => {});
        }
      }
    }
  }, 60 * 1000);
}

async function handleInteraction(interaction) {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'verification-panel') {
      await interaction.reply(buildVerificationPanelEmbed());
      return true;
    }
    if (interaction.commandName === 'verify-word') {
      await handleVerifyWordCommand(interaction);
      return true;
    }
    if (interaction.commandName === 'verify-approve') {
      await handleVerifyApproveCommand(interaction);
      return true;
    }
    if (interaction.commandName === 'verify-deny') {
      await handleVerifyDenyCommand(interaction);
      return true;
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'verify_text') {
      await handleVerifyTextButton(interaction);
      return true;
    }
    if (interaction.customId === 'verify_voice') {
      await handleVerifyVoiceButton(interaction);
      return true;
    }
  }

  return false;
}

module.exports = {
  handleInteraction,
  startVerificationTimer
};