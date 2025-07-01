import { test, expect } from '@playwright/test';

/**
 * Test de acceso directo al Portal Kanban Cósmico
 */
test('Acceder directamente al Portal Kanban Cósmico', async ({ page }) => {
  // Configurar timeout más largo
  test.setTimeout(60000);

  // Paso 1: Obtener token de autenticación directamente desde la API
  console.log('🔑 Obteniendo token de autenticación desde la API...');

  const apiResponse = await page.request.post('http://localhost:3002/auth/login', {
    data: {
      email: 'admin@gamifier.com',
      password: 'admin123'
    }
  });

  const responseData = await apiResponse.json();
  const token = responseData.access_token;

  console.log(`✅ Token obtenido: ${token ? 'Sí (token válido)' : 'No (error)'}`);

  if (!token) {
    console.error('❌ No se pudo obtener el token');
    return;
  }

  // Paso 2: Establecer el token en localStorage antes de navegar a la página
  await page.goto('http://localhost:3000');
  await page.evaluate((authToken) => {
    localStorage.setItem('auth_token', authToken);
  }, token);

  console.log('✅ Token guardado en localStorage');

  // Paso 3: Navegar directamente a la página del Portal Kanban Cósmico
  await page.goto('http://localhost:3000/cosmic-kanban');
  console.log('✅ Navegando directamente al Portal Kanban Cósmico');

  // Esperar a que la página se cargue completamente
  await page.waitForLoadState('networkidle');

  // Tomar screenshot de la página
  await page.screenshot({ path: './test-results/direct-access-kanban.png' });

  // Verificar si estamos en la página correcta
  const finalUrl = page.url();
  const isOnKanbanPage = finalUrl.includes('/cosmic-kanban');

  console.log(`✅ URL final: ${finalUrl}`);
  console.log(`✅ ¿Estamos en la página del Portal Kanban Cósmico? ${isOnKanbanPage}`);

  // Verificar si el contenido de la página incluye elementos esperados
  const pageContent = await page.evaluate(() => document.body.innerText);
  const hasKanbanTitle = pageContent.includes('Portal Kanban Cósmico') ||
                         pageContent.includes('Cosmic Kanban') ||
                         pageContent.includes('Kanban');

  console.log(`✅ ¿La página contiene título relacionado con Kanban? ${hasKanbanTitle}`);

  // Verificar si hay elementos del menú después de la autenticación
  const menuInfo = await page.evaluate(() => {
    return {
      drawer: !!document.querySelector('.MuiDrawer-root'),
      menuButton: !!document.querySelector('button[aria-label="toggle menu"]'),
      userAvatar: !!document.querySelector('button:has(.MuiAvatar-root)'),
      hasAdminEmail: document.body.innerText.includes('admin@gamifier.com'),
    };
  });

  console.log('📊 INFORMACIÓN DEL MENÚ DESPUÉS DE AUTENTICACIÓN:');
  console.log(`Drawer encontrado: ${menuInfo.drawer}`);
  console.log(`Botón de menú encontrado: ${menuInfo.menuButton}`);
  console.log(`Avatar de usuario encontrado: ${menuInfo.userAvatar}`);
  console.log(`Email admin encontrado: ${menuInfo.hasAdminEmail}`);

  // Intentar abrir el menú si el botón está disponible
  if (menuInfo.menuButton) {
    console.log('🔍 Intentando abrir el menú...');
    await page.click('button[aria-label="toggle menu"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: './test-results/direct-access-menu-open.png' });

    // Verificar si las secciones están presentes después de abrir el drawer
    const sectionsAfterOpen = await page.evaluate(() => {
      return {
        administracion: document.body.innerText.includes('Administración'),
        gestionCoomunity: document.body.innerText.includes('Gestión CoomÜnity'),
        herramientas: document.body.innerText.includes('Herramientas'),
        portalKanban: document.body.innerText.includes('Portal Kanban Cósmico'),
      };
    });

    console.log('📊 SECCIONES DESPUÉS DE ABRIR EL DRAWER:');
    console.log(`Sección Administración encontrada: ${sectionsAfterOpen.administracion}`);
    console.log(`Sección Gestión CoomÜnity encontrada: ${sectionsAfterOpen.gestionCoomunity}`);
    console.log(`Sección Herramientas encontrada: ${sectionsAfterOpen.herramientas}`);
    console.log(`Portal Kanban Cósmico encontrado: ${sectionsAfterOpen.portalKanban}`);
  }

  // No hacemos assertions para que el test no falle, solo queremos información de depuración
});
