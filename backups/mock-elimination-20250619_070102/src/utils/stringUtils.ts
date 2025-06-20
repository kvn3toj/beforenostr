/**
 * 🔧 String Utilities - CoomÜnity SuperApp
 *
 * Utilidades para manipulación segura de strings, especialmente para evitar
 * errores de "Cannot read properties of null (reading 'split')"
 */

/**
 * Divide una cadena de texto de forma segura
 * @param text - Texto a dividir (puede ser null o undefined)
 * @param separator - Separador para la división
 * @param fallback - Valor por defecto si el texto es null/undefined
 * @returns Array de strings resultado de la división
 */
export function safeSplit(
  text: string | null | undefined,
  separator: string,
  fallback: string = ''
): string[] {
  if (!text) {
    return fallback ? [fallback] : [''];
  }
  return text.split(separator);
}

/**
 * Obtiene el primer nombre de forma segura
 * @param fullName - Nombre completo (puede ser null o undefined)
 * @param fallback - Valor por defecto
 * @returns Primer nombre o fallback
 */
export function getFirstName(
  fullName: string | null | undefined,
  fallback: string = 'Usuario'
): string {
  if (!fullName) {
    return fallback;
  }
  return fullName.split(' ')[0] || fallback;
}

/**
 * Obtiene la primera parte de una ubicación (antes de la coma)
 * @param location - Ubicación completa (puede ser null o undefined)
 * @param fallback - Valor por defecto
 * @returns Primera parte de la ubicación o fallback
 */
export function getLocationCity(
  location: string | null | undefined,
  fallback: string = 'Online'
): string {
  if (!location) {
    return fallback;
  }
  return location.split(',')[0] || fallback;
}

/**
 * Divide una cadena y filtra elementos vacíos
 * @param text - Texto a dividir
 * @param separator - Separador
 * @param fallback - Valor por defecto
 * @returns Array filtrado sin elementos vacíos
 */
export function safeSplitAndFilter(
  text: string | null | undefined,
  separator: string,
  fallback: string = ''
): string[] {
  return safeSplit(text, separator, fallback).filter(
    (item) => item.trim() !== ''
  );
}

/**
 * Convierte palabras en hashtags procesando texto de forma segura
 * @param content - Contenido del post
 * @returns Array de elementos (texto o JSX)
 */
export function safeProcessHashtagsAndMentions(
  content: string | null | undefined
): any[] {
  if (!content) {
    return [''];
  }

  return content.split(' ').map((word, index) => {
    if (word.startsWith('#')) {
      return { type: 'hashtag', word, index };
    } else if (word.startsWith('@')) {
      return { type: 'mention', word, index };
    } else {
      return { type: 'text', word, index };
    }
  });
}

/**
 * Trunca texto de forma segura
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @param suffix - Sufijo para texto truncado
 * @returns Texto truncado o original
 */
export function safeTruncate(
  text: string | null | undefined,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitaliza la primera letra de forma segura
 * @param text - Texto a capitalizar
 * @returns Texto capitalizado
 */
export function safeCapitalize(text: string | null | undefined): string {
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formatea nombres de usuario de forma segura
 * @param firstName - Primer nombre
 * @param lastName - Apellido
 * @param fallback - Valor por defecto
 * @returns Nombre formateado
 */
export function formatUserName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  fallback: string = 'Usuario'
): string {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';

  if (!first && !last) {
    return fallback;
  }

  return `${first} ${last}`.trim();
}

/**
 * Valida y formatea email de forma segura
 * @param email - Email a validar
 * @returns Email formateado o string vacío
 */
export function safeFormatEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email.trim().toLowerCase();
}

/**
 * Extrae el nombre de usuario de un email de forma segura
 * @param email - Email del usuario
 * @param fallback - Valor por defecto
 * @returns Nombre de usuario extraído del email
 */
export function getUsernameFromEmail(
  email: string | null | undefined,
  fallback: string = 'Usuario'
): string {
  if (!email) {
    return fallback;
  }

  const parts = email.split('@');
  return parts[0] || fallback;
}
