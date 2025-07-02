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

const UNIFIED_CARD_STYLE = {
  p: { xs: 2, md: 3 },
  borderRadius: 4,
  height: '100%',
  boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.02)',
  backgroundColor: 'background.paper',
};

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
  reciprocidadExchanges: number;
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
    reciprocidadExchanges: 127,
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
    reciprocidadExchanges: 89,
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
    reciprocidadExchanges: 156,
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
    <Paper sx={UNIFIED_CARD_STYLE}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        {/* Header del círculo */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
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
              <Chip
                label={getCategoryLabel(circle.category)}
                size="small"
                sx={{
                  bgcolor: alpha(getCategoryColor(circle.category), 0.1),
                  color: getCategoryColor(circle.category),
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Stack>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Stack>

        {/* Descripción */}
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {circle.description}
        </Typography>

        {/* Métricas */}
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
          <Grid item xs={4}>
            <Typography variant="h6" fontWeight="bold">
              {circle.memberCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Miembros
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {circle.reciprocidadExchanges}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ayni
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" fontWeight="bold" color="warning.main">
              <Star sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
              {circle.trustLevel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Confianza
            </Typography>
          </Grid>
        </Grid>

        <Divider />

        {/* Acciones */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onView(circle.id)}
          >
            Ver Detalles
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => onJoin(circle.id)}
            disabled={circle.isJoined}
          >
            {circle.isJoined ? 'Unido' : 'Unirse'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

const CreateCircleDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleCreate = () => {
    // Aquí iría la lógica para crear el círculo en el backend
    console.log('Creando círculo:', { name, description, category });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nuevo Círculo de Colaboración</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label="Nombre del Círculo"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            label="Descripción del Propósito"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Categoría Principal</InputLabel>
            <Select
              value={category}
              label="Categoría Principal"
              onChange={e => setCategory(e.target.value)}
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
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!name || !description || !category}
        >
          Crear Círculo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  userStats,
  isConnected,
  onCreateCircle,
  onJoinCircle,
}) => {
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [circles, setCircles] = useState(mockCircles);

  const handleJoinCircle = (circleId: string) => {
    setCircles(prev =>
      prev.map(c => (c.id === circleId ? { ...c, isJoined: true } : c))
    );
    onJoinCircle(circleId);
  };

  const handleViewCircle = (circleId: string) => {
    console.log(`Ver detalles del círculo ${circleId}`);
  };

  const handleCreateCircle = () => {
    setOpenCreate(true);
    onCreateCircle();
  };

  return (
    <Box>
      {/* 📊 TARJETA DE RESUMEN */}
      <Paper sx={{ ...UNIFIED_CARD_STYLE, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold">
              Explora Círculos de Colaboración Creativa
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Conecta con otros miembros de CoomÜnity para co-crear proyectos,
              compartir conocimiento y generar impacto positivo juntos.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreateCircle}
            >
              Crear Nuevo Círculo
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 🎨 LISTA DE CÍRCULOS */}
      <Grid container spacing={3}>
        {circles.map(circle => (
          <Grid item xs={12} md={6} lg={4} key={circle.id}>
            <CircleCard
              circle={circle}
              onJoin={handleJoinCircle}
              onView={handleViewCircle}
            />
          </Grid>
        ))}
      </Grid>

      {/* 🚀 MODAL PARA CREAR CÍRCULO */}
      <CreateCircleDialog open={openCreate} onClose={() => setOpenCreate(false)} />
    </Box>
  );
};
