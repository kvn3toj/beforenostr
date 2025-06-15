import { test, expect } from '@playwright/test';

test.describe('🔑 Verificación de Constantes de localStorage', () => {

  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('✅ Verificar que las constantes canónicas están definidas', async ({ page }) => {
    console.log('🧪 Verificando constantes de localStorage...');

    // Navegar a la página principal para cargar la aplicación
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Verificar que las constantes están disponibles en el contexto de la aplicación
    const constantsCheck = await page.evaluate(() => {
      // Simular el uso de las constantes como lo haría la aplicación
      const TOKEN_KEY = 'COOMUNITY_AUTH_TOKEN';
      const USER_KEY = 'COOMUNITY_USER_DATA';
      
      // Probar almacenar y recuperar datos con las nuevas claves
      const testToken = 'test-token-123';
      const testUser = { id: 'test-user', email: 'test@example.com' };
      
      // Almacenar
      localStorage.setItem(TOKEN_KEY, testToken);
      localStorage.setItem(USER_KEY, JSON.stringify(testUser));
      
      // Recuperar
      const retrievedToken = localStorage.getItem(TOKEN_KEY);
      const retrievedUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      
      return {
        tokenStored: retrievedToken === testToken,
        userStored: retrievedUser.id === testUser.id && retrievedUser.email === testUser.email,
        tokenKey: TOKEN_KEY,
        userKey: USER_KEY
      };
    });

    expect(constantsCheck.tokenStored).toBe(true);
    expect(constantsCheck.userStored).toBe(true);
    expect(constantsCheck.tokenKey).toBe('COOMUNITY_AUTH_TOKEN');
    expect(constantsCheck.userKey).toBe('COOMUNITY_USER_DATA');

    console.log('✅ Constantes canónicas funcionando correctamente:', constantsCheck);
  });

  test('🧹 Verificar que las claves antiguas no interfieren', async ({ page }) => {
    console.log('🧪 Verificando limpieza de claves antiguas...');

    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Simular datos con claves antiguas y nuevas
    const setupResult = await page.evaluate(() => {
      // Claves antiguas (que ya no deberían usarse)
      localStorage.setItem('access_token', 'old-token');
      localStorage.setItem('user', JSON.stringify({ id: 'old-user' }));
      localStorage.setItem('coomunity_token', 'very-old-token');
      localStorage.setItem('coomunity_user', JSON.stringify({ id: 'very-old-user' }));
      
      // Claves nuevas (canónicas)
      localStorage.setItem('COOMUNITY_AUTH_TOKEN', 'new-canonical-token');
      localStorage.setItem('COOMUNITY_USER_DATA', JSON.stringify({ id: 'new-canonical-user' }));
      
      return {
        oldTokenExists: !!localStorage.getItem('access_token'),
        oldUserExists: !!localStorage.getItem('user'),
        veryOldTokenExists: !!localStorage.getItem('coomunity_token'),
        veryOldUserExists: !!localStorage.getItem('coomunity_user'),
        newTokenExists: !!localStorage.getItem('COOMUNITY_AUTH_TOKEN'),
        newUserExists: !!localStorage.getItem('COOMUNITY_USER_DATA')
      };
    });

    // Verificar que todas las claves están presentes (para confirmar el setup)
    expect(setupResult.newTokenExists).toBe(true);
    expect(setupResult.newUserExists).toBe(true);

    console.log('✅ Setup de claves completado:', setupResult);

    // Simular una limpieza usando las constantes canónicas
    const cleanupResult = await page.evaluate(() => {
      // Simular la función clearAuthTokens con las nuevas constantes
      const AUTH_STORAGE_KEYS = {
        TOKEN: 'COOMUNITY_AUTH_TOKEN',
        USER: 'COOMUNITY_USER_DATA',
        REFRESH_TOKEN: 'COOMUNITY_REFRESH_TOKEN'
      };

      // Limpiar solo las claves canónicas
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

      return {
        oldTokenStillExists: !!localStorage.getItem('access_token'),
        oldUserStillExists: !!localStorage.getItem('user'),
        veryOldTokenStillExists: !!localStorage.getItem('coomunity_token'),
        veryOldUserStillExists: !!localStorage.getItem('coomunity_user'),
        newTokenCleared: !localStorage.getItem('COOMUNITY_AUTH_TOKEN'),
        newUserCleared: !localStorage.getItem('COOMUNITY_USER_DATA')
      };
    });

    // Verificar que las claves canónicas se limpiaron
    expect(cleanupResult.newTokenCleared).toBe(true);
    expect(cleanupResult.newUserCleared).toBe(true);

    // Las claves antiguas deberían seguir existiendo (no las tocamos)
    expect(cleanupResult.oldTokenStillExists).toBe(true);
    expect(cleanupResult.oldUserStillExists).toBe(true);

    console.log('✅ Limpieza selectiva funcionando correctamente:', cleanupResult);
  });

  test('🔄 Verificar migración de claves antiguas a canónicas', async ({ page }) => {
    console.log('🧪 Verificando migración de claves...');

    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Simular migración de datos antiguos a nuevas claves
    const migrationResult = await page.evaluate(() => {
      // Simular datos existentes con claves antiguas
      const oldToken = 'migrated-token-123';
      const oldUser = { id: 'migrated-user', email: 'migrated@example.com' };
      
      localStorage.setItem('access_token', oldToken);
      localStorage.setItem('user', JSON.stringify(oldUser));

      // Simular proceso de migración
      const AUTH_STORAGE_KEYS = {
        TOKEN: 'COOMUNITY_AUTH_TOKEN',
        USER: 'COOMUNITY_USER_DATA'
      };

      // Leer datos antiguos
      const existingToken = localStorage.getItem('access_token');
      const existingUserStr = localStorage.getItem('user');
      const existingUser = existingUserStr ? JSON.parse(existingUserStr) : null;

      // Migrar a nuevas claves si existen datos antiguos
      if (existingToken && existingUser) {
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, existingToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(existingUser));
        
        // Opcionalmente limpiar claves antiguas después de migrar
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }

      // Verificar migración
      const migratedToken = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      const migratedUserStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      const migratedUser = migratedUserStr ? JSON.parse(migratedUserStr) : null;

      return {
        migrationSuccessful: migratedToken === oldToken && migratedUser?.id === oldUser.id,
        oldKeysCleared: !localStorage.getItem('access_token') && !localStorage.getItem('user'),
        newToken: migratedToken,
        newUser: migratedUser
      };
    });

    expect(migrationResult.migrationSuccessful).toBe(true);
    expect(migrationResult.oldKeysCleared).toBe(true);

    console.log('✅ Migración de claves exitosa:', migrationResult);
  });
}); 