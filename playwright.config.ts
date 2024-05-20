import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options'

require('dotenv').config();

export default defineConfig<TestOptions>({
  timeout: 40000,
  globalTimeout: 60000,
  expect: {
    timeout: 2000
  },
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['json', { outputFile: 'test-results/report.json' }],
    ['junit',{ outputFile: 'test-results/report.xml' }],
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],
  globalSetup: require.resolve('./global_setup.ts'),
  globalTeardown: require.resolve('./global_teardown.ts'),

  use: {
    trace: 'on-first-retry',
    extraHTTPHeaders: {"Authorization": `Token ${process.env.ACCESS_TOKEN}`},
    globalsAPIURL: 'https://conduit-api.bondaracademy.com/api',
    actionTimeout: 2000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: { width: 1920, height: 1020}
    },
    baseURL: process.env.DEV === '1' ? 'https://conduit.bondaracademy.dev'
        : process.env.QA === '1' ? 'https://conduit.bondaracademy.qa'
        : process.env.PROD === '1' ? 'https://conduit.bondaracademy.prod'
        : 'https://conduit.bondaracademy.com',
  },

  projects: [
    {
      name: 'authentication', 
      testMatch: 'auth.setup.ts'
    },
    {
      name: 'staging',
      testMatch: 'tests/api3.spec.ts',
      use: { ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
        // baseURL: 'https://conduit.bondaracademy.com',
      },
      dependencies: ['authentication'],
      fullyParallel: false,
    },
    {
      name: 'api',
      testMatch: 'tests/sample.spec.ts',
      use: { ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
      },
      dependencies: ['authentication'],
    }
  ],
});
