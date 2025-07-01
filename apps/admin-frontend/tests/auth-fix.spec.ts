import { test, expect } from '@playwright/test';

/**
 * Test para simular correctamente la autenticación y verificar el menú
 */
test('Simular autenticación completa y verificar menú', async ({ page }) => {
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

  // Obtener información del usuario
  const userResponse = await page.request.get('http://localhost:3002/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const userData = await userResponse.json();
  console.log('✅ Datos del usuario obtenidos:', userData);

  // Paso 2: Establecer el token y la información del usuario en localStorage antes de navegar a la página
  await page.goto('http://localhost:3000');
  await page.evaluate(({ authToken, user }) => {
    // Guardar token
    localStorage.setItem('auth_token', authToken);

    // Guardar información del usuario
    localStorage.setItem('auth_user', JSON.stringify(user));

    console.log('Token y usuario guardados en localStorage:', {
      token: authToken,
      user: user
    });
  }, { authToken: token, user: userData });

  console.log('✅ Token y usuario guardados en localStorage');

  // Recargar la página para que se inicialice la autenticación
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Verificar si la autenticación funcionó correctamente
  const authInfo = await page.evaluate(() => {
    return {
      token: localStorage.getItem('auth_token'),
      user: localStorage.getItem('auth_user'),
      isUserObject: !!localStorage.getItem('auth_user'),
    };
  });

  console.log('📊 INFORMACIÓN DE AUTENTICACIÓN:');
  console.log(`Token guardado: ${authInfo.token ? 'Sí' : 'No'}`);
  console.log(`Usuario guardado: ${authInfo.user ? 'Sí' : 'No'}`);
  console.log(`Es objeto de usuario: ${authInfo.isUserObject}`);

  // Tomar screenshot de la página después de la autenticación
  await page.screenshot({ path: './test-results/auth-fix-after-auth.png' });

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
    await page.screenshot({ path: './test-results/auth-fix-menu-open.png' });

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

  // Navegar al Portal Kanban Cósmico
  console.log('🔍 Navegando al Portal Kanban Cósmico...');
  await page.goto('http://localhost:3000/cosmic-kanban');
  await page.waitForLoadState('networkidle');

  // Tomar screenshot de la página del Portal Kanban Cósmico
  await page.screenshot({ path: './test-results/auth-fix-cosmic-kanban.png' });

  // Verificar si estamos en la página correcta
  const finalUrl = page.url();
  const isOnKanbanPage = finalUrl.includes('/cosmic-kanban');

  console.log(`✅ URL final: ${finalUrl}`);
  console.log(`✅ ¿Estamos en la página del Portal Kanban Cósmico? ${isOnKanbanPage}`);
});
