import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseConsciousLoadingStateProps {
  context?: 'marketplace' | 'uplay' | 'ustats' | 'social' | 'general';
  autoElement?: boolean;
  defaultElement?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
  transitionDuration?: number;
}

interface ConsciousLoadingStateReturn {
  isLoading: boolean;
  element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter';
  progress: number;
  message: string;
  startLoading: (customMessage?: string, customElement?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => void;
  stopLoading: (delay?: number) => void;
  updateProgress: (value: number) => void;
  setMessage: (message: string) => void;
  transitionElement: (newElement: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => void;
}

// 🌿 Mapeo automático de contexto a elemento
const CONTEXT_TO_ELEMENT: Record<string, 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter'> = {
  uplay: 'fuego',        // 🔥 Energía, acción, videos dinámicos
  marketplace: 'agua',   // 💧 Flujo, intercambio, comercio
  ustats: 'tierra',      // 🌱 Datos, métricas, crecimiento
  social: 'aire',        // 🌪️ Comunicación, conexión, libertad
  general: 'eter',       // ✨ Universal, integración, consciencia
};

// 💬 Mensajes contextuales conscientes
const CONTEXT_MESSAGES: Record<string, string[]> = {
  marketplace: [
    "💧 Sincronizando ofertas del ecosistema...",
    "🔮 Conectando con emprendedores confiables...",
    "🌊 Fluyendo hacia oportunidades conscientes..."
  ],
  uplay: [
    "🔥 Encendiendo experiencias transformadoras...",
    "⚡ Activando contenido gamificado...",
    "🌟 Preparando aventuras de aprendizaje..."
  ],
  ustats: [
    "🌱 Cultivando datos de consciencia...",
    "🏔️ Construyendo métricas sólidas...",
    "🌾 Cosechando insights del ecosistema..."
  ],
  social: [
    "🌪️ Conectando mentes conscientes...",
    "☁️ Expandiendo redes de colaboración...",
    "🦋 Tejiendo vínculos de cooperación..."
  ],
  general: [
    "✨ Alineando energías universales...",
    "🌌 Sincronizando con la consciencia colectiva...",
    "🔗 Integrando todas las dimensiones..."
  ]
};

export const useConsciousLoadingState = ({
  context = 'general',
  autoElement = true,
  defaultElement = 'eter',
  transitionDuration = 500
}: UseConsciousLoadingStateProps = {}): ConsciousLoadingStateReturn => {

  // 🌟 Estados principales
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [element, setElement] = useState<'fuego' | 'agua' | 'tierra' | 'aire' | 'eter'>(
    autoElement ? CONTEXT_TO_ELEMENT[context] || defaultElement : defaultElement
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 🎯 Mensaje contextual automático
  const contextualMessages = useMemo(() => CONTEXT_MESSAGES[context] || CONTEXT_MESSAGES.general, [context]);

  // 🔄 Rotación automática de mensajes si no hay mensaje personalizado
  useEffect(() => {
    if (isLoading && !message && contextualMessages.length > 0) {
      let messageIndex = 0;
      const interval = setInterval(() => {
        setMessage(contextualMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % contextualMessages.length;
      }, 2500);

      // Establecer mensaje inicial inmediatamente
      setMessage(contextualMessages[0]);

      return () => clearInterval(interval);
    }
  }, [isLoading, message, contextualMessages]);

  // 🚀 Iniciar carga consciente
  const startLoading = useCallback((customMessage?: string, customElement?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => {
    setIsLoading(true);
    setProgress(0);

    if (customMessage) {
      setMessage(customMessage);
    }

    if (customElement) {
      setElement(customElement);
    } else if (autoElement) {
      setElement(CONTEXT_TO_ELEMENT[context] || defaultElement);
    }
  }, [context, autoElement, defaultElement]);

  // 🛑 Detener carga consciente
  const stopLoading = useCallback((delay: number = 0) => {
    const finish = () => {
      setIsLoading(false);
      setProgress(0);
      setMessage('');
    };

    if (delay > 0) {
      setTimeout(finish, delay);
    } else {
      finish();
    }
  }, []);

  // 📊 Actualizar progreso
  const updateProgress = useCallback((value: number) => {
    setProgress(Math.max(0, Math.min(100, value)));
  }, []);

  // 💬 Establecer mensaje personalizado
  const setCustomMessage = useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  // 🌀 Transición suave entre elementos
  const transitionElement = useCallback((newElement: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => {
    if (newElement === element || isTransitioning) return;

    setIsTransitioning(true);

    // Fade out actual
    setTimeout(() => {
      setElement(newElement);
      // Fade in nuevo
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration / 2);
    }, transitionDuration / 2);
  }, [element, isTransitioning, transitionDuration]);

  // 🔄 Auto-actualización del elemento cuando cambia el contexto
  useEffect(() => {
    if (autoElement && !isTransitioning) {
      const contextElement = CONTEXT_TO_ELEMENT[context] || defaultElement;
      if (contextElement !== element) {
        transitionElement(contextElement);
      }
    }
  }, [context, autoElement, defaultElement, element, isTransitioning, transitionElement]);

  return {
    isLoading,
    element,
    progress,
    message,
    startLoading,
    stopLoading,
    updateProgress,
    setMessage: setCustomMessage,
    transitionElement
  };
};
