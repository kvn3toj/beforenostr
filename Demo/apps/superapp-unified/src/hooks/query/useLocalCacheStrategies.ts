import { useCallback } from 'react';

// 💾 ESTRATEGIAS DE CACHE LOCAL
// Hooks especializados para cache en localStorage sin dependencias circulares

/**
 * Hook para cache persistence local (LocalStorage)
 */
export const useLocalCache = () => {
  const setLocalCache = useCallback((key: string, data: any, expiryMinutes = 60) => {
    try {
      const expiry = Date.now() + (expiryMinutes * 60 * 1000);
      const cacheData = {
        data,
        expiry,
        timestamp: Date.now(),
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to set local cache:', error);
    }
  }, []);

  const getLocalCache = useCallback((key: string) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, expiry } = JSON.parse(cached);
      if (Date.now() > expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to get local cache:', error);
      return null;
    }
  }, []);

  const clearLocalCache = useCallback((key?: string) => {
    try {
      if (key) {
        localStorage.removeItem(`cache_${key}`);
      } else {
        // Clear all cache entries
        const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
        keys.forEach(k => localStorage.removeItem(k));
      }
    } catch (error) {
      console.warn('Failed to clear local cache:', error);
    }
  }, []);

  const getCacheInfo = useCallback((key?: string) => {
    try {
      if (key) {
        const cached = localStorage.getItem(`cache_${key}`);
        if (!cached) return null;
        
        const { expiry, timestamp } = JSON.parse(cached);
        return {
          key,
          expiresAt: new Date(expiry),
          createdAt: new Date(timestamp),
          isExpired: Date.now() > expiry,
        };
      } else {
        // Get info for all cache entries
        const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
        return keys.map(fullKey => {
          const key = fullKey.replace('cache_', '');
          const cached = localStorage.getItem(fullKey);
          if (!cached) return null;
          
          const { expiry, timestamp } = JSON.parse(cached);
          return {
            key,
            expiresAt: new Date(expiry),
            createdAt: new Date(timestamp),
            isExpired: Date.now() > expiry,
          };
        }).filter(Boolean);
      }
    } catch (error) {
      console.warn('Failed to get cache info:', error);
      return null;
    }
  }, []);

  return {
    setLocalCache,
    getLocalCache,
    clearLocalCache,
    getCacheInfo,
  };
};

/**
 * Hook para cache de sesión (SessionStorage)
 */
export const useSessionCache = () => {
  const setSessionCache = useCallback((key: string, data: any) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(`session_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to set session cache:', error);
    }
  }, []);

  const getSessionCache = useCallback((key: string) => {
    try {
      const cached = sessionStorage.getItem(`session_${key}`);
      if (!cached) return null;

      const { data } = JSON.parse(cached);
      return data;
    } catch (error) {
      console.warn('Failed to get session cache:', error);
      return null;
    }
  }, []);

  const clearSessionCache = useCallback((key?: string) => {
    try {
      if (key) {
        sessionStorage.removeItem(`session_${key}`);
      } else {
        // Clear all session cache entries
        const keys = Object.keys(sessionStorage).filter(k => k.startsWith('session_'));
        keys.forEach(k => sessionStorage.removeItem(k));
      }
    } catch (error) {
      console.warn('Failed to clear session cache:', error);
    }
  }, []);

  return {
    setSessionCache,
    getSessionCache,
    clearSessionCache,
  };
}; 