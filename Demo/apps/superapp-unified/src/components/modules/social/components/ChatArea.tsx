import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Avatar,
  IconButton,
  Skeleton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import type { SocialMatch, ChatMessage } from '../../../../types';

interface ChatAreaProps {
  selectedMatch: string | null;
  selectedMatchData?: SocialMatch;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
  onEmojiClick: (emoji: string) => void;
  isRecording: boolean;
  onRecording: () => void;
  isSending: boolean;
  formatTime: (dateString: string) => string;
  messageEndRef: React.RefObject<HTMLDivElement>;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedMatch,
  selectedMatchData,
  messages,
  isLoadingMessages,
  messageInput,
  setMessageInput,
  onSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  isRecording,
  onRecording,
  isSending,
  formatTime,
  messageEndRef,
}) => {
  // Emojis populares basados en el análisis
  const popularEmojis = [
    '😊', '❤️', '👍', '😂', '🙏', '🔥', '💪', '🎉', 
    '😍', '🤝', '💯', '✨', '🚀', '💡', '⭐', '🎯'
  ];

  // Obtener ID del usuario actual (aquí podrías usar un hook de auth)
  const currentUserId = 'current-user-id'; // TODO: Obtener del contexto de auth

  // Componente de skeleton para mensajes
  const MessageSkeleton = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
      <Paper sx={{ p: 1.5, maxWidth: '70%', borderRadius: '18px 18px 18px 4px' }}>
        <Skeleton variant="text" width={200} />
        <Skeleton variant="text" width={80} />
      </Paper>
    </Box>
  );

  // Estado vacío cuando no hay match seleccionado
  if (!selectedMatch || !selectedMatchData) {
    return (
      <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Selecciona una conversación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Elige un match para comenzar a chatear
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Avatar src={selectedMatchData.avatar} sx={{ mr: 2 }} alt={selectedMatchData.name}>
          {selectedMatchData.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {selectedMatchData.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedMatchData.status === 'online' ? '🟢 En línea' : 
             selectedMatchData.status === 'away' ? '🟡 Ausente' : '⚫ Desconectado'}
          </Typography>
        </Box>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          bgcolor: '#f5f5f5'
        }}
      >
        {isLoadingMessages ? (
          <Box>
            {[...Array(3)].map((_, index) => (
              <MessageSkeleton key={index} />
            ))}
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info">
              No hay mensajes aún. ¡Envía el primer mensaje para iniciar la conversación!
            </Alert>
          </Box>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    bgcolor: isCurrentUser ? '#E91E63' : 'white',
                    color: isCurrentUser ? 'white' : 'text.primary',
                    borderRadius: isCurrentUser 
                      ? '18px 18px 4px 18px' 
                      : '18px 18px 18px 4px',
                    position: 'relative'
                  }}
                >
                  {/* Nombre del remitente (solo para mensajes de otros usuarios) */}
                  {!isCurrentUser && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        fontWeight: 'bold',
                        mb: 0.5,
                        opacity: 0.8
                      }}
                    >
                      {message.senderName}
                    </Typography>
                  )}
                  
                  {/* Contenido del mensaje */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: message.type === 'emoji' ? '1.5rem' : 'inherit',
                      lineHeight: message.type === 'emoji' ? 1 : 1.4,
                      wordBreak: 'break-word'
                    }}
                  >
                    {message.content}
                  </Typography>
                  
                  {/* Timestamp y estado de entrega */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        fontSize: '0.7rem'
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                    
                    {/* Indicadores de estado para mensajes propios */}
                    {isCurrentUser && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          ml: 0.5,
                          fontSize: '0.7rem'
                        }}
                      >
                        {message.isRead ? '✓✓' : message.isDelivered ? '✓' : '⏳'}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messageEndRef} />
      </Box>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="caption" gutterBottom display="block">
            Emojis populares:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {popularEmojis.map((emoji) => (
              <IconButton
                key={emoji}
                size="small"
                onClick={() => onEmojiClick(emoji)}
                sx={{ 
                  fontSize: '1.2rem',
                  '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.1)' }
                }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
        </Box>
      )}

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" gap={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            variant="outlined"
            size="small"
            disabled={isSending}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              }
            }}
          />
          
          <IconButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            color={showEmojiPicker ? 'primary' : 'default'}
            disabled={isSending}
          >
            <EmojiIcon />
          </IconButton>
          
          <IconButton
            onClick={onRecording}
            color={isRecording ? 'error' : 'default'}
            disabled={isSending}
            sx={{
              bgcolor: isRecording ? 'error.light' : 'transparent',
              animation: isRecording ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 }
              }
            }}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
          
          <IconButton
            onClick={onSendMessage}
            disabled={!messageInput.trim() || isSending}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'grey.300' }
            }}
          >
            {isSending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
        
        {/* Indicador de escritura (si hay WebSocket) */}
        {isRecording && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            🎤 Grabando audio...
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ChatArea; 