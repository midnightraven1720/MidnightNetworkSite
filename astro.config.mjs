// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  // Forms (DM card, time zone, reminders) only accept posts from this site.
  security: {
    checkOrigin: true,
  },
  // Old pages from the previous network point at their new homes.
  redirects: {
    '/user-dashboard': '/me',
    '/staff-dashboard': '/staff',
    '/account': '/me',
    '/about-us': '/start',
    '/partnerships': '/bots#partnership-bot',
    '/servers': '/',
    '/servers/[...slug]': '/',
    '/dashboard/[...slug]': '/me',
  },
});
