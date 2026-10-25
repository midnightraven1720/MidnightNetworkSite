// The guide text from the bots uses Discord's **bold** and `code`. This makes
// it safe HTML (everything escaped first) with just those two.
const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function md(text) {
  return escape(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// A Start-here item's title: commands get code styling.
export function what(text) {
  return text.startsWith('/') ? `<code>${escape(text)}</code>` : `<strong>${escape(text)}</strong>`;
}
