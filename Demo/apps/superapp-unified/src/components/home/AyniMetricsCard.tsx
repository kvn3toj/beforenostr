import React from 'react';
import {
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  AutoAwesome,
  EmojiEvents,
  Favorite,
  Psychology,
  LocalFireDepartment,
  Waves,
  Park,
  Air,
  Star,
} from '@mui/icons-material';

// Import our new design system components
import { AyniCard } from '../ui';
import { cn, getElementColor, elementColors } from '../../utils/styles';

interface ElementStats {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface AyniMetricsProps {
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
}

// Element configuration with CoomÜnity philosophy
const elementConfig = {
  fuego: {
    name: 'Fuego',
    icon: <LocalFireDepartment />,
    color: elementColors.fuego.primary,
    description: 'Pasión y acción',
  },
  agua: {
    name: 'Agua',
    icon: <Waves />,
    color: elementColors.agua.primary,
    description: 'Fluir y adaptabilidad',
  },
  tierra: {
    name: 'Tierra',
    icon: <Park />,
    color: elementColors.tierra.primary,
    description: 'Estabilidad y confianza',
  },
  aire: {
    name: 'Aire',
    icon: <Air />,
    color: elementColors.aire.primary,
    description: 'Comunicación e ideas',
  },
};

const ElementIcon: React.FC<{
  element: keyof typeof elementConfig;
  value: number;
}> = ({ element, value }) => {
  const elementData = elementConfig[element];

  return (
    <Box className="text-center relative">
      <Box
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center relative mb-2",
          "cursor-pointer transition-transform duration-200 hover:scale-105"
        )}
        style={{
          background: `conic-gradient(${elementData.color} ${value * 3.6}deg, ${elementData.color}20 0deg)`,
        }}
      >
        <Box
          className={cn(
            "w-13 h-13 rounded-full bg-white flex items-center justify-center",
            "text-2xl"
          )}
          style={{ color: elementData.color }}
        >
          {elementData.icon}
        </Box>
      </Box>
      <Typography
        variant="caption"
        className="coomunity-caption font-bold capitalize block mb-1"
      >
        {elementData.name}
      </Typography>
      <Typography 
        variant="caption" 
        className="coomunity-caption text-coomunity-500"
      >
        {value}%
      </Typography>
    </Box>
  );
};

export const AyniMetricsCard: React.FC<AyniMetricsProps> = ({
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
}) => {
  return (
    <AyniCard
      className={cn(
        "h-full relative overflow-hidden",
        "bg-gradient-to-br from-coomunity-50 via-white to-purple-50"
      )}
    >
      {/* Decorative background elements using design tokens */}
      <Box
        className={cn(
          "absolute -top-24 -right-24 w-48 h-48 rounded-full",
          "bg-gradient-radial from-coomunity-100/20 to-transparent"
        )}
      />

      <Box className="p-6 relative z-10 space-y-6">
        {/* Header section with design tokens */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            className={cn(
              "w-12 h-12 bg-gradient-coomunity"
            )}
          >
            <AutoAwesome />
          </Avatar>
          <Box className="flex-1">
            <Typography 
              variant="h5" 
              className="coomunity-h5 font-bold text-coomunity-900"
            >
              Tu Progreso CoomÜnity
            </Typography>
            <Typography 
              variant="body2" 
              className="coomunity-body-sm text-coomunity-600"
            >
              Balance Ayni y Contribución al Bien Común
            </Typography>
          </Box>
          {!isConnected && (
            <Chip
              label="Offline"
              color="warning"
              size="small"
              variant="outlined"
              className="font-medium"
            />
          )}
        </Stack>

        {/* Main metrics using design tokens */}
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box className="text-center">
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-gradient-coomunity",
                  "flex items-center justify-center"
                )}
              >
                {ondas.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                className="coomunity-body-sm text-coomunity-700 font-bold"
              >
                Öndas Acumuladas
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-500"
              >
                Energía vibracional
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box className="text-center">
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-gold-600",
                  "flex items-center justify-center gap-2"
                )}
              >
                <EmojiEvents className="text-3xl" />
                {meritos}
              </Typography>
              <Typography
                variant="body2"
                className="coomunity-body-sm text-coomunity-700 font-bold"
              >
                Mëritos
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-500"
              >
                Logros por Bien Común
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box className="text-center">
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-green-600",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Favorite className="text-3xl" />
                {Math.round(balanceAyni * 100)}%
              </Typography>
              <Typography
                variant="body2"
                className="coomunity-body-sm text-coomunity-700 font-bold"
              >
                Balance Ayni
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-500"
              >
                Dar y recibir
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box className="text-center">
              <Typography
                variant="h3"
                className={cn(
                  "coomunity-h3 font-bold text-red-600",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Psychology className="text-3xl" />
                {bienComunContributions}
              </Typography>
              <Typography
                variant="body2"
                className="coomunity-body-sm text-coomunity-700 font-bold"
              >
                Bien Común
              </Typography>
              <Typography 
                variant="caption" 
                className="coomunity-caption text-coomunity-500"
              >
                Contribuciones
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Level progress using design tokens */}
        <Box className="space-y-3">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={ayniLevel}
              color="primary"
              variant="outlined"
              className={cn(
                "font-bold bg-gradient-to-r from-coomunity-50 to-purple-50",
                "border-coomunity-300"
              )}
            />
            <Typography 
              variant="body2" 
              className="coomunity-body-sm text-coomunity-600"
            >
              Progreso a <strong className="text-coomunity-800">{nextLevel}</strong>
            </Typography>
          </Stack>
          
          <LinearProgress
            variant="determinate"
            value={ayniProgress}
            className="h-3 rounded-full"
            sx={{
              backgroundColor: 'var(--color-coomunity-100)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, var(--color-coomunity-500), var(--color-coomunity-600))',
                borderRadius: '6px',
              },
            }}
          />
          
          <Typography
            variant="caption"
            className="coomunity-caption text-coomunity-500 block"
          >
            {ayniProgress}% completado • Continúa contribuyendo al Bien Común
          </Typography>
        </Box>

        {/* Elemental balance using design tokens */}
        <Box className="space-y-4">
          <Typography
            variant="subtitle1"
            className="coomunity-h6 font-bold text-coomunity-900"
          >
            Equilibrio Elemental
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            {Object.entries(elementos).map(([elemento, valor]) => (
              <Grid item key={elemento}>
                <ElementIcon 
                  element={elemento as keyof typeof elementConfig} 
                  value={valor} 
                />
              </Grid>
            ))}
          </Grid>
          
          <Typography
            variant="caption"
            className={cn(
              "coomunity-caption text-coomunity-500 block text-center",
              "leading-relaxed"
            )}
          >
            Los cuatro elementos representan diferentes aspectos de tu
            desarrollo personal y contribución a la comunidad
          </Typography>
        </Box>
      </Box>
    </AyniCard>
  );
};
