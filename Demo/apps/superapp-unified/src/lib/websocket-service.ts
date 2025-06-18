// 🔌 WebSocket Service - Conexión Socket.io para CoomÜnity SuperApp
// Maneja la conexión en tiempo real con el backend NestJS para StudyRooms

import { io, Socket } from 'socket.io-client';
import { AUTH_STORAGE_KEYS, AUTH_CONFIG } from '../config/constants';

export interface WebSocketConfig {
  url: string;
  namespace?: string;
  autoConnect?: boolean;
  transports?: string[];
  forceNew?: boolean;
}

export interface AuthPayload {
  token: string;
  userId?: string;
}

export interface RoomEventData {
  roomId: string;
  userId?: string;
  data?: any;
}

export class WebSocketService {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private isAuthenticated = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(config: WebSocketConfig) {
    this.config = {
      autoConnect: false,
      transports: ['websocket'],
      forceNew: false,
      ...config,
    };
  }

  /**
   * 🔐 Autenticación y Conexión
   */
  async connect(authPayload?: AuthPayload): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // 🔑 Obtener token del AuthContext o localStorage si no se proporciona
        const token = authPayload?.token || this.getAuthToken();
        
        if (!token) {
          const error = new Error('No se encontró token de autenticación. Inicia sesión primero.');
          console.error('❌ [WebSocketService] Error de autenticación:', error.message);
          reject(error);
          return;
        }

        const socketUrl = this.config.namespace 
          ? `${this.config.url}${this.config.namespace}`
          : this.config.url;

        console.log('🔌 [WebSocketService] Conectando a:', socketUrl);
        console.log('🔑 [WebSocketService] Usando token:', token.substring(0, 20) + '...');

        this.socket = io(socketUrl, {
          autoConnect: this.config.autoConnect,
          transports: this.config.transports,
          forceNew: this.config.forceNew,
          auth: {
            token: token,
          },
          query: {
            token: token,
          },
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Eventos de conexión
        this.socket.on('connect', () => {
          console.log('✅ [WebSocketService] Conectado exitosamente con ID:', this.socket?.id);
          this.isAuthenticated = true;
          this.reconnectAttempts = 0;
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ [WebSocketService] Error de conexión:', error);
          this.isAuthenticated = false;
          
          // Mejorar mensajes de error específicos
          let errorMessage = `Error de conexión: ${error.message}`;
          if (error.message?.includes('token') || error.message?.includes('401')) {
            errorMessage = 'Token de autenticación inválido o expirado. Inicia sesión nuevamente.';
          } else if (error.message?.includes('ECONNREFUSED')) {
            errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 3002.';
          }
          
          reject(new Error(errorMessage));
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔴 [WebSocketService] Desconectado:', reason);
          this.isAuthenticated = false;
          
          if (reason === 'io server disconnect') {
            // El servidor desconectó intencionalmente
            this.attemptReconnect({ token });
          }
        });

        // Eventos de autenticación específicos del backend
        this.socket.on('connection-success', (data) => {
          console.log('🎉 [WebSocketService] Autenticación exitosa:', data);
          this.isAuthenticated = true;
        });

        this.socket.on('unauthorized', (error) => {
          console.error('🚫 [WebSocketService] No autorizado:', error);
          this.isAuthenticated = false;
          reject(new Error('Token de autenticación no válido. Inicia sesión nuevamente.'));
        });

        this.socket.on('error', (error) => {
          console.error('❌ [WebSocketService] Error del servidor:', error);
        });

        // Conectar explícitamente
        this.socket.connect();

      } catch (error) {
        console.error('❌ [WebSocketService] Error creando socket:', error);
        reject(error);
      }
    });
  }

  /**
   * 🔑 Obtener token de autenticación desde localStorage
   */
  private getAuthToken(): string | null {
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      if (!token) {
        console.warn('⚠️ [WebSocketService] No se encontró token en localStorage');
        return null;
      }
      return token;
    } catch (error) {
      console.error('❌ [WebSocketService] Error accediendo a localStorage:', error);
      return null;
    }
  }

  /**
   * 🔄 Reconexión Automática
   */
  private attemptReconnect(authPayload: AuthPayload) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ [WebSocketService] Máximo de intentos de reconexión alcanzado');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 [WebSocketService] Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(authPayload).catch((error) => {
        console.error('❌ [WebSocketService] Error en reconexión:', error);
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * 🚪 Gestión de Salas
   */
  joinRoom(roomId: string): void {
    if (!this.socket || !this.isAuthenticated) {
      console.error('❌ [WebSocketService] No conectado o no autenticado');
      return;
    }

    console.log('🚪 [WebSocketService] Uniéndose a sala:', roomId);
    this.socket.emit('join-room', { roomId });
  }

  leaveRoom(roomId: string): void {
    if (!this.socket || !this.isAuthenticated) {
      console.error('❌ [WebSocketService] No conectado o no autenticado');
      return;
    }

    console.log('🚪 [WebSocketService] Saliendo de sala:', roomId);
    this.socket.emit('leave-room', { roomId });
  }

  /**
   * 💬 Chat en Tiempo Real
   */
  sendMessage(roomId: string, message: string): void {
    if (!this.socket || !this.isAuthenticated) {
      console.error('❌ [WebSocketService] No conectado o no autenticado');
      return;
    }

    console.log('💬 [WebSocketService] Enviando mensaje a sala:', roomId);
    this.socket.emit('send-message', { roomId, message });
  }

  requestMessages(roomId: string, page: number = 1, limit: number = 50): void {
    if (!this.socket || !this.isAuthenticated) {
      console.error('❌ [WebSocketService] No conectado o no autenticado');
      return;
    }

    console.log('📥 [WebSocketService] Solicitando mensajes de sala:', roomId);
    this.socket.emit('get-messages', { roomId, page, limit });
  }

  /**
   * 🎥 Sincronización de Video
   */
  syncVideo(roomId: string, currentTime: number, isPaused: boolean): void {
    if (!this.socket || !this.isAuthenticated) {
      console.error('❌ [WebSocketService] No conectado o no autenticado');
      return;
    }

    console.log('🎥 [WebSocketService] Sincronizando video en sala:', roomId);
    this.socket.emit('video-sync', { roomId, currentTime, isPaused });
  }

  /**
   * 👂 Event Listeners
   */
  onRoomJoined(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('room-joined', callback);
  }

  onUserJoinedRoom(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('user-joined-room', callback);
  }

  onUserLeftRoom(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('user-left-room', callback);
  }

  onNewMessage(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('new-message', callback);
  }

  onMessagesHistory(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('messages-history', callback);
  }

  onVideoSyncUpdate(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('video-sync-update', callback);
  }

  onError(callback: (error: any) => void): void {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  /**
   * 🧹 Cleanup
   */
  removeAllListeners(): void {
    if (!this.socket) return;
    
    this.socket.removeAllListeners('room-joined');
    this.socket.removeAllListeners('user-joined-room');
    this.socket.removeAllListeners('user-left-room');
    this.socket.removeAllListeners('new-message');
    this.socket.removeAllListeners('messages-history');
    this.socket.removeAllListeners('video-sync-update');
    this.socket.removeAllListeners('error');
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 [WebSocketService] Desconectando...');
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isAuthenticated = false;
    }
  }

  /**
   * 📊 Estado
   */
  get isConnected(): boolean {
    return !!this.socket && this.socket.connected && this.isAuthenticated;
  }

  get connectionId(): string | undefined {
    return this.socket?.id;
  }

  get transport(): string | undefined {
    return this.socket?.io.engine.transport.name;
  }

  getStatus() {
    return {
      connected: this.isConnected,
      authenticated: this.isAuthenticated,
      connectionId: this.connectionId,
      transport: this.transport,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// 🏭 Factory para crear instancia del servicio
export const createWebSocketService = (config: WebSocketConfig): WebSocketService => {
  return new WebSocketService(config);
};

// 🔧 Configuración por defecto para CoomÜnity
export const COOMUNITY_WEBSOCKET_CONFIG: WebSocketConfig = {
  url: 'http://localhost:1111',
  namespace: '/study-rooms',
  autoConnect: false,
  transports: ['websocket'],
  forceNew: false,
};

// 🎯 Instancia singleton para uso global
let globalWebSocketService: WebSocketService | null = null;

/**
 * 🌐 Obtener instancia global del WebSocketService
 * Conecta automáticamente si hay token disponible
 */
export const getWebSocketService = (): WebSocketService => {
  if (!globalWebSocketService) {
    globalWebSocketService = new WebSocketService(COOMUNITY_WEBSOCKET_CONFIG);
  }
  return globalWebSocketService;
};

/**
 * 🔌 Conectar WebSocket con autenticación automática
 * Función utilitaria para facilitar la conexión desde componentes
 */
export const connectAuthenticatedWebSocket = async (): Promise<boolean> => {
  const service = getWebSocketService();
  
  try {
    const connected = await service.connect();
    console.log('✅ [WebSocket] Conexión autenticada exitosa');
    return connected;
  } catch (error) {
    console.error('❌ [WebSocket] Error en conexión autenticada:', error);
    throw error;
  }
};

/**
 * 🔐 Verificar si hay token válido para WebSocket
 */
export const hasValidAuthForWebSocket = (): boolean => {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    return !!token && token !== 'null' && token !== 'undefined';
  } catch {
    return false;
  }
}; 