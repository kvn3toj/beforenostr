import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
  alpha,
  useTheme,
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

// 🎨 Componente para iconos de elementos
const ElementIcon: React.FC<{
  element: string;
  value: number;
}> = ({ element, value }) => {
  const theme = useTheme();

  const getElementData = (element: string) => {
    switch (element) {
      case 'fuego':
        return {
          color: '#ef4444',
          icon: <LocalFireDepartment />,
          name: 'Fuego',
          description: 'Pasión y acción',
        };
      case 'agua':
        return {
          color: '#06b6d4',
          icon: <Waves />,
          name: 'Agua',
          description: 'Fluir y adaptabilidad',
        };
      case 'tierra':
        return {
          color: '#78716c',
          icon: <Park />,
          name: 'Tierra',
          description: 'Estabilidad y confianza',
        };
      case 'aire':
        return {
          color: '#8b5cf6',
          icon: <Air />,
          name: 'Aire',
          description: 'Comunicación e ideas',
        };
      default:
        return {
          color: theme.palette.primary.main,
          icon: <Star />,
          name: 'Elemento',
          description: 'Equilibrio',
        };
    }
  };

  const elementData = getElementData(element);

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: `conic-gradient(${elementData.color} ${
            value * 3.6
          }deg, ${alpha(elementData.color, 0.1)} 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mb: 1,
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: elementData.color,
            fontSize: 24,
          }}
        >
          {elementData.icon}
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          textTransform: 'capitalize',
          fontWeight: 'bold',
          display: 'block',
        }}
      >
        {elementData.name}
      </Typography>
      <Typography variant="caption" display="block" color="text.secondary">
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
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, transparent 70%)`,
        }}
      />

      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              width: 48,
              height: 48,
            }}
          >
            <AutoAwesome />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Tu Progreso CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Balance Ayni y Contribución al Bien Común
            </Typography>
          </Box>
          {!isConnected && (
            <Chip
              label="Offline"
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        {/* 🎯 Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {ondas.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Öndas Acumuladas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Energía vibracional
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="bold"
                color="warning.main"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmojiEvents sx={{ fontSize: '0.8em', mr: 0.5 }} />
                {meritos}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Mëritos
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Logros por Bien Común
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="bold"
                color="success.main"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Favorite sx={{ fontSize: '0.8em', mr: 0.5 }} />
                {Math.round(balanceAyni * 100)}%
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Balance Ayni
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dar y recibir
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="bold"
                color="error.main"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Psychology sx={{ fontSize: '0.8em', mr: 0.5 }} />
                {bienComunContributions}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Bien Común
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contribuciones
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 🎯 Progreso de nivel */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Chip
              label={ayniLevel}
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Progreso a <strong>{nextLevel}</strong>
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={ayniProgress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 6,
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: 'block' }}
          >
            {ayniProgress}% completado • Continúa contribuyendo al Bien Común
          </Typography>
        </Box>

        {/* 🎯 Elementos de equilibrio */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Equilibrio Elemental
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {Object.entries(elementos).map(([elemento, valor]) => (
              <Grid item key={elemento}>
                <ElementIcon element={elemento} value={valor} />
              </Grid>
            ))}
          </Grid>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: 'block', textAlign: 'center' }}
          >
            Los cuatro elementos representan diferentes aspectos de tu
            desarrollo personal y contribución a la comunidad
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
