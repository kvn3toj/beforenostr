// 🏫 Hook: useStudyRooms
// Gestión completa de salas de estudio colaborativas
// Incluye CRUD, WebSocket para tiempo real, y estado local

import { useState, useCallback, useEffect, useRef } from 'react';
import { StudyRoom, StudyRoomFilters, ChatMessage, SyncData, RoomEvent } from '../../types/study-rooms';
import { apiService } from '../../lib/api-service';
import { getWebSocketService, connectAuthenticatedWebSocket, hasValidAuthForWebSocket } from '../../lib/websocket-service';
import { useAuth } from '../../contexts/AuthContext';

interface UseStudyRoomsOptions {
  roomId?: string; // Sala específica a la que conectarse
  enableRealtime?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseStudyRoomsReturn {
  // Estado de salas
  rooms: StudyRoom[];
  currentRoom: StudyRoom | null;
  isLoading: boolean;
  error: string | null;
  
  // Estado de conectividad
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  
  // Chat y mensajes
  chatMessages: ChatMessage[];
  participants: any[];
  
  // Acciones de salas
  loadRooms: (filters?: StudyRoomFilters) => Promise<void>;
  createRoom: (roomData: Partial<StudyRoom>) => Promise<StudyRoom>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  
  // Sincronización de video
  syncVideo: (roomId: string, syncData: SyncData) => Promise<void>;
  
  // Chat
  sendMessage: (text: string) => Promise<void>;
  
  // Utilidades
  refreshRooms: () => Promise<void>;
  clearError: () => void;
}

export const useStudyRooms = (options: UseStudyRoomsOptions = {}): UseStudyRoomsReturn => {
  const { roomId, enableRealtime = true, autoRefresh = false, refreshInterval = 30000 } = options;
  const { user, isAuthenticated } = useAuth();
  
  // Estado principal
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de conectividad WebSocket
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  // Chat y mensajes
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  
  // Referencias
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsServiceRef = useRef(getWebSocketService());
  const isConnectingRef = useRef(false);

  /**
   * 🔌 WebSocket Connection Management
   */
  const connectWebSocket = useCallback(async () => {
    if (!isAuthenticated || !user?.id || isConnectingRef.current) {
      console.log('🔌 [useStudyRooms] No conectando WebSocket: usuario no autenticado o ya conectando');
      return;
    }

    if (!hasValidAuthForWebSocket()) {
      console.log('🔌 [useStudyRooms] No hay token válido para WebSocket');
      setConnectionStatus('error');
      return;
    }

    isConnectingRef.current = true;
    setConnectionStatus('connecting');

    try {
      console.log('🔌 [useStudyRooms] Conectando WebSocket autenticado...');
      
      const connected = await connectAuthenticatedWebSocket();
      
      if (connected) {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('✅ [useStudyRooms] WebSocket conectado exitosamente');
        
        // Setup event listeners
        setupWebSocketListeners();
        
        // Unirse a sala si se especificó roomId
        if (roomId) {
          wsServiceRef.current.joinRoom(roomId);
        }
      }
    } catch (error) {
      console.error('❌ [useStudyRooms] Error conectando WebSocket:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      setError(error instanceof Error ? error.message : 'Error de conexión WebSocket');
    } finally {
      isConnectingRef.current = false;
    }
  }, [isAuthenticated, user?.id, roomId]);

  const setupWebSocketListeners = useCallback(() => {
    const wsService = wsServiceRef.current;

    // Event: Usuario se unió a sala
    wsService.onUserJoinedRoom((data) => {
      console.log('👤 [useStudyRooms] Usuario se unió:', data);
      if (data.participant) {
        setParticipants(prev => {
          const exists = prev.find(p => p.id === data.participant.id);
          return exists ? prev : [...prev, data.participant];
        });
      }
    });

    // Event: Usuario salió de sala
    wsService.onUserLeftRoom((data) => {
      console.log('👤 [useStudyRooms] Usuario salió:', data);
      if (data.userId) {
        setParticipants(prev => prev.filter(p => p.id !== data.userId));
      }
    });

    // Event: Nuevo mensaje de chat
    wsService.onNewMessage((data) => {
      console.log('💬 [useStudyRooms] Nuevo mensaje:', data);
      if (data.message) {
        const newMessage: ChatMessage = {
          id: data.message.id || `msg-${Date.now()}`,
          roomId: data.message.roomId,
          userId: data.message.senderId,
          user: {
            id: data.message.senderId,
            name: data.message.senderName,
            email: '',
            level: 1,
            meritos: 0,
            ondas: 0,
            avatarUrl: data.message.senderAvatar,
          },
          message: data.message.text,
          timestamp: new Date(data.message.timestamp),
          type: 'message',
        };
        setChatMessages(prev => [...prev, newMessage]);
      }
    });

    // Event: Historial de mensajes
    wsService.onMessagesHistory((data) => {
      console.log('📜 [useStudyRooms] Historial de mensajes:', data);
      if (data.messages && Array.isArray(data.messages)) {
        const messages: ChatMessage[] = data.messages.map((msg: any) => ({
          id: msg.id,
          roomId: msg.roomId,
          userId: msg.senderId,
          user: {
            id: msg.senderId,
            name: msg.senderName,
            email: '',
            level: 1,
            meritos: 0,
            ondas: 0,
            avatarUrl: msg.senderAvatar,
          },
          message: msg.text,
          timestamp: new Date(msg.timestamp),
          type: 'message',
        }));
        setChatMessages(messages);
      }
    });

    // Event: Sala unida exitosamente
    wsService.onRoomJoined((data) => {
      console.log('🏠 [useStudyRooms] Sala unida:', data);
      if (data.room) {
        setCurrentRoom(data.room);
        setParticipants(data.room.participants || []);
        
        // Solicitar historial de mensajes
        wsService.requestMessages(data.room.id);
      }
    });

    // Event: Sincronización de video
    wsService.onVideoSyncUpdate((data) => {
      console.log('🎥 [useStudyRooms] Sincronización de video:', data);
      if (data.roomId && currentRoom?.id === data.roomId) {
        setCurrentRoom(prev => prev ? {
          ...prev,
          syncedTimestamp: data.currentTime
        } : null);
      }
    });

    // Event: Errores
    wsService.onError((error) => {
      console.error('❌ [useStudyRooms] Error WebSocket:', error);
      setError(error.message || 'Error en conexión WebSocket');
    });
  }, [currentRoom?.id]);

  const disconnectWebSocket = useCallback(() => {
    console.log('🔌 [useStudyRooms] Desconectando WebSocket...');
    
    wsServiceRef.current.removeAllListeners();
    wsServiceRef.current.disconnect();
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    isConnectingRef.current = false;
  }, []);

  // 🎯 Cargar lista de salas
  const loadRooms = useCallback(async (filters?: StudyRoomFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🏫 [useStudyRooms] Loading rooms with filters:', filters);
      
      const response = await apiService.get('/study-rooms', { params: filters });
      setRooms(response.data.rooms);
      
      console.log('✅ [useStudyRooms] Loaded', response.data.rooms.length, 'rooms');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading study rooms';
      setError(errorMessage);
      console.error('❌ [useStudyRooms] Error loading rooms:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🎯 Crear nueva sala
  const createRoom = useCallback(async (roomData: Partial<StudyRoom>): Promise<StudyRoom> => {
    setError(null);
    
    try {
      console.log('🎨 [useStudyRooms] Creating room:', roomData);
      
      const response = await apiService.post('/study-rooms', roomData);
      const newRoom = response.data;
      
      setRooms(prev => [newRoom, ...prev]);
      setCurrentRoom(newRoom);
      
      console.log('✅ [useStudyRooms] Room created:', newRoom.id);
      return newRoom;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating study room';
      setError(errorMessage);
      console.error('❌ [useStudyRooms] Error creating room:', err);
      throw err;
    }
  }, []);

  // 🎯 Enviar mensaje de chat con WebSocket real
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !currentRoom || !isConnected) {
      console.warn('⚠️ [useStudyRooms] No se puede enviar mensaje: condiciones no válidas');
      return;
    }

    try {
      console.log('💬 [useStudyRooms] Enviando mensaje via WebSocket:', text);
      
      // Enviar via WebSocket en lugar de API REST
      wsServiceRef.current.sendMessage(currentRoom.id, text);
      
      console.log('✅ [useStudyRooms] Mensaje enviado via WebSocket');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending message';
      setError(errorMessage);
      console.error('❌ [useStudyRooms] Error enviando mensaje:', err);
      throw err;
    }
  }, [currentRoom, isConnected]);

  // 🎯 Unirse a sala con WebSocket
  const joinRoom = useCallback(async (roomId: string) => {
    setError(null);
    
    try {
      console.log('🚪 [useStudyRooms] Joining room via WebSocket:', roomId);
      
      if (!isConnected) {
        throw new Error('WebSocket no conectado. Intenta reconectar.');
      }

      // Unirse via WebSocket
      wsServiceRef.current.joinRoom(roomId);
      
      // Actualizar el estado local para encontrar la sala
      const targetRoom = rooms.find(r => r.id === roomId);
      if (targetRoom) {
        setCurrentRoom(targetRoom);
      }
      
      console.log('✅ [useStudyRooms] Joined room via WebSocket:', roomId);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error joining study room';
      setError(errorMessage);
      console.error('❌ [useStudyRooms] Error joining room:', err);
      throw err;
    }
  }, [rooms, isConnected]);

  // 🎯 Salir de sala con WebSocket
  const leaveRoom = useCallback(async (roomId: string) => {
    setError(null);
    
    try {
      console.log('🚶 [useStudyRooms] Leaving room via WebSocket:', roomId);
      
      if (!isConnected) {
        console.warn('⚠️ [useStudyRooms] WebSocket no conectado, solo limpiando estado local');
      } else {
        // Salir via WebSocket
        wsServiceRef.current.leaveRoom(roomId);
      }
      
      // Limpiar estado local
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null);
        setChatMessages([]);
        setParticipants([]);
      }
      
      console.log('✅ [useStudyRooms] Left room:', roomId);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error leaving study room';
      setError(errorMessage);
      console.error('❌ [useStudyRooms] Error leaving room:', err);
      throw err;
    }
  }, [currentRoom, isConnected]);

  // 🎯 Sincronizar video con WebSocket
  const syncVideo = useCallback(async (roomId: string, syncData: SyncData) => {
    setError(null);
    
    try {
      console.log('🎬 [useStudyRooms] Syncing video via WebSocket:', roomId, syncData);
      
      if (!isConnected) {
        throw new Error('WebSocket no conectado. No se puede sincronizar video.');
      }
      
      // Sincronizar via WebSocket
      wsServiceRef.current.syncVideo(roomId, syncData.currentTime, !syncData.isPlaying);
      
      // Actualizar estado local
      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            syncedTimestamp: syncData.currentTime
          };
        }
        return room;
      }));
      
      console.log('✅ [useStudyRooms] Video synced via WebSocket:', roomId);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error syncing video';
      setError(errorMessage);
      console.error('❌ [useStudyRooms] Error syncing video:', err);
      throw err;
    }
  }, [isConnected]);

  // 🎯 Refrescar salas
  const refreshRooms = useCallback(async () => {
    console.log('🔄 [useStudyRooms] Refreshing rooms');
    await loadRooms();
  }, [loadRooms]);

  // 🎯 Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 🎯 Auto-refresh si está habilitado
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const setupAutoRefresh = () => {
        refreshTimeoutRef.current = setTimeout(async () => {
          await refreshRooms();
          setupAutoRefresh(); // Configurar siguiente refresh
        }, refreshInterval);
      };
      
      setupAutoRefresh();
      
      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshRooms]);

  // 🎯 Cargar salas inicialmente
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  // 🎯 Efectos para WebSocket
  useEffect(() => {
    if (!enableRealtime) return;

    if (isAuthenticated && user?.id && !isConnected && connectionStatus !== 'connecting') {
      console.log('🔌 [useStudyRooms] Iniciando conexión WebSocket...');
      connectWebSocket();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAuthenticated, user?.id, enableRealtime, connectWebSocket, isConnected, connectionStatus]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      // Cleanup study rooms resources
      disconnectWebSocket();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [disconnectWebSocket]);

  return {
    // Estado de salas
    rooms,
    currentRoom,
    isLoading,
    error,
    
    // Estado de conectividad
    isConnected,
    connectionStatus,
    
    // Chat y mensajes
    chatMessages,
    participants,
    
    // Acciones de salas
    loadRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom: async (roomId: string) => {
      setError(null);
      
      try {
        console.log('🗑️ [useStudyRooms] Deleting room:', roomId);
        
        await apiService.delete(`/study-rooms/${roomId}`);
        
        console.log('✅ [useStudyRooms] Deleted room:', roomId);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error deleting study room';
        setError(errorMessage);
        console.error('❌ [useStudyRooms] Error deleting room:', err);
        throw err;
      }
    },
    
    // Sincronización de video
    syncVideo,
    
    // Chat
    sendMessage,
    
    // Utilidades
    refreshRooms,
    clearError,
  };
}; 