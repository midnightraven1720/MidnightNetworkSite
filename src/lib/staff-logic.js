// src/lib/staff-logic.js
export async function getStaffData(API_BASE, API_KEY, guildId = 'all') {
  const fetchFromBot = async (path) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'x-api-key': API_KEY },
      });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  };

  // Fetch base data
  const [serversData, ticketsData, applicationsData] = await Promise.all([
    fetchFromBot('/api/servers'),
    fetchFromBot('/api/tickets'),
    fetchFromBot('/api/applications')
  ]);

  // Fetch roles specifically if a guild is selected
  let guildOptionsData = null;
  if (guildId !== 'all') {
    guildOptionsData = await fetchFromBot(`/api/guild-options?guildId=${guildId}`);
  }

  return {
    servers: serversData?.servers || [],
    filteredTickets: guildId === 'all' ? (ticketsData?.tickets || []) : (ticketsData?.tickets || []).filter(t => t.guildId === guildId),
    filteredApps: guildId === 'all' ? (applicationsData?.applications || []) : (applicationsData?.applications || []).filter(a => a.guildId === guildId),
    guildOptionsData, // This contains the roles/categories
    ticketsAvailable: ticketsData !== null,
    applicationsAvailable: applicationsData !== null,
  };
}