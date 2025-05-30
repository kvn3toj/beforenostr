import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { CoomUnityLogo } from '../Logo/CoomUnityLogo';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface GamifierHeaderProps {
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode[];
  drawerWidth?: number;
}

// Componente del Logo
const GamifierLogo: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <CoomUnityLogo 
        size={size}
        variant="full"
        clickable={true}
        color="currentColor"
        sx={{
          '&:hover': {
            opacity: 0.8,
          },
          transition: 'opacity 0.2s ease',
        }}
      />
    </Box>
  );
};

export const GamifierHeader: React.FC<GamifierHeaderProps> = ({
  title,
  subtitle,
  onMenuToggle,
  showMenuButton = true,
  breadcrumbs = [],
  actions = [],
  drawerWidth = 240,
}) => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeContext();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
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

  const handleSettings = () => {
    navigate('/settings');
    handleUserMenuClose();
  };

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          color: 'inherit',
          '& .MuiBreadcrumbs-separator': {
            color: 'inherit',
            opacity: 0.7,
          },
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          if (isLast || !item.path) {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: isLast ? 'inherit' : 'inherit',
                  opacity: isLast ? 1 : 0.7,
                }}
              >
                {item.icon}
                <Typography variant="body2" color="inherit">
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Link
              key={index}
              component="button"
              variant="body2"
              color="inherit"
              onClick={() => navigate(item.path!)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                opacity: 0.7,
                '&:hover': {
                  opacity: 1,
                  textDecoration: 'underline',
                },
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <AppBar
      position="fixed"
      color="secondary"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#272727', // Negro del header - forzado
        color: '#FFFFFF', // Texto blanco
        borderBottom: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {/* Menu Button */}
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label={t('open_drawer_aria_label')}
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Box sx={{ mr: 3, display: { xs: 'none', sm: 'block' } }}>
          <GamifierLogo size="medium" />
        </Box>

        {/* Title and Breadcrumbs */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {breadcrumbs.length > 0 ? (
            <Box>
              {renderBreadcrumbs()}
              {title && (
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    mt: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </Typography>
              )}
            </Box>
          ) : (
            <Box>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title || t('app_title')}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Custom Actions */}
        {actions.map((action, index) => (
          <Box key={index} sx={{ ml: 1 }}>
            {action}
          </Box>
        ))}

        {/* Theme Toggle */}
        <Tooltip title={t('toggle_theme_tooltip', { 
          mode: mode === 'light' ? t('dark_mode') : t('light_mode') 
        })}>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notificaciones">
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
            sx={{ ml: 1 }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Tooltip title="Perfil de usuario">
          <IconButton
            color="inherit"
            onClick={handleUserMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            {user?.roles?.map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem', height: 20 }}
              />
            ))}
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <PersonIcon sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <SettingsIcon sx={{ mr: 1 }} />
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 300,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6">Notificaciones</Typography>
        </Box>
        <Divider />
        <MenuItem>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Nuevo usuario registrado
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace 5 minutos
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Playlist actualizada
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace 1 hora
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Sistema actualizado
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace 2 horas
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">
            Ver todas las notificaciones
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}; 