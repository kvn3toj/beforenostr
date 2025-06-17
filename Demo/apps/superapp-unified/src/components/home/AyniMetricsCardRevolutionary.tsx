import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublicIcon from '@mui/icons-material/Public';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// 🌌 IMPORTS DE COMPONENTES UNIVERSE
import { UniverseBackground, AyniPlanet, ElementalSphere, ElementalConnection } from '../universe';

// 🌟 IMPORTS DEL SISTEMA ELEMENTAL UNIFICADO
import { 
  UNIFIED_ELEMENTAL_CONFIG, 
  ELEMENTAL_PRESETS,
  ElementalUtils,
  ElementType,
  ElementalConfiguration
} from '../universe/ElementalSystem';

// 🔢 IMPORTS DE UTILIDADES FIBONACCI
import {
  calculateFibonacciOrbit,
  getFibonacciAnimationSpeed,
  fibonacciLerp,
  GOLDEN_RATIO,
  FIBONACCI_PRESETS,
  type OrbitalPosition,
  type FibonacciMetrics,
  calculateFibonacciMetrics
} from '../../utils/fibonacci-distribution';

// 🌌 IMPORTS DE ESTILOS CSS
import '../../styles/solar-system-svg.css';

interface ElementStats {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface AyniMetricsRevolutionaryProps {
  ondas: number;
  meritos: number;
  ayniLevel: string;
  nextLevel: string;
  ayniProgress: number;
  bienComunContributions: number;
  balanceAyni: number;
  elementos: ElementStats;
  isLoading?: boolean;
  isConnected?: boolean;
  className?: string;
}

const AyniMetricsCardRevolutionary: React.FC<AyniMetricsRevolutionaryProps> = ({
  ondas,
  meritos,
  ayniLevel,
  nextLevel,
  ayniProgress,
  bienComunContributions,
  balanceAyni,
  elementos,
  isLoading = false,
  isConnected = true,
  className = '',
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // 🌌 NUEVOS ESTADOS PARA EFECTOS VISUALES
  const [showUniverseBackground, setShowUniverseBackground] = useState(true);
  const [cosmicIntensity, setCosmicIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [showTrails, setShowTrails] = useState(true);
  const [interactionMode, setInteractionMode] = useState<'hover' | 'click' | 'auto'>('hover');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [orbitalHistory, setOrbitalHistory] = useState<Array<{element: string, x: number, y: number, timestamp: number}>>([]);
  
  // 🔢 ESTADOS FIBONACCI MEJORADOS
  const [fibonacciTime, setFibonacciTime] = useState(0);
  const [orbitalPositions, setOrbitalPositions] = useState<OrbitalPosition[]>([]);
  const [fibonacciMetrics, setFibonacciMetrics] = useState<FibonacciMetrics>({
    distributionQuality: 100,
    visualHarmony: 100,
    animationSmoothness: 100,
    overallScore: 100
  });
  const [lastFrameTime, setLastFrameTime] = useState(Date.now());
  const [fibonacciPreset, setFibonacciPreset] = useState<keyof typeof FIBONACCI_PRESETS>('default');
  
  // 🌟 PRESET ELEMENTAL ACTUAL
  const [currentElementalPreset, setCurrentElementalPreset] = useState<keyof typeof ELEMENTAL_PRESETS>('balanced');

  // 🌌 CONFIGURACIÓN ELEMENTAL UNIFICADA
  const unifiedElementConfig = useMemo(() => {
    const preset = ELEMENTAL_PRESETS[currentElementalPreset];
    
    return {
      fuego: {
        ...ElementalUtils.applyPreset('fuego', currentElementalPreset),
        value: elementos.fuego,
        icon: <LocalFireDepartmentIcon />,
        baseAngle: 0,
      },
      agua: {
        ...ElementalUtils.applyPreset('agua', currentElementalPreset),
        value: elementos.agua,
        icon: <WaterDropIcon />,
        baseAngle: 90,
      },
      tierra: {
        ...ElementalUtils.applyPreset('tierra', currentElementalPreset),
        value: elementos.tierra,
        icon: <TerrainIcon />,
        baseAngle: 180,
      },
      aire: {
        ...ElementalUtils.applyPreset('aire', currentElementalPreset),
        value: elementos.aire,
        icon: <AirIcon />,
        baseAngle: 270,
      },
    };
  }, [elementos, currentElementalPreset]);

  // 🔢 EFECTO FIBONACCI PARA ACTUALIZACIÓN DE POSICIONES
  useEffect(() => {
    const animationFrame = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastFrameTime;
      
      // Actualizar tiempo Fibonacci
      const newFibonacciTime = fibonacciTime + deltaTime * 0.001; // Convertir a segundos
      setFibonacciTime(newFibonacciTime);
      
      // Calcular nuevas posiciones orbitales usando utilidades Fibonacci
      const elements = Object.keys(unifiedElementConfig);
      const containerWidth = 400; // Tamaño del contenedor
      const containerHeight = 400;
      
      const newPositions: OrbitalPosition[] = elements.map((elementKey, index) => {
        const config = unifiedElementConfig[elementKey as keyof typeof unifiedElementConfig];
        const animationSpeed = getFibonacciAnimationSpeed(index);
        
        return calculateFibonacciOrbit(
          index,
          elements.length,
          newFibonacciTime * animationSpeed,
          containerWidth,
          containerHeight,
          FIBONACCI_PRESETS[fibonacciPreset]
        );
      });
      
      setOrbitalPositions(newPositions);
      
      // Calcular métricas de rendimiento Fibonacci
      const metrics = calculateFibonacciMetrics(newPositions, deltaTime);
      setFibonacciMetrics(metrics);
      
      setLastFrameTime(currentTime);
    };

    const animationId = requestAnimationFrame(animationFrame);
    
    // Configurar loop de animación
    const intervalId = setInterval(animationFrame, 16); // ~60fps
    
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
    };
  }, [fibonacciTime, lastFrameTime, unifiedElementConfig, fibonacciPreset]);

  // 📊 ESTADÍSTICAS AVANZADAS CALCULADAS
  const advancedStats = useMemo(() => {
    // Calcular puntaje Ayni basado en el balance y elementos
    const elementosTotales = elementos.fuego + elementos.agua + elementos.tierra + elementos.aire;
    const balanceElemental = elementosTotales > 0 ? 
      Math.min(100, Math.round(balanceAyni * 10 + (elementosTotales / 4))) : 
      Math.round(balanceAyni * 10);
    
    // Calcular poder total basado en todas las métricas
    const baseScore = Math.min(100, Math.round(
      (ondas * 0.001) + 
      (meritos * 0.1) + 
      (bienComunContributions * 2) + 
      (balanceAyni * 5) + 
      (elementosTotales * 0.25)
    ));

    return {
      ayniScore: Math.max(0, Math.min(100, balanceElemental)),
      overallPower: Math.max(0, Math.min(100, baseScore)),
      elementalBalance: elementosTotales > 0 ? Math.round(elementosTotales / 4) : 0,
      cosmicAlignment: Math.round((balanceAyni + ayniProgress) / 2),
    };
  }, [ondas, meritos, bienComunContributions, balanceAyni, elementos, ayniProgress]);

  // 🆕 CALCULADORA DE EFECTOS GRAVITACIONALES
  const calculateGravitationalEffects = useCallback((elementKey: string, elements: typeof unifiedElementConfig) => {
    const targetElement = elements[elementKey];
    if (!targetElement) return { x: 0, y: 0, z: 0 };

    let gravitationalForceX = 0;
    let gravitationalForceY = 0;
    let gravitationalForceZ = 0;

    Object.entries(elements).forEach(([otherKey, otherElement]) => {
      if (otherKey === elementKey) return;

      // Calcular distancia entre elementos
      const angle1 = targetElement.baseAngle + animationPhase * targetElement.orbitSpeed;
      const angle2 = otherElement.baseAngle + animationPhase * otherElement.orbitSpeed;
      
      const radians1 = (angle1 * Math.PI) / 180;
      const radians2 = (angle2 * Math.PI) / 180;
      
      const radius1 = 180 * targetElement.orbitRadius;
      const radius2 = 180 * otherElement.orbitRadius;
      
      const x1 = radius1 * Math.cos(radians1);
      const y1 = radius1 * Math.sin(radians1) * 0.2;
      const x2 = radius2 * Math.cos(radians2);
      const y2 = radius2 * Math.sin(radians2) * 0.2;
      
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      
      // Fuerza gravitacional simplificada (F = G * m1 * m2 / r²)
      const gravitationalForce = (otherElement.gravitationalInfluence * targetElement.mass) / 
                                 Math.max(distance / 100, 0.5); // Normalizar y evitar división por cero
      
      // Direcciones de la fuerza
      const forceX = gravitationalForce * (x2 - x1) / distance * 0.5;
      const forceY = gravitationalForce * (y2 - y1) / distance * 0.5;
      
      gravitationalForceX += forceX;
      gravitationalForceY += forceY;
    });

    return {
      x: Math.max(-15, Math.min(15, gravitationalForceX)), // Limitar efecto
      y: Math.max(-15, Math.min(15, gravitationalForceY)),
      z: 0
    };
  }, [animationPhase]);

  // 🆕 CALCULADORA DE RESONANCIA ELEMENTAL
  const calculateElementalResonance = useCallback((elementKey: string, elements: typeof unifiedElementConfig) => {
    const targetElement = elements[elementKey];
    if (!targetElement) return 1.0;

    let resonanceIntensity = 1.0;
    
    // Calcular resonancia con elementos afines
    Object.entries(elements).forEach(([otherKey, otherElement]) => {
      if (otherKey === elementKey) return;
      
      // Si este elemento está en afinidad con el otro
      if (targetElement.elementalAffinity?.includes(otherKey)) {
        // Calcular fase de resonancia basada en frecuencias
        const resonancePhase = (animationPhase * targetElement.resonanceFrequency) % 360;
        const otherResonancePhase = (animationPhase * otherElement.resonanceFrequency) % 360;
        
        // Diferencia de fase para calcular constructividad/destructividad
        const phaseDifference = Math.abs(resonancePhase - otherResonancePhase);
        const normalizedPhase = Math.min(phaseDifference, 360 - phaseDifference);
        
        // Resonancia constructiva cuando las fases están sincronizadas
        const resonanceFactor = 1 + 0.3 * Math.cos((normalizedPhase * Math.PI) / 180);
        resonanceIntensity *= resonanceFactor * targetElement.harmonicMultiplier;
      }
    });

    return Math.max(0.7, Math.min(1.4, resonanceIntensity)); // Limitar entre 70% y 140%
  }, [animationPhase]);

  // 🆕 OPTIMIZADOR DE DENSIDAD VISUAL
  const optimizeVisualDensity = useCallback((elements: typeof unifiedElementConfig) => {
    // Calcular densidad total actual
    const totalDensity = Object.values(elements).reduce((sum, element) => 
      sum + element.visualDensity * element.size, 0
    );
    
    // Si la densidad es muy alta, reducir efectos secundarios
    const densityFactor = Math.min(1.0, 4.0 / totalDensity);
    
    return {
      trailOpacity: densityFactor,
      glowIntensity: densityFactor,
      particleCount: Math.floor(densityFactor * 100),
      animationSpeed: 0.8 + (densityFactor * 0.4) // Más lento si hay mucha densidad
    };
  }, []);

  // 🌌 NUEVO: DISTRIBUCIÓN ESPACIAL DINÁMICA MEJORADA
  const calculateDynamicDistribution = useCallback((elements: typeof unifiedElementConfig) => {
    // 🎯 Calcular zonas de distribución óptima
    const distributionZones = {
      inner: { radius: 0.6, elements: ['tierra'], preference: 1.4 },
      middle: { radius: 1.0, elements: ['fuego', 'agua'], preference: 1.2 },
      outer: { radius: 1.4, elements: ['aire'], preference: 1.0 },
    };

    // 🌀 Sistema de anti-clustering (evitar que elementos se amontonen)
    const antiClusteringForce = 0.3;
    const distributions: Record<string, { spacing: number, zoneBalance: number, harmony: number }> = {};

    Object.entries(elements).forEach(([key, element]) => {
      const currentAngle = element.baseAngle + animationPhase * element.orbitSpeed;
      
      // 🎯 Calcular proximidad con otros elementos
      let totalProximity = 0;
      let proximityCount = 0;
      
      Object.entries(elements).forEach(([otherKey, otherElement]) => {
        if (otherKey === key) return;
        
        const otherAngle = otherElement.baseAngle + animationPhase * otherElement.orbitSpeed;
        const angleDifference = Math.abs(currentAngle - otherAngle);
        const normalizedAngleDiff = Math.min(angleDifference, 360 - angleDifference);
        
        // Proximidad inversamente proporcional a la distancia angular
        const proximity = 1 / Math.max(normalizedAngleDiff / 90, 0.1); // Normalizar a cuadrantes
        totalProximity += proximity;
        proximityCount++;
      });

      const averageProximity = proximityCount > 0 ? totalProximity / proximityCount : 1;
      
      // 🌀 Calcular espaciamiento dinámico (más espacio si hay mucha proximidad)
      const dynamicSpacing = 1 + (antiClusteringForce * Math.max(0, averageProximity - 1));
      
      // 🎯 Calcular balance de zona (qué tan bien distribuido está en su zona preferida)
      const preferredZone = Object.values(distributionZones).find(zone => 
        zone.elements.includes(key)
      ) || distributionZones.middle;
      
      const currentRadiusNormalized = element.orbitRadius;
      const zoneBalanceScore = 1 - Math.abs(currentRadiusNormalized - preferredZone.radius) * 0.5;
      
      // 🌈 Calcular armonía elemental (balance entre elementos opuestos)
      const oppositeElements = {
        fuego: 'agua',
        agua: 'fuego', 
        tierra: 'aire',
        aire: 'tierra'
      };
      
      const oppositeKey = oppositeElements[key as keyof typeof oppositeElements];
      const oppositeElement = oppositeKey ? elements[oppositeKey] : null;
      
      let harmonyScore = 1;
      if (oppositeElement) {
        const oppositeAngle = oppositeElement.baseAngle + animationPhase * oppositeElement.orbitSpeed;
        const oppositeAngleDiff = Math.abs(currentAngle - oppositeAngle);
        const normalizedOppositeDiff = Math.min(oppositeAngleDiff, 360 - oppositeAngleDiff);
        
        // Ideal: elementos opuestos a ~180 grados de distancia
        const idealOppositeDistance = 180;
        const oppositeDistanceError = Math.abs(normalizedOppositeDiff - idealOppositeDistance) / 180;
        harmonyScore = Math.max(0.5, 1 - oppositeDistanceError);
      }

      distributions[key] = {
        spacing: dynamicSpacing,
        zoneBalance: Math.max(0.5, Math.min(1.5, zoneBalanceScore)),
        harmony: harmonyScore
      };

      console.log(`🌌 Distribución dinámica ${key}:`, {
        proximidad: Math.round(averageProximity * 100) / 100,
        espaciamiento: Math.round(dynamicSpacing * 100) / 100,
        balanceZona: Math.round(zoneBalanceScore * 100) / 100,
        armonía: Math.round(harmonyScore * 100) / 100,
        ánguloActual: Math.round(currentAngle),
      });
    });

    return distributions;
  }, [animationPhase]);

  // 🌟 NUEVO: CALCULADORA DE EQUILIBRIO UNIVERSAL
  const calculateUniversalBalance = useCallback((elements: typeof unifiedElementConfig) => {
    const distributions = calculateDynamicDistribution(elements);
    
    // 📊 Métricas de balance universal
    const totalSpacing = Object.values(distributions).reduce((sum, dist) => sum + dist.spacing, 0);
    const averageSpacing = totalSpacing / Object.keys(distributions).length;
    
    const totalZoneBalance = Object.values(distributions).reduce((sum, dist) => sum + dist.zoneBalance, 0);
    const averageZoneBalance = totalZoneBalance / Object.keys(distributions).length;
    
    const totalHarmony = Object.values(distributions).reduce((sum, dist) => sum + dist.harmony, 0);
    const averageHarmony = totalHarmony / Object.keys(distributions).length;
    
    // 🎯 Calcular score de distribución general (0-100)
    const distributionScore = (
      (Math.min(averageSpacing, 1.5) / 1.5) * 30 + // 30% para espaciamiento
      (averageZoneBalance) * 40 + // 40% para balance de zona
      (averageHarmony) * 30 // 30% para armonía elemental
    ) * 100;

    // 🌌 Nivel de distribución universal
    const getDistributionLevel = (score: number): string => {
      if (score >= 90) return 'Distribución Cósmica Perfecta';
      if (score >= 80) return 'Distribución Estelar Excelente';
      if (score >= 70) return 'Distribución Planetaria Buena';
      if (score >= 60) return 'Distribución Orbital Aceptable';
      if (score >= 50) return 'Distribución Elemental Básica';
      return 'Distribución Caótica';
    };

    const universalBalance = {
      score: Math.round(distributionScore),
      level: getDistributionLevel(distributionScore),
      spacing: Math.round(averageSpacing * 100) / 100,
      zoneBalance: Math.round(averageZoneBalance * 100) / 100,
      harmony: Math.round(averageHarmony * 100) / 100,
      distributions,
      // 🌈 Recomendaciones para mejora
      recommendations: {
        needsMoreSpacing: averageSpacing < 1.0,
        needsBetterZoning: averageZoneBalance < 0.8,
        needsHarmonyAdjustment: averageHarmony < 0.8,
        suggestedAction: distributionScore < 70 ? 'Ajustar velocidades orbitales' : 
                        distributionScore < 85 ? 'Optimizar distribución de zonas' : 
                        'Mantener configuración actual'
      }
    };

    console.log('🌌 Balance Universal:', universalBalance);
    
    return universalBalance;
  }, [calculateDynamicDistribution]);

  // 🌟 NUEVO: AUTO-OPTIMIZADOR DE DISTRIBUCIÓN
  const [distributionOptimization, setDistributionOptimization] = useState<{
    autoOptimize: boolean;
    optimizationStrength: number;
    lastOptimization: number;
  }>({
    autoOptimize: false,
    optimizationStrength: 0.5,
    lastOptimization: 0
  });

  // 🔄 Auto-optimización de distribución (cada 10 segundos si está activada)
  useEffect(() => {
    if (!distributionOptimization.autoOptimize) return;

    const optimizationInterval = setInterval(() => {
      const universalBalance = calculateUniversalBalance(unifiedElementConfig);
      
      if (universalBalance.score < 75) {
        console.log('🔄 Aplicando auto-optimización de distribución...', {
          scoreActual: universalBalance.score,
          recomendación: universalBalance.recommendations.suggestedAction
        });
        
        setDistributionOptimization(prev => ({
          ...prev,
          lastOptimization: Date.now(),
          optimizationStrength: Math.min(1.0, prev.optimizationStrength + 0.1)
        }));
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(optimizationInterval);
  }, [distributionOptimization.autoOptimize, calculateUniversalBalance, unifiedElementConfig]);

  // 🌌 Animación orbital como el universo real
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 0.8) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 🌌 NUEVO: Gestión del historial orbital para trails
  useEffect(() => {
    if (!showTrails) return;

    const orbitRadius = 180;
    const newPositions: Array<{element: string, x: number, y: number, timestamp: number}> = [];

    Object.entries(unifiedElementConfig).forEach(([key, config]) => {
      const currentAngle = config.baseAngle + animationPhase * config.orbitSpeed;
      const radians = (currentAngle * Math.PI) / 180;
      const elementOrbitRadius = orbitRadius * config.orbitRadius;
      const x = elementOrbitRadius * Math.cos(radians);
      const y = elementOrbitRadius * Math.sin(radians) * 0.2;

      newPositions.push({
        element: key,
        x,
        y,
        timestamp: Date.now(),
      });
    });

    setOrbitalHistory(prev => {
      const updated = [...prev, ...newPositions];
      // Mantener solo los últimos 20 puntos por elemento para performance
      const now = Date.now();
      return updated.filter(point => now - point.timestamp < 5000);
    });
  }, [animationPhase, unifiedElementConfig, showTrails]);

  // 🧹 CLEANUP OBLIGATORIO
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AyniMetricsCardRevolutionary');
    };
  }, []);

  // 🚨 DETECCIÓN DE ERRORES BUILDER.IO
  useEffect(() => {
    const handleBuilderError = (event: ErrorEvent) => {
      if (
        event.message.includes('Builder') ||
        event.message.includes('hook') ||
        event.filename?.includes('builder')
      ) {
        console.error('🚨 Builder.io Error detectado:', {
          message: event.message,
          filename: event.filename,
          component: 'AyniMetricsCardRevolutionary',
        });
      }
    };

    window.addEventListener('error', handleBuilderError);
    return () => window.removeEventListener('error', handleBuilderError);
  }, []);

  // 🎯 Handlers mejorados
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleElementHover = useCallback((elementKey: string | null) => {
    if (interactionMode === 'hover') {
      setHoveredElement(elementKey);
    }
  }, [interactionMode]);

  const handleElementClick = useCallback((elementKey: string) => {
    if (interactionMode === 'click') {
      setSelectedElement(prev => prev === elementKey ? null : elementKey);
      setHoveredElement(elementKey);
    }
  }, [interactionMode]);

  // 🆕 NUEVOS HANDLERS PARA CONTROLES
  const toggleUniverseBackground = useCallback(() => {
    setShowUniverseBackground(prev => !prev);
  }, []);

  const cycleCosmicIntensity = useCallback(() => {
    setCosmicIntensity(prev => {
      const intensities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      const currentIndex = intensities.indexOf(prev);
      return intensities[(currentIndex + 1) % intensities.length];
    });
  }, []);

  const toggleTrails = useCallback(() => {
    setShowTrails(prev => !prev);
  }, []);

  const cycleInteractionMode = useCallback(() => {
    setInteractionMode(prev => {
      const modes: Array<'hover' | 'click' | 'auto'> = ['hover', 'click', 'auto'];
      const currentIndex = modes.indexOf(prev);
      return modes[(currentIndex + 1) % modes.length];
    });
  }, []);

  // 🌌 Renderizar el sistema solar dinámico con DISTRIBUCIÓN OPTIMIZADA AVANZADA
  const renderCentralOrb = () => {
    const orbitRadius = 180; // Radio orbital MÁS GRANDE para efecto 3D perfecto

    // 🆕 CALCULAR BALANCE UNIVERSAL EN TIEMPO REAL
    const universalBalance = calculateUniversalBalance(unifiedElementConfig);

    console.log('🌌 Sistema orbital dinámico con distribución optimizada:', {
      animationPhase,
      orbitRadius,
      elementConfigCount: Object.keys(unifiedElementConfig).length,
      universalBalance: universalBalance.score,
      distributionLevel: universalBalance.level,
      autoOptimization: distributionOptimization.autoOptimize,
      // 🆕 DEBUG: Información de planetas orbitales
      elementalSpheres: Object.keys(unifiedElementConfig).map(key => ({
        element: key,
        config: unifiedElementConfig[key],
        hasIcon: !!unifiedElementConfig[key].icon,
        color: unifiedElementConfig[key].visuals?.primaryColor || unifiedElementConfig[key].color,
      })),
      overflowFixed: 'VISIBLE - Los planetas orbitales deberían ser visibles ahora',
    });

    return (
      <Box
        className="central-orb-container"
        sx={{
          position: 'relative',
          width: '500px', // Contenedor aún MÁS GRANDE para órbitas 3D expandidas
          height: '500px',
          mx: 'auto',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible !important', // ¡LA CORRECCIÓN CLAVE!
          perspective: '1500px', // Perspectiva más profunda
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 🌍 PLANETA CENTRAL AYNI 3D */}
        <AyniPlanet size={160} color="#FFD700" haloColor="rgba(255,215,0,0.45)" pulse>
          {/* Contenido central */}
          <Box
            sx={{
              width: '135px',
              height: '135px',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 30% 30%,
                  rgba(255, 255, 255, 0.15) 0%,
                  rgba(15, 23, 42, 0.95) 30%,
                  rgba(30, 41, 59, 0.9) 100%
                )
              `,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <PublicIcon
              sx={{
                fontSize: '2.8rem',
                background: 'linear-gradient(135deg, #00BCD4, #FFD700, #FF6B35)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                filter: 'drop-shadow(0 2px 8px rgba(0, 188, 212, 0.5))',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2rem',
                lineHeight: 1,
                mb: 0.2,
              }}
            >
              {advancedStats.ayniScore}%
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Balance Ayni
            </Typography>

            {/* 🆕 INDICADOR DE DISTRIBUCIÓN UNIVERSAL */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                zIndex: 10,
              }}
            >
              <Chip
                label={`${universalBalance.score}%`}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: universalBalance.score >= 85 
                    ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' 
                    : universalBalance.score >= 70 
                    ? 'linear-gradient(135deg, #FF9800, #FFB74D)'
                    : 'linear-gradient(135deg, #F44336, #EF5350)',
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 0.8,
                  },
                }}
              />
              <Tooltip title={`${universalBalance.level}\nEspaciamiento: ${universalBalance.spacing}\nBalance de Zona: ${universalBalance.zoneBalance}\nArmonía: ${universalBalance.harmony}`}>
                <Box
                  sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: universalBalance.score >= 85 
                      ? '#4CAF50' 
                      : universalBalance.score >= 70 
                      ? '#FF9800'
                      : '#F44336',
                    animation: universalBalance.score < 70 ? 'pulse 1.5s infinite' : 'none',
                    cursor: 'help',
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </AyniPlanet>

        {/* 🌌 ELEMENTOS ORBITALES 3D */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            zIndex: 10,
          }}
        >
          {/* Conexiones de afinidad */}
          {Object.entries(unifiedElementConfig).map(([key, config]) => {
            if (!config.elementalAffinity) return null;
            const currentAngle = config.baseAngle + animationPhase * config.orbitSpeed;
            const radians = (currentAngle * Math.PI) / 180;
            const inclinationRadians = (config.orbitInclination * Math.PI) / 180;
            const elementOrbitRadius = orbitRadius * config.orbitRadius;
            const eccentricRadius = elementOrbitRadius * (1 + config.orbitEccentricity * Math.cos(radians));
            const baseX = eccentricRadius * Math.cos(radians);
            const baseY = eccentricRadius * Math.sin(radians) * 0.2;
            const baseZ = eccentricRadius * Math.sin(radians) * Math.cos(inclinationRadians);
            const gravitationalEffects = calculateGravitationalEffects(key, unifiedElementConfig);
            const x = baseX + gravitationalEffects.x;
            const y = baseY + gravitationalEffects.y * Math.sin(inclinationRadians);
            const z = baseZ + gravitationalEffects.z + (elementOrbitRadius * Math.sin(radians) * Math.sin(inclinationRadians) * 0.5);
            return config.elementalAffinity.map((affKey) => {
              const affConfig = unifiedElementConfig[affKey];
              if (!affConfig) return null;
              const affAngle = affConfig.baseAngle + animationPhase * affConfig.orbitSpeed;
              const affRadians = (affAngle * Math.PI) / 180;
              const affInclinationRadians = (affConfig.orbitInclination * Math.PI) / 180;
              const affOrbitRadius = orbitRadius * affConfig.orbitRadius;
              const affEccentricRadius = affOrbitRadius * (1 + affConfig.orbitEccentricity * Math.cos(affRadians));
              const affBaseX = affEccentricRadius * Math.cos(affRadians);
              const affBaseY = affEccentricRadius * Math.sin(affRadians) * 0.2;
              const affBaseZ = affEccentricRadius * Math.sin(affRadians) * Math.cos(affInclinationRadians);
              const affGrav = calculateGravitationalEffects(affKey, unifiedElementConfig);
              const affX = affBaseX + affGrav.x;
              const affY = affBaseY + affGrav.y * Math.sin(affInclinationRadians);
              const affZ = affBaseZ + affGrav.z + (affOrbitRadius * Math.sin(affRadians) * Math.sin(affInclinationRadians) * 0.5);
              return (
                <ElementalConnection
                  key={`conn-${key}-${affKey}`}
                  x1={x}
                  y1={y}
                  x2={affX}
                  y2={affY}
                  color={config.color}
                  affinity={1}
                  show={true}
                />
              );
            });
          })}

          {/* Esferas elementales */}
          {Object.entries(unifiedElementConfig).map(([key, config]) => {
            const densityOptimization = optimizeVisualDensity(unifiedElementConfig);
            const currentAngle = config.baseAngle + animationPhase * config.orbitSpeed * densityOptimization.animationSpeed;
            const radians = (currentAngle * Math.PI) / 180;
            const inclinationRadians = (config.orbitInclination * Math.PI) / 180;
            const elementOrbitRadius = orbitRadius * config.orbitRadius;
            const eccentricRadius = elementOrbitRadius * (1 + config.orbitEccentricity * Math.cos(radians));
            const baseX = eccentricRadius * Math.cos(radians);
            const baseY = eccentricRadius * Math.sin(radians) * 0.2;
            const baseZ = eccentricRadius * Math.sin(radians) * Math.cos(inclinationRadians);
            const gravitationalEffects = calculateGravitationalEffects(key, unifiedElementConfig);
            const x = baseX + gravitationalEffects.x;
            const y = baseY + gravitationalEffects.y * Math.sin(inclinationRadians);
            const z = baseZ + gravitationalEffects.z + (elementOrbitRadius * Math.sin(radians) * Math.sin(inclinationRadians) * 0.5);
            const resonanceIntensity = calculateElementalResonance(key, unifiedElementConfig);
            const baseSize = 65;
            const elementSize = baseSize * config.size * resonanceIntensity;
            const hoverSize = elementSize * 1.15;
            const isAffinityActive = selectedElement && config.elementalAffinity?.includes(selectedElement);
            const isSelected = selectedElement === key || hoveredElement === key;
            const baseGlowIntensity = isSelected ? 1.0 : isAffinityActive ? 0.6 : 0.8;
            const glowIntensity = baseGlowIntensity * densityOptimization.glowIntensity;
            return (
              <ElementalSphere
                key={key}
                type={key as any}
                size={isSelected ? hoverSize : elementSize}
                color={config.color}
                texture={key === 'agua' ? 'waves' : key === 'tierra' ? 'cracks' : key === 'fuego' ? 'flames' : 'mist'}
                trailColor={config.trailColor}
                isSelected={isSelected}
                onHover={() => handleElementHover(key)}
                onClick={() => handleElementClick(key)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateX(35deg) rotateY(5deg) rotateZ(${animationPhase * config.orbitSpeed * 2}deg)`,
                  zIndex: 15,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  opacity: 0.95,
                }}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        maxHeight: '100%',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '16px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
        transform: expanded ? 'scale(1)' : 'scale(0.9)',
        transformOrigin: 'center',
        zIndex: 10,
      }}
    >
      {/* 🌌 FONDO CIRCULAR ANTIHORARIO MÁS GRANDE */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300%', // Mucho más grande
          height: '300%', // Mucho más grande
          background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.15), rgba(255, 107, 53, 0.12), rgba(102, 187, 106, 0.10), rgba(0, 188, 212, 0.08), rgba(156, 39, 176, 0.06), rgba(255, 215, 0, 0.15))',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ayni-cosmic-reverse-rotation 45s linear infinite reverse', // Antihorario
          opacity: 0.6,
          zIndex: 1,
        }}
      />

      {/* 🪐 SISTEMA ORBITAL AYNI CENTRAL */}
      {renderCentralOrb()}
    </Box>
  );
};

export default AyniMetricsCardRevolutionary;
