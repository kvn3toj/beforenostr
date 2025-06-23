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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Importar los nuevos componentes
import { NavigationMenu, NavigationItem } from '../components/common/Navigation/NavigationMenu';

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
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import ThemeSelector from '../components/ThemeSelector';

const drawerWidth = 280;

// Componente del Logo minimalista
const MinimalLogo: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const navigate = useNavigate();

  return (
    <Box
      component="button"
      onClick={() => navigate('/')}
      sx={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: collapsed ? '8px' : '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        width: '100%',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        transition: 'all 0.3s ease',
        borderRadius: '8px',
        margin: collapsed ? '8px' : '16px',
        marginBottom: collapsed ? '16px' : '24px',
      }}
      aria-label="Ir al inicio"
    >
      {collapsed ? (
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #CDA83A, #FFD700)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          C
        </Typography>
      ) : (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: 'var(--header-text)',
            letterSpacing: '0.5px',
          }}
        >
          CoomÜnity
        </Typography>
      )}
    </Box>
  );
};

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Verificar si el usuario es administrador
  const isAdmin = user?.roles?.includes('admin') || false;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleUserMenuClose();
  };

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
      {/* Logo en el drawer */}
      <MinimalLogo collapsed={false} />

      {/* Navegación */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <NavigationMenu
          items={navigationItems}
          onItemClick={() => setMobileOpen(false)}
        />
      </Box>
    </Box>
  );

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--nav-menu-background)',
        color: 'var(--nav-menu-text)',
      }}
    >
      {/* Logo en el drawer */}
      <MinimalLogo collapsed={false} />

      {/* Navegación */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <NavigationMenu
          items={navigationItems}
          onItemClick={() => setMobileOpen(false)}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'var(--main-background)' }}>
      <CssBaseline />

      {/* Header minimalista */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'var(--header-background)',
          color: 'var(--header-text)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
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
              color: 'var(--header-text)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* Logo en el header (solo en móvil cuando el drawer está cerrado) */}
          {isMobile && !mobileOpen && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'var(--header-text)',
                letterSpacing: '0.5px',
              }}
            >
              CoomÜnity
            </Typography>
          )}

          {/* Espacio flexible */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'var(--secondary-text)', display: { xs: 'none', sm: 'block' } }}>
              {user?.email || 'Usuario'}
            </Typography>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                color: 'var(--header-text)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--accent-color)' }}>
                <PersonIcon />
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
          {t('profile')}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          {t('logout')}
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'var(--nav-menu-background)',
              color: 'var(--nav-menu-text)',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'var(--nav-menu-background)',
              color: 'var(--nav-menu-text)',
              border: 'none',
              boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          color: 'var(--primary-text)',
        }}
      >
        <Toolbar />
        <Outlet />
        <div className="mt-8">
          <ThemeSelector />
        </div>
      </Box>
    </Box>
  );
};
