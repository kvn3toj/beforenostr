import React, { useCallback } from 'react';
import { useGuardianColors } from '../../hooks/useGuardianColors';
import { CosmicCard } from '../../components/CosmicCard';
import { CardContent, CardActions, Button, Box, Typography, LinearProgress, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

export const ReciprocidadBalanceWidget: React.FC<ReciprocidadBalanceWidgetProps> = ({
  balance,
  nivel,
  progreso,
  meritos,
  ondas,
  isLoading,
  showAnimation = true,
  compactView = false,
}) => {
  const { palette, getElementColor } = useGuardianColors();

  const progressPercentage = Math.min(Math.max(progreso, 0), 100);
  const balancePercentage = Math.min(Math.max(balance * 100, 0), 100);

  const cardActions = (
    <CardActions
      sx={{
        borderTop: `1px solid ${alpha(palette.divider, 0.3)}`,
        backgroundColor: alpha(palette.background, 0.7),
        backdropFilter: 'blur(8px)',
      }}
      role="group"
      aria-label="Acciones de reciprocidad"
    >
      <Button
        variant="outlined"
        size="small"
        onClick={() => console.log('Ver detalle de reciprocidad')}
        sx={{
          background: `linear-gradient(135deg, ${alpha(getElementColor('espiritu'), 0.2)}, ${alpha(getElementColor('espiritu'), 0.1)})`,
          color: getElementColor('espiritu'),
          border: `1px solid ${alpha(getElementColor('espiritu'), 0.3)}`,
          backdropFilter: 'blur(4px)',
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha(getElementColor('espiritu'), 0.3)}, ${alpha(getElementColor('espiritu'), 0.2)})`,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        aria-describedby="reciprocidad-details-description"
      >
        Ver Detalle
      </Button>
      <div
        id="reciprocidad-details-description"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        Abre una vista detallada de tu balance de reciprocidad, méritos acumulados y progreso hacia el siguiente nivel
      </div>
    </CardActions>
  );

  if (isLoading) {
    return (
      <CosmicCard
        element="espiritu"
        variant="primary"
        enableAnimations={showAnimation}
        enableGlow={true}
        cosmicIntensity="medium"
        sx={{
          height: compactView ? 180 : 220,
          position: 'relative',
        }}
        role="region"
        aria-label="Widget de balance de reciprocidad"
        aria-busy="true"
        aria-describedby="reciprocidad-loading-description"
      >
        <div
          id="reciprocidad-loading-description"
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          Cargando información de balance de reciprocidad, méritos y ondas
        </div>
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(palette.background, 0.9)}, ${alpha(palette.background, 0.7)})`,
          backdropFilter: 'blur(8px)',
        }}>
          <CircularProgress
            size={compactView ? 40 : 60}
            sx={{
              color: getElementColor('espiritu'),
              mb: 2
            }}
            aria-label="Cargando datos de reciprocidad"
          />
          <Typography
            variant="body2"
            color="text.secondary"
            aria-live="polite"
          >
            Sincronizando energías cósmicas...
          </Typography>
        </CardContent>
      </CosmicCard>
    );
  }

  return (
    <CosmicCard
      element="espiritu"
      variant="primary"
      enableAnimations={showAnimation}
      enableGlow={true}
      cosmicIntensity="medium"
      title="Balance Ayni"
      sx={{
        height: compactView ? 180 : 220,
        position: 'relative',
      }}
      actions={cardActions}
      role="region"
      aria-label="Widget de balance de reciprocidad"
      aria-describedby="reciprocidad-widget-description"
    >
      <div
        id="reciprocidad-widget-description"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        Muestra tu balance actual de reciprocidad de {balance.toFixed(1)}, nivel {nivel}, con {meritos} méritos y {ondas} ondas acumuladas
      </div>

      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${alpha(palette.background, 0.9)}, ${alpha(palette.background, 0.7)})`,
        backdropFilter: 'blur(8px)',
        height: '100%',
        justifyContent: 'space-between',
      }}>
        {/* 🌟 Indicador de Balance Central */}
        <Box sx={{ position: 'relative', mb: compactView ? 1 : 2 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={compactView ? 80 : 100}
            thickness={6}
            sx={{
              color: alpha(getElementColor('espiritu'), 0.2),
              position: 'absolute',
            }}
            aria-hidden="true"
          />
          <CircularProgress
            variant="determinate"
            value={balancePercentage}
            size={compactView ? 80 : 100}
            thickness={6}
            sx={{
              color: getElementColor('espiritu'),
              filter: 'drop-shadow(0 0 8px rgba(255,183,77,0.4))',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
            aria-label={`Balance de reciprocidad: ${balance.toFixed(1)} de 1.0`}
          />
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography
              variant={compactView ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 700,
                color: getElementColor('espiritu'),
                textShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
              aria-label={`Balance actual: ${balance.toFixed(1)}`}
            >
              {balance.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        {/* 📊 Nivel y Progreso */}
        <Box sx={{ width: '100%', mb: compactView ? 1 : 1.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: palette.text.primary,
              mb: 0.5,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
            id="nivel-actual-label"
          >
            {nivel}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: compactView ? 6 : 8,
              borderRadius: 4,
              backgroundColor: alpha(getElementColor('espiritu'), 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${getElementColor('espiritu')}, ${alpha(getElementColor('espiritu'), 0.8)})`,
                boxShadow: '0 0 8px rgba(255,183,77,0.3)',
              },
            }}
            aria-labelledby="nivel-actual-label"
            aria-label={`Progreso hacia siguiente nivel: ${progressPercentage}%`}
          />
          <Typography
            variant="caption"
            sx={{
              color: palette.text.secondary,
              fontSize: compactView ? '0.65rem' : '0.7rem',
              mt: 0.5,
              display: 'block'
            }}
            aria-live="polite"
          >
            Progreso: {progressPercentage.toFixed(0)}%
          </Typography>
        </Box>

        {/* 💎 Métricas de Energía */}
        <Stack
          direction="row"
          spacing={compactView ? 1.5 : 2}
          sx={{ width: '100%' }}
          role="group"
          aria-label="Métricas de energía espiritual"
        >
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography
              variant={compactView ? "h6" : "h5"}
              sx={{
                fontWeight: 700,
                color: getElementColor('espiritu'),
                fontSize: compactView ? '1rem' : '1.25rem',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              aria-label={`Méritos acumulados: ${meritos}`}
            >
              {meritos}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: palette.text.secondary,
                fontSize: compactView ? '0.6rem' : '0.65rem',
                fontWeight: 500
              }}
            >
              Mëritos
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography
              variant={compactView ? "h6" : "h5"}
              sx={{
                fontWeight: 700,
                color: getElementColor('espiritu'),
                fontSize: compactView ? '1rem' : '1.25rem',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              aria-label={`Ondas generadas: ${ondas}`}
            >
              {ondas}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: palette.text.secondary,
                fontSize: compactView ? '0.6rem' : '0.65rem',
                fontWeight: 500
              }}
            >
              Öndas
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </CosmicCard>
  );
};
