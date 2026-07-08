const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const STORE_PATH = path.join(DATA_DIR, 'staffApplications.json');

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = { applications: {} };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getApplication(channelId) {
  const store = loadStore();
  return store.applications[channelId] || null;
}

function setApplication(channelId, data) {
  const store = loadStore();
  store.applications[channelId] = data;
  saveStore(store);
}

function deleteApplication(channelId) {
  const store = loadStore();
  delete store.applications[channelId];
  saveStore(store);
}

module.exports = {
  getApplication,
  setApplication,
  deleteApplication
};