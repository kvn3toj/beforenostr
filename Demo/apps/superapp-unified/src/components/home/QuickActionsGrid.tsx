import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Send,
  Favorite,
  Psychology,
  Groups,
  Store,
  VideoLibrary,
  Timeline,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AyniAction {
  icon: React.ReactElement;
  label: string;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description: string;
  category: 'ayni' | 'modules' | 'create';
}

interface QuickActionsGridProps {
  onActionClick?: (path: string, action: AyniAction) => void;
}

const ayniActions: AyniAction[] = [
  {
    icon: <Send />,
    label: 'Dar Ayuda',
    path: '/social/offer-help',
    color: 'success',
    description: 'Ofrece tu conocimiento o servicio',
    category: 'ayni',
  },
  {
    icon: <Favorite />,
    label: 'Pedir Ayuda',
    path: '/social/request-help',
    color: 'error',
    description: 'Solicita apoyo de la comunidad',
    category: 'ayni',
  },
  {
    icon: <Psychology />,
    label: 'Compartir Sabiduría',
    path: '/uplay/create',
    color: 'secondary',
    description: 'Crea contenido educativo',
    category: 'create',
  },
  {
    icon: <Groups />,
    label: 'Formar Círculo',
    path: '/social/create-group',
    color: 'primary',
    description: 'Inicia un grupo de colaboración',
    category: 'create',
  },
];

const moduleActions: AyniAction[] = [
  {
    icon: <VideoLibrary />,
    label: 'ÜPlay',
    path: '/uplay',
    color: 'secondary',
    description: 'Videos interactivos gamificados',
    category: 'modules',
  },
  {
    icon: <Store />,
    label: 'Marketplace',
    path: '/marketplace',
    color: 'primary',
    description: 'Intercambio de productos y servicios',
    category: 'modules',
  },
  {
    icon: <Groups />,
    label: 'Social',
    path: '/social',
    color: 'success',
    description: 'Red de colaboración',
    category: 'modules',
  },
  {
    icon: <Timeline />,
    label: 'ÜStats',
    path: '/ustats',
    color: 'warning',
    description: 'Métricas y analytics',
    category: 'modules',
  },
];

const ActionButton: React.FC<{
  action: AyniAction;
  onClick: (path: string, action: AyniAction) => void;
}> = ({ action, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      fullWidth
      variant="outlined"
      color={action.color}
      onClick={() => onClick(action.path, action)}
      startIcon={action.icon}
      sx={{
        flexDirection: 'column',
        py: 2,
        px: 1.5,
        minHeight: 90,
        gap: 1,
        border: `2px solid ${alpha(theme.palette[action.color].main, 0.2)}`,
        bgcolor: alpha(theme.palette[action.color].main, 0.02),
        '&:hover': {
          bgcolor: alpha(theme.palette[action.color].main, 0.08),
          transform: 'translateY(-3px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette[action.color].main, 0.3)}`,
          border: `2px solid ${alpha(theme.palette[action.color].main, 0.4)}`,
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${alpha(
            theme.palette[action.color].main,
            0.1
          )}, transparent)`,
          transition: 'left 0.5s ease-in-out',
        },
        '&:hover::before': {
          left: '100%',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {action.label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          textAlign: 'center',
          opacity: 0.8,
          lineHeight: 1.1,
          fontSize: '0.7rem',
        }}
      >
        {action.description}
      </Typography>
    </Button>
  );
};

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onActionClick,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleActionClick = (path: string, action: AyniAction) => {
    if (onActionClick) {
      onActionClick(path, action);
    } else {
      navigate(path);
    }
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.secondary.main,
          0.05
        )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Acciones Ayni
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Equilibra tu dar y recibir en la comunidad
        </Typography>

        {/* Acciones principales de Ayni */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            🤝 PRINCIPIO AYNI
          </Typography>
          <Grid container spacing={1}>
            {ayniActions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <ActionButton action={action} onClick={handleActionClick} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Acceso rápido a módulos */}
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            🚀 ACCESO RÁPIDO
          </Typography>
          <Grid container spacing={1}>
            {moduleActions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <ActionButton action={action} onClick={handleActionClick} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mensaje motivacional */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: 'italic', textAlign: 'center', display: 'block' }}
          >
            💫 "En el Ayni perfecto, dar y recibir son la misma acción"
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
