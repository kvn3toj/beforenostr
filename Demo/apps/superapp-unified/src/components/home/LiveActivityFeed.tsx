import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import BoltIcon from '@mui/icons-material/Bolt';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface ActivityUser {
  id: string;
  name: string;
  avatar: string;
  level: string;
  ayniScore: number;
}

interface CommunityActivity {
  id: string;
  type: 'achievement' | 'social' | 'energy' | 'collaboration' | 'marketplace';
  user: ActivityUser;
  action: string;
  description: string;
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  isNew: boolean;
  priority: 'high' | 'medium' | 'low';
  metadata: {
    elementType?: string;
    value?: number;
    collaborators?: ActivityUser[];
  };
}

interface LiveActivityFeedProps {
  maxActivities?: number;
  updateInterval?: number; // en segundos
  className?: string;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  maxActivities = 10,
  updateInterval = 15,
  className = '',
}) => {
  const theme = useTheme();
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 🎯 Datos mock de usuarios de la comunidad
  const mockUsers: ActivityUser[] = useMemo(
    () => [
      {
        id: '1',
        name: 'María Paz',
        avatar: '👩‍🌾',
        level: 'Guardiana del Equilibrio',
        ayniScore: 95,
      },
      {
        id: '2',
        name: 'Carlos Andrés',
        avatar: '👨‍💻',
        level: 'Colaborador Experimentado',
        ayniScore: 87,
      },
      {
        id: '3',
        name: 'Ana Sofía',
        avatar: '👩‍🎨',
        level: 'Creadora Confiable',
        ayniScore: 92,
      },
      {
        id: '4',
        name: 'Luis Miguel',
        avatar: '👨‍🔧',
        level: 'Constructor de Puentes',
        ayniScore: 89,
      },
      {
        id: '5',
        name: 'Isabella',
        avatar: '👩‍🏫',
        level: 'Mentora Sabia',
        ayniScore: 93,
      },
      {
        id: '6',
        name: 'Fernando',
        avatar: '👨‍🌾',
        level: 'Guardián de la Tierra',
        ayniScore: 85,
      },
      {
        id: '7',
        name: 'Camila',
        avatar: '👩‍⚕️',
        level: 'Sanadora Comunitaria',
        ayniScore: 91,
      },
      {
        id: '8',
        name: 'Diego',
        avatar: '👨‍🚀',
        level: 'Innovador del Bien Común',
        ayniScore: 88,
      },
    ],
    []
  );

  // 🎯 Tipos de actividades con configuración
  const activityConfig = {
    achievement: {
      icon: <EmojiEventsIcon />,
      color: '#FFD54F',
      actions: [
        'alcanzó el nivel {level}',
        'completó el desafío "{challenge}"',
        'ganó {value} Mëritos nuevos',
        'desbloqueó la insignia "{badge}"',
      ],
    },
    social: {
      icon: <GroupsIcon />,
      color: '#4FC3F7',
      actions: [
        'se unió al círculo "{circle}"',
        'conectó con {value} nuevos miembros',
        'organizó un encuentro en {location}',
        'invitó a {value} personas a CoomÜnity',
      ],
    },
    energy: {
      icon: <BoltIcon />,
      color: '#8BC34A',
      actions: [
        'generó {value} Öndas de energía',
        'equilibró su elemento {element}',
        'alcanzó {value}% de armonía elemental',
        'completó su ritual energético diario',
      ],
    },
    collaboration: {
      icon: <HandshakeIcon />,
      color: '#FF8A65',
      actions: [
        'completó un Ayni con {collaborator}',
        'compartió conocimiento en "{topic}"',
        'colaboró en el proyecto "{project}"',
        'facilitó un intercambio comunitario',
      ],
    },
    marketplace: {
      icon: <TrendingUpIcon />,
      color: '#BA68C8',
      actions: [
        'publicó "{item}" en el marketplace',
        'completó un trueque con {collaborator}',
        'ganó {value} Lükas por sus servicios',
        'recibió 5 estrellas por "{service}"',
      ],
    },
  };

  // 🎯 Generar actividad simulada (ORDEN #1 - Sin dependencias complejas)
  const generateRandomActivity = useCallback((): CommunityActivity => {
    const types = Object.keys(
      activityConfig
    ) as (keyof typeof activityConfig)[];
    const type = types[Math.floor(Math.random() * types.length)];
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const actions = activityConfig[type].actions;
    const actionTemplate = actions[Math.floor(Math.random() * actions.length)];

    // Reemplazar placeholders en la acción
    let action = actionTemplate;
    const placeholders = {
      '{level}': [
        'Colaborador Avanzado',
        'Mentor Comunitario',
        'Guardián del Equilibrio',
      ][Math.floor(Math.random() * 3)],
      '{challenge}': [
        'Huerta Urbana',
        'Código Abierto',
        'Arte Colaborativo',
        'Economía Circular',
      ][Math.floor(Math.random() * 4)],
      '{value}': String(Math.floor(Math.random() * 100) + 10),
      '{badge}': ['Innovador', 'Conector', 'Equilibrista', 'Creativo'][
        Math.floor(Math.random() * 4)
      ],
      '{circle}': [
        'Emprendedores Medellín',
        'Artistas Digitales',
        'Eco-Constructores',
        'Desarrolladores',
      ][Math.floor(Math.random() * 4)],
      '{location}': ['Parque Arví', 'Plaza Mayor', 'Ruta N', 'Universidad'][
        Math.floor(Math.random() * 4)
      ],
      '{element}': ['Fuego', 'Agua', 'Tierra', 'Aire'][
        Math.floor(Math.random() * 4)
      ],
      '{collaborator}':
        mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
      '{topic}': [
        'Permacultura',
        'Blockchain',
        'Arte Terapia',
        'Sostenibilidad',
      ][Math.floor(Math.random() * 4)],
      '{project}': [
        'CoomÜnity Garden',
        'Red de Saberes',
        'Mercado Local',
        'Biblioteca Digital',
      ][Math.floor(Math.random() * 4)],
      '{item}': [
        'Talleres de Bioconstrucción',
        'Diseño Web',
        'Clases de Yoga',
        'Consultoría Tech',
      ][Math.floor(Math.random() * 4)],
      '{service}': [
        'Mentoría en Emprendimiento',
        'Terapia Holística',
        'Desarrollo de Apps',
        'Coaching Personal',
      ][Math.floor(Math.random() * 4)],
    };

    Object.entries(placeholders).forEach(([placeholder, value]) => {
      action = action.replace(placeholder, value);
    });

    const now = new Date();
    const description = `${action} hace ${Math.floor(Math.random() * 60) + 1} minutos`;

    return {
      id: `activity-${Date.now()}-${Math.random()}`,
      type,
      user,
      action,
      description,
      timestamp: new Date(now.getTime() - Math.random() * 3600000), // Última hora
      engagement: {
        likes: Math.floor(Math.random() * 25),
        comments: Math.floor(Math.random() * 10),
        shares: Math.floor(Math.random() * 5),
      },
      isNew: Math.random() > 0.7,
      priority:
        Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      metadata: {
        elementType: ['fuego', 'agua', 'tierra', 'aire'][
          Math.floor(Math.random() * 4)
        ],
        value: Math.floor(Math.random() * 100) + 10,
        collaborators:
          type === 'collaboration'
            ? [mockUsers[Math.floor(Math.random() * mockUsers.length)]]
            : undefined,
      },
    };
  }, [mockUsers]);

  // 🎯 Inicializar actividades (ORDEN #2 - Depende de generateRandomActivity)
  const initializeActivities = useCallback(() => {
    const initialActivities = Array.from({ length: maxActivities }, () =>
      generateRandomActivity()
    );
    setActivities(
      initialActivities.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      )
    );
  }, [maxActivities, generateRandomActivity]);

  // 🔄 Agregar nueva actividad (ORDEN #3 - Depende de generateRandomActivity)
  const addNewActivity = useCallback(() => {
    if (!isLive) return;

    const newActivity = generateRandomActivity();
    newActivity.isNew = true;
    newActivity.timestamp = new Date();

    setActivities((prev) => {
      const updated = [newActivity, ...prev].slice(0, maxActivities);
      return updated;
    });

    setLastUpdate(new Date());

    // Marcar como no nueva después de 5 segundos
    setTimeout(() => {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === newActivity.id
            ? { ...activity, isNew: false }
            : activity
        )
      );
    }, 5000);
  }, [isLive, generateRandomActivity, maxActivities]);

  // 🎯 Efecto para inicialización
  useEffect(() => {
    initializeActivities();
  }, [initializeActivities]);

  // 🔄 Efecto para agregar actividades periódicamente
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        // 60% de probabilidad de nueva actividad
        addNewActivity();
      }
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [isLive, updateInterval, addNewActivity]);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      // Cleanup activity feed resources
    };
  }, []);

  // 🎯 Handlers de interacción (ORDEN CORRECTO)
  const handleLike = useCallback((activityId: string) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              engagement: {
                ...activity.engagement,
                likes: activity.engagement.likes + 1,
              },
            }
          : activity
      )
    );
  }, []);

  const handleComment = useCallback((activityId: string) => {
    console.log('💬 Opening comments for activity:', activityId);
    // Aquí se abriría un modal de comentarios
  }, []);

  const handleShare = useCallback((activityId: string) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              engagement: {
                ...activity.engagement,
                shares: activity.engagement.shares + 1,
              },
            }
          : activity
      )
    );
    console.log('📤 Sharing activity:', activityId);
  }, []);

  const handleToggleLive = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  // 🎯 Función para formatear tiempo relativo
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'ahora mismo';
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays}d`;
  };

  return (
    <Card
      className={`glassmorphism-card interactive-card-advanced live-activity-feed ${className}`}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        border: `1px solid ${alpha('#fff', 0.1)}`,
        borderRadius: 3,
        maxHeight: 600,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header con indicador LIVE */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge
                  badgeContent={
                    <FiberManualRecordIcon
                      sx={{
                        fontSize: '0.8rem',
                        color: isLive ? '#4CAF50' : '#757575',
                        animation: isLive
                          ? 'pulse 1.5s ease-in-out infinite'
                          : 'none',
                      }}
                    />
                  }
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: 'white' }}
                  >
                    Actividad Comunitaria
                  </Typography>
                </Badge>
              </Box>

              <Chip
                label={isLive ? 'EN VIVO' : 'PAUSADO'}
                size="small"
                sx={{
                  bgcolor: isLive
                    ? alpha('#4CAF50', 0.2)
                    : alpha('#757575', 0.2),
                  color: isLive ? '#4CAF50' : '#757575',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  animation: isLive ? 'pulse 2s ease-in-out infinite' : 'none',
                }}
              />
            </Box>

            <Tooltip title={isLive ? 'Pausar feed' : 'Activar feed en vivo'}>
              <IconButton onClick={handleToggleLive} size="small">
                <AutoAwesomeIcon
                  sx={{
                    color: isLive
                      ? theme.palette.primary.main
                      : alpha('#fff', 0.5),
                    fontSize: '1.2rem',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            variant="caption"
            sx={{ color: alpha('#fff', 0.7), mt: 1, display: 'block' }}
          >
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>

        {/* Lista de actividades */}
        <Box
          sx={{
            maxHeight: 480,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: alpha('#fff', 0.1),
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha('#fff', 0.3),
              borderRadius: 3,
            },
          }}
        >
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];

            return (
              <Box key={activity.id}>
                <Box
                  sx={{
                    p: 2.5,
                    position: 'relative',
                    background: activity.isNew
                      ? `linear-gradient(90deg, ${alpha(config.color, 0.1)} 0%, transparent 100%)`
                      : 'transparent',
                    borderLeft: activity.isNew
                      ? `3px solid ${config.color}`
                      : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha('#fff', 0.05),
                    },
                  }}
                >
                  {/* Badge NUEVO */}
                  {activity.isNew && (
                    <Chip
                      label="NUEVO"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: alpha(config.color, 0.2),
                        color: config.color,
                        fontWeight: 'bold',
                        fontSize: '0.6rem',
                        height: 20,
                        animation: 'pulse 1s ease-in-out infinite',
                      }}
                    />
                  )}

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Avatar y nivel */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: alpha(config.color, 0.2),
                          border: `2px solid ${alpha(config.color, 0.3)}`,
                          fontSize: '1.5rem',
                        }}
                      >
                        {activity.user.avatar}
                      </Avatar>
                      <Box
                        sx={{
                          color: config.color,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {config.icon}
                      </Box>
                    </Box>

                    {/* Contenido de la actividad */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: 'white', fontWeight: 'bold' }}
                          >
                            {activity.user.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: alpha('#fff', 0.6) }}
                          >
                            {activity.user.level}
                          </Typography>
                        </Box>

                        <Typography
                          variant="caption"
                          sx={{ color: alpha('#fff', 0.5) }}
                        >
                          {formatTimeAgo(activity.timestamp)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ color: alpha('#fff', 0.9), mb: 2 }}
                      >
                        {activity.action}
                      </Typography>

                      {/* Ayni Score Bar */}
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: alpha('#fff', 0.7) }}
                          >
                            Score Ayni
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: config.color, fontWeight: 'bold' }}
                          >
                            {activity.user.ayniScore}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={activity.user.ayniScore}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: alpha('#fff', 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 2,
                              bgcolor: config.color,
                            },
                          }}
                        />
                      </Box>

                      {/* Engagement actions */}
                      <Box
                        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                      >
                        <Tooltip title="Me gusta">
                          <IconButton
                            size="small"
                            onClick={() => handleLike(activity.id)}
                            sx={{ color: alpha('#fff', 0.6) }}
                          >
                            <FavoriteIcon sx={{ fontSize: '1rem' }} />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {activity.engagement.likes}
                            </Typography>
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Comentar">
                          <IconButton
                            size="small"
                            onClick={() => handleComment(activity.id)}
                            sx={{ color: alpha('#fff', 0.6) }}
                          >
                            <ChatBubbleIcon sx={{ fontSize: '1rem' }} />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {activity.engagement.comments}
                            </Typography>
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Compartir">
                          <IconButton
                            size="small"
                            onClick={() => handleShare(activity.id)}
                            sx={{ color: alpha('#fff', 0.6) }}
                          >
                            <ShareIcon sx={{ fontSize: '1rem' }} />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {activity.engagement.shares}
                            </Typography>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {index < activities.length - 1 && (
                  <Divider sx={{ bgcolor: alpha('#fff', 0.05) }} />
                )}
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
