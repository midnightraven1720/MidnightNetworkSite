const ticketTypes = {
  support: { label: 'General Support', emoji: '🎫', prefix: 'support', logChannel: 'support-ticket-logs' },
  report_user: { label: 'Report a User', emoji: '⚠️', prefix: 'report', logChannel: 'report-ticket-logs' },
  report_staff: { label: 'Report a Staff Member', emoji: '🚩', prefix: 'staffreport', logChannel: 'staffreport-ticket-logs' },
  staff_app: { label: 'Staff Application', emoji: '📋', prefix: 'staffapp', logChannel: 'staffapp-ticket-logs' },
  partnership: { label: 'Partnership Request', emoji: '🤝', prefix: 'partner', logChannel: 'partner-ticket-logs' }
};

module.exports = { ticketTypes };
