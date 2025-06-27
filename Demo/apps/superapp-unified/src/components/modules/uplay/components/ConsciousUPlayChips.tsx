import React from 'react';
import {
  Chip,
  Box,
  Typography,
  useTheme,
  alpha,
  keyframes,
  Tooltip,
} from '@mui/material';
import {
  Psychology,
  School,
  AutoAwesome,
  Diamond,
  Star,
  Spa as Eco, // Nature/sustainability icon alternative
  Balance,
  Groups,
  Lightbulb,
  Timeline,
  Category,
  Speed,
  EmojiEvents,
  PlayArrow,
  Pause,
  BookmarkBorder,
  Bookmark,
  Favorite,
  FavoriteBorder,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  TrendingUp,
} from '@mui/icons-material';

// 🌟 Animaciones para Chips Conscientes de ÜPlay
const learningPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
    transform: scale(1.02);
  }
`;

const wisdomGlow = keyframes`
  0%, 100% {
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.5);
  }
`;

const consciousHover = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.05); }
  100% { transform: translateY(0px) scale(1); }
`;

// 🎯 Tipos de Chips Conscientes para ÜPlay
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced' | 'mastery';
export type ConsciousState = 'dormant' | 'awakening' | 'aware' | 'enlightened';
export type LearningMode = 'passive' | 'interactive' | 'immersive' | 'collaborative';

// 📚 Props base para todos los chips
interface BaseConsciousChipProps {
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

// 🎓 Chip de Nivel de Aprendizaje
interface LearningLevelChipProps extends BaseConsciousChipProps {
  level: LearningLevel;
  progress?: number;
}

export const LearningLevelChip: React.FC<LearningLevelChipProps> = ({
  level,
  progress = 0,
  size = 'medium',
  disabled = false,
  selected = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const theme = useTheme();

  const levelConfig = {
    beginner: {
      label: 'Iniciante',
      icon: School,
      color: '#4CAF50',
      bgColor: '#E8F5E8',
      description: 'Comenzando el viaje de aprendizaje'
    },
    intermediate: {
      label: 'Intermedio',
      icon: Timeline,
      color: '#FF9800',
      bgColor: '#FFF3E0',
      description: 'Construyendo conocimiento sólido'
    },
    advanced: {
      label: 'Avanzado',
      icon: TrendingUp,
      color: '#2196F3',
      bgColor: '#E3F2FD',
      description: 'Dominando conceptos complejos'
    },
    mastery: {
      label: 'Maestría',
      icon: Diamond,
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      description: 'Sabiduría profunda alcanzada'
    }
  };

  const config = levelConfig[level];
  const IconComponent = config.icon;

  // 📐 Tamaños responsivos y accesibles
  const sizeConfig = {
    small: { minHeight: 32, minWidth: 80, fontSize: '0.75rem', iconSize: 16 },
    medium: { minHeight: 44, minWidth: 100, fontSize: '0.875rem', iconSize: 20 },
    large: { minHeight: 48, minWidth: 120, fontSize: '1rem', iconSize: 24 }
  };

  const { minHeight, minWidth, fontSize, iconSize } = sizeConfig[size];

  return (
    <Tooltip title={`${config.label}: ${config.description}`} arrow>
      <Chip
        icon={<IconComponent sx={{ fontSize: iconSize, color: config.color }} />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize, fontWeight: 600, color: config.color }}>
              {config.label}
            </Typography>
            {progress > 0 && (
              <Box
                sx={{
                  width: 24,
                  height: 4,
                  backgroundColor: alpha(config.color, 0.3),
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: config.color,
                    borderRadius: 2,
                    transition: 'width 0.5s ease',
                  }}
                />
              </Box>
            )}
          </Box>
        }
        onClick={onClick}
        className={className}
        data-testid={testId || `learning-level-chip-${level}`}
        disabled={disabled}
        sx={{
          minHeight,
          minWidth,
          backgroundColor: selected ? config.color : config.bgColor,
          color: selected ? 'white' : config.color,
          border: `2px solid ${config.color}`,
          borderRadius: 3,
          fontWeight: 600,
          cursor: onClick ? 'pointer' : 'default',
          animation: selected ? `${learningPulse} 2s infinite` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
            backgroundColor: selected ? config.color : alpha(config.color, 0.15),
          } : {},
          '&:focus': {
            outline: `3px solid ${alpha(config.color, 0.5)}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
          // 📱 Responsive touch areas
          [theme.breakpoints.down('md')]: {
            minHeight: Math.max(minHeight, 44),
            minWidth: Math.max(minWidth, 88),
          },
        }}
      />
    </Tooltip>
  );
};

// 🧠 Chip de Estado Consciente
interface ConsciousStateChipProps extends BaseConsciousChipProps {
  state: ConsciousState;
  intensity?: number;
}

export const ConsciousStateChip: React.FC<ConsciousStateChipProps> = ({
  state,
  intensity = 1,
  size = 'medium',
  disabled = false,
  selected = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const theme = useTheme();

  const stateConfig = {
    dormant: {
      label: 'Descansando',
      icon: RadioButtonUnchecked,
      color: '#9E9E9E',
      bgColor: '#F5F5F5',
      description: 'Momento de pausa y reflexión'
    },
    awakening: {
      label: 'Despertando',
      icon: AutoAwesome,
      color: '#FF9800',
      bgColor: '#FFF3E0',
      description: 'Curiosidad emergente'
    },
    aware: {
      label: 'Consciente',
      icon: Psychology,
      color: '#2196F3',
      bgColor: '#E3F2FD',
      description: 'Atención plena en el aprendizaje'
    },
    enlightened: {
      label: 'Iluminado',
      icon: Lightbulb,
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      description: 'Comprensión profunda integrada'
    }
  };

  const config = stateConfig[state];
  const IconComponent = config.icon;

  const sizeConfig = {
    small: { minHeight: 32, minWidth: 90, fontSize: '0.75rem', iconSize: 16 },
    medium: { minHeight: 44, minWidth: 110, fontSize: '0.875rem', iconSize: 20 },
    large: { minHeight: 48, minWidth: 130, fontSize: '1rem', iconSize: 24 }
  };

  const { minHeight, minWidth, fontSize, iconSize } = sizeConfig[size];

  return (
    <Tooltip title={`Estado: ${config.description}`} arrow>
      <Chip
        icon={<IconComponent sx={{ fontSize: iconSize, color: config.color }} />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize, fontWeight: 600, color: config.color }}>
              {config.label}
            </Typography>
            {/* Indicador de intensidad */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: i < intensity ? config.color : alpha(config.color, 0.3),
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        }
        onClick={onClick}
        className={className}
        data-testid={testId || `conscious-state-chip-${state}`}
        disabled={disabled}
        sx={{
          minHeight,
          minWidth,
          backgroundColor: selected ? config.color : config.bgColor,
          color: selected ? 'white' : config.color,
          border: `2px solid ${config.color}`,
          borderRadius: 3,
          fontWeight: 600,
          cursor: onClick ? 'pointer' : 'default',
          animation: state === 'enlightened' ? `${wisdomGlow} 3s infinite` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            animation: `${consciousHover} 0.6s ease`,
            boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
            backgroundColor: selected ? config.color : alpha(config.color, 0.15),
          } : {},
          '&:focus': {
            outline: `3px solid ${alpha(config.color, 0.5)}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
          [theme.breakpoints.down('md')]: {
            minHeight: Math.max(minHeight, 44),
            minWidth: Math.max(minWidth, 98),
          },
        }}
      />
    </Tooltip>
  );
};

// 🎮 Chip de Modo de Aprendizaje
interface LearningModeChipProps extends BaseConsciousChipProps {
  mode: LearningMode;
  active?: boolean;
}

export const LearningModeChip: React.FC<LearningModeChipProps> = ({
  mode,
  active = false,
  size = 'medium',
  disabled = false,
  selected = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const theme = useTheme();

  const modeConfig = {
    passive: {
      label: 'Observar',
      icon: PlayArrow,
      color: '#607D8B',
      bgColor: '#ECEFF1',
      description: 'Aprendizaje a través de observación'
    },
    interactive: {
      label: 'Interactuar',
      icon: Star,
      color: '#FF9800',
      bgColor: '#FFF3E0',
      description: 'Participación activa con el contenido'
    },
    immersive: {
      label: 'Inmersivo',
      icon: AutoAwesome,
      color: '#2196F3',
      bgColor: '#E3F2FD',
      description: 'Experiencia de aprendizaje profunda'
    },
    collaborative: {
      label: 'Colaborativo',
      icon: Groups,
      color: '#4CAF50',
      bgColor: '#E8F5E8',
      description: 'Aprendizaje en comunidad (Ayni)'
    }
  };

  const config = modeConfig[mode];
  const IconComponent = config.icon;

  const sizeConfig = {
    small: { minHeight: 32, minWidth: 85, fontSize: '0.75rem', iconSize: 16 },
    medium: { minHeight: 44, minWidth: 105, fontSize: '0.875rem', iconSize: 20 },
    large: { minHeight: 48, minWidth: 125, fontSize: '1rem', iconSize: 24 }
  };

  const { minHeight, minWidth, fontSize, iconSize } = sizeConfig[size];

  return (
    <Tooltip title={`Modo: ${config.description}`} arrow>
      <Chip
        icon={<IconComponent sx={{ fontSize: iconSize, color: config.color }} />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize, fontWeight: 600, color: config.color }}>
              {config.label}
            </Typography>
            {active && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  animation: `${learningPulse} 1.5s infinite`,
                }}
              />
            )}
          </Box>
        }
        onClick={onClick}
        className={className}
        data-testid={testId || `learning-mode-chip-${mode}`}
        disabled={disabled}
        sx={{
          minHeight,
          minWidth,
          backgroundColor: selected || active ? config.color : config.bgColor,
          color: selected || active ? 'white' : config.color,
          border: `2px solid ${config.color}`,
          borderRadius: 3,
          fontWeight: 600,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
            backgroundColor: selected || active ? config.color : alpha(config.color, 0.15),
          } : {},
          '&:focus': {
            outline: `3px solid ${alpha(config.color, 0.5)}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
          [theme.breakpoints.down('md')]: {
            minHeight: Math.max(minHeight, 44),
            minWidth: Math.max(minWidth, 93),
          },
        }}
      />
    </Tooltip>
  );
};

// ⭐ Chip de Acción de Video (Play/Pause/Bookmark/Favorite)
interface VideoActionChipProps extends BaseConsciousChipProps {
  action: 'play' | 'pause' | 'bookmark' | 'favorite';
  active?: boolean;
  count?: number;
}

export const VideoActionChip: React.FC<VideoActionChipProps> = ({
  action,
  active = false,
  count,
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const theme = useTheme();

  const actionConfig = {
    play: {
      label: 'Reproducir',
      icon: PlayArrow,
      activeIcon: Pause,
      color: '#4CAF50',
      bgColor: '#E8F5E8',
      description: 'Iniciar/pausar reproducción'
    },
    pause: {
      label: 'Pausar',
      icon: Pause,
      activeIcon: PlayArrow,
      color: '#FF9800',
      bgColor: '#FFF3E0',
      description: 'Pausar reproducción'
    },
    bookmark: {
      label: 'Guardar',
      icon: BookmarkBorder,
      activeIcon: Bookmark,
      color: '#2196F3',
      bgColor: '#E3F2FD',
      description: 'Agregar a favoritos'
    },
    favorite: {
      label: 'Me gusta',
      icon: FavoriteBorder,
      activeIcon: Favorite,
      color: '#E91E63',
      bgColor: '#FCE4EC',
      description: 'Marcar como favorito'
    }
  };

  const config = actionConfig[action];
  const IconComponent = active ? config.activeIcon : config.icon;

  const sizeConfig = {
    small: { minHeight: 32, minWidth: 75, fontSize: '0.75rem', iconSize: 16 },
    medium: { minHeight: 44, minWidth: 95, fontSize: '0.875rem', iconSize: 20 },
    large: { minHeight: 48, minWidth: 115, fontSize: '1rem', iconSize: 24 }
  };

  const { minHeight, minWidth, fontSize, iconSize } = sizeConfig[size];

  return (
    <Tooltip title={config.description} arrow>
      <Chip
        icon={<IconComponent sx={{ fontSize: iconSize, color: config.color }} />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize, fontWeight: 600, color: config.color }}>
              {config.label}
            </Typography>
            {count !== undefined && count > 0 && (
              <Typography
                sx={{
                  fontSize: fontSize * 0.85,
                  fontWeight: 500,
                  color: alpha(config.color, 0.7),
                  backgroundColor: alpha(config.color, 0.1),
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 1,
                  minWidth: 16,
                  textAlign: 'center'
                }}
              >
                {count}
              </Typography>
            )}
          </Box>
        }
        onClick={onClick}
        className={className}
        data-testid={testId || `video-action-chip-${action}`}
        disabled={disabled}
        sx={{
          minHeight,
          minWidth,
          backgroundColor: active ? config.color : config.bgColor,
          color: active ? 'white' : config.color,
          border: `2px solid ${config.color}`,
          borderRadius: 3,
          fontWeight: 600,
          cursor: onClick ? 'pointer' : 'default',
          animation: active && action === 'play' ? `${learningPulse} 2s infinite` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
            backgroundColor: active ? config.color : alpha(config.color, 0.15),
          } : {},
          '&:focus': {
            outline: `3px solid ${alpha(config.color, 0.5)}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
          [theme.breakpoints.down('md')]: {
            minHeight: Math.max(minHeight, 44),
            minWidth: Math.max(minWidth, 83),
          },
        }}
      />
    </Tooltip>
  );
};

// 🏆 Chip de Progreso de Logros
interface AchievementProgressChipProps extends BaseConsciousChipProps {
  title: string;
  progress: number;
  maxProgress: number;
  category?: 'wisdom' | 'engagement' | 'collaboration' | 'mastery';
}

export const AchievementProgressChip: React.FC<AchievementProgressChipProps> = ({
  title,
  progress,
  maxProgress,
  category = 'wisdom',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const theme = useTheme();

  const categoryConfig = {
    wisdom: {
      icon: Lightbulb,
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
    engagement: {
      icon: Psychology,
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    collaboration: {
      icon: Groups,
      color: '#4CAF50',
      bgColor: '#E8F5E8',
    },
    mastery: {
      icon: EmojiEvents,
      color: '#9C27B0',
      bgColor: '#F3E5F5',
    }
  };

  const config = categoryConfig[category];
  const IconComponent = config.icon;
  const progressPercent = Math.min((progress / maxProgress) * 100, 100);

  const sizeConfig = {
    small: { minHeight: 32, minWidth: 120, fontSize: '0.75rem', iconSize: 16 },
    medium: { minHeight: 44, minWidth: 140, fontSize: '0.875rem', iconSize: 20 },
    large: { minHeight: 48, minWidth: 160, fontSize: '1rem', iconSize: 24 }
  };

  const { minHeight, minWidth, fontSize, iconSize } = sizeConfig[size];

  return (
    <Tooltip title={`${title}: ${progress}/${maxProgress} (${Math.round(progressPercent)}%)`} arrow>
      <Chip
        icon={<IconComponent sx={{ fontSize: iconSize, color: config.color }} />}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Typography sx={{ fontSize, fontWeight: 600, color: config.color, flex: 1 }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: fontSize * 0.85, color: alpha(config.color, 0.8) }}>
                {progress}/{maxProgress}
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 6,
                  backgroundColor: alpha(config.color, 0.3),
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: config.color,
                    borderRadius: 3,
                    transition: 'width 0.8s ease',
                  }}
                />
              </Box>
            </Box>
          </Box>
        }
        onClick={onClick}
        className={className}
        data-testid={testId || `achievement-progress-chip-${category}`}
        disabled={disabled}
        sx={{
          minHeight,
          minWidth,
          backgroundColor: config.bgColor,
          color: config.color,
          border: `2px solid ${config.color}`,
          borderRadius: 3,
          fontWeight: 600,
          cursor: onClick ? 'pointer' : 'default',
          animation: progressPercent === 100 ? `${learningPulse} 2s infinite` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
            backgroundColor: alpha(config.color, 0.15),
          } : {},
          '&:focus': {
            outline: `3px solid ${alpha(config.color, 0.5)}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
          [theme.breakpoints.down('md')]: {
            minHeight: Math.max(minHeight, 44),
            minWidth: Math.max(minWidth, 128),
          },
        }}
      />
    </Tooltip>
  );
};

export default {
  LearningLevelChip,
  ConsciousStateChip,
  LearningModeChip,
  VideoActionChip,
  AchievementProgressChip,
};
