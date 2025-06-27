import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Store,
  PlayArrow,
  People,
  AccountBalanceWallet,
  Analytics,
  EmojiEvents,
  SwapHoriz,
  AccountCircle,
  Settings,
  Help,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const navItems = [
  { label: 'Inicio', icon: <Home />, path: '/' },
  { label: 'Marketplace', icon: <Store />, path: '/marketplace' },
  { label: 'LETS', icon: <SwapHoriz />, path: '/lets' },
  { label: 'ÜPlay', icon: <PlayArrow />, path: '/uplay' },
  { label: 'Social', icon: <People />, path: '/social' },
  { label: 'Retos', icon: <EmojiEvents />, path: '/challenges' },
  { label: 'Billetera', icon: <AccountBalanceWallet />, path: '/wallet' },
  { label: 'Estadísticas', icon: <Analytics />, path: '/ustats' },
];

const userItems = [
  { label: 'Mi Perfil', icon: <AccountCircle />, path: '/profile' },
  { label: 'Configuración', icon: <Settings />, path: '/settings' },
  { label: 'Ayuda', icon: <Help />, path: '/help' },
];

interface NavigationFixProps {
  children: React.ReactNode;
}

export const NavigationFix: React.FC<NavigationFixProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          CoomÜnity
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Claridad Orgánica
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {user && (
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.avatarUrl || undefined} alt={user.fullName || 'Usuario'} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.fullName || 'Coomuner'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <List sx={{ px: 1 }}>
        {userItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton
            onClick={signOut}
            sx={{
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              color: 'error.main',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header para mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            display: { md: 'none' },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="abrir menú"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              CoomÜnity
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Navigation drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navegación principal"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            zIndex: theme.zIndex.drawer,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          // Añadir margen superior solo en mobile para el AppBar
          mt: { xs: '64px', md: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
