const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const STORE_PATH = path.join(DATA_DIR, 'activeTickets.json');

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = { tickets: {} };
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

module.exports = {
  getTicket,
  setTicket,
  deleteTicket
};