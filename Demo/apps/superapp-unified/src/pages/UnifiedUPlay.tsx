import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import UnifiedUPlayPlayer from '../components/modules/uplay/UnifiedUPlayPlayer';

/**
 * UnifiedUPlay Page Component
 * 
 * Página unificada para el reproductor ÜPlay que combina lo mejor de:
 * - Experiencia estándar con preguntas interactivas
 * - Gamificación avanzada con Mëritos y Öndas
 * - Diseño adaptativo para móvil y desktop
 * - Sistema de recompensas Ayni
 * 
 * Características unificadas:
 * - Sistema de preguntas y respuestas interactivas
 * - Gamificación completa con métricas y progreso
 * - Diseño responsivo y adaptativo
 * - Integración con backend real
 * - Analytics y tracking
 * - Accesibilidad mejorada
 * - Filosofía CoomÜnity integrada
 */

const UnifiedUPlay: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();

  // Configuración unificada que combina lo mejor de todos los modos
  const unifiedConfig = React.useMemo(() => ({
    autoPlay: false,
    showStats: true,
    enableQuestions: true,
    enableGamification: true,
    enableRewards: true,
    enableAnalytics: true,
    mode: 'unified' as const,
  }), []);

  return (
    <UnifiedUPlayPlayer
      videoId={videoId}
      {...unifiedConfig}
    />
  );
};

export default UnifiedUPlay; 