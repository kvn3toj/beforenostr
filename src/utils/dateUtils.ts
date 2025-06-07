import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Cache para fechas formateadas
const formatCache = new Map<string, string>();

/**
 * Función optimizada para formatear fechas con caché interno
 * para evitar re-renderizados innecesarios
 */
export const formatDate = (dateInput: string | Date | null | undefined, formatPattern: string = 'PP'): string => {
  if (!dateInput) {
    return '-';
  }

  const dateString = typeof dateInput === 'string' ? dateInput : dateInput.toISOString();
  const cacheKey = `${dateString}-${formatPattern}`;

  // Verificar caché
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.error('formatDate: Invalid date:', dateInput);
      return 'Fecha inválida';
    }

    const formatted = format(date, formatPattern, { locale: es });
    
    // Guardar en caché (limitar tamaño del caché)
    if (formatCache.size > 1000) {
      formatCache.clear();
    }
    formatCache.set(cacheKey, formatted);
    
    return formatted;
  } catch (error) {
    console.error('formatDate: Error formatting date:', dateInput, error);
    return 'Error en fecha';
  }
};

/**
 * Función para formatear fecha y hora
 */
export const formatDateTime = (dateInput: string | Date | null | undefined): string => {
  return formatDate(dateInput, 'PPp');
};

/**
 * Función para formatear solo la hora
 */
export const formatTime = (dateInput: string | Date | null | undefined): string => {
  return formatDate(dateInput, 'p');
}; 