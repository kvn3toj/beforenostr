import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Chip,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  VideoLibrary as VideoIcon,
  Quiz as ChallengesIcon,
  Storefront as MarketplaceIcon,
  AccountBalance as TransactionsIcon,
  Notifications as NotificationsIcon,
  MonitorHeart as MonitoringIcon,
  Group as RolesIcon,
  Security as PermissionsIcon,
  Analytics as AnalyticsIcon,
  SmartToy as AIIcon,
  Public as NostrIcon,
  Settings as SettingsIcon,
  Gamepad as ConsoleIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavigationItem {
  path: string
  label: string
  icon: React.ReactElement
  description?: string
  badge?: string
  isNew?: boolean
}

const navigationSections = [
  {
    title: 'Principal',
    items: [
      {
        path: '/',
        label: 'Dashboard',
        icon: <DashboardIcon />,
        description: 'Vista general del sistema'
      }
    ]
  },
  {
    title: 'Gestión CoomÜnity',
    items: [
      {
        path: '/console',
        label: 'Consola de Experiencias',
        icon: <ConsoleIcon />,
        description: 'Centro de control para diseñar experiencias gamificadas',
        isNew: true
      },
      {
        path: '/challenges',
        label: 'Desafíos',
        icon: <ChallengesIcon />,
        description: 'Gestión de challenges y user challenges',
        isNew: true
      },
      {
        path: '/marketplace',
        label: 'Marketplace (GMP)',
        icon: <MarketplaceIcon />,
        description: 'Gamified Match Place - Intercambio de valor',
        isNew: true
      },
      {
        path: '/transactions',
        label: 'Transacciones',
        icon: <TransactionsIcon />,
        description: 'Méritos, Wallets y sistema económico',
        isNew: true
      },
      {
        path: '/notifications',
        label: 'Notificaciones',
        icon: <NotificationsIcon />,
        description: 'Sistema de notificaciones CoomÜnity',
        isNew: true
      }
    ]
  },
  {
    title: 'Gestión de Usuarios',
    items: [
      {
        path: '/users',
        label: 'Usuarios',
        icon: <UsersIcon />,
        description: 'Gestión de usuarios del sistema'
      },
      {
        path: '/roles',
        label: 'Roles',
        icon: <RolesIcon />,
        description: 'Configuración de roles RBAC'
      },
      {
        path: '/permissions',
        label: 'Permisos',
        icon: <PermissionsIcon />,
        description: 'Gestión de permisos del sistema'
      }
    ]
  },
  {
    title: 'Contenido y ÜPlay',
    items: [
      {
        path: '/videos',
        label: 'Videos',
        icon: <VideoIcon />,
        description: 'Gestión de contenido ÜPlay'
      },
      {
        path: '/analytics',
        label: 'Analytics',
        icon: <AnalyticsIcon />,
        description: 'Métricas y análisis de uso'
      }
    ]
  },
  {
    title: 'Sistema y Monitoreo',
    items: [
      {
        path: '/monitoring',
        label: 'Monitoreo',
        icon: <MonitoringIcon />,
        description: 'Estado del sistema y métricas',
        isNew: true
      },
      {
        path: '/ai-test',
        label: 'AI Generator',
        icon: <AIIcon />,
        description: 'Generador de preguntas IA'
      },
      {
        path: '/nostr-demo',
        label: 'Nostr Demo',
        icon: <NostrIcon />,
        description: 'Demostración protocolo Nostr'
      }
    ]
  },
  {
    title: 'Configuración',
    items: [
      {
        path: '/settings',
        label: 'Configuración',
        icon: <SettingsIcon />,
        description: 'Configuración del sistema'
      }
    ]
  }
]

interface AdminNavigationProps {
  open: boolean
  onClose: () => void
  drawerWidth?: number
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  open,
  onClose,
  drawerWidth = 280,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          CoomÜnity Gamifier Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Panel de Administración
        </Typography>
      </Box>
      
      <Divider />

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {navigationSections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="overline" color="text.secondary" fontWeight="bold">
                {section.title}
              </Typography>
            </Box>
            
            <List dense>
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      mx: 1,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
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
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {item.label}
                          </Typography>
                          {item.isNew && (
                            <Chip
                              label="NUEVO"
                              size="small"
                              color="success"
                              sx={{ height: 16, fontSize: '0.6rem' }}
                            />
                          )}
                          {item.badge && (
                            <Chip
                              label={item.badge}
                              size="small"
                              color="primary"
                              sx={{ height: 16, fontSize: '0.6rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        item.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.description}
                          </Typography>
                        )
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            
            {sectionIndex < navigationSections.length - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </Box>
        ))}
      </Box>

      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Backend: NestJS (Puerto 3002)
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Admin Frontend: Puerto 3000
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          SuperApp: Puerto 3001
        </Typography>
      </Box>
    </Drawer>
  )
}

export default AdminNavigation 