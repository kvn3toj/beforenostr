import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendsIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  SportsEsports as UPlayIcon,
  AccountBalanceWallet as WalletIcon,
  Security as AuthIcon,
  Share as SharedIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  type?: 'page' | 'module';
  priority?: 'high' | 'medium' | 'low';
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Principal',
    icon: <DashboardIcon />,
    path: '/dashboard',
    type: 'page',
  },
  {
    id: 'trends',
    label: 'Tendencias',
    icon: <TrendsIcon />,
    path: '/trends',
    type: 'page',
  },
];

const moduleItems: NavigationItem[] = [
  {
    id: 'HOME',
    label: 'Home Dashboard',
    icon: <HomeIcon />,
    path: '/module/HOME',
    type: 'module',
    priority: 'high',
  },
  {
    id: 'UPLAY',
    label: 'UPlay Gaming',
    icon: <UPlayIcon />,
    path: '/module/UPLAY',
    type: 'module',
    priority: 'high',
  },
  {
    id: 'WALLET',
    label: 'Wallet & Ünits',
    icon: <WalletIcon />,
    path: '/module/WALLET',
    type: 'module',
    priority: 'high',
  },
  {
    id: 'AUTH',
    label: 'Authentication',
    icon: <AuthIcon />,
    path: '/module/AUTH',
    type: 'module',
    priority: 'high',
  },
  {
    id: 'SHARED',
    label: 'Shared Components',
    icon: <SharedIcon />,
    path: '/module/SHARED',
    type: 'module',
    priority: 'medium',
  },
];

const settingsItems: NavigationItem[] = [
  {
    id: 'settings',
    label: 'Configuración',
    icon: <SettingsIcon />,
    path: '/settings',
    type: 'page',
  },
];

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveItem = (path: string) => {
    return location.pathname === path;
  };

  const renderNavItems = (items: NavigationItem[], showPriority = false) => {
    return items.map((item) => (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          onClick={() => navigate(item.path)}
          selected={isActiveItem(item.path)}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 0.5,
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
          <ListItemIcon
            sx={{
              color: isActiveItem(item.path) ? 'white' : 'text.secondary',
              minWidth: 40,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActiveItem(item.path) ? 600 : 400,
            }}
          />
          {showPriority && item.priority && (
            <Chip
              label={item.priority}
              size="small"
              color={getPriorityColor(item.priority) as any}
              sx={{
                fontSize: '0.7rem',
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <CodeIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="div" fontWeight={600}>
            Code Review
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Gemini Modular Dashboard
        </Typography>
        <Typography variant="caption" color="primary.main" fontWeight={500}>
          CoomÜnity Project
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 2 }}>
        {/* Main Pages */}
        <List>{renderNavItems(navigationItems)}</List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Modules Section */}
        <Box sx={{ px: 2, mb: 1 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={600}
          >
            Módulos
          </Typography>
        </Box>
        <List>{renderNavItems(moduleItems, true)}</List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Settings */}
        <List>{renderNavItems(settingsItems)}</List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          v1.0.0 • CoomÜnity
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Powered by Gemini AI
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
