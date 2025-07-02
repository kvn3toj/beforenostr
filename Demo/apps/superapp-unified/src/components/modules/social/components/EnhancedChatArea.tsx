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
  CardContent,
  useTheme,
  alpha,
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
  Error as ErrorIcon,
  CheckCircle,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Message } from '../../../../types/marketplace';

const formatSafeDate = (dateString?: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return 'Fecha no válida';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida detectada en chat: ${dateString}`);
      return 'Fecha inválida';
    }
    return date.toLocaleDateString('es-ES', options || {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
  const theme = useTheme();
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

  const { data: chat, isLoading: chatLoading } = useQuery<Chat>({
    queryKey: ['chat', chatId],
    queryFn: () => apiService.get(`/chats/${chatId}`),
    enabled: !!chatId,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['messages', chatId],
    queryFn: () => apiService.get(`/chats/${chatId}/messages`),
    enabled: !!chatId,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      content: string;
      type: string;
      replyToId?: string;
      attachments?: any[];
    }) => apiService.post(`/chats/${chatId}/messages`, messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setMessageText('');
      setReplyingTo(null);
      setSelectedFile(null);
      scrollToBottom();
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) =>
      apiService.put(`/messages/${messageId}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setEditingMessage(null);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => apiService.delete(`/messages/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const reactToMessageMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      apiService.post(`/messages/${messageId}/reactions`, { emoji }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const markAsReadMutation = useMutation({
      mutationFn: async () => apiService.post(`/chats/${chatId}/mark-read`),
      onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['chats']});
      }
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() && !selectedFile) return;
    const messageData: any = {
      content: messageText.trim(),
      type: selectedFile ? 'file' : 'text',
      replyToId: replyingTo?.id,
    };
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const uploadResponse = await apiService.post('/upload', formData, {
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.lengthComputable) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          },
        } as any);
        messageData.attachments = [(uploadResponse as any).data];
      } catch (error) {
        console.error('File upload failed:', error);
        return;
      }
    }
    sendMessageMutation.mutate(messageData);
  }, [messageText, selectedFile, replyingTo, sendMessageMutation]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
      markAsReadMutation.mutate();
  }, [chatId, messages, markAsReadMutation]);

  const renderMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
      case 'sent':
        return <CheckIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
      case 'delivered':
        return <CheckCircle sx={{ fontSize: 16, color: 'text.secondary' }} />;
      case 'read':
        return <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'failed':
        return <ErrorIcon sx={{ fontSize: 16, color: 'error' }} />;
      default:
        return null;
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isSentByMe = message.sender.id === user?.id;
    const prevMessage = messages[index - 1];
    const showDateHeader = !prevMessage || new Date(message.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString();

    return (
      <Box key={message.id}>
        {showDateHeader && (
           <Typography align="center" variant="caption" color="text.secondary" sx={{ display: 'block', my: 2 }}>
             {formatSafeDate(message.createdAt)}
           </Typography>
        )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSentByMe ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          mb: 2,
          gap: 1,
        }}
      >
        <Tooltip title={message.sender.name}>
          <Avatar src={message.sender.avatar} sx={{ width: 40, height: 40 }} />
        </Tooltip>
        <Card
          sx={{
            maxWidth: '70%',
            borderRadius: isSentByMe ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
            bgcolor: isSentByMe ? 'primary.main' : 'background.paper',
            color: isSentByMe ? 'primary.contrastText' : 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            p: 1.5,
          }}
        >
          {message.replyTo && (
            <Box
              sx={{
                p: 1,
                bgcolor: alpha(isSentByMe ? '#fff' : theme.palette.primary.main, 0.1),
                borderRadius: '12px',
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                mb: 1,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                Respondiendo a {message.replyTo.sender.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {message.replyTo.content}
              </Typography>
            </Box>
          )}
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1, gap: 0.5 }}>
            {message.isEdited && (
              <Typography variant="caption" sx={{ color: isSentByMe ? 'rgba(255,255,255,0.7)' : 'text.disabled', fontStyle: 'italic', mr: 'auto' }}>
                Editado
              </Typography>
            )}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {Object.keys(message.reactions).map((emoji) => (
                  <Chip
                    key={emoji}
                    label={`${emoji} ${message.reactions?.[emoji]?.length ?? 0}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  />
                ))}
              </Box>
            )}
            <Typography variant="caption" sx={{ color: isSentByMe ? 'rgba(255,255,255,0.7)' : 'text.disabled' }}>
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </Typography>
            {isSentByMe && renderMessageStatus(message.status)}
          </Box>
        </Card>
        <Box>
          <IconButton size="small" onClick={(e) => setMessageMenuAnchor({ element: e.currentTarget, message })}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>
      </Box>
    );
  };

  if (chatLoading) return <LinearProgress />;
  if (!chat) return <Alert severity="error">No se pudo cargar el chat. Inténtalo de nuevo.</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
       {/* Chat Header */}
      <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, zIndex: 10 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: chat.participants.find(p => p.id !== user?.id)?.isOnline ? '#44b700' : 'grey.400',
              color: '#44b700',
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            },
          }}
        >
          <Avatar src={chat.participants.find(p => p.id !== user?.id)?.avatar} />
        </Badge>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{chat.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {chat.type === 'direct'
              ? (chat.participants.find(p => p.id !== user?.id)?.isOnline ? 'En línea' : `Últ. vez ${formatDistanceToNow(new Date(chat.participants.find(p => p.id !== user?.id)?.lastSeen || Date.now()), { locale: es, addSuffix: true })}`)
              : `${chat.participants.length} miembros`}
          </Typography>
        </Box>
        <IconButton><VideoIcon /></IconButton>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Paper>

       {/* Messages Area */}
      <Box
        onScroll={handleScroll}
        sx={{ flex: 1, overflowY: 'auto', p: { xs: 1, md: 3 } }}
      >
        {messagesLoading && <LinearProgress />}
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </Box>

        {/* Scroll Down FAB */}
       <Zoom in={showScrollDown}>
        <Fab
          color="secondary"
          size="small"
          onClick={scrollToBottom}
          sx={{ position: 'absolute', bottom: 100, right: 24 }}
        >
          <ScrollDownIcon />
        </Fab>
      </Zoom>

       {/* Message Input Area */}
      <Paper elevation={3} sx={{ p: 1, pb: 2, zIndex: 10 }}>
         <Collapse in={!!replyingTo}>
          <Box sx={{ p: 1, mb: 1, bgcolor: 'grey.200', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="primary" fontWeight="bold">
              Respondiendo a {replyingTo?.sender.name}
            </Typography>
            <IconButton size="small" onClick={() => setReplyingTo(null)}><CloseIcon fontSize="small"/></IconButton>
            </Box>
            <Typography variant="body2" noWrap>{replyingTo?.content}</Typography>
          </Box>
        </Collapse>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}><EmojiIcon /></IconButton>
          <IconButton onClick={() => fileInputRef.current?.click()}><AttachIcon /></IconButton>
          <input type="file" ref={fileInputRef} hidden onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />

          <TextField
            fullWidth
            multiline
            maxRows={5}
            variant="outlined"
            placeholder="Escribe un mensaje..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                '& fieldset': {
                  borderColor: 'grey.300',
                },
              },
            }}
          />
          <IconButton color="primary" onClick={handleSendMessage} disabled={sendMessageMutation.isPending}>
            <SendIcon />
          </IconButton>
        </Box>
         {showEmojiPicker && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {EMOJI_LIST.map(emoji => (
              <Button key={emoji} onClick={() => setMessageText(prev => prev + emoji)}>{emoji}</Button>
            ))}
          </Box>
        )}
      </Paper>

      {/* Menú de Mensaje */}
      <Menu
        anchorEl={messageMenuAnchor?.element}
        open={Boolean(messageMenuAnchor)}
        onClose={() => setMessageMenuAnchor(null)}
      >
        <MenuItem onClick={() => { setReplyingTo(messageMenuAnchor!.message); setMessageMenuAnchor(null); }}>
          <ReplyIcon sx={{ mr: 1 }} /> Responder
        </MenuItem>
        <MenuItem onClick={() => { reactToMessageMutation.mutate({ messageId: messageMenuAnchor!.message.id, emoji: '❤️' }); setMessageMenuAnchor(null); }}>
          <LikeIcon sx={{ mr: 1 }} /> Reaccionar
        </MenuItem>
        {messageMenuAnchor?.message.sender.id === user?.id && (
          <Box>
            <MenuItem onClick={() => { setEditingMessage(messageMenuAnchor!.message.id); setMessageText(messageMenuAnchor!.message.content); setMessageMenuAnchor(null); }}>
              <EditIcon sx={{ mr: 1 }} /> Editar
            </MenuItem>
            <MenuItem onClick={() => { deleteMessageMutation.mutate(messageMenuAnchor!.message.id); setMessageMenuAnchor(null); }}>
              <DeleteIcon sx={{ mr: 1 }} /> Eliminar
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default EnhancedChatArea;
