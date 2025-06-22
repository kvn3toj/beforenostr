import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Carga archivos de traducción vía HTTP
  .use(LanguageDetector) // Detecta el idioma del usuario
  .use(initReactI18next) // Pasa la instancia de i18n a react-i18next
  .init({
    fallbackLng: 'es', // Idioma de fallback si el detectado no está disponible
    debug: process.env.NODE_ENV !== 'production', // Habilita debug en desarrollo

    // Mapear idiomas específicos de región a idiomas base
    load: 'languageOnly', // Cargar solo el idioma base (en lugar de en-US)

    // Configuración de detección de idioma
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // No escapar valores de interpolación
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Ruta donde cargar archivos de traducción
    },
    ns: ['translation'], // Namespaces por defecto
    defaultNS: 'translation', // Namespace por defecto

    // Idiomas soportados
    supportedLngs: ['en', 'es'],

    // Configuración para manejar idiomas no soportados
    nonExplicitSupportedLngs: true,
  });

export default i18n;
