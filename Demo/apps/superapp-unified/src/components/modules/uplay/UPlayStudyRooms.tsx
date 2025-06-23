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
import { Groups, FilterList, AddCircleOutline, VideoCall } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { PremiumStudyRoomCard } from './PremiumStudyRoomCard';
import StudyRoomChat from './StudyRoomChat';

// Interfaces
interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface StudyRoom {
  id: string;
  title: string;
  description: string;
  tags: string[];
  participantCount: number;
  participants: Participant[];
  isLive: boolean;
  isPremium: boolean;
}

const UPlayStudyRooms: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado unificado
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [filter, setFilter] = useState('all');

  // Datos mock (pueden venir de una API)
  const studyRooms: StudyRoom[] = [
    { id: '1', title: 'Física Cuántica Avanzada', description: 'Debate sobre dualidad onda-partícula.', tags: ['Ciencia', 'Avanzado'], participantCount: 12, participants: [{id: 'p1', name: 'Einstein', avatar: '/assets/avatares/1.png'}], isLive: true, isPremium: true },
    { id: '2', title: 'Filosofía Existencialista', description: 'Análisis de Sartre y Camus.', tags: ['Filosofía'], participantCount: 8, participants: [], isLive: false, isPremium: false },
    { id: '3', title: 'React Hooks en Profundidad', description: 'Taller práctico con ejemplos reales.', tags: ['Programación', 'React'], participantCount: 25, participants: [], isLive: true, isPremium: true },
  ];

  const allTags = ['all', ...Array.from(new Set(studyRooms.flatMap(room => room.tags)))];

  const filteredRooms = studyRooms.filter(room => filter === 'all' || room.tags.includes(filter));

  // Manejadores de estado del diálogo
  const handleOpenDialog = (room: StudyRoom) => setSelectedRoom(room);
  const handleCloseDialog = () => setSelectedRoom(null);

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
                <PremiumStudyRoomCard {...room} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* DIÁLOGO ÚNICO Y CORRECTO PARA UNIRSE A LA SALA CON CHAT INTEGRADO */}
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

              {/* Panel de Información de la Sala */}
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
                     {selectedRoom.participants.map(p => (
                       <Chip key={p.id} avatar={<Avatar src={p.avatar} />} label={p.name} sx={{background: 'rgba(255,255,255,0.1)', color: 'var(--primary-text)'}}/>
                     ))}
                   </Box>
                   <Box sx={{flexGrow: 1}} />
                   <Button variant="contained" color="error" onClick={handleCloseDialog} fullWidth>
                    Salir de la Sala
                  </Button>
                 </>}
              </Grid>

              {/* Panel del Chat */}
              <Grid item xs={12} md={8} sx={{
                  height: '100%',
                  borderTop: {xs: 'none', md: '1px solid var(--uplay-blue-700, #1d4ed8)'},
                  borderRight: '1px solid var(--uplay-blue-700, #1d4ed8)',
                  borderBottom: '1px solid var(--uplay-blue-700, #1d4ed8)',
                  borderRadius: {xs: '0 0 16px 16px', md: '0 16px 16px 0'}
                }}>
                <StudyRoomChat />
              </Grid>

            </Grid>
          </Box>
        </Fade>
      </Dialog>
    </Box>
  );
};

export default UPlayStudyRooms;
