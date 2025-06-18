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
  Switch,
  FormControlLabel,
  Badge,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as ActiveIcon,
  NotificationsOff as InactiveIcon,
  Campaign as CampaignIcon,
  Message as MessageIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface Notification {
  id: string
  type: 'NEW_PUBLICATION' | 'MERIT_AWARDED' | 'CHALLENGE_ALERT' | 'TRANSACTION_COMPLETED' | 
        'GROUP_INVITATION' | 'SYSTEM_ANNOUNCEMENT' | 'CHAT_MESSAGE' | 'EXPERIENCE_COMPLETED' | 
        'TOKEN_EXPIRY_WARNING' | 'MARKETPLACE_UPDATE'
  title: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'DRAFT' | 'SENT' | 'SCHEDULED' | 'FAILED'
  targetAudience: 'ALL' | 'PREMIUM' | 'EMPRENDEDORES_CONFIABLES' | 'NEW_USERS' | 'SPECIFIC_USERS'
  targetUserIds?: string[]
  scheduledAt?: string
  sentAt?: string
  createdAt: string
  updatedAt: string
  readCount: number
  totalRecipients: number
  clickCount: number
  isActive: boolean
  metadata?: {
    relatedEntityType?: string
    relatedEntityId?: string
    actionUrl?: string
    imageUrl?: string
  }
}

interface NotificationStats {
  totalNotifications: number
  sentNotifications: number
  draftNotifications: number
  scheduledNotifications: number
  totalReads: number
  totalClicks: number
  averageReadRate: number
  averageClickRate: number
  notificationsByType: Record<string, number>
  notificationsByPriority: Record<string, number>
}

// Mock API functions
const fetchNotifications = async (): Promise<Notification[]> => {
  return [
    {
      id: '1',
      type: 'MERIT_AWARDED',
      title: 'Nuevos Méritos Otorgados',
      message: 'Felicitaciones! Has recibido 100 Méritos por tu contribución al Bien Común en el proyecto Huerto Comunitario.',
      priority: 'HIGH',
      status: 'SENT',
      targetAudience: 'SPECIFIC_USERS',
      targetUserIds: ['user1', 'user2'],
      sentAt: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      readCount: 85,
      totalRecipients: 120,
      clickCount: 42,
      isActive: true,
      metadata: {
        relatedEntityType: 'Merit',
        relatedEntityId: 'merit_1',
        actionUrl: '/merits/history'
      }
    },
    {
      id: '2',
      type: 'CHALLENGE_ALERT',
      title: 'Nuevo Desafío Disponible: Ayni Explorer',
      message: 'Un nuevo desafío semanal está disponible. Completa 5 intercambios de reciprocidad en el marketplace y gana puntos Ayni.',
      priority: 'MEDIUM',
      status: 'SENT',
      targetAudience: 'ALL',
      sentAt: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-14T14:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      readCount: 234,
      totalRecipients: 450,
      clickCount: 156,
      isActive: true,
      metadata: {
        relatedEntityType: 'Challenge',
        relatedEntityId: 'challenge_1',
        actionUrl: '/challenges/ayni-explorer'
      }
    },
    {
      id: '3',
      type: 'SYSTEM_ANNOUNCEMENT',
      title: 'Mantenimiento Programado',
      message: 'El sistema estará en mantenimiento el domingo 21 de enero de 2:00 AM a 4:00 AM. Durante este tiempo, algunas funciones podrían no estar disponibles.',
      priority: 'URGENT',
      status: 'SCHEDULED',
      targetAudience: 'ALL',
      scheduledAt: '2024-01-20T18:00:00Z',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      readCount: 0,
      totalRecipients: 1250,
      clickCount: 0,
      isActive: true,
      metadata: {
        relatedEntityType: 'System',
        actionUrl: '/system/status'
      }
    }
  ]
}

const fetchNotificationStats = async (): Promise<NotificationStats> => {
  return {
    totalNotifications: 67,
    sentNotifications: 52,
    draftNotifications: 8,
    scheduledNotifications: 7,
    totalReads: 2340,
    totalClicks: 1256,
    averageReadRate: 78.5,
    averageClickRate: 45.2,
    notificationsByType: {
      MERIT_AWARDED: 15,
      CHALLENGE_ALERT: 12,
      SYSTEM_ANNOUNCEMENT: 8,
      MARKETPLACE_UPDATE: 10,
      GROUP_INVITATION: 7,
      TRANSACTION_COMPLETED: 9,
      EXPERIENCE_COMPLETED: 6
    },
    notificationsByPriority: {
      LOW: 18,
      MEDIUM: 25,
      HIGH: 16,
      URGENT: 8
    }
  }
}

const createNotification = async (notificationData: Partial<Notification>): Promise<Notification> => {
  console.log('Creating notification:', notificationData)
  return { ...notificationData, id: Date.now().toString() } as Notification
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
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

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
      setIsDialogOpen(false)
      toast.success('Notificación creada exitosamente')
    },
    onError: () => {
      toast.error('Error al crear la notificación')
    },
  })

  const handleCreateNotification = () => {
    setSelectedNotification(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = (formData: Partial<Notification>) => {
    createMutation.mutate(formData)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MERIT_AWARDED': return <SuccessIcon color="success" />
      case 'CHALLENGE_ALERT': return <CampaignIcon color="warning" />
      case 'SYSTEM_ANNOUNCEMENT': return <InfoIcon color="info" />
      default: return <NotificationsIcon />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'success'
      case 'DRAFT': return 'warning'
      case 'SCHEDULED': return 'info'
      case 'FAILED': return 'error'
      default: return 'default'
    }
  }

  if (loadingNotifications || loadingStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (notificationsError) {
    return (
      <Alert severity="error">
        Error al cargar las notificaciones. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestión de Notificaciones CoomÜnity
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNotification}
          sx={{ borderRadius: 2 }}
        >
          Nueva Notificación
        </Button>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <NotificationsIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
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
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ActiveIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.sentNotifications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enviadas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(notification.type)}
                      label={notification.type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {notification.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={notification.status}
                      size="small"
                      color={getStatusColor(notification.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default NotificationsPage 