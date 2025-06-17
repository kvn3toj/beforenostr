import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import BalanceIcon from '@mui/icons-material/Balance';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterIcon from '@mui/icons-material/Water';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PublicIcon from '@mui/icons-material/Public';

// Importar sistema de partículas
import EnhancedParticles from './EnhancedParticles';

interface ElementData {
  name: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  description: string;
  recommendations: string[];
  orbitRadius: number;
  orbitRadiusY: number; // Para órbitas elípticas
  angle: number;
  speed: number; // Velocidad de rotación individual
  size: number; // Tamaño de la esfera
  tilt: number; // Inclinación orbital
}

interface PersonalizedInsight {
  type: 'strength' | 'opportunity' | 'balance' | 'action';
  message: string;
  icon: React.ReactElement;
  color: string;
}

interface ElementRecommendation {
  element: string;
  action: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

interface AyniBalanceVisualizationProps {
  balanceAyni: number;
  elementos: {
    fuego: number;
    agua: number;
    tierra: number;
    aire: number;
  };
  className?: string;
  userLevel?: string;
  recentActivity?: {
    streak: number;
    lastInteraction: Date;
    totalContributions: number;
  };
}

export const AyniBalanceVisualization: React.FC<
  AyniBalanceVisualizationProps
> = ({
  balanceAyni,
  elementos,
  className = '',
  userLevel = 'Colaborador',
  recentActivity = {
    streak: 5,
    lastInteraction: new Date(),
    totalContributions: 25,
  },
}) => {
  const theme = useTheme();
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedElements, setAnimatedElements] = useState({
    fuego: 0,
    agua: 0,
    tierra: 0,
    aire: 0,
  });
  const [expanded, setExpanded] = useState(false);
  const [orbitalRotation, setOrbitalRotation] = useState(0);
  const [planetRotation, setPlanetRotation] = useState(0);
  const [backgroundRotation, setBackgroundRotation] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [animationTick, setAnimationTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🎨 Animación de entrada suave
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBalance(balanceAyni);
      setAnimatedElements(elementos);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [balanceAyni, elementos]);

  // 🪐 Sistema de rotaciones independientes - ÓRDEN CORRECTO
  const updateRotations = useCallback(() => {
    setOrbitalRotation((prev) => (prev + 0.3) % 360); // Órbitas lentas
    setPlanetRotation((prev) => (prev + 1.2) % 360); // Planeta más rápido, hacia la derecha
    setBackgroundRotation((prev) => (prev - 0.1) % 360); // Fondo lento, sentido contrario
    setAnimationTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const rotationInterval = setInterval(updateRotations, 50);
    return () => clearInterval(rotationInterval);
  }, [updateRotations]);

  // 🌟 Configuración Sistema Solar 3D - Como vista desde Júpiter
  const elementConfig: ElementData[] = useMemo(
    () => [
      {
        name: 'Fuego',
        value: animatedElements.fuego,
        icon: <LocalFireDepartmentIcon />,
        color: '#FF6B35',
        description: 'Pasión y acción',
        recommendations: [
          'Lidera un proyecto comunitario',
          'Participa en desafíos creativos',
          'Inspira a otros con tu energía',
        ],
        orbitRadius: 120, // Radio horizontal mayor
        orbitRadiusY: 80, // Radio vertical menor para elipse
        angle: 0 + orbitalRotation * 1.2, // Mercurio - más rápido
        speed: 1.2,
        size: 8,
        tilt: -15, // Inclinación orbital
      },
      {
        name: 'Agua',
        value: animatedElements.agua,
        icon: <WaterIcon />,
        color: '#4FC3F7',
        description: 'Fluir y adaptabilidad',
        recommendations: [
          'Colabora en intercambios Ayni',
          'Adapta tu enfoque a nuevos retos',
          'Cultiva la flexibilidad emocional',
        ],
        orbitRadius: 150, // Venus
        orbitRadiusY: 100,
        angle: 90 + orbitalRotation * 1.0,
        speed: 1.0,
        size: 10,
        tilt: 10,
      },
      {
        name: 'Tierra',
        value: animatedElements.tierra,
        icon: <TerrainIcon />,
        color: '#8BC34A',
        description: 'Estabilidad y confianza',
        recommendations: [
          'Construye relaciones duraderas',
          'Mantén constancia en tus hábitos',
          'Sé el pilar de tu comunidad',
        ],
        orbitRadius: 180, // Tierra
        orbitRadiusY: 120,
        angle: 180 + orbitalRotation * 0.8,
        speed: 0.8,
        size: 12,
        tilt: 0, // Tierra como referencia
      },
      {
        name: 'Aire',
        value: animatedElements.aire,
        icon: <AirIcon />,
        color: '#FFD54F',
        description: 'Comunicación e ideas',
        recommendations: [
          'Comparte conocimiento abiertamente',
          'Facilita conversaciones significativas',
          'Conecta personas con ideas afines',
        ],
        orbitRadius: 220, // Marte
        orbitRadiusY: 140,
        angle: 270 + orbitalRotation * 0.6,
        speed: 0.6,
        size: 9,
        tilt: 20,
      },
    ],
    [animatedElements, orbitalRotation]
  );

  // 🤖 Generar insights personalizados basados en IA
  const personalizedInsights = useMemo((): PersonalizedInsight[] => {
    const insights: PersonalizedInsight[] = [];
    const total =
      animatedElements.fuego +
      animatedElements.agua +
      animatedElements.tierra +
      animatedElements.aire;
    const average = total / 4;

    // Análisis de fortalezas
    const strongest = elementConfig.reduce((max, element) =>
      element.value > max.value ? element : max
    );

    if (strongest.value > average + 15) {
      insights.push({
        type: 'strength',
        message: `Tu ${strongest.name.toLowerCase()} está especialmente desarrollado. ¡Aprovecha esta fortaleza para liderar!`,
        icon: strongest.icon,
        color: strongest.color,
      });
    }

    // Análisis de oportunidades
    const weakest = elementConfig.reduce((min, element) =>
      element.value < min.value ? element : min
    );

    if (weakest.value < average - 10) {
      insights.push({
        type: 'opportunity',
        message: `Considera fortalecer tu ${weakest.name.toLowerCase()} para mayor equilibrio elemental.`,
        icon: <LightbulbIcon />,
        color: theme.palette.warning.main,
      });
    }

    // Análisis de balance general
    if (animatedBalance >= 0.8) {
      insights.push({
        type: 'balance',
        message:
          '¡Excelente equilibrio Ayni! Eres un ejemplo para la comunidad.',
        icon: <AutoAwesomeIcon />,
        color: theme.palette.success.main,
      });
    } else if (animatedBalance < 0.5) {
      insights.push({
        type: 'action',
        message:
          'Participa más en intercambios comunitarios para mejorar tu balance Ayni.',
        icon: <PsychologyIcon />,
        color: theme.palette.info.main,
      });
    }

    return insights;
  }, [animatedElements, animatedBalance, elementConfig, theme]);

  // 🎯 Calcular recomendaciones específicas por elemento
  const elementRecommendations = useMemo((): ElementRecommendation[] => {
    return elementConfig.map((element) => {
      let priority: 'high' | 'medium' | 'low' = 'medium';
      if (element.value < 60) priority = 'high';
      else if (element.value > 85) priority = 'low';

      return {
        element: element.name,
        action:
          element.recommendations[
            Math.floor(Math.random() * element.recommendations.length)
          ],
        impact:
          element.value < 60
            ? 'Alto impacto'
            : element.value > 85
              ? 'Mantener nivel'
              : 'Mejorar gradualmente',
        priority,
      };
    });
  }, [elementConfig]);

  // 🎯 Calcular el estado del balance
  const getBalanceStatus = (balance: number) => {
    if (balance >= 0.8)
      return {
        status: 'Excelente',
        color: theme.palette.success.main,
        icon: <TrendingUpIcon />,
      };
    if (balance >= 0.6)
      return {
        status: 'Bueno',
        color: theme.palette.info.main,
        icon: <TrendingUpIcon />,
      };
    if (balance >= 0.4)
      return {
        status: 'Regular',
        color: theme.palette.warning.main,
        icon: <TrendingDownIcon />,
      };
    return {
      status: 'Necesita atención',
      color: theme.palette.error.main,
      icon: <TrendingDownIcon />,
    };
  };

  const balanceStatus = getBalanceStatus(animatedBalance);

  // 🎨 Calcular el ángulo para el indicador circular
  const balanceAngle = animatedBalance * 360 - 90; // -90 para empezar desde arriba

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AyniBalanceVisualization - Sistema Solar 3D');
      // Limpiar intervals de rotación
      if (typeof window !== 'undefined') {
        console.log('🧹 Limpiando animaciones del sistema solar');
      }
    };
  }, []);

  // 🎯 Handlers de interacción (ORDEN CORRECTO)
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleElementClick = useCallback((elementName: string) => {
    setSelectedElement((prev) => (prev === elementName ? null : elementName));
  }, []);

  const handleElementHover = useCallback((elementName: string | null) => {
    // Efecto hover para elementos orbitales
    console.log('🎯 Element hover:', elementName);
  }, []);

  return (
    <Box
      ref={containerRef}
      className={`ayni-solar-system-universe ${className}`}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh', // Página completa
        minHeight: '600px',
        background: `
          radial-gradient(circle at 20% 30%, ${alpha('#FF6B35', 0.03)} 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, ${alpha('#4FC3F7', 0.03)} 0%, transparent 40%),
          radial-gradient(circle at 40% 80%, ${alpha('#8BC34A', 0.03)} 0%, transparent 40%),
          linear-gradient(135deg,
            ${alpha('#0a0a0a', 0.95)} 0%,
            ${alpha('#1a1a2e', 0.95)} 25%,
            ${alpha('#16213e', 0.95)} 50%,
            ${alpha('#0f1419', 0.95)} 75%,
            ${alpha('#0a0a0a', 0.95)} 100%
          )
        `,
        overflow: 'hidden',
        perspective: '2000px',
        transform: 'translateZ(0)', // Optimización GPU
      }}
    >
      {/* Fondo rotatorio verde/naranja separado del planeta principal */}
      <Box
        className="universe-background-orbital"
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: `
            linear-gradient(45deg,
              ${alpha('#8BC34A', 0.08)} 0%,
              transparent 25%,
              ${alpha('#FF6B35', 0.06)} 50%,
              transparent 75%,
              ${alpha('#8BC34A', 0.08)} 100%
            )
          `,
          transform: `rotate(${backgroundRotation}deg)`,
          transition: 'transform 0.1s linear',
          borderRadius: '50%',
          filter: 'blur(2px)',
          opacity: 0.3, // Menor opacidad para efecto de estrellas
          zIndex: 0,
        }}
      />

      {/* Campo de estrellas fijo */}
      <Box
        className="stars-field"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(1px 1px at 10px 20px, ${alpha('#fff', 0.6)}, transparent),
            radial-gradient(1px 1px at 190px 90px, ${alpha('#fff', 0.4)}, transparent),
            radial-gradient(1px 1px at 120px 180px, ${alpha('#fff', 0.8)}, transparent),
            radial-gradient(1px 1px at 300px 40px, ${alpha('#fff', 0.3)}, transparent),
            radial-gradient(1px 1px at 50px 160px, ${alpha('#fff', 0.5)}, transparent),
            radial-gradient(1px 1px at 250px 200px, ${alpha('#fff', 0.7)}, transparent),
            radial-gradient(1px 1px at 80px 60px, ${alpha('#fff', 0.4)}, transparent),
            radial-gradient(1px 1px at 340px 120px, ${alpha('#fff', 0.6)}, transparent)
          `,
          backgroundSize: '400px 300px, 500px 400px, 300px 250px, 450px 350px',
          backgroundRepeat: 'repeat',
          opacity: 0.6,
          zIndex: 1,
        }}
      />

      {/* Partículas flotantes cósmicas */}
      <EnhancedParticles
        type="glow"
        count={15}
        colors={['#fff', '#4FC3F7', '#FF6B35', '#8BC34A', '#FFD54F']}
        intensity="low"
        interactive={false}
      />

      {/* Contenedor del sistema solar 3D */}
      <Box
        className="solar-system-container"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          transformStyle: 'preserve-3d',
          zIndex: 2,
        }}
      >
        {/* Planeta central 3D - Esfera que gira sobre su propio eje */}
        <Box
          className="central-planet-sphere"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120px',
            height: '120px',
            transform: `translate(-50%, -50%) rotateY(${planetRotation}deg) rotateX(15deg)`,
            transformStyle: 'preserve-3d',
            zIndex: 5,
          }}
        >
          {/* Esfera 3D del planeta central */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 30% 30%, ${alpha(balanceStatus.color, 0.9)} 0%, ${alpha(balanceStatus.color, 0.7)} 40%, ${alpha(balanceStatus.color, 0.3)} 80%, transparent 100%),
                radial-gradient(circle at 70% 70%, ${alpha('#fff', 0.3)} 0%, transparent 30%),
                linear-gradient(135deg, ${balanceStatus.color} 0%, ${alpha(balanceStatus.color, 0.6)} 100%)
              `,
              boxShadow: `
                inset -20px -20px 40px ${alpha('#000', 0.3)},
                inset 10px 10px 20px ${alpha('#fff', 0.2)},
                0 0 40px ${alpha(balanceStatus.color, 0.6)},
                0 0 80px ${alpha(balanceStatus.color, 0.3)}
              `,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `
                  inset -20px -20px 40px ${alpha('#000', 0.3)},
                  inset 10px 10px 20px ${alpha('#fff', 0.2)},
                  0 0 60px ${alpha(balanceStatus.color, 0.8)},
                  0 0 120px ${alpha(balanceStatus.color, 0.4)}
                `,
              },
            }}
            onClick={handleExpandToggle}
          >
            {/* Icono del planeta */}
            <PublicIcon
              sx={{
                fontSize: '2rem',
                color: '#fff',
                mb: 0.5,
                textShadow: `0 0 10px ${alpha('#fff', 0.8)}`,
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))',
              }}
            />

            {/* Porcentaje de balance */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                textShadow: `0 0 10px ${alpha('#fff', 0.8)}`,
                fontSize: '1rem',
              }}
            >
              {Math.round(animatedBalance * 100)}%
            </Typography>

            {/* Superficie con textura de planeta */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    ${alpha('#fff', 0.05)} 2px,
                    ${alpha('#fff', 0.05)} 4px
                  )
                `,
                transform: `rotateY(${planetRotation * 2}deg)`,
                opacity: 0.6,
              }}
            />
          </Box>
        </Box>

        {/* Elementos orbitales como esferas 3D */}
        {elementConfig.map((element) => {
          // Calcular posición elíptica 3D
          const x =
            Math.cos((element.angle * Math.PI) / 180) * element.orbitRadius;
          const y =
            Math.sin((element.angle * Math.PI) / 180) * element.orbitRadiusY;
          const z =
            Math.sin(
              (element.angle * Math.PI) / 180 + (element.tilt * Math.PI) / 180
            ) * 20;

          return (
            <Box
              key={element.name}
              className="orbital-element-sphere"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${element.size * 2}px`,
                height: `${element.size * 2}px`,
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${planetRotation * element.speed}deg)`,
                transformStyle: 'preserve-3d',
                zIndex: 4,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${planetRotation * element.speed}deg) scale(1.3)`,
                },
              }}
              onClick={() => handleElementClick(element.name)}
            >
              {/* Esfera 3D del elemento */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 25% 25%, ${alpha('#fff', 0.4)} 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, ${alpha('#000', 0.3)} 0%, transparent 50%),
                    linear-gradient(135deg, ${element.color} 0%, ${alpha(element.color, 0.7)} 100%)
                  `,
                  boxShadow: `
                    inset -5px -5px 10px ${alpha('#000', 0.4)},
                    inset 3px 3px 6px ${alpha('#fff', 0.3)},
                    0 0 15px ${alpha(element.color, 0.6)},
                    0 0 30px ${alpha(element.color, 0.3)}
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  animation:
                    selectedElement === element.name
                      ? 'element-pulse 1s ease-in-out infinite'
                      : 'none',
                }}
              >
                {/* Icono del elemento */}
                <Box
                  sx={{
                    color: '#fff',
                    fontSize: `${element.size / 2}px`,
                    textShadow: `0 0 5px ${alpha('#fff', 0.8)}`,
                    transform: `rotateY(${-planetRotation * element.speed}deg)`, // Contrarotación para mantener icono visible
                  }}
                >
                  {element.icon}
                </Box>

                {/* Anillo orbital si está seleccionado */}
                {selectedElement === element.name && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-5px',
                      left: '-5px',
                      width: `${element.size * 2 + 10}px`,
                      height: `${element.size * 2 + 10}px`,
                      border: `2px solid ${element.color}`,
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      animation: 'orbital-ring 2s linear infinite',
                    }}
                  />
                )}
              </Box>

              {/* Tooltip con información del elemento */}
              <Tooltip
                title={
                  <Box>
                    <Typography variant="subtitle2">{element.name}</Typography>
                    <Typography variant="caption">
                      {element.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      💡 {element.recommendations[0]}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 1, fontWeight: 'bold' }}
                    >
                      {element.value}% completado
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Box sx={{ position: 'absolute', inset: 0 }} />
              </Tooltip>
            </Box>
          );
        })}

        {/* Órbitas elípticas visibles */}
        <svg
          width="500"
          height="500"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <filter id="orbit-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {elementConfig.map((element, index) => (
            <ellipse
              key={`orbit-${element.name}`}
              cx="250"
              cy="250"
              rx={element.orbitRadius}
              ry={element.orbitRadiusY}
              fill="none"
              stroke={alpha(element.color, 0.3)}
              strokeWidth="1"
              strokeDasharray="4 4"
              filter="url(#orbit-glow)"
              transform={`rotate(${element.tilt} 250 250)`}
              style={{
                animation: `orbit-fade ${3 + index}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </svg>
      </Box>

      {/* Panel de información flotante */}
      <Box
        className="info-panel-floating"
        sx={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: alpha('#000', 0.7),
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 2,
          maxWidth: '300px',
          border: `1px solid ${alpha('#fff', 0.1)}`,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${balanceStatus.color} 0%, ${alpha(balanceStatus.color, 0.6)} 100%)`,
              color: 'white',
            }}
          >
            <BalanceIcon />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: 'white' }}
            >
              Balance Ayni Solar
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
              {userLevel} • {recentActivity.streak} días consecutivos
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: alpha('#fff', 0.9), display: 'block', mb: 2 }}
        >
          🌌 Sistema Solar visto desde Júpiter
        </Typography>

        {/* Status del balance */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: 'white' }}>
              Balance General
            </Typography>
            <Chip
              label={balanceStatus.status}
              size="small"
              sx={{
                bgcolor: alpha(balanceStatus.color, 0.2),
                color: balanceStatus.color,
                fontWeight: 'bold',
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={animatedBalance * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha('#fff', 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${balanceStatus.color} 0%, ${alpha(balanceStatus.color, 0.6)} 100%)`,
              },
            }}
          />
        </Box>

        {/* Elementos miniatura */}
        <Typography
          variant="caption"
          sx={{ color: 'white', display: 'block', mb: 1 }}
        >
          Elementos Orbitales:
        </Typography>
        <Grid container spacing={1}>
          {elementConfig.map((element) => (
            <Grid item xs={6} key={element.name}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  background: alpha(element.color, 0.1),
                  border:
                    selectedElement === element.name
                      ? `1px solid ${element.color}`
                      : `1px solid ${alpha(element.color, 0.3)}`,
                  cursor: 'pointer',
                  '&:hover': {
                    background: alpha(element.color, 0.2),
                  },
                }}
                onClick={() => handleElementClick(element.name)}
              >
                <Box sx={{ color: element.color, fontSize: '0.8rem' }}>
                  {element.icon}
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      display: 'block',
                    }}
                  >
                    {element.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#fff', 0.7), fontSize: '0.6rem' }}
                  >
                    {element.value}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Botón de expansión */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <IconButton
            onClick={handleExpandToggle}
            sx={{
              color: balanceStatus.color,
              background: alpha(balanceStatus.color, 0.1),
              '&:hover': {
                background: alpha(balanceStatus.color, 0.2),
              },
            }}
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Panel expandible con análisis detallado */}
      <Collapse in={expanded}>
        <Box
          className="detailed-analysis-panel"
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: alpha('#000', 0.8),
            backdropFilter: 'blur(15px)',
            borderRadius: 3,
            p: 3,
            maxWidth: '400px',
            maxHeight: '60vh',
            overflow: 'auto',
            border: `1px solid ${alpha('#fff', 0.1)}`,
            zIndex: 10,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PsychologyIcon />
            Análisis Cósmico Detallado
          </Typography>

          {/* Insights personalizados */}
          {personalizedInsights.map((insight, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: alpha(insight.color, 0.1),
                border: `1px solid ${alpha(insight.color, 0.3)}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Box sx={{ color: insight.color, mt: 0.5 }}>{insight.icon}</Box>
              <Typography
                variant="caption"
                sx={{ color: alpha('#fff', 0.9), lineHeight: 1.4, flex: 1 }}
              >
                {insight.message}
              </Typography>
            </Box>
          ))}

          {/* Recomendaciones específicas */}
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>
            🎯 Recomendaciones Orbitales
          </Typography>

          {elementRecommendations.map((rec, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                mb: 1.5,
                borderRadius: 2,
                background: alpha(
                  rec.priority === 'high'
                    ? theme.palette.warning.main
                    : rec.priority === 'medium'
                      ? theme.palette.info.main
                      : theme.palette.success.main,
                  0.1
                ),
                border: `1px solid ${alpha(
                  rec.priority === 'high'
                    ? theme.palette.warning.main
                    : rec.priority === 'medium'
                      ? theme.palette.info.main
                      : theme.palette.success.main,
                  0.3
                )}`,
              }}
            >
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
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {rec.element}
                </Typography>
                <Chip
                  label={rec.priority.toUpperCase()}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    bgcolor: alpha(
                      rec.priority === 'high'
                        ? theme.palette.warning.main
                        : rec.priority === 'medium'
                          ? theme.palette.info.main
                          : theme.palette.success.main,
                      0.2
                    ),
                    color:
                      rec.priority === 'high'
                        ? theme.palette.warning.main
                        : rec.priority === 'medium'
                          ? theme.palette.info.main
                          : theme.palette.success.main,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: alpha('#fff', 0.9), display: 'block', mb: 0.5 }}
              >
                🎯 {rec.action}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha('#fff', 0.7),
                  fontStyle: 'italic',
                  fontSize: '0.7rem',
                }}
              >
                📈 {rec.impact}
              </Typography>
            </Box>
          ))}

          {/* Mensaje inspiracional */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(balanceStatus.color, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(balanceStatus.color, 0.3)}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: alpha('#fff', 0.9), fontStyle: 'italic' }}
            >
              {animatedBalance >= 0.8
                ? '🌟 Tu energía Ayni irradia equilibrio cósmico. Eres un faro de inspiración para toda la galaxia comunitaria.'
                : animatedBalance >= 0.6
                  ? '💫 Tu balance Ayni muestra una órbita estable. Continúa cultivando intercambios conscientes en el universo.'
                  : '🌱 Cada rotación hacia el equilibrio Ayni fortalece las fuerzas gravitacionales de la comunidad. ¡El cosmos está contigo!'}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AyniBalanceVisualization;
