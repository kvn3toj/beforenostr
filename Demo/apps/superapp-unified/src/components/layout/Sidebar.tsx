import React, { useEffect } from 'react';
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
  Drawer,
  useMediaQuery,
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
  Psychology,
} from '@mui/icons-material';
import { ThemeSelector } from './ThemeSelector';
import { useDynamicTheme } from '../../context/DynamicThemeContext';
import { moduleColors } from '../../theme/themeConfig';

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
    path: '/ustats',
    section: 'modules',
  },
  {
    label: 'Consciencia',
    icon: <Psychology />,
    path: '/consciousness',
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

interface SidebarProps {
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  variant = 'permanent',
  open = false,
  onClose
}) => {
  const theme = useTheme();
  const { setTheme, theme: dynamicTheme } = useDynamicTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    // Establecer el color principal para la navegación general
    setTheme({
      ...dynamicTheme,
      buttonPrimaryBackground: moduleColors.superappGeneral,
      navMenuItemActive: moduleColors.superappGeneral
    });
  }, []);

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
                    backgroundColor: dynamicTheme.navMenuItemActive,
                    color: dynamicTheme.buttonPrimaryText,
                    '& .MuiListItemIcon-root': {
                      color: dynamicTheme.buttonPrimaryText,
                    },
                    '&:hover': {
                      backgroundColor: dynamicTheme.navMenuItemActive,
                      filter: 'brightness(0.9)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: dynamicTheme.secondaryText }}>
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

  const sidebarContent = (
    <Box
      component="nav"
      role="navigation"
      aria-label="Navegación lateral"
      data-testid="sidebar"
      sx={{
        width: variant === 'temporary' ? 280 : '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        background: dynamicTheme.navMenuBackground,
        color: dynamicTheme.navMenuText,
      }}
    >
      {/* Navigation Sections */}
      {renderSection('main', '')}
      <Divider sx={{ my: 1 }} />
      {renderSection('modules', 'Módulos')}
      <Divider sx={{ my: 1 }} />
      {renderSection('settings', 'Configuración')}

      {/* Theme Selector */}
      <Box sx={{ mt: 'auto', p: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 1,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          Tema Elemental
        </Typography>
        <ThemeSelector />
      </Box>

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

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop permanent sidebar with proper container
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'relative',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};
