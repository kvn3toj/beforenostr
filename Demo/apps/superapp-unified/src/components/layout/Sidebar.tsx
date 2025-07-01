import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Drawer,
  Stack,
  alpha,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Store,
  PlayArrow,
  People,
  AccountCircle,
  AccountBalanceWallet,
  Analytics,
  EmojiEvents,
  Settings,
  Help,
  SwapHoriz,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Simplificamos la lista de navegación
const mainNavItems = [
  { label: 'Inicio', icon: <Home />, path: '/' },
  { label: 'Marketplace', icon: <Store />, path: '/marketplace' },
  { label: 'LETS', icon: <SwapHoriz />, path: '/lets' },
  { label: 'ÜPlay', icon: <PlayArrow />, path: '/uplay' },
  { label: 'Social', icon: <People />, path: '/social' },
  { label: 'Retos', icon: <EmojiEvents />, path: '/challenges' },
  { label: 'Billetera', icon: <AccountBalanceWallet />, path: '/wallet' },
  { label: 'Estadísticas', icon: <Analytics />, path: '/ustats' },
];

const secondaryNavItems = [
  { label: 'Mi Perfil', icon: <AccountCircle />, path: '/profile' },
  { label: 'Configuración', icon: <Settings />, path: '/settings' },
  { label: 'Ayuda', icon: <Help />, path: '/help' },
];

interface SidebarProps {
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
  drawerWidth: number;
}

const NavItem: React.FC<{item: any, isActive: boolean, onClick: (path: string) => void}> = ({ item, isActive, onClick }) => {
  return (
    <ListItemButton
      selected={isActive}
      onClick={() => onClick(item.path)}
      sx={{
        mx: 2,
        my: 0.5,
        borderRadius: 2,
        '&.Mui-selected': {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
          color: 'primary.main',
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
          },
          '& .MuiListItemIcon-root': {
            color: 'primary.main',
          },
        },
         '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.04),
          },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontSize: '0.95rem',
          fontWeight: isActive ? 600 : 500,
        }}
      />
    </ListItemButton>
  );
}


export const Sidebar: React.FC<SidebarProps> = ({
  variant = 'permanent',
  open = false,
  onClose,
  drawerWidth,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === 'temporary' && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack sx={{ p: 2, pt: 3 }} direction="row" alignItems="center" spacing={1.5}>
        <img
          src="/coomunity-logo.svg"
          alt="CoomÜnity Logo"
          style={{
            height: 40,
            width: 'auto'
          }}
        />
      </Stack>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <List dense>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} isActive={isActive(item.path)} onClick={handleNavigation} />
          ))}
        </List>
      </Box>

      <Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.avatarUrl || undefined} alt={user?.fullName || 'Usuario'} />
            <Stack sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.fullName || 'Coomuner'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Stack>
             <Tooltip title="Cerrar Sesión">
                <IconButton onClick={signOut} size="small">
                    <Logout />
                </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Divider sx={{ my: 1 }} />
        <List dense>
          {secondaryNavItems.map((item) => (
             <NavItem key={item.path} item={item} isActive={isActive(item.path)} onClick={handleNavigation} />
          ))}
        </List>
        <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              v1.0.0 - Claridad Orgánica
            </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={variant}
      PaperProps={{
        sx: {
          width: drawerWidth,
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};
