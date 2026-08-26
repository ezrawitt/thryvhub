import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const localChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    launchOptions: existsSync(localChrome)?{executablePath:localChrome}:undefined,
  },
  webServer: {
    command: 'node tests/pages-server.mjs',
    url: 'http://127.0.0.1:4173/thryvhub/',
    reuseExistingServer: false,
  },
});
