import React from 'react';
import { Box } from '@mui/material';
import FeedbackModeToggle from './FeedbackModeToggle';
import FeedbackFloatingButton from './FeedbackFloatingButton';
import FeedbackCaptureModal from './FeedbackCaptureModal';
import { useFeedbackContext } from '../../contexts/FeedbackContext';

/**
 * Agente de Feedback Inteligente para CoomÜnity SuperApp - "Oráculo de CoomÜnity"
 *
 * Este componente implementa un sistema completo de recolección de feedback
 * para el prelanzamiento, incluyendo:
 *
 * 🎯 FUNCIONALIDADES PRINCIPALES:
 * - 🔘 Toggle de Modo Agente (solo para administradores)
 * - 🔴 Botón Flotante con 6 tipos de feedback específicos
 * - 📍 Selector interactivo de elementos UI con overlay visual
 * - 💬 Modal de captura de datos detallados con contexto técnico
 * - 🤖 Integración con LLM para análisis inteligente
 * - ⚡ Ejecución automática de scripts de análisis de código
 * - 📊 Envío estructurado al backend para Gamifier Admin
 * - 💾 Almacenamiento local como fallback si el backend no está disponible
 * - 🔔 Notificaciones visuales de éxito/error
 * - 💿 Persistencia del modo agente entre sesiones
 *
 * 🏗️ ARQUITECTURA:
 * - Frontend: SuperApp (captura) → Backend NestJS (procesamiento) → Gamifier Admin (gestión)
 * - Integración con tu infraestructura existente de +100 scripts de análisis
 * - Datos técnicos contextuales para debugging eficiente
 * - Context API para gestión centralizada del estado
 *
 * 🧙‍♂️ FILOSOFÍA COOMUNITY:
 * - Reciprocidad: Reciprocidad entre usuarios reportando y desarrolladores mejorando
 * - Bien Común: Feedback colectivo para mejorar la experiencia de todos
 * - Neguentropía: Organización inteligente del caos de bugs en mejoras sistemáticas
 */
export const FeedbackAgent: React.FC = () => {
  const {
    // Estado del agente
    isFeedbackModeActive,
    isSelectingElement,
    selectedFeedbackType,
    selectedElement,
    isModalOpen,
    canUseAgent,

    // Acciones principales
    toggleFeedbackMode,
    startFeedbackCapture,
    submitFeedback,
    closeModal
  } = useFeedbackContext();

  // No renderizar nada si el usuario no puede usar el agente
  if (!canUseAgent) {
    return null;
  }

  return (
    <Box>
      {/* Toggle de Modo Agente - Esquina superior derecha */}
      <FeedbackModeToggle
        isActive={isFeedbackModeActive}
        onToggle={toggleFeedbackMode}
      />

      {/* Botón Flotante - Solo visible cuando el modo agente está activo */}
      <FeedbackFloatingButton
        isVisible={isFeedbackModeActive}
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
          sx={{
            background: 'rgba(0, 123, 255, 0.02)',
            backdropFilter: 'blur(0.5px)',
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
};

export default FeedbackAgent;
