import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: 'test-results/artifacts',
  
  // ✅ TIMEOUT CONFIGURATION - Aumentado según recomendaciones
  timeout: 60 * 1000, // 60 segundos para cada test (era 30s por defecto)
  expect: {
    timeout: 10 * 1000, // 10 segundos para assertions (era 5s por defecto)
  },
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Configuración dinámica de baseURL
  use: {
    // El baseURL se configurará dinámicamente en globalSetup, fallback a VITE_BASE_URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || process.env.VITE_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // ✅ ACTION TIMEOUTS - Configuración adicional para acciones lentas
    actionTimeout: 15 * 1000, // 15 segundos para acciones (clicks, fills, etc.)
    navigationTimeout: 30 * 1000, // 30 segundos para navegación
  },

  // Setup global para detectar puerto antes de ejecutar tests
  globalSetup: path.resolve(__dirname, 'utils/global-setup.cjs'),

  projects: [
    // Setup project para autenticación persistente
    { 
      name: 'setup', 
      testMatch: /.*\.setup\.ts/,
      // ✅ Timeout específico para setup (puede ser más lento)
      timeout: 90 * 1000, // 90 segundos para setup de autenticación
    },

    // Projects principales con autenticación persistente
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Usar estado de autenticación guardado
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],

  // Configuración del servidor web (opcional, para CI)
  webServer: process.env.CI ? {
    command: 'npm run dev',
    port: parseInt(process.env.VITE_BASE_URL?.split(':')[2] || '3001'),
    reuseExistingServer: false,
    timeout: 120 * 1000,
  } : undefined,
}); 