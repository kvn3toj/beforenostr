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
  Grid,
  Avatar,
  Badge,
  Stack,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoIcon,
  MeetingRoom as RoomIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Wifi as LiveIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Pause as PausedIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface StudyRoom {
  id: string
  name: string
  description: string
  type: 'VIDEO_SYNC' | 'DISCUSSION' | 'STUDY_GROUP' | 'WORKSHOP' | 'MEDITATION'
  status: 'ACTIVE' | 'PAUSED' | 'SCHEDULED' | 'ENDED'
  capacity: number
  isPublic: boolean
  requiresPermission: boolean
  scheduledAt?: string
  startedAt?: string
  endedAt?: string
  createdAt: string
  host: {
    id: string
    username: string
    email: string
  }
  participants: Participant[]
  currentVideo?: {
    id: string
    title: string
    duration: number
    currentTime: number
  }
  settings: {
    allowChat: boolean
    allowVideoControl: boolean
    autoSync: boolean
    recordSession: boolean
  }
}

interface Participant {
  id: string
  userId: string
  username: string
  joinedAt: string
  isActive: boolean
  isModerator: boolean
  user: {
    id: string
    username: string
    email: string
  }
}

interface StudyRoomStats {
  totalRooms: number
  activeRooms: number
  scheduledRooms: number
  totalParticipants: number
  averageSessionDuration: number
  roomsByType: Record<string, number>
  peakHours: { hour: number; count: number }[]
}

// Mock API functions
const fetchStudyRooms = async (): Promise<StudyRoom[]> => {
  return [
    {
      id: '1',
      name: 'Círculo de Meditación Matutina',
      description: 'Sesión diaria de meditación comunitaria basada en principios de reconexión con la naturaleza y el Bien Común',
      type: 'MEDITATION',
      status: 'ACTIVE',
      capacity: 20,
      isPublic: true,
      requiresPermission: false,
      startedAt: '2024-01-15T06:00:00Z',
      createdAt: '2024-01-14T18:00:00Z',
      host: {
        id: 'host1',
        username: 'guia_espiritual',
        email: 'meditacion@coomunity.com'
      },
      participants: [
        {
          id: 'p1',
          userId: 'u1',
          username: 'contemplador_activo',
          joinedAt: '2024-01-15T06:05:00Z',
          isActive: true,
          isModerator: false,
          user: { id: 'u1', username: 'contemplador_activo', email: 'user1@coomunity.com' }
        },
        {
          id: 'p2',
          userId: 'u2',
          username: 'buscador_interior',
          joinedAt: '2024-01-15T06:03:00Z',
          isActive: true,
          isModerator: false,
          user: { id: 'u2', username: 'buscador_interior', email: 'user2@coomunity.com' }
        }
      ],
      settings: {
        allowChat: true,
        allowVideoControl: false,
        autoSync: true,
        recordSession: false
      }
    },
    {
      id: '2',
      name: 'Taller de Permacultura Digital',
      description: 'Aprendizaje colaborativo sobre principios de permacultura aplicados al desarrollo tecnológico sostenible',
      type: 'WORKSHOP',
      status: 'SCHEDULED',
      capacity: 15,
      isPublic: true,
      requiresPermission: true,
      scheduledAt: '2024-01-16T14:00:00Z',
      createdAt: '2024-01-13T10:00:00Z',
      host: {
        id: 'host2',
        username: 'permacultor_tech',
        email: 'permacultura@coomunity.com'
      },
      participants: [],
      settings: {
        allowChat: true,
        allowVideoControl: true,
        autoSync: true,
        recordSession: true
      }
    },
    {
      id: '3',
      name: 'Estudio Sincronizado: Economía del Bien Común',
      description: 'Visionado grupal del documental sobre economía regenerativa con discusión en tiempo real',
      type: 'VIDEO_SYNC',
      status: 'ACTIVE',
      capacity: 25,
      isPublic: false,
      requiresPermission: true,
      startedAt: '2024-01-15T19:00:00Z',
      createdAt: '2024-01-15T12:00:00Z',
      host: {
        id: 'host3',
        username: 'economia_regenerativa',
        email: 'economia@coomunity.com'
      },
      participants: [
        {
          id: 'p3',
          userId: 'u3',
          username: 'estudiante_economia',
          joinedAt: '2024-01-15T19:02:00Z',
          isActive: true,
          isModerator: true,
          user: { id: 'u3', username: 'estudiante_economia', email: 'user3@coomunity.com' }
        }
      ],
      currentVideo: {
        id: 'video1',
        title: 'La Economía del Bien Común - Parte 1',
        duration: 3600,
        currentTime: 1245
      },
      settings: {
        allowChat: true,
        allowVideoControl: false,
        autoSync: true,
        recordSession: true
      }
    }
  ]
}

const fetchStudyRoomStats = async (): Promise<StudyRoomStats> => {
  return {
    totalRooms: 28,
    activeRooms: 5,
    scheduledRooms: 8,
    totalParticipants: 127,
    averageSessionDuration: 65.4,
    roomsByType: {
      VIDEO_SYNC: 12,
      MEDITATION: 8,
      WORKSHOP: 5,
      DISCUSSION: 3
    },
    peakHours: [
      { hour: 6, count: 8 },
      { hour: 19, count: 12 },
      { hour: 20, count: 15 }
    ]
  }
}

export const StudyRoomsPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')

  const queryClient = useQueryClient()

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['study-rooms'],
    queryFn: fetchStudyRooms,
  })

  const { data: stats } = useQuery({
    queryKey: ['study-room-stats'],
    queryFn: fetchStudyRoomStats,
  })

  const filteredRooms = rooms.filter(room => {
    const statusMatch = filterStatus === 'ALL' || room.status === filterStatus
    const typeMatch = filterType === 'ALL' || room.type === filterType
    return statusMatch && typeMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'SCHEDULED': return 'warning'
      case 'PAUSED': return 'default'
      case 'ENDED': return 'error'
      default: return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_SYNC': return <VideoIcon sx={{ color: '#CDAB5A' }} />
      case 'MEDITATION': return <ActiveIcon sx={{ color: '#10B981' }} />
      case 'WORKSHOP': return <RoomIcon sx={{ color: '#3B82F6' }} />
      case 'DISCUSSION': return <PeopleIcon sx={{ color: '#8B5CF6' }} />
      default: return <RoomIcon sx={{ color: '#6B7280' }} />
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#CDAB5A' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
          <RoomIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#CDAB5A' }} />
          Gestión de Salas de Estudio CoomÜnity
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#CDAB5A',
            '&:hover': { backgroundColor: '#B8954A' }
          }}
        >
          Crear Sala
        </Button>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(205, 171, 90, 0.15)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Badge badgeContent={stats.activeRooms} color="success">
                    <RoomIcon sx={{ color: '#CDAB5A', fontSize: 32 }} />
                  </Badge>
                  <Box ml={2}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.totalRooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Salas
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
                  <LiveIcon sx={{ color: '#10B981', fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.activeRooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Salas Activas
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
                  <PeopleIcon sx={{ color: '#3B82F6', fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.totalParticipants}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Participantes Totales
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
                  <ScheduleIcon sx={{ color: '#F59E0B', fontSize: 32, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {stats.averageSessionDuration.toFixed(0)}m
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duración Promedio
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
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Estado"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="ACTIVE">Activas</MenuItem>
                <MenuItem value="SCHEDULED">Programadas</MenuItem>
                <MenuItem value="PAUSED">Pausadas</MenuItem>
                <MenuItem value="ENDED">Terminadas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
                <MenuItem value="VIDEO_SYNC">Sincronización Video</MenuItem>
                <MenuItem value="MEDITATION">Meditación</MenuItem>
                <MenuItem value="WORKSHOP">Taller</MenuItem>
                <MenuItem value="DISCUSSION">Discusión</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Study Rooms Grid */}
      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              border: room.status === 'ACTIVE' ? '2px solid #10B981' : '1px solid #E5E7EB',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(205, 171, 90, 0.2)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getTypeIcon(room.type)}
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1, color: '#2C2C2C' }}>
                      {room.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={room.status}
                    color={getStatusColor(room.status) as any}
                    size="small"
                    sx={{ borderRadius: 1.5 }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.5 }}>
                  {room.description}
                </Typography>

                <Stack spacing={1} mb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Anfitrión:</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#CDAB5A' }}>
                      {room.host.username}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Participantes:</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                      {room.participants.length}/{room.capacity}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Acceso:</Typography>
                    <Chip
                      label={room.isPublic ? 'Público' : 'Privado'}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: room.isPublic ? '#10B981' : '#F59E0B' }}
                    />
                  </Box>
                </Stack>

                {room.currentVideo && (
                  <Box sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#CDAB5A' }}>
                      Video Actual:
                    </Typography>
                    <Typography variant="body2">{room.currentVideo.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDuration(room.currentVideo.currentTime)} / {formatDuration(room.currentVideo.duration)}
                    </Typography>
                  </Box>
                )}

                {room.scheduledAt && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ScheduleIcon sx={{ color: '#F59E0B', fontSize: 16, mr: 1 }} />
                    <Typography variant="caption">
                      Programada: {new Date(room.scheduledAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => setSelectedRoom(room)}
                  sx={{ color: '#CDAB5A' }}
                >
                  <EditIcon />
                </IconButton>
                {room.status === 'ACTIVE' && (
                  <IconButton
                    size="small"
                    sx={{ color: '#EF4444' }}
                  >
                    <StopIcon />
                  </IconButton>
                )}
                {room.status === 'SCHEDULED' && (
                  <IconButton
                    size="small"
                    sx={{ color: '#10B981' }}
                  >
                    <StartIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Active Participants Table */}
      {filteredRooms.some(room => room.status === 'ACTIVE' && room.participants.length > 0) && (
        <Paper sx={{ mt: 3, borderRadius: 2 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#CDAB5A' }}>
              Participantes Activos
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sala</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tiempo en Sesión</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRooms
                  .filter(room => room.status === 'ACTIVE')
                  .flatMap(room => 
                    room.participants.map(participant => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, width: 32, height: 32, backgroundColor: '#CDAB5A' }}>
                              {participant.username[0].toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {participant.username}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {participant.user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {room.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={participant.isModerator ? 'Moderador' : 'Participante'}
                            size="small"
                            color={participant.isModerator ? 'primary' : 'default'}
                            sx={{ borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {Math.floor((Date.now() - new Date(participant.joinedAt).getTime()) / 60000)}m
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                backgroundColor: participant.isActive ? '#10B981' : '#6B7280',
                                mr: 1 
                              }} 
                            />
                            <Typography variant="body2" color={participant.isActive ? '#10B981' : '#6B7280'}>
                              {participant.isActive ? 'En línea' : 'Desconectado'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  )
}

export default StudyRoomsPage