// @ts-nocheck
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import {
  EmojiEvents,
  Lock,
  CheckCircle,
  Star,
  WorkspacePremium,
} from '@mui/icons-material';

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
  { id: '7', title: 'Explorador Alfa', description: 'Descubre una función oculta.', status: 'completed', icon: <CheckCircle /> },
  { id: '8', title: 'Maratonista del Saber', description: 'Mira más de 2 horas de contenido.', status: 'in-progress', progress: 60, icon: <EmojiEvents /> },
  { id: '9', title: 'Arquitecto Social', description: 'Invita a 3 nuevos miembros a CoomÜnity.', status: 'locked', icon: <Lock /> },
];

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const theme = useTheme();
  const isLocked = achievement.status === 'locked';
  const isCompleted = achievement.status === 'completed';

  const cardStyles = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    p: 3,
    borderRadius: 4,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    ...(isLocked && {
      filter: 'grayscale(80%)',
      backgroundColor: alpha(theme.palette.grey[500], 0.05),
    }),
    ...(isCompleted && {
      borderColor: theme.palette.success.main,
      boxShadow: `0 0 15px ${alpha(theme.palette.success.main, 0.3)}`,
    }),
    '&:hover': {
      transform: isLocked ? 'none' : 'translateY(-5px)',
      boxShadow: isLocked
        ? 'none'
        : `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  };

  return (
    <Card sx={cardStyles}>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={
            achievement.status === 'in-progress' ? achievement.progress : 100
          }
          size={80}
          thickness={3}
          sx={{
            color:
              achievement.status === 'completed'
                ? theme.palette.success.main
                : theme.palette.primary.main,
            position: 'absolute',
            top: -10,
            left: -10,
            opacity: isLocked ? 0.3 : 1,
          }}
        />
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLocked
              ? theme.palette.grey[500]
              : isCompleted
              ? theme.palette.success.main
              : theme.palette.primary.main,
            fontSize: 40,
          }}
        >
          {achievement.icon}
        </Box>
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: 'text.primary' }}
        >
          {achievement.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {achievement.description}
        </Typography>
        {achievement.status === 'in-progress' && (
          <Chip
            label={`${achievement.progress}%`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        )}
        {isCompleted && (
          <Chip
            label="Completado"
            size="small"
            color="success"
            icon={<CheckCircle />}
            sx={{ mt: 2 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export const UPlayAchievementSystem: React.FC = () => {
  const [filter, setFilter] = useState<AchievementStatus | 'all'>('all');
  const theme = useTheme();

  const filteredAchievements = useMemo(
    () =>
      mockAchievements.filter(
        ach => filter === 'all' || ach.status === filter
      ),
    [filter]
  );

  const completedCount = useMemo(
    () => mockAchievements.filter(ach => ach.status === 'completed').length,
    []
  );

  const completionPercentage = Math.round(
    (completedCount / mockAchievements.length) * 100
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            letterSpacing: '-1px',
          }}
        >
          Muro de Logros
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: '1.1rem' }}>
          Tu progreso y contribuciones al ecosistema CoomÜnity.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {completionPercentage}%
            </Typography>
            <Typography color="text.secondary">Completado</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <WorkspacePremium
              sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {completedCount} / {mockAchievements.length}
            </Typography>
            <Typography color="text.secondary">Logros Desbloqueados</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
        {(['all', 'in-progress', 'completed', 'locked'] as const).map(f => (
          <Chip
            key={f}
            label={
              f === 'all'
                ? 'Todos'
                : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')
            }
            onClick={() => setFilter(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredAchievements.map((ach, index) => (
          <Grid item xs={12} sm={6} md={4} key={ach.id}>
            <Fade in timeout={300 * (index + 1)}>
              <div>
                <AchievementCard achievement={ach} />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {filteredAchievements.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            No hay logros en esta categoría.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UPlayAchievementSystem;
