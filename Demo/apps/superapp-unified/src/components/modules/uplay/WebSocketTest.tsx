// 🔧 WebSocket Test Component - Prueba de Conexión en Tiempo Real
// Componente temporal para verificar la conexión WebSocket con el backend

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Box,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  PlayArrow as ConnectIcon,
  Stop as DisconnectIcon,
  Send as SendIcon,
  Room as RoomIcon,
  Message as MessageIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { 
  WebSocketService, 
  COOMUNITY_WEBSOCKET_CONFIG,
  connectAuthenticatedWebSocket,
  hasValidAuthForWebSocket,
  getWebSocketService
} from '../../../lib/websocket-service';
import { useAuth } from '../../../contexts/AuthContext';

interface WebSocketTestProps {
  onConnectionStatus?: (connected: boolean) => void;
}

export const WebSocketTest: React.FC<WebSocketTestProps> = ({
  onConnectionStatus,
}) => {
  // Estados
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Desconectado');
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [roomId, setRoomId] = useState('test-room-1');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('Verificando...');

  // Referencias
  const wsServiceRef = useRef<WebSocketService | null>(null);

  // Context de autenticación
  const { user, isAuthenticated } = useAuth();

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    const checkAuthStatus = () => {
      if (isAuthenticated && user) {
        setAuthStatus(`✅ Autenticado como: ${user.email}`);
      } else if (hasValidAuthForWebSocket()) {
        setAuthStatus('⚠️ Token presente pero usuario no cargado');
      } else {
        setAuthStatus('❌ No autenticado - Inicia sesión primero');
      }
    };

    checkAuthStatus();
  }, [isAuthenticated, user]);

  /**
   * 🔌 Conexión WebSocket con Autenticación Automática
   */
  const connectWebSocket = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔌 [WebSocketTest] Iniciando conexión con autenticación automática...');
      
      // Verificar autenticación antes de conectar
      if (!hasValidAuthForWebSocket()) {
        throw new Error('No hay token de autenticación válido. Por favor, inicia sesión.');
      }

      // Obtener instancia global del servicio
      wsServiceRef.current = getWebSocketService();

      // Configurar event listeners
      setupEventListeners();

      // Conectar con autenticación automática (obtiene token de localStorage)
      const connected = await wsServiceRef.current.connect();

      if (connected) {
        setIsConnected(true);
        setConnectionStatus('Conectado y autenticado');
        onConnectionStatus?.(true);
        console.log('✅ [WebSocketTest] Conexión exitosa con autenticación automática');
        addMessage('🔐 Conexión WebSocket autenticada exitosamente');
      }

    } catch (error) {
      console.error('❌ [WebSocketTest] Error de conexión:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      setConnectionStatus('Error de conexión');
      addMessage(`❌ Error de conexión: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * 🔌 Conexión con Función Utilitaria
   */
  const connectWithUtility = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔌 [WebSocketTest] Usando función utilitaria connectAuthenticatedWebSocket...');
      
      // Configurar event listeners antes de conectar
      wsServiceRef.current = getWebSocketService();
      setupEventListeners();

      // Usar la función utilitaria para conectar
      const connected = await connectAuthenticatedWebSocket();

      if (connected) {
        setIsConnected(true);
        setConnectionStatus('Conectado con función utilitaria');
        onConnectionStatus?.(true);
        console.log('✅ [WebSocketTest] Conexión exitosa con función utilitaria');
        addMessage('🚀 Conexión WebSocket usando función utilitaria');
      }

    } catch (error) {
      console.error('❌ [WebSocketTest] Error con función utilitaria:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      setConnectionStatus('Error con función utilitaria');
      addMessage(`❌ Error función utilitaria: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWebSocket = () => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      wsServiceRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('Desconectado');
    setJoinedRoom(null);
    setMessages([]);
    onConnectionStatus?.(false);
    console.log('🔌 [WebSocketTest] Desconectado');
  };

  /**
   * 👂 Event Listeners
   */
  const setupEventListeners = () => {
    if (!wsServiceRef.current) return;

    // Eventos de sala
    wsServiceRef.current.onRoomJoined((data) => {
      console.log('🚪 [WebSocketTest] Unido a sala:', data);
      setJoinedRoom(data.roomId);
      addMessage(`✅ Te uniste a la sala: ${data.roomId}`);
    });

    wsServiceRef.current.onUserJoinedRoom((data) => {
      console.log('👤 [WebSocketTest] Usuario se unió:', data);
      addMessage(`👋 ${data.userName || data.user?.name || 'Usuario'} se unió a la sala`);
    });

    wsServiceRef.current.onUserLeftRoom((data) => {
      console.log('👤 [WebSocketTest] Usuario salió:', data);
      addMessage(`👋 ${data.userName || data.user?.name || 'Usuario'} salió de la sala`);
    });

    // Eventos de chat
    wsServiceRef.current.onNewMessage((data) => {
      console.log('💬 [WebSocketTest] Nuevo mensaje:', data);
      const userName = data.user?.name || data.userName || 'Usuario';
      addMessage(`${userName}: ${data.message}`);
    });

    wsServiceRef.current.onMessagesHistory((data) => {
      console.log('📥 [WebSocketTest] Historial de mensajes:', data);
      if (data.messages && Array.isArray(data.messages)) {
        const historyMessages = data.messages.map((msg: any) => {
          const userName = msg.user?.name || msg.userName || 'Usuario';
          return `${userName}: ${msg.message}`;
        });
        setMessages(prev => [...historyMessages, ...prev]);
      }
    });

    // Eventos de video
    wsServiceRef.current.onVideoSyncUpdate((data) => {
      console.log('🎥 [WebSocketTest] Video sincronizado:', data);
      addMessage(`🎥 Video sincronizado: ${data.currentTime}s ${data.isPaused ? '(pausado)' : '(reproduciendo)'}`);
    });

    // Eventos de error
    wsServiceRef.current.onError((error) => {
      console.error('❌ [WebSocketTest] Error del servidor:', error);
      const errorMessage = error.message || 'Error del servidor';
      setError(errorMessage);
      addMessage(`❌ Error: ${errorMessage}`);
    });
  };

  /**
   * 🚪 Gestión de Salas
   */
  const joinRoom = () => {
    if (!wsServiceRef.current || !roomId.trim()) return;

    console.log('🚪 [WebSocketTest] Uniéndose a sala:', roomId);
    wsServiceRef.current.joinRoom(roomId.trim());
  };

  const leaveRoom = () => {
    if (!wsServiceRef.current || !joinedRoom) return;

    console.log('🚪 [WebSocketTest] Saliendo de sala:', joinedRoom);
    wsServiceRef.current.leaveRoom(joinedRoom);
    setJoinedRoom(null);
  };

  /**
   * 💬 Chat
   */
  const sendMessage = () => {
    if (!wsServiceRef.current || !joinedRoom || !messageInput.trim()) return;

    console.log('💬 [WebSocketTest] Enviando mensaje:', messageInput);
    wsServiceRef.current.sendMessage(joinedRoom, messageInput.trim());
    
    // Agregar mensaje local para feedback inmediato
    addMessage(`Tú: ${messageInput.trim()}`);
    setMessageInput('');
  };

  const requestMessages = () => {
    if (!wsServiceRef.current || !joinedRoom) return;

    console.log('📥 [WebSocketTest] Solicitando historial de mensajes');
    wsServiceRef.current.requestMessages(joinedRoom);
  };

  /**
   * 🎥 Video Sync Test
   */
  const testVideoSync = () => {
    if (!wsServiceRef.current || !joinedRoom) return;

    const currentTime = Math.random() * 100; // Tiempo aleatorio
    const isPaused = Math.random() > 0.5; // Estado aleatorio

    console.log('🎥 [WebSocketTest] Probando sincronización de video');
    wsServiceRef.current.syncVideo(joinedRoom, currentTime, isPaused);
  };

  /**
   * 🛠 Utilidades
   */
  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <CardHeader
        title="🔧 WebSocket Test - Conexión Autenticada en Tiempo Real"
        subheader="Prueba de conectividad con autenticación JWT al backend NestJS StudyRooms"
      />
      
      <CardContent>
        <Stack spacing={3}>
          {/* Estado de Autenticación */}
          <Box>
            <Typography variant="h6" gutterBottom>
              🔐 Estado de Autenticación
            </Typography>
            <Alert 
              severity={isAuthenticated ? 'success' : hasValidAuthForWebSocket() ? 'warning' : 'error'}
              icon={<SecurityIcon />}
            >
              {authStatus}
            </Alert>
            {user && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Usuario: {user.full_name || user.email} | Rol: {user.role}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Estado de Conexión */}
          <Box>
            <Typography variant="h6" gutterBottom>
              🔌 Estado de Conexión WebSocket
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Chip
                label={connectionStatus}
                color={isConnected ? 'success' : isConnecting ? 'warning' : 'default'}
                icon={isConnecting ? <CircularProgress size={16} /> : undefined}
              />
              
              {isConnected ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DisconnectIcon />}
                  onClick={disconnectWebSocket}
                >
                  Desconectar
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<ConnectIcon />}
                    onClick={connectWebSocket}
                    disabled={isConnecting || !hasValidAuthForWebSocket()}
                    size="small"
                  >
                    {isConnecting ? 'Conectando...' : 'Conectar Auto'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ConnectIcon />}
                    onClick={connectWithUtility}
                    disabled={isConnecting || !hasValidAuthForWebSocket()}
                    size="small"
                  >
                    Función Utilitaria
                  </Button>
                </Stack>
              )}
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {!hasValidAuthForWebSocket() && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Para probar la conexión WebSocket, necesitas iniciar sesión en la aplicación primero.
              </Alert>
            )}
          </Box>

          <Divider />

          {/* Gestión de Salas */}
          <Box>
            <Typography variant="h6" gutterBottom>
              🚪 Gestión de Salas
            </Typography>
            
            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                label="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                size="small"
                disabled={!isConnected}
              />
              
              {joinedRoom ? (
                <Button
                  variant="outlined"
                  startIcon={<RoomIcon />}
                  onClick={leaveRoom}
                  disabled={!isConnected}
                >
                  Salir de {joinedRoom}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<RoomIcon />}
                  onClick={joinRoom}
                  disabled={!isConnected || !roomId.trim()}
                >
                  Unirse
                </Button>
              )}
            </Stack>

            {joinedRoom && (
              <Chip
                label={`En sala: ${joinedRoom}`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          <Divider />

          {/* Chat de Prueba */}
          <Box>
            <Typography variant="h6" gutterBottom>
              💬 Chat de Prueba
            </Typography>

            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                label="Mensaje"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                fullWidth
                size="small"
                disabled={!joinedRoom}
              />
              
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={sendMessage}
                disabled={!joinedRoom || !messageInput.trim()}
              >
                Enviar
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} mb={2}>
              <Button
                variant="outlined"
                onClick={requestMessages}
                disabled={!joinedRoom}
                size="small"
              >
                📥 Cargar Historial
              </Button>
              
              <Button
                variant="outlined"
                onClick={testVideoSync}
                disabled={!joinedRoom}
                size="small"
              >
                🎥 Test Video Sync
              </Button>
            </Stack>

            {/* Mensajes */}
            <Box
              sx={{
                maxHeight: 200,
                overflowY: 'auto',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                backgroundColor: 'background.default',
              }}
            >
              {messages.length === 0 ? (
                <Typography variant="body2" color="text.disabled">
                  No hay mensajes aún...
                </Typography>
              ) : (
                messages.map((message, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: '12px' }}
                  >
                    {message}
                  </Typography>
                ))
              )}
            </Box>
          </Box>

          {/* Debug Info */}
          <Box>
            <Typography variant="caption" color="text.disabled">
              🔧 Debug: Token presente: {hasValidAuthForWebSocket() ? 'Sí' : 'No'} | 
              WebSocket URL: {COOMUNITY_WEBSOCKET_CONFIG.url}{COOMUNITY_WEBSOCKET_CONFIG.namespace} |
              {wsServiceRef.current && ` ID: ${wsServiceRef.current.connectionId}`}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}; 