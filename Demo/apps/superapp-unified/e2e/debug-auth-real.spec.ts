import { test, expect } from '@playwright/test';

test.describe('Debug - Autenticación Real SuperApp', () => {
  test('debe mostrar qué página aparece con auth real', async ({ page }) => {
    // Ir a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Tomar screenshot para ver qué aparece
    await page.screenshot({ path: 'debug-auth-real-homepage.png', fullPage: true });
    
    // Log del HTML actual para ver el contenido
    const pageContent = await page.content();
    console.log('=== CONTENIDO DE LA PÁGINA CON AUTH REAL ===');
    console.log(pageContent.substring(0, 2000)); // Primeros 2000 caracteres
    
    // Verificar qué elementos aparecen
    const hasLoginForm = await page.locator('input[type="email"]').count() > 0;
    const hasLoginButton = await page.locator('button:has-text("Iniciar Sesión")').count() > 0;
    const hasTitle = await page.locator('h1, h2, h3').first().textContent();
    const hasLoadingState = await page.locator('text=Cargando').count() > 0;
    const hasErrorState = await page.locator('text=Error').count() > 0;
    
    console.log('=== ESTADO DE LA INTERFAZ ===');
    console.log('¿Tiene formulario de login?:', hasLoginForm);
    console.log('¿Tiene botón "Iniciar Sesión"?:', hasLoginButton);
    console.log('¿Título principal?:', hasTitle);
    console.log('¿Estado de carga?:', hasLoadingState);
    console.log('¿Estado de error?:', hasErrorState);
    
    // Log todos los elementos input disponibles
    const inputs = await page.locator('input').all();
    console.log('=== INPUTS DISPONIBLES ===');
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const placeholder = await inputs[i].getAttribute('placeholder');
      const id = await inputs[i].getAttribute('id');
      console.log(`Input ${i}: type="${type}", placeholder="${placeholder}", id="${id}"`);
    }
    
    // Log todos los botones disponibles
    const buttons = await page.locator('button').all();
    console.log('=== BOTONES DISPONIBLES ===');
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`Button ${i}: "${text}"`);
    }
    
    // Verificar si ya está autenticado
    const isAuthenticated = await page.evaluate(() => {
      return localStorage.getItem('token') !== null;
    });
    console.log('¿Ya está autenticado?:', isAuthenticated);
    
    // Log de la URL actual
    console.log('URL actual:', page.url());
    
    // Si no hay formulario de login, verificar qué navegación está disponible
    const navLinks = await page.locator('a, button').all();
    console.log('=== NAVEGACIÓN DISPONIBLE ===');
    for (let i = 0; i < Math.min(navLinks.length, 10); i++) {
      const text = await navLinks[i].textContent();
      const href = await navLinks[i].getAttribute('href');
      console.log(`Link ${i}: "${text}" -> "${href}"`);
    }
  });

  test('debe verificar la ruta /login específicamente', async ({ page }) => {
    // Ir directamente a la ruta de login
    await page.goto('/login');
    
    // Esperar un poco
    await page.waitForTimeout(3000);
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug-auth-real-login-route.png', fullPage: true });
    
    // Verificar el contenido
    const hasEmailInput = await page.locator('input[type="email"]').count() > 0;
    const hasPasswordInput = await page.locator('input[type="password"]').count() > 0;
    
    console.log('=== RUTA /login ===');
    console.log('URL actual:', page.url());
    console.log('¿Tiene input email?:', hasEmailInput);
    console.log('¿Tiene input password?:', hasPasswordInput);
    
    // Log del HTML del cuerpo
    const bodyContent = await page.locator('body').innerHTML();
    console.log('Contenido del body (primeros 1000 chars):', bodyContent.substring(0, 1000));
  });
}); 