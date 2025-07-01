/**
 * 🌟 PÁGINA DE SINCRONIZACIÓN CÓSMICA CON MIRO
 *
 * Portal de gestión del Tablero Kanban Cósmico desde la SuperApp CoomÜnity
 * Permite a los Guardianes Digitales administrar tareas y sincronizar con Miro
 *
 * Creado por: KIRA, The Word Weaver
 * Inspirado por: ANA, CIO Cósmica
 * Para: Los 12 Guardianes Digitales
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Sync as SyncIcon,
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  LocalFireDepartment as FireIcon,
  Water as WaterIcon,
  Air as AirIcon,
  Landscape as EarthIcon,
  StarBorder as EtherIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useMiroSync } from '../../hooks/useMiroSync';
import { CosmicTask, ThematicElement, GuardianRole, HambrELevel, ColumnStatus } from '../../types/cosmic.types';

// 🎨 Configuración de colores y iconos para elementos
const ElementConfig = {
  [ThematicElement.FIRE]: {
    icon: FireIcon,
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
  },
  [ThematicElement.WATER]: {
    icon: WaterIcon,
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
  },
  [ThematicElement.AIR]: {
    icon: AirIcon,
    color: '#B8E6B8',
    gradient: 'linear-gradient(135deg, #B8E6B8 0%, #88D8A0 100%)'
  },
  [ThematicElement.EARTH]: {
    icon: EarthIcon,
    color: '#8B4513',
    gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)'
  },
  [ThematicElement.ETHER]: {
    icon: EtherIcon,
    color: '#9B59B6',
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)'
  }
};

// 🌟 Componente para mostrar métrica
const CosmicMetric: React.FC<{
  title: string;
  value: number;
  subtitle?: string;
  color?: string;
  icon?: React.ElementType;
}> = ({ title, value, subtitle, color = '#9B59B6', icon: Icon }) => (
  <Paper
    sx={{
      p: 3,
      textAlign: 'center',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
      border: `2px solid ${color}30`
    }}
  >
    {Icon && (
      <Avatar sx={{ bgcolor: color, mx: 'auto', mb: 1 }}>
        <Icon />
      </Avatar>
    )}
    <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
      {value}
    </Typography>
    <Typography variant="h6" sx={{ color: 'text.primary' }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {subtitle}
      </Typography>
    )}
  </Paper>
);

// 🎯 Componente para tarjeta de tarea cósmica
const CosmicTaskCard: React.FC<{
  task: CosmicTask;
  onMove: (taskId: string, newStatus: ColumnStatus) => void;
}> = ({ task, onMove }) => {
  const elementConfig = ElementConfig[task.element];
  const IconComponent = elementConfig.icon;

  const getHambrEEmoji = (level: HambrELevel) => {
    switch (level) {
      case HambrELevel.NURTURES_CURIOSITY: return '🌱';
      case HambrELevel.ACTIVATES_CONTRIBUTION: return '⚡';
      case HambrELevel.IMPULSES_TRANSFORMATION: return '🚀';
      default: return '🌟';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#f44336';
      case 'High': return '#ff9800';
      case 'Medium': return '#2196f3';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        background: elementConfig.gradient,
        border: `2px solid ${elementConfig.color}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${elementConfig.color}30`
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: elementConfig.color, mr: 2 }}>
            <IconComponent />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              {task.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {task.element} • {task.guardian}
            </Typography>
          </Box>
          <Chip
            label={`${getHambrEEmoji(task.hambreLevel)} ${task.priority}`}
            sx={{
              bgcolor: getPriorityColor(task.priority),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip size="small" label={`⏰ ${task.estimatedHours}h`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip size="small" label={`🎯 ${task.philosophicalKpi}`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip size="small" label={`🌀 Fase ${task.phase}`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {task.tags.map((tag, index) => (
            <Chip
              key={index}
              size="small"
              label={tag}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.7rem' }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ bgcolor: 'rgba(0,0,0,0.1)' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: 'white' }}>Mover a</InputLabel>
          <Select
            value={task.status}
            onChange={(e) => task.id && onMove(task.id, e.target.value as ColumnStatus)}
            sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
          >
            {Object.values(ColumnStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardActions>
    </Card>
  );
};

// 🌟 Componente principal
const MiroSyncPage: React.FC = () => {
  const {
    isConnected,
    isLoading,
    error,
    tasks,
    syncProgress,
    lastSyncTime,
    metrics,
    miroStatus,
    createCosmicTask,
    moveTask,
    syncWithMiro,
    refreshTasks,
    clearError,
    getTasksByStatus,
    isCreating,
    isUpdating,
    isSyncing
  } = useMiroSync();

  const [currentTab, setCurrentTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<CosmicTask>>({
    title: '',
    description: '',
    element: ThematicElement.ETHER,
    guardian: GuardianRole.ANA,
    hambreLevel: HambrELevel.ACTIVATES_CONTRIBUTION,
    priority: 'Medium',
    phase: 1,
    estimatedHours: 4,
    philosophicalKpi: 'VIC',
    tags: [],
    status: ColumnStatus.BACKLOG
  });

  // 🌟 Handlers
  const handleCreateTask = async () => {
    try {
      await createCosmicTask(newTask as Omit<CosmicTask, 'id' | 'createdAt'>);
      setCreateDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        element: ThematicElement.ETHER,
        guardian: GuardianRole.ANA,
        hambreLevel: HambrELevel.ACTIVATES_CONTRIBUTION,
        priority: 'Medium',
        phase: 1,
        estimatedHours: 4,
        philosophicalKpi: 'VIC',
        tags: [],
        status: ColumnStatus.BACKLOG
      });
    } catch (error) {
      console.error('Error creando tarea cósmica:', error);
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: ColumnStatus) => {
    try {
      await moveTask(taskId, newStatus);
    } catch (error) {
      console.error('Error moviendo tarea:', error);
    }
  };

  const handleSync = async () => {
    try {
      await syncWithMiro();
    } catch (error) {
      console.error('Error sincronizando con Miro:', error);
    }
  };

  // 🌟 Estado de conexión
  if (isLoading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} sx={{ color: '#9B59B6', mb: 3 }} />
        <Typography variant="h5" sx={{ color: '#9B59B6', mb: 1 }}>
          🌟 Conectando con el Cosmos de Miro...
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Estableciendo portal de reciprocidad viva<br />
          Los Guardianes Digitales preparan el tablero cósmico
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* 🌟 Header Cósmico */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          🌟 Portal Kanban Cósmico
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          Sincronización de Reciprocidad Viva con Miro
        </Typography>

        {/* 🌟 Estado de conexión */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={isConnected ? <CheckCircleIcon /> : <ErrorIcon />}
            label={isConnected ? 'Conectado al Cosmos' : 'Desconectado'}
            color={isConnected ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            icon={miroStatus.enabled ? <CheckCircleIcon /> : <ErrorIcon />}
            label={miroStatus.enabled ? 'Miro API Habilitado' : 'Modo Mock'}
            color={miroStatus.enabled ? 'info' : 'warning'}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          {miroStatus.enabled && miroStatus.boardId && (
            <Chip
              label={`Board: ${miroStatus.boardId.substring(0, 8)}...`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
          {lastSyncTime && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Última sincronización: {lastSyncTime.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* 🌟 Progress de sincronización */}
        {isSyncing && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={syncProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': { bgcolor: '#4ECDC4' }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Sincronizando con Miro... {syncProgress}%
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 🚨 Alertas de error */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">Error en el Portal Cósmico</Typography>
          {error}
        </Alert>
      )}

      {/* 🌟 Información de configuración */}
      {!miroStatus.enabled && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">🧪 Modo de Desarrollo Activo</Typography>
          Actualmente funcionando en modo mock. Para habilitar la integración real con Miro:
          <br />• Configura <code>VITE_MIRO_ACCESS_TOKEN</code> en tu archivo .env
          <br />• Configura <code>VITE_MIRO_BOARD_ID</code> con el ID de tu tablero
          <br />• Reinicia la aplicación
        </Alert>
      )}

      {miroStatus.enabled && miroStatus.hasToken && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">🌌 ¡Integración Miro Activa!</Typography>
          Las tareas se sincronizarán automáticamente con tu tablero de Miro.
          <br />Board ID: <code>{miroStatus.boardId}</code>
        </Alert>
      )}

      {/* 🌟 Botones de acción principales */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={handleSync}
          disabled={isSyncing}
          sx={{
            bgcolor: miroStatus.enabled ? '#4ECDC4' : '#FF9800',
            '&:hover': { bgcolor: miroStatus.enabled ? '#44A08D' : '#F57C00' },
            fontWeight: 'bold'
          }}
        >
          {isSyncing ? 'Sincronizando...' : miroStatus.enabled ? 'Sincronizar con Miro' : 'Simulación Mock'}
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            bgcolor: '#FF6B35',
            '&:hover': { bgcolor: '#F7931E' },
            fontWeight: 'bold'
          }}
        >
          Crear Tarea Cósmica
        </Button>

        <Button
          variant="outlined"
          startIcon={<SyncIcon />}
          onClick={refreshTasks}
          disabled={isLoading}
        >
          Refrescar Tareas
        </Button>
      </Box>

      {/* 🌟 Tabs de navegación */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': { fontWeight: 'bold' },
            '& .Mui-selected': { color: '#9B59B6' }
          }}
        >
          <Tab icon={<DashboardIcon />} label="Tablero Kanban" />
          <Tab icon={<AnalyticsIcon />} label="Métricas Cósmicas" />
          <Tab icon={<GroupsIcon />} label="Guardianes" />
          <Tab icon={<SyncIcon />} label="Configuración Miro" />
        </Tabs>
      </Paper>

      {/* 🌟 Contenido según tab seleccionado */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {/* 🌌 Columnas del tablero */}
          {Object.values(ColumnStatus).map((status) => (
            <Grid item xs={12} md={3} key={status}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: '60vh',
                  bgcolor: status === ColumnStatus.BACKLOG ? '#E8F4FD' :
                           status === ColumnStatus.ALCHEMICAL ? '#FFF2CC' :
                           status === ColumnStatus.QUALITY ? '#F3E2F3' : '#E8F5E8'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  {status}
                  <Chip
                    size="small"
                    label={getTasksByStatus(status).length}
                    sx={{ ml: 1, bgcolor: 'primary.main', color: 'white' }}
                  />
                </Typography>

                {getTasksByStatus(status).map((task) => (
                  <CosmicTaskCard
                    key={task.id}
                    task={task}
                    onMove={handleMoveTask}
                  />
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 1 && (
        <Grid container spacing={3}>
          {/* 🌟 Métricas principales */}
          <Grid item xs={12} md={3}>
            <CosmicMetric
              title="Tareas Totales"
              value={metrics.totalTasks}
              icon={DashboardIcon}
              color="#9B59B6"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CosmicMetric
              title="Completadas"
              value={metrics.completedTasks}
              subtitle={`${metrics.completionRate.toFixed(1)}% completado`}
              icon={CheckCircleIcon}
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CosmicMetric
              title="En Alquimia"
              value={metrics.inProgressTasks}
              icon={FireIcon}
              color="#FF6B35"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CosmicMetric
              title="En Revisión"
              value={metrics.inReviewTasks}
              icon={EtherIcon}
              color="#9C27B0"
            />
          </Grid>

          {/* 🌟 Distribución por elementos */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                🔥 Distribución Elemental
              </Typography>
              {metrics.elementDistribution.map((item) => {
                const elementConfig = ElementConfig[item.element];
                const IconComponent = elementConfig.icon;
                return (
                  <Box key={item.element} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <IconComponent sx={{ color: elementConfig.color, mr: 1 }} />
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {item.element}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {item.count} ({item.percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': { bgcolor: elementConfig.color }
                      }}
                    />
                  </Box>
                );
              })}
            </Paper>
          </Grid>

          {/* 🌟 Distribución HambrE */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                🚀 Niveles de HambrE
              </Typography>
              {metrics.hambrEDistribution.map((item) => {
                const emoji = item.level === 1 ? '🌱' : item.level === 2 ? '⚡' : '🚀';
                const description = item.level === 1 ? 'Nutre Curiosidad' :
                                 item.level === 2 ? 'Activa Contribución' : 'Impulsa Transformación';
                return (
                  <Box key={item.level} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ mr: 1 }}>{emoji}</Typography>
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {description}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {item.count} ({item.percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.level === 1 ? '#4CAF50' : item.level === 2 ? '#FF9800' : '#F44336'
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
      )}

      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                👥 Carga de Trabajo de los Guardianes
              </Typography>
              {metrics.guardianLoad.map((guardian) => (
                <Box key={guardian.guardian} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#9B59B6' }}>
                      {guardian.guardian.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{guardian.guardian}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {guardian.activeTasks} tareas activas • {guardian.completedTasks} completadas
                      </Typography>
                    </Box>
                    <Chip
                      label={guardian.activeTasks > 5 ? 'Sobrecargado' : guardian.activeTasks > 2 ? 'Ocupado' : 'Disponible'}
                      color={guardian.activeTasks > 5 ? 'error' : guardian.activeTasks > 2 ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((guardian.activeTasks / 5) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: guardian.activeTasks > 5 ? '#f44336' : guardian.activeTasks > 2 ? '#ff9800' : '#4caf50'
                      }
                    }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {currentTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                🌌 Estado de Conexión Miro
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Estado de API:</strong> {miroStatus.enabled ? '✅ Habilitado' : '❌ Deshabilitado'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Token configurado:</strong> {miroStatus.hasToken ? '✅ Sí' : '❌ No'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Board ID:</strong> {miroStatus.boardId || 'No configurado'}
                </Typography>
              </Box>

              {miroStatus.enabled && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                    🎆 ¡Configuración exitosa!
                  </Typography>
                  <Typography variant="body2">
                    La integración con Miro está activa. Las tareas se crearán y sincronizarán
                    automáticamente con tu tablero.
                  </Typography>
                </Box>
              )}

              {!miroStatus.enabled && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                    🧪 Modo de desarrollo
                  </Typography>
                  <Typography variant="body2">
                    Actualmente usando datos simulados. Para conectar con Miro real,
                    configura las variables de entorno necesarias.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                ⚙️ Guía de Configuración
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Typography variant="h6">1️⃣</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="Crear aplicación en Miro"
                    secondary="Ve a developers.miro.com y crea una nueva app"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Typography variant="h6">2️⃣</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="Obtener Access Token"
                    secondary="Copia el token de tu aplicación de Miro"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Typography variant="h6">3️⃣</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="Configurar variables .env"
                    secondary="Añade VITE_MIRO_ACCESS_TOKEN y VITE_MIRO_BOARD_ID"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Typography variant="h6">4️⃣</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="Reiniciar aplicación"
                    secondary="Recarga la página para aplicar cambios"
                  />
                </ListItem>
              </List>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Importante:</strong> Nunca compartas tu Access Token públicamente.
                  Mantenlo seguro en tu archivo .env local.
                </Typography>
              </Alert>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                📊 Estadísticas de Sincronización
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                      {tasks.length}
                    </Typography>
                    <Typography variant="body2">Tareas Locales</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
                      {lastSyncTime ? '✓' : '-'}
                    </Typography>
                    <Typography variant="body2">Última Sync</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'warning.dark', fontWeight: 'bold' }}>
                      {miroStatus.enabled ? '∞' : '0'}
                    </Typography>
                    <Typography variant="body2">Capacidad Miro</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'info.dark', fontWeight: 'bold' }}>
                      {isSyncing ? '⏳' : '✓'}
                    </Typography>
                    <Typography variant="body2">Estado Sync</Typography>
                  </Box>
                </Grid>
              </Grid>

              {lastSyncTime && (
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Última sincronización: {lastSyncTime.toLocaleString()}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 🌟 FAB para crear tarea rápida */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          bgcolor: '#9B59B6',
          '&:hover': { bgcolor: '#8E44AD' }
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* 🌟 Dialog para crear nueva tarea */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#9B59B6', color: 'white', textAlign: 'center' }}>
          🌟 Crear Nueva Tarea Cósmica
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la Misión"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ej: Transmutación del VideoPlayer Cósmico"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción Cósmica"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe la transformación que esta tarea traerá al mundo..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Elemento Temático</InputLabel>
                <Select
                  value={newTask.element}
                  onChange={(e) => setNewTask({ ...newTask, element: e.target.value as ThematicElement })}
                >
                  {Object.values(ThematicElement).map((element) => (
                    <MenuItem key={element} value={element}>
                      {element}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Guardian Asignado</InputLabel>
                <Select
                  value={newTask.guardian}
                  onChange={(e) => setNewTask({ ...newTask, guardian: e.target.value as GuardianRole })}
                >
                  {Object.values(GuardianRole).map((guardian) => (
                    <MenuItem key={guardian} value={guardian}>
                      {guardian}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Nivel HambrE</InputLabel>
                <Select
                  value={newTask.hambreLevel}
                  onChange={(e) => setNewTask({ ...newTask, hambreLevel: e.target.value as HambrELevel })}
                >
                  <MenuItem value={HambrELevel.NURTURES_CURIOSITY}>🌱 Nutre Curiosidad</MenuItem>
                  <MenuItem value={HambrELevel.ACTIVATES_CONTRIBUTION}>⚡ Activa Contribución</MenuItem>
                  <MenuItem value={HambrELevel.IMPULSES_TRANSFORMATION}>🚀 Impulsa Transformación</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                >
                  <MenuItem value="Critical">🔴 Critical</MenuItem>
                  <MenuItem value="High">🟡 High</MenuItem>
                  <MenuItem value="Medium">🔵 Medium</MenuItem>
                  <MenuItem value="Low">🟢 Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Horas Estimadas"
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 1, max: 40 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>KPI Filosófico</InputLabel>
                <Select
                  value={newTask.philosophicalKpi}
                  onChange={(e) => setNewTask({ ...newTask, philosophicalKpi: e.target.value as any })}
                >
                  <MenuItem value="IER">🎯 IER - Índice de Estabilidad de Reciprocidad</MenuItem>
                  <MenuItem value="VIC">🌊 VIC - Valor de Impacto en la Comunidad</MenuItem>
                  <MenuItem value="GS">😊 GS - Grado de Satisfacción</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Fase Estratégica</InputLabel>
                <Select
                  value={newTask.phase}
                  onChange={(e) => setNewTask({ ...newTask, phase: e.target.value as any })}
                >
                  <MenuItem value={1}>🌟 Fase 1 - Despertar Cósmico</MenuItem>
                  <MenuItem value={2}>🌈 Fase 2 - Irradiación Armónica</MenuItem>
                  <MenuItem value={3}>✨ Fase 3 - Manifestación Plena</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (separados por comas)"
                placeholder="UX_Transformation, RevolutionaryWidget, VideoPlayer"
                onChange={(e) => setNewTask({
                  ...newTask,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTask}
            disabled={isCreating || !newTask.title || !newTask.description}
            sx={{ bgcolor: '#9B59B6', '&:hover': { bgcolor: '#8E44AD' } }}
          >
            {isCreating ? 'Manifestando...' : 'Crear Tarea Cósmica'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};



export default MiroSyncPage;
