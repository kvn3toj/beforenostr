/**
 * 🔢 Utilidades para formateo seguro de números
 * Previene errores de "Cannot read properties of undefined (reading 'toLocaleString')"
 */

/**
 * Formatea un número de forma segura usando toLocaleString
 * @param value - El valor a formatear (puede ser undefined o null)
 * @param defaultValue - Valor por defecto si value es undefined/null (default: 0)
 * @param locale - Locale para el formateo (default: 'es-ES')
 * @param options - Opciones de formateo
 * @returns String formateado
 */
export const safeToLocaleString = (
  value: number | undefined | null,
  defaultValue: number = 0,
  locale: string = 'es-ES',
  options?: Intl.NumberFormatOptions
): string => {
  const safeValue = value ?? defaultValue;
  return safeValue.toLocaleString(locale, options);
};

/**
 * Formatea un precio de forma segura
 * @param price - El precio a formatear
 * @param currency - La moneda ('ü', 'UNITS', 'COP', etc.)
 * @param defaultPrice - Precio por defecto si price es undefined/null
 * @returns String formateado del precio
 */
export const formatPrice = (
  price: number | undefined | null,
  currency: string = 'COP',
  defaultPrice: number = 0
): string => {
  const safePrice = price ?? defaultPrice;

  if (currency === 'ü' || currency === 'Ünits' || currency === 'UNITS') {
    return `ü ${safeToLocaleString(safePrice)}`;
  }

  if (currency === 'COP') {
    return `$${safeToLocaleString(safePrice)} COP`;
  }

  return `$${safeToLocaleString(safePrice)}`;
};

/**
 * Formatea métricas de CoomÜnity de forma segura
 * @param meritos - Mëritos del usuario
 * @param ondas - Öndas del usuario
 * @returns Objeto con valores formateados
 */
export const formatCommunityMetrics = (
  meritos: number | undefined | null,
  ondas: number | undefined | null
) => {
  return {
    meritos: safeToLocaleString(meritos),
    ondas: safeToLocaleString(ondas),
    meritosRaw: meritos ?? 0,
    ondasRaw: ondas ?? 0,
  };
};

/**
 * Formatea cantidades de forma compacta (1K, 1M, etc.)
 * @param value - El valor a formatear
 * @param defaultValue - Valor por defecto
 * @returns String formateado de forma compacta
 */
export const formatCompactNumber = (
  value: number | undefined | null,
  defaultValue: number = 0
): string => {
  const safeValue = value ?? defaultValue;

  if (safeValue >= 1000000) {
    return `${(safeValue / 1000000).toFixed(1)}M`;
  }

  if (safeValue >= 1000) {
    return `${(safeValue / 1000).toFixed(1)}K`;
  }

  return safeToLocaleString(safeValue);
};

/**
 * Formatea porcentajes de forma segura
 * @param value - El valor del porcentaje (0-100)
 * @param defaultValue - Valor por defecto
 * @param decimals - Número de decimales (default: 1)
 * @returns String formateado del porcentaje
 */
export const formatPercentage = (
  value: number | undefined | null,
  defaultValue: number = 0,
  decimals: number = 1
): string => {
  const safeValue = value ?? defaultValue;
  return `${safeValue.toFixed(decimals)}%`;
};

/**
 * Valida si un valor es un número válido
 * @param value - El valor a validar
 * @returns true si es un número válido, false en caso contrario
 */
export const isValidNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Convierte un valor a número de forma segura
 * @param value - El valor a convertir
 * @param defaultValue - Valor por defecto si la conversión falla
 * @returns Número válido
 */
export const toSafeNumber = (value: any, defaultValue: number = 0): number => {
  if (isValidNumber(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isValidNumber(parsed) ? parsed : defaultValue;
  }

  return defaultValue;
};
