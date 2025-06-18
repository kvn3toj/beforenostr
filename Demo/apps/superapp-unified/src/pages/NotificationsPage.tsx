import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Divider,
  Badge,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationImportant as ImportantIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Campaign as ChallengeIcon,
  Store as MarketplaceIcon,
  Group as GroupIcon,
  EmojiEvents as MeritIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface UserNotification {
  id: string
  title: string
  message: string
  type: 'CHALLENGE_ALERT' | 'MERIT_AWARDED' | 'MARKETPLACE_UPDATE' | 'GROUP_INVITATION' | 'SYSTEM_ANNOUNCEMENT'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  isRead: boolean
  isStarred: boolean
  createdAt: string
  actionUrl?: string
  metadata?: {
    imageUrl?: string
    actionText?: string
    relatedEntityId?: string
  }
}

// Mock API functions
const fetchUserNotifications = async (): Promise<UserNotification[]> => {
  return [
    {
      id: '1',
      title: '¡Nuevo Desafío Ayni Explorer!',
      message: 'Un nuevo desafío semanal te invita a explorar el principio de reciprocidad. Participa y gana Méritos por contribuir al Bien Común.',
      type: 'CHALLENGE_ALERT',
      priority: 'HIGH',
      isRead: false,
      isStarred: true,
      createdAt: '2024-01-15T10:00:00Z',
      actionUrl: '/challenges/ayni-explorer',
      metadata: {
        actionText: 'Participar Ahora',
        relatedEntityId: 'challenge_ayni_1'
      }
    },
    {
      id: '2',
      title: 'Méritos Recibidos - Huerto Comunitario',
      message: 'Has recibido 100 Méritos por tu valiosa contribución al proyecto del Huerto Comunitario. ¡Gracias por hacer crecer el Bien Común!',
      type: 'MERIT_AWARDED',
      priority: 'MEDIUM',
      isRead: false,
      isStarred: false,
      createdAt: '2024-01-14T16:45:00Z',
      actionUrl: '/wallet',
      metadata: {
        actionText: 'Ver Méritos',
        relatedEntityId: 'merit_huerto_100'
      }
    },
    {
      id: '3',
      title: 'Nuevo Item: Verduras Orgánicas',
      message: 'El Huerto Comunitario ha agregado verduras frescas cultivadas con principios de permacultura. ¡Intercambio disponible con Lükas!',
      type: 'MARKETPLACE_UPDATE',
      priority: 'MEDIUM',
      isRead: true,
      isStarred: false,
      createdAt: '2024-01-13T12:20:00Z',
      actionUrl: '/marketplace',
      metadata: {
        actionText: 'Ver en Marketplace',
        imageUrl: '/images/verduras-organicas.jpg'
      }
    },
    {
      id: '4',
      title: 'Invitación: Círculo de Meditación',
      message: 'Te han invitado al Círculo de Meditación Matutina. Reconéctate con la naturaleza y la comunidad cada amanecer.',
      type: 'GROUP_INVITATION',
      priority: 'MEDIUM',
      isRead: true,
      isStarred: false,
      createdAt: '2024-01-12T08:30:00Z',
      actionUrl: '/groups/meditacion-matutina',
      metadata: {
        actionText: 'Unirse al Círculo'
      }
    },
    {
      id: '5',
      title: 'Mantenimiento Programado',
      message: 'Realizaremos mantenimiento en la plataforma el domingo de 2:00 AM a 4:00 AM. Algunas funciones podrían no estar disponibles.',
      type: 'SYSTEM_ANNOUNCEMENT',
      priority: 'HIGH',
      isRead: true,
      isStarred: false,
      createdAt: '2024-01-10T14:30:00Z'
    }
  ]
}

const markAsRead = async (notificationId: string): Promise<void> => {
  console.log('Marking as read:', notificationId)
}

const toggleStar = async (notificationId: string): Promise<void> => {
  console.log('Toggling star:', notificationId)
}

const deleteNotification = async (notificationId: string): Promise<void> => {
  console.log('Deleting notification:', notificationId)
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
  </div>
)

const NotificationsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['user-notifications'],
    queryFn: fetchUserNotifications,
  })

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] })
      toast.success('Marcada como leída')
    },
  })

  const toggleStarMutation = useMutation({
    mutationFn: toggleStar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] })
      toast.success('Notificación eliminada')
    },
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CHALLENGE_ALERT': return <ChallengeIcon sx={{ color: '#CDAB5A' }} />
      case 'MERIT_AWARDED': return <MeritIcon sx={{ color: '#10B981' }} />
      case 'MARKETPLACE_UPDATE': return <MarketplaceIcon sx={{ color: '#3B82F6' }} />
      case 'GROUP_INVITATION': return <GroupIcon sx={{ color: '#8B5CF6' }} />
      case 'SYSTEM_ANNOUNCEMENT': return <ImportantIcon sx={{ color: '#EF4444' }} />
      default: return <NotificationsIcon sx={{ color: '#6B7280' }} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '#EF4444'
      case 'URGENT': return '#DC2626'
      case 'MEDIUM': return '#F59E0B'
      case 'LOW': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CHALLENGE_ALERT': return 'Desafío'
      case 'MERIT_AWARDED': return 'Méritos'
      case 'MARKETPLACE_UPDATE': return 'Marketplace'
      case 'GROUP_INVITATION': return 'Invitación'
      case 'SYSTEM_ANNOUNCEMENT': return 'Sistema'
      default: return type
    }
  }

  const unreadNotifications = notifications.filter(n => !n.isRead)
  const starredNotifications = notifications.filter(n => n.isStarred)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#CDAB5A' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al cargar las notificaciones. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Badge badgeContent={unreadNotifications.length} color="error">
            <NotificationsIcon sx={{ fontSize: 32, color: '#CDAB5A', mr: 2 }} />
          </Badge>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Notificaciones CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {unreadNotifications.length} sin leer • {starredNotifications.length} destacadas
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#CDAB5A',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#CDAB5A',
            },
          }}
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <NotificationsIcon sx={{ mr: 1, fontSize: 20 }} />
                Todas ({notifications.length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <UnreadIcon sx={{ mr: 1, fontSize: 20 }} />
                Sin Leer ({unreadNotifications.length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <StarIcon sx={{ mr: 1, fontSize: 20 }} />
                Destacadas ({starredNotifications.length})
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* All Notifications */}
      <TabPanel value={currentTab} index={0}>
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              sx={{ 
                borderRadius: 3,
                border: notification.isRead ? '1px solid rgba(0,0,0,0.1)' : '2px solid #CDAB5A',
                backgroundColor: notification.isRead ? 'background.paper' : 'rgba(205, 171, 90, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(205, 171, 90, 0.2)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center" flex={1}>
                    {getTypeIcon(notification.type)}
                    <Box ml={2} flex={1}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#CDAB5A',
                              ml: 1 
                            }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {notification.message}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" ml={2}>
                    <IconButton
                      size="small"
                      onClick={() => toggleStarMutation.mutate(notification.id)}
                      sx={{ color: notification.isStarred ? '#CDAB5A' : 'text.secondary' }}
                    >
                      <StarIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteMutation.mutate(notification.id)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box display="flex" justify-content="space-between" alignItems="center">
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={getTypeLabel(notification.type)}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: '#CDAB5A', color: '#CDAB5A' }}
                    />
                    <Chip
                      label={notification.priority}
                      size="small"
                      sx={{ 
                        backgroundColor: getPriorityColor(notification.priority),
                        color: 'white'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {(notification.actionUrl || !notification.isRead) && (
                <CardActions sx={{ px: 2, pb: 2 }}>
                  {!notification.isRead && (
                    <Button
                      size="small"
                      startIcon={<ReadIcon />}
                      onClick={() => markReadMutation.mutate(notification.id)}
                      sx={{ color: '#10B981' }}
                    >
                      Marcar como leída
                    </Button>
                  )}
                  {notification.actionUrl && notification.metadata?.actionText && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        // Navigate to action URL
                        window.location.href = notification.actionUrl!
                      }}
                      sx={{ 
                        backgroundColor: '#CDAB5A',
                        '&:hover': { backgroundColor: '#B8954A' }
                      }}
                    >
                      {notification.metadata.actionText}
                    </Button>
                  )}
                </CardActions>
              )}
            </Card>
          ))}
        </Stack>
      </TabPanel>

      {/* Unread Notifications */}
      <TabPanel value={currentTab} index={1}>
        <Stack spacing={2}>
          {unreadNotifications.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ReadIcon sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                ¡Excelente! No tienes notificaciones sin leer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estás al día con todas las novedades de CoomÜnity
              </Typography>
            </Box>
          ) : (
            unreadNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                sx={{ 
                  borderRadius: 3,
                  border: '2px solid #CDAB5A',
                  backgroundColor: 'rgba(205, 171, 90, 0.05)',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getTypeIcon(notification.type)}
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 2, color: 'text.primary' }}>
                      {notification.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: '#CDAB5A',
                        ml: 1 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 2 }}>
                    {notification.message}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={getTypeLabel(notification.type)}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: '#CDAB5A', color: '#CDAB5A' }}
                    />
                    <Chip
                      label={notification.priority}
                      size="small"
                      sx={{ 
                        backgroundColor: getPriorityColor(notification.priority),
                        color: 'white'
                      }}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<ReadIcon />}
                    onClick={() => markReadMutation.mutate(notification.id)}
                    sx={{ color: '#10B981' }}
                  >
                    Marcar como leída
                  </Button>
                  {notification.actionUrl && notification.metadata?.actionText && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ 
                        backgroundColor: '#CDAB5A',
                        '&:hover': { backgroundColor: '#B8954A' }
                      }}
                    >
                      {notification.metadata.actionText}
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))
          )}
        </Stack>
      </TabPanel>

      {/* Starred Notifications */}
      <TabPanel value={currentTab} index={2}>
        <Stack spacing={2}>
          {starredNotifications.length === 0 ? (
            <Box textAlign="center" py={4}>
              <StarIcon sx={{ fontSize: 64, color: '#F59E0B', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No tienes notificaciones destacadas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usa la estrella para marcar notificaciones importantes
              </Typography>
            </Box>
          ) : (
            starredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid #F59E0B',
                  backgroundColor: 'rgba(245, 158, 11, 0.05)',
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center">
                      {getTypeIcon(notification.type)}
                      <Typography variant="h6" fontWeight="bold" sx={{ ml: 2, color: 'text.primary' }}>
                        {notification.title}
                      </Typography>
                    </Box>
                    <StarIcon sx={{ color: '#F59E0B' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 2 }}>
                    {notification.message}
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={getTypeLabel(notification.type)}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: '#CDAB5A', color: '#CDAB5A' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </TabPanel>
    </Box>
  )
}

export default NotificationsPage