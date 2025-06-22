import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Tipos para el sistema de feedback
export interface FeedbackData {
  id?: string;
  feedbackType: 'bug' | 'improvement' | 'missing-feature' | 'other';
  pageUrl: string;
  componentContext?: string;
  feedbackText: string;
  timestamp: Date;
  userAgent?: string;
  screenResolution?: string;
  additionalData?: Record<string, any>;
}

export interface FeedbackContextType {
  // Estado
  isFeedbackModeActive: boolean;
  isModalOpen: boolean;
  currentFeedback: Partial<FeedbackData>;

  // Acciones
  toggleFeedbackMode: () => void;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  updateFeedback: (field: keyof FeedbackData, value: any) => void;
  submitFeedback: (feedbackData: FeedbackData) => Promise<void>;
  clearFeedbackData: () => void;
}

// Contexto por defecto
const defaultContext: FeedbackContextType = {
  isFeedbackModeActive: false,
  isModalOpen: false,
  currentFeedback: {},
  toggleFeedbackMode: () => {},
  openFeedbackModal: () => {},
  closeFeedbackModal: () => {},
  updateFeedback: () => {},
  submitFeedback: async () => {},
  clearFeedbackData: () => {},
};

// Crear el contexto
const FeedbackContext = createContext<FeedbackContextType>(defaultContext);

// Hook personalizado para usar el contexto
export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext debe ser usado dentro de un FeedbackProvider');
  }
  return context;
};

// Alias para compatibilidad
export const useFeedback = useFeedbackContext;

// Props del provider
interface FeedbackProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  // Estado del modo feedback - ACTIVADO POR DEFECTO para recopilación de información
  const [isFeedbackModeActive, setIsFeedbackModeActive] = useState<boolean>(() => {
    // Cargar estado desde localStorage, activado por defecto para recolección de feedback
    const saved = localStorage.getItem('coomunity_feedback_mode_active');
    return saved !== 'false'; // Activado por defecto, solo se desactiva si se guarda como 'false'
  });

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Estado del feedback actual
  const [currentFeedback, setCurrentFeedback] = useState<Partial<FeedbackData>>({
    feedbackType: 'other',
    pageUrl: window.location.href,
    feedbackText: '',
    timestamp: new Date(),
  });

  // Toggle del modo feedback
  const toggleFeedbackMode = useCallback(() => {
    const newState = !isFeedbackModeActive;
    setIsFeedbackModeActive(newState);
    localStorage.setItem('coomunity_feedback_mode_active', newState.toString());

    console.log(`🎯 Feedback Mode ${newState ? 'ACTIVADO' : 'DESACTIVADO'}`);
  }, [isFeedbackModeActive]);

  // Abrir modal de feedback
  const openFeedbackModal = useCallback(() => {
    // Actualizar URL actual y timestamp
    setCurrentFeedback(prev => ({
      ...prev,
      pageUrl: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    }));

    setIsModalOpen(true);
    console.log('📝 Modal de Feedback ABIERTO');
  }, []);

  // Cerrar modal de feedback
  const closeFeedbackModal = useCallback(() => {
    setIsModalOpen(false);
    console.log('📝 Modal de Feedback CERRADO');
  }, []);

  // Actualizar campos del feedback
  const updateFeedback = useCallback((field: keyof FeedbackData, value: any) => {
    setCurrentFeedback(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Enviar feedback
  const submitFeedback = useCallback(async (feedbackData: FeedbackData) => {
    try {
      // Generar ID único
      const feedbackWithId = {
        ...feedbackData,
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      console.log('📤 Enviando Feedback:', feedbackWithId);

      // Simular envío al backend (por ahora)
      // TODO: Integrar con Backend NestJS en puerto 3002
      const response = await simulateBackendSubmission(feedbackWithId);

      // Guardar en localStorage como backup
      const savedFeedbacks = JSON.parse(localStorage.getItem('coomunity_feedbacks') || '[]');
      savedFeedbacks.push(feedbackWithId);
      localStorage.setItem('coomunity_feedbacks', JSON.stringify(savedFeedbacks));

      // Limpiar formulario
      setCurrentFeedback({
        feedbackType: 'other',
        pageUrl: window.location.href,
        feedbackText: '',
        timestamp: new Date(),
      });

      // Cerrar modal
      setIsModalOpen(false);

      console.log('✅ Feedback enviado exitosamente:', response);

      // Mostrar notificación de éxito
      alert('🎉 ¡Feedback enviado exitosamente! Gracias por tu contribución al Bien Común.');

    } catch (error) {
      console.error('❌ Error al enviar feedback:', error);

      // Mostrar notificación de error
      alert('❌ Error al enviar feedback. Por favor, inténtalo de nuevo.');
    }
  }, []);

  // Limpiar datos de feedback
  const clearFeedbackData = useCallback(() => {
    setCurrentFeedback({
      feedbackType: 'other',
      pageUrl: window.location.href,
      feedbackText: '',
      timestamp: new Date(),
    });
    console.log('🧹 Datos de feedback limpiados');
  }, []);

  // Valor del contexto
  const contextValue: FeedbackContextType = {
    isFeedbackModeActive,
    isModalOpen,
    currentFeedback,
    toggleFeedbackMode,
    openFeedbackModal,
    closeFeedbackModal,
    updateFeedback,
    submitFeedback,
    clearFeedbackData,
  };

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Función para simular envío al backend
const simulateBackendSubmission = async (feedbackData: FeedbackData): Promise<any> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simular respuesta del backend
  return {
    success: true,
    message: 'Feedback recibido y procesado',
    feedbackId: feedbackData.id,
    timestamp: new Date().toISOString(),
    // TODO: Integrar con endpoint real del Backend NestJS
    // POST http://localhost:3002/api/feedback
  };
};

export default FeedbackContext;
