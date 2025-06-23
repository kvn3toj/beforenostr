import React from 'react';
import { motion } from 'framer-motion';
import { Box, TextField, Button, Avatar, Typography } from '@mui/material';
import { ChatBubble } from '@mui/icons-material';

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface StudyRoomChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const StudyRoomChat: React.FC<StudyRoomChatProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <Box sx={{
      background: 'rgba(5, 15, 30, 0.8)',
      backdropFilter: 'blur(10px)',
      borderLeft: '1px solid var(--uplay-blue-800, #1e40af)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: { xs: '0 0 16px 16px', md: '0 16px 16px 0' }
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--uplay-blue-800, #1e40af)' }}>
        <ChatBubble sx={{ color: 'var(--uplay-blue-400, #60a5fa)' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
          Chat de la Sala
        </Typography>
      </Box>

      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
        <motion.div layout>
          {messages.slice().reverse().map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{ marginBottom: '16px' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar src={message.avatar} />
                <Box sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  p: 1.5,
                  borderRadius: '12px',
                  borderTopLeftRadius: '0px'
                }}>
                  <Typography variant="body2" sx={{ color: 'white' }}>{message.text}</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--secondary-text, #9ca3af)', display: 'block', textAlign: 'right', mt: 0.5 }}>
                    {message.user} - {message.time}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid var(--uplay-blue-800, #1e40af)', display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--uplay-blue-700, #1d4ed8)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--uplay-blue-500, #3b82f6)',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{
            borderRadius: '12px',
            bgcolor: 'var(--uplay-blue-600, #2563eb)',
            '&:hover': { bgcolor: 'var(--uplay-blue-500, #3b82f6)' }
          }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default StudyRoomChat;
