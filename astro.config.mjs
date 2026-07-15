// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    checkOrigin: false,
  },
  redirects: {
    '/servers/server-1': '/servers/den-of-desire',
    '/servers/server-2': '/servers/underground-gamer-lounge',
    '/servers/server-3': '/servers/chaos-midnight-house',
    '/servers/server-4': '/servers/smutty-library-cafe',
    '/servers/server-5': '/servers/velvet-cosy-collars',
    '/servers/server-6': '/servers/advertising-lounge',
  },
});