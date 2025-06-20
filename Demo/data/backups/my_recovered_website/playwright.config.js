// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuración Playwright para Tests UX CoomÜnity
 * Optimizada para verificar las 6 heurísticas implementadas
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Configuración de ejecución */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter configuración */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /* Configuración global de tests */
  use: {
    /* URL base para todos los tests */
    baseURL: 'http://localhost:8000',
    
    /* Collect trace cuando un test falla */
    trace: 'on-first-retry',
    
    /* Screenshots en fallos */
    screenshot: 'only-on-failure',
    
    /* Video en fallos */
    video: 'retain-on-failure',
    
    /* User agent personalizado */
    userAgent: 'CoomUnity-UX-Tests/1.0',
    
    /* Timeouts */
    actionTimeout: 10000,
    navigationTimeout: 15000,
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

    /* Tests específicos de UX */
    {
      name: 'UX-Desktop-Critical',
      testMatch: '**/ux-heuristics.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'UX-Mobile-Critical', 
      testMatch: '**/ux-heuristics.spec.js',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true
      },
    }
  ],

  /* Configuración del servidor web de desarrollo */
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    cwd: '.',
  },

  /* Directorio de outputs */
  outputDir: 'test-results/',
  
  /* Configuración de globalSetup si necesario */
  // globalSetup: require.resolve('./global-setup'),
  
  /* Configuración adicional para mejores reports */
  expect: {
    /* Timeout para assertions */
    timeout: 5000,
    
    /* Screenshots en assertions fallidas */
    toHaveScreenshot: { 
      threshold: 0.5, 
      maxDiffPixels: 1000 
    },
  },
  
  /* Configuración de metadatos para reportes */
  metadata: {
    project: 'CoomÜnity UX Heuristics Testing',
    version: '1.0.0',
    testType: 'UI/UX Validation',
    heuristics: [
      '1. Visibilidad del Estado del Sistema',
      '2. Consistencia y Estándares', 
      '3. Control y Libertad del Usuario',
      '4. Reconocimiento vs Recuerdo',
      '5. Navegación Intuitiva y Jerarquía',
      '6. Diseño Responsive'
    ]
  }
}); 