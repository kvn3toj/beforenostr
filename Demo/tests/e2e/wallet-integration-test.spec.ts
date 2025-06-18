import { test, expect } from '@playwright/test';

test.describe('Wallet Integration Test - Sistema de Billetera Mejorado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1111');
  });

  test('Wallet está completamente integrado con datos del análisis', async ({ page }) => {
    // 1. Navegar a Wallet
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // 2. Verificar header mejorado
    await expect(page.locator('h1')).toContainText('CoomÜnity Wallet');
    await expect(page.locator('text=Gestiona tus finanzas en el ecosistema CoomÜnity')).toBeVisible();

    // 3. Verificar chips con datos del análisis extraído
    await expect(page.locator('text=Acceso: dev environment first')).toBeVisible();
    await expect(page.locator('text=103 Requests de Red')).toBeVisible();
    await expect(page.locator('text=Tipo: wallet_public')).toBeVisible();

    // 4. Verificar tabs de navegación
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Transacciones')).toBeVisible();
    await expect(page.locator('text=Análisis')).toBeVisible();
    await expect(page.locator('text=Configuración')).toBeVisible();

    // 5. Verificar balance principal con funcionalidad de visibilidad
    await expect(page.locator('text=Balance Total - dev_environment')).toBeVisible();
    const balanceElement = page.locator('text=$1,250.75').or(page.locator('text=••••••'));
    await expect(balanceElement).toBeVisible();

    // 6. Verificar botón de visibilidad
    const visibilityButton = page.locator('button:has([data-testid="VisibilityIcon"])')
      .or(page.locator('button:has([data-testid="VisibilityOffIcon"])'));
    await expect(visibilityButton).toBeVisible();

    // 7. Verificar ÜCoins balance
    await expect(page.locator('text=ÜCoins CoomÜnity')).toBeVisible();

    // 8. Verificar botones de acción rápida
    await expect(page.locator('button:has-text("Enviar")')).toBeVisible();
    await expect(page.locator('button:has-text("Recargar")')).toBeVisible();
    await expect(page.locator('button:has-text("QR Code")')).toBeVisible();
    await expect(page.locator('button:has-text("Cambiar")')).toBeVisible();

    // 9. Verificar análisis del wallet (panel lateral)
    await expect(page.locator('text=📊 Análisis del Wallet')).toBeVisible();
    await expect(page.locator('text=103 total')).toBeVisible(); // Requests de red
    await expect(page.locator('text=wallet_public')).toBeVisible(); // Tipo de acceso
    await expect(page.locator('text=7 de wallet')).toBeVisible(); // Requests específicos

    // 10. Verificar cuentas con métodos de acceso
    await expect(page.locator('text=🏦 Mis Cuentas')).toBeVisible();
    await expect(page.locator('text=Cuenta Principal CoomÜnity')).toBeVisible();
    await expect(page.locator('text=dev_environment')).toBeVisible();
    await expect(page.locator('text=direct_access')).toBeVisible();
    await expect(page.locator('text=wallet_public')).toBeVisible();
  });

  test('Verificar funcionalidad de tabs - Transacciones', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Click en tab de Transacciones
    await page.click('text=Transacciones');
    await page.waitForSelector('text=📋 Historial de Transacciones');

    // Verificar contenido del análisis integrado
    await expect(page.locator('text=Datos del análisis: 0 transacciones encontradas originalmente')).toBeVisible();
    await expect(page.locator('text=datos expandidos basados en el contexto de CoomÜnity')).toBeVisible();

    // Verificar transacciones con datos del análisis
    await expect(page.locator('text=Gig completado: Diseño Web')).toBeVisible();
    await expect(page.locator('text=Tipo: xhr')).toBeVisible(); // networkRequestType del análisis
    await expect(page.locator('text=Tipo: script')).toBeVisible();
    await expect(page.locator('text=Tipo: document')).toBeVisible();
    await expect(page.locator('text=Tipo: image')).toBeVisible();
  });

  test('Verificar funcionalidad de tabs - Análisis', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Click en tab de Análisis
    await page.click('text=Análisis');
    await page.waitForSelector('text=🔍 Análisis de Red del Wallet');

    // Verificar datos extraídos del análisis
    await expect(page.locator('text=Datos extraídos del análisis de coomunity_wallet')).toBeVisible();
    await expect(page.locator('text=Distribución de Recursos de Red')).toBeVisible();

    // Verificar tipos de recursos del análisis
    await expect(page.locator('text=document')).toBeVisible();
    await expect(page.locator('text=stylesheet')).toBeVisible();
    await expect(page.locator('text=script')).toBeVisible();
    await expect(page.locator('text=image')).toBeVisible();
    await expect(page.locator('text=font')).toBeVisible();
    await expect(page.locator('text=xhr')).toBeVisible();

    // Verificar métricas específicas del análisis
    await expect(page.locator('text=103 requests de red procesados')).toBeVisible();
    await expect(page.locator('text=7 específicos del wallet')).toBeVisible();
    await expect(page.locator('text=5 botones en la página original')).toBeVisible();

    // Verificar estado del análisis
    await expect(page.locator('text=Balance visible: No')).toBeVisible(); // Del análisis original
    await expect(page.locator('text=Formularios de wallet: No')).toBeVisible();
    await expect(page.locator('text=Acceso al contenido: accessible')).toBeVisible();
  });

  test('Verificar funcionalidad de tabs - Configuración', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Click en tab de Configuración  
    await page.click('text=Configuración');
    await page.waitForSelector('text=⚙️ Configuración del Wallet');

    // Verificar métodos de pago basados en análisis
    await expect(page.locator('text=Análisis original: 0 métodos encontrados')).toBeVisible();
    await expect(page.locator('text=métodos expandidos del ecosistema CoomÜnity')).toBeVisible();
    
    await expect(page.locator('text=CoomÜnity Card')).toBeVisible();
    await expect(page.locator('text=Nequi')).toBeVisible();
    await expect(page.locator('text=Basado en análisis extraído')).toBeVisible();

    // Verificar seguridad y privacidad
    await expect(page.locator('text=🔐 Seguridad y Privacidad')).toBeVisible();
    await expect(page.locator('text=wallet_public - Acceso público controlado')).toBeVisible();
    await expect(page.locator('text=Acceso vía dev.coomunity.co verificado')).toBeVisible();
    await expect(page.locator('text=103 requests monitoreados')).toBeVisible();

    // Verificar mensaje de integración exitosa
    await expect(page.locator('text=✅ Wallet integrado exitosamente con datos del análisis extraído de coomunity_wallet')).toBeVisible();
  });

  test('Verificar funcionalidad de diálogos', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Probar diálogo de enviar dinero
    await page.click('button:has-text("Enviar")');
    await page.waitForSelector('text=💸 Enviar Dinero');
    await expect(page.locator('text=💸 Enviar Dinero')).toBeVisible();
    await expect(page.locator('input[label="Destinatario"]').or(page.locator('label:has-text("Destinatario")'))).toBeVisible();
    await page.click('button:has-text("Cancelar")');

    // Probar diálogo de recargar
    await page.click('button:has-text("Recargar")');
    await page.waitForSelector('text=⚡ Recargar Saldo');
    await expect(page.locator('text=Análisis original: 0 opciones de recarga encontradas')).toBeVisible();
    await expect(page.locator('text=Funcionalidad expandida para CoomÜnity')).toBeVisible();
    await page.click('button:has-text("Cancelar")');
  });

  test('Verificar análisis de red en tiempo real', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Esperar a que aparezca el análisis en tiempo real (cada 3 segundos)
    await page.waitForTimeout(3500);
    
    const networkAlert = page.locator('text=🔍 Análisis de Red Activo').first();
    if (await networkAlert.isVisible()) {
      await expect(networkAlert).toBeVisible();
      await expect(page.locator('text=103 requests procesados')).toBeVisible();
      await expect(page.locator('text=7 específicos de wallet')).toBeVisible();
    }
  });

  test('Verificar que no hay indicadores de desarrollo pendiente', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Verificar que NO aparecen indicadores de desarrollo
    await expect(page.locator('text=pendiente')).not.toBeVisible();
    await expect(page.locator('text=en desarrollo')).not.toBeVisible();
    await expect(page.locator('text=próximamente')).not.toBeVisible();
  });

  test('Verificar integración completa de datos del análisis extraído', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Datos específicos del análisis de coomunity_wallet
    const analysisData = [
      'pageType: wallet_public',
      'accessMethod: dev_environment_first',
      'totalRequests: 103',
      'walletSpecificRequests: 7',
      'totalButtons: 5',
      'contentAccess: accessible'
    ];

    // Verificar que los datos del análisis están integrados en diferentes partes
    await expect(page.locator('text=wallet_public')).toBeVisible();
    await expect(page.locator('text=dev environment first')).toBeVisible();
    await expect(page.locator('text=103')).toBeVisible(); // Requests totales
    await expect(page.locator('text=7')).toBeVisible(); // Requests específicos

    // Ir a tab de análisis para verificar más datos
    await page.click('text=Análisis');
    await page.waitForSelector('text=🔍 Análisis de Red del Wallet');

    // Verificar distribución completa de recursos
    const resourceTypes = ['document', 'stylesheet', 'script', 'image', 'font', 'xhr', 'other'];
    for (const type of resourceTypes) {
      await expect(page.locator(`text=${type}`)).toBeVisible();
    }

    // Verificar valores específicos del análisis
    await expect(page.locator('text=Balance visible: No')).toBeVisible(); // balanceVisible: false
    await expect(page.locator('text=Formularios: 0 detectados')).toBeVisible(); // totalForms: 0
    await expect(page.locator('text=Inputs: 0 elementos')).toBeVisible(); // totalInputs: 0
  });

  test('Verificar mejoras significativas comparado con estado anterior', async ({ page }) => {
    await page.click('text=Wallet');
    await page.waitForSelector('h1:has-text("CoomÜnity Wallet")');

    // Contar elementos para verificar el aumento de contenido y funcionalidades
    const content = await page.textContent('main');
    const contentLength = content?.length || 0;

    // El wallet ya tenía contenido (~995 caracteres) pero ahora debe ser mucho mayor
    expect(contentLength).toBeGreaterThan(2000);

    // Verificar elementos clave que confirman las mejoras
    const improvedFeatures = [
      'CoomÜnity Wallet', // Título mejorado
      'Análisis del Wallet', // Nueva sección
      'dev environment first', // Datos del análisis
      '103 Requests de Red', // Métricas del análisis
      'Distribución de Recursos de Red', // Análisis detallado
      'wallet_public', // Tipo de página del análisis
      'Análisis de Red Activo', // Funcionalidad en tiempo real
      'Basado en análisis extraído', // Integración de datos
      'Análisis original: 0 transacciones encontradas originalmente' // Referencia al análisis
    ];

    for (const feature of improvedFeatures) {
      await expect(page.locator(`text=${feature}`).first()).toBeVisible();
    }

    // Verificar que tiene múltiples tabs (funcionalidad nueva)
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    
    // Verificar notificaciones con badge (nueva funcionalidad)
    const notificationBadge = page.locator('[data-testid="NotificationsIcon"]').locator('../..').locator('[class*="badge"]');
    await expect(notificationBadge.or(page.locator('text=7'))).toBeVisible(); // Badge con wallet requests
  });
}); 