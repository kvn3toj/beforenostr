import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme, alpha } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';

interface ReciprocidadBalanceCardProps {
  balance: number;
}

const ReciprocidadBalanceCard: React.FC<ReciprocidadBalanceCardProps> = ({ balance }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AccountBalance sx={{
          color: theme.palette.primary.main,
          mr: 1
        }} />
        <Typography sx={{
          fontWeight: 600,
          color: theme.palette.text.secondary
        }}>
          Equilibrio de Reciprocidad
        </Typography>
      </Box>
      <Typography variant="h4" sx={{
        fontWeight: 700,
        color: theme.palette.text.primary,
        mb: 1
      }}>
        {balance}%
      </Typography>
      <Typography variant="body2" sx={{
        color: theme.palette.text.secondary,
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
          backgroundColor: alpha(theme.palette.divider, 0.3),
          '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 4,
          },
        }}
      />
    </Paper>
  );
};

export default ReciprocidadBalanceCard;
