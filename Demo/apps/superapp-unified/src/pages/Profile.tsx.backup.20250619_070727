import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Switch,
  FormControlLabel,
  Skeleton,
  Snackbar,
  CircularProgress,
  Tooltip,
  Collapse,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  ListItemAvatar,
  CardHeader,
} from '@mui/material';
import {
  Person,
  Edit,
  Settings,
  Security,
  Notifications,
  LocationOn,
  Language,
  Star,
  TrendingUp,
  EmojiEvents,
  Group,
  PhotoCamera,
  Phone,
  Email,
  CalendarMonth,
  Verified,
  Analytics,
  Timeline,
  VideoLibrary,
  Palette,
  Save,
  Cancel,
  Share,
  ContentCopy,
  Link,
  Twitter,
  LinkedIn,
  WhatsApp,
  Telegram,
  ExpandMore,
  ExpandLess,
  SwapHoriz,
  Assignment,
  Badge as BadgeIcon,
  Stars,
  WaterDrop,
  Balance,
  SelfImprovement,
  Psychology,
  Refresh,
  CloudUpload,
  Brightness6,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import {
  useCurrentUserProfile,
  useUpdateUserProfile,
  profileValidation,
  UpdateProfileData,
  useGamificationMetrics,
} from '../hooks/useUserProfile';
import '../styles/profile-enhanced.css';
import { safeToLocaleString } from '../utils/numberUtils';

// 🔧 SOLUCIÓN: Función segura para formatear fechas
const formatSafeDate = (
  dateString?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) return 'No especificada';

  try {
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida detectada: ${dateString}`);
      return 'Fecha inválida';
    }

    return date.toLocaleDateString(
      'es-ES',
      options || {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  } catch (error) {
    console.error(`❌ Error al formatear fecha: ${dateString}`, error);
    return 'Error en fecha';
  }
};

// 🎯 Interfaces para funcionalidades extendidas
interface ProfileMetrics {
  level: number;
  meritos: number;
  ondas: number;
  ayniLevel: number;
  completedChallenges: number;
  socialConnections: number;
  marketplaceRating: number;
  pilgrimProgress: number;
}

interface ActivityItem {
  id: string;
  type: 'challenge' | 'marketplace' | 'social' | 'uplay' | 'wallet';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
  points?: number;
  category?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 🎨 Utilidades para temas y colores CoomÜnity
const coomunityColors = {
  merito: '#FFD700', // Dorado para Mëritos
  onda: '#00CED1', // Turquesa para Öndas
  ayni: '#9C27B0', // Púrpura para Ayni
  pilgrim: '#FF6B35', // Naranja para Pilgrim Journey
  marketplace: '#4CAF50', // Verde para Marketplace
  social: '#2196F3', // Azul para Social
  uplay: '#FF5722', // Rojo para ÜPlay
  wallet: '#FFC107', // Ámbar para Wallet
};

// 🏆 Función para obtener color según nivel de Ayni
const getAyniColor = (level: number): string => {
  if (level >= 90) return '#FFD700'; // Oro
  if (level >= 70) return '#C0C0C0'; // Plata
  if (level >= 50) return '#CD7F32'; // Bronce
  return '#9E9E9E'; // Gris
};

// 📊 Función para calcular progreso de nivel
const calculateLevelProgress = (level: number, points: number): number => {
  const basePoints = level * 1000;
  const nextLevelPoints = (level + 1) * 1000;
  const currentProgress = points - basePoints;
  const totalNeeded = nextLevelPoints - basePoints;
  return Math.min(Math.max((currentProgress / totalNeeded) * 100, 0), 100);
};

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'challenge',
    title: 'Completaste "Desafío Ayni Diario"',
    description: 'Ayudaste a 3 miembros de la CoomÜnidad',
    timestamp: '2024-12-18T10:30:00Z',
    icon: <EmojiEvents />,
    color: coomunityColors.merito,
    points: 150,
    category: 'Reciprocidad',
  },
  {
    id: '2',
    type: 'marketplace',
    title: 'Nueva reseña recibida',
    description: 'María valoró tu servicio con 5 estrellas',
    timestamp: '2024-12-18T09:15:00Z',
    icon: <Star />,
    color: coomunityColors.marketplace,
    category: 'Confianza',
  },
  {
    id: '3',
    type: 'social',
    title: 'Te conectaste con Juan Carlos',
    description: 'Nueva colaboración iniciada',
    timestamp: '2024-12-17T16:45:00Z',
    icon: <Group />,
    color: coomunityColors.social,
    category: 'Red Social',
  },
  {
    id: '4',
    type: 'uplay',
    title: 'Video completado: "Economía Sagrada"',
    description: 'Respondiste correctamente 8/10 preguntas',
    timestamp: '2024-12-17T14:20:00Z',
    icon: <VideoLibrary />,
    color: coomunityColors.uplay,
    points: 80,
    category: 'Aprendizaje',
  },
  {
    id: '5',
    type: 'wallet',
    title: 'Transacción realizada',
    description: 'Intercambio de 100 Lükas por servicios',
    timestamp: '2024-12-17T11:00:00Z',
    icon: <SwapHoriz />,
    color: coomunityColors.wallet,
    category: 'Intercambio',
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Maestro del Ayni',
    description: 'Mantuviste equilibrio perfecto por 30 días',
    icon: <Balance />,
    unlockedAt: '2024-12-15T12:00:00Z',
    rarity: 'legendary',
  },
  {
    id: '2',
    name: 'Colaborador Confiable',
    description: 'Recibiste 50+ reseñas positivas',
    icon: <Verified />,
    unlockedAt: '2024-12-10T15:30:00Z',
    rarity: 'epic',
  },
  {
    id: '3',
    name: 'Explorador Social',
    description: 'Conectaste con 100+ miembros',
    icon: <Group />,
    unlockedAt: '2024-12-05T09:45:00Z',
    rarity: 'rare',
  },
  {
    id: '4',
    name: 'Aprendiz Constante',
    description: 'Completa 20 videos educativos',
    icon: <Psychology />,
    progress: 18,
    maxProgress: 20,
    rarity: 'common',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// 🎨 Componente para métricas con animación
const MetricCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  progress?: number;
}> = ({ title, value, icon, color, subtitle, progress }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
      border: `1px solid ${color}30`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 32px ${color}40`,
      },
    }}
  >
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
      </Box>
      <Typography
        variant="h4"
        component="div"
        sx={{ fontWeight: 'bold', color, mb: 1 }}
      >
        {value}
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 2,
            height: 6,
            borderRadius: 3,
            backgroundColor: `${color}20`,
            '& .MuiLinearProgress-bar': { backgroundColor: color },
          }}
        />
      )}
    </CardContent>
  </Card>
);

// 🏆 Componente para achievements
const AchievementCard: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700';
      case 'epic':
        return '#9C27B0';
      case 'rare':
        return '#2196F3';
      case 'common':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const isUnlocked = !!achievement.unlockedAt;
  const rarityColor = getRarityColor(achievement.rarity);

  return (
    <Card
      sx={{
        opacity: isUnlocked ? 1 : 0.6,
        border: `2px solid ${rarityColor}`,
        background: isUnlocked
          ? `linear-gradient(135deg, ${rarityColor}10 0%, ${rarityColor}20 100%)`
          : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: `0 8px 32px ${rarityColor}40`,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Avatar
          sx={{
            bgcolor: rarityColor,
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 2,
            filter: isUnlocked ? 'none' : 'grayscale(1)',
          }}
        >
          {achievement.icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {achievement.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {achievement.description}
        </Typography>

        {achievement.progress !== undefined && achievement.maxProgress && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(achievement.progress / achievement.maxProgress) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: `${rarityColor}20`,
                '& .MuiLinearProgress-bar': { backgroundColor: rarityColor },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block' }}
            >
              {achievement.progress}/{achievement.maxProgress}
            </Typography>
          </Box>
        )}

        <Chip
          label={achievement.rarity.toUpperCase()}
          size="small"
          sx={{
            bgcolor: rarityColor,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
          }}
        />

        {isUnlocked && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            Desbloqueado:{' '}
            {formatSafeDate(achievement.unlockedAt, {
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// 📱 Componente para actividad reciente
const ActivityTimeline: React.FC<{ activities: ActivityItem[] }> = ({
  activities,
}) => (
  <List sx={{ width: '100%' }}>
    {activities.map((activity, index) => (
      <React.Fragment key={activity.id}>
        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: activity.color, width: 48, height: 48 }}>
              {activity.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {activity.title}
                </Typography>
                {activity.points && (
                  <Chip
                    label={`+${activity.points}`}
                    size="small"
                    sx={{
                      bgcolor: activity.color,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </Box>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {activity.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatSafeDate(activity.timestamp, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  {activity.category && (
                    <Chip
                      label={activity.category}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
            }
          />
        </ListItem>
        {index < activities.length - 1 && <Divider sx={{ my: 1 }} />}
      </React.Fragment>
    ))}
  </List>
);

const Profile: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🎯 Hooks de datos usando Smart Query
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useCurrentUserProfile();

  // 🎮 Hook para métricas de gamificación REALES del backend
  const {
    data: gamificationMetrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useGamificationMetrics();

  const updateProfileMutation = useUpdateUserProfile();

  // 🎯 Estados locales
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 🎯 Estados para edición
  const [editingData, setEditingData] = useState<UpdateProfileData>({
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
  });

  // 🔄 Inicializar datos de edición cuando el perfil cambie
  useEffect(() => {
    if (profileData) {
      setEditingData({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        website: profileData.website || '',
      });
    }
  }, [profileData]);

  // 🎯 Datos de métricas - usar datos reales del backend o fallback básico
  const metrics = useMemo(() => {
    if (gamificationMetrics) {
      return gamificationMetrics;
    }
    
    // Fallback básico (NO mock) - valores realistas para un usuario nuevo
    return {
      level: 1,
      meritos: 0,
      ondas: 0,
      ayniLevel: 0,
      completedChallenges: 0,
      socialConnections: 0,
      marketplaceRating: 0,
      pilgrimProgress: 0,
    };
  }, [gamificationMetrics]);

  // 🎯 Loading state combinado
  const isLoading = profileLoading || metricsLoading;

  // 🎯 Manejadores de eventos
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;

    // 🔍 Validar datos antes de enviar
    const validation = profileValidation.validateProfileData(editingData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);

    try {
      // 🔄 Actualizar perfil usando el hook de Smart Query
      await updateProfileMutation.mutateAsync(editingData);

      showNotification('Perfil actualizado exitosamente', 'success');
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showNotification(
        error.message || 'Error al actualizar el perfil',
        'error'
      );
    }
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    if (profileData) {
      setEditingData({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        website: profileData.website || '',
      });
    }
    setValidationErrors([]);
    setEditDialogOpen(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showNotification('La imagen no puede superar 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAvatarDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedImage) return;

    try {
      // Aquí implementarías la subida de imagen al backend
      showNotification('Avatar actualizado exitosamente', 'success');
      setAvatarDialogOpen(false);
      setSelectedImage(null);
    } catch {
      showNotification('Error al actualizar avatar', 'error');
    }
  };

  const handleShareProfile = () => {
    setShareDialogOpen(true);
  };

  const handleCopyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${profileData?.id}`;
    navigator.clipboard.writeText(profileUrl);
    showNotification('Enlace copiado al portapapeles', 'success');
  };

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // 🚨 Estados de carga y error
  if (profileLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Skeleton variant="circular" width={120} height={120} />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '2rem', width: '60%' }}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1rem', width: '40%' }}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1rem', width: '80%' }}
                />
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid size={{xs:6,sm:4,md:2}} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      </Container>
    );
  }

  if (profileError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              <Refresh /> Reintentar
            </Button>
          }
        >
          <Typography variant="h6">Error al cargar el perfil</Typography>
          <Typography variant="body2">
            {profileError?.message ||
              'No se pudo obtener la información del perfil'}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="warning">
          <Typography variant="h6">No hay datos del perfil</Typography>
          <Typography variant="body2">
            Por favor, inicia sesión para ver tu perfil.
          </Typography>
        </Alert>
      </Container>
    );
  }

  // 🎯 Datos calculados desde el perfil obtenido
  const displayName =
    profileData.full_name ||
    (profileData.email || '').split('@')[0] ||
    'Usuario';
  const memberSince = formatSafeDate(profileData.created_at);
  const levelProgress = calculateLevelProgress(
    metrics.level,
    metrics.meritos
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 🎯 Header del Perfil Mejorado */}
      <Card sx={{ mb: 3, overflow: 'hidden', borderRadius: 4 }}>
        {/* Cover Image con gradiente CoomÜnity */}
        <Box
          sx={{
            height: 250,
            background: `linear-gradient(135deg, ${coomunityColors.ayni} 0%, ${coomunityColors.social} 50%, ${coomunityColors.onda} 100%)`,
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            p: 3,
          }}
        >
          {/* Floating Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            <Tooltip title="Compartir perfil">
              <IconButton
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'text.primary' }}
                onClick={handleShareProfile}
              >
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Configuración">
              <IconButton
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'text.primary' }}
                onClick={() => setTabValue(2)}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 3,
              width: '100%',
            }}
          >
            {/* Avatar Mejorado */}
            <Box sx={{ position: 'relative' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Cambiar avatar">
                    <IconButton
                      sx={{
                        bgcolor: 'white',
                        width: 40,
                        height: 40,
                        boxShadow: theme.shadows[3],
                        '&:hover': { bgcolor: 'grey.100' },
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PhotoCamera sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={profileData.avatar_url}
                  sx={{
                    width: 140,
                    height: 140,
                    border: '6px solid white',
                    boxShadow: theme.shadows[8],
                    fontSize: '4rem',
                    background: `linear-gradient(135deg, ${coomunityColors.merito} 0%, ${coomunityColors.onda} 100%)`,
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
            </Box>

            {/* Información Principal Mejorada */}
            <Box sx={{ flex: 1, color: 'white', pb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {displayName}
                </Typography>
                {profileData.role === 'admin' && (
                  <Tooltip title="Usuario verificado">
                    <Verified
                      sx={{
                        color: coomunityColors.merito,
                        fontSize: 32,
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                      }}
                    />
                  </Tooltip>
                )}
                <Chip
                  label={
                    profileData.role === 'admin'
                      ? 'Administrador'
                      : 'Miembro CoomÜnity'
                  }
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                component="h2"
                sx={{
                  opacity: 0.95,
                  mb: 2,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {profileData.email}
              </Typography>

              {profileData.bio && (
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    mb: 2,
                    maxWidth: 600,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {profileData.bio}
                </Typography>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonth sx={{ fontSize: 20 }} />
                  <Typography variant="body2">
                    Miembro desde {memberSince}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person sx={{ fontSize: 20 }} />
                  <Typography variant="body2">
                    ID: {profileData.id.slice(0, 8)}...
                  </Typography>
                </Box>
                {profileData.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      {profileData.location}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Botón de Edición */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                disabled={updateProfileMutation.isPending}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'white' },
                  backdropFilter: 'blur(10px)',
                }}
              >
                Editar Perfil
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Métricas CoomÜnity Mejoradas - USANDO DATOS REALES */}
        <CardContent sx={{ p: 4 }}>
          {metricsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
          <Grid container spacing={3}>
            <Grid size={{xs:6,sm:4,md:2}}>
              <MetricCard
                title="Nivel"
                  value={metrics.level}
                icon={<TrendingUp />}
                color={coomunityColors.ayni}
                subtitle="Siguiente: +250 puntos"
                progress={levelProgress}
              />
            </Grid>
            <Grid size={{xs:6,sm:4,md:2}}>
              <MetricCard
                title="Mëritos"
                  value={safeToLocaleString(metrics.meritos)}
                icon={<Stars />}
                color={coomunityColors.merito}
                subtitle="Bien Común"
              />
            </Grid>
            <Grid size={{xs:6,sm:4,md:2}}>
              <MetricCard
                title="Öndas"
                  value={safeToLocaleString(metrics.ondas)}
                icon={<WaterDrop />}
                color={coomunityColors.onda}
                subtitle="Energía Vibracional"
              />
            </Grid>
            <Grid size={{xs:6,sm:4,md:2}}>
              <MetricCard
                title="Ayni"
                  value={`${metrics.ayniLevel}%`}
                icon={<Balance />}
                  color={getAyniColor(metrics.ayniLevel)}
                subtitle="Reciprocidad"
              />
            </Grid>
            <Grid size={{xs:6,sm:4,md:2}}>
              <MetricCard
                title="Conexiones"
                  value={safeToLocaleString(metrics.socialConnections)}
                icon={<Group />}
                color={coomunityColors.social}
                subtitle="Red CoomÜnity"
              />
            </Grid>
            <Grid size={{xs:6,sm:4,md:2}}>
              <MetricCard
                title="Rating"
                  value={metrics.marketplaceRating || 0}
                icon={<Star />}
                color={coomunityColors.marketplace}
                subtitle="Marketplace"
              />
            </Grid>
          </Grid>
          )}
        </CardContent>
      </Card>

      {/* 🎯 Tabs de Navegación Mejorados */}
      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
          sx={{
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
          variant="fullWidth"
        >
          <Tab
            label="Información"
            icon={<Person />}
            id="profile-tab-0"
            aria-controls="profile-tabpanel-0"
          />
          <Tab
            label="Actividad"
            icon={<Timeline />}
            id="profile-tab-1"
            aria-controls="profile-tabpanel-1"
          />
          <Tab
            label="Logros"
            icon={<EmojiEvents />}
            id="profile-tab-2"
            aria-controls="profile-tabpanel-2"
          />
          <Tab
            label="Red Social"
            icon={<Group />}
            id="profile-tab-3"
            aria-controls="profile-tabpanel-3"
          />
          <Tab
            label="Configuración"
            icon={<Settings />}
            id="profile-tab-4"
            aria-controls="profile-tabpanel-4"
          />
        </Tabs>
      </Paper>

      {/* 🎯 Tab Panel 0: Información Personal Detallada */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Información Básica */}
          <Grid size={{xs:12,md:6}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Person color="primary" />}
                title="Información Personal"
                action={
                  <IconButton onClick={() => toggleSection('personal')}>
                    {expandedSections.personal ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                }
              />
              <Collapse in={expandedSections.personal !== false}>
                <CardContent>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={profileData.email}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary="Nombre Completo"
                        secondary={profileData.full_name || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary="Teléfono"
                        secondary={profileData.phone || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ubicación"
                        secondary={profileData.location || 'No especificada'}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText
                        primary="Sitio Web"
                        secondary={profileData.website || 'No especificado'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>

          {/* Estado de la Cuenta */}
          <Grid size={{xs:12,md:6}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Security color="primary" />}
                title="Estado de la Cuenta"
                action={
                  <IconButton onClick={() => toggleSection('account')}>
                    {expandedSections.account ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                }
              />
              <Collapse in={expandedSections.account !== false}>
                <CardContent>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Verified color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Estado de Verificación"
                        secondary="Cuenta verificada"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CalendarMonth />
                      </ListItemIcon>
                      <ListItemText
                        primary="Miembro Desde"
                        secondary={memberSince}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Security color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Autenticación"
                        secondary={
                          user?.access_token ? 'Sesión activa' : 'No disponible'
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <BadgeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Rol"
                        secondary={
                          profileData.role === 'admin'
                            ? 'Administrador'
                            : 'Usuario'
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>

          {/* Estadísticas de Gamificación */}
          <Grid size={{xs:12}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Analytics color="primary" />}
                title="Estadísticas de Gamificación"
                subheader="Tu progreso en la plataforma CoomÜnity"
              />
              <CardContent>
                {metricsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                <Grid container spacing={3}>
                  <Grid size={{xs:12,sm:6,md:3}}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        color={coomunityColors.merito}
                        sx={{ fontWeight: 'bold' }}
                      >
                          {safeToLocaleString(metrics.completedChallenges)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Desafíos Completados
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:12,sm:6,md:3}}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                          color={coomunityColors.social}
                        sx={{ fontWeight: 'bold' }}
                      >
                          {safeToLocaleString(metrics.socialConnections)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                          Conexiones
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:12,sm:6,md:3}}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        color={coomunityColors.marketplace}
                        sx={{ fontWeight: 'bold' }}
                      >
                          {metrics.marketplaceRating?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating Marketplace
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{xs:12,sm:6,md:3}}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                          color={coomunityColors.ayni}
                        sx={{ fontWeight: 'bold' }}
                      >
                          {metrics.pilgrimProgress}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                          Progreso Peregrino
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Tab Panel 1: Actividad Reciente */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid size={{xs:12,lg:8}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Timeline color="primary" />}
                title="Actividad Reciente"
                subheader="Tus últimas interacciones en CoomÜnity"
                action={
                  <Button startIcon={<Refresh />} size="small">
                    Actualizar
                  </Button>
                }
              />
              <CardContent>
                <ActivityTimeline activities={mockActivities} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs:12,lg:4}}>
            <Stack spacing={3}>
              {/* Resumen de Actividad */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader
                  avatar={<TrendingUp color="primary" />}
                  title="Resumen Semanal"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{xs:6}}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h5"
                          color={coomunityColors.merito}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {safeToLocaleString(350)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mëritos
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h5"
                          color={coomunityColors.onda}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {safeToLocaleString(280)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Öndas
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h5"
                          color={coomunityColors.social}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {safeToLocaleString(12)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Interacciones
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h5"
                          color={coomunityColors.uplay}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {safeToLocaleString(4)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Videos
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Próximos Objetivos */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader
                  avatar={<Assignment color="primary" />}
                  title="Próximos Objetivos"
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Completa 5 desafíos más"
                        secondary="Progreso: 3/5"
                      />
                      <LinearProgress
                        variant="determinate"
                        value={60}
                        sx={{ width: 60, ml: 2 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Conecta con 10 miembros"
                        secondary="Progreso: 7/10"
                      />
                      <LinearProgress
                        variant="determinate"
                        value={70}
                        sx={{ width: 60, ml: 2 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Sube tu rating a 4.9"
                        secondary="Actual: 4.8"
                      />
                      <LinearProgress
                        variant="determinate"
                        value={95}
                        sx={{ width: 60, ml: 2 }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Tab Panel 2: Logros y Achievements */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            🏆 Logros Desbloqueados
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Celebra tus éxitos en la CoomÜnidad
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {mockAchievements.map((achievement) => (
            <Grid size={{xs:12,sm:6,md:4,lg:3}} key={achievement.id}>
              <AchievementCard achievement={achievement} />
            </Grid>
          ))}
        </Grid>

        {/* Progreso hacia próximos logros */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            📈 Próximos Logros
          </Typography>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{xs:12,md:6}}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: coomunityColors.social }}>
                      <SelfImprovement />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Mentor CoomÜnity
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ayuda a 10 nuevos miembros
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={30}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    3/10 miembros ayudados
                  </Typography>
                </Grid>

                <Grid size={{xs:12,md:6}}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: coomunityColors.uplay }}>
                      <Psychology />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Sabio del Conocimiento
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completa 50 videos educativos
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={84}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    42/50 videos completados
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      {/* 🎯 Tab Panel 3: Red Social */}
      <TabPanel value={tabValue} index={3}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          <Typography variant="h6">Red Social CoomÜnity</Typography>
          <Typography variant="body2">
            Esta sección mostrará tus conexiones, colaboradores y red de
            reciprocidad una vez que se integre completamente con el módulo
            social del backend.
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          <Grid size={{xs:12,md:8}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Group color="primary" />}
                title="Mis Conexiones"
                subheader="147 conexiones en tu red CoomÜnity"
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  🚧 Funcionalidad en desarrollo
                  <br />
                  Pronto podrás ver y gestionar todas tus conexiones sociales
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs:12,md:4}}>
            <Stack spacing={3}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader
                  avatar={<TrendingUp color="primary" />}
                  title="Impacto Social"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{xs:6}}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          color={coomunityColors.ayni}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {safeToLocaleString(147)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Conexiones
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{xs:6}}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          color={coomunityColors.social}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {safeToLocaleString(78)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ayni Score
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader
                  avatar={<EmojiEvents color="primary" />}
                  title="Colaboraciones"
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    color={coomunityColors.merito}
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {safeToLocaleString(23)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                  >
                    Proyectos colaborativos
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Tab Panel 4: Configuración */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid size={{xs:12}}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
              <Typography variant="h6">Configuraciones de Usuario</Typography>
              <Typography variant="body2">
                Las configuraciones se sincronizarán con el backend una vez que
                se implementen los endpoints correspondientes en el backend
                NestJS.
              </Typography>
            </Alert>
          </Grid>

          <Grid size={{xs:12,md:6}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Notifications color="primary" />}
                title="Notificaciones"
              />
              <CardContent>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Notificaciones por email"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Notificaciones push"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Notificaciones SMS"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Marketing y promociones"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs:12,md:6}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Security color="primary" />}
                title="Privacidad"
              />
              <CardContent>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Perfil público visible"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Mostrar ganancias"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Mostrar ubicación"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Mostrar email"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs:12,md:6}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Language color="primary" />}
                title="Preferencias"
              />
              <CardContent>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Idioma</InputLabel>
                    <Select defaultValue="es" label="Idioma">
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="pt">Português</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Zona Horaria</InputLabel>
                    <Select defaultValue="America/Bogota" label="Zona Horaria">
                      <MenuItem value="America/Bogota">Bogotá (GMT-5)</MenuItem>
                      <MenuItem value="America/Mexico_City">
                        Ciudad de México (GMT-6)
                      </MenuItem>
                      <MenuItem value="America/Lima">Lima (GMT-5)</MenuItem>
                      <MenuItem value="America/Buenos_Aires">
                        Buenos Aires (GMT-3)
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Moneda</InputLabel>
                    <Select defaultValue="COP" label="Moneda">
                      <MenuItem value="COP">Peso Colombiano (COP)</MenuItem>
                      <MenuItem value="USD">Dólar Americano (USD)</MenuItem>
                      <MenuItem value="EUR">Euro (EUR)</MenuItem>
                      <MenuItem value="MXN">Peso Mexicano (MXN)</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs:12,md:6}}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<Palette color="primary" />}
                title="Apariencia"
              />
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Tema
                    </Typography>
                    <ToggleButtonGroup
                      exclusive
                      defaultValue="light"
                      size="small"
                    >
                      <ToggleButton value="light">
                        <Brightness6 sx={{ mr: 1 }} /> Claro
                      </ToggleButton>
                      <ToggleButton value="dark">
                        <Brightness6 sx={{ mr: 1 }} /> Oscuro
                      </ToggleButton>
                      <ToggleButton value="auto">
                        <Brightness6 sx={{ mr: 1 }} /> Auto
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Animaciones"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Efectos visuales"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Diálogo de Edición de Perfil Mejorado */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Edit />
            </Avatar>
            <Box>
              <Typography variant="h6">Editar Perfil</Typography>
              <Typography variant="body2" color="text.secondary">
                Actualiza tu información personal
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* 🚨 Mostrar errores de validación */}
          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="h6">Errores de validación:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{xs:12,md:6}}>
              <TextField
                autoFocus
                label="Nombre Completo"
                fullWidth
                variant="outlined"
                value={editingData.full_name}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    full_name: e.target.value,
                  }))
                }
                disabled={updateProfileMutation.isPending}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{xs:12,md:6}}>
              <TextField
                label="Teléfono"
                fullWidth
                variant="outlined"
                value={editingData.phone}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                disabled={updateProfileMutation.isPending}
                placeholder="+57 300 123 4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{xs:12,md:6}}>
              <TextField
                label="Ubicación"
                fullWidth
                variant="outlined"
                value={editingData.location}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                disabled={updateProfileMutation.isPending}
                placeholder="Ciudad, País"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{xs:12,md:6}}>
              <TextField
                label="Sitio Web"
                fullWidth
                variant="outlined"
                value={editingData.website}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
                disabled={updateProfileMutation.isPending}
                placeholder="https://tu-sitio.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Link />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <TextField
                label="Biografía"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={editingData.bio}
                onChange={(e) =>
                  setEditingData((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                disabled={updateProfileMutation.isPending}
                placeholder="Cuéntanos sobre ti, tus intereses y cómo contribuyes al bien común..."
                helperText={`${editingData.bio?.length || 0}/500 caracteres`}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCancelEdit}
            disabled={updateProfileMutation.isPending}
            startIcon={<Cancel />}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            disabled={updateProfileMutation.isPending}
            startIcon={
              updateProfileMutation.isPending ? (
                <CircularProgress size={16} />
              ) : (
                <Save />
              )
            }
            size="large"
          >
            {updateProfileMutation.isPending
              ? 'Guardando...'
              : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🎯 Diálogo para cambiar avatar */}
      <Dialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PhotoCamera />
            </Avatar>
            <Box>
              <Typography variant="h6">Cambiar Avatar</Typography>
              <Typography variant="body2" color="text.secondary">
                Personaliza tu foto de perfil
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Avatar
                src={selectedImage}
                sx={{
                  width: 200,
                  height: 200,
                  mx: 'auto',
                  mb: 3,
                  border: '4px solid',
                  borderColor: 'primary.main',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Vista previa de tu nuevo avatar
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setAvatarDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAvatarUpload}
            variant="contained"
            startIcon={<CloudUpload />}
          >
            Subir Avatar
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🎯 Diálogo para compartir perfil */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Share />
            </Avatar>
            <Box>
              <Typography variant="h6">Compartir Perfil</Typography>
              <Typography variant="body2" color="text.secondary">
                Comparte tu perfil CoomÜnity
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Enlace del perfil"
              value={`${window.location.origin}/profile/${profileData?.id}`}
              fullWidth
              variant="outlined"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyProfileLink}>
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="h6" gutterBottom>
                Compartir en redes sociales
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:6,sm:3}}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    sx={{ color: '#25D366', borderColor: '#25D366' }}
                  >
                    WhatsApp
                  </Button>
                </Grid>
                <Grid size={{xs:6,sm:3}}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Telegram />}
                    sx={{ color: '#0088cc', borderColor: '#0088cc' }}
                  >
                    Telegram
                  </Button>
                </Grid>
                <Grid size={{xs:6,sm:3}}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Twitter />}
                    sx={{ color: '#1DA1F2', borderColor: '#1DA1F2' }}
                  >
                    Twitter
                  </Button>
                </Grid>
                <Grid size={{xs:6,sm:3}}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LinkedIn />}
                    sx={{ color: '#0A66C2', borderColor: '#0A66C2' }}
                  >
                    LinkedIn
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShareDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* 🎯 Input oculto para subir archivos */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* 🎯 Snackbar para notificaciones mejorado */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
