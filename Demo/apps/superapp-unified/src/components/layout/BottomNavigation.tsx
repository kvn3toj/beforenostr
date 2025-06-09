import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Box,
  useTheme,
} from '@mui/material';
import { Home, ShoppingCart, Groups, PlayArrow } from '@mui/icons-material';

const MOBILE_NAV_ITEMS = [
  {
    label: 'Home',
    value: '/',
    icon: <Home />,
  },
  {
    label: 'ÜMarket',
    value: '/marketplace',
    icon: <ShoppingCart />,
  },
  {
    label: 'ÜSocial',
    value: '/social',
    icon: <Groups />,
  },
  {
    label: 'ÜPlay',
    value: '/play',
    icon: <PlayArrow />,
    badge: 3, // Add badge for ÜPlay
  },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const matchedItem = MOBILE_NAV_ITEMS.find((item) =>
      item.value === '/'
        ? currentPath === '/'
        : currentPath.startsWith(item.value)
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
        backgroundColor: '#F3EDF7', // Material Design 3 surface container
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
          height: 70,
          backgroundColor: '#F3EDF7',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '12px 0px 16px 0px',
            color: '#49454F',
            '&.Mui-selected': {
              color: '#1D1B20',
              fontWeight: 600,
              '& .MuiBottomNavigationAction-iconWrapper': {
                backgroundColor: '#E8DEF8',
                borderRadius: '16px',
                padding: '4px 20px',
              },
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
            letterSpacing: '0.5px',
          },
        }}
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const isSelected = getCurrentValue() === item.value;
          const IconComponent = () => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 32,
                height: 32,
                borderRadius: isSelected ? '16px' : 0,
                backgroundColor: isSelected ? '#E8DEF8' : 'transparent',
                position: 'relative',
              }}
            >
              {item.icon}
              {item.badge && (
                <Badge
                  badgeContent={item.badge}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    '& .MuiBadge-badge': {
                      backgroundColor: '#B3261E',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 500,
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '100px',
                    },
                  }}
                />
              )}
            </Box>
          );

          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={<IconComponent />}
              aria-label={`Navegar a ${item.label}`}
              title={`Ir a ${item.label}`}
              className={`bottom-nav-action contextual-control nav-item-interactive nav-active-indicator ${
                isSelected ? 'active' : ''
              }`}
              data-contextual="navigation-action"
              data-context-type="nav-tab"
              data-nav-target={item.value}
            />
          );
        })}
      </MuiBottomNavigation>
    </Paper>
  );
};
