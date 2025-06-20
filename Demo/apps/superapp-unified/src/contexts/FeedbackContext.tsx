import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FeedbackType } from '../components/feedback/FeedbackFloatingButton';
import { FeedbackData } from '../components/feedback/FeedbackCaptureModal';
import { useAuth } from './AuthContext';

interface SelectedElement {
  tagName: string;
  id?: string;
  className?: string;
  text?: string;
  position: { x: number; y: number };
}

interface FeedbackContextValue {
  // Estado del Agente
  isFeedbackModeActive: boolean;
  isSelectingElement: boolean;
  selectedFeedbackType: FeedbackType | null;
  selectedElement: SelectedElement | null;
  isModalOpen: boolean;
  canUseAgent: boolean;

  // Acciones principales
  toggleFeedbackMode: (enabled?: boolean) => void;
  startFeedbackCapture: (type: FeedbackType, buttonPosition: { x: number; y: number }) => void;
  submitFeedback: (feedbackData: FeedbackData) => Promise<void>;
  closeModal: () => void;

  // Utilidades
  resetFeedbackState: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

interface FeedbackProviderProps {
  children: ReactNode;
}

interface CodeAnalysisResult {
  scriptName: string;
  success: boolean;
  results: any;
  warnings: string[];
  suggestions: string[];
  executionTime: number;
}

interface FeedbackSubmissionResponse {
  id: string;
  status: 'submitted' | 'analyzing' | 'completed';
  codeAnalysis?: CodeAnalysisResult[];
  aiSuggestions?: string[];
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // Estado central del agente
  const [isFeedbackModeActive, setIsFeedbackModeActive] = useState(false);
  const [isSelectingElement, setIsSelectingElement] = useState(false);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<FeedbackType | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Solo administradores pueden usar el agente
  const canUseAgent = user?.roles?.includes('admin') || false;

  // Función para activar/desactivar el modo agente
  const toggleFeedbackMode = useCallback((enabled?: boolean) => {
    if (!canUseAgent) {
      console.warn('🚫 Solo los administradores pueden activar el modo feedback');
      return;
    }

    const newState = enabled !== undefined ? enabled : !isFeedbackModeActive;
    setIsFeedbackModeActive(newState);

    // Limpiar estado cuando se desactiva
    if (!newState) {
      resetFeedbackState();
      removeElementSelectionListeners();
    }

    console.log(newState ? '🤖 Modo Agente Activado - Oráculo de CoomÜnity' : '💤 Modo Agente Desactivado');

    // Persistir estado en localStorage
    localStorage.setItem('COOMUNITY_FEEDBACK_MODE', JSON.stringify(newState));
  }, [canUseAgent, isFeedbackModeActive]);

  // Función para iniciar captura de feedback
  const startFeedbackCapture = useCallback((type: FeedbackType, buttonPosition: { x: number; y: number }) => {
    setSelectedFeedbackType(type);
    setIsSelectingElement(true);

    console.log(`🎯 Iniciando captura de feedback: ${type}`);
    enableElementSelection();
  }, []);

  // Función para habilitar selección de elementos
  const enableElementSelection = useCallback(() => {
    // Crear overlay para capturar clics
    const overlay = document.createElement('div');
    overlay.id = 'feedback-selection-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      cursor: crosshair;
      background: rgba(0, 123, 255, 0.1);
      backdrop-filter: blur(1px);
      border: 2px dashed rgba(0, 123, 255, 0.5);
    `;

    // Agregar indicador visual
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      background: rgba(0, 123, 255, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: system-ui;
      font-size: 14px;
      pointer-events: none;
    `;
    indicator.textContent = 'Haz clic en el elemento para reportar feedback • ESC para cancelar';
    document.body.appendChild(indicator);

    // Event listener para capturar el clic
    const handleElementClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Obtener el elemento debajo del overlay
      overlay.style.pointerEvents = 'none';
      const targetElement = document.elementFromPoint(event.clientX, event.clientY);
      overlay.style.pointerEvents = 'auto';

      if (targetElement && targetElement !== overlay) {
        const elementInfo: SelectedElement = {
          tagName: targetElement.tagName,
          id: targetElement.id || undefined,
          className: targetElement.className || undefined,
          text: targetElement.textContent?.trim().substring(0, 200) || undefined,
          position: { x: event.clientX, y: event.clientY }
        };

        setSelectedElement(elementInfo);
        setIsSelectingElement(false);
        setIsModalOpen(true);

        console.log('📍 Elemento seleccionado:', elementInfo);
        removeElementSelectionListeners();
      }
    };

    // Event listener para cancelar con ESC
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('❌ Selección cancelada por el usuario');
        setIsSelectingElement(false);
        setSelectedFeedbackType(null);
        removeElementSelectionListeners();
      }
    };

    overlay.addEventListener('click', handleElementClick);
    document.addEventListener('keydown', handleKeyDown);
    document.body.appendChild(overlay);

    // Almacenar función de limpieza globalmente
    (window as any).removeElementSelectionListeners = () => {
      overlay.removeEventListener('click', handleElementClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator);
      }
    };
  }, []);

  // Función para limpiar listeners de selección
  const removeElementSelectionListeners = useCallback(() => {
    if ((window as any).removeElementSelectionListeners) {
      (window as any).removeElementSelectionListeners();
    }
  }, []);

  // Función principal para enviar feedback
  const submitFeedback = useCallback(async (feedbackData: FeedbackData): Promise<void> => {
    try {
      console.log('📤 Enviando feedback al Oráculo de CoomÜnity...', feedbackData);

      // 1. Preparar datos técnicos contextuales
      const enhancedFeedbackData = {
        ...feedbackData,
        technicalContext: {
          url: window.location.href,
          pathname: window.location.pathname,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          timestamp: new Date().toISOString(),
          sessionId: sessionStorage.getItem('COOMUNITY_SESSION_ID') || 'anonymous',
          buildVersion: process.env.VITE_APP_VERSION || 'dev',
          userId: user?.id,
          userRoles: user?.roles || []
        },
        selectedElement,
        feedbackType: selectedFeedbackType
      };

      // 2. Intentar envío al backend real
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('COOMUNITY_AUTH_TOKEN')}`
          },
          body: JSON.stringify(enhancedFeedbackData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: FeedbackSubmissionResponse = await response.json();
        console.log('✅ Feedback enviado exitosamente al backend:', result);

        // 3. Ejecutar análisis de código si se solicita
        if (feedbackData.requestCodeAnalysis) {
          await triggerCodeAnalysis(result.id, enhancedFeedbackData);
        }

      } catch (backendError) {
        console.warn('⚠️ Backend no disponible, almacenando feedback localmente:', backendError);

        // Fallback: almacenar localmente
        const localFeedback = {
          id: `feedback_${Date.now()}`,
          ...enhancedFeedbackData,
          status: 'pending_backend',
          createdAt: new Date().toISOString()
        };

        const existingFeedback = JSON.parse(localStorage.getItem('COOMUNITY_PENDING_FEEDBACK') || '[]');
        existingFeedback.push(localFeedback);
        localStorage.setItem('COOMUNITY_PENDING_FEEDBACK', JSON.stringify(existingFeedback));

        console.log('💾 Feedback almacenado localmente, se enviará cuando el backend esté disponible');
      }

      // 4. Mostrar notificación de éxito
      showFeedbackNotification('✅ Feedback enviado al Oráculo de CoomÜnity', 'success');

      // 5. Resetear estado
      resetFeedbackState();

    } catch (error) {
      console.error('❌ Error enviando feedback:', error);
      showFeedbackNotification('❌ Error enviando feedback. Inténtalo de nuevo.', 'error');
      throw error;
    }
  }, [user, selectedElement, selectedFeedbackType]);

  // Función para mostrar notificaciones
  const showFeedbackNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: system-ui;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remover después de 4 segundos
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        }, 300);
      }
    }, 4000);
  };

  // Función para ejecutar análisis de código
  const triggerCodeAnalysis = useCallback(async (feedbackId: string, feedbackData: any) => {
    console.log('🤖 Ejecutando análisis de código automático...');

    try {
      const analysisRequest = {
        feedbackId,
        feedbackType: feedbackData.feedbackType,
        pageUrl: feedbackData.technicalContext.url,
        selectedElement: feedbackData.selectedElement,
        requestedScripts: [
          'frontend-backend-integration-test.sh',
          'responsive-design-test.sh',
          'accessibility-test.sh',
          'performance-test.sh'
        ]
      };

      const response = await fetch('/api/feedback/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('COOMUNITY_AUTH_TOKEN')}`
        },
        body: JSON.stringify(analysisRequest)
      });

      if (!response.ok) {
        throw new Error(`Análisis falló: ${response.status}`);
      }

      const analysisResult = await response.json();
      console.log('🔍 Análisis de código completado:', analysisResult);

    } catch (error) {
      console.warn('⚠️ Análisis de código no disponible:', error);
    }
  }, []);

  // Función para cerrar modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFeedbackType(null);
    setSelectedElement(null);
  }, []);

  // Función para resetear estado
  const resetFeedbackState = useCallback(() => {
    setIsSelectingElement(false);
    setSelectedFeedbackType(null);
    setSelectedElement(null);
    setIsModalOpen(false);
  }, []);

  // Cargar estado persistido al montar el componente
  React.useEffect(() => {
    if (canUseAgent) {
      const savedMode = localStorage.getItem('COOMUNITY_FEEDBACK_MODE');
      if (savedMode) {
        try {
          const isActive = JSON.parse(savedMode);
          setIsFeedbackModeActive(isActive);
        } catch (error) {
          console.warn('Error cargando estado del modo feedback:', error);
        }
      }
    }
  }, [canUseAgent]);

  const value: FeedbackContextValue = {
    // Estado
    isFeedbackModeActive,
    isSelectingElement,
    selectedFeedbackType,
    selectedElement,
    isModalOpen,
    canUseAgent,

    // Acciones
    toggleFeedbackMode,
    startFeedbackCapture,
    submitFeedback,
    closeModal,
    resetFeedbackState
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = (): FeedbackContextValue => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedbackContext debe ser usado dentro de un FeedbackProvider');
  }
  return context;
};

export default FeedbackContext;
