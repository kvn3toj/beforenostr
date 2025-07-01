import React from 'react';
import { Box, Typography, Paper, IconButton, Rating } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';

// 🌌 IMPORT DEL SISTEMA DE COLORES CÓSMICO
import { UNIFIED_COLORS } from '../../../../theme/colors';

interface ElegantStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  rating?: number;
  bgColor?: string;
  iconColor?: string;
}

const ElegantStatCard: React.FC<ElegantStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  rating,
  bgColor = UNIFIED_COLORS.themes.minimalist.surface,
  iconColor = 'action'
}) => {
  const clonedIcon = React.cloneElement(icon as React.ReactElement, { color: iconColor });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: '16px',
        background: bgColor,
        borderColor: UNIFIED_COLORS.themes.minimalist.divider,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          borderColor: UNIFIED_COLORS.brand.gray300,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {clonedIcon}
        <Typography sx={{
          ml: 1,
          fontWeight: 600,
          color: UNIFIED_COLORS.themes.minimalist.text.secondary
        }}>
          {title}
        </Typography>
      </Box>

      <Typography variant="h4" sx={{
        fontWeight: 700,
        color: UNIFIED_COLORS.themes.minimalist.text.primary,
        my: 0.5
      }}>
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" sx={{
          color: UNIFIED_COLORS.themes.minimalist.text.secondary
        }}>
          {subtitle}
        </Typography>
      )}

      {rating && (
        <Rating name="read-only" value={rating} readOnly precision={0.5} sx={{ mt: 1 }} />
      )}
    </Paper>
  );
};

export default ElegantStatCard;
