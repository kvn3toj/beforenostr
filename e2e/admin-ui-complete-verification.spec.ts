import { test, expect, Page } from '@playwright/test';

// Configuration constants
const FRONTEND_BASE_URL = 'http://localhost:3000';
const BACKEND_BASE_URL = 'http://localhost:3002';
const ADMIN_CREDENTIALS = {
  email: 'admin@gamifier.com',
  password: 'admin123'
};

// Lista completa de funcionalidades a verificar (Fases 1-6 del backend)
const BACKEND_MODULES = {
  'FASE_1_CORE': [
    'Users', 'Roles', 'Permissions', 'Content Items', 'Mundos', 'Experiences', 
    'Activities', 'Playlists', 'Video Items'
  ],
  'FASE_2_GAMIFICATION': [
    'Tokens', 'Wallet', 'Merits', 'Challenges', 'User Challenges'
  ],
  'FASE_3_MONITORING': [
    'Analytics', 'Monitoring', 'Health Report', 'Audit Logs'
  ],
  'FASE_4_MULTI_PLATFORM': [
    'Multi Platform Support', 'Video Metadata', 'Content Types'
  ],
  'FASE_5_SOCIAL': [
    'Social', 'Groups', 'Marketplace', 'Invitations'
  ],
  'FASE_6_AI_QUESTIONS': [
    'Questions', 'Video Engagement', 'AI Question Generator'
  ]
};

test.describe.serial('🚀 GAMIFIER ADMIN - Verificación E2E Completa de Backend', () => {
  let page: Page;
  let consoleErrors: string[] = [];
  let networkErrors: string[] = [];
  let foundModules: string[] = [];
  let missingModules: string[] = [];

  test.beforeAll(async ({ browser }) => {
    console.log('🎯 === INICIANDO VERIFICACIÓN E2E COMPLETA DEL BACKEND ===');
    console.log('📋 Módulos a verificar:');
    Object.entries(BACKEND_MODULES).forEach(([fase, modules]) => {
      console.log(`   ${fase}: ${modules.join(', ')}`);
    });
    console.log('');

    // Create a persistent context for all tests
    page = await browser.newPage();
    
    // Setup error monitoring
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`Console Error: ${msg.text()}`);
        console.log(`🔴 Console Error: ${msg.text()}`);
      }
    });

    page.on('requestfailed', (request) => {
      const errorText = request.failure()?.errorText || 'Unknown error';
      networkErrors.push(`Network Error: ${request.method()} ${request.url()} - ${errorText}`);
      console.log(`🌐 Network Error: ${request.method()} ${request.url()} - ${errorText}`);
    });

    // Perform login once for all tests
    console.log('🔐 Realizando login de administrador...');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login credentials
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"], input[placeholder*="password" i]').first();
    
    await emailInput.fill(ADMIN_CREDENTIALS.email);
    await passwordInput.fill(ADMIN_CREDENTIALS.password);

    // Click login button
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")').first();
    await loginButton.click();

    // Wait for redirect and verify login success
    await page.waitForURL('/', { timeout: 15000 });
    
    // Verificación robusta del login exitoso
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"], button[aria-label*="Menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló - Aún en página de login');
      }
    }
  });

  test.afterAll(async () => {
    // Tomar screenshot final
    await page.screenshot({ 
      path: 'gamifier-admin-overview.png',
      fullPage: true 
    });

    // Summary report
    console.log('\n📊 === RESUMEN DE VERIFICACIÓN E2E ===');
    console.log(`✅ Módulos Encontrados (${foundModules.length}): ${foundModules.join(', ')}`);
    console.log(`❌ Módulos No Encontrados (${missingModules.length}): ${missingModules.join(', ')}`);
    console.log(`🔴 Errores de Consola: ${consoleErrors.length}`);
    console.log(`🌐 Errores de Red: ${networkErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('\n🔴 Console Errors:');
      consoleErrors.forEach((error, index) => console.log(`${index + 1}. ${error}`));
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 Network Errors:');
      networkErrors.forEach((error, index) => console.log(`${index + 1}. ${error}`));
    }

    // Porcentaje de cobertura
    const totalModules = Object.values(BACKEND_MODULES).flat().length;
    const coverage = (foundModules.length / totalModules) * 100;
    console.log(`\n🎯 COBERTURA TOTAL: ${coverage.toFixed(1)}% (${foundModules.length}/${totalModules} módulos)`);

    await page.close();
  });

  // Helper function to check if module exists
  async function checkModule(moduleName: string, selectors: string[]): Promise<boolean> {
    console.log(`🔍 Verificando: ${moduleName}...`);
    
    for (const selector of selectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 2000 })) {
          console.log(`   ✅ ${moduleName} - Encontrado`);
          foundModules.push(moduleName);
          return true;
        }
      } catch {
        // Continue to next selector
      }
    }
    
    console.log(`   ❌ ${moduleName} - No encontrado`);
    missingModules.push(moduleName);
    return false;
  }

  test('🏠 Verificar Dashboard Principal', async () => {
    console.log('🏠 === VERIFICANDO DASHBOARD PRINCIPAL ===');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify home page loads
    await expect(page).toHaveTitle(/Gamifier|Home|Dashboard/i);
    console.log('✅ Dashboard Principal cargado');
  });

  test('👥 FASE 1 - Verificar Gestión de Usuarios y Roles', async () => {
    console.log('👥 === FASE 1: GESTIÓN DE USUARIOS Y ROLES ===');
    
    // Users
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    await checkModule('Users', [
      'h1:has-text("Users"), h2:has-text("Users")',
      'text="admin@gamifier.com"',
      'table, .MuiDataGrid-root',
      'button:has-text("Create"), button:has-text("Crear")'
    ]);

    // Roles
    await page.goto('/roles');
    await page.waitForLoadState('networkidle');
    await checkModule('Roles', [
      'h1:has-text("Roles"), h2:has-text("Roles")',
      'text="admin"',
      'table, .MuiDataGrid-root'
    ]);

    // Permissions
    await page.goto('/permissions');
    await page.waitForLoadState('networkidle');
    await checkModule('Permissions', [
      'h1:has-text("Permissions"), h2:has-text("Permisos")',
      'text="users:read"',
      'table, .MuiDataGrid-root'
    ]);
  });

  test('📹 FASE 1 - Verificar Gestión de Contenido', async () => {
    console.log('📹 === FASE 1: GESTIÓN DE CONTENIDO ===');
    
    // Content Items
    await page.goto('/items');
    await page.waitForLoadState('networkidle');
    await checkModule('Content Items', [
      'h1:has-text("Items"), h2:has-text("Content")',
      'table, .MuiDataGrid-root',
      'text="TED"'
    ]);

    // Mundos
    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');
    await checkModule('Mundos', [
      'h1:has-text("Worlds"), h2:has-text("Mundos")',
      'text="Mundo de Programación"',
      'table, .MuiDataGrid-root'
    ]);

    // Playlists
    await page.goto('/playlists');
    await page.waitForLoadState('networkidle');
    await checkModule('Playlists', [
      'h1:has-text("Playlists")',
      'text="Fundamentos de Gamificación"',
      'table, .MuiDataGrid-root'
    ]);
  });

  test('🪙 FASE 2 - Verificar Sistema de Gamificación (CRÍTICO)', async () => {
    console.log('🪙 === FASE 2: SISTEMA DE GAMIFICACIÓN (TOKENS, WALLET, MERITS) ===');
    
    // Buscar Tokens en diferentes ubicaciones posibles
    const tokenLocations = [
      '/tokens',
      '/gamification/tokens', 
      '/wallet/tokens',
      '/settings/tokens',
      '/admin/tokens'
    ];

    let tokensFound = false;
    for (const location of tokenLocations) {
      try {
        await page.goto(location);
        await page.waitForLoadState('networkidle');
        tokensFound = await checkModule('Tokens', [
          'h1:has-text("Tokens")',
          'text="Token"',
          'button:has-text("Create Token")',
          'table, .MuiDataGrid-root'
        ]);
        if (tokensFound) break;
      } catch {
        // Continue to next location
      }
    }

    // Buscar Wallet
    const walletLocations = [
      '/wallet',
      '/gamification/wallet',
      '/users/wallet',
      '/tokens/wallet'
    ];

    let walletFound = false;
    for (const location of walletLocations) {
      try {
        await page.goto(location);
        await page.waitForLoadState('networkidle');
        walletFound = await checkModule('Wallet', [
          'h1:has-text("Wallet")',
          'text="Wallet"',
          'text="Balance"',
          'table, .MuiDataGrid-root'
        ]);
        if (walletFound) break;
      } catch {
        // Continue to next location
      }
    }

    // Buscar Merits
    const meritsLocations = [
      '/merits',
      '/gamification/merits',
      '/users/merits',
      '/achievements/merits'
    ];

    let meritsFound = false;
    for (const location of meritsLocations) {
      try {
        await page.goto(location);
        await page.waitForLoadState('networkidle');
        meritsFound = await checkModule('Merits', [
          'h1:has-text("Merits")',
          'text="Merit"',
          'button:has-text("Create Merit")',
          'table, .MuiDataGrid-root'
        ]);
        if (meritsFound) break;
      } catch {
        // Continue to next location
      }
    }

    // Challenges
    try {
      await page.goto('/challenges');
      await page.waitForLoadState('networkidle');
      await checkModule('Challenges', [
        'h1:has-text("Challenges")',
        'text="Challenge"',
        'table, .MuiDataGrid-root'
      ]);
    } catch {
      // Module might not be implemented in frontend yet
    }
  });

  test('📊 FASE 3 - Verificar Sistema de Monitoreo', async () => {
    console.log('📊 === FASE 3: SISTEMA DE MONITOREO ===');
    
    // Analytics
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    await checkModule('Analytics', [
      'h1:has-text("Analytics")',
      'text="Analytics"',
      '.chart, .metric'
    ]);

    // Audit Logs
    try {
      await page.goto('/audit-logs');
      await page.waitForLoadState('networkidle');
      await checkModule('Audit Logs', [
        'h1:has-text("Audit")',
        'text="Audit"',
        'table, .MuiDataGrid-root'
      ]);
    } catch {
      // Try alternative locations
      try {
        await page.goto('/admin/audit');
        await page.waitForLoadState('networkidle');
        await checkModule('Audit Logs', [
          'h1:has-text("Audit")',
          'text="Audit"',
          'table, .MuiDataGrid-root'
        ]);
      } catch {
        missingModules.push('Audit Logs');
      }
    }

    // Monitoring
    try {
      await page.goto('/monitoring');
      await page.waitForLoadState('networkidle');
      await checkModule('Monitoring', [
        'h1:has-text("Monitoring")',
        'text="Health"',
        'text="Status"'
      ]);
    } catch {
      missingModules.push('Monitoring');
    }
  });

  test('🌐 FASE 5 - Verificar Sistema Social', async () => {
    console.log('🌐 === FASE 5: SISTEMA SOCIAL ===');
    
    // Social/Groups
    const socialLocations = ['/social', '/groups', '/social/groups'];
    
    let socialFound = false;
    for (const location of socialLocations) {
      try {
        await page.goto(location);
        await page.waitForLoadState('networkidle');
        socialFound = await checkModule('Social/Groups', [
          'h1:has-text("Social"), h1:has-text("Groups")',
          'text="Group"',
          'table, .MuiDataGrid-root'
        ]);
        if (socialFound) break;
      } catch {
        // Continue to next location
      }
    }

    // Marketplace
    try {
      await page.goto('/marketplace');
      await page.waitForLoadState('networkidle');
      await checkModule('Marketplace', [
        'h1:has-text("Marketplace")',
        'text="Marketplace"',
        'table, .MuiDataGrid-root'
      ]);
    } catch {
      missingModules.push('Marketplace');
    }

    // Invitations
    try {
      await page.goto('/invitations');
      await page.waitForLoadState('networkidle');
      await checkModule('Invitations', [
        'h1:has-text("Invitations")',
        'text="Invitation"',
        'table, .MuiDataGrid-root'
      ]);
    } catch {
      missingModules.push('Invitations');
    }
  });

  test('❓ FASE 6 - Verificar Sistema de Preguntas AI', async () => {
    console.log('❓ === FASE 6: SISTEMA DE PREGUNTAS AI ===');
    
    // Questions
    try {
      await page.goto('/questions');
      await page.waitForLoadState('networkidle');
      await checkModule('Questions', [
        'h1:has-text("Questions")',
        'text="Question"',
        'table, .MuiDataGrid-root'
      ]);
    } catch {
      // Try in video config
      try {
        await page.goto('/items');
        await page.waitForLoadState('networkidle');
        
        // Look for video config or questions tab
        const videoLink = page.locator('a[href*="/video-config"], button:has-text("Configure")').first();
        if (await videoLink.isVisible({ timeout: 3000 })) {
          await videoLink.click();
          await page.waitForLoadState('networkidle');
          
          const questionsTab = page.locator('button:has-text("Questions"), [role="tab"]:has-text("Questions")');
          if (await questionsTab.isVisible({ timeout: 3000 })) {
            await questionsTab.click();
            await checkModule('Questions', [
              'text="Question"',
              'button:has-text("Generate")',
              'textarea, input[placeholder*="question"]'
            ]);
          }
        }
      } catch {
        missingModules.push('Questions');
      }
    }

    // AI Question Generator
    try {
      const aiGeneratorSelectors = [
        'button:has-text("Generate Questions")',
        'button:has-text("AI Generator")',
        'text="Gemini"',
        'text="Generate with AI"'
      ];
      
      let aiFound = false;
      for (const selector of aiGeneratorSelectors) {
        if (await page.locator(selector).isVisible({ timeout: 2000 })) {
          aiFound = true;
          break;
        }
      }
      
      if (aiFound) {
        foundModules.push('AI Question Generator');
        console.log('   ✅ AI Question Generator - Encontrado');
      } else {
        missingModules.push('AI Question Generator');
        console.log('   ❌ AI Question Generator - No encontrado');
      }
    } catch {
      missingModules.push('AI Question Generator');
    }
  });

  test('🔍 Verificar Menú y Navegación Completa', async () => {
    console.log('🔍 === VERIFICANDO MENÚ Y NAVEGACIÓN ===');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos de menú/navegación
    const menuSelectors = [
      'nav a, .sidebar a, .menu a',
      'button[role="menuitem"]',
      '[data-testid*="menu"], [data-testid*="nav"]'
    ];
    
    let menuItems: string[] = [];
    
    for (const selector of menuSelectors) {
      try {
        const elements = await page.locator(selector).all();
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.trim()) {
            menuItems.push(text.trim());
          }
        }
      } catch {
        // Continue to next selector
      }
    }
    
    console.log('📋 Items de menú encontrados:');
    menuItems.forEach(item => console.log(`   - ${item}`));
    
    // Buscar específicamente elementos de gamificación
    const gamificationKeywords = ['token', 'wallet', 'merit', 'challenge', 'gamif'];
    const foundGamificationItems = menuItems.filter(item => 
      gamificationKeywords.some(keyword => 
        item.toLowerCase().includes(keyword)
      )
    );
    
    if (foundGamificationItems.length > 0) {
      console.log('🪙 Items de gamificación en menú:');
      foundGamificationItems.forEach(item => console.log(`   ✅ ${item}`));
    } else {
      console.log('⚠️ No se encontraron items de gamificación en el menú principal');
    }
  });
}); 