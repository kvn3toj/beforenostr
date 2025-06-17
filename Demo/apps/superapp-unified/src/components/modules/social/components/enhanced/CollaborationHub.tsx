import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Badge,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add,
  Groups,
  TrendingUp,
  EmojiEvents,
  Star,
  People,
  Schedule,
  Language,
  LocationOn,
  Handshake,
  Psychology,
  Nature,
  School,
  Business,
  LocalHospital,
  Engineering,
  ArrowForward,
  Favorite,
  Visibility,
  MoreVert,
} from '@mui/icons-material';

interface CollaborationCircle {
  id: string;
  name: string;
  description: string;
  category:
    | 'sustainability'
    | 'education'
    | 'technology'
    | 'health'
    | 'business'
    | 'arts';
  memberCount: number;
  ayniExchanges: number;
  trustLevel: number;
  isPublic: boolean;
  isJoined: boolean;
  recentActivity: string;
  createdBy: {
    name: string;
    level: string;
  };
  nextMeeting?: string;
  activeProjects: number;
  weeklyGrowth: number;
  location?: string;
}

interface UserStats {
  socialLevel: string;
  connectionsCount: number;
  collaborationsCount: number;
  trustScore: number;
}

interface CollaborationHubProps {
  userStats: UserStats;
  isConnected: boolean;
  onCreateCircle: () => void;
  onJoinCircle: (circleId: string) => void;
}

// 🎭 Datos mock de círculos de colaboración
const mockCircles: CollaborationCircle[] = [
  {
    id: '1',
    name: 'Emprendedores Sostenibles Medellín',
    description:
      'Unimos fuerzas para crear negocios que generen impacto positivo en nuestra ciudad y el planeta.',
    category: 'sustainability',
    memberCount: 34,
    ayniExchanges: 127,
    trustLevel: 4.8,
    isPublic: true,
    isJoined: true,
    recentActivity: 'Nueva propuesta de huerto urbano comunitario',
    createdBy: {
      name: 'Ana María Rodríguez',
      level: 'Guardiana de Sabiduría',
    },
    nextMeeting: 'Mañana 7:00 PM',
    activeProjects: 5,
    weeklyGrowth: 12.5,
    location: 'Medellín, Colombia',
  },
  {
    id: '2',
    name: 'Tecnología para el Bien Común',
    description:
      'Desarrolladores y tecnólogos comprometidos con crear soluciones que sirvan a la humanidad.',
    category: 'technology',
    memberCount: 28,
    ayniExchanges: 89,
    trustLevel: 4.6,
    isPublic: true,
    isJoined: false,
    recentActivity: 'Hackathon de apps para ONGs este fin de semana',
    createdBy: {
      name: 'Carlos Mendoza',
      level: 'Tejedor de Redes',
    },
    nextMeeting: 'Viernes 6:00 PM',
    activeProjects: 8,
    weeklyGrowth: 8.3,
    location: 'Virtual',
  },
  {
    id: '3',
    name: 'Educación Transformadora',
    description:
      'Pedagogos y educadores explorando nuevas formas de enseñar basadas en sabiduría ancestral.',
    category: 'education',
    memberCount: 42,
    ayniExchanges: 156,
    trustLevel: 4.9,
    isPublic: true,
    isJoined: true,
    recentActivity: 'Taller de pedagogía Wayuu compartido',
    createdBy: {
      name: 'Luz Elena Castro',
      level: 'Colaboradora Equilibrada',
    },
    nextMeeting: 'Sábado 10:00 AM',
    activeProjects: 3,
    weeklyGrowth: 15.7,
    location: 'Bogotá, Colombia',
  },
];

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  const iconProps = { sx: { fontSize: 24 } };
  switch (category) {
    case 'sustainability':
      return <Nature {...iconProps} sx={{ color: '#4CAF50' }} />;
    case 'education':
      return <School {...iconProps} sx={{ color: '#2196F3' }} />;
    case 'technology':
      return <Engineering {...iconProps} sx={{ color: '#9C27B0' }} />;
    case 'health':
      return <LocalHospital {...iconProps} sx={{ color: '#F44336' }} />;
    case 'business':
      return <Business {...iconProps} sx={{ color: '#FF9800' }} />;
    case 'arts':
      return <Psychology {...iconProps} sx={{ color: '#E91E63' }} />;
    default:
      return <Groups {...iconProps} />;
  }
};

const CircleCard: React.FC<{
  circle: CollaborationCircle;
  onJoin: (circleId: string) => void;
  onView: (circleId: string) => void;
}> = ({ circle, onJoin, onView }) => {
  const theme = useTheme();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sustainability':
        return '#4CAF50';
      case 'education':
        return '#2196F3';
      case 'technology':
        return '#9C27B0';
      case 'health':
        return '#F44336';
      case 'business':
        return '#FF9800';
      case 'arts':
        return '#E91E63';
      default:
        return theme.palette.primary.main;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sustainability':
        return 'Sostenibilidad';
      case 'education':
        return 'Educación';
      case 'technology':
        return 'Tecnología';
      case 'health':
        return 'Salud';
      case 'business':
        return 'Negocios';
      case 'arts':
        return 'Artes';
      default:
        return 'General';
    }
  };

  return (
    <Card
      sx={{
        transition: 'all 0.3s ease-in-out',
        border: `2px solid ${circle.isJoined ? getCategoryColor(circle.category) : 'transparent'}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          border: `2px solid ${alpha(getCategoryColor(circle.category), 0.5)}`,
        },
      }}
    >
      <CardContent>
        {/* Header del círculo */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: getCategoryColor(circle.category),
                width: 48,
                height: 48,
              }}
            >
              <CategoryIcon category={circle.category} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {circle.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={getCategoryLabel(circle.category)}
                  size="small"
                  sx={{
                    bgcolor: alpha(getCategoryColor(circle.category), 0.1),
                    color: getCategoryColor(circle.category),
                    fontWeight: 'bold',
                  }}
                />
                {circle.isJoined && (
                  <Chip
                    label="Miembro"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Stack>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {circle.description}
        </Typography>

        {/* Métricas del círculo */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{xs:4}}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {circle.memberCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Miembros
              </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:4}}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {circle.ayniExchanges}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Intercambios
              </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:4}}>
            <Box textAlign="center">
              <Typography
                variant="h6"
                fontWeight="bold"
                color="warning.main"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Star sx={{ fontSize: 18 }} />
                {circle.trustLevel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Confianza
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Información adicional */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Creado por {circle.createdBy.name}
            </Typography>
          </Stack>
          {circle.location && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {circle.location}
              </Typography>
            </Stack>
          )}
          {circle.nextMeeting && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Próxima reunión: {circle.nextMeeting}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Actividad reciente */}
        <Paper
          sx={{
            p: 1.5,
            bgcolor: alpha(getCategoryColor(circle.category), 0.05),
            border: `1px solid ${alpha(getCategoryColor(circle.category), 0.2)}`,
            mb: 2,
          }}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Actividad reciente:
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {circle.recentActivity}
          </Typography>
        </Paper>

        {/* Crecimiento semanal */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Crecimiento semanal
            </Typography>
            <Typography
              variant="caption"
              fontWeight="bold"
              color="success.main"
            >
              +{circle.weeklyGrowth}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={circle.weeklyGrowth}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(getCategoryColor(circle.category), 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: getCategoryColor(circle.category),
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Acciones */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            onClick={() => onView(circle.id)}
            sx={{ flex: 1 }}
          >
            Ver más
          </Button>
          {circle.isJoined ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<ArrowForward />}
              sx={{
                flex: 1,
                bgcolor: getCategoryColor(circle.category),
                '&:hover': {
                  bgcolor: alpha(getCategoryColor(circle.category), 0.8),
                },
              }}
            >
              Entrar
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => onJoin(circle.id)}
              sx={{ flex: 1 }}
            >
              Unirse
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  userStats,
  isConnected,
  onCreateCircle,
  onJoinCircle,
}) => {
  const theme = useTheme();
  const [circles, setCircles] = useState<CollaborationCircle[]>(mockCircles);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [newCircleCategory, setNewCircleCategory] = useState('');

  const filteredCircles = circles.filter((circle) => {
    if (filter === 'all') return true;
    if (filter === 'joined') return circle.isJoined;
    return circle.category === filter;
  });

  const joinedCircles = circles.filter((circle) => circle.isJoined);

  const handleJoinCircle = (circleId: string) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === circleId
          ? { ...circle, isJoined: true, memberCount: circle.memberCount + 1 }
          : circle
      )
    );
    onJoinCircle(circleId);
  };

  const handleViewCircle = (circleId: string) => {
    console.log(`👁️ Ver círculo: ${circleId}`);
  };

  const handleCreateCircle = () => {
    if (
      !newCircleName.trim() ||
      !newCircleDescription.trim() ||
      !newCircleCategory
    ) {
      return;
    }

    const newCircle: CollaborationCircle = {
      id: `circle-${Date.now()}`,
      name: newCircleName,
      description: newCircleDescription,
      category: newCircleCategory as any,
      memberCount: 1,
      ayniExchanges: 0,
      trustLevel: 0,
      isPublic: true,
      isJoined: true,
      recentActivity: 'Círculo recién creado',
      createdBy: {
        name: 'Tú',
        level: userStats.socialLevel,
      },
      activeProjects: 0,
      weeklyGrowth: 0,
    };

    setCircles([newCircle, ...circles]);
    setShowCreateDialog(false);
    setNewCircleName('');
    setNewCircleDescription('');
    setNewCircleCategory('');
    onCreateCircle();
  };

  return (
    <Box>
      {/* 🎯 Header del hub de colaboración */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(
            '#2196F3',
            0.9
          )} 0%, ${alpha('#9C27B0', 0.9)} 100%)`,
          color: 'white',
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Círculos de Colaboración
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Espacios donde el Bien Común se materializa a través de la
                acción colectiva
              </Typography>
            </Box>
            <Groups sx={{ fontSize: 48, opacity: 0.7 }} />
          </Stack>

          {/* Métricas del usuario */}
          <Grid container spacing={2}>
            <Grid size={{xs:3}}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {joinedCircles.length}
                </Typography>
                <Typography variant="caption">Círculos Unidos</Typography>
              </Box>
            </Grid>
            <Grid size={{xs:3}}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {joinedCircles.reduce(
                    (sum, circle) => sum + circle.ayniExchanges,
                    0
                  )}
                </Typography>
                <Typography variant="caption">Intercambios Totales</Typography>
              </Box>
            </Grid>
            <Grid size={{xs:3}}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {joinedCircles.reduce(
                    (sum, circle) => sum + circle.activeProjects,
                    0
                  )}
                </Typography>
                <Typography variant="caption">Proyectos Activos</Typography>
              </Box>
            </Grid>
            <Grid size={{xs:3}}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {userStats.trustScore}
                </Typography>
                <Typography variant="caption">Confianza Media</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 🎯 Controles y filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Explorar Círculos
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              variant="contained"
              sx={{ bgcolor: '#2196F3' }}
            >
              Crear Círculo
            </Button>
          </Stack>

          {/* Filtros */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label="Todos"
              color={filter === 'all' ? 'primary' : 'default'}
              onClick={() => setFilter('all')}
            />
            <Chip
              label="Mis Círculos"
              color={filter === 'joined' ? 'primary' : 'default'}
              onClick={() => setFilter('joined')}
            />
            <Chip
              label="Sostenibilidad"
              color={filter === 'sustainability' ? 'success' : 'default'}
              onClick={() => setFilter('sustainability')}
            />
            <Chip
              label="Educación"
              color={filter === 'education' ? 'info' : 'default'}
              onClick={() => setFilter('education')}
            />
            <Chip
              label="Tecnología"
              color={filter === 'technology' ? 'secondary' : 'default'}
              onClick={() => setFilter('technology')}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 🎯 Grid de círculos */}
      <Grid container spacing={3}>
        {filteredCircles.map((circle) => (
          <Grid size={{xs:12,md:6,lg:4}} key={circle.id}>
            <CircleCard
              circle={circle}
              onJoin={handleJoinCircle}
              onView={handleViewCircle}
            />
          </Grid>
        ))}
      </Grid>

      {/* 🎯 Mensaje cuando no hay círculos */}
      {filteredCircles.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Groups sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay círculos en esta categoría
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sé el primero en crear un círculo de colaboración
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              variant="contained"
              sx={{ bgcolor: '#2196F3' }}
            >
              Crear Primer Círculo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 🎯 Dialog para crear círculo */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>🌟 Crear Nuevo Círculo de Colaboración</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del círculo"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
              placeholder="ej. Innovadores Sociales de Bogotá"
              fullWidth
            />
            <TextField
              label="Descripción"
              multiline
              rows={3}
              value={newCircleDescription}
              onChange={(e) => setNewCircleDescription(e.target.value)}
              placeholder="Describe el propósito y visión de tu círculo..."
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={newCircleCategory}
                onChange={(e) => setNewCircleCategory(e.target.value)}
                label="Categoría"
              >
                <MenuItem value="sustainability">Sostenibilidad</MenuItem>
                <MenuItem value="education">Educación</MenuItem>
                <MenuItem value="technology">Tecnología</MenuItem>
                <MenuItem value="health">Salud</MenuItem>
                <MenuItem value="business">Negocios</MenuItem>
                <MenuItem value="arts">Artes</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateCircle}
            variant="contained"
            disabled={
              !newCircleName.trim() ||
              !newCircleDescription.trim() ||
              !newCircleCategory
            }
            sx={{ bgcolor: '#2196F3' }}
          >
            Crear Círculo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
