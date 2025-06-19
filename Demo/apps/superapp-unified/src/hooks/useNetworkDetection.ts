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

      // Detectar si estamos en acceso de red (no localhost)
      const isNetworkAccess = currentHost !== 'localhost' && currentHost !== '127.0.0.1';

      let apiBaseUrl: string;
      let displayUrl: string;

      if (isNetworkAccess) {
        // 🌐 ACCESO DE RED: usar la IP de red para el backend
        const networkIP = currentHost; // 192.168.1.37
        apiBaseUrl = `http://${networkIP}:3002`;
        displayUrl = `${networkIP}:3001`;

        console.log('🌐 Network Access Detected:', {
          frontend: currentOrigin,
          backend: apiBaseUrl,
          networkIP
        });
      } else {
        // 🏠 LOCALHOST: usar configuración local
        apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
        displayUrl = 'localhost:3001';

        console.log('🏠 Localhost Access Detected:', {
          frontend: currentOrigin,
          backend: apiBaseUrl
        });
      }

      setEnvironment({
        isNetworkAccess,
        currentHost,
        apiBaseUrl,
        displayUrl
      });
    };

    detectEnvironment();

    // Re-detectar si cambia la URL (por si acaso)
    window.addEventListener('hashchange', detectEnvironment);
    window.addEventListener('popstate', detectEnvironment);

    return () => {
      window.removeEventListener('hashchange', detectEnvironment);
      window.removeEventListener('popstate', detectEnvironment);
    };
  }, []);

  return environment;
};

/**
 * 🔧 Utilidad para obtener la URL del API según el entorno
 */
export const getApiUrl = (): string => {
  const currentHost = window.location.hostname;
  const isNetworkAccess = currentHost !== 'localhost' && currentHost !== '127.0.0.1';

  if (isNetworkAccess) {
    return `http://${currentHost}:3002`;
  }

  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
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
