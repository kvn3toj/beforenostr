import { useState, useCallback, useEffect } from 'react';
import { FeedbackType } from '../components/feedback/FeedbackFloatingButton';
import { FeedbackData } from '../components/feedback/FeedbackCaptureModal';
import { useAuth } from '../contexts/AuthContext';

interface SelectedElement {
  tagName: string;
  id?: string;
  className?: string;
  text?: string;
  position: { x: number; y: number };
}

interface FeedbackAgentState {
  isAgentMode: boolean;
  isSelectingElement: boolean;
  selectedFeedbackType: FeedbackType | null;
  selectedElement: SelectedElement | null;
  isModalOpen: boolean;
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

export const useFeedbackAgent = () => {
  const { user } = useAuth();
  const [state, setState] = useState<FeedbackAgentState>({
    isAgentMode: false,
    isSelectingElement: false,
    selectedFeedbackType: null,
    selectedElement: null,
    isModalOpen: false
  });

  // Solo permitir modo agente para administradores
  const canUseAgent = user?.roles?.includes('admin') || false;

  const toggleAgentMode = useCallback((enabled: boolean) => {
    if (!canUseAgent) return;

    setState(prev => ({
      ...prev,
      isAgentMode: enabled,
      isSelectingElement: false,
      selectedFeedbackType: null,
      selectedElement: null,
      isModalOpen: false
    }));

    // Remover eventos cuando se desactiva
    if (!enabled) {
      removeElementSelectionListeners();
    }
  }, [canUseAgent]);

  const startFeedbackCapture = useCallback((type: FeedbackType, buttonPosition: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      selectedFeedbackType: type,
      isSelectingElement: true
    }));

    // Activar modo de selección de elementos
    enableElementSelection();
  }, []);

  const enableElementSelection = useCallback(() => {
    // Agregar overlay transparente para capturar clics
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
    `;

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

        setState(prev => ({
          ...prev,
          selectedElement: elementInfo,
          isSelectingElement: false,
          isModalOpen: true
        }));

        removeElementSelectionListeners();
      }
    };

    // Event listener para cancelar con ESC
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setState(prev => ({
          ...prev,
          isSelectingElement: false,
          selectedFeedbackType: null
        }));
        removeElementSelectionListeners();
      }
    };

    overlay.addEventListener('click', handleElementClick);
    document.addEventListener('keydown', handleKeyDown);
    document.body.appendChild(overlay);

    // Función para remover listeners (se define aquí para tener acceso a las variables)
    window.removeElementSelectionListeners = () => {
      overlay.removeEventListener('click', handleElementClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, []);

  const removeElementSelectionListeners = useCallback(() => {
    if (window.removeElementSelectionListeners) {
      window.removeElementSelectionListeners();
    }
  }, []);

  const submitFeedback = useCallback(async (feedbackData: FeedbackData): Promise<void> => {
    try {
      // 📝 [ORÁCULO] Preparar datos para el backend NestJS
      const backendPayload = {
        pageUrl: feedbackData.technicalContext.route || window.location.href,
        feedbackText: feedbackData.description,
        feedbackType: feedbackData.type.toUpperCase().replace('-', '_'), // BUG, IMPROVEMENT, MISSING_FEATURE, etc.
        componentContext: feedbackData.elementContext ? 
          `${feedbackData.elementContext.tagName}${feedbackData.elementContext.id ? `#${feedbackData.elementContext.id}` : ''}${feedbackData.elementContext.className ? `.${feedbackData.elementContext.className}` : ''}` 
          : undefined,
        technicalContext: {
          route: feedbackData.technicalContext.route,
          userAgent: feedbackData.elementContext.userAgent,
          timestamp: feedbackData.elementContext.timestamp,
          screenResolution: `${screen.width}x${screen.height}`,
          viewport: `${feedbackData.elementContext.viewport.width}x${feedbackData.elementContext.viewport.height}`,
          elementPosition: feedbackData.elementContext.position,
          url: feedbackData.elementContext.url,
          userId: feedbackData.technicalContext.userId,
          sessionId: feedbackData.technicalContext.sessionId,
          buildVersion: feedbackData.technicalContext.buildVersion
        },
        priority: feedbackData.priority === 'critical' ? 5 : 
                  feedbackData.priority === 'high' ? 4 : 
                  feedbackData.priority === 'medium' ? 3 : 
                  feedbackData.priority === 'low' ? 2 : 1,
        tags: [feedbackData.category, feedbackData.priority] // Usar category y priority como tags
      };

      console.log('🔮 [ORÁCULO] Enviando feedback al backend NestJS:', backendPayload);

      // 1. Enviar feedback al backend NestJS del Oráculo
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('COOMUNITY_AUTH_TOKEN')}`
        },
        body: JSON.stringify(backendPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error del servidor'}`);
      }

      const result: FeedbackSubmissionResponse = await response.json();

      // 2. Si se solicita análisis de código, ejecutar scripts (funcionalidad futura de la CoP)
      if (feedbackData.requestCodeAnalysis) {
        await triggerCodeAnalysis(result.id, feedbackData);
      }

      // 3. Notificar éxito al usuario
      console.log('✅ [ORÁCULO] Feedback enviado exitosamente al sistema:', result);
      
      // Mostrar notificación de éxito al usuario (puedes personalizar esto)
      if (window.showSnackbar) {
        window.showSnackbar('🔮 Feedback enviado al Oráculo de CoomÜnity', 'success');
      }

      // Resetear estado
      setState(prev => ({
        ...prev,
        selectedFeedbackType: null,
        selectedElement: null,
        isModalOpen: false
      }));

    } catch (error) {
      console.error('❌ [ORÁCULO] Error enviando feedback:', error);
      
      // Mostrar error al usuario
      if (window.showSnackbar) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        window.showSnackbar(`Error enviando feedback: ${errorMessage}`, 'error');
      }
      
      throw error;
    }
  }, []);

  const triggerCodeAnalysis = useCallback(async (feedbackId: string, feedbackData: FeedbackData) => {
    try {
      const analysisRequest = {
        feedbackId,
        feedbackType: feedbackData.type,
        route: feedbackData.technicalContext.route,
        elementContext: feedbackData.elementContext,
        priority: feedbackData.priority
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
        throw new Error(`Code analysis failed: ${response.status}`);
      }

      const analysisResult = await response.json();
      console.log('🔍 Análisis de código completado:', analysisResult);

    } catch (error) {
      console.error('❌ Error en análisis de código:', error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      selectedFeedbackType: null,
      selectedElement: null
    }));
  }, []);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      removeElementSelectionListeners();
    };
  }, [removeElementSelectionListeners]);

  return {
    // Estado
    isAgentMode: state.isAgentMode && canUseAgent,
    isSelectingElement: state.isSelectingElement,
    selectedFeedbackType: state.selectedFeedbackType,
    selectedElement: state.selectedElement,
    isModalOpen: state.isModalOpen,
    canUseAgent,

    // Acciones
    toggleAgentMode,
    startFeedbackCapture,
    submitFeedback,
    closeModal
  };
};

// Extender window para TypeScript
declare global {
  interface Window {
    removeElementSelectionListeners?: () => void;
    showSnackbar?: (message: string, type: string) => void;
  }
}

export default useFeedbackAgent;
