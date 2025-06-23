import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    user: { id: '1', name: 'Elena', avatar: '/assets/avatares/1.png' },
    text: '¡Hola a todos! ¿Listos para la sesión de hoy?',
    timestamp: '10:00 AM',
  },
  {
    id: '2',
    user: { id: '2', name: 'Carlos', avatar: '/assets/avatares/2.png' },
    text: '¡Claro que sí! Tengo una pregunta sobre el último video.',
    timestamp: '10:01 AM',
  },
  {
    id: '3',
    user: { id: 'user', name: 'Tú', avatar: '/assets/avatares/3.png' },
    text: 'Hola equipo, aquí estoy. Adelante con la pregunta, Carlos.',
    timestamp: '10:02 AM',
  },
];

const StudyRoomChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: String(Date.now()),
        user: { id: 'user', name: 'Tú', avatar: '/assets/avatares/3.png' },
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, msg]);
      setNewMessage('');
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'rgba(10, 25, 41, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--uplay-blue-700, #1d4ed8)',
        borderRadius: 2
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid var(--uplay-blue-700, #1d4ed8)' }}>
        <Typography variant="h6" sx={{color: 'var(--primary-text)'}}>Chat de la Sala</Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={msg.id} sx={{
             flexDirection: msg.user.id === 'user' ? 'row-reverse' : 'row',
             mb: 1
          }}>
            <ListItemAvatar sx={{
              justifyContent: msg.user.id === 'user' ? 'flex-end' : 'flex-start',
              mr: msg.user.id === 'user' ? 0 : 1.5,
              ml: msg.user.id === 'user' ? 1.5 : 0,
            }}>
              <Avatar alt={msg.user.name} src={msg.user.avatar} />
            </ListItemAvatar>
            <Box sx={{
              background: msg.user.id === 'user' ? 'var(--uplay-blue-600, #2563eb)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              p: '10px 15px',
              maxWidth: '75%',
            }}>
                <Typography variant="caption" sx={{ color: msg.user.id === 'user' ? 'white' : 'var(--secondary-text)', fontWeight: 'bold' }}>
                  {msg.user.name}
                </Typography>
              <ListItemText
                primary={<Typography sx={{color: 'var(--primary-text)'}}>{msg.text}</Typography>}
                secondary={<Typography variant="caption" sx={{ color: msg.user.id === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--secondary-text)' }}>{msg.timestamp}</Typography>}
              />
            </Box>
          </ListItem>
        ))}
      </List>
      <Divider sx={{borderColor: 'var(--uplay-blue-700, #1d4ed8)'}} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          sx={{
            mr: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              background: 'rgba(0,0,0,0.2)',
              '& fieldset': {
                borderColor: 'var(--uplay-blue-800, #1e40af)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--uplay-blue-600, #2563eb)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--uplay-blue-500, #3b82f6)',
              },
            },
            '& .MuiInputBase-input': {
              color: 'var(--primary-text)',
            }
          }}
        />
        <IconButton color="primary" onClick={handleSendMessage} sx={{
          background: 'var(--uplay-blue-600, #2563eb)',
          color: '#fff',
          '&:hover': {
            background: 'var(--uplay-blue-500, #3b82f6)',
          }
        }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default StudyRoomChat;
