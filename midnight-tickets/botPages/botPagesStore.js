const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const STORE_PATH = path.join(DATA_DIR, 'botPagesContent.json');

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = { pages: {} };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getPageContent(slug) {
  const store = loadStore();
  return store.pages[slug] || null;
}

function setPageContent(slug, data) {
  const store = loadStore();
  store.pages[slug] = data;
  saveStore(store);
}

function getAllPageContent() {
  const store = loadStore();
  return store.pages;
}

module.exports = {
  getPageContent,
  setPageContent,
  getAllPageContent
};