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

// 🌍 CoomÜnity SuperApp - Visualización Avanzada Balance de Reciprocidad
// Sistema solar 3D con integración al Sistema Elemental Unificado

// 🌍 IMPORTACIÓN DEL SISTEMA ELEMENTAL UNIFICADO
import {
  UNIFIED_ELEMENTAL_CONFIG,
  ELEMENTAL_PRESETS,
  ElementalUtils,
  type ElementType,
  type ElementalConfiguration,
} from '../universe/ElementalSystem';

interface ElementData {
  name: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  description: string;
  recommendations: string[];
  orbitRadius: number;
  orbitRadiusY: number;
  angle: number;
  speed: number;
  size: number;
  tilt: number;
  // 🆕 Nuevos campos del sistema unificado
  config: ElementalConfiguration;
  harmonic?: number;
  affinity?: number;
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

// 🆕 PHASE 2: Interfaces expandidas para información detallada
interface HistoricalDataPoint {
  date: Date;
  balance: number;
  elements: { fuego: number; agua: number; tierra: number; aire: number };
}

interface CommunityMetrics {
  ranking: number;
  totalUsers: number;
  percentile: number;
  averageBalance: number;
  regionRanking: number;
  levelPeers: number;
}

interface PredictiveInsight {
  type: 'milestone' | 'risk' | 'opportunity' | 'trend';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  icon: React.ReactElement;
  color: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: Date;
  requiredBalance: number;
  reward: string;
}

interface EnhancedReciprocidadData {
  // Datos actuales
  balanceReciprocidad: number;
  elementos: { fuego: number; agua: number; tierra: number; aire: number };

  // 🆕 Datos históricos
  historicalData: HistoricalDataPoint[];

  // 🆕 Métricas comunitarias
  communityMetrics: CommunityMetrics;

  // 🆕 Predicciones IA
  predictions: PredictiveInsight[];

  // 🆕 Milestones
  milestones: Milestone[];
}

// 🆕 PHASE 2: Props expandidos con nuevos datos
interface ReciprocidadBalanceVisualizationProps {
  balanceReciprocidad: number;
  elementos: { fuego: number; agua: number; tierra: number; aire: number };
  className?: string;
  userLevel?: string;
  recentActivity?: {
    streak: number;
    lastInteraction: Date;
    totalContributions: number;
  };
  // 🆕 Datos expandidos opcionales
  enhancedData?: Partial<EnhancedReciprocidadData>;
}

export const ReciprocidadBalanceVisualization: React.FC<ReciprocidadBalanceVisualizationProps> = ({
  balanceReciprocidad,
  elementos,
  className = '',
  userLevel = 'Colaborador',
  recentActivity = {
    streak: 5,
    lastInteraction: new Date(),
    totalContributions: 25,
  },
  enhancedData, // 🆕 Nuevos datos opcionales
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

  // 🆕 PHASE 2: Estado para secciones expandidas
  const [expandedSection, setExpandedSection] = useState<'insights' | 'historical' | 'community' | 'predictions'>('insights');

  // 🎨 Animación de entrada suave
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBalance(balanceReciprocidad);
      setAnimatedElements(elementos);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [balanceReciprocidad, elementos]);

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

  // 🌟 Configuración Sistema Solar 3D - UNIFICADA con ElementalSystem
  const elementConfig: ElementData[] = useMemo(() => {
    // Mapeo de íconos para compatibilidad
    const elementIcons = {
      fuego: <LocalFireDepartmentIcon />,
      agua: <WaterIcon />,
      tierra: <TerrainIcon />,
      aire: <AirIcon />,
    } as const;

    return (['fuego', 'agua', 'tierra', 'aire'] as ElementType[]).map((elementType) => {
      const unifiedConfig = UNIFIED_ELEMENTAL_CONFIG[elementType];
      const value = animatedElements[elementType];

      // Calcula posición orbital usando utilidades unificadas
      const orbitalPosition = ElementalUtils.calculateFibonacciOrbitalPosition(
        elementType,
        orbitalRotation,
        400, // containerWidth
        300  // containerHeight
      );

      return {
        name: unifiedConfig.name,
        value,
        icon: elementIcons[elementType],
        color: unifiedConfig.visuals.primaryColor,
        description: unifiedConfig.name === 'Fuego' ? 'Pasión y acción' :
                    unifiedConfig.name === 'Agua' ? 'Fluir y adaptabilidad' :
                    unifiedConfig.name === 'Tierra' ? 'Estabilidad y confianza' :
                    'Comunicación e ideas',
        recommendations: [
          unifiedConfig.name === 'Fuego' ? 'Lidera un proyecto comunitario' :
          unifiedConfig.name === 'Agua' ? 'Colabora en intercambios de Reciprocidad' :
          unifiedConfig.name === 'Tierra' ? 'Construye relaciones duraderas' :
          'Comparte conocimiento abiertamente',

          unifiedConfig.name === 'Fuego' ? 'Participa en desafíos creativos' :
          unifiedConfig.name === 'Agua' ? 'Adapta tu enfoque a nuevos retos' :
          unifiedConfig.name === 'Tierra' ? 'Mantén constancia en tus hábitos' :
          'Facilita conversaciones significativas',
        ],
        orbitRadius: orbitalPosition.radius,
        orbitRadiusY: orbitalPosition.radiusY,
        angle: orbitalPosition.angle,
        speed: unifiedConfig.physics.speed,
        size: 14 + value / 10,
        tilt: unifiedConfig.physics.tilt,
        config: unifiedConfig,
      };
    });
  }, [animatedElements, orbitalRotation]);

  const getBalanceStatus = (balance: number) => {
    if (balance > 0.8) return { text: 'Óptimo', color: theme.palette.success.main };
    if (balance > 0.6) return { text: 'Equilibrado', color: theme.palette.info.main };
    if (balance > 0.4) return { text: 'Mejorable', color: theme.palette.warning.main };
    return { text: 'Desbalanceado', color: theme.palette.error.main };
  };

  const balanceStatus = getBalanceStatus(animatedBalance);

  const handleElementClick = (elementName: string) => {
    setSelectedElement(elementName === selectedElement ? null : elementName);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // 🧠 Generación de insights personalizados
  const personalizedInsights: PersonalizedInsight[] = useMemo(() => {
    const insights = [];
    const elements = Object.entries(animatedElements).sort((a, b) => b[1] - a[1]);
    const strongestElement = elements[0];
    const weakestElement = elements[elements.length - 1];

    if (strongestElement) {
      insights.push({
        type: 'strength',
        message: `Tu fortaleza radica en el elemento ${strongestElement[0]}, mostrando un gran potencial en ${UNIFIED_ELEMENTAL_CONFIG[strongestElement[0] as ElementType].keywords[0]}.`,
        icon: <AutoAwesomeIcon />,
        color: UNIFIED_ELEMENTAL_CONFIG[strongestElement[0] as ElementType].visuals.primaryColor,
      });
    }

    if (weakestElement) {
      insights.push({
        type: 'opportunity',
        message: `Puedes crecer cultivando tu elemento ${weakestElement[0]}, enfocándote en ${UNIFIED_ELEMENTAL_CONFIG[weakestElement[0] as ElementType].keywords[1]}.`,
        icon: <LightbulbIcon />,
        color: UNIFIED_ELEMENTAL_CONFIG[weakestElement[0] as ElementType].visuals.primaryColor,
      });
    }

    if (animatedBalance < 0.6) {
      insights.push({
        type: 'balance',
        message: 'Tu balance de Reciprocidad es mejorable. Busca actividades que integren tus elementos menos desarrollados.',
        icon: <BalanceIcon />,
        color: theme.palette.warning.main,
      });
    } else {
      insights.push({
        type: 'balance',
        message: '¡Excelente balance de Reciprocidad! Sigue nutriendo todos tus elementos para mantener la armonía.',
        icon: <CheckCircleIcon />,
        color: theme.palette.success.main,
      });
    }

    return insights;
  }, [animatedElements, animatedBalance, theme]);

  const renderElementDetails = () => {
    const element = elementConfig.find(e => e.name === selectedElement);
    if (!element) return null;

    return (
      <Card sx={{
          mt: 2,
          p: 2,
          backgroundColor: alpha(element.color, 0.1),
          border: `1px solid ${alpha(element.color, 0.3)}`,
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: element.color, display: 'flex', alignItems: 'center' }}>
          {React.cloneElement(element.icon, { sx: { mr: 1 }})}
          {element.name}
        </Typography>
        <Typography variant="body2" sx={{ my: 1 }}>{element.description}</Typography>
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Recomendaciones:</Typography>
        <ul>
          {element.recommendations.map((rec, i) => (
            <li key={i}><Typography variant="body2">{rec}</Typography></li>
          ))}
        </ul>
      </Card>
    );
  };

  // 🆕 PHASE 2: Componentes para nuevas secciones
  const renderHistoricalChart = () => <Box p={2}><Typography>📈 Gráfico Histórico (WIP)</Typography></Box>;
  const renderCommunityComparison = () => <Box p={2}><Typography>📊 Comparación Comunitaria (WIP)</Typography></Box>;
  const renderAIPredictions = () => <Box p={2}><Typography>🔮 Predicciones IA (WIP)</Typography></Box>;

  return (
    <Card
      className={`reciprocidad-balance-card ${className}`}
      sx={{
        p: 2,
        borderRadius: 4,
        background: `radial-gradient(ellipse at 50% 50%, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: `0 16px 64px 0 ${alpha(balanceStatus.color, 0.3)}`,
          transform: 'translateY(-4px)'
        }
      }}
    >
      <EnhancedParticles />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tooltip title="El Balance de Reciprocidad representa la armonía entre tus acciones de dar y recibir en la comunidad.">
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <BalanceIcon sx={{ mr: 1, color: balanceStatus.color }}/>
              Balance de Reciprocidad
            </Typography>
          </Tooltip>
          <Chip label={userLevel} color="primary" variant="outlined" />
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box
              ref={containerRef}
              sx={{
                position: 'relative',
                height: 300,
                width: '100%',
                background: `
                  radial-gradient(ellipse at 50% 150%, ${alpha(balanceStatus.color, 0.15)} 0%, transparent 70%),
                  url('https://www.transparenttextures.com/patterns/stardust.png')
                `,
                borderRadius: '50%',
                transform: `rotate(${backgroundRotation}deg)`,
                transition: 'transform 2s linear',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Sol central */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(balanceStatus.color, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.1)} 70%)`,
                  boxShadow: `0 0 40px ${alpha(balanceStatus.color, 0.5)}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  transform: `rotate(${planetRotation}deg)`,
                  transition: 'transform 1s ease-out',
                }}
              >
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {Math.round(animatedBalance * 100)}%
                </Typography>
                <Typography variant="caption" sx={{ color: balanceStatus.color }}>
                  {balanceStatus.text}
                </Typography>
              </Box>

              {/* Planetas elementales */}
              {elementConfig.map((element) => (
                <Tooltip key={element.name} title={`${element.name}: ${element.value}%`}>
                  <Box
                    onClick={() => handleElementClick(element.name)}
                    sx={{
                      position: 'absolute',
                      top: `calc(50% - ${element.size / 2}px)`,
                      left: `calc(50% - ${element.size / 2}px)`,
                      width: element.size * 2,
                      height: element.size * 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: `
                        rotate(${element.angle}deg)
                        translateX(${element.orbitRadius}px)
                        rotate(-${element.angle}deg)
                        rotateY(${element.tilt}deg)
                      `,
                      transition: 'all 0.5s ease-out',
                      cursor: 'pointer',
                      '&:hover .planet-core': {
                        transform: 'scale(1.2)',
                        boxShadow: `0 0 20px ${alpha(element.color, 0.8)}`
                      }
                    }}
                  >
                    <Box
                      className="planet-core"
                      sx={{
                        width: element.size,
                        height: element.size,
                        backgroundColor: element.color,
                        borderRadius: '50%',
                        boxShadow: `0 0 10px ${alpha(element.color, 0.5)}`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: theme.palette.getContrastText(element.color),
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {React.cloneElement(element.icon, { sx: { fontSize: element.size * 0.6 } })}
                    </Box>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Composición Elemental</Typography>
            {elementConfig.map((element) => (
              <Box key={element.name} sx={{ my: 1 }}>
                <Tooltip title={element.description}>
                  <Box display="flex" alignItems="center">
                    {React.cloneElement(element.icon, { sx: { color: element.color, mr: 1 } })}
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>{element.name}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{element.value}%</Typography>
                  </Box>
                </Tooltip>
                <LinearProgress
                  variant="determinate"
                  value={element.value}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: element.color,
                    },
                    backgroundColor: alpha(element.color, 0.2)
                  }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>

        {selectedElement && renderElementDetails()}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}/>
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Grid container>
                <Grid item>
                  <Chip label="Insights" onClick={() => setExpandedSection('insights')} color={expandedSection === 'insights' ? 'primary' : 'default'} />
                </Grid>
                <Grid item>
                  <Chip label="Histórico" onClick={() => setExpandedSection('historical')} color={expandedSection === 'historical' ? 'primary' : 'default'} />
                </Grid>
                <Grid item>
                  <Chip label="Comunidad" onClick={() => setExpandedSection('community')} color={expandedSection === 'community' ? 'primary' : 'default'} />
                </Grid>
                <Grid item>
                  <Chip label="Predicciones" onClick={() => setExpandedSection('predictions')} color={expandedSection === 'predictions' ? 'primary' : 'default'} />
                </Grid>
              </Grid>
            </Box>

            {expandedSection === 'insights' && (
              <Box>
                <Typography variant="h6" gutterBottom>Insights de tu Reciprocidad</Typography>
                {personalizedInsights.map((insight, index) => (
                  <Box key={index} display="flex" alignItems="center" my={1} p={1} bgcolor={alpha(insight.color, 0.1)} borderRadius={1}>
                    {React.cloneElement(insight.icon, { sx: { color: insight.color, mr: 1.5 }})}
                    <Typography variant="body2">{insight.message}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {expandedSection === 'historical' && renderHistoricalChart()}
            {expandedSection === 'community' && renderCommunityComparison()}
            {expandedSection === 'predictions' && renderAIPredictions()}

          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ReciprocidadBalanceVisualization;
