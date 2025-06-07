/**
 * 💬 ChatArea Component - Enhanced Real-Time Chat with Backend Integration
 * 
 * Componente de chat en tiempo real completamente integrado con el Backend NestJS
 * Incluye funcionalidades avanzadas de mensajería, estados de escritura, y UX mejorada.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Alert,
  LinearProgress,
  Fade,
  Collapse,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  InputAdornment,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
  Image as ImageIcon,
  MoreVert as MoreIcon,
  CheckCircle as DeliveredIcon,
  Circle as PendingIcon,
  PersonAdd as AddPersonIcon,
  Block as BlockIcon,
  Report as ReportIcon,
  VolumeOff as MuteIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  WifiOff as DisconnectedIcon,
  Wifi as ConnectedIcon,
  Edit as TypingIcon,
} from '@mui/icons-material';

// Hooks personalizados
import { 
  useMatchMessages, 
  useSendMessage, 
  useUpdateUserStatus,
  useBackendAvailability 
} from '../../../../hooks/useRealBackendData';

// 🏷️ Tipos específicos para el chat
interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  type: 'text' | 'emoji' | 'image' | 'audio';
  status: 'pending' | 'sent' | 'delivered' | 'read';
  edited?: boolean;
  editedAt?: string;
}

interface TypingUser {
  id: string;
  name: string;
  timestamp: number;
}

interface ChatAreaProps {
  matchId: string;
  currentUserId: string;
  isVisible?: boolean;
}

// 🌐 Servicio WebSocket simulado (integración con Backend NestJS)
class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private matchId: string = '';
  private userId: string = '';
  private onMessage: ((data: any) => void) | null = null;
  private onStatus: ((status: string) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect(matchId: string, userId: string, onMessage: (data: any) => void, onStatus: (status: string) => void) {
    this.matchId = matchId;
    this.userId = userId;
    this.onMessage = onMessage;
    this.onStatus = onStatus;

    try {
      // Conectar al WebSocket del Backend NestJS
      const wsUrl = `ws://localhost:3002/chat/${matchId}?userId=${userId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 WebSocket conectado');
        this.onStatus?.('connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage?.(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        this.onStatus?.('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('🔌 WebSocket error:', error);
        this.onStatus?.('error');
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.onStatus?.('error');
      // Fallback: simular conexión para desarrollo
      this.simulateConnection();
    }
  }

  private simulateConnection() {
    // Simular conexión exitosa para desarrollo
    setTimeout(() => {
      this.onStatus?.('connected');
    }, 1000);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.onStatus?.('connecting');
      this.reconnectTimeout = setTimeout(() => {
        console.log(`🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(this.matchId, this.userId, this.onMessage!, this.onStatus!);
      }, delay);
    }
  }

  sendMessage(content: string, type: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        content,
        messageType: type,
        matchId: this.matchId,
        userId: this.userId,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('WebSocket no está conectado');
    }
  }

  updateStatus(status: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'status',
        status,
        matchId: this.matchId,
        userId: this.userId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const ChatArea: React.FC<ChatAreaProps> = ({
  matchId, 
  currentUserId, 
  isVisible = true 
}) => {
  // 🎯 Estados principales
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  
  // 🎨 Estados de UI
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSeenMessage, setLastSeenMessage] = useState<string | null>(null);

  // 📱 Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWebSocket = useRef<ChatWebSocketService | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔗 Hooks de backend
  const backendAvailability = useBackendAvailability();
  const { data: messagesResponse, isLoading, error, refetch } = useMatchMessages(matchId);
  const sendMessageMutation = useSendMessage();
  const updateStatusMutation = useUpdateUserStatus();

  // Extraer mensajes de la respuesta
  const messages = messagesResponse?.data || [];

  // 🔌 Inicializar conexión WebSocket
  useEffect(() => {
    if (!matchId || !currentUserId) return;

    // Inicializar servicio WebSocket
    chatWebSocket.current = new ChatWebSocketService();
    
    const handleMessage = (messageData: any) => {
      console.log('💬 Nuevo mensaje recibido:', messageData);
      
      // Actualizar lista de mensajes
      refetch();
      
      // Manejar indicadores de escritura
      if (messageData.type === 'typing') {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.id !== messageData.userId);
          if (messageData.status === 'typing') {
            return [...filtered, {
              id: messageData.userId,
              name: messageData.userName || 'Usuario',
              timestamp: Date.now()
            }];
          }
          return filtered;
        });
      }
      
      // Actualizar contador de no leídos si el chat no está visible
      if (!isVisible && messageData.type === 'message') {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleStatus = (status: string) => {
      console.log('📡 Estado de conexión:', status);
      setConnectionStatus(status as any);
      setIsConnected(status === 'connected');
    };

    // Conectar al WebSocket
    chatWebSocket.current.connect(matchId, currentUserId, handleMessage, handleStatus);

    return () => {
      chatWebSocket.current?.disconnect();
    };
  }, [matchId, currentUserId, isVisible, refetch]);

  // 📜 Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 👀 Marcar mensajes como leídos cuando el chat está visible
  useEffect(() => {
    if (isVisible && unreadCount > 0) {
      setUnreadCount(0);
      // Actualizar estado de usuario como activo
      updateStatusMutation.mutate('online');
    }
  }, [isVisible, unreadCount, updateStatusMutation]);

  // 🧹 Limpiar usuarios escribiendo (timeout)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => prev.filter(user => now - user.timestamp < 5000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✍️ Manejo de "usuario escribiendo"
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      chatWebSocket.current?.updateStatus('typing');
    }

    // Reset del timeout de escritura
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatWebSocket.current?.updateStatus('online');
    }, 3000);
  }, [isTyping]);

  // 📤 Enviar mensaje
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    const messageData = {
      content: message.trim(),
      type: 'text' as const,
      matchId,
    };

    try {
      // Enviar a través del backend
      await sendMessageMutation.mutateAsync(messageData);
      
      // También enviar vía WebSocket para actualizaciones en tiempo real
      chatWebSocket.current?.sendMessage(message.trim(), 'text');
      
      // Limpiar input y estados
      setMessage('');
      setIsTyping(false);
      chatWebSocket.current?.updateStatus('online');
      
      // Focus en el input
      inputRef.current?.focus();
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  }, [message, matchId, sendMessageMutation]);

  // ⌨️ Manejar teclas
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  // 💬 Componente de burbuja de mensaje
  const MessageBubble: React.FC<{ message: ChatMessage; isOwn: boolean }> = ({ 
    message: msg, 
    isOwn 
  }) => (
      <Box
        sx={{
          display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: 1,
        px: 1,
      }}
    >
      {!isOwn && (
        <Avatar
          src={msg.senderAvatar}
          sx={{ width: 32, height: 32, mr: 1, mt: 'auto' }}
        >
          {msg.senderName?.[0]?.toUpperCase()}
        </Avatar>
      )}
      
      <Paper
        elevation={1}
        sx={{
          maxWidth: '70%',
          px: 2,
          py: 1,
          backgroundColor: isOwn ? 'primary.main' : 'grey.100',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        }}
      >
        {!isOwn && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {msg.senderName}
                    </Typography>
                  )}
                  
        <Typography variant="body2">
          {msg.content}
                  </Typography>
                  
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="caption" color={isOwn ? 'primary.contrastText' : 'text.secondary'}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    
          {isOwn && (
            <Box sx={{ ml: 1 }}>
              {msg.status === 'pending' && <PendingIcon sx={{ fontSize: 12, opacity: 0.7 }} />}
              {msg.status === 'sent' && <DeliveredIcon sx={{ fontSize: 12, opacity: 0.7 }} />}
              {msg.status === 'delivered' && <DeliveredIcon sx={{ fontSize: 12, color: 'success.main' }} />}
              {msg.status === 'read' && <DeliveredIcon sx={{ fontSize: 12, color: 'info.main' }} />}
            </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
            );

  // ✍️ Indicador de escritura
  const TypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    return (
      <Fade in={true}>
        <Box sx={{ px: 1, py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              <TypingIcon sx={{ fontSize: 12 }} />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {typingUsers.length === 1 
                ? `${typingUsers[0].name} está escribiendo...`
                : `${typingUsers.length} personas están escribiendo...`
              }
          </Typography>
            <CircularProgress size={12} sx={{ ml: 1 }} />
          </Box>
        </Box>
      </Fade>
    );
  };

  // 📡 Indicador de estado de conexión
  const ConnectionStatus = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
      <Chip
        icon={
          connectionStatus === 'connected' ? <ConnectedIcon /> :
          connectionStatus === 'connecting' ? <CircularProgress size={16} /> :
          <DisconnectedIcon />
        }
        label={
          connectionStatus === 'connected' ? 'Conectado' :
          connectionStatus === 'connecting' ? 'Conectando...' :
          connectionStatus === 'error' ? 'Error de conexión' :
          'Desconectado'
        }
            size="small"
        color={
          connectionStatus === 'connected' ? 'success' :
          connectionStatus === 'error' ? 'error' :
          'default'
        }
        variant={connectionStatus === 'connected' ? 'filled' : 'outlined'}
      />
      
      {connectionStatus !== 'connected' && (
        <Tooltip title="Reintentar conexión">
          <IconButton
            size="small" 
            onClick={() => chatWebSocket.current?.connect(matchId, currentUserId, () => {}, () => {})}
            sx={{ ml: 1 }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  // 🎨 Renderizado principal
  if (isLoading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando conversación...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <Alert severity="error" action={
          <Button onClick={() => refetch()}>Reintentar</Button>
        }>
          Error cargando mensajes. Verifica tu conexión.
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header con estado de conexión */}
      <CardContent sx={{ pb: 1 }}>
        <ConnectionStatus />
        <Divider sx={{ mt: 1 }} />
      </CardContent>

      {/* Área de mensajes */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {messages.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="text.secondary">
              No hay mensajes aún. ¡Inicia la conversación!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1} sx={{ py: 1 }}>
            {messages.map((msg: ChatMessage) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
              />
            ))}
          </Stack>
        )}
        
        {/* Indicador de escritura */}
        <TypingIndicator />
        
        {/* Referencia para auto-scroll */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input de mensaje */}
      <CardContent sx={{ pt: 1 }}>
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={3}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
          disabled={!isConnected || sendMessageMutation.isPending}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Emoji">
                    <IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <EmojiIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Imagen">
                    <IconButton size="small" onClick={() => setShowImageDialog(true)}>
                      <ImageIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Audio">
                    <IconButton size="small">
                      <MicIcon />
          </IconButton>
                  </Tooltip>
          
                  <Tooltip title="Enviar">
          <IconButton
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !isConnected || sendMessageMutation.isPending}
                      color="primary"
                    >
                      {sendMessageMutation.isPending ? (
                        <CircularProgress size={20} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
                  </Tooltip>
                </Stack>
              </InputAdornment>
            ),
          }}
        />
        
        {/* Picker de emoji simple */}
        <Collapse in={showEmojiPicker}>
          <Paper sx={{ p: 1, mt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉'].map((emoji) => (
                <IconButton
                  key={emoji}
                  size="small"
                  onClick={() => {
                    setMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Stack>
          </Paper>
        </Collapse>
      </CardContent>

      {/* Badge de mensajes no leídos */}
      {!isVisible && unreadCount > 0 && (
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      )}
    </Card>
  );
};

export default ChatArea; 