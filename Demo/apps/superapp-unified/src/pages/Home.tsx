import React from 'react';

// 🌟 Debug temporal para verificar ThematicElement.ETHER
import debugCosmicTypes from '../utils/cosmic-debug.ts';

// Debug automático en desarrollo
if (import.meta.env.DEV) {
  setTimeout(() => {
    debugCosmicTypes();
  }, 1000);
}

// 🚀 IMPORTAR LA IMPLEMENTACIÓN COMPLETA DEL HOME
import { HomeEnhanced } from './HomeEnhanced';

// 🎯 Home principal que utiliza la implementación completa y optimizada
const Home: React.FC = () => {
  return <HomeEnhanced />;
};

export default Home;
