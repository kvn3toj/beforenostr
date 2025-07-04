import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  SportsEsports,
  Groups,
  ShoppingCart,
  School,
  EmojiEvents,
  AccountBalanceWallet,
  Analytics,
  Psychology,
} from '@mui/icons-material';

const quickActions = [
  { id: 'uplay', title: 'ÜPlay', icon: SportsEsports, route: '/uplay', color: '#E91E63' },
  { id: 'social', title: 'USocial', icon: Groups, route: '/social', color: '#2196F3' },
  { id: 'marketplace', title: 'Marketplace', icon: ShoppingCart, route: '/marketplace', color: '#FF9800' },
  { id: 'lets', title: 'LETS', icon: School, route: '/lets', color: '#4CAF50' },
  { id: 'challenges', title: 'Retos', icon: EmojiEvents, route: '/challenges', color: '#9C27B0' },
  { id: 'wallet', title: 'Billetera', icon: AccountBalanceWallet, route: '/wallet', color: '#00BCD4' },
  { id: 'analytics', title: 'Estadísticas', icon: Analytics, route: '/ustats', color: '#607D8B' },
  { id: 'ai', title: 'Asistente IA', icon: Psychology, route: '/ai-assistant', color: '#673AB7' },
];

export const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Acciones Rápidas
      </Typography>
      <Grid container spacing={1}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Grid item xs={3} sm={3} md={3} key={action.id} sx={{ textAlign: 'center' }}>
              <Tooltip title={action.title} arrow>
                <IconButton
                  onClick={() => navigate(action.route)}
      sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: alpha(action.color, 0.1),
                    color: action.color,
                    '&:hover': {
                      backgroundColor: alpha(action.color, 0.2),
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
      }}
    >
                  <Icon />
                </IconButton>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
