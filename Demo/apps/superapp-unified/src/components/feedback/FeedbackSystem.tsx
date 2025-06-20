import React from 'react';
import { Box } from '@mui/material';
import { useFeedback } from '../../contexts/FeedbackContext';
import FeedbackModal from '../common/FeedbackModal';
import FeedbackButton from '../common/FeedbackButton';

/**
 * Sistema Completo de Feedback para el Oráculo de CoomÜnity
 *
 * Este componente integra todos los elementos del sistema de feedback:
 * - Toggle de modo (se debe integrar en el panel de administración)
 * - Botón flotante (visible cuando el modo está activo)
 * - Modal de recopilación de feedback
 *
 * Siguiendo los principios de Ayni y contribuyendo al Bien Común.
 */
const FeedbackSystem: React.FC = () => {
  const {
    isFeedbackModeActive,
    isModalOpen,
    openFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
  } = useFeedback();

  // Manejar inicio de feedback
  const handleFeedbackStart = (type?: string) => {
    if (type) {
      // TODO: Actualizar el tipo de feedback en el contexto
      console.log('🎯 Iniciando feedback de tipo:', type);
    }
    openFeedbackModal();
  };

  return (
    <Box>
      {/* Botón Flotante - Solo visible cuando el modo está activo */}
      <FeedbackButton
        isVisible={isFeedbackModeActive}
        onFeedbackStart={handleFeedbackStart}
      />

      {/* Modal de Feedback */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={closeFeedbackModal}
        onSubmit={submitFeedback}
      />
    </Box>
  );
};

export default FeedbackSystem;
