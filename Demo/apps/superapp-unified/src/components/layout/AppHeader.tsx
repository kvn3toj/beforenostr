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
  ListItemIcon,
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
import { useDynamicTheme } from '../../context/DynamicThemeContext';
import { MainNavigation } from '../navigation/MainNavigation';

interface AppHeaderProps {
  onDrawerToggle?: () => void;
  showTopLoader?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onDrawerToggle, showTopLoader }) => {
  const theme = useTheme();
  const { theme: dynamicTheme } = useDynamicTheme();
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
        backgroundColor: dynamicTheme.headerBackground,
        color: dynamicTheme.headerText,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        component="nav"
        role="navigation"
        aria-label="Navegación principal"
        sx={{ gap: 2, color: dynamicTheme.headerText }}
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
                background: `linear-gradient(45deg, ${dynamicTheme.headerText} 30%, ${alpha(dynamicTheme.headerText, 0.7)} 90%)`,
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
              sx={{ color: dynamicTheme.headerText, mr: 1 }}
            />
            <Typography
              variant="caption"
              sx={{ color: dynamicTheme.headerText, fontSize: '0.7rem' }}
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
          onClick={handleProfileMenuOpen}
          size="small"
          aria-label="Menú del perfil de usuario"
          aria-controls={isMenuOpen ? 'primary-search-account-menu' : undefined}
          aria-haspopup="true"
          color="inherit"
          data-testid="profile-menu-button"
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={user?.avatarUrl || ''}
            alt={user?.fullName || 'Avatar del usuario'}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <AccountCircle />}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          id="primary-search-account-menu"
          keepMounted
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="subtitle1" component="div">
              {user?.fullName}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Mi Perfil
          </MenuItem>
          {user?.roles?.includes('admin') && (
             <MenuItem onClick={() => navigate('/admin')}>
             <ListItemIcon>
               <AdminPanelSettings fontSize="small" />
             </ListItemIcon>
             Panel de Admin
           </MenuItem>
          )}
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Configuración
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">Cerrar Sesión</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Enhanced Navigation Section */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: 'primary.dark' }}>
        <MainNavigation />
      </Box>

      {showTopLoader && (
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
          <div className="top-loader-bar" />
        </Box>
      )}
    </AppBar>
  );
};
