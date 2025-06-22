import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  InputBase,
  alpha,
  useTheme,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Menu as MenuIcon,
  Home,
  Logout,
  Settings,
  AdminPanelSettings,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { MainNavigation } from '../navigation/MainNavigation';

interface AppHeaderProps {
  onDrawerToggle?: () => void;
  showTopLoader?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onDrawerToggle, showTopLoader }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulate periodic sync operations
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        // 40% chance every 8 seconds
        setIsSyncing(true);
        setTimeout(() => {
          setIsSyncing(false);
        }, 3000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
    navigate('/login');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      component="header"
      role="banner"
      data-testid="app-header"
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'primary.main',
        color: 'text.primary',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        component="nav"
        role="navigation"
        aria-label="Navegación principal"
        sx={{ gap: 2 }}
      >
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Abrir menú de navegación"
          title="Abrir menú de navegación"
          onClick={onDrawerToggle}
          data-testid="hamburger-menu"
          className="hamburger-menu mobile-only responsive-element menu-toggle icon-micro-interactive"
          data-responsive="mobile-only"
          data-breakpoint="md-down"
          data-contextual="menu-control"
          data-context-type="navigation-toggle"
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link
            to="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
            aria-label="Ir a la página principal de CoomÜnity"
            title="Ir a la página principal"
            className="brand-link contextual-navigation"
            data-contextual="brand-navigation"
          >
            <Typography
              variant="h6"
              className="brand-logo contextual-branding"
              data-contextual="application-brand"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CoomÜnity
            </Typography>
          </Link>
        </Box>

        {/* Sync indicator */}
        {isSyncing && (
          <Box
            className="sync-indicator contextual-loading responsive-element animate-fade-in"
            data-loading="true"
            data-contextual="sync-status"
            data-context-type="system-sync"
            data-responsive="sync-display"
            sx={{ ml: 2, display: 'flex', alignItems: 'center' }}
          >
            <CircularProgress
              className="sync-spinner loading contextual-progress loading-bounce"
              size={16}
              sx={{ color: 'white', mr: 1 }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'white', fontSize: '0.7rem' }}
            >
              Sincronizando
            </Typography>
          </Box>
        )}

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          role="search"
          aria-label="Formulario de búsqueda"
          className="search-container desktop-only responsive-element"
          data-responsive="desktop-only"
          data-breakpoint="sm-up"
          data-contextual="search-interface"
          data-context-type="global-search"
          sx={{
            position: 'relative',
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.grey[100], 0.8),
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[100], 1),
              transform: 'scale(1.01)',
            },
            marginLeft: 0,
            width: '100%',
            maxWidth: 400,
            display: { xs: 'none', sm: 'block' },
            transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon color="action" />
          </Box>
          <InputBase
            placeholder="Buscar en CoomÜnity..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input contextual-input"
            data-contextual="search-input"
            data-context-type="global-search-field"
            inputProps={{
              'aria-label': 'Buscar en CoomÜnity',
              title: 'Buscar en CoomÜnity',
            }}
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
              },
            }}
          />
        </Box>

        {/* Mobile Search Icon */}
        <IconButton
          color="inherit"
          aria-label="Buscar"
          title="Buscar"
          className="mobile-search-toggle mobile-only responsive-element icon-micro-interactive"
          data-responsive="mobile-only"
          data-breakpoint="sm-down"
          data-contextual="search-toggle"
          data-context-type="mobile-search-control"
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <SearchIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications */}
        <IconButton
          color="inherit"
          aria-label="Notificaciones"
          title="Ver notificaciones"
          className="notification-button contextual-control icon-micro-interactive"
          data-contextual="notification-access"
          data-context-type="user-notifications"
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile Menu */}
        <IconButton
          edge="end"
          aria-label="Perfil de usuario"
          title="Abrir menú de perfil"
          aria-controls={isMenuOpen ? 'primary-search-account-menu' : undefined}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          className="profile-menu-button contextual-control"
          data-contextual="user-profile"
          data-context-type="profile-access"
        >
          <Avatar
            src={user?.avatar_url}
            alt={user?.full_name}
            className="user-avatar contextual-data avatar-micro-interactive"
            data-contextual="user-avatar"
            data-context-type="profile-image"
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>

        {/* Profile Menu Dropdown */}
        <Menu
          id="primary-search-account-menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 200,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          aria-label="Menú de perfil de usuario"
          className="profile-menu contextual-menu"
          data-contextual="user-profile-menu"
          data-context-type="profile-actions"
        >
          {/* User Info Header */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={user?.avatar_url}
                alt={user?.full_name}
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                  {user?.full_name || 'Usuario'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: 'block' }}
                >
                  {user?.email}
                </Typography>
                {user?.role && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                    }}
                  >
                    {user.role}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}
            className="profile-menu-item contextual-action"
            data-contextual="profile-view"
            data-context-type="profile-navigation"
            sx={{ py: 1.5 }}
          >
            <AccountCircle sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="body2">Ver Perfil</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/settings');
            }}
            className="settings-menu-item contextual-action"
            data-contextual="settings-access"
            data-context-type="settings-navigation"
            sx={{ py: 1.5 }}
          >
            <Settings sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="body2">Configuración</Typography>
          </MenuItem>

          {/* Admin Panel - Only for admin users */}
          {(user?.role === 'admin' ||
            user?.role === 'Super Admin' ||
            user?.role === 'Content Admin') && (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/admin');
              }}
              className="admin-menu-item contextual-action"
              data-contextual="admin-access"
              data-context-type="admin-navigation"
              sx={{ py: 1.5 }}
            >
              <AdminPanelSettings sx={{ mr: 2, color: 'warning.main' }} />
              <Typography variant="body2">Panel de Administración</Typography>
            </MenuItem>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Sign Out */}
          <MenuItem
            onClick={handleSignOut}
            className="signout-menu-item contextual-action logout-action"
            data-contextual="user-logout"
            data-context-type="session-termination"
            sx={{
              py: 1.5,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              },
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión actual"
          >
            <Logout sx={{ mr: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Cerrar Sesión
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Enhanced Navigation Section */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: 'primary.dark' }}>
        <MainNavigation />
      </Box>
    </AppBar>
  );
};
