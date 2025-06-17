import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// 🌌 IMPORTS DEL DESIGN SYSTEM REVOLUCIONARIO
import { CosmicCard } from '../../../../design-system';

interface MinimalMetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
}

const MinimalMetricCard: React.FC<MinimalMetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  change,
  description,
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <CosmicCard
      variant="primary"
      element="fuego"
      enableGlow={true}
      enableAnimations={true}
      cosmicIntensity="medium"
      enableParticles={false}
      sx={{
        height: '100%',
        cursor: 'default',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          {title}
        </Typography>
        <Chip
          size="small"
          label={`${change > 0 ? '+' : ''}${change}%`}
          sx={{
            backgroundColor: alpha(getTrendColor(), 0.1),
            color: getTrendColor(),
            fontWeight: 600,
            fontSize: '0.75rem',
            border: `1px solid ${alpha(getTrendColor(), 0.2)}`,
          }}
        />
      </Box>

      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          lineHeight: 1.2,
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        <Typography
          component="span"
          variant="h5"
          sx={{
            color: 'text.secondary',
            ml: 0.5,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          {unit}
        </Typography>
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '0.75rem',
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>
    </CosmicCard>
  );
};

export default MinimalMetricCard;
