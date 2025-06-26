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
  Unstable_Grid2 as Grid,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  EmojiEvents as TrophyIcon,
  Assignment as ChallengeIcon,
  People as PeopleIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface Challenge {
  id: string
  name: string
  description: string
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MILESTONE' | 'CUSTOM'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  isActive: boolean
  startDate?: string
  endDate?: string
  maxParticipants?: number
  createdAt: string
  updatedAt: string
  rewards: ChallengeReward[]
  userChallenges: UserChallenge[]
}

interface ChallengeReward {
  id: string
  meritAmount: number
  meritType: string
  description?: string
}

interface UserChallenge {
  id: string
  userId: string
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'PAUSED'
  progress: number
  startedAt: string
  completedAt?: string
  user: {
    id: string
    username: string
    email: string
  }
}

// Mock API functions (replace with actual API calls)
const fetchChallenges = async (): Promise<Challenge[]> => {
  // Mock data
  return [
    {
      id: '1',
      name: 'Ayni Explorer',
      description: 'Complete 5 reciprocity exchanges in the marketplace',
      type: 'WEEKLY',
      difficulty: 'MEDIUM',
      isActive: true,
      maxParticipants: 100,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      rewards: [
        {
          id: '1',
          meritAmount: 50,
          meritType: 'AYNI_POINTS',
          description: 'Bonus Ayni points for exploring reciprocity'
        }
      ],
      userChallenges: [
        {
          id: '1',
          userId: '1',
          status: 'ACTIVE',
          progress: 60,
          startedAt: '2024-01-16',
          user: {
            id: '1',
            username: 'jugador1',
            email: 'jugador1@coomunity.com'
          }
        }
      ]
    },
    {
      id: '2',
      name: 'Bien Común Champion',
      description: 'Contribute to 3 community projects prioritizing collective benefit',
      type: 'MONTHLY',
      difficulty: 'HARD',
      isActive: true,
      maxParticipants: 50,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      rewards: [
        {
          id: '2',
          meritAmount: 100,
          meritType: 'MERITOS',
          description: 'Méritos for advancing the Common Good'
        }
      ],
      userChallenges: []
    }
  ]
}

const createChallenge = async (challengeData: Partial<Challenge>): Promise<Challenge> => {
  console.log('Creating challenge:', challengeData)
  return { ...challengeData, id: Date.now().toString() } as Challenge
}

const updateChallenge = async (id: string, challengeData: Partial<Challenge>): Promise<Challenge> => {
  console.log('Updating challenge:', id, challengeData)
  return { ...challengeData, id } as Challenge
}

const deleteChallenge = async (id: string): Promise<void> => {
  console.log('Deleting challenge:', id)
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

export const ChallengesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: challenges = [], isLoading, error } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const createMutation = useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      setIsDialogOpen(false)
      toast.success('Desafío creado exitosamente')
    },
    onError: () => {
      toast.error('Error al crear el desafío')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Challenge> }) =>
      updateChallenge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      setIsDialogOpen(false)
      toast.success('Desafío actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar el desafío')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      setIsDeleteDialogOpen(false)
      toast.success('Desafío eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar el desafío')
    },
  })

  const handleCreateChallenge = () => {
    setSelectedChallenge(null)
    setIsDialogOpen(true)
  }

  const handleEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsDialogOpen(true)
  }

  const handleDeleteChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = (formData: Partial<Challenge>) => {
    if (selectedChallenge) {
      updateMutation.mutate({ id: selectedChallenge.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'success'
      case 'MEDIUM': return 'warning'
      case 'HARD': return 'error'
      case 'EXPERT': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'COMPLETED': return 'primary'
      case 'FAILED': return 'error'
      case 'PAUSED': return 'warning'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar los desafíos. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <ChallengeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestión de Desafíos CoomÜnity
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateChallenge}
          sx={{ borderRadius: 2 }}
        >
          Crear Desafío
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ChallengeIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {challenges.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Desafíos
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
                <TrophyIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {challenges.filter(c => c.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Desafíos Activos
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
                <PeopleIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {challenges.reduce((acc, c) => acc + c.userChallenges.length, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Participaciones
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
                <TrophyIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {challenges.reduce((acc, c) =>
                      acc + c.userChallenges.filter(uc => uc.status === 'COMPLETED').length, 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Todos los Desafíos" />
          <Tab label="Participaciones de Usuarios" />
        </Tabs>

        {/* Tab 1: All Challenges */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {challenges.map((challenge) => (
              <Grid item xs={12} md={6} lg={4} key={challenge.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {challenge.name}
                      </Typography>
                      <Chip
                        label={challenge.isActive ? 'Activo' : 'Inactivo'}
                        color={challenge.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {challenge.description}
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={challenge.type}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={challenge.difficulty}
                        size="small"
                        color={getDifficultyColor(challenge.difficulty) as any}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Participantes: {challenge.userChallenges.length}
                      {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
                    </Typography>

                    {challenge.rewards.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="body2" fontWeight="bold">
                          Recompensas:
                        </Typography>
                        {challenge.rewards.map((reward) => (
                          <Typography key={reward.id} variant="body2" color="text.secondary">
                            {reward.meritAmount} {reward.meritType}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleEditChallenge(challenge)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteChallenge(challenge)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 2: User Challenges */}
        <TabPanel value={currentTab} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Desafío</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Fecha Completado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {challenges.flatMap(challenge =>
                  challenge.userChallenges.map(userChallenge => (
                    <TableRow key={userChallenge.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                            {userChallenge.user.username[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {userChallenge.user.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {userChallenge.user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{challenge.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={userChallenge.status}
                          size="small"
                          color={getStatusColor(userChallenge.status) as any}
                        />
                      </TableCell>
                      <TableCell>{userChallenge.progress}%</TableCell>
                      <TableCell>
                        {new Date(userChallenge.startedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {userChallenge.completedAt
                          ? new Date(userChallenge.completedAt).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Create/Edit Dialog */}
      <ChallengeDialog
        open={isDialogOpen}
        challenge={selectedChallenge}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el desafío "{selectedChallenge?.name}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => selectedChallenge && deleteMutation.mutate(selectedChallenge.id)}
            color="error"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Challenge Dialog Component
interface ChallengeDialogProps {
  open: boolean
  challenge: Challenge | null
  onClose: () => void
  onSubmit: (data: Partial<Challenge>) => void
  isLoading: boolean
}

const ChallengeDialog: React.FC<ChallengeDialogProps> = ({
  open,
  challenge,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Challenge>>({
    name: '',
    description: '',
    type: 'WEEKLY',
    difficulty: 'MEDIUM',
    isActive: true,
    maxParticipants: undefined,
  })

  React.useEffect(() => {
    if (challenge) {
      setFormData({
        name: challenge.name,
        description: challenge.description,
        type: challenge.type,
        difficulty: challenge.difficulty,
        isActive: challenge.isActive,
        maxParticipants: challenge.maxParticipants,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'WEEKLY',
        difficulty: 'MEDIUM',
        isActive: true,
        maxParticipants: undefined,
      })
    }
  }, [challenge, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {challenge ? 'Editar Desafío' : 'Crear Nuevo Desafío'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Desafío"
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
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label="Tipo"
                >
                  <MenuItem value="DAILY">Diario</MenuItem>
                  <MenuItem value="WEEKLY">Semanal</MenuItem>
                  <MenuItem value="MONTHLY">Mensual</MenuItem>
                  <MenuItem value="MILESTONE">Hito</MenuItem>
                  <MenuItem value="CUSTOM">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dificultad</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  label="Dificultad"
                >
                  <MenuItem value="EASY">Fácil</MenuItem>
                  <MenuItem value="MEDIUM">Medio</MenuItem>
                  <MenuItem value="HARD">Difícil</MenuItem>
                  <MenuItem value="EXPERT">Experto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Máximo Participantes"
                type="number"
                value={formData.maxParticipants || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  maxParticipants: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : (challenge ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ChallengesPage
