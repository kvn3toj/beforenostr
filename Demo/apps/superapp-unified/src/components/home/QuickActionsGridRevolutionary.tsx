import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import FlashOnIcon from '@mui/icons-material/FlashOn';
import GroupsIcon from '@mui/icons-material/Groups';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExploreIcon from '@mui/icons-material/Explore';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';

interface QuickActionsGridRevolutionaryProps {
  onActionClick?: (action: string) => void;
}

// 🎯 Configuración de acciones rápidas
const quickActions = [
  {
    id: 'uplay',
    title: 'UPlay',
    subtitle: 'Entretenimiento',
    description: 'Videos y diversión',
    icon: SportsEsportsIcon,
    gradient: 'linear-gradient(135deg, #E91E63, #F06292)',
    route: '/uplay',
    badge: 3,
    category: 'entertainment',
    keywords: ['videos', 'diversión', 'entretenimiento'],
  },
  {
    id: 'social',
    title: 'Social',
    subtitle: 'Comunidad',
    description: 'Conecta y comparte',
    icon: GroupsIcon,
    gradient: 'linear-gradient(135deg, #2196F3, #42A5F5)',
    route: '/social',
    badge: 8,
    category: 'social',
    keywords: ['amigos', 'comunidad', 'chat'],
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    subtitle: 'Comercio',
    description: 'Compra y vende',
    icon: ShoppingCartIcon,
    gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)',
    route: '/marketplace',
    badge: 12,
    category: 'commerce',
    keywords: ['compras', 'venta', 'comercio'],
  },
  {
    id: 'lets',
    title: 'Lets',
    subtitle: 'Educación',
    description: 'Aprende y enseña',
    icon: SchoolIcon,
    gradient: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
    route: '/lets',
    badge: 5,
    category: 'education',
    keywords: ['aprender', 'educación', 'cursos'],
  },
  {
    id: 'challenges',
    title: 'Challenges',
    subtitle: 'Retos',
    description: 'Supérate cada día',
    icon: EmojiEventsIcon,
    gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    route: '/challenges',
    badge: 2,
    category: 'gamification',
    keywords: ['retos', 'desafíos', 'logros'],
  },
  {
    id: 'wallet',
    title: 'Wallet',
    subtitle: 'Finanzas',
    description: 'Gestiona tu dinero',
    icon: AccountBalanceWalletIcon,
    gradient: 'linear-gradient(135deg, #00BCD4, #26C6DA)',
    route: '/wallet',
    badge: 0,
    category: 'finance',
    keywords: ['dinero', 'finanzas', 'pagos'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Estadísticas',
    description: 'Tu progreso',
    icon: AnalyticsIcon,
    gradient: 'linear-gradient(135deg, #607D8B, #78909C)',
    route: '/analytics',
    badge: 0,
    category: 'analytics',
    keywords: ['estadísticas', 'progreso', 'métricas'],
  },
  {
    id: 'ai',
    title: 'AI Assistant',
    subtitle: 'Inteligencia',
    description: 'Tu asistente IA',
    icon: PsychologyIcon,
    gradient: 'linear-gradient(135deg, #673AB7, #9575CD)',
    route: '/ai-assistant',
    badge: 1,
    category: 'ai',
    keywords: ['IA', 'asistente', 'inteligencia'],
  },
];

const QuickActionsGridRevolutionary: React.FC<
  QuickActionsGridRevolutionaryProps
> = ({ onActionClick }) => {
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; color: string }>
  >([]);

  // ✨ Generar partículas temáticas
  useEffect(() => {
    const generateParticles = () => {
      const colors = [
        '#E91E63',
        '#2196F3',
        '#FF9800',
        '#4CAF50',
        '#9C27B0',
        '#00BCD4',
      ];
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: `action-particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (action: (typeof quickActions)[0]) => {
    if (onActionClick) {
      onActionClick(action.id);
    }
    navigate(action.route);
  };

  return (
    <Box
      className="revolutionary-card"
      sx={{
        position: 'relative',
        background: 'var(--revolutionary-glass-medium)',
        backdropFilter: 'var(--revolutionary-blur-medium)',
        border: '2px solid var(--revolutionary-glass-strong)',
        borderRadius: 'var(--revolutionary-radius-xl)',
        padding: { xs: 2, sm: 3 },
        overflow: 'hidden',
      }}
    >
      {/* ✨ Partículas de Acciones */}
      <Box className="revolutionary-particles">
        {particles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
              animation: 'revolutionary-sparkle 2.5s ease-in-out infinite',
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          />
        ))}
      </Box>

      {/* 🎨 Borde Gradiente Superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background:
            'conic-gradient(from 0deg, #E91E63, #2196F3, #FF9800, #4CAF50, #9C27B0, #00BCD4, #E91E63)',
          opacity: 0.8,
        }}
      />

      {/* 📱 Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          className="revolutionary-text-gradient"
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.4rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #E91E63, #9C27B0, #2196F3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          ⚡ Acciones Rápidas
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
          }}
        >
          Tu centro de control multimodal
        </Typography>
      </Box>

      {/* 🎯 Grid de Acciones */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.5, sm: 2 },
          position: 'relative',
          zIndex: 2,
        }}
      >
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          const isHovered = hoveredAction === action.id;

          return (
            <Tooltip
              key={action.id}
              title={
                <Box sx={{ textAlign: 'center', p: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {action.description}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      gap: 0.5,
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {action.keywords.map((keyword, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '0.65rem',
                        }}
                      >
                        {keyword}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              }
              arrow
              placement="top"
            >
              <Box
                className="revolutionary-interactive"
                onClick={() => handleActionClick(action)}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                sx={{
                  position: 'relative',
                  background: isHovered
                    ? `${action.gradient}20`
                    : 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--revolutionary-radius-lg)',
                  border: isHovered
                    ? `2px solid ${action.gradient.split(',')[0].split('(')[1]}40`
                    : '1px solid rgba(255, 255, 255, 0.15)',
                  padding: { xs: 1.5, sm: 2 },
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition:
                    'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isHovered
                    ? 'translateY(-4px) scale(1.05)'
                    : 'translateY(0) scale(1)',
                  boxShadow: isHovered
                    ? `0 12px 32px ${action.gradient.split(',')[0].split('(')[1]}30`
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transition: 'left 0.6s ease',
                    ...(isHovered && { left: '100%' }),
                  },
                }}
              >
                {/* 🔔 Badge de Notificaciones */}
                {action.badge > 0 && (
                  <Badge
                    badgeContent={action.badge}
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      '& .MuiBadge-badge': {
                        background: 'linear-gradient(135deg, #FF4444, #FF6B6B)',
                        boxShadow: '0 2px 8px rgba(255, 68, 68, 0.4)',
                        animation: isHovered
                          ? 'revolutionary-fab-pulse 1s ease-in-out infinite'
                          : 'none',
                      },
                    }}
                  >
                    <Box />
                  </Badge>
                )}

                {/* 🎨 Icono Principal */}
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: '50%',
                    background: action.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: `0 8px 24px ${action.gradient.split(',')[0].split('(')[1]}40`,
                    transition: 'all 0.3s ease',
                    transform: isHovered
                      ? 'scale(1.1) rotate(5deg)'
                      : 'scale(1) rotate(0deg)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <IconComponent
                    sx={{
                      color: 'white',
                      fontSize: { xs: '1.5rem', sm: '1.8rem' },
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                  />
                </Box>

                {/* 📝 Información */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: 0.5,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {action.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 500,
                    }}
                  >
                    {action.subtitle}
                  </Typography>
                </Box>

                {/* 🌟 Efecto de Resplandor */}
                {isHovered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '120%',
                      height: '120%',
                      background: action.gradient,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.15,
                      animation:
                        'revolutionary-glow-pulse 2s ease-in-out infinite',
                      zIndex: 0,
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* 💡 Sugerencia Inteligente */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--revolutionary-radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <FlashOnIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
          "Tip: Usa las teclas numéricas 1-8 para acceso rápido"
          <FlashOnIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
        </Typography>
      </Box>

      {/* 🌈 Efecto de Fondo Rotatorio */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background:
            'conic-gradient(from 0deg, #E91E6310, #2196F310, #FF980010, #4CAF5010, #9C27B010, #00BCD410)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 30s linear infinite',
          opacity: 0.6,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default QuickActionsGridRevolutionary;
