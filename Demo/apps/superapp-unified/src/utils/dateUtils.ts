/**
 * 🕒 Date Utilities
 *
 * Safe date formatting functions to handle various edge cases
 */

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * 🛡️ Safely format timestamp to relative time
 * Handles undefined, null, invalid dates gracefully
 */
export const safeFormatDistance = (
  timestamp: string | Date | undefined | null
): string => {
  try {
    // Handle undefined/null cases
    if (!timestamp) {
      console.warn(`[DateUtils] Error formatting date: ${timestamp}`);
      return 'hace unos momentos';
    }

    // Convert string to Date if needed
    const date =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    // Verify the date is valid
    if (!date || isNaN(date.getTime())) {
      console.warn(`[DateUtils] Invalid date received: ${timestamp}`);
      return 'hace unos momentos';
    }

    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: es,
    });
  } catch (error) {
    console.error(`[DateUtils] Error formatting date: ${timestamp}`, error);
    return 'hace unos momentos';
  }
};

/**
 * 🛡️ Safely format timestamp to locale string
 */
export const safeFormatDate = (
  timestamp: string | Date | undefined | null
): string => {
  try {
    if (!timestamp) {
      return 'Fecha no disponible';
    }

    const date =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    if (!date || isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error(`[DateUtils] Error formatting date: ${timestamp}`, error);
    return 'Fecha no disponible';
  }
};

/**
 * 🛡️ Check if a timestamp is valid
 */
export const isValidTimestamp = (
  timestamp: string | Date | undefined | null
): boolean => {
  if (!timestamp) return false;

  try {
    const date =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date instanceof Date && !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * 🛡️ Get current timestamp as safe string
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * 🛡️ Ensure timestamp has a valid format
 */
export const normalizeTimestamp = (
  timestamp: string | Date | undefined | null
): string => {
  if (!timestamp) {
    return getCurrentTimestamp();
  }

  try {
    const date =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    if (!date || isNaN(date.getTime())) {
      return getCurrentTimestamp();
    }

    return date.toISOString();
  } catch {
    return getCurrentTimestamp();
  }
};

export default {
  safeFormatDistance,
  safeFormatDate,
  isValidTimestamp,
  getCurrentTimestamp,
  normalizeTimestamp,
};
