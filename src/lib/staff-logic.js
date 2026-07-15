// src/lib/staff-logic.js
import { fetchFromBot } from './bot-api.js';
import { BOT_API_HOSTS } from '../data/bot-hosts.js';

const TICKETS_API = BOT_API_HOSTS['Midnight Tickets'];

export async function getStaffData(guildId = 'all') {
  const [serversData, ticketsData, applicationsData] = await Promise.all([
    fetchFromBot(TICKETS_API, '/api/servers'),
    fetchFromBot(TICKETS_API, '/api/tickets'),
    fetchFromBot(TICKETS_API, '/api/applications'),
  ]);

  let guildOptionsData = null;
  if (guildId !== 'all') {
    guildOptionsData = await fetchFromBot(TICKETS_API, `/api/guild-options?guildId=${guildId}`);
  }

  return {
    servers: serversData?.servers || [],
    filteredTickets: guildId === 'all' ? (ticketsData?.tickets || []) : (ticketsData?.tickets || []).filter(t => t.guildId === guildId),
    filteredApps: guildId === 'all' ? (applicationsData?.applications || []) : (applicationsData?.applications || []).filter(a => a.guildId === guildId),
    guildOptionsData,
    ticketsAvailable: ticketsData !== null,
    applicationsAvailable: applicationsData !== null,
  };
}
