// @ts-nocheck
import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, LinearProgress } from '@mui/material';
import { EmojiEvents, Lock, CheckCircle } from '@mui/icons-material';

type AchievementStatus = 'completed' | 'in-progress' | 'locked';

interface Achievement {
  id: string;
  title: string;
  description: string;
  status: AchievementStatus;
  progress?: number;
  icon?: React.ReactNode;
}

const mockAchievements: Achievement[] = [
  { id: '1', title: 'Pionero de CoomÜnity', description: 'Completa tu primer video interactivo.', status: 'completed', icon: <CheckCircle /> },
  { id: '2', title: 'Aprendiz Constante', description: 'Mantén una racha de 3 días consecutivos.', status: 'completed', icon: <CheckCircle /> },
  { id: '3', title: 'Maestro de la Gamificación', description: 'Completa la ruta de aprendizaje de Gamificación.', status: 'in-progress', progress: 75, icon: <EmojiEvents /> },
  { id: '4', title: 'Colaborador Estrella', description: 'Participa en 5 salas de estudio.', status: 'in-progress', progress: 40, icon: <EmojiEvents /> },
  { id: '5', title: 'Orador Elocuente', description: 'Crea tu primera sala de estudio.', status: 'locked', icon: <Lock /> },
  { id: '6', title: 'Curador de Sabiduría', description: 'Crea una playlist personalizada.', status: 'locked', icon: <Lock /> },
];

const getStatusChip = (status: AchievementStatus) => {
  switch (status) {
    case 'completed':
      return <Chip label="Completado" color="success" size="small" variant="outlined" sx={{ ml: 2 }} />;
    case 'in-progress':
      return <Chip label="En Progreso" color="primary" size="small" variant="outlined" sx={{ ml: 2 }} />;
    case 'locked':
      return <Chip label="Bloqueado" color="default" size="small" sx={{ ml: 2 }} />;
    default:
      return null;
  }
};

const MinimalistAchievementRow = ({ achievement }: { achievement: Achievement }) => {
  const isLocked = achievement.status === 'locked';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        transition: 'background-color 0.2s',
        opacity: isLocked ? 0.6 : 1,
        '&:hover': {
          backgroundColor: !isLocked ? '#f8fafc' : 'transparent',
        },
      }}
    >
      <Box sx={{ mr: 2, color: isLocked ? '#94a3b8' : '#6366f1' }}>{achievement.icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{achievement.title}</Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>{achievement.description}</Typography>
        {achievement.status === 'in-progress' && achievement.progress !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={achievement.progress}
              sx={{ flex: 1, height: 6, borderRadius: 3, mr: 1 }}
            />
            <Typography variant="caption" sx={{ color: '#64748b' }}>{`${achievement.progress}%`}</Typography>
          </Box>
        )}
      </Box>
      {getStatusChip(achievement.status)}
    </Box>
  );
};

export const UPlayAchievementSystem: React.FC = () => {
  const [filter, setFilter] = useState<AchievementStatus | 'all'>('all');

  const filteredAchievements = mockAchievements.filter(ach =>
    filter === 'all' || ach.status === filter
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8fafc', minHeight: '100vh', borderRadius: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Logros Desbloqueados
        </Typography>
        <Typography sx={{ color: '#475569', mt: 1, fontSize: '1.1rem' }}>
          Tus reconocimientos por contribuir al Bien Común.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        {(['all', 'in-progress', 'completed', 'locked'] as const).map(f => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            onClick={() => setFilter(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
          />
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: '16px',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          overflow: 'hidden',
        }}
      >
        {filteredAchievements.map((ach, index) => (
          <React.Fragment key={ach.id}>
            <MinimalistAchievementRow achievement={ach} />
            {index < filteredAchievements.length - 1 && <hr style={{ border: 'none', height: '1px', backgroundColor: '#f1f5f9' }} />}
          </React.Fragment>
        ))}
        {filteredAchievements.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#64748b' }}>
              No hay logros en esta categoría.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UPlayAchievementSystem;
