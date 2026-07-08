const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType
} = require('discord.js');
const { PART1_QUESTIONS, PART2_QUESTIONS, PART3_QUESTIONS, ADDON_QUESTIONS } = require('./staffAppQuestions.js');
const store = require('./staffAppStore.js');
const { STAFF_SERVER_ID } = require('../ids.js');

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

function buildQuestionMessage(question, questionNumber, total, client, headerLabel) {
  const embed = new EmbedBuilder()
    .setTitle(`${headerLabel} - Question ${questionNumber}/${total}`)
    .setDescription(question.text)
    .setColor(0x8A5CF6);

  if (question.type === 'text') {
    embed.setFooter({ text: 'Type your answer in this channel to continue.' });
    return { embeds: [embed] };
  }

  if (question.type === 'guild_select') {
    const guilds = Array.from(client.guilds.cache.values()).slice(0, 25);
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`staffapp_guildselect_${question.id}`)
      .setPlaceholder('Select a server')
      .addOptions(guilds.map(g => ({ label: g.name.slice(0, 100), value: g.id })));
    embed.setFooter({ text: 'Select a server from the dropdown below.' });
    return { embeds: [embed], components: [new ActionRowBuilder().addComponents(menu)] };
  }

  const row = new ActionRowBuilder().addComponents(
    question.options.map((opt, i) =>
      new ButtonBuilder()
        .setCustomId(`staffapp_ans_${question.id}_${i}`)
        .setLabel(opt.slice(0, 80))
        .setStyle(ButtonStyle.Secondary)
    )
  );
  embed.setFooter({ text: 'Click a button below to answer.' });
  return { embeds: [embed], components: [row] };
}

async function startApplication(channel, user) {
  const application = {
    userId: user.id,
    username: user.username,
    guildId: channel.guild.id,
    phase: 'part1',
    currentIndex: 0,
    answers: {},
    status: 'in_progress'
  };
  store.setApplication(channel.id, application);

  const firstQuestion = PART1_QUESTIONS[0];
  await channel.send(buildQuestionMessage(firstQuestion, 1, PART1_QUESTIONS.length, channel.client, 'Staff Application - Part 1'));
}

function buildScenarioQueue(application) {
  const trackAnswer = application.answers['q2'] || '';
  const isServerOnly = trackAnswer.startsWith('Server Staff');

  const queue = [];
  PART2_QUESTIONS.forEach(q => queue.push({ ...q, part: 'Part 2 (Server Staff Scenarios)' }));
  if (!isServerOnly) {
    PART3_QUESTIONS.forEach(q => queue.push({ ...q, part: 'Part 3 (Network Staff Scenarios)' }));
  }
  ADDON_QUESTIONS.forEach(q => queue.push({ ...q, part: 'Additional Scenarios' }));
  return queue;
}

async function advanceQuestion(channel, application) {
  if (application.phase === 'part1') {
    application.currentIndex += 1;

    if (application.currentIndex >= PART1_QUESTIONS.length) {
      application.phase = 'scenarios';
      application.scenarioQueue = buildScenarioQueue(application);
      application.currentIndex = 0;
      store.setApplication(channel.id, application);

      if (application.scenarioQueue.length === 0) {
        await finishApplication(channel, application);
        return;
      }

      await channel.send('✅ Part 1 complete! Moving on to scenario-based questions.');
      const nextQuestion = application.scenarioQueue[0];
      await channel.send(buildQuestionMessage(nextQuestion, 1, application.scenarioQueue.length, channel.client, 'Staff Application - Scenarios'));
      return;
    }

    store.setApplication(channel.id, application);
    const nextQuestion = PART1_QUESTIONS[application.currentIndex];
    await channel.send(buildQuestionMessage(nextQuestion, application.currentIndex + 1, PART1_QUESTIONS.length, channel.client, 'Staff Application - Part 1'));
    return;
  }

  application.currentIndex += 1;

  if (application.currentIndex >= application.scenarioQueue.length) {
    await finishApplication(channel, application);
    return;
  }

  store.setApplication(channel.id, application);
  const nextQuestion = application.scenarioQueue[application.currentIndex];
  await channel.send(buildQuestionMessage(nextQuestion, application.currentIndex + 1, application.scenarioQueue.length, channel.client, 'Staff Application - Scenarios'));
}

function buildSummaryEmbeds(application) {
  const embeds = [];

  const part1Fields = PART1_QUESTIONS.map(q => ({
    name: q.text.slice(0, 256),
    value: (application.answers[q.id] || '(no answer)').slice(0, 1024)
  }));
  embeds.push(
    new EmbedBuilder()
      .setTitle(`📋 Staff Application - Part 1: ${application.username}`)
      .addFields(part1Fields)
      .setColor(0x8A5CF6)
  );

  const queue = application.scenarioQueue || [];
  const groupedByPart = {};
  queue.forEach(q => {
    if (!groupedByPart[q.part]) groupedByPart[q.part] = [];
    groupedByPart[q.part].push(q);
  });

  for (const [partLabel, questions] of Object.entries(groupedByPart)) {
    const fields = questions.map(q => ({
      name: q.text.slice(0, 256),
      value: (application.answers[q.id] || '(no answer)').slice(0, 1024)
    }));
    embeds.push(
      new EmbedBuilder()
        .setTitle(`📋 ${partLabel}: ${application.username}`)
        .addFields(fields)
        .setColor(0x8A5CF6)
    );
  }

  embeds[embeds.length - 1].setTimestamp();
  return embeds;
}

async function finishApplication(channel, application) {
  application.status = 'complete';
  store.setApplication(channel.id, application);

  const summaryEmbeds = buildSummaryEmbeds(application);

  await channel.send({
    content: 'Thank you! Your application is complete. Staff will review your answers and follow up with next steps.'
  });

  try {
    const client = channel.client;
    const staffGuild = client.guilds.cache.get(STAFF_SERVER_ID);
    if (staffGuild) {
      const reviewChannel = await getOrCreateLogChannel(staffGuild, 'staff-application-submissions');
      await reviewChannel.send({ content: `New Staff Application submitted in <#${channel.id}> (${channel.guild.name}).` });
      await reviewChannel.send({ embeds: summaryEmbeds.slice(0, 10) });
    }
  } catch (error) {
    console.error('Failed to post staff application summary to Staff server:', error);
  }
}

function getCurrentQuestion(application) {
  if (application.phase === 'part1') {
    return PART1_QUESTIONS[application.currentIndex];
  }
  return application.scenarioQueue[application.currentIndex];
}

async function handleButtonAnswer(interaction) {
  const application = store.getApplication(interaction.channel.id);
  if (!application || application.status !== 'in_progress') {
    await interaction.reply({ content: 'This application is not currently active.', ephemeral: true });
    return;
  }

  if (interaction.user.id !== application.userId) {
    await interaction.reply({ content: 'Only the applicant can answer this application.', ephemeral: true });
    return;
  }

  const currentQuestion = getCurrentQuestion(application);
  const parts = interaction.customId.split('_');
  const optionIndex = parseInt(parts[parts.length - 1], 10);
  const answerText = currentQuestion.options[optionIndex];

  application.answers[currentQuestion.id] = answerText;
  store.setApplication(interaction.channel.id, application);

  await interaction.update({ content: `Answered: **${answerText}**`, embeds: [], components: [] });
  await advanceQuestion(interaction.channel, application);
}

async function handleGuildSelectAnswer(interaction) {
  const application = store.getApplication(interaction.channel.id);
  if (!application || application.status !== 'in_progress') {
    await interaction.reply({ content: 'This application is not currently active.', ephemeral: true });
    return;
  }

  if (interaction.user.id !== application.userId) {
    await interaction.reply({ content: 'Only the applicant can answer this application.', ephemeral: true });
    return;
  }

  const currentQuestion = getCurrentQuestion(application);
  const selectedGuildId = interaction.values[0];
  const selectedGuild = interaction.client.guilds.cache.get(selectedGuildId);
  const answerText = selectedGuild ? selectedGuild.name : selectedGuildId;

  application.answers[currentQuestion.id] = answerText;
  store.setApplication(interaction.channel.id, application);

  await interaction.update({ content: `Answered: **${answerText}**`, embeds: [], components: [] });
  await advanceQuestion(interaction.channel, application);
}

async function handleMessageReply(message) {
  if (message.author.bot) return false;

  const application = store.getApplication(message.channel.id);
  if (!application || application.status !== 'in_progress') return false;
  if (message.author.id !== application.userId) return false;

  const currentQuestion = getCurrentQuestion(application);
  if (!currentQuestion || currentQuestion.type !== 'text') return false;

  application.answers[currentQuestion.id] = message.content;
  store.setApplication(message.channel.id, application);

  await advanceQuestion(message.channel, application);
  return true;
}

function isStaffAppButton(customId) {
  return customId.startsWith('staffapp_ans_');
}

function isStaffAppGuildSelect(customId) {
  return customId.startsWith('staffapp_guildselect_');
}

async function handleInteraction(interaction) {
  if (interaction.isButton() && isStaffAppButton(interaction.customId)) {
    await handleButtonAnswer(interaction);
    return true;
  }
  if (interaction.isStringSelectMenu() && isStaffAppGuildSelect(interaction.customId)) {
    await handleGuildSelectAnswer(interaction);
    return true;
  }
  return false;
}

module.exports = {
  startApplication,
  handleButtonAnswer,
  handleGuildSelectAnswer,
  handleMessageReply,
  isStaffAppButton,
  isStaffAppGuildSelect,
  handleInteraction
};