import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  GlobalStyles,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// Importar los nuevos componentes
import { NavigationMenu, NavigationItem } from '../components/common/Navigation/NavigationMenu';
import { CoomUnityLogo } from '../components/common/Logo/CoomUnityLogo';

// Iconos de Material UI - Importaciones por defecto
import {
  Home as HomeIcon,
  AccountTree as AccountTreeIcon,
  Category as CategoryIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  SmartToy as SmartToyIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
} from '../components/common/Icons';

import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

export const MainLayout = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout } = useAuthStore();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  // Verificar si el usuario es administrador
  const isAdmin = user?.roles?.includes('admin') || false;

  // Configurar elementos de navegación
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: t('nav_home'),
      icon: <HomeIcon />,
      path: '/',
    },
    {
      id: 'mundos',
      label: t('nav_mundos'),
      icon: <AccountTreeIcon />,
      path: '/mundos',
    },
    {
      id: 'services',
      label: t('nav_services'),
      icon: <CategoryIcon />,
      category: 'Servicios',
      children: [
        {
          id: 'uplay',
          label: t('nav_uplay'),
          icon: <PlayCircleOutlineIcon />,
          children: [
            {
              id: 'playlists',
              label: t('nav_gamified_playlists'),
              icon: <ListAltIcon />,
              path: '/playlists',
            },
            {
              id: 'playlist-direct',
              label: 'Playlists (Directo)',
              icon: <PlayCircleOutlineIcon />,
              path: '/playlist-direct',
            },
          ],
        },
        {
          id: 'umarket',
          label: t('nav_umarket'),
          icon: <PlayCircleOutlineIcon />,
          disabled: true,
        },
        {
          id: 'usocial',
          label: t('nav_usocial'),
          icon: <PlayCircleOutlineIcon />,
          disabled: true,
        },
      ],
    },
    // Sección de Administración - Solo para admins
    ...(isAdmin ? [{
      id: 'administration',
      label: t('nav_administration'),
      icon: <SecurityIcon />,
      category: 'Administración',
      divider: true,
      children: [
        {
          id: 'users',
          label: t('nav_users'),
          icon: <PeopleIcon />,
          path: '/users',
        },
        {
          id: 'roles',
          label: t('nav_roles'),
          icon: <SecurityIcon />,
          path: '/roles',
        },
        {
          id: 'permissions',
          label: t('nav_permissions'),
          icon: <SecurityIcon />,
          path: '/permissions',
        },
        {
          id: 'items',
          label: t('nav_items'),
          icon: <CategoryIcon />,
          path: '/items',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <AnalyticsIcon />,
          path: '/analytics',
        },
        {
          id: 'audit-logs',
          label: t('nav_audit_logs'),
          icon: <HistoryIcon />,
          path: '/audit-logs',
        },
        {
          id: 'settings',
          label: 'Configuración',
          icon: <SettingsIcon />,
          path: '/settings',
        },
      ],
    }] : []),
    {
      id: 'ai-test',
      label: t('nav_ai_test'),
      icon: <StarIcon />,
      path: '/ai-test',
      divider: true,
      category: 'Herramientas',
    },
    {
      id: 'nostr-demo',
      label: t('nav_nostr'),
      icon: <SmartToyIcon />,
      path: '/nostr-demo',
    },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Navegación */}
      <Box sx={{ flex: 1, overflow: 'auto', pt: 2 }}>
        <NavigationMenu
          items={navigationItems}
          collapsed={collapsed}
          onItemClick={() => setMobileOpen(false)}
        />
      </Box>

      {/* Botón de colapso para desktop */}
      {!isMobile && (
        <Box sx={{ p: 1, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              width: '100%',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Estilos globales para corregir el gap del drawer */}
      <GlobalStyles
        styles={{
          '.MuiDrawer-paper': {
            top: '64px !important',
            height: 'calc(100vh - 64px) !important',
            marginTop: '0 !important',
            paddingTop: '0 !important',
          },
          '.MuiDrawer-paperAnchorLeft': {
            top: '64px !important',
            height: 'calc(100vh - 64px) !important',
          },
        }}
      />
      
      {/* Header con logo */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#272727',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: 'none',
          // Eliminar bordes redondeados del header
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          {/* Botón de menú hamburguesa */}
          <IconButton
            color="inherit"
            aria-label="toggle menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            {isMobile ? (mobileOpen ? <CloseIcon /> : <MenuIcon />) : (collapsed ? <MenuIcon /> : <CloseIcon />)}
          </IconButton>

          {/* Logo CoomÜnity Gamifier en el header */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <CoomUnityLogo 
              size="medium"
              variant="full"
              clickable={true}
              color="#FFFFFF"
              sx={{
                '&:hover': {
                  opacity: 0.8,
                },
                transition: 'opacity 0.2s ease',
              }}
            />
          </Box>

          {/* Espacio flexible */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#FFFFFF', display: { xs: 'none', sm: 'block' } }}>
              {user?.email || 'Usuario'}
            </Typography>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#CEA93A' }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú de usuario */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <PersonIcon sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: collapsed ? collapsedDrawerWidth : drawerWidth,
            backgroundColor: '#272727',
            borderRight: 'none',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
            transition: 'width 0.3s ease',
            borderRadius: 0,
            overflow: 'hidden',
          },
        }}
        open
        anchor="left"
        variant="permanent"
        PaperProps={{
          sx: {
            top: '64px !important',
            height: 'calc(100vh - 64px) !important',
            position: 'fixed !important',
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#272727',
            borderRight: 'none',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
            borderRadius: 0,
            overflow: 'hidden',
            top: '64px !important',
            height: 'calc(100vh - 64px) !important',
            position: 'fixed !important',
            marginTop: '0 !important',
            paddingTop: '0 !important',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
          transition: 'margin 0.3s ease',
          marginLeft: isMobile ? 0 : (collapsed ? `${collapsedDrawerWidth}px` : `${drawerWidth}px`),
          marginTop: '64px',
        }}
      >
        {/* Page Content */}
        <Outlet />
      </Box>
    </Box>
  );
}; 