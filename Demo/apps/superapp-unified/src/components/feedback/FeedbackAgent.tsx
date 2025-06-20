import React from 'react';
import { Box } from '@mui/material';
import FeedbackModeToggle from './FeedbackModeToggle';
import FeedbackFloatingButton from './FeedbackFloatingButton';
import FeedbackCaptureModal from './FeedbackCaptureModal';
import useFeedbackAgent from '../../hooks/useFeedbackAgent';

/**
 * Agente de Feedback Inteligente para CoomÜnity SuperApp
 *
 * Este componente implementa un sistema completo de recolección de feedback
 * para el prelanzamiento, incluyendo:
 *
 * - 🔘 Toggle de Modo Agente (solo para administradores)
 * - 🔴 Botón Flotante con tipos de feedback
 * - 📍 Selector interactivo de elementos UI
 * - 💬 Modal de captura de datos detallados
 * - 🤖 Integración con LLM para análisis
 * - ⚡ Ejecución automática de scripts de análisis de código
 * - 📊 Envío estructurado al backend para Gamifier Admin
 *
 * Arquitectura:
 * - Frontend: SuperApp (captura) → Backend NestJS (procesamiento) → Gamifier Admin (gestión)
 * - Integración con tu infraestructura existente de +100 scripts de análisis
 * - Datos técnicos contextuales para debugging eficiente
 */
export const FeedbackAgent: React.FC = () => {
  const {
    // Estado
    isAgentMode,
    isSelectingElement,
    selectedFeedbackType,
    selectedElement,
    isModalOpen,
    canUseAgent,

    // Acciones
    toggleAgentMode,
    startFeedbackCapture,
    submitFeedback,
    closeModal
  } = useFeedbackAgent();

  // No renderizar nada si el usuario no puede usar el agente
  if (!canUseAgent) {
    return null;
  }

  return (
    <Box>
      {/* Toggle de Modo Agente - Esquina superior derecha */}
      <FeedbackModeToggle
        isActive={isAgentMode}
        onToggle={toggleAgentMode}
      />

      {/* Botón Flotante - Solo visible cuando el modo agente está activo */}
      <FeedbackFloatingButton
        isVisible={isAgentMode}
        onFeedbackStart={startFeedbackCapture}
      />

      {/* Modal de Captura de Feedback */}
      <FeedbackCaptureModal
        isOpen={isModalOpen}
        feedbackType={selectedFeedbackType}
        selectedElement={selectedElement}
        onClose={closeModal}
        onSubmit={submitFeedback}
      />

      {/* Indicador visual cuando se está seleccionando elemento */}
      {isSelectingElement && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={9998}
          pointerEvents="none"
          sx={{
            background: 'rgba(0, 123, 255, 0.02)',
            backdropFilter: 'blur(0.5px)',
          }}
        />
      )}
    </Box>
  );
};

export default FeedbackAgent;
