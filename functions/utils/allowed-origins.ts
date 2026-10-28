/**
 * CORS allow-list shared by the API entry point and the weather endpoint.
 * Production origins come from config/lgu.config.json (portal.baseUrl) plus
 * the Cloudflare Pages project domain.
 */

import lguConfig from '../../config/lgu.config.json';

const PAGES_PROJECT = 'bettertaguig';

export const ALLOWED_ORIGINS = [
  lguConfig.portal.baseUrl,
  `https://${PAGES_PROJECT}.pages.dev`,
  'http://localhost:5173', // Vite dev server
  'http://localhost:8788', // Wrangler dev server
];
