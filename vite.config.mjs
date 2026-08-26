import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/.
  // Keep local development rooted at / so the existing preview URL is unchanged.
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true'
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/'),
  plugins: [react()],
  server: {
    headers: noCacheHeaders,
  },
  preview: {
    headers: noCacheHeaders,
  },
});
