import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';

import { useAuth } from '../../contexts/AuthContext';
import { useTimeOfDay } from '../../hooks/home/useTimeOfDay';

interface WelcomeHeaderRevolutionaryProps {
  onNotificationClick?: () => void;
  totalNotifications?: number;
}

// 🌅 Configuración de saludos por hora
const getGreetingByTime = (hour: number) => {
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 18) return 'Buenas tardes';
  if (hour >= 18 && hour < 22) return 'Buenas noches';
  return 'Buenas madrugadas';
};

// ✨ Configuración de energía elemental
const getElementalMood = () => {
  const hour = new Date().getHours();
  const day = new Date().getDay();

  if (hour >= 6 && hour < 10) return 'fire'; // Mañana energética
  if (hour >= 10 && hour < 14) return 'air'; // Mediodía claridad
  if (hour >= 14 && hour < 18) return 'earth'; // Tarde estabilidad
  if (hour >= 18 && hour < 22) return 'water'; // Noche fluidez
  return 'power'; // Madrugada misterio
};

const WelcomeHeaderRevolutionary: React.FC<WelcomeHeaderRevolutionaryProps> = ({
  onNotificationClick,
  totalNotifications = 0,
}) => {
  const { user } = useAuth();
  const { timeOfDay, formattedTime } = useTimeOfDay();
  const [displayName, setDisplayName] = useState('Coomuner');
  const [isAnimating, setIsAnimating] = useState(true);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; delay: number }>
  >([]);

  // 🎭 Configuración dinámica por elemento
  const elementalConfig = useMemo(() => {
    const mood = getElementalMood();

    const configs = {
      fire: {
        gradient: 'linear-gradient(135deg, #FF6B35, #FF8A50, #FFB366)',
        icon: LocalFireDepartmentIcon,
        bgGradient:
          'radial-gradient(circle at 30% 30%, rgba(255, 107, 53, 0.2) 0%, transparent 60%)',
        mood: 'Energético',
        energy: '🔥',
        particleColor: '#FF6B35',
      },
      water: {
        gradient: 'linear-gradient(135deg, #00BCD4, #26C6DA, #4DD0E1)',
        icon: WaterDropIcon,
        bgGradient:
          'radial-gradient(circle at 70% 30%, rgba(0, 188, 212, 0.2) 0%, transparent 60%)',
        mood: 'Fluido',
        energy: '💧',
        particleColor: '#00BCD4',
      },
      earth: {
        gradient: 'linear-gradient(135deg, #66BB6A, #81C784, #A5D6A7)',
        icon: TerrainIcon,
        bgGradient:
          'radial-gradient(circle at 50% 70%, rgba(102, 187, 106, 0.2) 0%, transparent 60%)',
        mood: 'Estable',
        energy: '🌍',
        particleColor: '#66BB6A',
      },
      air: {
        gradient: 'linear-gradient(135deg, #FFD54F, #FFEB3B, #FFF176)',
        icon: AirIcon,
        bgGradient:
          'radial-gradient(circle at 80% 80%, rgba(255, 213, 79, 0.2) 0%, transparent 60%)',
        mood: 'Claro',
        energy: '💨',
        particleColor: '#FFD54F',
      },
      power: {
        gradient: 'linear-gradient(135deg, #9C27B0, #AB47BC, #BA68C8)',
        icon: DiamondIcon,
        bgGradient:
          'radial-gradient(circle at 40% 60%, rgba(156, 39, 176, 0.2) 0%, transparent 60%)',
        mood: 'Místico',
        energy: '🔮',
        particleColor: '#9C27B0',
      },
    };

    return configs[mood];
  }, [timeOfDay]);

  // 🎯 Generar partículas flotantes
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: `particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, []);

  // 👤 Configurar nombre de usuario
  useEffect(() => {
    if (user?.nombre) {
      setDisplayName(user.nombre);
    } else if (user?.username) {
      setDisplayName(user.username);
    }
  }, [user]);

  // ⚡ Animación inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const currentHour = new Date().getHours();
  const greeting = getGreetingByTime(currentHour);
  const ElementIcon = elementalConfig.icon;

  return (
    <Box
      className="revolutionary-card revolutionary-card-hero"
      sx={{
        position: 'relative',
        background: `${elementalConfig.bgGradient}, var(--revolutionary-glass-medium)`,
        backdropFilter: 'var(--revolutionary-blur-medium)',
        border: '2px solid var(--revolutionary-glass-strong)',
        borderRadius: 'var(--revolutionary-radius-xl)',
        padding: { xs: 2, sm: 3, md: 4 },
        mb: 3,
        overflow: 'hidden',
        minHeight: { xs: 200, sm: 240, md: 280 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
        opacity: isAnimating ? 0 : 1,
        transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      {/* ✨ Partículas Flotantes */}
      <Box className="revolutionary-particles">
        {particles.map((particle) => (
          <Box
            key={particle.id}
            className="revolutionary-particle"
            sx={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: elementalConfig.particleColor,
              animationDelay: `${particle.delay}s`,
              boxShadow: `0 0 10px ${elementalConfig.particleColor}`,
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
          background: elementalConfig.gradient,
          opacity: 0.8,
        }}
      />

      {/* 📱 Header Principal */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* 👤 Avatar y Saludo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: { xs: 60, sm: 70, md: 80 },
              height: { xs: 60, sm: 70, md: 80 },
              background: elementalConfig.gradient,
              boxShadow: `0 8px 32px ${elementalConfig.particleColor}40`,
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
              animation: 'revolutionary-glow-pulse 3s ease-in-out infinite',
            }}
          >
            <ElementIcon sx={{ fontSize: 'inherit', color: 'white' }} />
          </Avatar>

          <Box>
            <Typography
              variant="h4"
              className="revolutionary-text-gradient"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                fontWeight: 700,
                background: elementalConfig.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            >
              {greeting}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                fontWeight: 500,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {displayName}
            </Typography>
          </Box>
        </Box>

        {/* 🔔 Notificaciones con Badge */}
        <Tooltip title="Notificaciones" arrow>
          <IconButton
            onClick={onNotificationClick}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Badge badgeContent={totalNotifications} color="error">
              <AutoAwesomeIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* ⏰ Información Temporal y Estado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* 🕐 Tiempo Actual */}
        <Chip
          icon={<WavingHandIcon />}
          label={formattedTime}
          sx={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: 'white',
              animation: 'revolutionary-glow-pulse 2s ease-in-out infinite',
            },
          }}
        />

        {/* 🎭 Estado Elemental */}
        <Chip
          icon={<BoltIcon />}
          label={`Estado ${elementalConfig.mood} ${elementalConfig.energy}`}
          sx={{
            background: `${elementalConfig.gradient}20`,
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: `1px solid ${elementalConfig.particleColor}40`,
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: elementalConfig.particleColor,
            },
          }}
        />

        {/* ⭐ Badge de Estatus */}
        <Chip
          icon={<StarIcon />}
          label="Coomuner Activo"
          sx={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
            '& .MuiChip-icon': {
              color: 'white',
              animation: 'revolutionary-sparkle 2s ease-in-out infinite',
            },
          }}
        />
      </Box>

      {/* 💫 Mensaje Motivacional */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--revolutionary-radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontStyle: 'italic',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <FavoriteIcon sx={{ color: '#E91E63', fontSize: '1.2rem' }} />
          "Tu energía elemental está en perfecta armonía hoy"
          <AutoAwesomeIcon sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
        </Typography>
      </Box>

      {/* 🌟 Efecto de Resplandor de Fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background: `conic-gradient(from 0deg, ${elementalConfig.particleColor}20, transparent, ${elementalConfig.particleColor}10, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 20s linear infinite',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default WelcomeHeaderRevolutionary;
