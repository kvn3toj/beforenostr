import React, { useState, useEffect } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  ClickAwayListener,
  Breadcrumbs,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Collapse,
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as ProfileIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Store as MarketplaceIcon,
  PlayCircle as UPlayIcon,
  Group as SocialIcon,
  Assessment as StatsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Psychology as AIIcon,
  MeetingRoom as StudyRoomIcon,
  Campaign as ChallengeIcon,
  AccountBalance as WalletIcon,
  NavigateNext as NavigateNextIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  QuestionAnswer as QuestionIcon,
  VideoLibrary as VideoIcon,
  People as PeopleIcon,
  MonitorHeart as MonitorIcon,
  Storefront as StoreIcon,
  Sell as SellIcon,
  List as ListIcon,
  PlaylistPlay as PlaylistIcon,
  EmojiEvents as TrophyIcon,
  Analytics as AnalyticsIcon,
  SelfImprovement as SelfImprovementIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { triggerHapticFeedback, addHoverEffect } from '../../lib/gameFeelSystem'

// Types
interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
  submenu?: NavigationItem[]
  adminOnly?: boolean
  gamifierOnly?: boolean
}

interface SearchResult {
  id: string
  title: string
  description: string
  category: 'users' | 'content' | 'marketplace' | 'challenges' | 'groups'
  path: string
  icon: React.ReactNode
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
  action?: string
}

const UnifiedNavigation: React.FC = () => {
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null)
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation structure
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <HomeIcon />,
      path: '/'
    },
    {
      id: 'marketplace',
      label: 'Marketplace GMP',
      icon: <MarketplaceIcon />,
      path: '/marketplace',
      badge: 3,
      submenu: [
        { id: 'buy', label: 'Comprar', icon: <StoreIcon />, path: '/marketplace/buy' },
        { id: 'sell', label: 'Vender', icon: <SellIcon />, path: '/marketplace/sell' },
        { id: 'my-listings', label: 'Mis Publicaciones', icon: <ListIcon />, path: '/marketplace/my-listings' }
      ]
    },
    {
      id: 'uplay',
      label: 'ÜPlay GPL',
      icon: <UPlayIcon />,
      path: '/uplay',
      badge: 2,
      submenu: [
        { id: 'watch', label: 'Ver Videos', icon: <VideoIcon />, path: '/uplay/watch' },
        { id: 'questions', label: 'Preguntas', icon: <QuestionIcon />, path: '/uplay/questions' },
        { id: 'playlists', label: 'Playlists', icon: <PlaylistIcon />, path: '/uplay/playlists' }
      ]
    },
    {
      id: 'social',
      label: 'Social',
      icon: <SocialIcon />,
      path: '/social',
      badge: 5,
      submenu: [
        { id: 'groups', label: 'Grupos', icon: <PeopleIcon />, path: '/social/groups' },
        { id: 'study-rooms', label: 'Salas de Estudio', icon: <StudyRoomIcon />, path: '/study-rooms' },
        { id: 'friends', label: 'Amigos', icon: <PeopleIcon />, path: '/social/friends' }
      ]
    },
    {
      id: 'challenges',
      label: 'Desafíos',
      icon: <ChallengeIcon />,
      path: '/challenges',
      badge: 1
    },
    {
      id: 'ustats',
      label: 'UStats',
      icon: <StatsIcon />,
      path: '/ustats',
      submenu: [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/ustats/dashboard' },
        { id: 'meritos', label: 'Méritos', icon: <TrophyIcon />, path: '/ustats/meritos' },
        { id: 'analytics', label: 'Analíticas', icon: <AnalyticsIcon />, path: '/ustats/analytics' }
      ]
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: <WalletIcon />,
      path: '/wallet'
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/admin',
      adminOnly: true,
      submenu: [
        { id: 'users', label: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
        { id: 'content', label: 'Contenido', icon: <VideoIcon />, path: '/admin/content' },
        { id: 'monitoring', label: 'Monitoreo', icon: <MonitorIcon />, path: '/admin/monitoring' }
      ]
    }
  ]

  // Mock data for notifications
  const { data: notifications = [] } = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => [
      {
        id: '1',
        title: 'Nuevo Desafío Disponible',
        message: 'Participa en el Desafío de Sostenibilidad y gana 100 Méritos',
        type: 'info',
        timestamp: new Date(),
        read: false,
        action: '/challenges'
      },
      {
        id: '2',
        title: 'Transacción Completada',
        message: 'Has recibido 50 Lükas por tu intercambio',
        type: 'success',
        timestamp: new Date(),
        read: false,
        action: '/wallet'
      },
      {
        id: '3',
        title: 'Invitación a Grupo',
        message: 'Te han invitado al grupo "Emprendedores Verdes"',
        type: 'info',
        timestamp: new Date(),
        read: true,
        action: '/social/groups'
      }
    ]
  })

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Inicio', path: '/' }]
    
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const item = findNavigationItem(currentPath)
      if (item) {
        breadcrumbs.push({
          label: item.label,
          path: currentPath
        })
      }
    })
    
    return breadcrumbs
  }

  const findNavigationItem = (path: string): NavigationItem | undefined => {
    for (const item of navigationItems) {
      if (item.path === path) return item
      if (item.submenu) {
        const subItem = item.submenu.find(sub => sub.path === path)
        if (subItem) return subItem
      }
    }
    return undefined
  }

  // Universal search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Mock search results - in real app, this would be an API call
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Taller de Meditación',
        description: 'Clase de meditación consciente para principiantes',
        category: 'content' as const,
        path: '/uplay/content/1',
        icon: <SelfImprovementIcon />
      },
      {
        id: '2',
        title: 'Verduras Orgánicas',
        description: 'Productos frescos del huerto comunitario',
        category: 'marketplace' as const,
        path: '/marketplace/item/2',
        icon: <StoreIcon />
      },
      {
        id: '3',
        title: 'Grupo Sostenibilidad',
        description: 'Comunidad enfocada en prácticas sustentables',
        category: 'groups' as const,
        path: '/social/groups/3',
        icon: <PeopleIcon />
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults(mockResults)
  }

  const handleNavigationClick = (path: string) => {
    triggerHapticFeedback('light')
    navigate(path)
    setMobileMenuOpen(false)
  }

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const unreadNotifications = notifications.filter(n => !n.read).length
  const breadcrumbs = generateBreadcrumbs()

  return (
    <>
      {/* Main App Bar */}
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            
            <Box 
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleNavigationClick('/')}
            >
              <Avatar sx={{ bgcolor: '#CDAB5A', mr: 1, width: 40, height: 40 }}>
                C
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#CDAB5A' }}>
                CoomÜnity
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flex: 1, maxWidth: 600, mx: 3, position: 'relative' }}>
            <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar en toda la plataforma..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                    setShowSearchResults(true)
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      backgroundColor: 'grey.50'
                    }
                  }}
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1,
                      maxHeight: 400,
                      overflow: 'auto',
                      zIndex: 1300,
                      boxShadow: 3
                    }}
                  >
                    {searchResults.map((result) => (
                      <MenuItem
                        key={result.id}
                        onClick={() => {
                          handleNavigationClick(result.path)
                          setSearchQuery('')
                          setShowSearchResults(false)
                        }}
                        sx={{ px: 2, py: 1.5 }}
                      >
                        <ListItemIcon>
                          {result.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={result.title}
                          secondary={result.description}
                        />
                        <Chip 
                          size="small" 
                          label={result.category}
                          color="primary"
                          variant="outlined"
                        />
                      </MenuItem>
                    ))}
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton
              onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
              color="inherit"
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#CDAB5A' }}>
                U
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <Box sx={{ px: 3, py: 1, backgroundColor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              {breadcrumbs.map((crumb, index) => (
                <Link
                  key={crumb.path}
                  color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                  href={crumb.path}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigationClick(crumb.path)
                  }}
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    fontWeight: index === breadcrumbs.length - 1 ? 'bold' : 'normal'
                  }}
                >
                  {crumb.label}
                </Link>
              ))}
            </Breadcrumbs>
          </Box>
        )}
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#CDAB5A' }}>
              CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Navegación Principal
            </Typography>
          </Box>
          
          <List>
            {navigationItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (item.submenu) {
                        toggleSubmenu(item.id)
                      } else {
                        handleNavigationClick(item.path)
                      }
                    }}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon>
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {item.submenu && (
                      expandedMenus.includes(item.id) ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                
                {item.submenu && (
                  <Collapse in={expandedMenus.includes(item.id)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.submenu.map((subItem) => (
                        <ListItemButton
                          key={subItem.id}
                          sx={{ pl: 4 }}
                          onClick={() => handleNavigationClick(subItem.path)}
                          selected={location.pathname === subItem.path}
                        >
                          <ListItemIcon>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={() => setNotificationMenuAnchor(null)}
        PaperProps={{
          sx: { width: 360, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notificaciones
          </Typography>
          {unreadNotifications > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadNotifications} nuevas
            </Typography>
          )}
        </Box>
        
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => {
              if (notification.action) {
                handleNavigationClick(notification.action)
              }
              setNotificationMenuAnchor(null)
            }}
            sx={{
              py: 1.5,
              px: 2,
              borderLeft: notification.read ? 'none' : `4px solid ${getNotificationColor(notification.type)}`,
              backgroundColor: notification.read ? 'transparent' : 'action.hover'
            }}
          >
            <ListItemText
              primary={notification.title}
              secondary={notification.message}
              secondaryTypographyProps={{
                sx: { fontSize: '0.875rem' }
              }}
            />
          </MenuItem>
        ))}
        
        <Divider />
        <MenuItem onClick={() => handleNavigationClick('/notifications')}>
          <Typography variant="body2" color="primary" textAlign="center" width="100%">
            Ver todas las notificaciones
          </Typography>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        PaperProps={{
          sx: { width: 250 }
        }}
      >
        <MenuItem onClick={() => handleNavigationClick('/profile')}>
          <ListItemIcon>
            <ProfileIcon />
          </ListItemIcon>
          <ListItemText primary="Mi Perfil" />
        </MenuItem>
        
        <MenuItem onClick={() => handleNavigationClick('/settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleNavigationClick('/logout')}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>
    </>
  )
}

// Helper function for notification colors
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success': return '#10B981'
    case 'warning': return '#F59E0B'
    case 'error': return '#EF4444'
    default: return '#3B82F6'
  }
}

export default UnifiedNavigation