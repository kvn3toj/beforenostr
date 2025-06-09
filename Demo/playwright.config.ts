import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración Playwright para Tests UX CoomÜnity
 * Optimizada para verificar las heurísticas UX/UI implementadas
 * ACTUALIZADA: Apunta a la aplicación React unificada en localhost:3000
 */
export default defineConfig({
  testDir: './apps/superapp-unified/e2e',
  
  /* Configuración de ejecución */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 2,
  workers: process.env.CI ? 1 : undefined,
  
  /* Timeout global aumentado para tests adaptativos */
  timeout: 60000,
  
  /* Reporter configuración */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  /* Configuración global de tests */
  use: {
    /* URL base para todos los tests - ACTUALIZADA para la aplicación React */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace cuando un test falla */
    trace: 'on-first-retry',
    
    /* Screenshots en fallos */
    screenshot: 'only-on-failure',
    
    /* Video en fallos */
    video: 'retain-on-failure',
    
    /* User agent personalizado */
    userAgent: 'CoomUnity-UX-Tests/1.0',
    
    /* Timeouts optimizados para tests adaptativos */
    actionTimeout: 20000,
    navigationTimeout: 45000,
    
    /* Configuración adicional para estabilidad */
    launchOptions: {
      slowMo: process.env.CI ? 0 : 50,
    }
  },

  /* Configuración de proyectos de testing */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    /* Tests móviles */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        isMobile: true,
        hasTouch: true
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true
      },
    },

    /* Tests tablet */
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 }
      },
    },

    /* Tests específicos de UX-Heuristics con configuración optimizada */
    {
      name: 'UX-Desktop-Critical',
      testMatch: '**/ux-heuristics/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        actionTimeout: 25000,
        navigationTimeout: 50000,
      },
    },

    {
      name: 'UX-Mobile-Critical', 
      testMatch: '**/ux-heuristics/**/*.spec.ts',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true,
        actionTimeout: 25000,
        navigationTimeout: 50000,
      },
    }
  ],

  /* Configuración del servidor web de desarrollo - COMENTADA porque iniciamos manualmente */
  /* 
  webServer: {
    command: 'cd apps/superapp-unified && npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  */

  /* Directorio de outputs */
  outputDir: 'test-results/',
  
  /* Configuración adicional para mejores reports */
  expect: {
    timeout: 15000,
    
    toHaveScreenshot: { 
      threshold: 0.5, 
      maxDiffPixels: 1000 
    },
  },
  
  metadata: {
    project: 'CoomÜnity UX Heuristics Testing',
    version: '1.0.0',
    testType: 'UI/UX Validation',
    heuristics: [
      '1. Visibilidad del Estado del Sistema',
      '2. Consistencia y Estándares',
      '3. Experiencia Adaptativa y Contextual',
      '4. Control y Libertad del Usuario',
      '5. Navegación Intuitiva y Jerarquía',
      '6. Diseño Responsive',
      '7. Performance & Loading Experience'
    ]
  }
}); 