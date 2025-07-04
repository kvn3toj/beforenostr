import { useState, useEffect } from 'react';

/**
 * 🌐 Hook para detectar automáticamente el entorno de ejecución
 * Determina si la app se ejecuta en localhost o en acceso de red
 */
export const useNetworkDetection = () => {
  const [environment, setEnvironment] = useState<{
    isNetworkAccess: boolean;
    currentHost: string;
    apiBaseUrl: string;
    displayUrl: string;
  }>({
    isNetworkAccess: false,
    currentHost: 'localhost',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
    displayUrl: 'localhost'
  });

  useEffect(() => {
    const detectEnvironment = () => {
      const currentHost = window.location.hostname;
      const currentOrigin = window.location.origin;

      // Detectar si estamos en acceso de red
      const isNetworkAccess = currentHost !== 'localhost' && currentHost !== '127.0.0.1';

      // Determinar URL del API según el entorno
      let apiBaseUrl: string;

      if (isNetworkAccess) {
        // Usar la URL de red configurada o construir dinámicamente
        const networkApiUrl = import.meta.env.VITE_NETWORK_API_URL;
        if (networkApiUrl) {
          apiBaseUrl = networkApiUrl;
        } else {
          // Construir URL usando la misma IP pero puerto 3002
          apiBaseUrl = `http://${currentHost}:3002`;
        }
      } else {
        // Usar localhost para desarrollo local
        apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
      }

      console.log('🌐 Network Detection:', {
        currentHost,
        currentOrigin,
        isNetworkAccess,
        apiBaseUrl,
        envVars: {
          VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
          VITE_NETWORK_API_URL: import.meta.env.VITE_NETWORK_API_URL
        }
      });

      setEnvironment({
        isNetworkAccess,
        currentHost,
        apiBaseUrl,
        displayUrl: isNetworkAccess ? currentHost : 'localhost'
      });
    };

    // Ejecutar inmediatamente
    detectEnvironment();

    // También escuchar cambios en la URL (por si cambia dinámicamente)
    const handleLocationChange = () => {
      setTimeout(detectEnvironment, 100); // Pequeño delay para asegurar que location esté actualizado
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return environment;
};

/**
 * 🌐 Utilidad para mostrar información de red en desarrollo
 */
export const logNetworkInfo = () => {
  const currentHost = window.location.hostname;
  const currentOrigin = window.location.origin;
  const apiUrl = getApiUrl();

  console.group('🌐 CoomÜnity Network Information');
  console.log('Frontend URL:', currentOrigin);
  console.log('Backend API URL:', apiUrl);
  console.log('Network Access:', currentHost !== 'localhost');
  console.log('Current Host:', currentHost);
  console.groupEnd();
};
