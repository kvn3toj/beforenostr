const { chromium } = require('playwright');

async function testAdminDataVerification() {
  console.log('🎯 Iniciando verificación de datos en Gamifier Admin...\n');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('📝 Paso 1: Iniciando sesión como administrador...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/');
    
    // Verificar login exitoso
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }
    
    await page.waitForTimeout(2000);

    // 2. VERIFICAR MUNDOS
    console.log('\n📝 Paso 2: Verificando página de Mundos...');
    await page.goto('http://localhost:3333/mundos');
    await page.waitForLoadState('networkidle');
    
    // Buscar datos de mundos
    const mundosData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, [role="row"]');
      return rows.length;
    });
    
    if (mundosData > 0) {
      console.log(`✅ Mundos encontrados: ${mundosData} registros`);
      
      // Verificar algunos mundos específicos
      const mundoNames = await page.evaluate(() => {
        const names = [];
        document.querySelectorAll('td, [role="cell"]').forEach(cell => {
          if (cell.textContent.includes('Gamificación Educativa') || 
              cell.textContent.includes('Desarrollo Profesional') ||
              cell.textContent.includes('Innovación Social')) {
            names.push(cell.textContent.trim());
          }
        });
        return names;
      });
      
      if (mundoNames.length > 0) {
        console.log('  - Mundos encontrados:', mundoNames);
      }
    } else {
      console.log('❌ No se encontraron datos de mundos');
    }
    
    await page.screenshot({ path: 'debug-mundos-data.png' });

    // 3. VERIFICAR USUARIOS
    console.log('\n📝 Paso 3: Verificando página de Usuarios...');
    await page.goto('http://localhost:3333/users');
    await page.waitForLoadState('networkidle');
    
    // Buscar datos de usuarios
    const usersData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, [role="row"]');
      return rows.length;
    });
    
    if (usersData > 0) {
      console.log(`✅ Usuarios encontrados: ${usersData} registros`);
      
      // Verificar algunos usuarios específicos
      const userEmails = await page.evaluate(() => {
        const emails = [];
        document.querySelectorAll('td, [role="cell"]').forEach(cell => {
          if (cell.textContent.includes('@gamifier.com')) {
            emails.push(cell.textContent.trim());
          }
        });
        return emails;
      });
      
      if (userEmails.length > 0) {
        console.log('  - Emails encontrados:', userEmails);
      }
    } else {
      console.log('❌ No se encontraron datos de usuarios');
    }
    
    await page.screenshot({ path: 'debug-users-data.png' });

    // 4. VERIFICAR TOKENS
    console.log('\n📝 Paso 4: Verificando página de Tokens...');
    await page.goto('http://localhost:3333/tokens');
    await page.waitForLoadState('networkidle');
    
    // Buscar datos de tokens
    const tokensData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, [role="row"]');
      return rows.length;
    });
    
    if (tokensData > 0) {
      console.log(`✅ Tokens encontrados: ${tokensData} registros`);
      
      // Verificar tipos de tokens
      const tokenTypes = await page.evaluate(() => {
        const types = new Set();
        document.querySelectorAll('td, [role="cell"]').forEach(cell => {
          if (cell.textContent.includes('UNIT') || cell.textContent.includes('TOIN')) {
            types.add(cell.textContent.trim());
          }
        });
        return Array.from(types);
      });
      
      if (tokenTypes.length > 0) {
        console.log('  - Tipos de tokens encontrados:', tokenTypes);
      }
    } else {
      console.log('❌ No se encontraron datos de tokens');
    }
    
    await page.screenshot({ path: 'debug-tokens-data.png' });

    // 5. VERIFICAR WALLET
    console.log('\n📝 Paso 5: Verificando página de Wallet...');
    await page.goto('http://localhost:3333/wallet');
    await page.waitForLoadState('networkidle');
    
    // Buscar datos de wallets
    const walletsData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, [role="row"]');
      return rows.length;
    });
    
    if (walletsData > 0) {
      console.log(`✅ Wallets encontradas: ${walletsData} registros`);
    } else {
      console.log('❌ No se encontraron datos de wallets');
    }
    
    await page.screenshot({ path: 'debug-wallet-data.png' });

    // 6. VERIFICAR GRUPOS
    console.log('\n📝 Paso 6: Verificando página de Grupos...');
    await page.goto('http://localhost:3333/groups');
    await page.waitForLoadState('networkidle');
    
    // Buscar datos de grupos
    const groupsData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, [role="row"]');
      return rows.length;
    });
    
    if (groupsData > 0) {
      console.log(`✅ Grupos encontrados: ${groupsData} registros`);
      
      // Verificar nombres de grupos
      const groupNames = await page.evaluate(() => {
        const names = [];
        document.querySelectorAll('td, [role="cell"]').forEach(cell => {
          if (cell.textContent.includes('Innovadores') || 
              cell.textContent.includes('Gamificadores') ||
              cell.textContent.includes('Consejo') ||
              cell.textContent.includes('Amigos')) {
            names.push(cell.textContent.trim());
          }
        });
        return names;
      });
      
      if (groupNames.length > 0) {
        console.log('  - Grupos encontrados:', groupNames);
      }
    } else {
      console.log('❌ No se encontraron datos de grupos');
    }
    
    await page.screenshot({ path: 'debug-groups-data.png' });

    // 7. VERIFICAR ANALYTICS
    console.log('\n📝 Paso 7: Verificando página de Analytics...');
    await page.goto('http://localhost:3333/analytics');
    await page.waitForLoadState('networkidle');
    
    // Buscar gráficos o datos de analytics
    const analyticsCharts = await page.evaluate(() => {
      const charts = document.querySelectorAll('canvas, svg[role="img"], .recharts-wrapper');
      return charts.length;
    });
    
    if (analyticsCharts > 0) {
      console.log(`✅ Gráficos de analytics encontrados: ${analyticsCharts}`);
    } else {
      console.log('❌ No se encontraron gráficos de analytics');
    }
    
    await page.screenshot({ path: 'debug-analytics-data.png' });

    console.log('\n🎉 Verificación de datos completada');
    
    // Resumen final
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log('- Mundos: ' + (mundosData > 0 ? '✅' : '❌'));
    console.log('- Usuarios: ' + (usersData > 0 ? '✅' : '❌'));
    console.log('- Tokens: ' + (tokensData > 0 ? '✅' : '❌'));
    console.log('- Wallets: ' + (walletsData > 0 ? '✅' : '❌'));
    console.log('- Grupos: ' + (groupsData > 0 ? '✅' : '❌'));
    console.log('- Analytics: ' + (analyticsCharts > 0 ? '✅' : '❌'));

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    await page.screenshot({ 
      path: `debug-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testAdminDataVerification().catch(console.error); 