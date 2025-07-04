/**
 * Tipos para autenticación y autorización
 * Purificación alquímica de SAGE: eliminando 'any' por tipos explícitos
 */

export interface JwtPayload {
  /** ID del usuario (subject) */
  sub: string;
  /** Email del usuario */
  email: string;
  /** Roles del usuario */
  roles: string[];
  /** Timestamp de emisión del token */
  iat?: number;
  /** Timestamp de expiración del token */
  exp?: number;
}

export interface AuthenticatedUser {
  /** ID del usuario */
  id: string;
  /** Email del usuario */
  email: string;
  /** Roles asignados al usuario */
  roles: string[];
  /** Datos adicionales del perfil */
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface AuthenticatedRequest extends Request {
  /** Usuario autenticado (inyectado por JWT Guard) */
  user: JwtPayload;
}
