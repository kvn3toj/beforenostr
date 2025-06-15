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
  Container,
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
import { SkipLinks, SkipLinkSets } from '../components/common/SkipLinks/SkipLinks';

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
  AttachMoney as AttachMoneyIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  EmojiEvents as EmojiEventsIcon,
  Store as StoreIcon,
  Share as ShareIcon,
  Groups as GroupsIcon,
  FitnessCenter as FitnessCenterIcon,
  PersonAdd as PersonAddIcon,
} from '../components/common/Icons';

import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { responsiveUtils } from '../theme';
import { colors } from '../components/design-system/tokens/colors';
import { navigationFocusStyles } from '../utils/accessibility/focus-styles';

// === CONSTANTES RESPONSIVAS ===
const drawerWidth = {
  mobile: 280,
  tablet: 280,
  desktop: 280,
  collapsed: 72,
};

// Altura del header responsiva
const headerHeight = {
  mobile: 56,
  tablet: 64,
  desktop: 64,
};

export const MainLayout = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // === BREAKPOINTS RESPONSIVOS ===
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout } = useAuthStore();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // === HELPERS RESPONSIVOS ===
  const getCurrentDrawerWidth = () => {
    if (isMobile) return drawerWidth.mobile;
    if (collapsed) return drawerWidth.collapsed;
    return drawerWidth.desktop;
  };

  const getCurrentHeaderHeight = () => {
    if (isMobile) return headerHeight.mobile;
    return headerHeight.desktop;
  };

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
          icon: <StoreIcon />,
          path: '/marketplace',
          disabled: false,
        },
        {
          id: 'usocial',
          label: t('nav_usocial'),
          icon: <ShareIcon />,
          path: '/social',
          disabled: false,
        },
        {
          id: 'cops',
          label: 'CoPs',
          icon: <GroupsIcon />,
          path: '/groups',
          disabled: false,
        },
      ],
    },
    {
      id: 'content',
      label: t('nav_content'),
      icon: <CategoryIcon />,
      category: 'Contenido',
      children: [
        {
          id: 'videos',
          label: t('nav_videos'),
          icon: <PlayCircleOutlineIcon />,
          path: '/videos',
        },
        {
          id: 'items',
          label: t('nav_items'),
          icon: <ListAltIcon />,
          path: '/items',
        },
      ],
    },
    {
      id: 'gamification',
      label: t('nav_gamification'),
      icon: <EmojiEventsIcon />,
      category: 'Gamificación',
      children: [
        {
          id: 'personalities',
          label: t('nav_personalities'),
          icon: <SmartToyIcon />,
          path: '/personalities',
        },
        {
          id: 'merits',
          label: t('nav_merits'),
          icon: <StarIcon />,
          path: '/merits',
        },
        {
          id: 'invitations',
          label: t('nav_invitations'),
          icon: <PersonAddIcon />,
          path: '/invitations',
        },
        {
          id: 'wallet',
          label: t('nav_wallet'),
          icon: <AccountBalanceWalletIcon />,
          path: '/wallet',
        },
      ],
    },
    {
      id: 'management',
      label: t('nav_management'),
      icon: <SettingsIcon />,
      category: 'Gestión',
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
          id: 'analytics',
          label: t('nav_analytics'),
          icon: <AnalyticsIcon />,
          path: '/analytics',
        },
        {
          id: 'settings',
          label: t('nav_settings'),
          icon: <SettingsIcon />,
          path: '/settings',
        },
        {
          id: 'audit-logs',
          label: t('nav_audit_logs'),
          icon: <HistoryIcon />,
          path: '/audit-logs',
        },
      ],
    },
  ];

  // === DRAWER CONTENT ===
  const drawerContent = (
    <NavigationMenu
      items={navigationItems}
      currentPath={location.pathname}
      onNavigate={(path: string) => {
        navigate(path);
        if (isMobile) {
          setMobileOpen(false);
        }
      }}
      collapsed={collapsed && !isMobile}
    />
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
      }}
    >
      <CssBaseline />

      {/* Skip Links para Accesibilidad */}
      <SkipLinks 
        links={[
          { 
            href: '#main-content', 
            label: 'Saltar al contenido principal',
            description: 'Salta directamente al área principal de contenido evitando la navegación y encabezado'
          },
          { 
            href: '#navigation-drawer', 
            label: 'Saltar a la navegación',
            description: 'Accede al menú lateral de navegación principal del sistema'
          },
          { 
            href: '#user-menu-button', 
            label: 'Saltar al menú de usuario',
            description: 'Accede directamente al menú de usuario con opciones de perfil y cerrar sesión'
          }
        ]}
      />

      {/* === GLOBAL STYLES RESPONSIVOS === */}
      <GlobalStyles
        styles={{
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      />

      {/* === TOP BAR RESPONSIVO === */}
      <AppBar
        component="header"
        role="banner"
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            sm: collapsed ? `calc(100% - ${drawerWidth.collapsed}px)` : `calc(100% - ${getCurrentDrawerWidth()}px)`,
          },
          ml: {
            xs: 0,
            sm: collapsed ? `${drawerWidth.collapsed}px` : `${getCurrentDrawerWidth()}px`,
          },
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid #E5E7EB',
          height: {
            xs: headerHeight.mobile,
            sm: headerHeight.tablet,
            md: headerHeight.desktop,
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: `${headerHeight.mobile}px !important`,
              sm: `${headerHeight.tablet}px !important`,
              md: `${headerHeight.desktop}px !important`,
            },
            paddingX: {
              xs: theme.spacing(1),
              sm: theme.spacing(2),
              md: theme.spacing(3),
            },
          }}
        >
          {/* === BOTÓN DE MENÚ RESPONSIVO === */}
          <IconButton
            color="inherit"
            aria-label={isMobile 
              ? (mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación")
              : (collapsed ? "Expandir menú de navegación" : "Colapsar menú de navegación")
            }
            aria-describedby="nav-toggle-description"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: {
                xs: theme.spacing(1),
                sm: theme.spacing(2),
              },
              color: '#374151',
              padding: {
                xs: theme.spacing(1),
                sm: theme.spacing(1.5),
              },
              '&:hover': {
                backgroundColor: 'rgba(55, 65, 81, 0.04)',
              },
              ...navigationFocusStyles,
            }}
          >
            {isMobile ? (
              mobileOpen ? <CloseIcon fontSize="inherit" /> : <MenuIcon fontSize="inherit" />
            ) : (
              collapsed ? <ChevronRightIcon fontSize="inherit" /> : <ChevronLeftIcon fontSize="inherit" />
            )}
          </IconButton>
          
          {/* Hidden description for navigation toggle */}
          <div id="nav-toggle-description" style={{ 
            position: 'absolute', 
            width: '1px', 
            height: '1px', 
            padding: 0, 
            margin: '-1px', 
            overflow: 'hidden', 
            clip: 'rect(0, 0, 0, 0)', 
            whiteSpace: 'nowrap', 
            border: 0 
          }}>
            {isMobile 
              ? 'Controla la visibilidad del menú de navegación móvil' 
              : 'Alterna entre vista expandida y contraída del menú lateral'
            }
          </div>

          {/* Logo responsivo solo en mobile */}
          {isMobile && (
            <Box sx={{ mr: 'auto' }}>
              <CoomUnityLogo 
                size="small" 
                variant="symbol" 
                clickable={false}
                color="#374151"
              />
            </Box>
          )}

          {/* Spacer para empujar el contenido del usuario a la derecha */}
          {!isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* === SECCIÓN DEL USUARIO === */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <IconButton
              id="user-menu-button"
              onClick={handleUserMenuOpen}
              aria-label={`Abrir menú de usuario para ${user?.email || 'usuario'}`}
              aria-describedby="user-menu-description"
              aria-controls={Boolean(userMenuAnchor) ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(userMenuAnchor) ? 'true' : undefined}
              sx={{
                p: 0,
                color: '#374151',
                transition: 'all 0.2s ease-in-out',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(55, 65, 81, 0.04)',
                  transform: 'scale(1.05)',
                },
                ...navigationFocusStyles,
              }}
            >
              <Avatar
              sx={{
                width: {
                  xs: 32,
                  sm: 36,
                  md: 40,
                },
                height: {
                  xs: 32,
                  sm: 36,
                  md: 40,
                },
                backgroundColor: colors.primary.main,
                color: colors.primary.contrastText,
                fontWeight: 600,
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem',
                  md: '1.125rem',
                },
              }}
              alt={`Avatar de ${user?.email || 'usuario'}`}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            
            {/* Hidden description for user menu button */}
            <div id="user-menu-description" style={{ 
              position: 'absolute', 
              width: '1px', 
              height: '1px', 
              padding: 0, 
              margin: '-1px', 
              overflow: 'hidden', 
              clip: 'rect(0, 0, 0, 0)', 
              whiteSpace: 'nowrap', 
              border: 0 
            }}>
              Menú con opciones de perfil de usuario, configuración y cerrar sesión
            </div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú de usuario */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        aria-labelledby="user-menu-button"
        // Estilos responsivos para el menú
        sx={{
          '& .MuiPaper-root': {
            minWidth: {
              xs: '160px',
              sm: '180px',
              md: '200px',
            },
          },
          '& .MuiMenuItem-root': {
            padding: {
              xs: theme.spacing(1),
              sm: theme.spacing(1.5),
            },
            fontSize: {
              xs: '0.875rem',
              sm: '1rem',
            },
          },
        }}
      >
        <MenuItem onClick={handleProfile}>
          <PersonIcon sx={{ 
            mr: 1,
            fontSize: {
              xs: '1.25rem',
              sm: '1.5rem',
            },
          }} />
          Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ 
            mr: 1,
            fontSize: {
              xs: '1.25rem',
              sm: '1.5rem',
            },
          }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* === DESKTOP DRAWER RESPONSIVO === */}
      <Drawer
        id="navigation-drawer"
        variant="permanent"
        component="nav"
        aria-label="Navegación principal"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: collapsed ? drawerWidth.collapsed : getCurrentDrawerWidth(),
            backgroundColor: '#272727',
            borderRight: 'none',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            borderRadius: 0,
            overflow: 'hidden',
          },
        }}
        open
        anchor="left"
        PaperProps={{
          sx: {
            [`top: ${getCurrentHeaderHeight()}px !important`]: {},
            [`height: calc(100vh - ${getCurrentHeaderHeight()}px) !important`]: {},
            position: 'fixed !important',
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* === MOBILE DRAWER RESPONSIVO === */}
      <Drawer
        id="navigation-drawer-mobile"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        component="nav"
        aria-label="Navegación principal móvil"
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth.mobile,
            backgroundColor: '#272727',
            borderRight: 'none',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
            borderRadius: 0,
            overflow: 'hidden',
            [`top: ${getCurrentHeaderHeight()}px !important`]: {},
            [`height: calc(100vh - ${getCurrentHeaderHeight()}px) !important`]: {},
            position: 'fixed !important',
            marginTop: '0 !important',
            paddingTop: '0 !important',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* === MAIN CONTENT RESPONSIVO === */}
      <Box
        id="main-content"
        component="main"
        role="main"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Margen responsivo según el estado del drawer
          marginLeft: {
            xs: 0,
            sm: collapsed ? `${drawerWidth.collapsed}px` : `${getCurrentDrawerWidth()}px`,
          },
          marginTop: {
            xs: `${headerHeight.mobile}px`,
            sm: `${headerHeight.tablet}px`,
            md: `${headerHeight.desktop}px`,
          },
          // Padding responsivo para el contenido principal
          padding: {
            xs: theme.spacing(1),
            sm: theme.spacing(2),
            md: theme.spacing(3),
            lg: theme.spacing(4),
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        {/* === CONTENEDOR RESPONSIVO PARA EL CONTENIDO === */}
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            maxWidth: {
              xs: '100%',
              sm: '100%',
              md: '100%',
              lg: isLargeDesktop ? '1400px' : '1200px',
              xl: '1600px',
            },
            margin: '0 auto',
            // Padding horizontal responsivo
            paddingX: {
              xs: 0,
              sm: theme.spacing(1),
              md: theme.spacing(2),
            },
          }}
        >
          {/* Page Content */}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}; 