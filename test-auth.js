import { createClient } from '@supabase/supabase-js'
const { chromium } = require('playwright');

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAuth() {
  try {
    // Intentar iniciar sesión con el usuario que creamos
    console.log('Intentando iniciar sesión...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'devadmin@example.com',
      password: 'password123'
    })
    
    if (signInError) {
      console.error('Error al iniciar sesión:', signInError.message)
      return
    }
    
    console.log('Inicio de sesión exitoso:', signInData.user.id)
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

async function testWithAuth() {
  console.log('🔐 Iniciando test con autenticación...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar mensajes de consola importantes
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AuthStore]') || text.includes('[AuthService]') || text.includes('[Mundos]') || text.includes('[Playlists]')) {
      console.log(`📝 ${msg.type().toUpperCase()}: ${text}`);
    }
  });

  try {
    console.log('\n🏠 Navegando a página principal...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verificar si ya está autenticado o necesita login
    const isLoginPage = await page.locator('#email').isVisible().catch(() => false);
    
    if (isLoginPage) {
      console.log('\n🔐 Realizando login con credenciales mock...');
      
      // Usar las credenciales válidas del mock
      await page.fill('#email', 'admin@coomunity.co');
      await page.fill('#password', '123456');
      await page.click('button[type="submit"]');
      
      // Esperar a que el login se complete
      await page.waitForTimeout(3000);
      
      // Verificar que el login fue exitoso
      const currentUrl = page.url();
      console.log(`📍 URL después del login: ${currentUrl}`);
      
      if (currentUrl.includes('/login')) {
        console.log('❌ Login falló, aún en página de login');
        return;
      } else {
        console.log('✅ Login exitoso, redirigido a:', currentUrl);
      }
    } else {
      console.log('✅ Usuario ya autenticado');
    }

    // Esperar un poco más para que la autenticación se estabilice
    await page.waitForTimeout(2000);

    console.log('\n🌍 Navegando a página de Mundos...');
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verificar contenido de mundos
    const mundosTableRows = await page.locator('table tbody tr').count();
    console.log(`📊 Filas en tabla de mundos: ${mundosTableRows}`);

    // Verificar si hay elementos de loading
    const mundosLoading = await page.locator('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]').count();
    console.log(`⏳ Elementos de loading en mundos: ${mundosLoading}`);

    // Verificar si hay mensajes de error
    const mundosErrors = await page.locator('[role="alert"], .error').count();
    console.log(`❌ Elementos de error en mundos: ${mundosErrors}`);

    console.log('\n🎵 Navegando a página de Playlists...');
    await page.goto('http://localhost:3000/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verificar contenido de playlists
    const playlistsTableRows = await page.locator('table tbody tr').count();
    console.log(`📊 Filas en tabla de playlists: ${playlistsTableRows}`);

    const playlistsLoading = await page.locator('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]').count();
    console.log(`⏳ Elementos de loading en playlists: ${playlistsLoading}`);

    const playlistsErrors = await page.locator('[role="alert"], .error').count();
    console.log(`❌ Elementos de error en playlists: ${playlistsErrors}`);

    // Verificar estado de autenticación en localStorage
    const authData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('auth_token'),
        user: localStorage.getItem('user'),
        hasToken: !!localStorage.getItem('auth_token'),
        hasUser: !!localStorage.getItem('user')
      };
    });
    
    console.log('\n💾 Estado de autenticación:');
    console.log(`Token presente: ${authData.hasToken}`);
    console.log(`Usuario presente: ${authData.hasUser}`);
    if (authData.hasToken) {
      console.log(`Token: ${authData.token.substring(0, 20)}...`);
    }

    // Tomar screenshots
    await page.goto('http://localhost:3000/mundos');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-mundos-auth.png', fullPage: true });
    console.log('📸 Screenshot de mundos con auth: debug-mundos-auth.png');

    await page.goto('http://localhost:3000/playlists');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-playlists-auth.png', fullPage: true });
    console.log('📸 Screenshot de playlists con auth: debug-playlists-auth.png');

    console.log('\n✅ Test con autenticación completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
    await page.screenshot({ path: 'debug-auth-error.png' });
  } finally {
    await browser.close();
  }
}

testAuth()
testWithAuth() 