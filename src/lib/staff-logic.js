// src/lib/staff-logic.js
import { fetchFromBot } from './bot-api.js';

export async function getStaffData(guildId = 'all') {
  const [serversData, ticketsData, applicationsData] = await Promise.all([
    fetchFromBot('/api/servers'),
    fetchFromBot('/api/tickets'),
    fetchFromBot('/api/applications'),
  ]);

  let guildOptionsData = null;
  if (guildId !== 'all') {
    guildOptionsData = await fetchFromBot(`/api/guild-options?guildId=${guildId}`);
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
