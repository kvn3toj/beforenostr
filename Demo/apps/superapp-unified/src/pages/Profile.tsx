import React, { useState, useEffect } from 'react';
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
  Rating,
  Slider,
  Skeleton,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Edit,
  Settings,
  Security,
  Notifications,
  Work,
  School,
  LocationOn,
  Language,
  Visibility,
  VisibilityOff,
  Star,
  TrendingUp,
  EmojiEvents,
  Group,
  LocalAtm,
  AccountBalance,
  PhotoCamera,
  Phone,
  Email,
  CalendarMonth,
  Verified,
  PublicOff,
  Public,
  LockOpen,
  Lock,
  Analytics,
  Timeline,
  BusinessCenter,
  SportsEsports,
  VideoLibrary,
  Palette,
  Save,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { 
  useCurrentUserProfile, 
  useUpdateUserProfile, 
  profileValidation,
  UpdateProfileData 
} from '../hooks/useUserProfile';

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
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Profile: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // 🎯 Hooks de datos usando Smart Query
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    error: profileError 
  } = useCurrentUserProfile();
  
  const updateProfileMutation = useUpdateUserProfile();
  
  // 🎯 Estados locales
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 🎯 Estados para edición
  const [editingData, setEditingData] = useState<UpdateProfileData>({
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    website: ''
  });

  // 🔄 Inicializar datos de edición cuando el perfil cambie
  useEffect(() => {
    if (profileData) {
      setEditingData({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        website: profileData.website || ''
      });
    }
  }, [profileData]);

  // 🎯 Manejadores de eventos
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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

      setSnackbarMessage('Perfil actualizado exitosamente');
      setSnackbarOpen(true);
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setSnackbarMessage(error.message || 'Error al actualizar el perfil');
      setSnackbarOpen(true);
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
        website: profileData.website || ''
      });
    }
    setValidationErrors([]);
    setEditDialogOpen(false);
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
                <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={6} sm={3} key={index}>
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
        <Alert severity="error">
          <Typography variant="h6">Error al cargar el perfil</Typography>
          <Typography variant="body2">
            {profileError?.message || 'No se pudo obtener la información del perfil'}
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
  const displayName = profileData.full_name || profileData.email?.split('@')[0] || 'Usuario';
  const memberSince = new Date(profileData.created_at).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 🎯 Header del Perfil con datos reales */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        {/* Cover Image */}
        <Box 
          sx={{ 
            height: 200, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%' }}>
            {/* Avatar */}
            <Avatar
              src={profileData.avatar_url}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid white',
                boxShadow: theme.shadows[3],
                fontSize: '3rem'
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            
            {/* Información Principal */}
            <Box sx={{ flex: 1, color: 'white', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                  {displayName}
                </Typography>
                {profileData.role === 'admin' && (
                  <Verified sx={{ color: '#1DA1F2', fontSize: 28 }} />
                )}
                <Chip 
                  label={profileData.role === 'admin' ? 'Administrador' : 'Miembro'}
                  sx={{ 
                    bgcolor: profileData.role === 'admin' ? 'rgba(29,161,242,0.2)' : 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Typography variant="h6" component="h2" sx={{ opacity: 0.9, mb: 1 }}>
                {profileData.email}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonth sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    Miembro desde {memberSince}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    ID: {profileData.id.slice(0, 8)}...
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Botones de Acción */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                onClick={handleEditProfile}
                disabled={updateProfileMutation.isPending}
              >
                <Edit />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <PhotoCamera />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        {/* Stats Rápidas - Con datos reales disponibles */}
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                  {profileData.stats?.level || 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">Nivel</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {profileData.stats?.points || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Puntos</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {profileData.stats?.completedTasks || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Tareas Completadas</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="info.main" sx={{ fontWeight: 'bold' }}>
                  {user.role === 'admin' ? '∞' : '100'}
                </Typography>
                <Typography variant="body2" color="text.secondary">Límite Acciones</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 🎯 Tabs de Navegación */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
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
            label="Configuración" 
            icon={<Settings />}
            id="profile-tab-2"
            aria-controls="profile-tabpanel-2"
          />
        </Tabs>
      </Box>

      {/* 🎯 Tab Panel 0: Información Personal */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Información Básica */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Person color="primary" />
                  <Typography variant="h6" component="h3" color="primary">
                    Información Personal
                  </Typography>
                </Box>
                
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
                      <CalendarMonth />
                    </ListItemIcon>
                    <ListItemText
                      primary="Miembro Desde"
                      secondary={memberSince}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Rol"
                      secondary={profileData.role === 'admin' ? 'Administrador' : 'Usuario'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Configuración Rápida */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Settings color="primary" />
                  <Typography variant="h6" component="h3" color="primary">
                    Estado de la Cuenta
                  </Typography>
                </Box>
                
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
                      <Security color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Token de Autenticación"
                      secondary={user?.access_token ? 'Activo' : 'No disponible'}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Public color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Perfil Público"
                      secondary="Visible para otros usuarios"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Tab Panel 1: Actividad (Placeholder) */}
      <TabPanel value={tabValue} index={1}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">Módulo de Actividad</Typography>
          <Typography variant="body2">
            Esta sección mostrará el historial de actividades del usuario una vez que se conecte 
            completamente con los endpoints del backend de estadísticas y actividades.
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  🚧 Próximamente: Historial de Actividades
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  - Actividades en Marketplace<br/>
                  - Participación en ÜPlay<br/>
                  - Interacciones sociales<br/>
                  - Progreso en Pilgrim Journey
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Tab Panel 2: Configuración */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6">Configuraciones de Usuario</Typography>
              <Typography variant="body2">
                Las configuraciones se sincronizarán con el backend una vez que se implementen 
                los endpoints correspondientes en el backend NestJS.
              </Typography>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  🔔 Notificaciones
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configuración pendiente de integración con backend
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  🔒 Privacidad
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configuración pendiente de integración con backend
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 🎯 Diálogo de Edición de Perfil */}
      <Dialog open={editDialogOpen} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit color="primary" />
            Editar Perfil
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* 🚨 Mostrar errores de validación */}
          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6">Errores de validación:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Nombre Completo"
            fullWidth
            variant="outlined"
            value={editingData.full_name}
            onChange={(e) => setEditingData(prev => ({
              ...prev,
              full_name: e.target.value
            }))}
            sx={{ mb: 2 }}
            disabled={updateProfileMutation.isPending}
          />
          <TextField
            margin="dense"
            label="Bio"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={editingData.bio}
            onChange={(e) => setEditingData(prev => ({
              ...prev,
              bio: e.target.value
            }))}
            sx={{ mb: 2 }}
            disabled={updateProfileMutation.isPending}
            placeholder="Cuéntanos sobre ti..."
          />
          <TextField
            margin="dense"
            label="Ubicación"
            fullWidth
            variant="outlined"
            value={editingData.location}
            onChange={(e) => setEditingData(prev => ({
              ...prev,
              location: e.target.value
            }))}
            sx={{ mb: 2 }}
            disabled={updateProfileMutation.isPending}
            placeholder="Ciudad, País"
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            variant="outlined"
            value={editingData.phone}
            onChange={(e) => setEditingData(prev => ({
              ...prev,
              phone: e.target.value
            }))}
            disabled={updateProfileMutation.isPending}
            placeholder="+57 300 123 4567"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelEdit} 
            disabled={updateProfileMutation.isPending}
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained"
            disabled={updateProfileMutation.isPending}
            startIcon={updateProfileMutation.isPending ? <CircularProgress size={16} /> : <Save />}
          >
            {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🎯 Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}; 