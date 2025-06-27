/**
 * Utilidad para limpiar cachés y eliminar cualquier referencia al video inapropiado
 * Elimina miniatura inapropiada de ÜPlay - Limpieza completa
 */

export const cleanInappropriateVideoCache = () => {
  try {
    // Limpiar localStorage
    const localStorage = window.localStorage;
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value && (
          value.includes('dQw4w9WgXcQ') ||
          value.includes('rick') ||
          value.includes('roll') ||
          value.toLowerCase().includes('rickroll')
        )) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Removed from localStorage: ${key}`);
    });

    // Limpiar sessionStorage
    const sessionStorage = window.sessionStorage;
    const sessionKeysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value && (
          value.includes('dQw4w9WgXcQ') ||
          value.includes('rick') ||
          value.includes('roll') ||
          value.toLowerCase().includes('rickroll')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
    }

    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`🧹 Removed from sessionStorage: ${key}`);
    });

    // Limpiar React Query cache si existe
    if (window.queryClient) {
      window.queryClient.invalidateQueries();
      console.log('🧹 React Query cache invalidated');
    }

    // Forçar recarga si se encontraron elementos para limpiar
    if (keysToRemove.length > 0 || sessionKeysToRemove.length > 0) {
      console.log('🔄 Cache cleaned, reloading page...');
      window.location.reload();
    } else {
      console.log('✅ No inappropriate video cache found');
    }

  } catch (error) {
    console.error('❌ Error cleaning cache:', error);
  }
};

/**
 * Función para ejecutar inmediatamente al cargar la aplicación
 */
export const initCacheCleaner = () => {
  if (typeof window !== 'undefined') {
    // Ejecutar limpieza en el siguiente tick para evitar bloqueos
    setTimeout(cleanInappropriateVideoCache, 0);
  }
};
