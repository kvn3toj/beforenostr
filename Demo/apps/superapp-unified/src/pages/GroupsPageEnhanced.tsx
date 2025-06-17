/**
 * 👥 Página de Grupos (CoPs - Comunidades de Práctica) Mejorada
 *
 * Funcionalidades CoomÜnity:
 * - Listado de grupos con métricas Ayni
 * - Sistema de reciprocidad y colaboración
 * - Herramientas avanzadas de colaboración
 * - Métricas de impacto en el Bien Común
 * - Intercambio de saberes y mentorías
 * - Proyectos colaborativos integrados
 * - Elementos en equilibrio (Aire, Agua, Tierra, Fuego)
 * - Certificaciones y reconocimientos
 */

import React, { useState, useCallback } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Groups as GroupsIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Person as PersonIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  Event as EventIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  BookmarkAdd as JoinIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  LocalFireDepartment as PopularIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  HandshakeOutlined as HandshakeIcon,
  VolunteerActivism as ImpactIcon,
  AutoAwesome as MeritosIcon,
  Waves as OndasIcon,
  Diversity3 as CollaborationIcon,
  School as MentoringIcon,
  Assignment as ProjectsIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';

// Hooks actualizados
import {
  useEnhancedGroupsData,
  useJoinEnhancedGroup,
  useCreateEnhancedGroup,
  type EnhancedGroup,
  type GroupCreationData,
} from '../hooks/useEnhancedGroupsData';

// Componentes mejorados CoomÜnity
import { GroupsAyniMetrics } from '../components/modules/social/components/enhanced/GroupsAyniMetrics';
import { GroupsCollaborationTools } from '../components/modules/social/components/enhanced/GroupsCollaborationTools';

// Interfaces mejoradas para grupos CoomÜnity
interface EnhancedGroupFormData {
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  tags: string[];
  maxMembers: number;
  rules: string;
  enfoqueBienComun: string;
  objetivosAyni: string[];
  especialidadesRequeridas: string[];
}

interface GroupFilterOptions {
  ayniBalance: 'all' | 'high' | 'medium' | 'low';
  impactLevel: 'all' | 'alto' | 'medio' | 'bajo';
  collaborationLevel:
    | 'all'
    | 'guardianes'
    | 'tejedores'
    | 'sembradores'
    | 'iniciados';
  hasProjects: boolean | null;
  hasMentoring: boolean | null;
  hasEvents: boolean | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const categories = [
  'Todos',
  'Emprendimiento Consciente',
  'Tecnología Regenerativa',
  'Sabiduría Ancestral',
  'Arte Sagrado y Creatividad',
  'Educación Transformadora',
  'Sostenibilidad y Regeneración',
  'Sanación Integral',
  'Economía Colaborativa',
  'Desarrollo del Ser',
  'Comunidades de Práctica',
  'Gobernanza Consciente',
  'Círculos de Ayni',
  'Medicina Ancestral',
  'Permacultura y Bioconstrucción',
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

const GroupsPageEnhanced: React.FC = () => {
  const theme = useTheme();

  // Estados principales mejorados
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<EnhancedGroup | null>(
    null
  );
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showCollaborationTools, setShowCollaborationTools] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedMetrics, setExpandedMetrics] = useState<string | null>(null);

  // Filtros avanzados CoomÜnity
  const [filters, setFilters] = useState<GroupFilterOptions>({
    ayniBalance: 'all',
    impactLevel: 'all',
    collaborationLevel: 'all',
    hasProjects: null,
    hasMentoring: null,
    hasEvents: null,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Estados del formulario mejorado
  const [formData, setFormData] = useState<EnhancedGroupFormData>({
    name: '',
    description: '',
    type: 'public',
    category: 'Emprendimiento Consciente',
    tags: [],
    maxMembers: 100,
    rules: '',
    enfoqueBienComun: '',
    objetivosAyni: [],
    especialidadesRequeridas: [],
  });

  // Estados de feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Hooks mejorados para datos CoomÜnity
  const {
    data: enhancedGroupsData,
    isLoading: groupsLoading,
    isError: groupsError,
    refetch: refetchGroups,
  } = useEnhancedGroupsData();

  const joinGroupMutation = useJoinEnhancedGroup();
  const createGroupMutation = useCreateEnhancedGroup();

  // Usar datos mejorados del hook
  const groups = enhancedGroupsData?.groups || [];
  const safeGroups = Array.isArray(groups) ? groups : [];

  // Filtrar grupos según criterios CoomÜnity mejorados
  const filteredGroups = safeGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'Todos' || group.category === selectedCategory;

    // Filtros avanzados CoomÜnity
    const matchesAyniBalance =
      filters.ayniBalance === 'all' ||
      (filters.ayniBalance === 'high' &&
        group.ayniMetrics.ayniBalance >= 0.8) ||
      (filters.ayniBalance === 'medium' &&
        group.ayniMetrics.ayniBalance >= 0.6 &&
        group.ayniMetrics.ayniBalance < 0.8) ||
      (filters.ayniBalance === 'low' && group.ayniMetrics.ayniBalance < 0.6);

    const matchesImpactLevel =
      filters.impactLevel === 'all' ||
      group.impactMetrics.categoriaImpacto === filters.impactLevel;

    const matchesCollaborationLevel =
      filters.collaborationLevel === 'all' ||
      group.collaborationMetrics.nivelColaboracion
        .toLowerCase()
        .includes(filters.collaborationLevel.toLowerCase());

    const matchesProjects =
      filters.hasProjects === null ||
      (filters.hasProjects &&
        group.collaborationMetrics.proyectosActivos > 0) ||
      (!filters.hasProjects &&
        group.collaborationMetrics.proyectosActivos === 0);

    const matchesMentoring =
      filters.hasMentoring === null ||
      (filters.hasMentoring &&
        group.collaborationMetrics.mentoriasActivas > 0) ||
      (!filters.hasMentoring &&
        group.collaborationMetrics.mentoriasActivas === 0);

    const matchesEvents =
      filters.hasEvents === null ||
      (filters.hasEvents && group.events > 0) ||
      (!filters.hasEvents && group.events === 0);

    // Aplicar filtro de tab
    let tabFilter = true;
    switch (activeTab) {
      case 0: // Todos los grupos
        tabFilter = true;
        break;
      case 1: // Mis grupos
        tabFilter = group.isJoined;
        break;
      case 2: // Grupos con alto Ayni
        tabFilter = group.ayniMetrics.ayniBalance >= 0.8;
        break;
      case 3: // Grupos de alto impacto
        tabFilter = group.impactMetrics.categoriaImpacto === 'alto';
        break;
      default:
        tabFilter = true;
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAyniBalance &&
      matchesImpactLevel &&
      matchesCollaborationLevel &&
      matchesProjects &&
      matchesMentoring &&
      matchesEvents &&
      tabFilter
    );
  });

  // Manejar unirse a grupo con métricas Ayni
  const handleJoinGroup = useCallback(
    async (groupId: string) => {
      try {
        await joinGroupMutation.mutateAsync(groupId);
        setSnackbar({
          open: true,
          message: '¡Te has unido al grupo y fortalecido el tejido Ayni! 🤝✨',
          severity: 'success',
        });
        refetchGroups();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al unirse al grupo. Inténtalo de nuevo.',
          severity: 'error',
        });
      }
    },
    [joinGroupMutation, refetchGroups]
  );

  // Manejar crear grupo CoomÜnity
  const handleCreateGroup = useCallback(async () => {
    try {
      const groupCreationData: GroupCreationData = {
        ...formData,
        enfoqueBienComun: formData.enfoqueBienComun,
        objetivosAyni: formData.objetivosAyni,
        especialidadesRequeridas: formData.especialidadesRequeridas,
      };

      await createGroupMutation.mutateAsync(groupCreationData);
      setSnackbar({
        open: true,
        message: '¡Nuevo círculo de colaboración creado con éxito! 🌟',
        severity: 'success',
      });
      setShowCreateDialog(false);
      setFormData({
        name: '',
        description: '',
        type: 'public',
        category: 'Emprendimiento Consciente',
        tags: [],
        maxMembers: 100,
        rules: '',
        enfoqueBienComun: '',
        objetivosAyni: [],
        especialidadesRequeridas: [],
      });
      refetchGroups();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al crear el grupo. Inténtalo de nuevo.',
        severity: 'error',
      });
    }
  }, [createGroupMutation, formData, refetchGroups]);

  // Manejar filtros avanzados
  const handleFilterChange = (
    filterKey: keyof GroupFilterOptions,
    value: any
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // Render mejorado de tarjeta de grupo con filosofía CoomÜnity
  const renderEnhancedGroupCard = (group: EnhancedGroup) => (
    <Card
      key={group.id}
      data-testid="group-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        background: group.isJoined
          ? `linear-gradient(135deg, ${alpha('#E91E63', 0.02)} 0%, ${alpha('#9C27B0', 0.02)} 100%)`
          : 'background.paper',
        border: group.isJoined ? '2px solid' : '1px solid',
        borderColor: group.isJoined ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header del grupo con indicadores Ayni */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={group.avatar}
            data-testid="group-avatar"
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              background: `linear-gradient(45deg, ${alpha('#E91E63', 0.1)}, ${alpha('#9C27B0', 0.1)})`,
            }}
          >
            <GroupsIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
                {group.name}
              </Typography>
              {group.type === 'private' && (
                <PrivateIcon sx={{ ml: 1, fontSize: 16 }} />
              )}
              {group.type === 'public' && (
                <PublicIcon sx={{ ml: 1, fontSize: 16 }} />
              )}
              {group.ayniMetrics.ayniBalance >= 0.9 && (
                <Tooltip title="Excelente balance Ayni">
                  <HandshakeIcon
                    sx={{ ml: 1, fontSize: 16, color: 'success.main' }}
                  />
                </Tooltip>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                label={group.category}
                data-testid="group-category"
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<TrophyIcon />}
                label={group.collaborationMetrics.nivelColaboracion}
                data-testid="group-level"
                size="small"
                color="warning"
                sx={{ fontSize: '0.7rem' }}
              />
              {group.impactMetrics.categoriaImpacto === 'alto' && (
                <Chip
                  icon={<ImpactIcon />}
                  label="Alto Impacto"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
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

        {/* Métricas CoomÜnity principales */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid size={{xs:3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                color="primary"
                data-testid="group-members-count"
              >
                {group.memberCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Miembros
              </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {group.meritos}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mëritos
              </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {group.ondas}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Öndas
              </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="secondary.main">
                {Math.round(group.ayniMetrics.ayniBalance * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ayni
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progreso de balance Ayni */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="caption" fontWeight="bold">
              Balance Ayni
            </Typography>
            <Typography
              variant="caption"
              color={
                group.ayniMetrics.ayniBalance >= 0.8
                  ? 'success.main'
                  : group.ayniMetrics.ayniBalance >= 0.6
                    ? 'warning.main'
                    : 'error.main'
              }
            >
              {group.ayniMetrics.ayniTrend === 'increasing' && '📈 Creciendo'}
              {group.ayniMetrics.ayniTrend === 'stable' && '➡️ Estable'}
              {group.ayniMetrics.ayniTrend === 'decreasing' &&
                '📉 Necesita atención'}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={group.ayniMetrics.ayniBalance * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha('#E91E63', 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, #E91E63, #9C27B0)`,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Miembros recientes con niveles */}
        {group.recentMembers && group.recentMembers.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AvatarGroup max={4} sx={{ mr: 1 }}>
              {group.recentMembers.map((member) => (
                <Tooltip
                  key={member.id}
                  title={`${member.name} - ${member.nivel || 'Miembro'}`}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 28,
                      height: 28,
                      border: member.nivel?.includes('Guardián')
                        ? '2px solid gold'
                        : member.nivel?.includes('Tejedor')
                          ? '2px solid silver'
                          : 'none',
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            <Typography variant="caption" color="text.secondary">
              +{group.memberCount - group.recentMembers.length} más
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
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
              Explorar
            </Button>

            {group.isJoined ? (
              <Button
                onClick={() => {
                  setSelectedGroup(group);
                  setShowCollaborationTools(true);
                }}
                variant="contained"
                startIcon={<CollaborationIcon />}
                size="small"
                color="secondary"
                sx={{ flexGrow: 1 }}
              >
                Colaborar
              </Button>
            ) : (
              <Button
                onClick={() => handleJoinGroup(group.id)}
                data-testid="join-group-button"
                variant="contained"
                startIcon={<JoinIcon />}
                size="small"
                disabled={joinGroupMutation.isPending}
                sx={{
                  flexGrow: 1,
                  background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
                  },
                }}
              >
                Unirse
              </Button>
            )}
          </Box>

          <Button
            onClick={() =>
              setExpandedMetrics(expandedMetrics === group.id ? null : group.id)
            }
            variant="text"
            size="small"
            startIcon={
              expandedMetrics === group.id ? (
                <ExpandMoreIcon />
              ) : (
                <TrendingIcon />
              )
            }
            sx={{
              fontSize: '0.7rem',
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha('#E91E63', 0.05) },
            }}
          >
            {expandedMetrics === group.id
              ? 'Ocultar métricas'
              : 'Ver métricas Ayni'}
          </Button>
        </Stack>
      </CardActions>

      {/* Métricas expandidas */}
      {expandedMetrics === group.id && (
        <Box sx={{ px: 2, pb: 2 }}>
          <GroupsAyniMetrics
            groupData={{
              id: group.id,
              name: group.name,
              ayniBalance: group.ayniMetrics.ayniBalance,
              ayniGiving: group.ayniMetrics.ayniGiving,
              ayniReceiving: group.ayniMetrics.ayniReceiving,
              meritos: group.meritos,
              ondas: group.ondas,
              impactoBienComun: group.impactMetrics.impactoBienComun,
              nivelColaboracion: group.collaborationMetrics.nivelColaboracion,
              elementos: group.elementos,
              proyectosActivos: group.collaborationMetrics.proyectosActivos,
              intercambiosAyni: group.ayniMetrics.ayniExchanges,
              miembrosActivos: group.collaborationMetrics.miembrosActivos,
              crecimientoSemanal: Math.random() * 10,
              fechaCreacion: group.createdAt,
              proximoEvento: group.proximoEvento?.titulo,
              categoriaImpacto: group.impactMetrics.categoriaImpacto,
              especialidades: group.collaborationMetrics.especialidades,
            }}
            showCompactView={true}
          />
        </Box>
      )}
    </Card>
  );

  // Render principal
  return (
    <Container maxWidth="xl" sx={{ py: 3 }} data-testid="groups-page-content">
      {/* Header mejorado */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: '#E91E63',
              background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
              width: 56,
              height: 56,
            }}
          >
            <GroupsIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Comunidades de Práctica CoomÜnity
            </Typography>
            <Typography variant="h6" color="text.secondary">
              🤝 Espacios de reciprocidad, colaboración y crecimiento mutuo
            </Typography>
          </Box>
        </Stack>

        {/* Barra de búsqueda y filtros mejorados */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 2, flexWrap: 'wrap' }}
            useFlexGap
          >
            <TextField
              placeholder="Buscar por nombre, descripción o etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="groups-search-input"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 300 }}
            />

            <FormControl sx={{ minWidth: 200 }}>
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

            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Filtros Ayni
            </Button>
          </Stack>

          {/* Filtros avanzados CoomÜnity */}
          {showAdvancedFilters && (
            <Accordion expanded>
              <AccordionSummary>
                <Typography variant="subtitle1" fontWeight="bold">
                  🎯 Filtros Avanzados CoomÜnity
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{xs:12,md:6}}>
                    <FormControl fullWidth>
                      <InputLabel>Balance Ayni</InputLabel>
                      <Select
                        value={filters.ayniBalance}
                        onChange={(e) =>
                          handleFilterChange('ayniBalance', e.target.value)
                        }
                        label="Balance Ayni"
                      >
                        <MenuItem value="all">Todos los niveles</MenuItem>
                        <MenuItem value="high">Alto (80%+)</MenuItem>
                        <MenuItem value="medium">Medio (60-80%)</MenuItem>
                        <MenuItem value="low">En desarrollo (&lt;60%)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{xs:12,md:6}}>
                    <FormControl fullWidth>
                      <InputLabel>Impacto Bien Común</InputLabel>
                      <Select
                        value={filters.impactLevel}
                        onChange={(e) =>
                          handleFilterChange('impactLevel', e.target.value)
                        }
                        label="Impacto Bien Común"
                      >
                        <MenuItem value="all">Todos los niveles</MenuItem>
                        <MenuItem value="alto">Alto impacto</MenuItem>
                        <MenuItem value="medio">Impacto moderado</MenuItem>
                        <MenuItem value="bajo">Impacto en desarrollo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{xs:12,md:4}}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.hasProjects === true}
                          onChange={(e) =>
                            handleFilterChange(
                              'hasProjects',
                              e.target.checked ? true : null
                            )
                          }
                        />
                      }
                      label="Con proyectos activos"
                    />
                  </Grid>
                  <Grid size={{xs:12,md:4}}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.hasMentoring === true}
                          onChange={(e) =>
                            handleFilterChange(
                              'hasMentoring',
                              e.target.checked ? true : null
                            )
                          }
                        />
                      }
                      label="Con mentorías"
                    />
                  </Grid>
                  <Grid size={{xs:12,md:4}}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.hasEvents === true}
                          onChange={(e) =>
                            handleFilterChange(
                              'hasEvents',
                              e.target.checked ? true : null
                            )
                          }
                        />
                      }
                      label="Con eventos próximos"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>

        {/* Tabs de navegación mejoradas */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Explorar Todos"
              icon={
                <Badge badgeContent={safeGroups.length} color="primary">
                  <PublicIcon />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Mis Círculos"
              icon={
                <Badge
                  badgeContent={safeGroups.filter((g) => g.isJoined).length}
                  color="secondary"
                >
                  <PersonIcon />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Alto Ayni"
              icon={
                <Badge
                  badgeContent={
                    safeGroups.filter((g) => g.ayniMetrics.ayniBalance >= 0.8)
                      .length
                  }
                  color="success"
                >
                  <HandshakeIcon />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Alto Impacto"
              icon={
                <Badge
                  badgeContent={
                    safeGroups.filter(
                      (g) => g.impactMetrics.categoriaImpacto === 'alto'
                    ).length
                  }
                  color="info"
                >
                  <ImpactIcon />
                </Badge>
              }
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
              <Grid size={{xs:12,sm:6,md:4}} key={index}>
                <Card sx={{ height: 450 }}>
                  <CardContent>
                    <Skeleton
                      variant="circular"
                      width={56}
                      height={56}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                    <Skeleton
                      variant="rectangular"
                      height={80}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="text" height={40} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : groupsError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Conectando con el backend... Mostrando datos de demostración con
            filosofía CoomÜnity.
          </Alert>
        ) : null}

        <Grid container spacing={3}>
          {filteredGroups.map((group) => (
            <Grid size={{xs:12,sm:6,md:4}} key={group.id}>
              {renderEnhancedGroupCard(group)}
            </Grid>
          ))}
        </Grid>

        {filteredGroups.length === 0 && !groupsLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron círculos de colaboración
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajusta tus filtros o crea un nuevo círculo para el Bien Común
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                '&:hover': {
                  background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
                },
              }}
            >
              Crear Círculo de Colaboración
            </Button>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {filteredGroups.map((group) => (
            <Grid size={{xs:12,sm:6,md:4}} key={group.id}>
              {renderEnhancedGroupCard(group)}
            </Grid>
          ))}
        </Grid>

        {filteredGroups.length === 0 && !groupsLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no te has unido a ningún círculo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Explora los círculos disponibles y únete a los que resuenen con tu
              propósito
            </Typography>
            <Button
              variant="contained"
              startIcon={<JoinIcon />}
              onClick={() => setActiveTab(0)}
              sx={{
                background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                '&:hover': {
                  background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
                },
              }}
            >
              Explorar Círculos
            </Button>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {filteredGroups.map((group) => (
            <Grid size={{xs:12,sm:6,md:4}} key={group.id}>
              {renderEnhancedGroupCard(group)}
            </Grid>
          ))}
        </Grid>

        {filteredGroups.length === 0 && !groupsLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <HandshakeIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay círculos con alto nivel de Ayni
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Los círculos con balance de reciprocidad superior al 80%
              aparecerán aquí
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                '&:hover': {
                  background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
                },
              }}
            >
              Crear Círculo Ayni
            </Button>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          {filteredGroups.map((group) => (
            <Grid size={{xs:12,sm:6,md:4}} key={group.id}>
              {renderEnhancedGroupCard(group)}
            </Grid>
          ))}
        </Grid>

        {filteredGroups.length === 0 && !groupsLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ImpactIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay círculos de alto impacto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Los círculos con categoría de impacto "alto" aparecerán aquí
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                '&:hover': {
                  background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
                },
              }}
            >
              Crear Círculo de Impacto
            </Button>
          </Paper>
        )}
      </TabPanel>

      {/* Botón flotante para crear grupo */}
      <Fab
        color="primary"
        aria-label="crear círculo"
        data-testid="create-group-button"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
          '&:hover': {
            background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
          },
        }}
        onClick={() => setShowCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialog mejorado para crear grupo */}
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
            Crear Nuevo Círculo de Colaboración CoomÜnity
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              label="Nombre del Círculo"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              data-testid="group-name-input"
              fullWidth
              required
              placeholder="Ej: Emprendedores Conscientes de Medellín"
            />

            <TextField
              label="Descripción y Propósito"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              data-testid="group-description-input"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Describe cómo este círculo contribuirá al Bien Común y qué tipo de colaboración buscan..."
            />

            <TextField
              label="Enfoque en el Bien Común"
              name="enfoqueBienComun"
              value={formData.enfoqueBienComun}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  enfoqueBienComun: e.target.value,
                }))
              }
              fullWidth
              multiline
              rows={2}
              placeholder="¿Cómo contribuirá este círculo específicamente al Bien Común de la comunidad?"
            />

            <Grid container spacing={2}>
              <Grid size={{xs:12,sm:6}}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
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

              <Grid size={{xs:12,sm:6}}>
                <TextField
                  label="Máximo de Miembros"
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxMembers: parseInt(e.target.value) || 100,
                    }))
                  }
                  fullWidth
                  inputProps={{ min: 5, max: 1000 }}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.type === 'private'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.checked ? 'private' : 'public',
                    }))
                  }
                />
              }
              label="Círculo Privado (requiere invitación o aprobación)"
            />

            <TextField
              label="Acuerdos y Lineamientos del Círculo"
              value={formData.rules}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rules: e.target.value }))
              }
              fullWidth
              multiline
              rows={2}
              placeholder="Define los acuerdos de convivencia y colaboración basados en el Ayni..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateGroup}
            data-testid="save-group-button"
            variant="contained"
            disabled={
              !formData.name ||
              !formData.description ||
              createGroupMutation.isPending
            }
            startIcon={
              createGroupMutation.isPending ? (
                <CircularProgress size={16} />
              ) : (
                <AddIcon />
              )
            }
            sx={{
              background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
              '&:hover': {
                background: `linear-gradient(45deg, #C2185B, #7B1FA2)`,
              },
            }}
          >
            Crear Círculo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para herramientas de colaboración */}
      <Dialog
        open={showCollaborationTools}
        onClose={() => setShowCollaborationTools(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CollaborationIcon sx={{ mr: 2 }} />
            Herramientas de Colaboración - {selectedGroup?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedGroup && (
            <GroupsCollaborationTools
              groupId={selectedGroup.id}
              groupName={selectedGroup.name}
              userRole={
                selectedGroup.isOwner
                  ? 'admin'
                  : selectedGroup.isModerator
                    ? 'moderator'
                    : 'member'
              }
              onCreateProject={(project) =>
                console.log('Create project:', project)
              }
              onJoinProject={(projectId) =>
                console.log('Join project:', projectId)
              }
              onCreateExchange={(exchange) =>
                console.log('Create exchange:', exchange)
              }
              onScheduleEvent={(event) => console.log('Schedule event:', event)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setShowGroupDetails(true);
            setAnchorEl(null);
          }}
        >
          <ViewIcon sx={{ mr: 2 }} />
          Ver Detalles Completos
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowCollaborationTools(true);
            setAnchorEl(null);
          }}
        >
          <CollaborationIcon sx={{ mr: 2 }} />
          Herramientas de Colaboración
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ShareIcon sx={{ mr: 2 }} />
          Compartir Círculo
        </MenuItem>
      </Menu>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Indicador de progreso para mutaciones */}
      {(joinGroupMutation.isPending || createGroupMutation.isPending) && (
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

export default GroupsPageEnhanced;
