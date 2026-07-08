const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const STORE_PATH = path.join(DATA_DIR, 'verificationTickets.json');

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = { tickets: {}, strikes: {} };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getTicket(channelId) {
  const store = loadStore();
  return store.tickets[channelId] || null;
}

function setTicket(channelId, data) {
  const store = loadStore();
  store.tickets[channelId] = data;
  saveStore(store);
}

function deleteTicket(channelId) {
  const store = loadStore();
  delete store.tickets[channelId];
  saveStore(store);
}

function getAllTickets() {
  const store = loadStore();
  return store.tickets;
}

function getStrikes(guildId, userId) {
  const store = loadStore();
  return (store.strikes[guildId] && store.strikes[guildId][userId]) || 0;
}

function addStrike(guildId, userId) {
  const store = loadStore();
  if (!store.strikes[guildId]) store.strikes[guildId] = {};
  store.strikes[guildId][userId] = (store.strikes[guildId][userId] || 0) + 1;
  saveStore(store);
  return store.strikes[guildId][userId];
}

function resetStrikes(guildId, userId) {
  const store = loadStore();
  if (store.strikes[guildId]) {
    delete store.strikes[guildId][userId];
    saveStore(store);
  }
}

module.exports = {
  getTicket,
  setTicket,
  deleteTicket,
  getAllTickets,
  getStrikes,
  addStrike,
  resetStrikes
};