/**
 * 🌐 CosmicWebSocketService - Servicio WebSocket para AI Cosmic Brain
 *
 * Servicio especializado para manejar conexiones WebSocket en tiempo real
 * con el backend NestJS. Implementa reconexión automática, manejo de errores
 * robusto y eventos específicos del AI Cosmic Brain system.
 *
 * Características:
 * - Reconexión automática con backoff exponencial
 * - Manejo de múltiples tipos de eventos
 * - Estado de conexión observable
 * - Limpieza automática de recursos
 * - Integración con filosofía CoomÜnity
 *
 * Filosofía aplicada:
 * - Bien Común: Comunicación eficiente que beneficia todo el sistema
 * - Neguentropía: Orden en la gestión de conexiones y datos
 * - Ayni: Balance entre recursos y rendimiento
 */

import { EventEmitter } from 'events';

// ============================================================================
// 🎯 Types and Interfaces
// ============================================================================

export type WebSocketConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type CosmicEventType =
  | 'guardian_analysis_update'
  | 'philosophy_alignment_change'
  | 'system_health_update'
  | 'critical_alert'
  | 'recommendation_generated'
  | 'mission_assigned'
  | 'harmony_analysis_complete';

export interface CosmicWebSocketEvent {
  type: CosmicEventType;
  timestamp: string;
  data: any;
  guardianId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  enableLogging: boolean;
  autoConnect: boolean;
}

export interface ConnectionStats {
  connectedAt: Date | null;
  disconnectedAt: Date | null;
  reconnectAttempts: number;
  totalEventsReceived: number;
  lastEventAt: Date | null;
  averageLatency: number;
}

// ============================================================================
// 🌐 CosmicWebSocketService Class
// ============================================================================

export class CosmicWebSocketService extends EventEmitter {
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private connectionState: WebSocketConnectionState = 'disconnected';
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private stats: ConnectionStats;
  private eventQueue: CosmicWebSocketEvent[] = [];
  private isDestroyed = false;

  constructor(config: Partial<WebSocketConfig> = {}) {
    super();

    this.config = {
      url: config.url || 'ws://localhost:3002/cosmic-brain',
      reconnectInterval: config.reconnectInterval || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      enableLogging: config.enableLogging ?? true,
      autoConnect: config.autoConnect ?? true
    };

    this.stats = {
      connectedAt: null,
      disconnectedAt: null,
      reconnectAttempts: 0,
      totalEventsReceived: 0,
      lastEventAt: null,
      averageLatency: 0
    };

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  // ============================================================================
  // 🔌 Connection Management
  // ============================================================================

  /**
   * Establece conexión WebSocket con el backend
   */
  public async connect(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('WebSocket service has been destroyed');
    }

    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      this.log('Already connected or connecting');
      return;
    }

    this.setConnectionState('connecting');
    this.log(`Connecting to ${this.config.url}`);

    try {
      this.socket = new WebSocket(this.config.url);
      this.setupEventListeners();
    } catch (error) {
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * Desconecta WebSocket
   */
  public disconnect(): void {
    this.log('Disconnecting WebSocket');
    this.clearTimers();

    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }

    this.setConnectionState('disconnected');
    this.stats.disconnectedAt = new Date();
  }

  /**
   * Reconecta con backoff exponencial
   */
  private reconnect(): void {
    if (this.isDestroyed || this.stats.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.log('Max reconnect attempts reached or service destroyed');
      this.setConnectionState('error');
      return;
    }

    this.stats.reconnectAttempts++;
    this.setConnectionState('reconnecting');

    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(2, this.stats.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    this.log(`Reconnecting in ${delay}ms (attempt ${this.stats.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // ============================================================================
  // 📡 Event Handling
  // ============================================================================

  /**
   * Configura listeners de eventos WebSocket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.log('WebSocket connected successfully');
      this.setConnectionState('connected');
      this.stats.connectedAt = new Date();
      this.stats.reconnectAttempts = 0;
      this.startHeartbeat();
      this.processEventQueue();
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.socket.onclose = (event) => {
      this.log(`WebSocket closed: ${event.code} - ${event.reason}`);
      this.clearTimers();

      if (!this.isDestroyed && event.code !== 1000) {
        // Reconnect unless it was a normal closure
        this.reconnect();
      } else {
        this.setConnectionState('disconnected');
      }

      this.emit('disconnected', { code: event.code, reason: event.reason });
    };

    this.socket.onerror = (error) => {
      this.log('WebSocket error:', error);
      this.handleConnectionError(new Error('WebSocket connection error'));
    };
  }

  /**
   * Maneja mensajes recibidos del WebSocket
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const cosmicEvent: CosmicWebSocketEvent = JSON.parse(event.data);

      this.stats.totalEventsReceived++;
      this.stats.lastEventAt = new Date();

      this.log(`Received event: ${cosmicEvent.type}`, cosmicEvent);

      // Emit specific event type
      this.emit(cosmicEvent.type, cosmicEvent);

      // Emit general event
      this.emit('cosmic_event', cosmicEvent);

      // Handle critical alerts
      if (cosmicEvent.severity === 'critical') {
        this.emit('critical_alert', cosmicEvent);
      }

    } catch (error) {
      this.log('Error parsing WebSocket message:', error);
      this.emit('parse_error', { error, rawData: event.data });
    }
  }

  /**
   * Maneja errores de conexión
   */
  private handleConnectionError(error: Error): void {
    this.log('Connection error:', error);
    this.setConnectionState('error');
    this.emit('error', error);

    if (!this.isDestroyed) {
      this.reconnect();
    }
  }

  // ============================================================================
  // 💓 Heartbeat Management
  // ============================================================================

  /**
   * Inicia heartbeat para mantener conexión viva
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Limpia todos los timers
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // ============================================================================
  // 📤 Message Sending
  // ============================================================================

  /**
   * Envía mensaje al servidor WebSocket
   */
  public sendMessage(message: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message: WebSocket not connected');
      this.queueEvent(message);
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      this.log('Message sent:', message);
      return true;
    } catch (error) {
      this.log('Error sending message:', error);
      return false;
    }
  }

  /**
   * Solicita análisis específico de un guardian
   */
  public requestGuardianAnalysis(guardianType: string): boolean {
    return this.sendMessage({
      type: 'request_guardian_analysis',
      guardianType,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Solicita actualización de estado general del sistema
   */
  public requestSystemHealthUpdate(): boolean {
    return this.sendMessage({
      type: 'request_system_health',
      timestamp: new Date().toISOString()
    });
  }

  // ============================================================================
  // 📊 Queue Management
  // ============================================================================

  /**
   * Agrega evento a la cola cuando no hay conexión
   */
  private queueEvent(event: any): void {
    if (this.eventQueue.length >= 100) {
      this.eventQueue.shift(); // Remove oldest event
    }

    this.eventQueue.push({
      ...event,
      queuedAt: new Date().toISOString()
    });

    this.log(`Event queued (queue size: ${this.eventQueue.length})`);
  }

  /**
   * Procesa eventos en cola cuando se reconecta
   */
  private processEventQueue(): void {
    if (this.eventQueue.length === 0) return;

    this.log(`Processing ${this.eventQueue.length} queued events`);

    const events = [...this.eventQueue];
    this.eventQueue = [];

    events.forEach(event => {
      this.sendMessage(event);
    });
  }

  // ============================================================================
  // 🔍 State Management
  // ============================================================================

  /**
   * Actualiza estado de conexión
   */
  private setConnectionState(state: WebSocketConnectionState): void {
    if (this.connectionState !== state) {
      const previousState = this.connectionState;
      this.connectionState = state;
      this.log(`Connection state changed: ${previousState} -> ${state}`);
      this.emit('state_change', { previous: previousState, current: state });
    }
  }

  /**
   * Obtiene estado actual de conexión
   */
  public getConnectionState(): WebSocketConnectionState {
    return this.connectionState;
  }

  /**
   * Verifica si está conectado
   */
  public isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  /**
   * Obtiene estadísticas de conexión
   */
  public getConnectionStats(): ConnectionStats {
    return { ...this.stats };
  }

  // ============================================================================
  // 🛠️ Utility Methods
  // ============================================================================

  /**
   * Log con formato consistente
   */
  private log(message: string, data?: any): void {
    if (!this.config.enableLogging) return;

    const timestamp = new Date().toISOString();
    const prefix = '[CosmicWebSocket]';

    if (data) {
      console.log(`${timestamp} ${prefix} ${message}`, data);
    } else {
      console.log(`${timestamp} ${prefix} ${message}`);
    }
  }

  /**
   * Limpia recursos y destruye servicio
   */
  public destroy(): void {
    this.log('Destroying WebSocket service');
    this.isDestroyed = true;
    this.disconnect();
    this.removeAllListeners();
    this.eventQueue = [];
  }

  /**
   * Obtiene configuración actual
   */
  public getConfig(): WebSocketConfig {
    return { ...this.config };
  }

  /**
   * Actualiza configuración (requiere reconexión)
   */
  public updateConfig(newConfig: Partial<WebSocketConfig>): void {
    const wasConnected = this.isConnected();

    this.config = { ...this.config, ...newConfig };
    this.log('Configuration updated', this.config);

    if (wasConnected) {
      this.disconnect();
      setTimeout(() => this.connect(), 1000);
    }
  }
}

export default CosmicWebSocketService;
