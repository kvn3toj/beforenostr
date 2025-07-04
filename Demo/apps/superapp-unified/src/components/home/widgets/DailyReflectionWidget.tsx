import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';

interface ReflectionData {
  id: string;
  message: string;
  author?: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'universal';
  category: 'reciprocidad' | 'wisdom' | 'community' | 'growth' | 'balance';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'universal';
}

// 🌅 Reflexiones categorizadas por elemento y momento del día
const dailyReflections: ReflectionData[] = [
  // 🔥 Fuego - Energía y Acción
  {
    id: 'fire-1',
    message:
      'Cada acción que realizas con pasión genuina enciende la llama del progreso colectivo',
    element: 'fire',
    category: 'reciprocidad',
    timeOfDay: 'morning',
  },
  {
    id: 'fire-2',
    message:
      'La energía que compartes hoy se transforma en la luz que ilumina el camino de otros mañana',
    element: 'fire',
    category: 'community',
    timeOfDay: 'universal',
  },

  // 💧 Agua - Fluidez y Adaptación
  {
    id: 'water-1',
    message:
      'Como el agua que se adapta a su cauce, tu flexibilidad nutre el crecimiento de toda la comunidad',
    element: 'water',
    category: 'balance',
    timeOfDay: 'afternoon',
  },
  {
    id: 'water-2',
    message:
      'En cada fluir de tu generosidad, se tejen las ondas del bienestar compartido',
    element: 'water',
    category: 'reciprocidad',
    timeOfDay: 'universal',
  },

  // 🌍 Tierra - Estabilidad y Crecimiento
  {
    id: 'earth-1',
    message:
      'Tus raíces profundas en los valores del bien común sostienen el bosque entero de la comunidad',
    element: 'earth',
    category: 'wisdom',
    timeOfDay: 'evening',
  },
  {
    id: 'earth-2',
    message:
      'Cada semilla de conocimiento que plantas germinará en sabiduría para las futuras generaciones',
    element: 'earth',
    category: 'growth',
    timeOfDay: 'universal',
  },

  // 💨 Aire - Comunicación e Ideas
  {
    id: 'air-1',
    message:
      'Tus palabras y ideas viajan como vientos que conectan corazones y transforman realidades',
    element: 'air',
    category: 'community',
    timeOfDay: 'morning',
  },
  {
    id: 'air-2',
    message:
      'En el intercambio libre de ideas se encuentra la respiración vital de una comunidad próspera',
    element: 'air',
    category: 'wisdom',
    timeOfDay: 'universal',
  },

  // ✨ Universal - Equilibrio y Totalidad
  {
    id: 'universal-1',
    message:
      'En cada acción de Reciprocidad, equilibras tu camino y contribuyes al tejido sagrado del Bien Común',
    element: 'universal',
    category: 'reciprocidad',
    timeOfDay: 'universal',
  },
  {
    id: 'universal-2',
    message:
      'La verdadera riqueza se mide en la cantidad de vidas que has tocado positivamente',
    element: 'universal',
    category: 'community',
    timeOfDay: 'evening',
  },
];

export const DailyReflectionWidget: React.FC = () => {
  const [currentReflection, setCurrentReflection] =
    useState<ReflectionData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; color: string }>
  >([]);

  // 🎨 Configuración de elementos
  const elementConfig = useMemo(
    () => ({
      fire: {
        gradient: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
        icon: LocalFireDepartmentIcon,
        color: '#FF6B35',
        particleColor: '#FF6B35',
      },
      water: {
        gradient: 'linear-gradient(135deg, #00BCD4, #4FC3F7)',
        icon: WaterDropIcon,
        color: '#00BCD4',
        particleColor: '#00BCD4',
      },
      earth: {
        gradient: 'linear-gradient(135deg, #66BB6A, #81C784)',
        icon: TerrainIcon,
        color: '#66BB6A',
        particleColor: '#66BB6A',
      },
      air: {
        gradient: 'linear-gradient(135deg, #FFD54F, #FFF176)',
        icon: AirIcon,
        color: '#FFD54F',
        particleColor: '#FFD54F',
      },
      universal: {
        gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
        icon: StarIcon,
        color: '#9C27B0',
        particleColor: '#9C27B0',
      },
    }),
    []
  );

  // 🕐 Determinar momento del día
  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  // 🎯 Seleccionar reflexión apropiada
  const selectReflection = () => {
    const timeOfDay = getCurrentTimeOfDay();
    const availableReflections = dailyReflections.filter(
      (r) => r.timeOfDay === timeOfDay || r.timeOfDay === 'universal'
    );

    // Seleccionar aleatoriamente de las reflexiones apropiadas
    const randomIndex = Math.floor(Math.random() * availableReflections.length);
    return availableReflections[randomIndex] || dailyReflections[0];
  };

  // 🌟 Inicializar reflexión del día
  useEffect(() => {
    setCurrentReflection(selectReflection());
  }, []);

  // ✨ Generar partículas temáticas
  useEffect(() => {
    if (!currentReflection) return;

    const generateParticles = () => {
      const config = elementConfig[currentReflection.element];
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: `reflection-particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: config.particleColor,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 4000);
    return () => clearInterval(interval);
  }, [currentReflection, elementConfig]);

  // 🔄 Cambiar reflexión
  const handleRefreshReflection = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentReflection(selectReflection());
      setIsVisible(true);
    }, 300);
  };

  // 📤 Compartir reflexión
  const handleShareReflection = () => {
    if (!currentReflection) return;

    if (navigator.share) {
      navigator.share({
        title: 'Reflexión CoomÜnity',
        text: `"${currentReflection.message}" - CoomÜnity SuperApp`,
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(
        `"${currentReflection.message}" - CoomÜnity SuperApp`
      );
      // Aquí podrías mostrar una notificación de éxito
    }
  };

  if (!currentReflection) return null;

  const config = elementConfig[currentReflection.element];
  const ElementIcon = config.icon;

  return (
    <Fade in={isVisible} timeout={800}>
      <Paper
        className="revolutionary-card"
        sx={{
          position: 'relative',
          background: 'var(--revolutionary-glass-medium)',
          backdropFilter: 'var(--revolutionary-blur-medium)',
          border: '2px solid var(--revolutionary-glass-strong)',
          borderRadius: 'var(--revolutionary-radius-xl)',
          padding: { xs: 3, sm: 4, md: 5 },
          overflow: 'hidden',
          textAlign: 'center',
          minHeight: { xs: 200, sm: 240, md: 280 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* ✨ Partículas Temáticas */}
        <Box className="revolutionary-particles">
          {particles.map((particle) => (
            <Box
              key={particle.id}
              sx={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
                animation: 'revolutionary-sparkle 3s ease-in-out infinite',
                animationDelay: `${Math.random() * 2}s`,
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
            height: '4px',
            background: config.gradient,
            opacity: 0.8,
          }}
        />

        {/* 🌟 Icono Elemental */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: { xs: 60, sm: 70, md: 80 },
              height: { xs: 60, sm: 70, md: 80 },
              borderRadius: '50%',
              background: config.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 32px ${config.color}40`,
              animation: 'revolutionary-glow-pulse 3s ease-in-out infinite',
            }}
          >
            <ElementIcon
              sx={{
                color: 'white',
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem' },
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          </Box>
        </Box>

        {/* 💭 Mensaje de Reflexión */}
        <Typography
          variant="h5"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            fontWeight: 500,
            lineHeight: 1.6,
            fontStyle: 'italic',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            mb: 4,
            maxWidth: '90%',
            margin: '0 auto 2rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          "{currentReflection.message}"
        </Typography>

        {/* 🎯 Categoría y Acciones */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* 🏷️ Etiqueta de Categoría */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: `${config.color}20`,
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: 'var(--revolutionary-radius-lg)',
              border: `1px solid ${config.color}40`,
            }}
          >
            <AutoAwesomeIcon sx={{ color: config.color, fontSize: '1rem' }} />
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {currentReflection.category}
            </Typography>
          </Box>

          {/* 🔄 Botón Refresh */}
          <Tooltip title="Nueva reflexión" arrow>
            <IconButton
              onClick={handleRefreshReflection}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1) rotate(180deg)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* 📤 Botón Compartir */}
          <Tooltip title="Compartir reflexión" arrow>
            <IconButton
              onClick={handleShareReflection}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 🌈 Efecto de Fondo Elemental */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: `radial-gradient(circle at center bottom, ${config.color}15 0%, transparent 70%)`,
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        {/* ✨ Efecto de Resplandor Rotatorio */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            height: '120%',
            background: `conic-gradient(from 0deg, ${config.color}20, transparent, ${config.color}10, transparent)`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'revolutionary-rotate-continuous 25s linear infinite',
            opacity: 0.4,
            zIndex: 0,
          }}
        />
      </Paper>
    </Fade>
  );
};
