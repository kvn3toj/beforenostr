import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  CosmicWebSocketService,
  CosmicWebSocketEvent,
  WebSocketConnectionState,
  ConnectionStats,
} from '../websocket/CosmicWebSocketService';

/**
 * 🌐 CosmicWebSocketProvider - Provider React para WebSocket del AI Cosmic Brain
 *
 * Provider que gestiona la instancia WebSocket global y proporciona hooks
 * para componentes React. Implementa gestión de estado reactiva y
 * limpieza automática de recursos.
 *
 * Características:
 * - Instancia WebSocket singleton
 * - Estado reactivo de conexión
 * - Eventos en tiempo real
 * - Limpieza automática de recursos
 * - Integración con ciclo de vida React
 *
 * Filosofía aplicada:
 * - Bien Común: Servicio compartido que beneficia todos los componentes
 * - Neguentropía: Orden en la gestión de estado global
 * - Ayni: Balance entre recursos y funcionalidad
 */

// ============================================================================
// 🎯 Context Types
// ============================================================================

interface CosmicWebSocketContextValue {
  // Connection state
  connectionState: WebSocketConnectionState;
  isConnected: boolean;
  connectionStats: ConnectionStats;

  // WebSocket service
  service: CosmicWebSocketService | null;

  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => void;

  // Message sending
  sendMessage: (message: any) => boolean;
  requestGuardianAnalysis: (guardianType: string) => boolean;
  requestSystemHealthUpdate: () => boolean;

  // Event subscription
  subscribe: (
    eventType: string,
    handler: (event: CosmicWebSocketEvent) => void
  ) => () => void;

  // Last events
  lastEvent: CosmicWebSocketEvent | null;
  recentEvents: CosmicWebSocketEvent[];
}

// ============================================================================
// 🌐 Context Creation
// ============================================================================

const CosmicWebSocketContext =
  createContext<CosmicWebSocketContextValue | null>(null);

// ============================================================================
// 🎛️ Provider Props
// ============================================================================

interface CosmicWebSocketProviderProps {
  children: React.ReactNode;
  wsUrl?: string;
  autoConnect?: boolean;
  maxRecentEvents?: number;
  enableLogging?: boolean;
}

// ============================================================================
// 🌟 CosmicWebSocketProvider Component
// ============================================================================

export const CosmicWebSocketProvider: React.FC<
  CosmicWebSocketProviderProps
> = ({
  children,
  wsUrl = 'ws://localhost:3002/cosmic-brain',
  autoConnect = true,
  maxRecentEvents = 50,
  enableLogging = true,
}) => {
  // ============================================================================
  // 🔄 State Management
  // ============================================================================

  const [service, setService] = useState<CosmicWebSocketService | null>(null);
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>('disconnected');
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    connectedAt: null,
    disconnectedAt: null,
    reconnectAttempts: 0,
    totalEventsReceived: 0,
    lastEventAt: null,
    averageLatency: 0,
  });
  const [lastEvent, setLastEvent] = useState<CosmicWebSocketEvent | null>(null);
  const [recentEvents, setRecentEvents] = useState<CosmicWebSocketEvent[]>([]);

  const eventHandlersRef = useRef<
    Map<string, Set<(event: CosmicWebSocketEvent) => void>>
  >(new Map());

  // ============================================================================
  // 🚀 Service Initialization
  // ============================================================================

  useEffect(() => {
    const wsService = new CosmicWebSocketService({
      url: wsUrl,
      autoConnect,
      enableLogging,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
    });

    // Setup event listeners
    wsService.on('state_change', ({ current }) => {
      setConnectionState(current);
      setConnectionStats(wsService.getConnectionStats());
    });

    wsService.on('connected', () => {
      setConnectionStats(wsService.getConnectionStats());
    });

    wsService.on('disconnected', () => {
      setConnectionStats(wsService.getConnectionStats());
    });

    wsService.on('cosmic_event', (event: CosmicWebSocketEvent) => {
      setLastEvent(event);
      setConnectionStats(wsService.getConnectionStats());

      // Update recent events
      setRecentEvents((prev) => {
        const updated = [event, ...prev];
        return updated.slice(0, maxRecentEvents);
      });

      // Notify subscribers
      const handlers = eventHandlersRef.current.get(event.type);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error(`Error in event handler for ${event.type}:`, error);
          }
        });
      }

      // Notify global event handlers
      const globalHandlers = eventHandlersRef.current.get('*');
      if (globalHandlers) {
        globalHandlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error('Error in global event handler:', error);
          }
        });
      }
    });

    wsService.on('error', (error) => {
      console.error('[CosmicWebSocket] Error:', error);
    });

    setService(wsService);
    setConnectionState(wsService.getConnectionState());

    // Cleanup on unmount
    return () => {
      wsService.destroy();
    };
  }, [wsUrl, autoConnect, enableLogging, maxRecentEvents]);

  // ============================================================================
  // 🔌 Connection Management Functions
  // ============================================================================

  const connect = useCallback(async () => {
    if (service) {
      await service.connect();
    }
  }, [service]);

  const disconnect = useCallback(() => {
    if (service) {
      service.disconnect();
    }
  }, [service]);

  const reconnect = useCallback(() => {
    if (service) {
      service.disconnect();
      setTimeout(() => service.connect(), 1000);
    }
  }, [service]);

  // ============================================================================
  // 📤 Message Sending Functions
  // ============================================================================

  const sendMessage = useCallback(
    (message: any): boolean => {
      if (service) {
        return service.sendMessage(message);
      }
      return false;
    },
    [service]
  );

  const requestGuardianAnalysis = useCallback(
    (guardianType: string): boolean => {
      if (service) {
        return service.requestGuardianAnalysis(guardianType);
      }
      return false;
    },
    [service]
  );

  const requestSystemHealthUpdate = useCallback((): boolean => {
    if (service) {
      return service.requestSystemHealthUpdate();
    }
    return false;
  }, [service]);

  // ============================================================================
  // 📡 Event Subscription Management
  // ============================================================================

  const subscribe = useCallback(
    (
      eventType: string,
      handler: (event: CosmicWebSocketEvent) => void
    ): (() => void) => {
      if (!eventHandlersRef.current.has(eventType)) {
        eventHandlersRef.current.set(eventType, new Set());
      }

      const handlers = eventHandlersRef.current.get(eventType)!;
      handlers.add(handler);

      // Return unsubscribe function
      return () => {
        handlers.delete(handler);
        if (handlers.size === 0) {
          eventHandlersRef.current.delete(eventType);
        }
      };
    },
    []
  );

  // ============================================================================
  // 🎯 Context Value
  // ============================================================================

  const contextValue: CosmicWebSocketContextValue = {
    // Connection state
    connectionState,
    isConnected: connectionState === 'connected',
    connectionStats,

    // WebSocket service
    service,

    // Connection management
    connect,
    disconnect,
    reconnect,

    // Message sending
    sendMessage,
    requestGuardianAnalysis,
    requestSystemHealthUpdate,

    // Event subscription
    subscribe,

    // Last events
    lastEvent,
    recentEvents,
  };

  return (
    <CosmicWebSocketContext.Provider value={contextValue}>
      {children}
    </CosmicWebSocketContext.Provider>
  );
};

// ============================================================================
// 🪝 Custom Hooks
// ============================================================================

/**
 * Hook principal para usar WebSocket del AI Cosmic Brain
 */
export const useCosmicWebSocket = (): CosmicWebSocketContextValue => {
  const context = useContext(CosmicWebSocketContext);
  if (!context) {
    throw new Error(
      'useCosmicWebSocket must be used within a CosmicWebSocketProvider'
    );
  }
  return context;
};

/**
 * Hook para suscribirse a eventos específicos
 */
export const useCosmicEvent = (
  eventType: string,
  handler: (event: CosmicWebSocketEvent) => void,
  deps: React.DependencyList = []
): void => {
  const { subscribe } = useCosmicWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, handler);
    return unsubscribe;
  }, [subscribe, eventType, ...deps]);
};

/**
 * Hook para obtener el estado de conexión
 */
export const useCosmicConnectionState = () => {
  const { connectionState, isConnected, connectionStats } =
    useCosmicWebSocket();

  return {
    connectionState,
    isConnected,
    connectionStats,
    isConnecting: connectionState === 'connecting',
    isReconnecting: connectionState === 'reconnecting',
    hasError: connectionState === 'error',
  };
};

/**
 * Hook para eventos recientes
 */
export const useCosmicRecentEvents = (filterType?: string) => {
  const { recentEvents, lastEvent } = useCosmicWebSocket();

  const filteredEvents = filterType
    ? recentEvents.filter((event) => event.type === filterType)
    : recentEvents;

  return {
    recentEvents: filteredEvents,
    lastEvent: filterType && lastEvent?.type === filterType ? lastEvent : null,
    eventCount: filteredEvents.length,
  };
};

/**
 * Hook para solicitar análisis de guardian específico
 */
export const useGuardianAnalysisRequest = () => {
  const { requestGuardianAnalysis, isConnected } = useCosmicWebSocket();

  return {
    requestAnalysis: requestGuardianAnalysis,
    canRequest: isConnected,
  };
};

/**
 * Hook para solicitar actualización de estado del sistema
 */
export const useSystemHealthRequest = () => {
  const { requestSystemHealthUpdate, isConnected } = useCosmicWebSocket();

  return {
    requestUpdate: requestSystemHealthUpdate,
    canRequest: isConnected,
  };
};

export default CosmicWebSocketProvider;
