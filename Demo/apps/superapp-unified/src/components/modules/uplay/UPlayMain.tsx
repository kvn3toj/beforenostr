import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

// 🔥 NUEVO DASHBOARD 100% BACKEND-DRIVEN
import { UPlayGamifiedDashboard } from './UPlayGamifiedDashboard';

/**
 * UPlayMain Component
 *
 * Main entry point for the ÜPlay (GPL - Gamified Play List) module.
 * This component provides the interactive gamified video player experience
 * with questions, rewards, and user engagement tracking.
 *
 * 🔥 REESCRITO COMPLETAMENTE (Enero 2025)
 * Ahora usa el UPlayGamifiedDashboard que es 100% backend-driven:
 * - Conecta directamente con backend NestJS (puerto 3002)
 * - Muestra videos reales agrupados por playlist/rutas de aprendizaje
 * - Estados claros de loading, error y vacío
 * - Eliminación total de datos mock hardcodeados
 * - UI mejorada con secciones horizontales por playlist
 * - Logging de debug auditable
 * - Cambios visuales claros entre mock vs datos reales
 *
 * Features:
 * - Videos reales del backend agrupados por playlist
 * - Preguntas dinámicas por video desde backend
 * - Métricas de dashboard en tiempo real
 * - Navegación fluida a reproductor de video
 * - Estados de progreso y recompensas
 *
 * Philosophy Integration:
 * - Ayni: Balanced exchange through learning and engagement
 * - Bien Común: Educational content that benefits the community
 * - Öndas: Positive energy generated through correct answers
 * - Mëritos: Recognition for contributing to collective knowledge
 */
const UPlayMain: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🔥 DASHBOARD BACKEND-DRIVEN - Elimina dependencia de datos mock
  // El nuevo UPlayGamifiedDashboard se adapta automáticamente a mobile/desktop
  // y muestra datos reales del backend con agrupamiento por playlist visible
  return <UPlayGamifiedDashboard />;
};

export default UPlayMain;
