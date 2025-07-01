import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  SportsEsports,
  Groups,
  School,
  ShoppingCart,
  EmojiEvents,
  AccountBalanceWallet,
} from '@mui/icons-material';

const moduleConfigs = [
  {
    id: 'uplay',
    title: 'ÜPlay',
    description: 'Centro de Entretenimiento Interactivo.',
    icon: SportsEsports,
    route: '/uplay',
    color: '#E91E63',
  },
  {
    id: 'social',
    title: 'USocial',
    description: 'Conecta y crece con tu comunidad.',
    icon: Groups,
    route: '/social',
    color: '#2196F3',
  },
  {
    id: 'lets',
    title: 'LETS',
    description: 'Aprende, enseña y comparte conocimiento.',
    icon: School,
    route: '/lets',
    color: '#4CAF50',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Intercambia productos y servicios.',
    icon: ShoppingCart,
    route: '/marketplace',
    color: '#FF9800',
  },
  {
    id: 'challenges',
    title: 'Retos',
    description: 'Supérate con desafíos personalizados.',
    icon: EmojiEvents,
    route: '/challenges',
    color: '#9C27B0',
  },
  {
    id: 'wallet',
    title: 'Billetera',
    description: 'Gestiona tu patrimonio digital.',
    icon: AccountBalanceWallet,
    route: '/wallet',
    color: '#00BCD4',
  },
];

export const MainModuleCards: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
        Módulos Principales
      </Typography>
      <Grid container spacing={2}>
        {moduleConfigs.map((module) => {
          const Icon = module.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <Paper
                variant="outlined"
                onClick={() => navigate(module.route)}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 16px ${alpha(module.color, 0.08)}`,
                    borderColor: alpha(module.color, 0.3),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${alpha(module.color, 0.2)}`,
                  }}
                >
                  <Icon sx={{ fontSize: 24, color: module.color }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {module.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.4,
                  }}
                >
                  {module.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
