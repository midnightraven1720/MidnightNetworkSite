require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const { commands } = require('./commands.js');
const { handleInteraction, isGuildAllowed } = require('./tickets/ticketHandler.js');
const verificationHandler = require('./verification/verificationHandler.js');
const verifiedTagsHandler = require('./verification/verifiedTagsHandler.js');
const staffAppHandler = require('./staffApplications/staffAppHandler.js');
const welcomeHandler = require('./verification/welcomeHandler.js');
const { startApiServer } = require('./apiServer.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('guildCreate', async guild => {
  if (!isGuildAllowed(guild.id)) {
    console.log(`Left unauthorized server: ${guild.name} (${guild.id})`);
    await guild.leave();
  }
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error(error);
  }

  verificationHandler.startVerificationTimer(client);
  console.log('Verification timer started.');

  startApiServer(client);
});

client.on('interactionCreate', async interaction => {
  const handledByWelcome = await welcomeHandler.handleInteraction(interaction);
  if (handledByWelcome) return;

  const handledByStaffApp = await staffAppHandler.handleInteraction(interaction);
  if (handledByStaffApp) return;

  const handledByTags = await verifiedTagsHandler.handleInteraction(interaction);
  if (handledByTags) return;

  const handledByVerification = await verificationHandler.handleInteraction(interaction);
  if (handledByVerification) return;

  await handleInteraction(interaction);
});

client.on('messageCreate', async message => {
  await staffAppHandler.handleMessageReply(message);
});

client.login(process.env.DISCORD_TOKEN);