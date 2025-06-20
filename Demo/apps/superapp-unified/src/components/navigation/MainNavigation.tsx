import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  Home,
  PlayArrow,
  Store,
  People,
  Analytics,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Menu as MenuIcon,
  Search,
  Add,
  Help,
  Feedback,
  Star,
  Message,
  Close
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  color?: string;
  description?: string;
}

const mainNavItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: <Home />,
    path: '/',
    description: 'Página principal de CoomÜnity'
  },
  {
    id: 'uplay',
    label: 'ÜPlay',
    icon: <PlayArrow />,
    path: '/uplay',
    badge: 3,
    color: '#ff6b35',
    description: 'Centro de aprendizaje gamificado'
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: <Store />,
    path: '/marketplace',
    color: '#4caf50',
    description: 'Intercambio de productos y servicios'
  },
  {
    id: 'social',
    label: 'Social',
    icon: <People />,
    path: '/social',
    badge: 12,
    color: '#2196f3',
    description: 'Comunidad y colaboración'
  },
  {
    id: 'ustats',
    label: 'UStats',
    icon: <Analytics />,
    path: '/ustats',
    color: '#9c27b0',
    description: 'Estadísticas y progreso'
  }
];

const speedDialActions = [
  { icon: <Add />, name: 'Crear Contenido', action: 'create' },
  { icon: <Message />, name: 'Nuevo Mensaje', action: 'message' },
  { icon: <Help />, name: 'Ayuda', action: 'help' },
  { icon: <Feedback />, name: 'Feedback', action: 'feedback' }
];

interface MainNavigationProps {
  user?: {
    name: string;
    avatar?: string;
    notifications?: number;
  };
  onLogout?: () => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  user,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('home');

  // Update active item based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const activeNav = mainNavItems.find(item => 
      item.path === currentPath || 
      (item.path !== '/' && currentPath.startsWith(item.path))
    );
    setActiveItem(activeNav?.id || 'home');
  }, [location.pathname]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string, itemId: string) => {
    navigate(path);
    setActiveItem(itemId);
    setMobileDrawerOpen(false);
  };

  const handleSpeedDialAction = (action: string) => {
    console.log(`Speed dial action: ${action}`);
    setSpeedDialOpen(false);
    
    switch (action) {
      case 'create':
        navigate('/create');
        break;
      case 'message':
        navigate('/messages/new');
        break;
      case 'help':
        navigate('/help');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout?.();
  };

  const renderDesktopNavigation = () => (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95), rgba(66, 165, 245, 0.95))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff, #e3f2fd)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => handleNavigation('/', 'home')}
          >
            CoomÜnity
          </Typography>
        </Box>

        {/* Main Navigation */}
        <Box display="flex" alignItems="center" gap={1}>
          {mainNavItems.map((item) => (
            <Tooltip key={item.id} title={item.description} arrow>
              <Button
                variant={activeItem === item.id ? 'contained' : 'text'}
                startIcon={
                  item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )
                }
                onClick={() => handleNavigation(item.path, item.id)}
                data-testid={`nav-${item.id}-button`}
                sx={{
                  color: activeItem === item.id ? 'inherit' : 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: activeItem === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 2,
                  py: 1
                }}
              >
                {item.label}
              </Button>
            </Tooltip>
          ))}
        </Box>

        {/* Right Side Actions */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Search Button */}
          <Tooltip title="Buscar" arrow>
            <IconButton 
              color="inherit" 
              data-testid="search-button"
              onClick={() => navigate('/search')}
            >
              <Search />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notificaciones" arrow>
            <IconButton 
              color="inherit" 
              data-testid="notifications-button"
              onClick={() => navigate('/notifications')}
            >
              <Badge badgeContent={user?.notifications || 0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title={user ? `Perfil de ${user.name}` : 'Perfil'} arrow>
            <IconButton
              onClick={handleProfileMenuOpen}
              data-testid="profile-menu-button"
              sx={{ p: 0 }}
            >
              {user?.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  alt={user.name}
                  sx={{ width: 40, height: 40 }}
                />
              ) : (
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <AccountCircle />
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );

  const renderMobileNavigation = () => (
    <>
      <AppBar 
        position="fixed"
        sx={{ 
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95), rgba(66, 165, 245, 0.95))',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileDrawerOpen(true)}
            data-testid="mobile-menu-button"
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CoomÜnity
          </Typography>

          <IconButton 
            color="inherit" 
            onClick={() => navigate('/notifications')}
            data-testid="mobile-notifications-button"
          >
            <Badge badgeContent={user?.notifications || 0} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        data-testid="mobile-drawer"
      >
        <Box sx={{ width: 280, pt: 2 }}>
          {/* User Info */}
          {user && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Avatar 
                src={user.avatar} 
                sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
              >
                <AccountCircle />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">
                {user.name}
              </Typography>
            </Box>
          )}
          
          <Divider />

          {/* Navigation Items */}
          <List>
            {mainNavItems.map((item) => (
              <ListItem 
                key={item.id}
                component="button"
                onClick={() => handleNavigation(item.path, item.id)}
                data-testid={`mobile-nav-${item.id}`}
                sx={{
                  backgroundColor: activeItem === item.id ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: item.color || 'inherit' }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  secondary={item.description}
                />
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* Additional Actions */}
          <List>
            <ListItem component="button" onClick={() => navigate('/search')}>
              <ListItemIcon><Search /></ListItemIcon>
              <ListItemText primary="Buscar" />
            </ListItem>
            <ListItem component="button" onClick={() => navigate('/settings')}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItem>
            <ListItem component="button" onClick={() => navigate('/help')}>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText primary="Ayuda" />
            </ListItem>
            {user && (
              <ListItem component="button" onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );

  const renderSpeedDial = () => (
    <SpeedDial
      ariaLabel="Acciones rápidas"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon openIcon={<Close />} />}
      onClose={() => setSpeedDialOpen(false)}
      onOpen={() => setSpeedDialOpen(true)}
      open={speedDialOpen}
      data-testid="speed-dial"
    >
      {speedDialActions.map((action) => (
        <SpeedDialAction
          key={action.action}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => handleSpeedDialAction(action.action)}
          data-testid={`speed-dial-${action.action}`}
        />
      ))}
    </SpeedDial>
  );

  const renderProfileMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      data-testid="profile-menu"
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }}
    >
      {user && (
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user.name}
          </Typography>
        </Box>
      )}
      
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <AccountCircle sx={{ mr: 2 }} />
        Mi Perfil
      </MenuItem>
      
      <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
        <Settings sx={{ mr: 2 }} />
        Configuración
      </MenuItem>
      
      <MenuItem onClick={() => { handleMenuClose(); navigate('/favorites'); }}>
        <Star sx={{ mr: 2 }} />
        Favoritos
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 2 }} />
        Cerrar Sesión
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {isMobile ? renderMobileNavigation() : renderDesktopNavigation()}
      {renderProfileMenu()}
      {renderSpeedDial()}
      
      {/* Spacer for fixed navigation */}
      <Toolbar />
    </>
  );
};

export default MainNavigation;