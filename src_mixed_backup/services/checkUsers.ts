import { authService } from './auth.service';

export async function checkUserSession() {
  try {
    // Verificar si hay sesión válida con el backend NestJS
    const hasValidSession = await authService.hasValidSession();
    
    if (hasValidSession) {
      console.log('[CheckUsers] Sesión válida encontrada');
      return true;
    }
    
    console.log('[CheckUsers] No hay sesión válida');
    return false;
  } catch (error) {
    console.error('[CheckUsers] Error verificando sesión:', error);
    return false;
  }
} 