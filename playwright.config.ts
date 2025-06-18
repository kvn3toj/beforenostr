import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  
  // 🔐 CONFIGURACIÓN DE AUTENTICACIÓN GLOBAL
  // globalSetup: require.resolve('./e2e/global-auth-setup.ts'), // Temporalmente deshabilitado para test
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  use: {
    baseURL: 'http://localhost:2222',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    headless: false,
    slowMo: 1000,
    
    // 🚀 ESTADO DE AUTENTICACIÓN PERSISTENTE
    // Todos los tests comenzarán con sesión admin ya activa
    // storageState: './playwright/.auth/admin.json', // Temporalmente deshabilitado para test
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    
    // 🎯 PROYECTO ESPECIAL PARA TESTS DE LOGIN
    // Algunos tests necesitan empezar sin autenticación
    {
      name: 'auth-tests',
      testMatch: '**/login-*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // SIN storageState para tests de login
      },
    },
    
    // Commenting out other browsers for faster testing during development
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:2222',
    reuseExistingServer: true,
    timeout: 120000,
  },
}); 