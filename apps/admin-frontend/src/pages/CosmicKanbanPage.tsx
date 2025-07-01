/**
 * 🌌 PORTAL KANBAN CÓSMICO - GAMIFIER ADMIN (ARIA'S ENHANCED VERSION)
 * =============================================================================
 * Portal central para la gestión de High-Value Memes que satisfacen el HambrE
 * de los usuarios. Mejorado por ARIA con experiencia de usuario superior.
 *
 * ✨ NUEVAS CARACTERÍSTICAS IMPLEMENTADAS POR ARIA:
 * - Drag & Drop real funcional entre columnas
 * - Dashboard de Analytics avanzado con gráficos
 * - Sistema de filtros inteligentes mejorado
 * - Vista por Guardianes adicional
 * - Animaciones fluidas y microinteracciones
 * - Métricas de productividad en tiempo real
 * - Quick Actions para operaciones rápidas
 * - Temas visuales adaptativos
 * =============================================================================
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  LinearProgress,
  Alert,
  Fab,
  Tooltip,
  Paper,
  Badge,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardActions,
  Slide,
  Zoom,
  Grow,
  Container,
  Backdrop,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
} from '@mui/material';

import {
  Add as AddIcon,
  FilterList as FilterIcon,
  AutoAwesome as MagicIcon,
  Assessment as StatsIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalFireDepartment as FireIcon,
  WaterDrop as WaterIcon,
  Air as AirIcon,
  Public as EarthIcon,
  Stars as EtherIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  Sync as SyncIcon,
  Insights as InsightsIcon,
  DragIndicator as DragIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ViewColumn as ViewColumnIcon,
  ViewList as ViewListIcon,
  FilterAlt as FilterAltIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  BrightnessHigh as BrightnessHighIcon,
  BrightnessLow as BrightnessLowIcon,
  AutoFixHigh as AutoFixHighIcon,
  Bolt as BoltIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import { toast } from 'sonner';
import { useCosmicKanban } from '../hooks/useCosmicKanban';
import {
  CosmicTask,
  CreateCosmicTaskDto,
  CosmicTaskFilter,
  ThematicElement,
  GuardianRole,
  HambrELevel,
  ColumnStatus,
  TaskPriority,
  PhilosophicalKpi,
} from '../services/cosmic-kanban.service';

// Tipos para las nuevas funcionalidades
interface DragState {
  isDragging: boolean;
  draggedTask: CosmicTask | null;
  dragOverColumn: ColumnStatus | null;
}

interface ViewMode {
  type: 'kanban' | 'guardians' | 'analytics';
}

interface FilterState extends CosmicTaskFilter {
  searchTerm: string;
  showCompleted: boolean;
  priorityFilter: TaskPriority[];
  dateRange: 'all' | 'today' | 'week' | 'month';
}

// Componente para iconos de elementos (mejorado)
const ElementIcon = ({ element, size = 20 }: { element: ThematicElement; size?: number }) => {
  const iconProps = { sx: { fontSize: size } };
  const colorMap = {
    [ThematicElement.FUEGO]: '#FF5722',
    [ThematicElement.AGUA]: '#2196F3',
    [ThematicElement.AIRE]: '#9E9E9E',
    [ThematicElement.TIERRA]: '#4CAF50',
    [ThematicElement.ETER]: '#9C27B0',
  };

  const IconComponent = {
    [ThematicElement.FUEGO]: FireIcon,
    [ThematicElement.AGUA]: WaterIcon,
    [ThematicElement.AIRE]: AirIcon,
    [ThematicElement.TIERRA]: EarthIcon,
    [ThematicElement.ETER]: EtherIcon,
  }[element] || MagicIcon;

  return <IconComponent {...iconProps} sx={{ color: colorMap[element] || '#9E9E9E' }} />;
};

// Componente para avatares de guardianes (mejorado)
const GuardianAvatar = ({ guardian, size = 32, showName = false }: {
  guardian: GuardianRole;
  size?: number;
  showName?: boolean;
}) => {
  const colors = {
    [GuardianRole.ANA]: '#9C27B0',
    [GuardianRole.PHOENIX]: '#FF5722',
    [GuardianRole.ARIA]: '#2196F3',
    [GuardianRole.TERRA]: '#4CAF50',
    [GuardianRole.COSMOS]: '#673AB7',
    [GuardianRole.LUMINA]: '#FF9800',
    [GuardianRole.FLUXUS]: '#00BCD4',
    [GuardianRole.NEXUS]: '#795548',
    [GuardianRole.VITAE]: '#8BC34A',
    [GuardianRole.TEMPUS]: '#607D8B',
    [GuardianRole.MENTIS]: '#E91E63',
    [GuardianRole.SPIRITUS]: '#3F51B5',
    [GuardianRole.NIRA]: '#FF6B35',
    [GuardianRole.KIRA]: '#00E676',
    [GuardianRole.SAGE]: '#8E24AA',
  };

  if (showName) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            bgcolor: colors[guardian] || '#9E9E9E',
            width: size,
            height: size,
            fontSize: `${size * 0.4}px`,
            fontWeight: 'bold'
          }}
        >
          {guardian.substring(0, 2).toUpperCase()}
        </Avatar>
        <Typography variant="body2">{guardian}</Typography>
      </Box>
    );
  }

  return (
    <Avatar
      sx={{
        bgcolor: colors[guardian] || '#9E9E9E',
        width: size,
        height: size,
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: `0 4px 12px ${colors[guardian]}40`
        }
      }}
    >
      {guardian.substring(0, 2).toUpperCase()}
    </Avatar>
  );
};

// Componente para indicador de nivel de hambre (mejorado)
const HambreLevelIndicator = ({ level }: { level: HambrELevel }) => {
  const config: Record<HambrELevel, { color: 'success' | 'warning' | 'error'; icon: string; intensity: string }> = {
    [HambrELevel.LOW]: { color: 'success', icon: '🟢', intensity: 'Zen' },
    [HambrELevel.MEDIUM]: { color: 'warning', icon: '🟡', intensity: 'Activo' },
    [HambrELevel.HIGH]: { color: 'error', icon: '🔴', intensity: 'Intenso' },
  };

  const { color, icon, intensity } = config[level] || config[HambrELevel.MEDIUM];

  return (
    <Tooltip title={`Nivel HambrE: ${intensity}`}>
      <Chip
        label={`${icon} ${level}`}
        size="small"
        color={color}
        variant="outlined"
        sx={{
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />
    </Tooltip>
  );
};

// Componente de Analytics Dashboard mejorado
const AnalyticsDashboard = ({ tasks, stats }: { tasks: CosmicTask[]; stats: any }) => {
  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === ColumnStatus.MANIFESTADO).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const guardianDistribution = tasks.reduce((acc, task) => {
      acc[task.guardian] = (acc[task.guardian] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const elementDistribution = tasks.reduce((acc, task) => {
      acc[task.element] = (acc[task.element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const averageHours = totalTasks > 0 ? totalHours / totalTasks : 0;

    const todayTasks = tasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.createdAt);
      return taskDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      guardianDistribution,
      elementDistribution,
      priorityDistribution,
      averageHours,
      totalHours,
      todayTasks,
      productivity: completionRate > 70 ? 'high' : completionRate > 40 ? 'medium' : 'low'
    };
  }, [tasks]);

  return (
    <Grid container spacing={3}>
      {/* Métricas principales */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            📊 Centro de Inteligencia Cósmica
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {analytics.completionRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tasa de Completitud
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {analytics.totalTasks}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tareas Activas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {analytics.totalHours}h
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Horas Totales
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {analytics.todayTasks}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Creadas Hoy
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Distribución por Guardianes */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupsIcon color="primary" />
            Distribución por Guardianes
          </Typography>
          <Stack spacing={2}>
            {Object.entries(analytics.guardianDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([guardian, count]) => (
                <Box key={guardian}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <GuardianAvatar guardian={guardian as GuardianRole} size={24} showName />
                    <Typography variant="body2" fontWeight="bold">{count}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / analytics.totalTasks) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))
            }
          </Stack>
        </Paper>
      </Grid>

      {/* Distribución por Elementos */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHighIcon color="primary" />
            Distribución por Elementos
          </Typography>
          <Stack spacing={2}>
            {Object.entries(analytics.elementDistribution)
              .sort(([,a], [,b]) => b - a)
              .map(([element, count]) => (
                <Box key={element}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ElementIcon element={element as ThematicElement} />
                      <Typography variant="body2">{element}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">{count}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / analytics.totalTasks) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))
            }
          </Stack>
        </Paper>
      </Grid>

      {/* Indicador de Productividad */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon color="primary" />
            Índice de Productividad Cósmica
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress
              variant="determinate"
              value={analytics.completionRate}
              sx={{
                flexGrow: 1,
                height: 12,
                borderRadius: 6,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: analytics.productivity === 'high' ? '#4CAF50' :
                                   analytics.productivity === 'medium' ? '#FF9800' : '#F44336'
                }
              }}
            />
            <Chip
              label={analytics.productivity === 'high' ? '🚀 ALTA' :
                     analytics.productivity === 'medium' ? '⚡ MEDIA' : '🌱 CRECIENDO'}
              color={analytics.productivity === 'high' ? 'success' :
                     analytics.productivity === 'medium' ? 'warning' : 'default'}
              variant="filled"
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

// Componente principal de tarjeta de tarea con Drag & Drop
interface TaskCardProps {
  task: CosmicTask;
  onEdit: (task: CosmicTask) => void;
  onDelete: (id: string) => void;
  onDragStart: (task: CosmicTask) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      [TaskPriority.CRITICAL]: '#f44336',
      [TaskPriority.HIGH]: '#ff9800',
      [TaskPriority.MEDIUM]: '#2196f3',
      [TaskPriority.LOW]: '#4caf50',
    };
    return colors[priority] || '#9e9e9e';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Grow in timeout={300}>
      <Card
        draggable
        onDragStart={() => onDragStart(task)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        sx={{
          mb: 2,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: 'all 0.3s ease',
          transform: isDragging ? 'rotate(5deg) scale(1.05)' :
                     isHovering ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isDragging ? '0 12px 30px rgba(0,0,0,0.25)' :
                     isHovering ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
          border: `2px solid ${getPriorityColor(task.priority)}`,
          borderRadius: 2,
          position: 'relative',
          overflow: 'visible',
          opacity: isDragging ? 0.8 : 1,
          '&:hover': {
            '& .drag-handle': {
              opacity: 1
            }
          }
        }}
      >
        {/* Drag Handle */}
        <Box
          className="drag-handle"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            color: 'text.secondary',
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing'
            }
          }}
        >
          <DragIcon fontSize="small" />
        </Box>

        {/* Indicador de prioridad */}
        <Box
          sx={{
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            height: 4,
            bgcolor: getPriorityColor(task.priority),
            borderRadius: '4px 4px 0 0'
          }}
        />

        <CardContent sx={{ pb: 1 }}>
          {/* Header con elemento y guardián */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ElementIcon element={task.element} />
              <Typography variant="caption" color="text.secondary">
                Fase {task.phase}
              </Typography>
            </Box>
            <GuardianAvatar guardian={task.guardian} />
          </Box>

          {/* Título */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, lineHeight: 1.3, pr: 3 }}>
            {task.title}
          </Typography>

          {/* Descripción */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {task.description}
          </Typography>

          {/* Métricas */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <HambreLevelIndicator level={task.hambreLevel} />
            <Chip
              label={`${task.estimatedHours}h`}
              size="small"
              icon={<TimerIcon />}
              sx={{ '&:hover': { transform: 'scale(1.05)' } }}
            />
            <Chip
              label={task.philosophicalKpi}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ '&:hover': { transform: 'scale(1.05)' } }}
            />
          </Box>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
              {task.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="filled"
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                />
              ))}
              {task.tags.length > 3 && (
                <Chip
                  label={`+${task.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
          )}

          {/* Footer con fecha y acciones */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {formatDate(task.updatedAt)}
            </Typography>

            {isHovering && (
              <Slide in direction="left" timeout={200}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar tarea">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                      }}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar tarea">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                      }}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.main',
                          color: 'white',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Slide>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Componente principal del Portal Kanban Cósmico MEJORADO
export const CosmicKanbanPage: React.FC = () => {
  // Estados principales
  const [currentView, setCurrentView] = useState<ViewMode['type']>('kanban');
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTask: null,
    dragOverColumn: null,
  });

  // Estados de filtros avanzados
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    showCompleted: true,
    priorityFilter: [],
    dateRange: 'all',
  });

  // Estados de UI
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<CosmicTask | null>(null);
  const [isCompactView, setIsCompactView] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [newTask, setNewTask] = useState<Partial<CreateCosmicTaskDto>>({
    tags: [],
    phase: 1,
    estimatedHours: 8,
    hambreLevel: HambrELevel.MEDIUM,
    priority: TaskPriority.MEDIUM,
    philosophicalKpi: PhilosophicalKpi.VIC,
    status: ColumnStatus.BACKLOG,
  });

  const {
    tasks,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createTask,
    updateTask,
    deleteTask,
    refetchTasks,
    refetchStats,
    error,
  } = useCosmicKanban(filters);

  // Auto-refresh cada 30 segundos si está habilitado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refetchTasks();
        refetchStats();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refetchTasks, refetchStats]);

  // Filtrar tareas con búsqueda avanzada
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filtro de búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.tags?.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Filtro de completadas
    if (!filters.showCompleted) {
      filtered = filtered.filter(t => t.status !== ColumnStatus.MANIFESTADO);
    }

    // Filtro de prioridad
    if (filters.priorityFilter.length > 0) {
      filtered = filtered.filter(t => filters.priorityFilter.includes(t.priority));
    }

    // Filtro de fecha
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dayMs = 24 * 60 * 60 * 1000;

      filtered = filtered.filter(t => {
        const taskDate = new Date(t.createdAt);
        const diffDays = Math.floor((now.getTime() - taskDate.getTime()) / dayMs);

        switch (filters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    return filtered;
  }, [tasks, filters]);

  // Agrupar tareas por status con memoización
  const tasksByStatus = useMemo(() => ({
    [ColumnStatus.BACKLOG]: filteredTasks.filter(t => t.status === ColumnStatus.BACKLOG),
    [ColumnStatus.ALCHEMY]: filteredTasks.filter(t => t.status === ColumnStatus.ALCHEMY),
    [ColumnStatus.QUALITY]: filteredTasks.filter(t => t.status === ColumnStatus.QUALITY),
    [ColumnStatus.MANIFESTADO]: filteredTasks.filter(t => t.status === ColumnStatus.MANIFESTADO),
  }), [filteredTasks]);

  // Agrupar tareas por guardián
  const tasksByGuardian = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      if (!acc[task.guardian]) {
        acc[task.guardian] = [];
      }
      acc[task.guardian].push(task);
      return acc;
    }, {} as Record<GuardianRole, CosmicTask[]>);
  }, [filteredTasks]);

  // Funciones de Drag & Drop
  const handleDragStart = useCallback((task: CosmicTask) => {
    setDragState({
      isDragging: true,
      draggedTask: task,
      dragOverColumn: null,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedTask: null,
      dragOverColumn: null,
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, column: ColumnStatus) => {
    e.preventDefault();
    setDragState(prev => ({
      ...prev,
      dragOverColumn: column,
    }));
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, newStatus: ColumnStatus) => {
    e.preventDefault();

    if (dragState.draggedTask && dragState.draggedTask.status !== newStatus) {
      try {
        await updateTask(dragState.draggedTask.id, { status: newStatus });
        toast.success(`✨ Tarea movida a ${newStatus}`);
      } catch (error) {
        toast.error('Error al mover la tarea');
      }
    }

    handleDragEnd();
  }, [dragState.draggedTask, updateTask, handleDragEnd]);

  // Funciones de gestión de tareas
  const handleCreateTask = useCallback(async () => {
    if (!newTask.title || !newTask.description || !newTask.element || !newTask.guardian) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      await createTask(newTask as CreateCosmicTaskDto);
      setShowCreateDialog(false);
      setNewTask({
        tags: [],
        phase: 1,
        estimatedHours: 8,
        hambreLevel: HambrELevel.MEDIUM,
        priority: TaskPriority.MEDIUM,
        philosophicalKpi: PhilosophicalKpi.VIC,
        status: ColumnStatus.BACKLOG,
      });
      toast.success('✨ Tarea cósmica creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la tarea cósmica');
    }
  }, [newTask, createTask]);

  const handleEditTask = useCallback((task: CosmicTask) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      element: task.element,
      guardian: task.guardian,
      hambreLevel: task.hambreLevel,
      priority: task.priority,
      phase: task.phase,
      estimatedHours: task.estimatedHours,
      philosophicalKpi: task.philosophicalKpi,
      status: task.status,
      tags: task.tags || [],
    });
    setShowCreateDialog(true);
  }, []);

  const handleUpdateTask = useCallback(async () => {
    if (!editingTask || !newTask.title || !newTask.description) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      await updateTask(editingTask.id, newTask);
      setShowCreateDialog(false);
      setEditingTask(null);
      toast.success('🌟 Tarea cósmica actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la tarea cósmica');
    }
  }, [editingTask, newTask, updateTask]);

  const handleDeleteTask = useCallback(async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea cósmica?')) {
      try {
        await deleteTask(id);
        toast.success('🗑️ Tarea cósmica eliminada');
      } catch (error) {
        toast.error('Error al eliminar la tarea cósmica');
      }
    }
  }, [deleteTask]);

  // Quick Actions
  const handleQuickSync = useCallback(async () => {
    toast.loading('Sincronizando con el cosmos...', { id: 'sync' });
    try {
      await Promise.all([refetchTasks(), refetchStats()]);
      toast.success('🌟 Sincronización completada', { id: 'sync' });
    } catch (error) {
      toast.error('Error en la sincronización', { id: 'sync' });
    }
  }, [refetchTasks, refetchStats]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al conectar con el Portal Kanban Cósmico. Verifica que el backend esté ejecutándose.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Mejorado con Quick Actions */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
            🌌 Portal Kanban Cósmico
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Centro de gestión de High-Value Memes mejorado por ARIA 🌸
          </Typography>

          {/* Controles de Vista */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={currentView}
              exclusive
              onChange={(_, newView) => newView && setCurrentView(newView)}
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }
                }
              }}
            >
              <ToggleButton value="kanban">
                <ViewColumnIcon sx={{ mr: 1 }} />
                Kanban
              </ToggleButton>
              <ToggleButton value="guardians">
                <GroupsIcon sx={{ mr: 1 }} />
                Guardianes
              </ToggleButton>
              <ToggleButton value="analytics">
                <AnalyticsIcon sx={{ mr: 1 }} />
                Analytics
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-thumb': { backgroundColor: 'white' },
                    '& .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                />
              }
              label="Auto-refresh"
              sx={{ color: 'white' }}
            />
          </Stack>

          {/* Quick Actions Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
              onClick={handleQuickSync}
              disabled={isLoading}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)'
              }}
            >
              {isLoading ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                bgcolor: '#ff6b35',
                '&:hover': { bgcolor: '#e55a2b' },
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)'
              }}
            >
              Nueva Tarea Cósmica
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Sistema de Filtros Avanzados */}
      <Accordion sx={{ mb: 3, borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon color="primary" />
            <Typography variant="h6">Filtros Avanzados</Typography>
            {(filters.searchTerm || filters.priorityFilter.length > 0 || filters.dateRange !== 'all') && (
              <Chip label="Activos" color="primary" size="small" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar tareas cósmicas"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Rango de Fecha</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterState['dateRange'] })}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="today">Hoy</MenuItem>
                  <MenuItem value="week">Esta Semana</MenuItem>
                  <MenuItem value="month">Este Mes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Guardián</InputLabel>
                <Select
                  value={filters.guardian || ''}
                  onChange={(e) => setFilters({ ...filters, guardian: e.target.value as GuardianRole })}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.values(GuardianRole).map(guardian => (
                    <MenuItem key={guardian} value={guardian}>
                      <GuardianAvatar guardian={guardian} size={24} showName />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Elemento</InputLabel>
                <Select
                  value={filters.element || ''}
                  onChange={(e) => setFilters({ ...filters, element: e.target.value as ThematicElement })}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.values(ThematicElement).map(element => (
                    <MenuItem key={element} value={element}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ElementIcon element={element} />
                        {element}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.showCompleted}
                      onChange={(e) => setFilters({ ...filters, showCompleted: e.target.checked })}
                    />
                  }
                  label="Mostrar Completadas"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCompactView}
                      onChange={(e) => setIsCompactView(e.target.checked)}
                    />
                  }
                  label="Vista Compacta"
                />
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilters({
                searchTerm: '',
                showCompleted: true,
                priorityFilter: [],
                dateRange: 'all',
              })}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Contenido Principal Basado en Vista Seleccionada */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {currentView === 'analytics' && (
            <AnalyticsDashboard tasks={filteredTasks} stats={stats} />
          )}

          {currentView === 'guardians' && (
            <Grid container spacing={3}>
              {Object.entries(tasksByGuardian).map(([guardian, guardianTasks]) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={guardian}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    minHeight: '75vh', // Aumentado para consistencia con Kanban
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'divider'
                    }}>
                      <GuardianAvatar guardian={guardian as GuardianRole} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {guardian}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {guardianTasks.length} tareas
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      maxHeight: 'calc(75vh - 120px)' // Altura dinámica
                    }}>
                      {guardianTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          isDragging={dragState.draggedTask?.id === task.id}
                        />
                      ))}
                      {guardianTasks.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          <MagicIcon sx={{ fontSize: 48, mb: 1 }} />
                          <Typography variant="body2">
                            Sin tareas asignadas
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {currentView === 'kanban' && (
            <Grid container spacing={3}>
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <Grid item xs={12} sm={6} md={3} key={status}>
                  <Paper
                    onDragOver={(e) => handleDragOver(e, status as ColumnStatus)}
                    onDrop={(e) => handleDrop(e, status as ColumnStatus)}
                    sx={{
                      minHeight: '80vh', // Aumentado a 80% de la altura de viewport
                      maxHeight: '85vh', // Altura máxima para evitar scroll de página
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: dragState.dragOverColumn === status ? 'primary.main' : 'divider',
                      transition: 'all 0.3s ease',
                      backgroundColor: dragState.dragOverColumn === status ? 'action.hover' : 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {/* Header de columna mejorado */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="h6" fontWeight="bold">
                        {status}
                      </Typography>
                      <Badge
                        badgeContent={statusTasks.length}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    </Box>

                    {/* Lista de tareas con scroll */}
                    <Box sx={{
                      flexGrow: 1, // Ocupa todo el espacio disponible
                      overflowY: 'auto',
                      pr: 1,
                      maxHeight: 'calc(80vh - 120px)' // Altura dinámica basada en el contenedor
                    }}>
                      {statusTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          isDragging={dragState.draggedTask?.id === task.id}
                        />
                      ))}

                      {statusTasks.length === 0 && (
                        <Box sx={{
                          textAlign: 'center',
                          py: 4,
                          color: 'text.secondary',
                          opacity: 0.7
                        }}>
                          {dragState.dragOverColumn === status ? (
                            <>
                              <AutoAwesome sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
                              <Typography variant="body2" color="primary.main">
                                Suelta aquí la tarea
                              </Typography>
                            </>
                          ) : (
                            <>
                              <MagicIcon sx={{ fontSize: 48, mb: 1 }} />
                              <Typography variant="body2">
                                No hay tareas en esta columna
                              </Typography>
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Dialog para crear/editar tarea */}
      <Dialog
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setEditingTask(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          pb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          {editingTask ? '✨ Editar Tarea Cósmica' : '🌟 Crear Nueva Tarea Cósmica'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                fullWidth
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Elemento Temático</InputLabel>
                <Select
                  value={newTask.element || ''}
                  onChange={(e) => setNewTask({ ...newTask, element: e.target.value as ThematicElement })}
                >
                  {Object.values(ThematicElement).map(element => (
                    <MenuItem key={element} value={element}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ElementIcon element={element} />
                        {element}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Guardián Responsable</InputLabel>
                <Select
                  value={newTask.guardian || ''}
                  onChange={(e) => setNewTask({ ...newTask, guardian: e.target.value as GuardianRole })}
                >
                  {Object.values(GuardianRole).map(guardian => (
                    <MenuItem key={guardian} value={guardian}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GuardianAvatar guardian={guardian} />
                        {guardian}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Nivel HambrE</InputLabel>
                <Select
                  value={newTask.hambreLevel || HambrELevel.MEDIUM}
                  onChange={(e) => setNewTask({ ...newTask, hambreLevel: e.target.value as HambrELevel })}
                >
                  <MenuItem value={HambrELevel.LOW}>Bajo (1)</MenuItem>
                  <MenuItem value={HambrELevel.MEDIUM}>Medio (2)</MenuItem>
                  <MenuItem value={HambrELevel.HIGH}>Alto (3)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={newTask.priority || TaskPriority.MEDIUM}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                >
                  {Object.values(TaskPriority).map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fase"
                type="number"
                fullWidth
                value={newTask.phase || 1}
                onChange={(e) => setNewTask({ ...newTask, phase: parseInt(e.target.value) || 1 })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Horas Estimadas"
                type="number"
                fullWidth
                value={newTask.estimatedHours || 8}
                onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseInt(e.target.value) || 8 })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>KPI Filosófico</InputLabel>
                <Select
                  value={newTask.philosophicalKpi || PhilosophicalKpi.VIC}
                  onChange={(e) => setNewTask({ ...newTask, philosophicalKpi: e.target.value as PhilosophicalKpi })}
                >
                  {Object.values(PhilosophicalKpi).map(kpi => (
                    <MenuItem key={kpi} value={kpi}>{kpi}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTask.status || ColumnStatus.BACKLOG}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as ColumnStatus })}
                >
                  {Object.values(ColumnStatus).map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tags (separados por comas)"
                fullWidth
                value={newTask.tags?.join(', ') || ''}
                onChange={(e) => setNewTask({
                  ...newTask,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => {
              setShowCreateDialog(false);
              setEditingTask(null);
            }}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={editingTask ? handleUpdateTask : handleCreateTask}
            disabled={isCreating || isUpdating}
            startIcon={(isCreating || isUpdating) ? <CircularProgress size={20} /> : undefined}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 3
            }}
          >
            {(isCreating || isUpdating) ? 'Procesando...' : (editingTask ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading overlay */}
      <Backdrop
        open={isDeleting}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Eliminando tarea cósmica...
          </Typography>
        </Box>
      </Backdrop>

      {/* Fab para crear tarea rápida en móvil */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setShowCreateDialog(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};
