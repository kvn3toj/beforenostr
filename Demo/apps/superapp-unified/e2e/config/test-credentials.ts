/**
 * 🔐 CREDENCIALES VERIFICADAS DEL BACKEND - CONFIGURACIÓN CENTRALIZADA
 * 
 * REGLA CRÍTICA: SIEMPRE usar estas credenciales verificadas del backend NestJS.
 * NO inventar credenciales que causan errores 400/401 y desperdician tokens.
 * 
 * Fuente de Verdad: backend/prisma/seed.ts
 */

export const VERIFIED_CREDENTIALS = {
  /**
   * 🔑 Administrador Principal
   * Roles: ['admin']
   * Uso: Tests de funcionalidades administrativas, debugging avanzado
   */
  ADMIN: {
    email: 'admin@gamifier.com',
    password: 'admin123',
    roles: ['admin'],
    description: 'Administrador principal con todos los permisos'
  },

  /**
   * 👤 Usuario Regular
   * Roles: ['user']
   * Uso: Tests de funcionalidades básicas, flujos de usuario estándar
   */
  USER: {
    email: 'user@gamifier.com',
    password: '123456',
    roles: ['user'],
    description: 'Usuario regular para tests básicos'
  },

  /**
   * 💎 Usuario Premium
   * Roles: ['user', 'premium']
   * Uso: Tests de funcionalidades premium
   */
  PREMIUM: {
    email: 'premium@gamifier.com',
    password: '123456',
    roles: ['user', 'premium'],
    description: 'Usuario premium para tests de funcionalidades avanzadas'
  },

  /**
   * 🎨 Content Creator
   * Roles: ['user', 'creator']
   * Uso: Tests de creación de contenido
   */
  CREATOR: {
    email: 'creator@gamifier.com',
    password: '123456',
    roles: ['user', 'creator'],
    description: 'Creador de contenido para tests de creación'
  },

  /**
   * 🛡️ Moderador
   * Roles: ['user', 'moderator']
   * Uso: Tests de moderación
   */
  MODERATOR: {
    email: 'moderator@gamifier.com',
    password: '123456',
    roles: ['user', 'moderator'],
    description: 'Moderador para tests de moderación'
  }
} as const;

/**
 * ❌ CREDENCIALES PROHIBIDAS
 * Estas credenciales causan errores y NO deben usarse NUNCA
 */
export const FORBIDDEN_CREDENTIALS = [
  'invalid@example.com',
  'test@test.com',
  'fake@fake.com',
  'nonexistent@domain.com',
  'wrong@email.com',
  'invalid@invalid.com'
] as const;

/**
 * 🎯 CONFIGURACIÓN DE ENDPOINTS
 */
export const BACKEND_CONFIG = {
  BASE_URL: 'http://localhost:3002',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    HEALTH: '/health',
    CURRENT_USER: '/auth/me'
  }
} as const;

/**
 * 🧪 HELPER FUNCTIONS PARA TESTS
 */

/**
 * Obtiene las credenciales para un tipo de usuario específico
 */
export function getCredentials(userType: keyof typeof VERIFIED_CREDENTIALS) {
  return VERIFIED_CREDENTIALS[userType];
}

/**
 * Valida que las credenciales no estén en la lista prohibida
 */
export function validateCredentials(email: string): boolean {
  return !FORBIDDEN_CREDENTIALS.includes(email as any);
}

/**
 * Helper para login en tests de Playwright
 */
export async function performLogin(
  page: any, 
  userType: keyof typeof VERIFIED_CREDENTIALS = 'USER'
) {
  const credentials = getCredentials(userType);
  
  console.log(`🔐 Logging in as ${userType}: ${credentials.email}`);
  
  await page.fill('[data-testid="login-email-input"] input', credentials.email);
  await page.fill('[data-testid="login-password-input"] input', credentials.password);
  await page.click('[data-testid="login-submit-button"]');
  
  // Esperar a que se complete el login
  await page.waitForURL('**/', { timeout: 15000 });
  
  console.log(`✅ Login successful for ${userType}`);
}

/**
 * Helper para verificar el backend con cURL
 */
export function getCurlCommand(userType: keyof typeof VERIFIED_CREDENTIALS = 'USER'): string {
  const credentials = getCredentials(userType);
  
  return `curl -X POST "${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.ENDPOINTS.LOGIN}" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "${credentials.email}", "password": "${credentials.password}"}'`;
}

/**
 * Tipos TypeScript para mayor seguridad
 */
export type UserType = keyof typeof VERIFIED_CREDENTIALS;
export type CredentialSet = typeof VERIFIED_CREDENTIALS[UserType];

export default VERIFIED_CREDENTIALS; 