import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Grid,
  Stack,
  Badge,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Notifications as NotificationsIcon,
  NotificationImportant as ImportantIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface Notification {
  id: string
  title: string
  message: string
  type: 'NEW_PUBLICATION' | 'MERIT_AWARDED' | 'CHALLENGE_ALERT' | 'TRANSACTION_COMPLETED' | 'GROUP_INVITATION' | 'SYSTEM_ANNOUNCEMENT' | 'CHAT_MESSAGE' | 'EXPERIENCE_COMPLETED' | 'TOKEN_EXPIRY_WARNING' | 'MARKETPLACE_UPDATE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'DRAFT' | 'SENT' | 'SCHEDULED' | 'DELIVERED' | 'FAILED'
  targetType: 'ALL_USERS' | 'SPECIFIC_USERS' | 'ROLE_BASED' | 'GROUP_BASED'
  targetUsers?: string[]
  targetRoles?: string[]
  targetGroups?: string[]
  scheduledAt?: string
  sentAt?: string
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    username: string
    email: string
  }
  recipients: number
  readCount: number
  clickCount: number
  metadata?: {
    actionUrl?: string
    imageUrl?: string
    relatedEntityId?: string
    relatedEntityType?: string
  }
}

interface NotificationStats {
  totalNotifications: number
  sentNotifications: number
  deliveredNotifications: number
  failedNotifications: number
  averageReadRate: number
  averageClickRate: number
  notificationsByType: Record<string, number>
  notificationsByPriority: Record<string, number>
  recentActivity: {
    date: string
    sent: number
    delivered: number
    read: number
  }[]
}

// Mock API functions
const fetchNotifications = async (): Promise<Notification[]> => {
  return [
    {
      id: '1',
      title: 'Nuevo Desafío: Ayni Explorer Disponible',
      message: 'Se ha lanzado un nuevo desafío semanal que te invita a explorar el principio de reciprocidad en nuestra comunidad. ¡Participa y gana Méritos!',
      type: 'CHALLENGE_ALERT',
      priority: 'HIGH',
      status: 'DELIVERED',
      targetType: 'ALL_USERS',
      sentAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      sender: {
        id: 'admin',
        username: 'Sistema CoomÜnity',
        email: 'sistema@coomunity.com'
      },
      recipients: 245,
      readCount: 198,
      clickCount: 156,
      metadata: {
        actionUrl: '/challenges/ayni-explorer',
        relatedEntityId: 'challenge_1',
        relatedEntityType: 'Challenge'
      }
    },
    {
      id: '2',
      title: 'Méritos Otorgados por Contribución al Bien Común',
      message: 'Felicidades por tu participación en el proyecto del Huerto Comunitario. Has recibido 100 Méritos por tu valiosa contribución.',
      type: 'MERIT_AWARDED',
      priority: 'MEDIUM',
      status: 'DELIVERED',
      targetType: 'SPECIFIC_USERS',
      targetUsers: ['user_123', 'user_456'],
      sentAt: '2024-01-14T16:45:00Z',
      createdAt: '2024-01-14T16:30:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      sender: {
        id: 'admin',
        username: 'Coordinador Méritos',
        email: 'meritos@coomunity.com'
      },
      recipients: 2,
      readCount: 2,
      clickCount: 1,
      metadata: {
        actionUrl: '/merits/view',
        relatedEntityId: 'merit_transaction_789',
        relatedEntityType: 'Transaction'
      }
    },
    {
      id: '3',
      title: 'Nuevo Item en el Marketplace: Verduras Orgánicas',
      message: 'El Huerto Comunitario ha agregado verduras frescas cultivadas con principios de permacultura. ¡Intercambio disponible con Lükas!',
      type: 'MARKETPLACE_UPDATE',
      priority: 'MEDIUM',
      status: 'SENT',
      targetType: 'ROLE_BASED',
      targetRoles: ['verified_user', 'premium'],
      sentAt: '2024-01-13T12:20:00Z',
      createdAt: '2024-01-13T12:00:00Z',
      updatedAt: '2024-01-13T12:20:00Z',
      sender: {
        id: 'marketplace_bot',
        username: 'Marketplace Bot',
        email: 'marketplace@coomunity.com'
      },
      recipients: 89,
      readCount: 67,
      clickCount: 34,
      metadata: {
        actionUrl: '/marketplace/item/organic-vegetables',
        imageUrl: '/images/organic-vegetables.jpg',
        relatedEntityId: 'item_2',
        relatedEntityType: 'MarketplaceItem'
      }
    },
    {
      id: '4',
      title: 'Mantenimiento Programado del Sistema',
      message: 'Se realizará mantenimiento en la plataforma el domingo de 2:00 AM a 4:00 AM. Durante este tiempo, algunas funciones podrían no estar disponibles.',
      type: 'SYSTEM_ANNOUNCEMENT',
      priority: 'URGENT',
      status: 'SCHEDULED',
      targetType: 'ALL_USERS',
      scheduledAt: '2024-01-20T08:00:00Z',
      createdAt: '2024-01-12T14:30:00Z',
      updatedAt: '2024-01-12T14:30:00Z',
      sender: {
        id: 'admin',
        username: 'Administrador Sistema',
        email: 'admin@coomunity.com'
      },
      recipients: 0,
      readCount: 0,
      clickCount: 0,
      metadata: {
        actionUrl: '/system/maintenance-info'
      }
    }
  ]
}

const fetchNotificationStats = async (): Promise<NotificationStats> => {
  return {
    totalNotifications: 47,
    sentNotifications: 42,
    deliveredNotifications: 39,
    failedNotifications: 3,
    averageReadRate: 78.5,
    averageClickRate: 42.3,
    notificationsByType: {
      CHALLENGE_ALERT: 12,
      MERIT_AWARDED: 8,
      MARKETPLACE_UPDATE: 9,
      SYSTEM_ANNOUNCEMENT: 6,
      GROUP_INVITATION: 5,
      TRANSACTION_COMPLETED: 4,
      EXPERIENCE_COMPLETED: 3
    },
    notificationsByPriority: {
      LOW: 8,
      MEDIUM: 24,
      HIGH: 12,
      URGENT: 3
    },
    recentActivity: [
      { date: '2024-01-15', sent: 8, delivered: 7, read: 5 },
      { date: '2024-01-14', sent: 6, delivered: 6, read: 4 },
      { date: '2024-01-13', sent: 12, delivered: 11, read: 9 },
      { date: '2024-01-12', sent: 4, delivered: 4, read: 3 },
      { date: '2024-01-11', sent: 9, delivered: 8, read: 6 }
    ]
  }
}

const createNotification = async (notificationData: Partial<Notification>): Promise<Notification> => {
  console.log('Creating notification:', notificationData)
  return { ...notificationData, id: Date.now().toString() } as Notification
}

const updateNotification = async (id: string, notificationData: Partial<Notification>): Promise<Notification> => {
  console.log('Updating notification:', id, notificationData)
  return { ...notificationData, id } as Notification
}

const deleteNotification = async (id: string): Promise<void> => {
  console.log('Deleting notification:', id)
}

const sendNotification = async (id: string): Promise<void> => {
  console.log('Sending notification:', id)
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

export const NotificationsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterPriority, setFilterPriority] = useState<string>('ALL')

  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading: loadingNotifications, error: notificationsError } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: fetchNotificationStats,
  })

  const createMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] })
      setIsDialogOpen(false)
      toast.success('Notificación creada exitosamente')
    },
    onError: () => {
      toast.error('Error al crear la notificación')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notification> }) =>
      updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setIsDialogOpen(false)
      toast.success('Notificación actualizada exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar la notificación')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setIsDeleteDialogOpen(false)
      toast.success('Notificación eliminada exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar la notificación')
    },
  })

  const sendMutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notificación enviada exitosamente')
    },
    onError: () => {
      toast.error('Error al enviar la notificación')
    },
  })

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'ALL' || notification.type === filterType
    const statusMatch = filterStatus === 'ALL' || notification.status === filterStatus
    const priorityMatch = filterPriority === 'ALL' || notification.priority === filterPriority
    
    return typeMatch && statusMatch && priorityMatch
  })

  const handleCreateNotification = () => {
    setSelectedNotification(null)
    setIsDialogOpen(true)
  }

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDialogOpen(true)
  }

  const handleDeleteNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDeleteDialogOpen(true)
  }

  const handleSendNotification = (notification: Notification) => {
    sendMutation.mutate(notification.id)
  }

  const handleSubmit = (formData: Partial<Notification>) => {
    if (selectedNotification) {
      updateMutation.mutate({ id: selectedNotification.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CHALLENGE_ALERT': return <CampaignIcon sx={{ color: '#CDAB5A' }} />
      case 'MERIT_AWARDED': return <SuccessIcon sx={{ color: '#10B981' }} />
      case 'MARKETPLACE_UPDATE': return <InfoIcon sx={{ color: '#3B82F6' }} />
      case 'SYSTEM_ANNOUNCEMENT': return <ImportantIcon sx={{ color: '#EF4444' }} />
      case 'GROUP_INVITATION': return <GroupIcon sx={{ color: '#8B5CF6' }} />
      case 'TRANSACTION_COMPLETED': return <CheckCircle sx={{ color: '#10B981' }} />
      default: return <NotificationsIcon sx={{ color: '#6B7280' }} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#6B7280'
      case 'MEDIUM': return '#F59E0B'
      case 'HIGH': return '#EF4444'
      case 'URGENT': return '#DC2626'
      default: return '#6B7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'default'
      case 'SENT': return 'primary'
      case 'SCHEDULED': return 'warning'
      case 'DELIVERED': return 'success'
      case 'FAILED': return 'error'
      default: return 'default'
    }
  }

  const getReadRate = (notification: Notification) => {
    if (notification.recipients === 0) return 0
    return Math.round((notification.readCount / notification.recipients) * 100)
  }

  const getClickRate = (notification: Notification) => {
    if (notification.readCount === 0) return 0
    return Math.round((notification.clickCount / notification.readCount) * 100)
  }

  if (loadingNotifications || loadingStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#CDAB5A' }} />
      </Box>
    )
  }

  if (notificationsError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Error al cargar las notificaciones. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
          <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#CDAB5A' }} />
          Sistema de Notificaciones CoomÜnity
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNotification}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#CDAB5A',
            '&:hover': {
              backgroundColor: '#B8954A',
            }
          }}
        >
          Crear Notificación
        </Button>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(205, 171, 90, 0.15)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Badge badgeContent={stats.totalNotifications} color="primary">
                    <NotificationsIcon sx={{ color: '#CDAB5A', fontSize: 32 }} />
                  </Badge>
                  <Box ml={2}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.totalNotifications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Notificaciones
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SendIcon sx={{ color: '#10B981', fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.deliveredNotifications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entregadas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <InfoIcon sx={{ color: '#3B82F6', fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.averageReadRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Lectura
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CampaignIcon sx={{ color: '#F59E0B', fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.averageClickRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Clics
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Tipo"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="CHALLENGE_ALERT">Alerta de Desafío</MenuItem>
                <MenuItem value="MERIT_AWARDED">Mérito Otorgado</MenuItem>
                <MenuItem value="MARKETPLACE_UPDATE">Actualización Marketplace</MenuItem>
                <MenuItem value="SYSTEM_ANNOUNCEMENT">Anuncio del Sistema</MenuItem>
                <MenuItem value="GROUP_INVITATION">Invitación a Grupo</MenuItem>
                <MenuItem value="TRANSACTION_COMPLETED">Transacción Completada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Estado"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="DRAFT">Borrador</MenuItem>
                <MenuItem value="SENT">Enviada</MenuItem>
                <MenuItem value="SCHEDULED">Programada</MenuItem>
                <MenuItem value="DELIVERED">Entregada</MenuItem>
                <MenuItem value="FAILED">Fallida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label="Prioridad"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="ALL">Todas</MenuItem>
                <MenuItem value="LOW">Baja</MenuItem>
                <MenuItem value="MEDIUM">Media</MenuItem>
                <MenuItem value="HIGH">Alta</MenuItem>
                <MenuItem value="URGENT">Urgente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: '#6B7280',
              '&.Mui-selected': {
                color: '#CDAB5A',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#CDAB5A',
            },
          }}
        >
          <Tab label="Lista de Notificaciones" />
          <Tab label="Estadísticas Detalladas" />
          <Tab label="Análisis de Rendimiento" />
        </Tabs>

        {/* Tab 1: Notifications List */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {filteredNotifications.map((notification) => (
              <Grid item xs={12} md={6} lg={4} key={notification.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: `1px solid ${notification.priority === 'URGENT' ? '#EF4444' : '#E5E7EB'}`,
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(205, 171, 90, 0.2)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Box display="flex" alignItems="center">
                        {getTypeIcon(notification.type)}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ ml: 1, color: '#2C2C2C' }}>
                          {notification.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={notification.status}
                        color={getStatusColor(notification.status) as any}
                        size="small"
                        sx={{ borderRadius: 1.5 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.5 }}>
                      {notification.message.length > 120
                        ? `${notification.message.substring(0, 120)}...`
                        : notification.message
                      }
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={notification.type.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1.5, borderColor: '#CDAB5A', color: '#CDAB5A' }}
                      />
                      <Chip
                        label={notification.priority}
                        size="small"
                        sx={{ 
                          borderRadius: 1.5,
                          backgroundColor: getPriorityColor(notification.priority),
                          color: 'white'
                        }}
                      />
                    </Box>

                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Destinatarios:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                          {notification.recipients}
                        </Typography>
                      </Box>
                      
                      {notification.status === 'DELIVERED' && (
                        <>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Tasa de Lectura:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#10B981' }}>
                              {getReadRate(notification)}%
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Tasa de Clics:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#3B82F6' }}>
                              {getClickRate(notification)}%
                            </Typography>
                          </Box>
                        </>
                      )}

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Remitente:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                          {notification.sender.username}
                        </Typography>
                      </Box>

                      {notification.sentAt && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Enviada:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#2C2C2C' }}>
                            {new Date(notification.sentAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditNotification(notification)}
                      sx={{ color: '#CDAB5A' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteNotification(notification)}
                      sx={{ color: '#EF4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {(notification.status === 'DRAFT' || notification.status === 'SCHEDULED') && (
                      <IconButton
                        size="small"
                        onClick={() => handleSendNotification(notification)}
                        sx={{ color: '#10B981' }}
                        disabled={sendMutation.isPending}
                      >
                        <SendIcon />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 2: Detailed Statistics */}
        <TabPanel value={currentTab} index={1}>
          {stats && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#CDAB5A', fontWeight: 'bold' }}>
                      Distribución por Tipo
                    </Typography>
                    {Object.entries(stats.notificationsByType).map(([type, count]) => {
                      const percentage = stats.totalNotifications > 0 ? (count / stats.totalNotifications * 100).toFixed(1) : 0
                      return (
                        <Box key={type} mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Box display="flex" alignItems="center">
                              {getTypeIcon(type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {type.replace('_', ' ')}
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {count} ({percentage}%)
                            </Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#CDAB5A', fontWeight: 'bold' }}>
                      Distribución por Prioridad
                    </Typography>
                    {Object.entries(stats.notificationsByPriority).map(([priority, count]) => {
                      const percentage = stats.totalNotifications > 0 ? (count / stats.totalNotifications * 100).toFixed(1) : 0
                      return (
                        <Box key={priority} mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Box display="flex" alignItems="center">
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%', 
                                  backgroundColor: getPriorityColor(priority),
                                  mr: 1 
                                }} 
                              />
                              <Typography variant="body2">{priority}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {count} ({percentage}%)
                            </Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Tab 3: Performance Analysis */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#CDAB5A', fontWeight: 'bold' }}>
                    Métricas de Rendimiento por Notificación
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Destinatarios</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Leídas</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Clics</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Tasa Lectura</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Tasa Clics</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredNotifications
                          .filter(n => n.status === 'DELIVERED')
                          .map((notification) => (
                            <TableRow key={notification.id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {notification.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  {getTypeIcon(notification.type)}
                                  <Typography variant="body2" sx={{ ml: 1 }}>
                                    {notification.type.replace('_', ' ')}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{notification.recipients}</TableCell>
                              <TableCell>{notification.readCount}</TableCell>
                              <TableCell>{notification.clickCount}</TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  fontWeight="bold"
                                  sx={{ color: getReadRate(notification) > 70 ? '#10B981' : '#F59E0B' }}
                                >
                                  {getReadRate(notification)}%
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  fontWeight="bold"
                                  sx={{ color: getClickRate(notification) > 40 ? '#10B981' : '#F59E0B' }}
                                >
                                  {getClickRate(notification)}%
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Create/Edit Dialog */}
      <NotificationDialog
        open={isDialogOpen}
        notification={selectedNotification}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#2C2C2C' }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar la notificación "{selectedNotification?.title}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} sx={{ color: '#6B7280' }}>
            Cancelar
          </Button>
          <Button
            onClick={() => selectedNotification && deleteMutation.mutate(selectedNotification.id)}
            sx={{ 
              color: '#EF4444',
              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Notification Dialog Component
interface NotificationDialogProps {
  open: boolean
  notification: Notification | null
  onClose: () => void
  onSubmit: (data: Partial<Notification>) => void
  isLoading: boolean
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  open,
  notification,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'SYSTEM_ANNOUNCEMENT',
    priority: 'MEDIUM',
    status: 'DRAFT',
    targetType: 'ALL_USERS',
  })

  React.useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        status: notification.status,
        targetType: notification.targetType,
      })
    } else {
      setFormData({
        title: '',
        message: '',
        type: 'SYSTEM_ANNOUNCEMENT',
        priority: 'MEDIUM',
        status: 'DRAFT',
        targetType: 'ALL_USERS',
      })
    }
  }, [notification, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: '#2C2C2C' }}>
          {notification ? 'Editar Notificación' : 'Crear Nueva Notificación'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                multiline
                rows={4}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label="Tipo"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="SYSTEM_ANNOUNCEMENT">Anuncio del Sistema</MenuItem>
                  <MenuItem value="CHALLENGE_ALERT">Alerta de Desafío</MenuItem>
                  <MenuItem value="MERIT_AWARDED">Mérito Otorgado</MenuItem>
                  <MenuItem value="MARKETPLACE_UPDATE">Actualización Marketplace</MenuItem>
                  <MenuItem value="GROUP_INVITATION">Invitación a Grupo</MenuItem>
                  <MenuItem value="TRANSACTION_COMPLETED">Transacción Completada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  label="Prioridad"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="LOW">Baja</MenuItem>
                  <MenuItem value="MEDIUM">Media</MenuItem>
                  <MenuItem value="HIGH">Alta</MenuItem>
                  <MenuItem value="URGENT">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Audiencia</InputLabel>
                <Select
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any })}
                  label="Audiencia"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="ALL_USERS">Todos los Usuarios</MenuItem>
                  <MenuItem value="ROLE_BASED">Por Rol</MenuItem>
                  <MenuItem value="GROUP_BASED">Por Grupo</MenuItem>
                  <MenuItem value="SPECIFIC_USERS">Usuarios Específicos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#6B7280' }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#CDAB5A',
              '&:hover': {
                backgroundColor: '#B8954A',
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : (notification ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default NotificationsPage