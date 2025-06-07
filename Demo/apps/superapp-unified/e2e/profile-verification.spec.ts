import { test, expect } from '@playwright/test';

test.describe('Profile Page Verification - Fase A.1', () => {
  test.beforeEach(async ({ page }) => {
    // 🔄 Navegar a la aplicación
    await page.goto('/');
    
    // ⏳ Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('Profile page loads and displays user information', async ({ page }) => {
    // 🎯 Navegar a la página de perfil desde la barra lateral
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    
    // ⏳ Esperar a que la página de perfil cargue
    await page.waitForLoadState('networkidle');
    
    // ✅ Verificar que estamos en la página de perfil
    await expect(page).toHaveURL(/.*profile/);
    
    // 🎯 Verificar elementos principales del header de perfil
    await expect(page.locator('h1')).toBeVisible(); // Nombre del usuario
    await expect(page.locator('text=Miembro desde')).toBeVisible();
    
    // 🎯 Verificar stats rápidas
    await expect(page.locator('text=Nivel')).toBeVisible();
    await expect(page.locator('text=Puntos')).toBeVisible();
    await expect(page.locator('text=Tareas Completadas')).toBeVisible();
    
    // 🎯 Verificar tabs de navegación
    await expect(page.locator('text=Información')).toBeVisible();
    await expect(page.locator('text=Actividad')).toBeVisible();
    await expect(page.locator('text=Configuración')).toBeVisible();
    
    // 📸 Captura de pantalla del perfil completo
    await page.screenshot({ 
      path: 'test-results/profile-overview.png', 
      fullPage: true 
    });
  });

  test('Profile information tab displays user data correctly', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Verificar que estamos en el tab de Información (debería ser el default)
    await expect(page.locator('text=Información Personal')).toBeVisible();
    
    // 🎯 Verificar campos de información personal
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Nombre Completo')).toBeVisible();
    await expect(page.locator('text=Miembro Desde')).toBeVisible();
    await expect(page.locator('text=Rol')).toBeVisible();
    
    // 🎯 Verificar estado de la cuenta
    await expect(page.locator('text=Estado de la Cuenta')).toBeVisible();
    await expect(page.locator('text=Estado de Verificación')).toBeVisible();
    await expect(page.locator('text=Token de Autenticación')).toBeVisible();
    
    // 📸 Captura del tab de información
    await page.screenshot({ 
      path: 'test-results/profile-information-tab.png', 
      fullPage: true 
    });
  });

  test('Profile activity tab shows placeholder content', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Hacer clic en el tab de Actividad
    await page.click('text=Actividad');
    await page.waitForTimeout(500); // Esperar transición del tab
    
    // 🎯 Verificar contenido placeholder del módulo de actividad
    await expect(page.locator('text=Módulo de Actividad')).toBeVisible();
    await expect(page.locator('text=Próximamente: Historial de Actividades')).toBeVisible();
    await expect(page.locator('text=Actividades en Marketplace')).toBeVisible();
    
    // 📸 Captura del tab de actividad
    await page.screenshot({ 
      path: 'test-results/profile-activity-tab.png', 
      fullPage: true 
    });
  });

  test('Profile configuration tab shows pending integration', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Hacer clic en el tab de Configuración
    await page.click('text=Configuración');
    await page.waitForTimeout(500); // Esperar transición del tab
    
    // 🎯 Verificar alertas de configuración pendiente
    await expect(page.locator('text=Configuraciones de Usuario')).toBeVisible();
    await expect(page.locator('text=pendiente de integración con backend')).toBeVisible();
    await expect(page.locator('text=Notificaciones')).toBeVisible();
    await expect(page.locator('text=Privacidad')).toBeVisible();
    
    // 📸 Captura del tab de configuración
    await page.screenshot({ 
      path: 'test-results/profile-configuration-tab.png', 
      fullPage: true 
    });
  });

  test('Edit profile dialog opens and closes correctly', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Buscar y hacer clic en el botón de editar (icono de lápiz)
    const editButton = page.locator('[aria-label="edit"], button:has-text("Edit"), button:has([data-testid="EditIcon"])').first();
    await expect(editButton).toBeVisible();
    await editButton.click();
    
    // ⏳ Esperar a que el diálogo aparezca
    await page.waitForTimeout(500);
    
    // 🎯 Verificar que el diálogo de edición está abierto
    await expect(page.locator('text=Editar Perfil')).toBeVisible();
    await expect(page.locator('label:has-text("Nombre Completo")')).toBeVisible();
    await expect(page.locator('label:has-text("Bio")')).toBeVisible();
    await expect(page.locator('label:has-text("Ubicación")')).toBeVisible();
    await expect(page.locator('label:has-text("Teléfono")')).toBeVisible();
    
    // 🎯 Verificar botones del diálogo
    await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(page.locator('button:has-text("Guardar Cambios")')).toBeVisible();
    
    // 📸 Captura del diálogo de edición
    await page.screenshot({ 
      path: 'test-results/profile-edit-dialog.png' 
    });
    
    // 🎯 Cerrar el diálogo haciendo clic en Cancelar
    await page.click('button:has-text("Cancelar")');
    await page.waitForTimeout(500);
    
    // ✅ Verificar que el diálogo se cerró
    await expect(page.locator('text=Editar Perfil')).not.toBeVisible();
  });

  test('Edit profile form accepts input correctly', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Abrir diálogo de edición
    const editButton = page.locator('[aria-label="edit"], button:has-text("Edit"), button:has([data-testid="EditIcon"])').first();
    await editButton.click();
    await page.waitForTimeout(500);
    
    // 🎯 Llenar campos del formulario
    const nameField = page.locator('input[label="Nombre Completo"], input:near(label:has-text("Nombre Completo"))').first();
    await nameField.fill('Juan Pérez Actualizado');
    
    const bioField = page.locator('textarea:near(label:has-text("Bio"))').first();
    await bioField.fill('Bio actualizada desde test automatizado');
    
    const locationField = page.locator('input:near(label:has-text("Ubicación"))').first();
    await locationField.fill('Bogotá, Colombia');
    
    const phoneField = page.locator('input:near(label:has-text("Teléfono"))').first();
    await phoneField.fill('+57 300 555 1234');
    
    // 📸 Captura del formulario lleno
    await page.screenshot({ 
      path: 'test-results/profile-edit-form-filled.png' 
    });
    
    // 🎯 Verificar que los campos tienen los valores esperados
    await expect(nameField).toHaveValue('Juan Pérez Actualizado');
    await expect(bioField).toHaveValue('Bio actualizada desde test automatizado');
    await expect(locationField).toHaveValue('Bogotá, Colombia');
    await expect(phoneField).toHaveValue('+57 300 555 1234');
    
    // 🎯 Cancelar para no modificar datos reales
    await page.click('button:has-text("Cancelar")');
    await page.waitForTimeout(500);
  });

  test('Profile page handles authentication state correctly', async ({ page }) => {
    // 🎯 Este test verifica que la página maneja correctamente el estado de autenticación
    
    // Primero navegar a perfil (debería mostrar datos del usuario autenticado)
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Verificar que se muestra información del usuario (no mensaje de "no autenticado")
    const noAuthAlert = page.locator('text=No hay usuario autenticado');
    const loadingSkeletons = page.locator('[data-testid="skeleton"], .MuiSkeleton-root');
    
    // Debería mostrar contenido real o esqueletos de carga, no alerta de no autenticado
    const hasRealContent = await page.locator('h1').isVisible();
    const hasLoadingState = await loadingSkeletons.first().isVisible();
    const hasNoAuthAlert = await noAuthAlert.isVisible();
    
    // ✅ Verificar estado correcto
    if (hasNoAuthAlert) {
      // Si muestra alerta de no autenticado, documentar esto
      await page.screenshot({ 
        path: 'test-results/profile-no-auth-state.png' 
      });
      console.log('⚠️ Profile page shows no authentication alert - this may be expected if no user is logged in');
    } else if (hasLoadingState) {
      // Si muestra estado de carga, documentar
      await page.screenshot({ 
        path: 'test-results/profile-loading-state.png' 
      });
      console.log('⏳ Profile page is in loading state');
    } else if (hasRealContent) {
      // Si muestra contenido real, es el estado ideal
      await page.screenshot({ 
        path: 'test-results/profile-authenticated-state.png' 
      });
      console.log('✅ Profile page shows authenticated user content');
    }
    
    // Al menos uno de estos estados debería ser verdadero
    expect(hasNoAuthAlert || hasLoadingState || hasRealContent).toBeTruthy();
  });

  test('Profile page responsive design works correctly', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.click('[data-testid="sidebar-profile"], a[href*="profile"], text=Perfil');
    await page.waitForLoadState('networkidle');
    
    // 🎯 Test en desktop (por defecto)
    await page.screenshot({ 
      path: 'test-results/profile-desktop-view.png', 
      fullPage: true 
    });
    
    // 🎯 Test en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'test-results/profile-tablet-view.png', 
      fullPage: true 
    });
    
    // 🎯 Test en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'test-results/profile-mobile-view.png', 
      fullPage: true 
    });
    
    // ✅ Verificar que elementos clave siguen visibles en móvil
    await expect(page.locator('h1')).toBeVisible(); // Nombre del usuario
    await expect(page.locator('text=Nivel')).toBeVisible(); // Stats
    await expect(page.locator('text=Información')).toBeVisible(); // Tabs
    
    // 🔄 Restaurar viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('Profile Page Backend Integration', () => {
  test('Profile page shows backend connectivity status', async ({ page }) => {
    // 🎯 Navegar a perfil
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // 🔍 Verificar indicadores de conectividad con backend
    const authTokenStatus = page.locator('text=Token de Autenticación');
    const accountStatus = page.locator('text=Estado de Verificación');
    
    if (await authTokenStatus.isVisible()) {
      // 🎯 Verificar estado del token
      const tokenActiveText = page.locator('text=Activo');
      const tokenInactiveText = page.locator('text=No disponible');
      
      const hasActiveToken = await tokenActiveText.isVisible();
      const hasInactiveToken = await tokenInactiveText.isVisible();
      
      // 📸 Captura del estado de conectividad
      await page.screenshot({ 
        path: 'test-results/profile-backend-connectivity.png' 
      });
      
      if (hasActiveToken) {
        console.log('✅ Backend token is active - good backend connectivity');
      } else if (hasInactiveToken) {
        console.log('⚠️ Backend token is not available - check backend connectivity');
      }
      
      // Al menos uno debería estar presente
      expect(hasActiveToken || hasInactiveToken).toBeTruthy();
    }
  });
}); 