import React, { useMemo } from 'react';
// Imports específicos siguiendo reglas Builder.io
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Imports específicos de iconos siguiendo reglas Builder.io
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import StoreIcon from '@mui/icons-material/Store';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import HandshakeIcon from '@mui/icons-material/Handshake';
import {
  errorColors,
  successColors,
  warningColors,
  primaryColors,
  secondaryColors,
  grayColors,
} from '../../utils/theme-helpers';
import { useNavigate } from 'react-router-dom';

interface SmartAction {
  id: string;
  icon: React.ReactElement;
  label: string;
  description: string;
  path: string;
  benefit: string;
  estimatedTime: string;
  urgency: 'high' | 'medium' | 'low';
  color: string;
  category: 'give' | 'receive' | 'learn' | 'connect';
}

interface SmartActionsProps {
  reciprocidadBalance: number;
  userLevel: string;
  onActionClick?: (path: string, action: SmartAction) => void;
}

const generateSmartActions = (
  balance: number,
  userLevel: string
): SmartAction[] => {
  const allActions: SmartAction[] = [
    // GIVING ACTIONS (para mejorar balance)
    {
      id: 'offer-help',
      icon: <SendIcon />,
      label: 'Ofrecer Ayuda',
      description: 'Comparte tu conocimiento con la comunidad',
      path: '/social/offer-help',
      benefit: '+50 Mëritos',
      estimatedTime: '5 min',
      urgency: 'high',
      color: successColors[500],
      category: 'give',
    },
    {
      id: 'create-resource',
      icon: <SchoolIcon />,
      label: 'Crear Recurso',
      description: 'Comparte material educativo valioso',
      path: '/uplay/create',
      benefit: '+100 Mëritos',
      estimatedTime: '15 min',
      urgency: 'medium',
      color: primaryColors[500],
      category: 'give',
    },
    {
      id: 'mentor-someone',
      icon: <PsychologyIcon />,
      label: 'Ser Mentor',
      description: 'Guía a alguien en su crecimiento personal',
      path: '/social/mentoring',
      benefit: '+150 Mëritos',
      estimatedTime: '30 min',
      urgency: 'medium',
      color: secondaryColors[500],
      category: 'give',
    },

    // RECEIVING ACTIONS (cuando balance es alto)
    {
      id: 'request-help',
      icon: <FavoriteIcon />,
      label: 'Pedir Ayuda',
      description: 'Solicita apoyo específico de la comunidad',
      path: '/social/request-help',
      benefit: 'Nuevas conexiones',
      estimatedTime: '3 min',
      urgency: 'low',
      color: errorColors[500],
      category: 'receive',
    },
    {
      id: 'join-circle',
      icon: <GroupsIcon />,
      label: 'Unirse a Círculo',
      description: 'Conecta con personas de intereses similares',
      path: '/social/circles',
      benefit: 'Red expandida',
      estimatedTime: '2 min',
      urgency: 'medium',
      color: primaryColors[500],
      category: 'connect',
    },

    // LEARNING ACTIONS (para crecimiento)
    {
      id: 'complete-course',
      icon: <VideoLibraryIcon />,
      label: 'Completar Curso',
      description: 'Continúa tu aprendizaje en ÜPlay',
      path: '/uplay',
      benefit: '+30 Öndas',
      estimatedTime: '20 min',
      urgency: 'medium',
      color: warningColors[500],
      category: 'learn',
    },
    {
      id: 'take-challenge',
      icon: <EmojiEventsIcon />,
      label: 'Aceptar Desafío',
      description: 'Participa en desafíos comunitarios',
      path: '/challenges',
      benefit: '+75 Öndas',
      estimatedTime: '10 min',
      urgency: 'high',
      color: warningColors[600],
      category: 'learn',
    },

    // MARKETPLACE ACTIONS
    {
      id: 'make-exchange',
      icon: <StoreIcon />,
      label: 'Intercambiar',
      description: 'Realiza un intercambio equilibrado',
      path: '/marketplace',
      benefit: 'Balance Reciprocidad',
      estimatedTime: '8 min',
      urgency: 'medium',
      color: successColors[600],
      category: 'give',
    },

    // ADVANCED ACTIONS (para usuarios experimentados)
    {
      id: 'facilitate-event',
      icon: <HandshakeIcon />,
      label: 'Facilitar Evento',
      description: 'Organiza una actividad comunitaria',
      path: '/social/events/create',
      benefit: '+200 Mëritos',
      estimatedTime: '45 min',
      urgency: 'low',
      color: secondaryColors[600],
      category: 'give',
    },
  ];

  // ALGORITMO INTELIGENTE: Seleccionar acciones según balance
  let recommendedActions: SmartAction[] = [];

  if (balance < 0.4) {
    // Balance muy bajo: Focus total en dar
    recommendedActions = allActions
      .filter((action) => action.category === 'give')
      .sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      })
      .slice(0, 3);
  } else if (balance < 0.6) {
    // Balance bajo: Principalmente dar, algo de aprender
    const giveActions = allActions
      .filter((action) => action.category === 'give')
      .slice(0, 2);
    const learnActions = allActions
      .filter((action) => action.category === 'learn')
      .slice(0, 1);
    recommendedActions = [...giveActions, ...learnActions];
  } else if (balance < 0.8) {
    // Balance medio: Mix equilibrado
    const giveActions = allActions
      .filter((action) => action.category === 'give')
      .slice(0, 1);
    const learnActions = allActions
      .filter((action) => action.category === 'learn')
      .slice(0, 1);
    const connectActions = allActions
      .filter((action) => action.category === 'connect')
      .slice(0, 1);
    recommendedActions = [...giveActions, ...learnActions, ...connectActions];
  } else {
    // Balance alto: Focus en aprender y conectar
    const learnActions = allActions
      .filter((action) => action.category === 'learn')
      .slice(0, 2);
    const receiveActions = allActions
      .filter((action) => action.category === 'receive')
      .slice(0, 1);
    recommendedActions = [...learnActions, ...receiveActions];
  }

  // Asegurar que siempre tenemos exactamente 3 acciones
  if (recommendedActions.length < 3) {
    const remaining = allActions
      .filter((action) => !recommendedActions.includes(action))
      .slice(0, 3 - recommendedActions.length);
    recommendedActions = [...recommendedActions, ...remaining];
  }

  return recommendedActions.slice(0, 3);
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return errorColors[500];
    case 'medium':
      return warningColors[500];
    case 'low':
      return successColors[500];
    default:
      return grayColors[500];
  }
};

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'give':
      return '🤲';
    case 'receive':
      return '💝';
    case 'learn':
      return '📚';
    case 'connect':
      return '🤝';
    default:
      return '⭐';
  }
};

export const SmartActions: React.FC<SmartActionsProps> = ({
  reciprocidadBalance,
  userLevel,
  onActionClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const smartActions = useMemo(
    () => generateSmartActions(reciprocidadBalance, userLevel),
    [reciprocidadBalance, userLevel]
  );

  const handleActionClick = (action: SmartAction) => {
    if (onActionClick) {
      onActionClick(action.path, action);
    } else {
      navigate(action.path);
    }
  };

  const getBalanceMessage = (balance: number) => {
    if (balance < 0.4) {
      return 'Enfócate en dar ayuda para equilibrar tu Reciprocidad';
    } else if (balance < 0.6) {
      return 'Sigue dando ayuda y aprende nuevas habilidades';
    } else if (balance < 0.8) {
      return 'Mantén el equilibrio entre dar, aprender y conectar';
    } else {
      return 'Explora, aprende y permite que otros te ayuden';
    }
  };

  return (
    <Card
      className="focus-outline"
      role="region"
      aria-label="Acciones inteligentes recomendadas"
      sx={{
        p: 'var(--space-6)',
        borderRadius: 'var(--radius-3xl)',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--shadow-lg)',
        transition: 'var(--transition-normal)',
        '&:hover': {
          boxShadow: 'var(--shadow-xl)',
        },
      }}
    >
      {/* Header with smart context */}
      <Box sx={{ mb: 'var(--space-6)' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 'var(--space-2)' }}
        >
          <Typography
            variant="h6"
            className="text-lg font-semibold"
            sx={{ color: grayColors[800] }}
          >
            Acciones Recomendadas
          </Typography>
          <Chip
            label={`Balance: ${Math.round(reciprocidadBalance * 100)}%`}
            size="small"
            sx={{
              backgroundColor: alpha(
                reciprocidadBalance >= 0.8
                  ? successColors[500]
                  : reciprocidadBalance >= 0.6
                    ? warningColors[500]
                    : errorColors[500],
                0.1
              ),
              color:
                reciprocidadBalance >= 0.8
                  ? successColors[500]
                  : reciprocidadBalance >= 0.6
                    ? warningColors[500]
                    : errorColors[500],
              fontWeight: 'var(--font-semibold)',
            }}
          />
        </Stack>

        <Typography
          variant="body2"
          sx={{ color: grayColors[600], fontStyle: 'italic' }}
        >
          {getBalanceMessage(reciprocidadBalance)}
        </Typography>
      </Box>

      {/* Smart Actions Grid */}
      <Grid container spacing={3}>
        {smartActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={action.id}>
            <Card
              className="interactive focus-outline"
              onClick={() => handleActionClick(action)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActionClick(action);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${action.label}: ${action.description}`}
              sx={{
                p: 'var(--space-4)',
                borderRadius: 'var(--radius-2xl)',
                background: alpha(action.color, 0.05),
                border: `1px solid ${alpha(action.color, 0.2)}`,
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${alpha(action.color, 0.25)}`,
                  borderColor: action.color,
                },
                '&:focus-visible': {
                  outline: `2px solid ${action.color}`,
                  outlineOffset: 2,
                },
                // Priority indicator
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 3,
                  background: action.color,
                  opacity: action.urgency === 'high' ? 1 : 0.6,
                },
              }}
            >
              {/* Urgency indicator */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 'var(--space-3)' }}
              >
                <Box
                  sx={{
                    p: 'var(--space-2)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: alpha(action.color, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(action.icon, {
                    sx: { color: action.color, fontSize: 24 },
                  })}
                </Box>

                <Stack alignItems="flex-end" spacing={0.5}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: grayColors[500],
                      textAlign: 'right',
                    }}
                  >
                    {getCategoryEmoji(action.category)} {action.category}
                  </Typography>
                  <Chip
                    label={action.urgency}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: '0.65rem',
                      backgroundColor: alpha(
                        getUrgencyColor(action.urgency),
                        0.1
                      ),
                      color: getUrgencyColor(action.urgency),
                      fontWeight: 'var(--font-semibold)',
                      textTransform: 'uppercase',
                    }}
                  />
                </Stack>
              </Stack>

              {/* Action content */}
              <Box sx={{ mb: 'var(--space-3)' }}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{
                    fontSize: 'var(--text-base)',
                    color: grayColors[800],
                    mb: 'var(--space-1)',
                    lineHeight: 'var(--leading-tight)',
                  }}
                >
                  {action.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 'var(--text-sm)',
                    color: grayColors[600],
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {action.description}
                </Typography>
              </Box>

              {/* Benefits and time */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 'auto' }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 'var(--text-xs)',
                      color: action.color,
                      fontWeight: 'var(--font-semibold)',
                      display: 'block',
                    }}
                  >
                    {action.benefit}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 'var(--text-xs)',
                      color: grayColors[500],
                    }}
                  >
                    ⏱️ {action.estimatedTime}
                  </Typography>
                </Box>

                <AutoAwesomeIcon
                  sx={{
                    fontSize: 16,
                    color: alpha(action.color, 0.6),
                    animation:
                      action.urgency === 'high'
                        ? 'gentle-pulse 2s ease-in-out infinite'
                        : 'none',
                    '@keyframes gentle-pulse': {
                      '0%, 100%': { opacity: 0.6 },
                      '50%': { opacity: 1 },
                    },
                  }}
                />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context footer */}
      <Box
        sx={{
          mt: 'var(--space-6)',
          pt: 'var(--space-4)',
          borderTop: `1px solid ${grayColors[200]}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 'var(--text-xs)',
            color: grayColors[500],
            fontStyle: 'italic',
            textAlign: 'center',
            display: 'block',
          }}
        >
          💡 Las acciones se actualizan automáticamente según tu balance Reciprocidad
        </Typography>
      </Box>
    </Card>
  );
};
