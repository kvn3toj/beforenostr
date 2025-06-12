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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AvatarGroup,
} from '@mui/material';
import {
  Add,
  Groups,
  HandshakeOutlined,
  EmojiEvents,
  Star,
  People,
  Schedule,
  Assignment,
  Psychology,
  Engineering,
  ArrowForward,
  Favorite,
  Visibility,
  MoreVert,
  TrendingUp,
  Lightbulb,
  Forum,
  EventNote,
  Share,
  PersonAdd,
  GroupWork,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  Timer,
  Layers,
  LocalOffer,
  School,
  Business,
  ConnectWithoutContact,
  AutoAwesome,
  Diversity3,
  Sync,
  CampaignOutlined,
} from '@mui/icons-material';

interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  category:
    | 'ayni_exchange'
    | 'knowledge_sharing'
    | 'joint_venture'
    | 'mentoring'
    | 'community_service';
  status: 'planning' | 'active' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    contribution: string;
  }[];
  progress: number;
  startDate: string;
  endDate?: string;
  ayniExchanges: number;
  meritosGenerated: number;
  skillsNeeded: string[];
  skillsOffered: string[];
  nextMilestone: string;
  impact: 'local' | 'regional' | 'global';
}

interface KnowledgeExchange {
  id: string;
  title: string;
  type: 'workshop' | 'mentoring' | 'skill_swap' | 'consultation';
  offeringMember: {
    id: string;
    name: string;
    avatar: string;
    expertise: string[];
  };
  seekingMembers: string[];
  status: 'open' | 'matched' | 'in_progress' | 'completed';
  dateScheduled?: string;
  duration: string;
  format: 'virtual' | 'presencial' | 'hybrid';
  ayniValue: number;
  description: string;
}

interface GroupEvent {
  id: string;
  title: string;
  type:
    | 'meeting'
    | 'workshop'
    | 'celebration'
    | 'project_kickoff'
    | 'ayni_ceremony';
  date: string;
  duration: string;
  facilitator: string;
  attendees: number;
  maxAttendees?: number;
  description: string;
  materials?: string[];
  objectives: string[];
  isRecurring: boolean;
  location: string;
}

interface GroupsCollaborationToolsProps {
  groupId: string;
  groupName: string;
  userRole: 'member' | 'moderator' | 'admin';
  onCreateProject: (project: Partial<CollaborationProject>) => void;
  onJoinProject: (projectId: string) => void;
  onCreateExchange: (exchange: Partial<KnowledgeExchange>) => void;
  onScheduleEvent: (event: Partial<GroupEvent>) => void;
}

// 🎭 Datos mock para desarrollo
const mockProjects: CollaborationProject[] = [
  {
    id: 'proj-1',
    title: 'Huerto Urbano Comunitario',
    description:
      'Crear un espacio de cultivo urbano que beneficie a toda la comunidad, aplicando principios de permacultura y agricultura regenerativa.',
    category: 'community_service',
    status: 'active',
    priority: 'high',
    participants: [
      {
        id: 'user-1',
        name: 'Ana María',
        avatar: '/avatars/ana.jpg',
        role: 'Coordinadora',
        contribution: 'Conocimiento en permacultura',
      },
      {
        id: 'user-2',
        name: 'Carlos',
        avatar: '/avatars/carlos.jpg',
        role: 'Especialista técnico',
        contribution: 'Diseño de sistemas de riego',
      },
    ],
    progress: 65,
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    ayniExchanges: 23,
    meritosGenerated: 340,
    skillsNeeded: ['carpintería', 'diseño gráfico', 'gestión comunitaria'],
    skillsOffered: ['permacultura', 'sistemas de riego', 'compostaje'],
    nextMilestone: 'Preparación del terreno - 30 Jan',
    impact: 'local',
  },
  {
    id: 'proj-2',
    title: 'Plataforma de Intercambio de Saberes',
    description:
      'Desarrollo de una app móvil para conectar a personas que quieren intercambiar conocimientos y habilidades de manera equilibrada.',
    category: 'joint_venture',
    status: 'planning',
    priority: 'medium',
    participants: [
      {
        id: 'user-3',
        name: 'María Elena',
        avatar: '/avatars/maria.jpg',
        role: 'Product Owner',
        contribution: 'Experiencia en UX/UI',
      },
    ],
    progress: 25,
    startDate: '2025-02-01',
    ayniExchanges: 8,
    meritosGenerated: 120,
    skillsNeeded: ['desarrollo móvil', 'backend', 'marketing digital'],
    skillsOffered: ['diseño UX/UI', 'investigación de usuarios'],
    nextMilestone: 'Validación de concepto - 15 Feb',
    impact: 'regional',
  },
];

const mockExchanges: KnowledgeExchange[] = [
  {
    id: 'ex-1',
    title: 'Taller de Técnicas de Facilitación',
    type: 'workshop',
    offeringMember: {
      id: 'user-4',
      name: 'Roberto Silva',
      avatar: '/avatars/roberto.jpg',
      expertise: [
        'facilitación',
        'trabajo en equipo',
        'resolución de conflictos',
      ],
    },
    seekingMembers: [],
    status: 'open',
    dateScheduled: '2025-01-30T18:00:00',
    duration: '2 horas',
    format: 'hybrid',
    ayniValue: 25,
    description:
      'Aprende técnicas avanzadas de facilitación para reuniones más efectivas y armoniosas.',
  },
  {
    id: 'ex-2',
    title: 'Mentoría en Emprendimiento Sostenible',
    type: 'mentoring',
    offeringMember: {
      id: 'user-5',
      name: 'Carmen Díaz',
      avatar: '/avatars/carmen.jpg',
      expertise: ['emprendimiento', 'sostenibilidad', 'finanzas conscientes'],
    },
    seekingMembers: ['user-6', 'user-7'],
    status: 'matched',
    duration: '1 mes (sesiones semanales)',
    format: 'virtual',
    ayniValue: 50,
    description:
      'Mentoría personalizada para emprendedores que buscan crear impacto positivo.',
  },
];

const mockEvents: GroupEvent[] = [
  {
    id: 'event-1',
    title: 'Círculo de Ayni Mensual',
    type: 'ayni_ceremony',
    date: '2025-01-25T19:00:00',
    duration: '1.5 horas',
    facilitator: 'Ana María Rodríguez',
    attendees: 12,
    maxAttendees: 20,
    description:
      'Espacio sagrado para compartir, reflexionar y equilibrar nuestros intercambios de ayni.',
    objectives: [
      'Reflexionar sobre reciprocidad',
      'Planificar colaboraciones',
      'Fortalecer vínculos',
    ],
    isRecurring: true,
    location: 'Centro Comunitario La Esperanza',
  },
];

function CollaborationTabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`collaboration-tabpanel-${index}`}
      aria-labelledby={`collaboration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const GroupsCollaborationTools: React.FC<
  GroupsCollaborationToolsProps
> = ({
  groupId,
  groupName,
  userRole,
  onCreateProject,
  onJoinProject,
  onCreateExchange,
  onScheduleEvent,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createDialogType, setCreateDialogType] = useState<
    'project' | 'exchange' | 'event'
  >('project');

  // Estados para formularios
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'community_service' as const,
    skillsNeeded: [] as string[],
    skillsOffered: [] as string[],
    priority: 'medium' as const,
    endDate: '',
  });

  const [exchangeForm, setExchangeForm] = useState({
    title: '',
    description: '',
    type: 'workshop' as const,
    duration: '',
    format: 'virtual' as const,
    dateScheduled: '',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'meeting' as const,
    date: '',
    duration: '',
    location: '',
    maxAttendees: 20,
  });

  // 🎨 Función para obtener color según categoría de proyecto
  const getCategoryColor = (category: CollaborationProject['category']) => {
    switch (category) {
      case 'ayni_exchange':
        return '#E91E63';
      case 'knowledge_sharing':
        return '#9C27B0';
      case 'joint_venture':
        return '#3F51B5';
      case 'mentoring':
        return '#FF9800';
      case 'community_service':
        return '#4CAF50';
      default:
        return '#607D8B';
    }
  };

  const getCategoryLabel = (category: CollaborationProject['category']) => {
    switch (category) {
      case 'ayni_exchange':
        return 'Intercambio Ayni';
      case 'knowledge_sharing':
        return 'Compartir Conocimiento';
      case 'joint_venture':
        return 'Emprendimiento Conjunto';
      case 'mentoring':
        return 'Mentoría';
      case 'community_service':
        return 'Servicio Comunitario';
    }
  };

  // 🎯 Render de tarjeta de proyecto
  const renderProjectCard = (project: CollaborationProject) => (
    <Card
      key={project.id}
      sx={{
        height: '100%',
        border: `1px solid ${alpha(getCategoryColor(project.category), 0.2)}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Chip
            label={getCategoryLabel(project.category)}
            size="small"
            sx={{
              bgcolor: alpha(getCategoryColor(project.category), 0.1),
              color: getCategoryColor(project.category),
              fontWeight: 'bold',
            }}
          />
          <Chip
            label={project.status}
            size="small"
            color={project.status === 'active' ? 'success' : 'default'}
            variant="outlined"
          />
        </Stack>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {project.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {project.description}
        </Typography>

        {/* Progreso */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="body2" fontWeight="bold">
              Progreso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.progress}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(getCategoryColor(project.category), 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: getCategoryColor(project.category),
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Participantes */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="body2" fontWeight="bold">
              Colaboradores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.participants.length} participantes
            </Typography>
          </Stack>
          <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
            {project.participants.map((participant) => (
              <Tooltip
                key={participant.id}
                title={`${participant.name} - ${participant.role}`}
              >
                <Avatar src={participant.avatar} sx={{ width: 32, height: 32 }}>
                  {participant.name.charAt(0)}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>

        {/* Métricas Ayni */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="primary" fontWeight="bold">
                {project.ayniExchanges}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Intercambios
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {project.meritosGenerated}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mëritos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Chip
                label={project.impact}
                size="small"
                color={
                  project.impact === 'global'
                    ? 'success'
                    : project.impact === 'regional'
                      ? 'warning'
                      : 'info'
                }
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Skills */}
        {project.skillsNeeded.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" color="error.main">
              Necesita: {project.skillsNeeded.slice(0, 2).join(', ')}
              {project.skillsNeeded.length > 2 &&
                ` +${project.skillsNeeded.length - 2}`}
            </Typography>
          </Box>
        )}

        {/* Próximo hito */}
        {project.nextMilestone && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Timer sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption" color="text.secondary">
                {project.nextMilestone}
              </Typography>
            </Stack>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            sx={{ flexGrow: 1 }}
          >
            Ver Detalles
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<GroupWork />}
            onClick={() => onJoinProject(project.id)}
            sx={{
              bgcolor: getCategoryColor(project.category),
              '&:hover': {
                bgcolor: alpha(getCategoryColor(project.category), 0.8),
              },
            }}
          >
            Unirse
          </Button>
        </Stack>
      </Box>
    </Card>
  );

  // 🎯 Render de intercambio de conocimiento
  const renderKnowledgeExchange = (exchange: KnowledgeExchange) => (
    <Card
      key={exchange.id}
      sx={{
        border: `1px solid ${alpha('#9C27B0', 0.2)}`,
        bgcolor: alpha('#9C27B0', 0.02),
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Chip
            label={exchange.type}
            size="small"
            color="secondary"
            variant="outlined"
          />
          <Chip
            label={`${exchange.ayniValue} Ayni`}
            size="small"
            sx={{
              bgcolor: alpha('#E91E63', 0.1),
              color: '#E91E63',
              fontWeight: 'bold',
            }}
          />
        </Stack>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {exchange.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {exchange.description}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Avatar
            src={exchange.offeringMember.avatar}
            sx={{ width: 32, height: 32 }}
          >
            {exchange.offeringMember.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {exchange.offeringMember.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {exchange.offeringMember.expertise.slice(0, 2).join(', ')}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption">{exchange.duration}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption">{exchange.format}</Typography>
            </Stack>
          </Grid>
        </Grid>

        {exchange.dateScheduled && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="success.main"
              fontWeight="bold"
            >
              📅{' '}
              {new Date(exchange.dateScheduled).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HandshakeOutlined />}
            sx={{ flexGrow: 1 }}
          >
            Solicitar Intercambio
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Share />}
            color="secondary"
          >
            Compartir
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* 🎯 Header con tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Centro de Colaboración
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Herramientas para fortalecer la cooperación en {groupName}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: 'linear-gradient(45deg, #E91E63, #9C27B0)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #C2185B, #7B1FA2)',
                },
              }}
            >
              Crear
            </Button>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Proyectos Colaborativos"
              icon={
                <Badge badgeContent={mockProjects.length} color="primary">
                  <Assignment />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Intercambio de Saberes"
              icon={
                <Badge badgeContent={mockExchanges.length} color="secondary">
                  <Psychology />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Eventos y Círculos"
              icon={
                <Badge badgeContent={mockEvents.length} color="info">
                  <EventNote />
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* 📋 Contenido de las tabs */}
              <CollaborationTabPanel value={activeTab} index={0}>
        {/* Proyectos Colaborativos */}
        <Grid container spacing={3}>
          {mockProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              {renderProjectCard(project)}
            </Grid>
          ))}

          {/* Tarjeta para crear nuevo proyecto */}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'primary.main',
                bgcolor: alpha('#E91E63', 0.02),
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha('#E91E63', 0.05),
                },
              }}
              onClick={() => {
                setCreateDialogType('project');
                setShowCreateDialog(true);
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Add sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  Iniciar Nuevo Proyecto
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crea un proyecto colaborativo para el bien común
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
              </CollaborationTabPanel>

        <CollaborationTabPanel value={activeTab} index={1}>
        {/* Intercambio de Saberes */}
        <Grid container spacing={3}>
          {mockExchanges.map((exchange) => (
            <Grid item xs={12} md={6} key={exchange.id}>
              {renderKnowledgeExchange(exchange)}
            </Grid>
          ))}

          {/* Tarjeta para crear nuevo intercambio */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'secondary.main',
                bgcolor: alpha('#9C27B0', 0.02),
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha('#9C27B0', 0.05),
                },
              }}
              onClick={() => {
                setCreateDialogType('exchange');
                setShowCreateDialog(true);
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Psychology
                  sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }}
                />
                <Typography
                  variant="h6"
                  color="secondary.main"
                  fontWeight="bold"
                >
                  Ofrecer Conocimiento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comparte tu sabiduría en intercambio Ayni
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
              </CollaborationTabPanel>

        <CollaborationTabPanel value={activeTab} index={2}>
        {/* Eventos y Círculos */}
        <Grid container spacing={3}>
          {mockEvents.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      label={event.type.replace('_', ' ')}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                    {event.isRecurring && (
                      <Chip
                        label="Recurrente"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {event.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {event.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Schedule
                        sx={{ fontSize: 16, color: 'text.secondary' }}
                      />
                      <Typography variant="body2">
                        {new Date(event.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {event.attendees} participantes
                        {event.maxAttendees && ` / ${event.maxAttendees} máx`}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    startIcon={<EventNote />}
                  >
                    Participar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Tarjeta para crear nuevo evento */}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'info.main',
                bgcolor: alpha('#2196F3', 0.02),
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha('#2196F3', 0.05),
                },
              }}
              onClick={() => {
                setCreateDialogType('event');
                setShowCreateDialog(true);
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <EventNote sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" color="info.main" fontWeight="bold">
                  Organizar Evento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crea un círculo o evento comunitario
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
              </CollaborationTabPanel>

      {/* 🎨 Dialog para crear contenido */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {createDialogType === 'project' && 'Crear Proyecto Colaborativo'}
          {createDialogType === 'exchange' &&
            'Ofrecer Intercambio de Conocimiento'}
          {createDialogType === 'event' && 'Organizar Evento Comunitario'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {createDialogType === 'project' && (
              <>
                <TextField
                  label="Título del Proyecto"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  fullWidth
                  placeholder="Ej: Huerto Urbano Comunitario"
                />
                <TextField
                  label="Descripción"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  multiline
                  rows={3}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        category: e.target.value as any,
                      }))
                    }
                    label="Categoría"
                  >
                    <MenuItem value="community_service">
                      Servicio Comunitario
                    </MenuItem>
                    <MenuItem value="knowledge_sharing">
                      Intercambio de Conocimiento
                    </MenuItem>
                    <MenuItem value="joint_venture">
                      Emprendimiento Conjunto
                    </MenuItem>
                    <MenuItem value="ayni_exchange">Intercambio Ayni</MenuItem>
                    <MenuItem value="mentoring">Mentoría</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {createDialogType === 'exchange' && (
              <>
                <TextField
                  label="Título del Intercambio"
                  value={exchangeForm.title}
                  onChange={(e) =>
                    setExchangeForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  fullWidth
                />
                <TextField
                  label="Descripción"
                  value={exchangeForm.description}
                  onChange={(e) =>
                    setExchangeForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  multiline
                  rows={3}
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo</InputLabel>
                      <Select
                        value={exchangeForm.type}
                        onChange={(e) =>
                          setExchangeForm((prev) => ({
                            ...prev,
                            type: e.target.value as any,
                          }))
                        }
                        label="Tipo"
                      >
                        <MenuItem value="workshop">Taller</MenuItem>
                        <MenuItem value="mentoring">Mentoría</MenuItem>
                        <MenuItem value="skill_swap">
                          Intercambio de Habilidades
                        </MenuItem>
                        <MenuItem value="consultation">Consultoría</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Formato</InputLabel>
                      <Select
                        value={exchangeForm.format}
                        onChange={(e) =>
                          setExchangeForm((prev) => ({
                            ...prev,
                            format: e.target.value as any,
                          }))
                        }
                        label="Formato"
                      >
                        <MenuItem value="virtual">Virtual</MenuItem>
                        <MenuItem value="presencial">Presencial</MenuItem>
                        <MenuItem value="hybrid">Híbrido</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
            )}

            {createDialogType === 'event' && (
              <>
                <TextField
                  label="Título del Evento"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="Descripción"
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  multiline
                  rows={2}
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Fecha y Hora"
                      type="datetime-local"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Duración"
                      value={eventForm.duration}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      fullWidth
                      placeholder="Ej: 2 horas"
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              // Manejar creación según tipo
              setShowCreateDialog(false);
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
