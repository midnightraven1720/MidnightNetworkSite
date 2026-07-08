const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const STORE_PATH = path.join(DATA_DIR, 'errorLog.json');
const MAX_ENTRIES = 25;

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = { errors: [] };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function logError(message, context) {
  const store = loadStore();
  store.errors.unshift({
    message: String(message).slice(0, 500),
    context: context || 'unknown',
    timestamp: new Date().toISOString()
  });
  store.errors = store.errors.slice(0, MAX_ENTRIES);
  saveStore(store);
}

function getErrors() {
  return loadStore().errors;
}

module.exports = {
  logError,
  getErrors
};