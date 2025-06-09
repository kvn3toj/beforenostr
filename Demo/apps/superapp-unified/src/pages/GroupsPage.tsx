/**
 * 👥 Página de Grupos (CoPs - Comunidades de Práctica)
 * 
 * Funcionalidades principales:
 * - Listado de grupos públicos y privados
 * - Crear nuevos grupos
 * - Unirse/salir de grupos
 * - Ver detalles y miembros
 * - Gestión de contenido del grupo
 * - Integración con sistema de mëritos CoomÜnity
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
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
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Alert,
  Skeleton,
  Container,
  Fab,
  Menu,
  Tooltip,
  Paper,
  Stack,
  AvatarGroup,
  LinearProgress,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Groups as GroupsIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Person as PersonIcon,
  ExitToApp as LeaveIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  Message as MessageIcon,
  Event as EventIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  BookmarkAdd as JoinIcon,
  BookmarkRemove as UnjoinIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  LocalFireDepartment as PopularIcon,
} from '@mui/icons-material';

// Hooks
import { useGroupsData, useJoinGroup, useLeaveGroup, useCreateGroup } from '../hooks/useRealBackendData';

// Tipos
interface Group {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'secret';
  category: string;
  memberCount: number;
  maxMembers?: number;
  isJoined: boolean;
  isOwner: boolean;
  isModerator: boolean;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  lastActivity: string;
  tags: string[];
  level: number; // Nivel basado en actividad y mëritos
  merits: number; // Mëritos generados por el grupo
  posts: number;
  events: number;
  isActive: boolean;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  recentMembers: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

interface GroupFormData {
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  tags: string[];
  maxMembers: number;
  rules: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Datos mock para desarrollo
const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Emprendedores Conscientes',
    description: 'Comunidad de emprendedores enfocados en el Bien Común y la Economía Colaborativa. Compartimos experiencias, recursos y colaboramos en proyectos que generen impacto positivo.',
    type: 'public',
    category: 'Emprendimiento',
    memberCount: 156,
    maxMembers: 500,
    isJoined: true,
    isOwner: false,
    isModerator: false,
    avatar: '/assets/images/groups/emprendedores.jpg',
    createdAt: '2024-12-01T10:00:00Z',
    lastActivity: '2025-01-22T15:30:00Z',
    tags: ['emprendimiento', 'bien común', 'colaboración', 'ayni'],
    level: 5,
    merits: 2840,
    posts: 234,
    events: 12,
    isActive: true,
    owner: {
      id: 'user-1',
      name: 'María González',
      avatar: '/assets/images/avatars/maria.jpg'
    },
    recentMembers: [
      { id: 'user-2', name: 'Carlos López', avatar: '/assets/images/avatars/carlos.jpg' },
      { id: 'user-3', name: 'Ana Martínez', avatar: '/assets/images/avatars/ana.jpg' },
      { id: 'user-4', name: 'Pedro Sánchez', avatar: '/assets/images/avatars/pedro.jpg' },
    ]
  },
  {
    id: 'group-2',
    name: 'Tecnología para el Bien Común',
    description: 'Desarrolladores, diseñadores y tecnólogos unidos para crear soluciones que beneficien a la humanidad. Enfoque en open source y tecnologías regenerativas.',
    type: 'public',
    category: 'Tecnología',
    memberCount: 89,
    isJoined: false,
    isOwner: false,
    isModerator: false,
    avatar: '/assets/images/groups/tech.jpg',
    createdAt: '2024-11-15T08:00:00Z',
    lastActivity: '2025-01-22T12:45:00Z',
    tags: ['tecnología', 'open source', 'desarrollo', 'innovación'],
    level: 3,
    merits: 1560,
    posts: 145,
    events: 8,
    isActive: true,
    owner: {
      id: 'user-5',
      name: 'Luis Rodríguez',
      avatar: '/assets/images/avatars/luis.jpg'
    },
    recentMembers: [
      { id: 'user-6', name: 'Sandra Torres', avatar: '/assets/images/avatars/sandra.jpg' },
      { id: 'user-7', name: 'Miguel Hernández', avatar: '/assets/images/avatars/miguel.jpg' },
    ]
  },
  {
    id: 'group-3',
    name: 'Ayni en Acción',
    description: 'Practicantes de la reciprocidad consciente. Organizamos intercambios, colaboraciones y proyectos basados en el principio ancestral del Ayni.',
    type: 'private',
    category: 'Filosofía',
    memberCount: 45,
    maxMembers: 100,
    isJoined: true,
    isOwner: true,
    isModerator: true,
    avatar: '/assets/images/groups/ayni.jpg',
    createdAt: '2024-10-20T16:00:00Z',
    lastActivity: '2025-01-22T09:15:00Z',
    tags: ['ayni', 'reciprocidad', 'filosofía', 'espiritualidad'],
    level: 4,
    merits: 1890,
    posts: 98,
    events: 15,
    isActive: true,
    owner: {
      id: 'user-current',
      name: 'Juan Manuel Escobar',
      avatar: '/assets/images/avatars/juan.jpg'
    },
    recentMembers: [
      { id: 'user-8', name: 'Carmen Díaz', avatar: '/assets/images/avatars/carmen.jpg' },
      { id: 'user-9', name: 'Roberto Silva', avatar: '/assets/images/avatars/roberto.jpg' },
    ]
  }
];

const categories = [
  'Todos',
  'Emprendimiento',
  'Tecnología', 
  'Filosofía',
  'Arte y Creatividad',
  'Educación',
  'Sostenibilidad',
  'Salud y Bienestar',
  'Economía Colaborativa',
  'Desarrollo Personal'
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`groups-tabpanel-${index}`}
      aria-labelledby={`groups-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const GroupsPage: React.FC = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    type: 'public',
    category: 'Emprendimiento',
    tags: [],
    maxMembers: 100,
    rules: ''
  });

  // Estados de feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Hooks del backend (con fallback a datos mock)
  const {
    data: groupsData,
    isLoading: groupsLoading,
    isError: groupsError,
    refetch: refetchGroups
  } = useGroupsData();

  const joinGroupMutation = useJoinGroup();
  const leaveGroupMutation = useLeaveGroup();
  const createGroupMutation = useCreateGroup();

  // Usar datos mock si no hay datos del backend
  // El hook useGroupsData devuelve un objeto con la propiedad 'groups'
  const groups = groupsData?.groups || mockGroups;

  // Asegurar que groups sea siempre un array
  const safeGroups = Array.isArray(groups) ? groups : mockGroups;

  // Filtrar grupos según criterios
  const filteredGroups = safeGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || group.category === selectedCategory;
    
    switch (activeTab) {
      case 0: // Todos los grupos
        return matchesSearch && matchesCategory;
      case 1: // Mis grupos
        return matchesSearch && matchesCategory && group.isJoined;
      case 2: // Grupos populares
        return matchesSearch && matchesCategory && group.memberCount > 50;
      default:
        return matchesSearch && matchesCategory;
    }
  });

  // Manejar unirse a grupo
  const handleJoinGroup = useCallback(async (groupId: string) => {
    try {
      await joinGroupMutation.mutateAsync(groupId);
      setSnackbar({
        open: true,
        message: '¡Te has unido al grupo exitosamente! 🎉',
        severity: 'success'
      });
      refetchGroups();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al unirse al grupo. Inténtalo de nuevo.',
        severity: 'error'
      });
    }
  }, [joinGroupMutation, refetchGroups]);

  // Manejar salir de grupo
  const handleLeaveGroup = useCallback(async (groupId: string) => {
    try {
      await leaveGroupMutation.mutateAsync(groupId);
      setSnackbar({
        open: true,
        message: 'Has salido del grupo',
        severity: 'info'
      });
      refetchGroups();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al salir del grupo. Inténtalo de nuevo.',
        severity: 'error'
      });
    }
  }, [leaveGroupMutation, refetchGroups]);

  // Manejar crear grupo
  const handleCreateGroup = useCallback(async () => {
    try {
      await createGroupMutation.mutateAsync(formData);
      setSnackbar({
        open: true,
        message: '¡Grupo creado exitosamente! 🎉',
        severity: 'success'
      });
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        type: 'public',
        category: 'Emprendimiento',
        tags: [],
        maxMembers: 100,
        rules: ''
      });
      refetchGroups();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al crear el grupo. Inténtalo de nuevo.',
        severity: 'error'
      });
    }
  }, [createGroupMutation, formData, refetchGroups]);

  // Render de tarjeta de grupo
  const renderGroupCard = (group: Group) => (
    <Card
      key={group.id}
      data-testid="group-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        border: group.isJoined ? '2px solid' : '1px solid',
        borderColor: group.isJoined ? 'primary.main' : 'divider',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header del grupo */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={group.avatar}
            data-testid="group-avatar"
            sx={{ width: 56, height: 56, mr: 2 }}
          >
            <GroupsIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
                {group.name}
              </Typography>
              {group.type === 'private' && <PrivateIcon sx={{ ml: 1, fontSize: 16 }} />}
              {group.type === 'public' && <PublicIcon sx={{ ml: 1, fontSize: 16 }} />}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={group.category}
                data-testid="group-category"
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<TrophyIcon />}
                label={`Nv.${group.level}`}
                data-testid="group-level"
                size="small"
                color="warning"
              />
            </Box>
          </Box>
          <IconButton
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setSelectedGroup(group);
            }}
            size="small"
          >
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            lineHeight: 1.4,
          }}
        >
          {group.description}
        </Typography>

        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" data-testid="group-members-count">
                {group.memberCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Miembros
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="secondary">
                {group.posts}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {group.merits}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mëritos
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Miembros recientes */}
        {group.recentMembers && group.recentMembers.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AvatarGroup max={4} sx={{ mr: 1 }}>
              {group.recentMembers.map((member) => (
                <Avatar
                  key={member.id}
                  src={member.avatar}
                  sx={{ width: 24, height: 24 }}
                  title={member.name}
                />
              ))}
            </AvatarGroup>
            <Typography variant="caption" color="text.secondary">
              +otros
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {group.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
            {group.tags.length > 3 && (
              <Chip
                label={`+${group.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
          <Button
            onClick={() => {
              setSelectedGroup(group);
              setShowGroupDetails(true);
            }}
            data-testid="view-group-button"
            variant="outlined"
            startIcon={<ViewIcon />}
            size="small"
            sx={{ flexGrow: 1 }}
          >
            Ver Detalles
          </Button>
          
          {group.isJoined ? (
            <Tooltip title="Salir del grupo">
              <IconButton
                onClick={() => handleLeaveGroup(group.id)}
                data-testid="leave-group-button"
                color="error"
                disabled={leaveGroupMutation.isPending}
              >
                <UnjoinIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              onClick={() => handleJoinGroup(group.id)}
              data-testid="join-group-button"
              variant="contained"
              startIcon={<JoinIcon />}
              size="small"
              disabled={joinGroupMutation.isPending}
              sx={{ flexShrink: 0 }}
            >
              Unirse
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );

  // Render principal
  return (
    <Container maxWidth="xl" sx={{ py: 3 }} data-testid="groups-page-content">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Comunidades de Práctica
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          👥 Colabora, aprende y crece con otros emprendedores
        </Typography>

        {/* Barra de búsqueda y filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="groups-search-input"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flexGrow: 1, minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              data-testid="category-filter"
              label="Categoría"
              startAdornment={<FilterIcon sx={{ mr: 1 }} />}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabs de navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Explorar Grupos"
              icon={<Badge badgeContent={safeGroups.length} color="primary"><PublicIcon /></Badge>}
              iconPosition="start"
            />
            <Tab
              label="Mis Grupos"
              icon={<Badge badgeContent={safeGroups.filter(g => g.isJoined).length} color="secondary"><PersonIcon /></Badge>}
              iconPosition="start"
            />
            <Tab
              label="Populares"
              icon={<PopularIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Box>

      {/* Contenido de las tabs */}
      <TabPanel value={activeTab} index={0}>
        {/* Todos los grupos */}
        {groupsLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                    <Skeleton variant="text" height={40} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : groupsError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error al cargar los grupos. Mostrando datos de ejemplo.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredGroups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                {renderGroupCard(group)}
              </Grid>
            ))}
          </Grid>
        )}

        {filteredGroups.length === 0 && !groupsLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron grupos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Intenta ajustar tus filtros de búsqueda o crea un nuevo grupo
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
            >
              Crear Grupo
            </Button>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Mis grupos */}
        <Grid container spacing={3}>
          {filteredGroups.filter(g => g.isJoined).map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              {renderGroupCard(group)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {/* Grupos populares */}
        <Grid container spacing={3}>
          {filteredGroups.filter(g => g.memberCount > 50).map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              {renderGroupCard(group)}
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Botón flotante para crear grupo */}
      <Fab
        color="primary"
        aria-label="crear grupo"
        data-testid="create-group-button"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setShowCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialog para crear grupo */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        data-testid="create-group-modal"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupsIcon sx={{ mr: 2 }} />
            Crear Nuevo Grupo CoP
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              label="Nombre del Grupo"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              data-testid="group-name-input"
              fullWidth
              required
              placeholder="Ej: Emprendedores Conscientes"
            />
            
            <TextField
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              data-testid="group-description-input"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Describe el propósito y objetivos de tu grupo..."
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    label="Categoría"
                  >
                    {categories.slice(1).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Máximo de Miembros"
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 100 }))}
                  fullWidth
                  inputProps={{ min: 10, max: 1000 }}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.type === 'private'}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    type: e.target.checked ? 'private' : 'public' 
                  }))}
                />
              }
              label="Grupo Privado (requiere aprobación para unirse)"
            />

            <TextField
              label="Reglas del Grupo (Opcional)"
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              fullWidth
              multiline
              rows={2}
              placeholder="Define las reglas y lineamientos de tu grupo..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateGroup}
            data-testid="save-group-button"
            variant="contained"
            disabled={!formData.name || !formData.description || createGroupMutation.isPending}
            startIcon={createGroupMutation.isPending ? <CircularProgress size={16} /> : <AddIcon />}
          >
            Crear Grupo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setShowGroupDetails(true);
          setAnchorEl(null);
        }}>
          <ViewIcon sx={{ mr: 2 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ShareIcon sx={{ mr: 2 }} />
          Compartir
        </MenuItem>
        {selectedGroup?.isJoined && (
          <MenuItem onClick={() => {
            if (selectedGroup) handleLeaveGroup(selectedGroup.id);
            setAnchorEl(null);
          }}>
            <LeaveIcon sx={{ mr: 2 }} />
            Salir del Grupo
          </MenuItem>
        )}
      </Menu>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Indicador de progreso para mutaciones */}
      {(joinGroupMutation.isPending || leaveGroupMutation.isPending || createGroupMutation.isPending) && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
          }}
        />
      )}
    </Container>
  );
};

export default GroupsPage; 