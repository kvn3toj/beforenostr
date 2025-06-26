import React, { useRef, useEffect } from 'react';
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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useMatchChat } from "@/hooks/useMatchChat";
import type { Message } from '../../../../types/marketplace';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  matchId: string;
  sellerName: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  open,
  onClose,
  matchId,
  sellerName,
}) => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages = [], isLoading, error, sendMessage, sending } = useMatchChat(matchId);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="chat-dialog-title"
      fullWidth
      maxWidth="sm"
      role="dialog"
    >
      <DialogTitle id="chat-dialog-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Chat con {sellerName}</Typography>
        <IconButton aria-label="Cerrar chat" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 300, maxHeight: 400, overflowY: 'auto' }}>
        <Stack spacing={2} aria-live="polite" aria-label="Mensajes del chat">
          {isLoading ? (
            <Typography variant="body2" color="text.secondary">Cargando mensajes...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">Error al cargar mensajes.</Typography>
          ) : messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No hay mensajes aún.</Typography>
          ) : (
            messages.map((msg: any) => (
              <Box key={msg.id} sx={{ alignSelf: msg.sender === 'yo' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <Typography variant="caption" color="text.secondary">{msg.sender}</Typography>
                <Box sx={{
                  bgcolor: msg.sender === 'yo' ? 'primary.light' : 'grey.100',
                  color: 'text.primary',
                  borderRadius: 2,
                  p: 1.5,
                  mt: 0.5,
                  mb: 0.5,
                  boxShadow: 1,
                }}>
                  <Typography variant="body2">{msg.content}</Typography>
                </Box>
                <Typography variant="caption" color="text.disabled">{msg.timestamp || msg.createdAt}</Typography>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          inputProps={{
            'aria-label': 'Escribir mensaje',
            autoComplete: 'off',
          }}
          disabled={sending || isLoading}
        />
        <Button
          onClick={handleSend}
          variant="contained"
          color="primary"
          disabled={sending || isLoading || !input.trim()}
          aria-label="Enviar mensaje"
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;
