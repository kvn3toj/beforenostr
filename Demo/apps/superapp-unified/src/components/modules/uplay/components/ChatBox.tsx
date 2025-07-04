// 💬 Componente: ChatBox - Chat en Tiempo Real para Salas de Estudio
// Implementa chat colaborativo según roadmap FASE 2
// Incluye reacciones, mensajes de sistema, y diseño CoomÜnity

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Divider,
  Badge,
  Tooltip,
  Fade,
  Collapse,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  Favorite as LikeIcon,
  Celebration as CelebrateIcon,
  Psychology as InsightIcon,
  Handshake as ReciprocidadIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  QuestionAnswer as QuestionIcon,
  EmojiEvents as RewardIcon,
} from '@mui/icons-material';
import { ChatMessage, User } from '../../../../types/study-rooms';
import { useStudyRooms } from '../../../../hooks/uplay/useStudyRooms';

interface ChatBoxProps {
  roomId?: string; // ID específico de la sala para conectarse
  height?: number | string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  showParticipants?: boolean;
}

// Configuración de reacciones disponibles
const EMOJI_REACTIONS = {
  like: { icon: LikeIcon, label: 'Me gusta', color: '#ef4444' },
  celebrate: { icon: CelebrateIcon, label: 'Celebrar', color: '#f59e0b' },
  insight: { icon: InsightIcon, label: 'Insight', color: '#8b5cf6' },
  reciprocidad: { icon: ReciprocidadIcon, label: 'Reciprocidad', color: '#10b981' },
} as const;

// Tipos de mensajes del sistema
const SYSTEM_MESSAGE_TYPES = {
  'user-joined': { icon: PersonIcon, color: '#10b981', label: 'Usuario se unió' },
  'user-left': { icon: PersonIcon, color: '#6b7280', label: 'Usuario salió' },
  'question-answered': { icon: QuestionIcon, color: '#3b82f6', label: 'Pregunta respondida' },
  'reward-earned': { icon: RewardIcon, color: '#f59e0b', label: 'Recompensa obtenida' },
  'video-sync': { icon: NotificationIcon, color: '#8b5cf6', label: 'Video sincronizado' },
} as const;

export const ChatBox: React.FC<ChatBoxProps> = ({
  roomId,
  height = 400,
  isMinimized = false,
  onToggleMinimize,
  showParticipants = true,
}) => {
  const theme = useTheme();
  
  // Hook de study rooms con WebSocket integrado
  const {
    chatMessages,
    currentRoom,
    participants,
    sendMessage,
    isConnected,
    connectionStatus,
    error: roomError,
  } = useStudyRooms({ 
    roomId, 
    enableRealtime: true 
  });

  // Estados locales
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 🔄 Effects
   */
  
  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isMinimized]);

  // Focus en input cuando se expande el chat
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  /**
   * 💬 Funciones de chat con WebSocket real
   */
  const handleSendMessage = useCallback(async () => {
    const message = messageInput.trim();
    if (!message || !currentRoom || isSending || !isConnected) return;

    setIsSending(true);
    
    try {
      console.log('💬 [ChatBox] Enviando mensaje via WebSocket:', message);
      
      // Enviar mensaje via WebSocket
      await sendMessage(message);
      setMessageInput('');
      
      console.log('✅ [ChatBox] Mensaje enviado exitosamente');
    } catch (error) {
      console.error('❌ [ChatBox] Error enviando mensaje:', error);
    } finally {
      setIsSending(false);
    }
  }, [messageInput, currentRoom, sendMessage, isSending, isConnected]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleReaction = useCallback((messageId: string, reactionType: keyof typeof EMOJI_REACTIONS) => {
    console.log('😊 [ChatBox] Reacción agregada:', { messageId, reactionType });
    // TODO: Implementar lógica de reacciones cuando esté el WebSocket completo
    setSelectedMessageId(null);
  }, []);

  /**
   * 🎨 Funciones de renderizado
   */
  const renderMessage = (message: ChatMessage) => {
    const isSystemMessage = message.type === 'system';
    const isCurrentUser = message.userId === participants[0]?.id; // Simplificar check
    const reactionConfig = message.reactionType ? EMOJI_REACTIONS[message.reactionType] : null;

    if (isSystemMessage) {
      const systemType = message.message.includes('unió') ? 'user-joined' :
                        message.message.includes('salió') ? 'user-left' :
                        message.message.includes('pregunta') ? 'question-answered' :
                        message.message.includes('Mëritos') ? 'reward-earned' : 'video-sync';
      
      const systemConfig = SYSTEM_MESSAGE_TYPES[systemType];

      return (
        <Fade in key={message.id}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Chip
              icon={<systemConfig.icon sx={{ fontSize: 16 }} />}
              label={message.message}
              size="small"
              sx={{
                backgroundColor: alpha(systemConfig.color, 0.1),
                color: systemConfig.color,
                borderColor: alpha(systemConfig.color, 0.3),
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: systemConfig.color,
                },
              }}
              variant="outlined"
            />
          </Box>
        </Fade>
      );
    }

    return (
      <Fade in key={message.id}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: 1,
            mb: 2,
          }}
        >
          <Avatar
            src={message.user.avatarUrl}
            sx={{
              width: 32,
              height: 32,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            {message.user.name.charAt(0)}
          </Avatar>

          <Box
            sx={{
              maxWidth: '75%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
            }}
          >
            {/* Nombre y timestamp */}
            <Stack
              direction={isCurrentUser ? 'row-reverse' : 'row'}
              spacing={1}
              alignItems="center"
              mb={0.5}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.primary"
              >
                {message.user.name}
              </Typography>
              
              <Typography
                variant="caption"
                color="text.disabled"
                fontSize="11px"
              >
                {message.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Stack>

            {/* Bubble del mensaje */}
            <Box
              onClick={() => setSelectedMessageId(
                selectedMessageId === message.id ? null : message.id
              )}
              sx={{
                backgroundColor: isCurrentUser
                  ? 'primary.main'
                  : alpha(theme.palette.background.paper, 0.8),
                color: isCurrentUser ? 'white' : 'text.primary',
                borderRadius: isCurrentUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: selectedMessageId === message.id
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                },
              }}
            >
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {message.message}
              </Typography>

              {/* Reacción si existe */}
              {reactionConfig && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <reactionConfig.icon
                    sx={{ fontSize: 16, color: reactionConfig.color }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: reactionConfig.color, fontWeight: 600 }}
                  >
                    {reactionConfig.label}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Panel de reacciones */}
            <Collapse in={selectedMessageId === message.id}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1,
                  p: 1,
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                }}
              >
                {Object.entries(EMOJI_REACTIONS).map(([key, config]) => (
                  <Tooltip key={key} title={config.label}>
                    <IconButton
                      size="small"
                      onClick={() => handleReaction(message.id, key as keyof typeof EMOJI_REACTIONS)}
                      sx={{
                        color: config.color,
                        '&:hover': {
                          backgroundColor: alpha(config.color, 0.1),
                        },
                      }}
                    >
                      <config.icon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </Collapse>
          </Box>
        </Box>
      </Fade>
    );
  };

  const renderParticipants = () => {
    if (!showParticipants || !currentRoom) return null;

    return (
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Participantes ({participants.length})
        </Typography>
        
        <Stack spacing={1}>
          {participants.map((participant) => (
            <Stack
              key={participant.id}
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      border: '2px solid white',
                    }}
                  />
                }
              >
                <Avatar
                  src={participant.avatarUrl}
                  sx={{ width: 28, height: 28 }}
                >
                  {participant.name?.charAt(0) || 'U'}
                </Avatar>
              </Badge>
              
              <Box flex={1} minWidth={0}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {participant.name || 'Usuario'}
                  {participant.id === currentRoom.hostId && (
                    <Chip
                      label="Host"
                      size="small"
                      sx={{
                        ml: 1,
                        height: 16,
                        fontSize: '10px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    />
                  )}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.disabled">
                    Nivel {participant.level || 1}
                  </Typography>
                  <Typography variant="caption" color="#fbbf24">
                    {participant.meritos || 0} Mëritos
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

  // Estado de conexión para mostrar en UI
  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connecting': return 'Conectando...';
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Error de conexión';
      default: return 'Desconectado';
    }
  };

  if (!roomId && !currentRoom) {
    return (
      <Card sx={{ height, borderRadius: 3 }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary" mb={1}>
            Chat no disponible
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Únete a una sala de estudio para chatear
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: isMinimized ? 'auto' : height,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isConnected ? '#10b981' : '#ef4444',
                  border: '2px solid white',
                }}
              />
            }
          >
            <Avatar sx={{ backgroundColor: 'primary.main' }}>
              💬
            </Avatar>
          </Badge>
        }
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            Chat: {currentRoom?.name || 'Sala de Estudio'}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.disabled">
            {chatMessages.length} mensajes • {participants.length} participantes • {getConnectionStatusText()}
          </Typography>
        }
        action={
          onToggleMinimize && (
            <IconButton onClick={onToggleMinimize} size="small">
              {isMinimized ? <ExpandIcon /> : <CollapseIcon />}
            </IconButton>
          )
        }
        sx={{
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '& .MuiCardHeader-content': { minWidth: 0 },
        }}
      />

      <Collapse in={!isMinimized}>
        {/* Error de conexión */}
        {roomError && (
          <Box sx={{ p: 1, backgroundColor: alpha('#ef4444', 0.1) }}>
            <Typography variant="caption" color="error">
              Error: {roomError}
            </Typography>
          </Box>
        )}

        {/* Área de mensajes */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: alpha(theme.palette.background.default, 0.3),
            minHeight: 200,
            maxHeight: showParticipants ? '60%' : '80%',
          }}
        >
          {chatMessages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
              }}
            >
              <EmojiIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.disabled">
                {isConnected ? '¡Sé el primero en enviar un mensaje!' : 'Conectando al chat...'}
              </Typography>
            </Box>
          ) : (
            chatMessages.map(renderMessage)
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Participantes */}
        {renderParticipants()}

        {/* Input de mensaje */}
        <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={3}
              placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected || isSending || !currentRoom}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: !isConnected && (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        mr: 1,
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                },
              }}
            />
            
            <IconButton
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || !isConnected || isSending || !currentRoom}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: alpha(theme.palette.action.disabled, 0.3),
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}; 