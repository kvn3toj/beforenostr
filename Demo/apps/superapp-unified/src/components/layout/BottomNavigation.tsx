import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Home,
  Store,
  People,
  PlayArrow,
  AccountCircle,
} from '@mui/icons-material';

const MOBILE_NAV_ITEMS = [
  {
    label: 'Inicio',
    value: '/',
    icon: <Home />,
  },
  {
    label: 'Marketplace',
    value: '/marketplace',
    icon: <Store />,
  },
  {
    label: 'ÜPlay',
    value: '/play',
    icon: <PlayArrow />,
  },
  {
    label: 'Social',
    value: '/social',
    icon: <People />,
  },
  {
    label: 'Perfil',
    value: '/profile',
    icon: <AccountCircle />,
  },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const matchedItem = MOBILE_NAV_ITEMS.find(item => 
      item.value === '/' ? currentPath === '/' : currentPath.startsWith(item.value)
    );
    return matchedItem?.value || '/';
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Paper 
      component="nav"
      role="navigation"
      aria-label="Navegación móvil principal"
      className="mobile-nav responsive-element mobile-only"
      data-responsive="mobile-only"
      data-breakpoint="md-down"
      data-contextual="mobile-navigation"
      data-context-type="bottom-navigation"
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' }, // Only on mobile
      }} 
      elevation={3}
    >
      <MuiBottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        className="bottom-navigation-container contextual-navigation"
        data-contextual="navigation-container"
        data-context-type="mobile-nav-tabs"
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
          },
        }}
      >
        {MOBILE_NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
            aria-label={`Navegar a ${item.label}`}
            title={`Ir a ${item.label}`}
            className={`bottom-nav-action contextual-control nav-item-interactive nav-active-indicator ${
              getCurrentValue() === item.value ? 'active' : ''
            }`}
            data-contextual="navigation-action"
            data-context-type="nav-tab"
            data-nav-target={item.value}
            sx={{
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
              '& .MuiSvgIcon-root': {
                transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
              '&:active .MuiSvgIcon-root': {
                transform: 'scale(0.95)',
              },
            }}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
}; 