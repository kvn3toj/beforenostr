import React from 'react';

// Debug automático en desarrollo: Carga dinámica solo en modo DEV.
if (import.meta.env.DEV) {
  import('@/utils/cosmic-debug.ts').then(({ default: debugCosmicTypes }) => {
    setTimeout(() => {
      debugCosmicTypes();
    }, 1000);
  });
}

// 🚀 IMPORTAR LA IMPLEMENTACIÓN COMPLETA DEL HOME
import { HomeEnhanced } from './HomeEnhanced';

// 🎯 Home principal que utiliza la implementación completa y optimizada
const Home: React.FC = () => {
  return <HomeEnhanced />;
};

export default Home;
