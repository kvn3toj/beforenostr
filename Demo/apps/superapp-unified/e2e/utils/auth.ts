import { type Page } from '@playwright/test';

/**
 * Credenciales por defecto para tests E2E
 * Estas credenciales están definidas en el backend NestJS (prisma/seed.ts)
 */
const defaultUser = {
  email: 'user@gamifier.com',
  password: '123456',
};

/**
 * Función de utilidad para realizar login en tests E2E
 * @param page - Instancia de Page de Playwright
 * @param user - Credenciales del usuario (opcional, usa credenciales por defecto)
 */
export async function loginAs(page: Page, user = defaultUser) {
  // Navegar a la página de login
  await page.goto('/login');
  
  // Rellenar el formulario de login
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Contraseña').fill(user.password);
  
  // Hacer clic en el botón de login
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  
  // Esperar a que el login se complete y estemos fuera de la página de login
  await page.waitForURL((url) => !url.pathname.includes('/login'));
}

/**
 * Credenciales adicionales disponibles para tests específicos
 */
export const testCredentials = {
  admin: {
    email: 'admin@gamifier.com',
    password: 'admin123',
  },
  user: {
    email: 'user@gamifier.com',
    password: '123456',
  },
  premium: {
    email: 'premium@gamifier.com',
    password: '123456',
  },
  creator: {
    email: 'creator@gamifier.com',
    password: '123456',
  },
  moderator: {
    email: 'moderator@gamifier.com',
    password: '123456',
  },
}; 