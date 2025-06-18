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

// Mock data para desarrollo - Será reemplazado por llamadas reales al backend
const MOCK_ROOMS: StudyRoom[] = [
  {
    id: '1',
    name: 'Filosofía Ayni - Sesión Matutina',
    hostId: 'user1',
    host: {
      id: 'user1',
      name: 'María González',
      email: 'maria@coomunity.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      level: 5,
      meritos: 1250,
      ondas: 890,
    },
    participants: [
      {
        id: 'user1',
        name: 'María González',
        email: 'maria@coomunity.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        level: 5,
        meritos: 1250,
        ondas: 890,
      },
      {
        id: 'user2',
        name: 'Carlos Ruiz',
        email: 'carlos@coomunity.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        level: 3,
        meritos: 750,
        ondas: 520,
      },
    ],
    syncedTimestamp: 120,
    chatEnabled: true,
    maxParticipants: 8,
    isPrivate: false,
    studyFocus: 'ayni',
    status: 'active',
    createdAt: new Date(),
    totalMeritosEarned: 45,
    totalOndasEarned: 32,
    questionsAnswered: 12,
    averageAccuracy: 0.85,
  },
  {
    id: '2',
    name: 'Gamificación Avanzada - Nivel Intermedio',
    hostId: 'user3',
    host: {
      id: 'user3',
      name: 'Ana López',
      email: 'ana@coomunity.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      level: 7,
      meritos: 2100,
      ondas: 1450,
    },
    participants: [
      {
        id: 'user3',
        name: 'Ana López',
        email: 'ana@coomunity.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        level: 7,
        meritos: 2100,
        ondas: 1450,
      },
    ],
    syncedTimestamp: 0,
    chatEnabled: true,
    maxParticipants: 12,
    isPrivate: false,
    studyFocus: 'gamificacion',
    status: 'waiting',
    createdAt: new Date(),
    scheduledStartTime: new Date(Date.now() + 30 * 60 * 1000), // En 30 minutos
    totalMeritosEarned: 0,
    totalOndasEarned: 0,
    questionsAnswered: 0,
    averageAccuracy: 0,
  },
  {
    id: '3',
    name: 'Colaboración y Bien Común',
    hostId: 'user4',
    host: {
      id: 'user4',
      name: 'Diego Morales',
      email: 'diego@coomunity.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      level: 4,
      meritos: 950,
      ondas: 680,
    },
    participants: [
      {
        id: 'user4',
        name: 'Diego Morales',
        email: 'diego@coomunity.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        level: 4,
        meritos: 950,
        ondas: 680,
      },
      {
        id: 'user5',
        name: 'Laura Vega',
        email: 'laura@coomunity.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        level: 6,
        meritos: 1800,
        ondas: 1200,
      },
      {
        id: 'user6',
        name: 'Roberto Silva',
        email: 'roberto@coomunity.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        level: 2,
        meritos: 400,
        ondas: 280,
      },
    ],
    syncedTimestamp: 300,
    chatEnabled: true,
    maxParticipants: 15,
    isPrivate: false,
    studyFocus: 'bien-común',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
    totalMeritosEarned: 78,
    totalOndasEarned: 56,
    questionsAnswered: 23,
    averageAccuracy: 0.92,
  },
];

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
      
      // TODO: En producción, reemplazar con llamada real al backend
      // const response = await apiService.get('/study-rooms', { params: filters });
      // setRooms(response.data.rooms);
      
      // Simular llamada al backend con delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Aplicar filtros a los datos mock
      let filteredRooms = [...MOCK_ROOMS];
      
      if (filters) {
        if (filters.studyFocus) {
          filteredRooms = filteredRooms.filter(room => room.studyFocus === filters.studyFocus);
        }
        if (filters.isPrivate !== undefined) {
          filteredRooms = filteredRooms.filter(room => room.isPrivate === filters.isPrivate);
        }
        if (filters.hasSpace) {
          filteredRooms = filteredRooms.filter(room => room.participants.length < room.maxParticipants);
        }
        if (filters.status) {
          filteredRooms = filteredRooms.filter(room => room.status === filters.status);
        }
      }
      
      setRooms(filteredRooms);
      console.log('✅ [useStudyRooms] Loaded', filteredRooms.length, 'rooms');
      
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
      
      // TODO: En producción, reemplazar con llamada real al backend
      // const response = await apiService.post('/study-rooms', roomData);
      // const newRoom = response.data;
      
      // Simular creación de sala
      const newRoom: StudyRoom = {
        id: `room-${Date.now()}`,
        name: roomData.name || 'Nueva Sala',
        hostId: user?.id || 'user1',
        host: {
          id: user?.id || 'user1',
          name: 'Usuario Actual',
          email: 'usuario@coomunity.com',
          avatarUrl: 'https://i.pravatar.cc/150?img=99',
          level: 1,
          meritos: 0,
          ondas: 0,
        },
        participants: [{
          id: user?.id || 'user1',
          name: 'Usuario Actual',
          email: 'usuario@coomunity.com',
          avatarUrl: 'https://i.pravatar.cc/150?img=99',
          level: 1,
          meritos: 0,
          ondas: 0,
        }],
        syncedTimestamp: 0,
        chatEnabled: roomData.chatEnabled ?? true,
        maxParticipants: roomData.maxParticipants ?? 10,
        isPrivate: roomData.isPrivate ?? false,
        studyFocus: roomData.studyFocus ?? 'filosofia',
        status: 'waiting',
        createdAt: new Date(),
        scheduledStartTime: roomData.scheduledStartTime,
        totalMeritosEarned: 0,
        totalOndasEarned: 0,
        questionsAnswered: 0,
        averageAccuracy: 0,
      };
      
      // Agregar a la lista local
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
  }, [user?.id]);

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
      console.log('🧹 [useStudyRooms] Cleaning up...');
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
        
        // TODO: En producción, reemplazar con llamada real al backend
        // await apiService.delete(`/study-rooms/${roomId}`);
        
        // Simular eliminación localmente
        setRooms(prev => prev.filter(room => room.id !== roomId));
        
        // Si es la sala actual, limpiarla
        if (currentRoom?.id === roomId) {
          setCurrentRoom(null);
        }
        
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