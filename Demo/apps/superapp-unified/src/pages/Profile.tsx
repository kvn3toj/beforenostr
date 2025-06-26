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
  Spa,
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
import {
  MarketplaceReviewModal,
  ReviewData,
} from '../components/modules/marketplace/components/MarketplaceReviewModal';

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
  status?: 'completed' | 'pending' | 'cancelled';
  isReviewed?: boolean;
  sellerName?: string;
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
const ActivityTimeline: React.FC<{
  activities: ActivityItem[];
  onReview: (activity: ActivityItem) => void;
}> = ({ activities, onReview }) => (
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
              <Box component="div">
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  {activity.description}
                </Typography>
                <Box
                  component="span"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Typography
                    variant="caption"
                    component="span"
                    color="text.secondary"
                  >
                    {formatSafeDate(activity.timestamp, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  {activity.category && (
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        height: 20,
                        textAlign: 'center'
                      }}
                    >
                      {activity.category}
                    </Box>
                  )}
                </Box>
              </Box>
            }
          />
          {activity.type === 'marketplace' &&
            activity.status === 'completed' &&
            !activity.isReviewed && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Spa />}
                onClick={() => onReview(activity)}
                sx={{ ml: 2, alignSelf: 'center' }}
              >
                Compartir Ayni
              </Button>
            )}
        </ListItem>
        {index < activities.length - 1 && <Divider sx={{ my: 1 }} />}
      </React.Fragment>
    ))}
  </List>
);

// Utilidad para accesibilidad de tabs
function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

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

  // TODO: Conectar con datos reales del backend
  // Se deben implementar y usar los hooks para obtener la actividad y los logros del usuario.
  // Ejemplo:
  // const { data: userActivities, isLoading: activitiesLoading } = useUserActivity();
  // const { data: userAchievements, isLoading: achievementsLoading } = useUserAchievements();
  const userActivities: ActivityItem[] = []; // Reemplazar con datos del hook
  const userAchievements: Achievement[] = []; // Reemplazar con datos del hook

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

  // ✨ Estados para el modal de valoración
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityItem | null>(null);

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

//     // Fallback básico (NO mock) - valores realistas para un usuario nuevo
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

  // ✨ Manejadores para el flujo de valoración
  const handleRequestReview = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    if (!selectedActivity) return;
    // Aquí iría la llamada a la API para enviar la valoración
    console.log(
      `Enviando valoración para la actividad ${selectedActivity.id}:`,
      reviewData
    );
    showNotification('Gracias por compartir tu Ayni y nutrir la CoomÜnity.', 'success');
    // Idealmente, se debería actualizar el estado de la actividad a `isReviewed: true`
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
                <Grid item xs={6} sm={4} md={2} key={index}>
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
    <>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 🎯 Header del Perfil Mejorado */}
        <Card sx={{ mb: 3, overflow: 'hidden', borderRadius: 4 }}>
          <Box sx={{ position: 'relative', height: 200 }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                opacity: 0.8,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                color: 'common.white',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Avatar
                src={profileData.avatar_url || ''}
                alt={displayName}
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid',
                  borderColor: 'common.white',
                  mr: 2,
                }}
              />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 'bold' }}
                >
                  {displayName}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Miembro desde {memberSince}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* SECCIÓN DE MÉTRICAS */}
          <CardContent sx={{ p: 4 }}>
            {metricsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={6} sm={4} md={2}>
                  <MetricCard
                    title="Nivel"
                    value={metrics.level}
                    icon={<TrendingUp />}
                    color={coomunityColors.ayni}
                    subtitle="Siguiente: +250 puntos"
                    progress={levelProgress}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <MetricCard
                    title="Mëritos"
                    value={safeToLocaleString(metrics.meritos)}
                    icon={<Stars />}
                    color={coomunityColors.merito}
                    subtitle="Bien Común"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <MetricCard
                    title="Öndas"
                    value={safeToLocaleString(metrics.ondas)}
                    icon={<WaterDrop />}
                    color={coomunityColors.onda}
                    subtitle="Energía Vibracional"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <MetricCard
                    title="Ayni"
                    value={`${metrics.ayniLevel}%`}
                    icon={<Balance />}
                    color={getAyniColor(metrics.ayniLevel)}
                    subtitle="Reciprocidad"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <MetricCard
                    title="Conexiones"
                    value={safeToLocaleString(metrics.socialConnections)}
                    icon={<Group />}
                    color={coomunityColors.social}
                    subtitle="Red CoomÜnity"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
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

        {/* Pestañas de Navegación del Perfil */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="perfil tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Información" {...a11yProps(0)} />
            <Tab label="Actividad" {...a11yProps(1)} />
            <Tab label="Logros" {...a11yProps(2)} />
            <Tab label="Marketplace" {...a11yProps(3)} />
            <Tab label="Configuración" {...a11yProps(4)} />
          </Tabs>
        </Box>

        {/* Paneles de Contenido */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Información Básica */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información de Contacto
                  </Typography>
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
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary="Teléfono"
                        secondary={profileData.phone || 'No especificado'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            {/* Biografía */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Biografía
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData.bio || 'Aún no has compartido tu historia.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Actividad Reciente
          </Typography>
          <ActivityTimeline
            activities={userActivities}
            onReview={handleRequestReview}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Logros Desbloqueados
          </Typography>
          <Grid container spacing={2}>
            {userAchievements.map((achievement, idx) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id || idx}>
                <AchievementCard achievement={achievement} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography>Vista del Marketplace del usuario.</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography>Opciones de configuración.</Typography>
        </TabPanel>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      {/* ✨ Render del Modal de Valoración ✨ */}
      <MarketplaceReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        productName={selectedActivity?.title || 'este intercambio'}
        sellerName={selectedActivity?.sellerName || 'el vendedor'}
      />
    </>
  );
};

export default Profile;
