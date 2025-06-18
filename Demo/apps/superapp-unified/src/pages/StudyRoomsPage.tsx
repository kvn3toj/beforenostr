import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Badge,
  LinearProgress,
} from '@mui/material'
import {
  MeetingRoom as RoomIcon,
  VideoCall as VideoIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as JoinIcon,
  Add as CreateIcon,
  Lock as PrivateIcon,
  Public as PublicIcon,
  SelfImprovement as MeditationIcon,
  School as LearningIcon,
  Groups as WorkshopIcon,
  Forum as DiscussionIcon,
  LiveTv as LiveIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface StudyRoom {
  id: string
  name: string
  description: string
  type: 'VIDEO_SYNC' | 'DISCUSSION' | 'WORKSHOP' | 'MEDITATION'
  status: 'ACTIVE' | 'SCHEDULED' | 'FULL'
  capacity: number
  currentParticipants: number
  isPublic: boolean
  scheduledAt?: string
  startedAt?: string
  host: {
    id: string
    username: string
    avatar?: string
  }
  participants: {
    id: string
    username: string
    avatar?: string
    isActive: boolean
  }[]
  currentVideo?: {
    title: string
    progress: number
    duration: number
  }
  tags: string[]
}

// Mock API functions
const fetchAvailableRooms = async (): Promise<StudyRoom[]> => {
  return [
    {
      id: '1',
      name: 'Círculo de Meditación Matutina',
      description: 'Inicia tu día con una sesión de meditación guiada. Conecta con tu interior y la energía de la comunidad.',
      type: 'MEDITATION',
      status: 'ACTIVE',
      capacity: 20,
      currentParticipants: 8,
      isPublic: true,
      startedAt: '2024-01-15T06:00:00Z',
      host: {
        id: '1',
        username: 'Guía Espiritual',
        avatar: '/avatars/guia.jpg'
      },
      participants: [
        { id: '1', username: 'Ana', avatar: '/avatars/ana.jpg', isActive: true },
        { id: '2', username: 'Carlos', avatar: '/avatars/carlos.jpg', isActive: true },
        { id: '3', username: 'María', avatar: '/avatars/maria.jpg', isActive: false },
      ],
      tags: ['Meditación', 'Bien Común', 'Ayni']
    },
    {
      id: '2',
      name: 'Documental: Economía del Bien Común',
      description: 'Visionado sincronizado del documental sobre economía regenerativa con discusión en tiempo real.',
      type: 'VIDEO_SYNC',
      status: 'ACTIVE',
      capacity: 25,
      currentParticipants: 15,
      isPublic: true,
      startedAt: '2024-01-15T19:00:00Z',
      host: {
        id: '2',
        username: 'Economista Regenerativo',
        avatar: '/avatars/economista.jpg'
      },
      participants: [
        { id: '4', username: 'Luis', avatar: '/avatars/luis.jpg', isActive: true },
        { id: '5', username: 'Elena', avatar: '/avatars/elena.jpg', isActive: true },
      ],
      currentVideo: {
        title: 'La Economía del Bien Común - Capítulo 1',
        progress: 34,
        duration: 3600
      },
      tags: ['Economía', 'Documental', 'Bien Común']
    },
    {
      id: '3',
      name: 'Taller: Permacultura Digital',
      description: 'Aprende principios de permacultura aplicados al desarrollo tecnológico sostenible.',
      type: 'WORKSHOP',
      status: 'SCHEDULED',
      capacity: 15,
      currentParticipants: 7,
      isPublic: true,
      scheduledAt: '2024-01-16T14:00:00Z',
      host: {
        id: '3',
        username: 'Permacultor Tech',
        avatar: '/avatars/permacultor.jpg'
      },
      participants: [
        { id: '6', username: 'David', avatar: '/avatars/david.jpg', isActive: false },
        { id: '7', username: 'Sofia', avatar: '/avatars/sofia.jpg', isActive: false },
      ],
      tags: ['Permacultura', 'Tecnología', 'Taller']
    },
    {
      id: '4',
      name: 'Intercambio de Experiencias LETS',
      description: 'Comparte tus experiencias con el sistema de intercambio local y aprende de otros miembros.',
      type: 'DISCUSSION',
      status: 'ACTIVE',
      capacity: 12,
      currentParticipants: 5,
      isPublic: false,
      startedAt: '2024-01-15T16:30:00Z',
      host: {
        id: '4',
        username: 'Coordinador LETS',
        avatar: '/avatars/coordinador.jpg'
      },
      participants: [
        { id: '8', username: 'Pablo', avatar: '/avatars/pablo.jpg', isActive: true },
      ],
      tags: ['LETS', 'Intercambio', 'Experiencias']
    }
  ]
}

const joinRoom = async (roomId: string): Promise<void> => {
  console.log('Joining room:', roomId)
}

const createRoom = async (roomData: Partial<StudyRoom>): Promise<StudyRoom> => {
  console.log('Creating room:', roomData)
  return { ...roomData, id: Date.now().toString() } as StudyRoom
}

const StudyRoomsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null)

  const queryClient = useQueryClient()

  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ['study-rooms'],
    queryFn: fetchAvailableRooms,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const joinRoomMutation = useMutation({
    mutationFn: joinRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-rooms'] })
      toast.success('¡Te has unido a la sala de estudio!')
    },
    onError: () => {
      toast.error('Error al unirse a la sala')
    },
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_SYNC': return <VideoIcon sx={{ color: '#CDAB5A' }} />
      case 'MEDITATION': return <MeditationIcon sx={{ color: '#10B981' }} />
      case 'WORKSHOP': return <WorkshopIcon sx={{ color: '#3B82F6' }} />
      case 'DISCUSSION': return <DiscussionIcon sx={{ color: '#8B5CF6' }} />
      default: return <RoomIcon sx={{ color: '#6B7280' }} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO_SYNC': return 'Video Sincronizado'
      case 'MEDITATION': return 'Meditación'
      case 'WORKSHOP': return 'Taller'
      case 'DISCUSSION': return 'Discusión'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'SCHEDULED': return 'warning'
      case 'FULL': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'En Vivo'
      case 'SCHEDULED': return 'Programada'
      case 'FULL': return 'Llena'
      default: return status
    }
  }

  const filteredRooms = rooms.filter(room => {
    const typeMatch = filterType === 'ALL' || room.type === filterType
    const statusMatch = filterStatus === 'ALL' || room.status === filterStatus
    return typeMatch && statusMatch
  })

  const handleJoinRoom = (room: StudyRoom) => {
    if (room.status === 'FULL') {
      toast.error('La sala está llena')
      return
    }
    joinRoomMutation.mutate(room.id)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

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
        Error al cargar las salas de estudio. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <RoomIcon sx={{ fontSize: 32, color: '#CDAB5A', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Salas de Estudio CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Únete a salas de estudio colaborativo • {rooms.filter(r => r.status === 'ACTIVE').length} activas ahora
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{ 
            backgroundColor: '#CDAB5A',
            '&:hover': { backgroundColor: '#B8954A' }
          }}
        >
          Crear Sala
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Sala</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Tipo de Sala"
              >
                <MenuItem value="ALL">Todas</MenuItem>
                <MenuItem value="VIDEO_SYNC">Video Sincronizado</MenuItem>
                <MenuItem value="MEDITATION">Meditación</MenuItem>
                <MenuItem value="WORKSHOP">Taller</MenuItem>
                <MenuItem value="DISCUSSION">Discusión</MenuItem>
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
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="ACTIVE">En Vivo</MenuItem>
                <MenuItem value="SCHEDULED">Programadas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Study Rooms Grid */}
      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                border: room.status === 'ACTIVE' ? '2px solid #10B981' : '1px solid rgba(0,0,0,0.1)',
                backgroundColor: room.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.05)' : 'background.paper',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(205, 171, 90, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getTypeIcon(room.type)}
                    <Box ml={1}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                        {room.name}
                      </Typography>
                      <Chip
                        label={getTypeLabel(room.type)}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          mt: 0.5,
                          borderColor: '#CDAB5A', 
                          color: '#CDAB5A',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="end">
                    <Chip
                      label={getStatusLabel(room.status)}
                      color={getStatusColor(room.status) as any}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {room.isPublic ? (
                      <PublicIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    ) : (
                      <PrivateIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                    )}
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 2 }}>
                  {room.description}
                </Typography>

                {/* Host & Participants */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Anfitrión: <strong>{room.host.username}</strong>
                    </Typography>
                    <Badge badgeContent={room.currentParticipants} color="primary">
                      <PeopleIcon sx={{ color: '#CDAB5A' }} />
                    </Badge>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                      {room.participants.slice(0, 3).map((participant) => (
                        <Avatar 
                          key={participant.id} 
                          sx={{ 
                            backgroundColor: participant.isActive ? '#10B981' : '#6B7280',
                            border: participant.isActive ? '2px solid #10B981' : 'none'
                          }}
                        >
                          {participant.username[0]}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography variant="caption" color="text.secondary">
                      {room.currentParticipants}/{room.capacity} participantes
                    </Typography>
                  </Box>

                  {/* Capacity Progress */}
                  <LinearProgress 
                    variant="determinate" 
                    value={(room.currentParticipants / room.capacity) * 100}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: room.status === 'FULL' ? '#EF4444' : '#CDAB5A'
                      }
                    }}
                  />
                </Box>

                {/* Current Video Progress */}
                {room.currentVideo && (
                  <Box sx={{ p: 2, backgroundColor: 'rgba(205, 171, 90, 0.1)', borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#CDAB5A', mb: 1 }}>
                      <LiveIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Reproduciendo ahora:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {room.currentVideo.title}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={room.currentVideo.progress}
                      sx={{ 
                        height: 4, 
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#10B981'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {room.currentVideo.progress}% completado
                    </Typography>
                  </Box>
                )}

                {/* Scheduled Time */}
                {room.scheduledAt && (
                  <Box display="flex" alignItems="center" mb={2}>
                    <ScheduleIcon sx={{ color: '#F59E0B', fontSize: 16, mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Programada para las {formatTime(room.scheduledAt)}
                    </Typography>
                  </Box>
                )}

                {/* Tags */}
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {room.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 20,
                        borderColor: 'rgba(205, 171, 90, 0.5)',
                        color: 'text.secondary'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>

              {/* Actions */}
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={room.status === 'ACTIVE' ? 'contained' : 'outlined'}
                  startIcon={room.status === 'ACTIVE' ? <JoinIcon /> : <ScheduleIcon />}
                  onClick={() => handleJoinRoom(room)}
                  disabled={room.status === 'FULL' || joinRoomMutation.isPending}
                  sx={{ 
                    backgroundColor: room.status === 'ACTIVE' ? '#CDAB5A' : 'transparent',
                    borderColor: '#CDAB5A',
                    color: room.status === 'ACTIVE' ? 'white' : '#CDAB5A',
                    '&:hover': {
                      backgroundColor: room.status === 'ACTIVE' ? '#B8954A' : 'rgba(205, 171, 90, 0.08)',
                    }
                  }}
                >
                  {room.status === 'ACTIVE' ? 'Unirse Ahora' : 
                   room.status === 'SCHEDULED' ? 'Programar Recordatorio' :
                   'Sala Llena'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <Box textAlign="center" py={8}>
          <RoomIcon sx={{ fontSize: 64, color: '#CDAB5A', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={2}>
            No hay salas de estudio disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sé el primero en crear una sala de estudio para la comunidad
          </Typography>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ 
              backgroundColor: '#CDAB5A',
              '&:hover': { backgroundColor: '#B8954A' }
            }}
          >
            Crear Primera Sala
          </Button>
        </Box>
      )}

      {/* Create Room Dialog */}
      <CreateRoomDialog 
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Box>
  )
}

// Create Room Dialog Component
interface CreateRoomDialogProps {
  open: boolean
  onClose: () => void
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'DISCUSSION',
    capacity: 10,
    isPublic: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating room:', formData)
    toast.success('Sala creada exitosamente')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Crear Nueva Sala de Estudio</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Sala"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Sala</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Tipo de Sala"
                >
                  <MenuItem value="DISCUSSION">Discusión</MenuItem>
                  <MenuItem value="MEDITATION">Meditación</MenuItem>
                  <MenuItem value="WORKSHOP">Taller</MenuItem>
                  <MenuItem value="VIDEO_SYNC">Video Sincronizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacidad"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                inputProps={{ min: 2, max: 50 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#CDAB5A',
              '&:hover': { backgroundColor: '#B8954A' }
            }}
          >
            Crear Sala
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default StudyRoomsPage