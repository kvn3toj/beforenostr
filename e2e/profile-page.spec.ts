import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola y página
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    page.on('pageerror', (error) => {
      console.error('Browser page error:', error.message);
    });

    // Navegar a la página de login y autenticarse
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar la redirección a la página principal
    await page.waitForURL('**/');
    // Usar un selector más específico para evitar strict mode violation
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
  });

  test('should display profile page directly', async ({ page }) => {
    // Navegar directamente a la página de perfil
    await page.goto('/profile');
    
    // Verificar que se muestra la página de perfil
    await expect(page.getByText('Mi Perfil')).toBeVisible();
    await expect(page.getByText('Gestiona tu información personal')).toBeVisible();
    
    // Verificar que se muestra la información del usuario
    await expect(page.getByText('admin@gamifier.com')).toBeVisible();
    await expect(page.getByText('Información Personal')).toBeVisible();
    
    // Verificar que se muestra el botón de editar
    await expect(page.getByText('Editar Perfil')).toBeVisible();
  });

  test('should navigate to profile page from header menu', async ({ page }) => {
    // Hacer clic en el avatar del usuario en el header
    await page.click('[data-testid="user-menu-button"], button[aria-label*="Perfil"], .MuiAvatar-root');
    
    // Hacer clic en la opción "Perfil" del menú
    await page.click('text=Perfil');
    
    // Verificar que estamos en la página de perfil
    await page.waitForURL('**/profile');
    await expect(page.getByText('Mi Perfil')).toBeVisible();
  });

  test('should display user profile information', async ({ page }) => {
    // Navegar directamente a la página de perfil
    await page.goto('/profile');
    
    // Verificar que se muestra la información del perfil
    await expect(page.getByText('Mi Perfil')).toBeVisible();
    await expect(page.getByText('Gestiona tu información personal')).toBeVisible();
    
    // Verificar que se muestra la información del usuario
    await expect(page.getByText('admin@gamifier.com')).toBeVisible();
    await expect(page.getByText('Información Personal')).toBeVisible();
    await expect(page.getByText('Información de Cuenta')).toBeVisible();
    
    // Verificar que se muestra el botón de editar
    await expect(page.getByText('Editar Perfil')).toBeVisible();
  });

  test('should show edit form when edit button is clicked', async ({ page }) => {
    await page.goto('/profile');
    
    // Hacer clic en el botón "Editar Perfil"
    await page.click('text=Editar Perfil');
    
    // Verificar que se muestra el formulario de edición
    await expect(page.getByText('Editar Información del Perfil')).toBeVisible();
    await expect(page.getByText('Cancelar')).toBeVisible();
    
    // Verificar que se muestran los campos del formulario
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('should cancel edit mode when cancel button is clicked', async ({ page }) => {
    await page.goto('/profile');
    
    // Entrar en modo edición
    await page.click('text=Editar Perfil');
    await expect(page.getByText('Editar Información del Perfil')).toBeVisible();
    
    // Hacer clic en cancelar
    await page.click('text=Cancelar');
    
    // Verificar que volvemos al modo de visualización
    await expect(page.getByText('Editar Perfil')).toBeVisible();
    await expect(page.getByText('Información Personal')).toBeVisible();
  });

  test('should display account information section', async ({ page }) => {
    await page.goto('/profile');
    
    // Verificar la sección de información de cuenta
    await expect(page.getByText('Información de Cuenta')).toBeVisible();
    await expect(page.getByText('Miembro desde')).toBeVisible();
    
    // Verificar la sección de acciones de cuenta
    await expect(page.getByText('Acciones de Cuenta')).toBeVisible();
    await expect(page.getByText('Cambiar Contraseña')).toBeVisible();
    await expect(page.getByText('Exportar Datos')).toBeVisible();
  });

  test('should show coming soon message for account actions', async ({ page }) => {
    await page.goto('/profile');
    
    // Hacer clic en "Cambiar Contraseña"
    await page.click('text=Cambiar Contraseña');
    
    // Verificar que se muestra el mensaje de "próximamente"
    await expect(page.locator('.sonner-toast')).toBeVisible();
    await expect(page.getByText('Funcionalidad próximamente disponible')).toBeVisible();
  });

  test('should display user avatar with correct initial', async ({ page }) => {
    await page.goto('/profile');
    
    // Verificar que se muestra el avatar con la inicial correcta
    const avatar = page.locator('.MuiAvatar-root').first();
    await expect(avatar).toBeVisible();
    await expect(avatar).toContainText('A'); // Primera letra de "admin@gamifier.com"
  });

  test('should handle responsive layout', async ({ page }) => {
    await page.goto('/profile');
    
    // Verificar en desktop
    await expect(page.getByText('Mi Perfil')).toBeVisible();
    
    // Cambiar a móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que la página sigue siendo accesible
    await expect(page.getByText('Mi Perfil')).toBeVisible();
    await expect(page.getByText('Editar Perfil')).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Interceptar la llamada a la API para simular carga lenta
    await page.route('**/auth/me', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/profile');
    
    // Verificar que se muestra el indicador de carga
    await expect(page.locator('.MuiCircularProgress-root')).toBeVisible();
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.goto('/profile');
    
    // Navegar usando Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar que el botón "Editar Perfil" puede recibir foco
    const editButton = page.getByText('Editar Perfil');
    await editButton.focus();
    await expect(editButton).toBeFocused();
    
    // Activar con Enter
    await page.keyboard.press('Enter');
    await expect(page.getByText('Editar Información del Perfil')).toBeVisible();
  });
}); 