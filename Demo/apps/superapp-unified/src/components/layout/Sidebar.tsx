import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Home,
  Store,
  PlayArrow,
  People,
  AccountCircle,
  AccountBalanceWallet,
  Analytics,
  AdminPanelSettings,
  EmojiEvents,
  Settings,
  Help,
  PhoneAndroid,
  SwapHoriz,
} from '@mui/icons-material';

interface NavigationItem {
  label: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
  section?: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  // Core Navigation
  {
    label: 'Inicio',
    icon: <Home />,
    path: '/',
    section: 'main',
  },
  {
    label: 'Mi Perfil',
    icon: <AccountCircle />,
    path: '/profile',
    section: 'main',
  },

  // Modules
  {
    label: 'Marketplace',
    icon: <Store />,
    path: '/marketplace',
    section: 'modules',
  },
  {
    label: 'LETS',
    icon: <SwapHoriz />,
    path: '/lets',
    section: 'modules',
  },
  {
    label: 'ÜPlay',
    icon: <PlayArrow />,
    path: '/uplay',
    section: 'modules',
  },
  {
    label: 'Social',
    icon: <People />,
    path: '/social',
    badge: 2,
    section: 'modules',
  },
  {
    label: 'Grupos',
    icon: <People />,
    path: '/groups',
    section: 'modules',
  },
  {
    label: 'Desafíos',
    icon: <EmojiEvents />,
    path: '/challenges',
    section: 'modules',
  },
  {
    label: 'Wallet',
    icon: <AccountBalanceWallet />,
    path: '/wallet',
    section: 'modules',
  },
  {
    label: 'ÜStats',
    icon: <Analytics />,
    path: '/analytics',
    section: 'modules',
  },
  {
    label: 'Pilgrim',
    icon: <EmojiEvents />,
    path: '/pilgrim',
    section: 'modules',
  },
  {
    label: 'PWA Demo',
    icon: <PhoneAndroid />,
    path: '/pwa',
    section: 'modules',
  },

  // Settings
  {
    label: 'Configuración',
    icon: <Settings />,
    path: '/settings',
    section: 'settings',
  },
  {
    label: 'Ayuda',
    icon: <Help />,
    path: '/help',
    section: 'settings',
  },
];

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderSection = (section: string, title: string) => {
    const items = NAVIGATION_ITEMS.filter(item => item.section === section);
    
    return (
      <Box key={section}>
        {title && (
          <Typography
            variant="overline"
            sx={{
              px: 2,
              py: 1,
              display: 'block',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
        )}
        <List dense>
          {items.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
                aria-label={`Navegar a ${item.label}`}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{ height: 18, fontSize: '0.75rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Navegación lateral"
      data-testid="sidebar"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
      }}
    >
      {/* Navigation Sections */}
      {renderSection('main', '')}
      <Divider sx={{ my: 1 }} />
      {renderSection('modules', 'Módulos')}
      <Divider sx={{ my: 1 }} />
      {renderSection('settings', 'Configuración')}
      
      {/* Status indicator for system visibility */}
      <Box 
        className="status sidebar-status" 
        role="status" 
        aria-live="polite"
        sx={{ px: 2, py: 1, display: 'none' }}
      >
        <Typography variant="caption" className="message">
          Sistema funcionando correctamente
        </Typography>
      </Box>
      
      {/* Admin Section (if admin) */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/admin')}
              aria-label="Acceder al Panel de Administración"
              title="Panel de Administración"
              sx={{
                mx: 1,
                borderRadius: 2,
                color: 'warning.main',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AdminPanelSettings color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Panel"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}; 