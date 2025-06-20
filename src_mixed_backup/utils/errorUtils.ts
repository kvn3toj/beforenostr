// Podrías necesitar importar TFunction de i18next si quieres tipar 't' más estrictamente,
// pero (key: string, options?: any) => string es generalmente suficiente.

export function extractErrorMessage(
  error: unknown,
  t: (key: string, options?: any) => string
): string {
  const defaultErrorMessage = t('error_generic');

  if (typeof error === 'object' && error !== null) {
    // Intenta acceder a propiedades comunes de errores de API
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string; // Para errores que ya tienen un 'message' en el nivel superior
    };

    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }
    // Si el error es un objeto pero no tiene la estructura response.data,
    // pero sí tiene una propiedad 'message' (podría ser un Error estándar o un error de Supabase)
    if (apiError.message) {
      return apiError.message;
    }
  }

  // Si es una instancia de Error y no se capturó su 'message' arriba
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // Si el error es simplemente un string
  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }

  // Fallback al mensaje genérico
  return defaultErrorMessage;
} 