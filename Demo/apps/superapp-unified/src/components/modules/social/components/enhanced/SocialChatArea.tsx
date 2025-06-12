import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  TextField,
  IconButton,
  Paper,
  Chip,
  Button,
  alpha,
  useTheme,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
  Handshake,
  Circle,
  Favorite,
  Star,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    isCurrentUser: boolean;
  };
  timestamp: string;
  type: 'text' | 'ayni_proposal' | 'system' | 'celebration';
  ayniData?: {
    offer: string;
    request: string;
    status: 'pending' | 'accepted' | 'completed';
  };
  isRead?: boolean;
}

interface Connection {
  id: string;
  name: string;
  level: string;
  trustScore: number;
  isOnline: boolean;
  lastSeen?: string;
}

interface SocialChatAreaProps {
  connections: any[];
  isLoading: boolean;
  isConnected: boolean;
}

// 🎭 Datos mock de mensajes
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content:
      '¡Hola! Vi tu propuesta sobre huertos urbanos. Me encantaría intercambiar conocimiento contigo.',
    sender: {
      id: 'ana',
      name: 'Ana María',
      isCurrentUser: false,
    },
    timestamp: '10:30',
    type: 'text',
    isRead: true,
  },
  {
    id: '2',
    content:
      '¡Perfecto! Te propongo un intercambio Ayni: yo te enseño sobre compostaje y tú me ayudas con el diseño del espacio.',
    sender: {
      id: 'current',
      name: 'Tú',
      isCurrentUser: true,
    },
    timestamp: '10:35',
    type: 'ayni_proposal',
    ayniData: {
      offer: 'Conocimiento sobre compostaje urbano',
      request: 'Diseño de espacios para huerto',
      status: 'pending',
    },
    isRead: true,
  },
  {
    id: '3',
    content: '¡Acepto el intercambio! Es perfecto para mi proyecto.',
    sender: {
      id: 'ana',
      name: 'Ana María',
      isCurrentUser: false,
    },
    timestamp: '10:40',
    type: 'text',
    isRead: true,
  },
  {
    id: '4',
    content: '🎉 ¡Intercambio Ayni completado con éxito! +25 Mëritos ganados.',
    sender: {
      id: 'system',
      name: 'Sistema CoomÜnity',
      isCurrentUser: false,
    },
    timestamp: '11:00',
    type: 'celebration',
    isRead: false,
  },
];

const mockSelectedConnection: Connection = {
  id: 'ana',
  name: 'Ana María Rodríguez',
  level: 'Guardiana de Sabiduría',
  trustScore: 4.9,
  isOnline: true,
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const theme = useTheme();
  const { sender, content, timestamp, type, ayniData } = message;

  const getMessageColor = () => {
    if (type === 'system' || type === 'celebration') return '#4CAF50';
    if (type === 'ayni_proposal') return '#E91E63';
    return sender.isCurrentUser ? '#2196F3' : '#757575';
  };

  const isCurrentUser = sender.isCurrentUser;
  const isSystem = type === 'system' || type === 'celebration';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSystem
          ? 'center'
          : isCurrentUser
            ? 'flex-end'
            : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: isSystem ? '80%' : '70%',
          display: 'flex',
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        {!isCurrentUser && !isSystem && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: getMessageColor(),
              fontSize: '0.8rem',
            }}
          >
            {sender.name.charAt(0)}
          </Avatar>
        )}

        <Paper
          sx={{
            p: type === 'ayni_proposal' ? 2 : 1.5,
            bgcolor: isSystem
              ? alpha('#4CAF50', 0.1)
              : isCurrentUser
                ? getMessageColor()
                : alpha('#757575', 0.1),
            color: isCurrentUser && !isSystem ? 'white' : 'text.primary',
            borderRadius: isSystem ? 3 : 2,
            border: isSystem
              ? `1px solid ${alpha('#4CAF50', 0.3)}`
              : type === 'ayni_proposal'
                ? `2px solid ${alpha('#E91E63', 0.3)}`
                : 'none',
            position: 'relative',
          }}
        >
          {/* Mensaje de propuesta Ayni */}
          {type === 'ayni_proposal' && ayniData && (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Handshake sx={{ color: '#E91E63' }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Propuesta de Intercambio Ayni
                </Typography>
              </Stack>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  💝 Ofrezco:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {ayniData.offer}
                </Typography>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  🙏 Necesito:
                </Typography>
                <Typography variant="body2">{ayniData.request}</Typography>
              </Box>
              <Chip
                label={
                  ayniData.status === 'pending'
                    ? 'Esperando respuesta'
                    : ayniData.status === 'accepted'
                      ? 'Aceptado'
                      : 'Completado'
                }
                color={
                  ayniData.status === 'pending'
                    ? 'warning'
                    : ayniData.status === 'accepted'
                      ? 'primary'
                      : 'success'
                }
                size="small"
              />
            </Box>
          )}

          {/* Mensaje de celebración */}
          {type === 'celebration' && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontWeight="bold">
                {content}
              </Typography>
            </Stack>
          )}

          {/* Mensaje normal */}
          {type === 'text' && (
            <Typography variant="body2">{content}</Typography>
          )}

          {/* Timestamp y estado */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <Typography
              variant="caption"
              sx={{
                color:
                  isCurrentUser && !isSystem
                    ? 'rgba(255,255,255,0.7)'
                    : 'text.secondary',
              }}
            >
              {timestamp}
            </Typography>
            {isCurrentUser && message.isRead && (
              <CheckCircle
                sx={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                }}
              />
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export const SocialChatArea: React.FC<SocialChatAreaProps> = ({
  connections,
  isLoading,
  isConnected,
}) => {
  const theme = useTheme();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(mockSelectedConnection);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConnection) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: {
        id: 'current',
        name: 'Tú',
        isCurrentUser: true,
      },
      timestamp: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'text',
      isRead: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAyniProposal = () => {
    // Abrir modal para crear propuesta Ayni
    console.log('🤝 Crear propuesta Ayni');
  };

  if (!selectedConnection) {
    return (
      <Card sx={{ height: '600px' }}>
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: alpha('#E91E63', 0.1),
                color: '#E91E63',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Handshake sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Selecciona una conexión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Elige una conexión para comenzar una conversación basada en Ayni
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header del chat */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha('#E91E63', 0.05),
          borderBottom: `1px solid ${alpha('#E91E63', 0.2)}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  bgcolor: '#E91E63',
                  width: 48,
                  height: 48,
                }}
              >
                {selectedConnection.name.charAt(0)}
              </Avatar>
              <Circle
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  fontSize: 14,
                  color: selectedConnection.isOnline ? '#4CAF50' : '#757575',
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                }}
              />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedConnection.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {selectedConnection.level}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    {selectedConnection.trustScore}
                  </Typography>
                </Stack>
                <Chip
                  label={
                    selectedConnection.isOnline ? 'En línea' : 'Desconectado'
                  }
                  color={selectedConnection.isOnline ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Proponer intercambio Ayni">
              <IconButton
                onClick={handleAyniProposal}
                sx={{
                  bgcolor: alpha('#E91E63', 0.1),
                  '&:hover': { bgcolor: alpha('#E91E63', 0.2) },
                }}
              >
                <Handshake />
              </IconButton>
            </Tooltip>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Área de mensajes */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          bgcolor: alpha('#E91E63', 0.01),
        }}
      >
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Cargando conversación...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No hay mensajes aún. ¡Inicia la conversación!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </Box>

      {/* Información de Ayni */}
      <Paper
        sx={{
          mx: 2,
          mb: 1,
          p: 1.5,
          bgcolor: alpha('#4CAF50', 0.05),
          border: `1px solid ${alpha('#4CAF50', 0.2)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Handshake sx={{ color: '#4CAF50' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Balance Ayni con{' '}
              {(selectedConnection.name || 'Usuario').split(' ')[0]}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3 intercambios completados • Relación equilibrada
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Favorite sx={{ color: '#E91E63', fontSize: 16 }} />
            <Typography variant="body2" fontWeight="bold" color="#4CAF50">
              85%
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Input de mensaje */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#E91E63', 0.1)}` }}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Escribe tu mensaje siguiendo el espíritu Ayni..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Stack direction="row">
            <IconButton
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              sx={{ color: 'text.secondary' }}
            >
              <EmojiEmotions />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <AttachFile />
            </IconButton>
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{
                bgcolor: '#E91E63',
                color: 'white',
                '&:hover': { bgcolor: '#C2185B' },
                '&:disabled': { bgcolor: 'action.disabled' },
              }}
            >
              <Send />
            </IconButton>
          </Stack>
        </Stack>

        {/* Sugerencias de respuesta Ayni */}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
          <Chip
            label="¿Puedo ayudarte con algo? 🤝"
            size="small"
            variant="outlined"
            onClick={() => setNewMessage('¿Puedo ayudarte con algo? 🤝')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="Proponer intercambio Ayni"
            size="small"
            variant="outlined"
            onClick={handleAyniProposal}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="¡Celebremos este logro! 🎉"
            size="small"
            variant="outlined"
            onClick={() => setNewMessage('¡Celebremos este logro! 🎉')}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      </Box>
    </Card>
  );
};
