import React, { useRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Stack,
  CircularProgress,
  Paper
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useMatchChat } from "@/hooks/useMatchChat";
import type { Message } from '../../../../types/marketplace';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  matchId: string;
  sellerName: string;
  currentUserId: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  open,
  onClose,
  matchId,
  sellerName,
  currentUserId
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage, sending } = useMatchChat(matchId, currentUserId);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input)
        .then(() => setInput(''))
        .catch(console.error);
    }
  };

  const isMyMessage = (message: Message) => message.senderId === currentUserId;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="chat-dialog-title"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: 'aside',
        role: 'dialog'
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="h2">Chat con {sellerName}</Typography>
        <IconButton
          aria-label="Cerrar chat"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2, bgcolor: 'grey.50', minHeight: 400 }}>
        <Stack spacing={2} aria-live="polite" aria-label="Mensajes del chat">
          {isLoading && <CircularProgress sx={{ alignSelf: 'center', my: 4 }} />}
          {error && <Typography variant="body2" color="error" align="center">Error al cargar mensajes.</Typography>}
          {!isLoading && !error && (!messages || messages.length === 0) && (
            <Typography variant="body2" color="text.secondary" align="center">Inicia la conversación.</Typography>
          )}
          {messages && messages.map((msg: Message) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: isMyMessage(msg) ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  bgcolor: isMyMessage(msg) ? 'primary.main' : 'background.paper',
                  color: isMyMessage(msg) ? 'primary.contrastText' : 'text.primary',
                  borderRadius: isMyMessage(msg)
                    ? '20px 20px 5px 20px'
                    : '20px 20px 20px 5px',
                  maxWidth: '80%',
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7, mt: 0.5 }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1, bgcolor: 'grey.50' }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          inputProps={{ 'aria-label': 'Escribir mensaje', autoComplete: 'off' }}
          disabled={sending || isLoading}
        />
        <Button
          onClick={handleSend}
          variant="contained"
          color="primary"
          disabled={sending || isLoading || !input.trim()}
          aria-label="Enviar mensaje"
          sx={{ ml: 1 }}
        >
          {sending ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;
