import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
} from '@mui/material';
import { AddCircleOutline, VideoCall } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import PremiumStudyRoomCard from './study-rooms/PremiumStudyRoomCard';
import StudyRoomChat from './study-rooms/StudyRoomChat';

// Interfaces
interface StudyRoom {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  isPremium: boolean;
  imageUrl: string;
  participantDetails: { id: string, name: string, avatar: string }[];
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

const UPlayStudyRooms: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [filter, setFilter] = useState('all');
  const [messages, setMessages] = useState<Message[]>(
    selectedRoom ? selectedRoom.id === '1' ? [
      { id: '1', user: 'Einstein', avatar: '/assets/avatares/1.png', text: '¡Hola a todos! ¿Listos para debatir sobre la relatividad?', time: '10:00 AM' },
      { id: '2', user: 'Marie Curie', avatar: '/assets/avatares/2.png', text: 'Siempre lista para un poco de física cuántica.', time: '10:05 AM' },
    ] : [] : []
  );

  const studyRooms: StudyRoom[] = [
    { id: '1', title: 'Física Cuántica Avanzada', author: 'Albert E.', description: 'Debate sobre dualidad onda-partícula.', tags: ['Ciencia', 'Avanzado'], participants: 12, maxParticipants: 15, isLive: true, isPremium: true, imageUrl: 'https://picsum.photos/seed/physics/800/600', participantDetails: [{id: 'p1', name: 'Einstein', avatar: '/assets/avatares/1.png'}] },
    { id: '2', title: 'Filosofía Existencialista', author: 'Jean-Paul S.', description: 'Análisis de Sartre y Camus.', tags: ['Filosofía'], participants: 8, maxParticipants: 20, isLive: false, isPremium: false, imageUrl: 'https://picsum.photos/seed/philosophy/800/600', participantDetails: [] },
    { id: '3', title: 'React Hooks en Profundidad', author: 'Dan A.', description: 'Taller práctico con ejemplos reales.', tags: ['Programación', 'React'], participants: 25, maxParticipants: 25, isLive: true, isPremium: true, imageUrl: 'https://picsum.photos/seed/react/800/600', participantDetails: [] },
  ];

  const allTags = ['all', ...Array.from(new Set(studyRooms.flatMap(room => room.tags)))];
  const filteredRooms = studyRooms.filter(room => filter === 'all' || room.tags.includes(filter));

  const handleOpenDialog = (room: StudyRoom) => {
    setSelectedRoom(room);
    // Reset messages or load actual messages based on room.id
    if (room.id === '1') {
      setMessages([
        { id: '1', user: 'Einstein', avatar: '/assets/avatares/1.png', text: '¡Hola a todos! ¿Listos para debatir sobre la relatividad?', time: '10:00 AM' },
        { id: '2', user: 'Marie Curie', avatar: '/assets/avatares/2.png', text: 'Siempre lista para un poco de física cuántica.', time: '10:05 AM' },
      ]);
    } else {
      setMessages([]);
    }
  };
  const handleCloseDialog = () => setSelectedRoom(null);

  const handleSendMessage = (text: string) => {
    if (selectedRoom) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: selectedRoom.participantDetails[0]?.name || "Anónimo", // Use a real user name or mock
        avatar: selectedRoom.participantDetails[0]?.avatar || "", // Use a real user avatar or mock
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, position: 'relative' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--primary-text)', mb: 1 }}>
          Salas de Estudio
        </Typography>
        <Typography sx={{ color: 'var(--secondary-text)' }}>
          Conecta, colabora y aprende en comunidad.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {allTags.map(tag => (
          <Chip
            key={tag}
            label={tag === 'all' ? 'Todos' : tag}
            clickable
            onClick={() => setFilter(tag)}
            sx={{
              background: filter === tag ? 'var(--uplay-blue-600, #2563eb)' : 'rgba(255, 255, 255, 0.1)',
              color: filter === tag ? '#fff' : 'var(--secondary-text, #ccc)',
              transition: 'all 0.3s',
              '&:hover': {
                background: filter === tag ? 'var(--uplay-blue-500, #3b82f6)' : 'rgba(255, 255, 255, 0.2)',
              }
            }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleOpenDialog(room)}
                style={{ height: '100%', cursor: 'pointer' }}
              >
                <PremiumStudyRoomCard
                  title={room.title}
                  author={room.author}
                  participants={room.participants}
                  maxParticipants={room.maxParticipants}
                  category={room.tags[0]}
                  isLive={room.isLive}
                  imageUrl={room.imageUrl}
                />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      <Dialog
        open={!!selectedRoom}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={false}
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none', overflow: 'visible' } }}
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <Fade in={!!selectedRoom}>
          <Box sx={{ width: isMobile ? '95vw' : '80vw', maxWidth: '1200px', height: isMobile ? '80vh' : '70vh' }}>
            <Grid container sx={{ height: '100%' }}>

              <Grid item xs={12} md={4} sx={{
                background: 'rgba(10, 25, 41, 0.7)',
                border: '1px solid var(--uplay-blue-700, #1d4ed8)',
                borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px'},
                p: 3,
                display: 'flex',
                flexDirection: 'column'
              }}>
                 {selectedRoom && <>
                   <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--primary-text)' }}>{selectedRoom.title}</Typography>
                   <Typography sx={{ mb: 3, color: 'var(--secondary-text)' }}>{selectedRoom.description}</Typography>
                   <Typography variant="body2" sx={{fontWeight: 'bold', color: 'var(--primary-text)'}}>Participantes:</Typography>
                   <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, overflowY: 'auto', maxHeight: '200px'}}>
                     {selectedRoom.participantDetails.map(p => (
                       <Chip key={p.id} avatar={<Avatar src={p.avatar} />} label={p.name} sx={{background: 'rgba(255,255,255,0.1)', color: 'var(--primary-text)'}}/>
                     ))}
                   </Box>
                   <Box sx={{flexGrow: 1}} />
                   <Button variant="contained" color="error" onClick={handleCloseDialog} fullWidth>
                    Salir de la Sala
                  </Button>
                 </>}
              </Grid>

              <Grid item xs={12} md={8} sx={{
                  height: '100%',
                  borderTop: {xs: 'none', md: '1px solid var(--uplay-blue-700, #1d4ed8)'},
                  borderRight: '1px solid var(--uplay-blue-700, #1d4ed8)',
                  borderBottom: '1px solid var(--uplay-blue-700, #1d4ed8)',
                  borderRadius: {xs: '0 0 16px 16px', md: '0 16px 16px 0'}
                }}>
                {selectedRoom && (
                  <StudyRoomChat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                )}
              </Grid>

            </Grid>
          </Box>
        </Fade>
      </Dialog>
    </Box>
  );
};

export default UPlayStudyRooms;
