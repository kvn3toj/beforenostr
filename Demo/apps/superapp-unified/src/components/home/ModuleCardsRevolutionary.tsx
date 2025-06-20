import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface ModuleCardsRevolutionaryProps {
  onModuleClick?: (moduleId: string) => void;
}

// 🎯 Configuración de módulos principales
const moduleConfigs = [
  {
    id: 'uplay',
    title: 'UPlay Entertainment',
    subtitle: 'Centro de Entretenimiento',
    description: 'Videos, juegos y diversión sin límites',
    icon: SportsEsportsIcon,
    gradient: 'linear-gradient(135deg, #E91E63, #F06292, #F8BBD9)',
    route: '/uplay',
    stats: {
      userProgress: 78,
      totalUsers: '2.4K',
      weeklyActivity: '+24%',
      lastActivity: '2h',
    },
    features: ['Videos Interactivos', 'Logros', 'Competencias', 'Streaming'],
    status: 'active',
    badge: 'Nuevo contenido',
    category: 'entertainment',
  },
  {
    id: 'social',
    title: 'Social Community',
    subtitle: 'Red Social Inteligente',
    description: 'Conecta, comparte y crece con la comunidad',
    icon: GroupsIcon,
    gradient: 'linear-gradient(135deg, #2196F3, #42A5F5, #90CAF9)',
    route: '/social',
    stats: {
      userProgress: 92,
      totalUsers: '8.7K',
      weeklyActivity: '+18%',
      lastActivity: '15m',
    },
    features: ['Chat en Vivo', 'Comunidades', 'Eventos', 'Matching'],
    status: 'trending',
    badge: '🔥 Trending',
    category: 'social',
  },
  {
    id: 'lets',
    title: 'Lets Education',
    subtitle: 'Plataforma Educativa',
    description: 'Aprende, enseña y comparte conocimiento',
    icon: SchoolIcon,
    gradient: 'linear-gradient(135deg, #4CAF50, #66BB6A, #A5D6A7)',
    route: '/lets',
    stats: {
      userProgress: 65,
      totalUsers: '3.2K',
      weeklyActivity: '+12%',
      lastActivity: '1d',
    },
    features: ['Cursos Online', 'Certificaciones', 'Mentorías', 'AI Tutor'],
    status: 'growing',
    badge: 'Certificación',
    category: 'education',
  },
  {
    id: 'marketplace',
    title: 'Marketplace Hub',
    subtitle: 'Comercio Inteligente',
    description: 'Compra, vende y intercambia de forma segura',
    icon: ShoppingCartIcon,
    gradient: 'linear-gradient(135deg, #FF9800, #FFB74D, #FFE0B2)',
    route: '/marketplace',
    stats: {
      userProgress: 88,
      totalUsers: '5.1K',
      weeklyActivity: '+31%',
      lastActivity: '3h',
    },
    features: ['P2P Trading', 'Subastas', 'Crypto Payments', 'Reviews'],
    status: 'hot',
    badge: '💎 Premium',
    category: 'commerce',
  },
  {
    id: 'challenges',
    title: 'Challenges Arena',
    subtitle: 'Sistema de Retos',
    description: 'Supérate con desafíos personalizados',
    icon: EmojiEventsIcon,
    gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8, #E1BEE7)',
    route: '/challenges',
    stats: {
      userProgress: 73,
      totalUsers: '1.8K',
      weeklyActivity: '+45%',
      lastActivity: '6h',
    },
    features: ['Retos Diarios', 'Competencias', 'Rewards', 'Leaderboards'],
    status: 'competitive',
    badge: '⚡ Desafío',
    category: 'gamification',
  },
  {
    id: 'wallet',
    title: 'Wallet Manager',
    subtitle: 'Finanzas Personales',
    description: 'Gestiona tu patrimonio digital y físico',
    icon: AccountBalanceWalletIcon,
    gradient: 'linear-gradient(135deg, #00BCD4, #26C6DA, #B2EBF2)',
    route: '/wallet',
    stats: {
      userProgress: 95,
      totalUsers: '6.3K',
      weeklyActivity: '+8%',
      lastActivity: '30m',
    },
    features: ['Multi-Currency', 'DeFi Integration', 'Analytics', 'Security'],
    status: 'secure',
    badge: '🔐 Seguro',
    category: 'finance',
  },
];

const ModuleCardsRevolutionary: React.FC<ModuleCardsRevolutionaryProps> = ({
  onModuleClick,
}) => {
  const navigate = useNavigate();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; moduleId: string }>
  >([]);

  // ✨ Generar partículas por módulo
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Array<{
        id: string;
        x: number;
        y: number;
        moduleId: string;
      }> = [];

      moduleConfigs.forEach((module) => {
        for (let i = 0; i < 3; i++) {
          newParticles.push({
            id: `${module.id}-particle-${i}`,
            x: Math.random() * 100,
            y: Math.random() * 100,
            moduleId: module.id,
          });
        }
      });

      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleModuleClick = (module: (typeof moduleConfigs)[0]) => {
    if (onModuleClick) {
      onModuleClick(module.id);
    }
    navigate(module.route);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'trending':
        return '🔥';
      case 'hot':
        return '🚀';
      case 'growing':
        return '📈';
      case 'competitive':
        return '⚔️';
      case 'secure':
        return '🛡️';
      default:
        return '✨';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trending':
        return '#FF4444';
      case 'hot':
        return '#FF6B35';
      case 'growing':
        return '#4CAF50';
      case 'competitive':
        return '#9C27B0';
      case 'secure':
        return '#00BCD4';
      default:
        return '#2196F3';
    }
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
      {/* 🎨 Borde Gradiente Superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background:
            'conic-gradient(from 0deg, #E91E63, #2196F3, #4CAF50, #FF9800, #9C27B0, #00BCD4, #E91E63)',
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
            background: 'linear-gradient(135deg, #E91E63, #2196F3, #4CAF50)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          🎯 Módulos Principales
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
          }}
        >
          Tu ecosistema completo de aplicaciones
        </Typography>
      </Box>

      {/* 🌟 Grid de Módulos */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 2.5 },
          position: 'relative',
          zIndex: 2,
        }}
      >
        {moduleConfigs.map((module) => {
          const IconComponent = module.icon;
          const isHovered = hoveredModule === module.id;
          const moduleParticles = particles.filter(
            (p) => p.moduleId === module.id
          );

          return (
            <Box
              key={module.id}
              className="revolutionary-interactive"
              onClick={() => handleModuleClick(module)}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
              sx={{
                position: 'relative',
                background: isHovered
                  ? `${module.gradient}15`
                  : 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--revolutionary-radius-lg)',
                border: isHovered
                  ? `2px solid ${module.gradient.split(',')[0].split('(')[1]}60`
                  : '1px solid rgba(255, 255, 255, 0.15)',
                padding: { xs: 2, sm: 2.5 },
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isHovered
                  ? 'translateY(-6px) scale(1.02)'
                  : 'translateY(0) scale(1)',
                boxShadow: isHovered
                  ? `0 16px 48px ${module.gradient.split(',')[0].split('(')[1]}30`
                  : '0 4px 16px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                minHeight: 280,
              }}
            >
              {/* ✨ Partículas del Módulo */}
              {moduleParticles.map((particle) => (
                <Box
                  key={particle.id}
                  sx={{
                    position: 'absolute',
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: module.gradient
                      .split(',')[0]
                      .split('(')[1],
                    boxShadow: `0 0 8px ${module.gradient.split(',')[0].split('(')[1]}`,
                    animation: 'revolutionary-sparkle 3s ease-in-out infinite',
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}

              {/* 🏷️ Badge de Estado */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Chip
                  label={module.badge}
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${getStatusColor(module.status)}, ${getStatusColor(module.status)}CC)`,
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    height: 24,
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
                <Box sx={{ fontSize: '1rem' }}>
                  {getStatusIcon(module.status)}
                </Box>
              </Box>

              {/* 🎨 Icono y Header */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: module.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: `0 8px 32px ${module.gradient.split(',')[0].split('(')[1]}40`,
                    transition: 'all 0.3s ease',
                    transform: isHovered
                      ? 'scale(1.1) rotate(10deg)'
                      : 'scale(1) rotate(0deg)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <IconComponent
                    sx={{
                      color: 'white',
                      fontSize: '2rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    mb: 0.5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {module.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {module.subtitle}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}
                >
                  {module.description}
                </Typography>
              </Box>

              {/* 📊 Estadísticas */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.75rem',
                    }}
                  >
                    Progreso Personal
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {module.stats.userProgress}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={module.stats.userProgress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: module.gradient,
                      borderRadius: 3,
                    },
                  }}
                />

                {/* 📈 Métricas */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                    mt: 1.5,
                  }}
                >
                  <Tooltip title="Usuarios Activos">
                    <Box sx={{ textAlign: 'center' }}>
                      <GroupIcon
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '1rem',
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {module.stats.totalUsers}
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title="Crecimiento Semanal">
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingUpIcon
                        sx={{ color: '#4CAF50', fontSize: '1rem', mb: 0.5 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#4CAF50',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {module.stats.weeklyActivity}
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title="Última Actividad">
                    <Box sx={{ textAlign: 'center' }}>
                      <AccessTimeIcon
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '1rem',
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {module.stats.lastActivity}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              {/* 🎯 Features */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    justifyContent: 'center',
                  }}
                >
                  {module.features.slice(0, 3).map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.65rem',
                        height: 20,
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* 🚀 Botón de Acción */}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: module.gradient,
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 'var(--revolutionary-radius-md)',
                  boxShadow: `0 4px 16px ${module.gradient.split(',')[0].split('(')[1]}40`,
                  '&:hover': {
                    background: module.gradient,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${module.gradient.split(',')[0].split('(')[1]}50`,
                  },
                }}
              >
                Explorar {module.title.split(' ')[0]} →
              </Button>

              {/* 🌟 Efecto de Resplandor */}
              {isHovered && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '140%',
                    height: '140%',
                    background: module.gradient,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.1,
                    animation:
                      'revolutionary-glow-pulse 2s ease-in-out infinite',
                    zIndex: 0,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* 🌈 Efecto de Fondo Rotatorio */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '180%',
          height: '180%',
          background:
            'conic-gradient(from 0deg, #E91E6308, #2196F308, #4CAF5008, #FF980008, #9C27B008, #00BCD408)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 40s linear infinite',
          opacity: 0.4,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default ModuleCardsRevolutionary;
