import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Fab,
  Zoom,
  Collapse,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
  Image as ImageIcon,
  Mic as MicIcon,
  VideoCall as VideoIcon,
  MoreVert as MoreIcon,
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  KeyboardArrowDown as ScrollDownIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  CheckCircle as DeliveredIcon,
  Schedule as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Message } from '../../../../types/marketplace';

// 🔧 SOLUCIÓN: Función segura para formatear fechas
const formatSafeDate = (dateString?: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return 'Fecha no válida';

  try {
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida detectada en chat: ${dateString}`);
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-ES', options || {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`❌ Error al formatear fecha en chat: ${dateString}`, error);
    return 'Error en fecha';
  }
};

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'community';
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping: string[];
}

interface EnhancedChatAreaProps {
  chatId: string;
  onClose?: () => void;
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

const EnhancedChatArea: React.FC<EnhancedChatAreaProps> = ({ chatId, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageText, setMessageText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState<{
    element: HTMLElement;
    message: Message;
  } | null>(null);

  // Fetch chat details
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => apiService.get(`/chats/${chatId}`),
    enabled: !!chatId,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => apiService.get(`/chats/${chatId}/messages`),
    enabled: !!chatId,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      content: string;
      type: string;
      replyToId?: string;
      attachments?: any[];
    }) => {
      return apiService.post(`/chats/${chatId}/messages`, messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setMessageText('');
      setReplyingTo(null);
      setSelectedFile(null);
      scrollToBottom();
    },
  });

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      return apiService.put(`/messages/${messageId}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setEditingMessage(null);
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return apiService.delete(`/messages/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  // React to message mutation
  const reactToMessageMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      return apiService.post(`/messages/${messageId}/reactions`, { emoji });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiService.post(`/chats/${chatId}/mark-read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  }, []);

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() && !selectedFile) return;

    const messageData: any = {
      content: messageText.trim(),
      type: selectedFile ? 'file' : 'text',
      replyToId: replyingTo?.id,
    };

    if (selectedFile) {
      // Handle file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const uploadResponse = await apiService.post('/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(progress);
          },
        });

        messageData.attachments = [uploadResponse.data];
      } catch (error) {
        console.error('File upload failed:', error);
        return;
      }
    }

    sendMessageMutation.mutate(messageData);
  }, [messageText, selectedFile, replyingTo, sendMessageMutation]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  // Handle emoji reaction
  const handleEmojiReaction = useCallback((messageId: string, emoji: string) => {
    reactToMessageMutation.mutate({ messageId, emoji });
  }, [reactToMessageMutation]);

  // Handle message edit
  const handleEditMessage = useCallback((messageId: string, newContent: string) => {
    editMessageMutation.mutate({ messageId, content: newContent });
  }, [editMessageMutation]);

  // Format timestamp
  const formatTimestamp = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn(`⚠️ Fecha inválida detectada en chat: ${timestamp}`);
        return 'Fecha inválida';
      }

      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      console.error(`❌ Error al formatear timestamp en chat: ${timestamp}`, error);
      return 'Hace un momento';
    }
  }, []);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message: Message) => {
      try {
        const date = new Date(message.createdAt);
        const dateString = isNaN(date.getTime()) ? 'Fecha inválida' : date.toDateString();

        if (!groups[dateString]) {
          groups[dateString] = [];
        }
        groups[dateString].push(message);
      } catch (error) {
        console.error(`❌ Error al agrupar mensaje por fecha: ${message.createdAt}`, error);
        if (!groups['Fecha inválida']) {
          groups['Fecha inválida'] = [];
        }
        groups['Fecha inválida'].push(message);
      }
    });

    return groups;
  }, [messages]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (chatId && user) {
      markAsReadMutation.mutate();
    }
  }, [chatId, user, markAsReadMutation]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, scrollToBottom]);

  // Render message status icon
  const renderMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <PendingIcon fontSize="small" color="action" />;
      case 'sent':
        return <CheckIcon fontSize="small" color="action" />;
      case 'delivered':
        return <DeliveredIcon fontSize="small" color="action" />;
      case 'read':
        return <DeliveredIcon fontSize="small" color="primary" />;
      case 'failed':
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  // Render message bubble
  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === user?.id;
    const showAvatar = !isOwnMessage;

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          flexDirection: isOwnMessage ? 'row-reverse' : 'row',
          mb: 1,
          alignItems: 'flex-end',
        }}
      >
        {showAvatar && (
          <Avatar
            src={message.sender.avatar}
            alt={message.sender.name}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
        )}

        <Box sx={{ maxWidth: '70%', minWidth: '120px' }}>
          {/* Reply indicator */}
          {message.replyTo && (
            <Paper
              sx={{
                p: 1,
                mb: 0.5,
                bgcolor: 'action.hover',
                borderLeft: 3,
                borderColor: 'primary.main',
              }}
            >
              <Typography variant="caption" color="primary" fontWeight="bold">
                Respondiendo a {message.replyTo.senderName}
              </Typography>
              <Typography variant="caption" display="block" noWrap>
                {message.replyTo.content}
              </Typography>
            </Paper>
          )}

          {/* Message bubble */}
          <Paper
            sx={{
              p: 1.5,
              bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
              color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              position: 'relative',
              '&:hover .message-actions': {
                opacity: 1,
              },
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setMessageMenuAnchor({ element: e.currentTarget, message });
            }}
          >
            {/* Sender name for group chats */}
            {!isOwnMessage && chat?.type === 'group' && (
              <Typography variant="caption" color="primary" fontWeight="bold" display="block">
                {message.senderName}
              </Typography>
            )}

            {/* Message content */}
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {message.content}
            </Typography>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {message.attachments.map((attachment) => (
                  <Chip
                    key={attachment.id}
                    label={attachment.name}
                    size="small"
                    clickable
                    onClick={() => window.open(attachment.url, '_blank')}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {message.reactions.map((reaction, index) => (
                  <Chip
                    key={index}
                    label={`${reaction.emoji} ${reaction.count}`}
                    size="small"
                    variant={reaction.users.includes(user?.id || '') ? 'filled' : 'outlined'}
                    onClick={() => handleEmojiReaction(message.id, reaction.emoji)}
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                ))}
              </Box>
            )}

            {/* Message metadata */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {formatTimestamp(message.createdAt)}
                {message.isEdited && ' (editado)'}
              </Typography>

              {isOwnMessage && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {renderMessageStatus(message.status)}
                </Box>
              )}
            </Box>

            {/* Quick actions */}
            <Box
              className="message-actions"
              sx={{
                position: 'absolute',
                top: -20,
                right: isOwnMessage ? 'auto' : 8,
                left: isOwnMessage ? 8 : 'auto',
                display: 'flex',
                gap: 0.5,
                opacity: 0,
                transition: 'opacity 0.2s',
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
                p: 0.5,
              }}
            >
              {EMOJI_LIST.slice(0, 3).map((emoji) => (
                <IconButton
                  key={emoji}
                  size="small"
                  onClick={() => handleEmojiReaction(message.id, emoji)}
                  sx={{ fontSize: '0.8rem', p: 0.25 }}
                >
                  {emoji}
                </IconButton>
              ))}
              <IconButton
                size="small"
                onClick={() => setReplyingTo(message)}
              >
                <ReplyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  if (chatLoading || messagesLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cargando chat...
        </Typography>
      </Box>
    );
  }

  if (!chat) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Chat no encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={chat.type === 'direct' ? chat.participants[0]?.avatar : undefined}
              sx={{ width: 40, height: 40 }}
            >
              {chat.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {chat.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {chat.type === 'direct'
                  ? chat.participants[0]?.isOnline
                    ? 'En línea'
                    : `Visto ${formatTimestamp(chat.participants[0]?.lastSeen || '')}`
                  : `${chat.participants.length} participantes`
                }
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton>
              <VideoIcon />
            </IconButton>
            <IconButton>
              <MoreIcon />
            </IconButton>
            {onClose && (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          position: 'relative',
        }}
        onScroll={handleScroll}
      >
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <Box key={date}>
            {/* Date separator */}
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Chip
                label={formatSafeDate(date, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                size="small"
                variant="outlined"
              />
            </Box>

            {/* Messages for this date */}
            {dayMessages.map(renderMessage)}
          </Box>
        ))}

        {/* Typing indicator */}
        {chat.isTyping.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
            <Avatar sx={{ width: 24, height: 24 }} />
            <Typography variant="caption" color="text.secondary">
              {chat.isTyping.join(', ')} está{chat.isTyping.length > 1 ? 'n' : ''} escribiendo...
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Reply indicator */}
      <Collapse in={!!replyingTo}>
        <Paper sx={{ p: 1, m: 1, bgcolor: 'action.hover' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="primary" fontWeight="bold">
                Respondiendo a {replyingTo?.senderName}
              </Typography>
              <Typography variant="caption" display="block" noWrap>
                {replyingTo?.content}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setReplyingTo(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      {/* File upload progress */}
      <Collapse in={uploadProgress > 0 && uploadProgress < 100}>
        <Box sx={{ p: 1 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary">
            Subiendo archivo... {uploadProgress}%
          </Typography>
        </Box>
      </Collapse>

      {/* Selected file indicator */}
      <Collapse in={!!selectedFile}>
        <Paper sx={{ p: 1, m: 1, bgcolor: 'action.hover' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachIcon fontSize="small" />
              <Typography variant="caption">
                {selectedFile?.name}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setSelectedFile(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      {/* Message Input */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            color="primary"
          >
            <AttachIcon />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Escribe un mensaje..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <IconButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            color="primary"
          >
            <EmojiIcon />
          </IconButton>

          <IconButton
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedFile}
            color="primary"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'action.disabled' },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Emoji picker */}
        <Collapse in={showEmojiPicker}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
            {EMOJI_LIST.map((emoji) => (
              <IconButton
                key={emoji}
                size="small"
                onClick={() => {
                  setMessageText(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
        </Collapse>
      </Paper>

      {/* Scroll to bottom FAB */}
      <Zoom in={showScrollDown}>
        <Fab
          size="small"
          color="primary"
          onClick={scrollToBottom}
          sx={{
            position: 'absolute',
            bottom: 80,
            right: 16,
            zIndex: 1000,
          }}
        >
          <ScrollDownIcon />
        </Fab>
      </Zoom>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />

      {/* Message context menu */}
      <Menu
        anchorEl={messageMenuAnchor?.element}
        open={!!messageMenuAnchor}
        onClose={() => setMessageMenuAnchor(null)}
      >
        <MenuItem onClick={() => setReplyingTo(messageMenuAnchor!.message)}>
          <ReplyIcon sx={{ mr: 1 }} />
          Responder
        </MenuItem>
        {messageMenuAnchor?.message.senderId === user?.id && (
          <>
            <MenuItem onClick={() => setEditingMessage(messageMenuAnchor!.message.id)}>
              <EditIcon sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <MenuItem
              onClick={() => deleteMessageMutation.mutate(messageMenuAnchor!.message.id)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Eliminar
            </MenuItem>
          </>
        )}
        <Divider />
        {EMOJI_LIST.map((emoji) => (
          <MenuItem
            key={emoji}
            onClick={() => {
              handleEmojiReaction(messageMenuAnchor!.message.id, emoji);
              setMessageMenuAnchor(null);
            }}
          >
            {emoji}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default EnhancedChatArea;
