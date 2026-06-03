import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // Extension testing: load unpacked extension
        launchOptions: {
          args: ['--disable-extensions-except=./dist', '--load-extension=./dist'],
        },
      },
    },
  ],
  // Start Vite dev server before tests
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
