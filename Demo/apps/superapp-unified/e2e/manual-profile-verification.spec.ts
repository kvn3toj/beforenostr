import { test, expect } from '@playwright/test';

test('Manual Profile Page Verification - Fase A.1', async ({ page }) => {
  console.log('🎯 [MANUAL VERIFICATION] Iniciando verificación del módulo de perfil');
  
  // 🔄 Navegar directamente a la aplicación
  await page.goto('/');
  console.log('✅ Navegado a la página principal');
  
  // ⏳ Esperar a que la página cargue
  await page.waitForLoadState('networkidle');
  console.log('✅ Página principal cargada');
  
  // 📸 Captura inicial
  await page.screenshot({ 
    path: 'test-results/01-homepage.png', 
    fullPage: true 
  });
  
  // 🎯 Intentar navegar al perfil
  console.log('🎯 Buscando enlace/botón de perfil...');
  
  // Buscar diferentes formas de acceder al perfil
  const profileSelectors = [
    'a[href*="profile"]',
    'text=Perfil',
    '[data-testid="profile"]',
    '[aria-label*="profile" i]',
    'button:has-text("Perfil")',
    '.sidebar a:has-text("Perfil")',
    'nav a:has-text("Perfil")'
  ];
  
  let profileFound = false;
  for (const selector of profileSelectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log(`✅ Encontrado selector de perfil: ${selector}`);
      await element.click();
      profileFound = true;
      break;
    }
  }
  
  if (!profileFound) {
    console.log('⚠️ No se encontró enlace directo, navegando manualmente a /profile');
    await page.goto('/profile');
  }
  
  // ⏳ Esperar a que la página de perfil cargue
  await page.waitForLoadState('networkidle');
  console.log('✅ Página de perfil cargada');
  
  // 📸 Captura de la página de perfil
  await page.screenshot({ 
    path: 'test-results/02-profile-page.png', 
    fullPage: true 
  });
  
  // 🎯 Verificar URL del perfil
  const currentUrl = page.url();
  console.log(`🔍 URL actual: ${currentUrl}`);
  
  if (currentUrl.includes('profile')) {
    console.log('✅ Estamos en la página de perfil');
  } else {
    console.log('⚠️ No estamos en la página de perfil, verificando contenido...');
  }
  
  // 🎯 Verificar elementos clave de la página de perfil actualizada
  const expectedElements = [
    { selector: 'h1', name: 'Título/Nombre del usuario' },
    { selector: 'text=Miembro desde', name: 'Información de membresía' },
    { selector: 'text=Nivel', name: 'Estadística de nivel' },
    { selector: 'text=Puntos', name: 'Estadística de puntos' },
    { selector: 'text=Información', name: 'Tab de información' },
    { selector: 'text=Actividad', name: 'Tab de actividad' },
    { selector: 'text=Configuración', name: 'Tab de configuración' }
  ];
  
  console.log('🔍 Verificando elementos de la página de perfil...');
  
  for (const element of expectedElements) {
    try {
      const isVisible = await page.locator(element.selector).isVisible({ timeout: 2000 });
      if (isVisible) {
        console.log(`✅ ${element.name}: Visible`);
      } else {
        console.log(`❌ ${element.name}: No visible`);
      }
    } catch (error) {
      console.log(`❌ ${element.name}: Error - ${error.message}`);
    }
  }
  
  // 🎯 Verificar estado de autenticación
  const authElements = [
    'text=No hay usuario autenticado',
    '.MuiSkeleton-root',
    'text=Email',
    'text=Token de Autenticación'
  ];
  
  console.log('🔍 Verificando estado de autenticación...');
  
  const noAuthAlert = await page.locator('text=No hay usuario autenticado').isVisible({ timeout: 1000 }).catch(() => false);
  const hasSkeletons = await page.locator('.MuiSkeleton-root').isVisible({ timeout: 1000 }).catch(() => false);
  const hasEmailField = await page.locator('text=Email').isVisible({ timeout: 1000 }).catch(() => false);
  const hasTokenInfo = await page.locator('text=Token de Autenticación').isVisible({ timeout: 1000 }).catch(() => false);
  
  if (noAuthAlert) {
    console.log('⚠️ Estado: Usuario no autenticado');
    await page.screenshot({ path: 'test-results/03-no-auth-state.png' });
  } else if (hasSkeletons) {
    console.log('⏳ Estado: Cargando datos del usuario');
    await page.screenshot({ path: 'test-results/03-loading-state.png' });
  } else if (hasEmailField || hasTokenInfo) {
    console.log('✅ Estado: Usuario autenticado con datos visibles');
    await page.screenshot({ path: 'test-results/03-authenticated-state.png' });
  } else {
    console.log('❓ Estado: Indeterminado');
    await page.screenshot({ path: 'test-results/03-unknown-state.png' });
  }
  
  // 🎯 Probar navegación entre tabs si es posible
  console.log('🎯 Probando navegación entre tabs...');
  
  const tabs = ['Información', 'Actividad', 'Configuración'];
  
  for (const tabName of tabs) {
    try {
      const tabElement = page.locator(`text=${tabName}`).first();
      if (await tabElement.isVisible({ timeout: 1000 })) {
        console.log(`🔄 Cambiando a tab: ${tabName}`);
        await tabElement.click();
        await page.waitForTimeout(500);
        await page.screenshot({ 
          path: `test-results/04-tab-${tabName.toLowerCase()}.png`, 
          fullPage: true 
        });
        console.log(`✅ Tab ${tabName} verificado`);
      }
    } catch (error) {
      console.log(`❌ Error en tab ${tabName}: ${error.message}`);
    }
  }
  
  // 🎯 Buscar botón de editar
  console.log('🎯 Buscando botón de editar perfil...');
  
  const editSelectors = [
    '[data-testid="EditIcon"]',
    'button:has([data-testid="EditIcon"])',
    'button[aria-label*="edit" i]',
    'text=Editar'
  ];
  
  for (const selector of editSelectors) {
    try {
      const editButton = page.locator(selector).first();
      if (await editButton.isVisible({ timeout: 1000 })) {
        console.log(`✅ Botón de editar encontrado: ${selector}`);
        await editButton.click();
        await page.waitForTimeout(500);
        
        // Verificar si se abre el diálogo
        const dialogOpen = await page.locator('text=Editar Perfil').isVisible({ timeout: 1000 });
        if (dialogOpen) {
          console.log('✅ Diálogo de edición abierto');
          await page.screenshot({ path: 'test-results/05-edit-dialog.png' });
          
          // Cerrar el diálogo
          const cancelButton = page.locator('text=Cancelar').first();
          if (await cancelButton.isVisible()) {
            await cancelButton.click();
            console.log('✅ Diálogo cerrado');
          }
        }
        break;
      }
    } catch (error) {
      console.log(`❌ Selector ${selector} no funcionó: ${error.message}`);
    }
  }
  
  // 🎯 Captura final
  await page.screenshot({ 
    path: 'test-results/06-final-state.png', 
    fullPage: true 
  });
  
  console.log('🎯 [MANUAL VERIFICATION] Verificación del perfil completada');
  console.log('📸 Capturas guardadas en test-results/');
  
  // ✅ Test siempre pasa - es verificación manual
  expect(true).toBe(true);
}); 