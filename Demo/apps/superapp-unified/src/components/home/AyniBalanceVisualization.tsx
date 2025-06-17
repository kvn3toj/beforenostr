import React, { useState, useEffect, useCallback, useMemo } from 'react';

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
  angle: number;
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
  const [rotation, setRotation] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [animationTick, setAnimationTick] = useState(0);

  // 🎨 Animación de entrada y rotación continua
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBalance(balanceAyni);
      setAnimatedElements(elementos);
    }, 300);

    // Rotación continua suave
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
      setAnimationTick((prev) => prev + 1);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(rotationInterval);
    };
  }, [balanceAyni, elementos]);

  // 🌟 Configuración avanzada de elementos con IA
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
        orbitRadius: 80,
        angle: 0 + rotation,
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
        orbitRadius: 90,
        angle: 90 + rotation,
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
        orbitRadius: 85,
        angle: 180 + rotation,
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
        orbitRadius: 95,
        angle: 270 + rotation,
      },
    ],
    [animatedElements, rotation]
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
      console.log('🧹 Cleaning up AyniBalanceVisualization');
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
    <Card
      className={`glassmorphism-card interactive-card-advanced ayni-balance-3d ${className}`}
      sx={{
        background: 'transparent',
        border: `1px solid ${alpha('#fff', 0.1)}`,
        borderRadius: 3,
        overflow: 'visible',
        position: 'relative',
        minHeight: expanded ? 600 : 400,
        transition: 'all 0.6s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${alpha(balanceStatus.color, 0.3)}`,
        },
      }}
    >
      {/* Partículas flotantes temáticas */}
      <EnhancedParticles
        type="glow"
        count={8}
        colors={elementConfig.map((e) => e.color)}
        intensity="medium"
        interactive={true}
      />

      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        {/* Header mejorado con expansión */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${balanceStatus.color} 0%, ${alpha(balanceStatus.color, 0.6)} 100%)`,
                color: 'white',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <BalanceIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'white' }}
              >
                Balance Ayni 3D
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                {userLevel} • {recentActivity.streak} días consecutivos
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleExpandToggle}
            sx={{
              color: balanceStatus.color,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Balance Circle 3D con elementos orbitales */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box
            className="ayni-balance-3d-container"
            sx={{
              position: 'relative',
              width: 240,
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1000px',
            }}
          >
            {/* SVG con gradientes avanzados */}
            <svg
              width="240"
              height="240"
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            >
              <defs>
                <radialGradient id="balanceGradient" cx="50%" cy="50%" r="50%">
                  <stop
                    offset="0%"
                    stopColor={alpha(balanceStatus.color, 0.8)}
                  />
                  <stop
                    offset="70%"
                    stopColor={alpha(balanceStatus.color, 0.4)}
                  />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Circle con glow */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke={alpha('#fff', 0.1)}
                strokeWidth="12"
              />

              {/* Progress Circle con animación */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="url(#balanceGradient)"
                strokeWidth="12"
                strokeDasharray={`${animatedBalance * 628} 628`}
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
                filter="url(#glow)"
                style={{
                  transition: 'stroke-dasharray 1.5s ease-in-out',
                }}
              />

              {/* Indicadores orbitales para elementos */}
              {elementConfig.map((element, index) => {
                const x =
                  120 +
                  Math.cos((element.angle * Math.PI) / 180) *
                    element.orbitRadius;
                const y =
                  120 +
                  Math.sin((element.angle * Math.PI) / 180) *
                    element.orbitRadius;

                return (
                  <g key={element.name}>
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill={element.color}
                      stroke={alpha(element.color, 0.6)}
                      strokeWidth="2"
                      filter="url(#glow)"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleElementClick(element.name)}
                    />
                    {selectedElement === element.name && (
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="none"
                        stroke={element.color}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        opacity="0.8"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Centro 3D con contenido */}
            <Box
              sx={{
                textAlign: 'center',
                zIndex: 2,
                transform: `rotateY(${rotation * 0.2}deg) rotateX(${Math.sin(animationTick * 0.02) * 5}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: balanceStatus.color,
                  mb: 0.5,
                  textShadow: `0 0 20px ${alpha(balanceStatus.color, 0.6)}`,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                {Math.round(animatedBalance * 100)}%
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                Balance Ayni
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={balanceStatus.status}
                  sx={{
                    bgcolor: alpha(balanceStatus.color, 0.2),
                    color: balanceStatus.color,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Cards de elementos interactivos */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'white',
              mb: 2,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
            Elementos Interactivos
          </Typography>

          <Grid container spacing={2}>
            {elementConfig.map((element, index) => (
              <Grid item xs={6} key={element.name}>
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="subtitle2">
                        {element.name}
                      </Typography>
                      <Typography variant="caption">
                        {element.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
                      >
                        💡 {element.recommendations[0]}
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Box
                    className="element-card-3d"
                    onClick={() => handleElementClick(element.name)}
                    onMouseEnter={() => handleElementHover(element.name)}
                    onMouseLeave={() => handleElementHover(null)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(element.color, 0.15)} 0%, ${alpha(element.color, 0.05)} 100%)`,
                      border:
                        selectedElement === element.name
                          ? `2px solid ${element.color}`
                          : `1px solid ${alpha(element.color, 0.3)}`,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.4s ease',
                      transform:
                        selectedElement === element.name
                          ? 'translateY(-4px) scale(1.02)'
                          : 'translateY(0) scale(1)',
                      boxShadow:
                        selectedElement === element.name
                          ? `0 8px 24px ${alpha(element.color, 0.4)}`
                          : 'none',
                      animationDelay: `${index * 100}ms`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(element.color, 0.25)} 0%, ${alpha(element.color, 0.1)} 100%)`,
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: `0 6px 20px ${alpha(element.color, 0.3)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: element.color,
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        transform:
                          selectedElement === element.name
                            ? 'scale(1.2)'
                            : 'scale(1)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {element.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      {element.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={element.value}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha('#fff', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${element.color} 0%, ${alpha(element.color, 0.6)} 100%)`,
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha('#fff', 0.8),
                        fontSize: '0.75rem',
                        mt: 0.5,
                        display: 'block',
                        fontWeight: 'bold',
                      }}
                    >
                      {element.value}%
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Panel expandible con insights inteligentes */}
        <Collapse in={expanded}>
          <Box sx={{ pt: 3, borderTop: `1px solid ${alpha('#fff', 0.1)}` }}>
            {/* Insights personalizados */}
            <Typography
              variant="subtitle2"
              sx={{
                color: 'white',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <PsychologyIcon sx={{ fontSize: '1.2rem' }} />
              Análisis Inteligente
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {personalizedInsights.map((insight, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha(insight.color, 0.1),
                      border: `1px solid ${alpha(insight.color, 0.3)}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ color: insight.color, mt: 0.5 }}>
                      {insight.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha('#fff', 0.9),
                        lineHeight: 1.4,
                        flex: 1,
                      }}
                    >
                      {insight.message}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Recomendaciones específicas por elemento */}
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>
              🎯 Recomendaciones Personalizadas
            </Typography>

            <Grid container spacing={1}>
              {elementRecommendations.map((rec, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      p: 1.5,
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
                        mb: 0.5,
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
                      sx={{
                        color: alpha('#fff', 0.9),
                        display: 'block',
                        mb: 0.5,
                      }}
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
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>

        {/* Mensaje inspiracional dinámico */}
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
              ? '🌟 Tu energía Ayni irradia equilibrio. Eres un faro de inspiración para la comunidad.'
              : animatedBalance >= 0.6
                ? '💫 Tu balance Ayni muestra progreso constante. Continúa cultivando intercambios conscientes.'
                : '🌱 Cada paso hacia el equilibrio Ayni fortalece el tejido comunitario. ¡Sigue creciendo!'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AyniBalanceVisualization;
