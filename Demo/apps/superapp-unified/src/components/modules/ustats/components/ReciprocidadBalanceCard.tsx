import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';

// 🌌 IMPORT DEL SISTEMA DE COLORES CÓSMICO
import { UNIFIED_COLORS } from '../../../../theme/colors';

interface ReciprocidadBalanceCardProps {
  balance: number;
}

const ReciprocidadBalanceCard: React.FC<ReciprocidadBalanceCardProps> = ({ balance }) => {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: '16px',
        background: UNIFIED_COLORS.themes.minimalist.surface,
        borderColor: UNIFIED_COLORS.themes.minimalist.divider,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AccountBalance sx={{
          color: UNIFIED_COLORS.concepts.reciprocidad,
          mr: 1
        }} />
        <Typography sx={{
          fontWeight: 600,
          color: UNIFIED_COLORS.themes.minimalist.text.secondary
        }}>
          Equilibrio de Reciprocidad
        </Typography>
      </Box>
      <Typography variant="h4" sx={{
        fontWeight: 700,
        color: UNIFIED_COLORS.concepts.reciprocidad,
        mb: 1
      }}>
        {balance}%
      </Typography>
      <Typography variant="body2" sx={{
        color: UNIFIED_COLORS.themes.minimalist.text.muted,
        mb: 1,
        fontStyle: 'italic'
      }}>
        "Lo que das, recibes - Lo que recibes, das"
      </Typography>
      <LinearProgress
        variant="determinate"
        value={balance}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: UNIFIED_COLORS.themes.minimalist.divider,
          '& .MuiLinearProgress-bar': {
            backgroundColor: UNIFIED_COLORS.concepts.reciprocidad,
          },
        }}
      />
    </Paper>
  );
};

export default ReciprocidadBalanceCard;
