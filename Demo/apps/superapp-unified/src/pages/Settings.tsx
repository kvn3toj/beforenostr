import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Avatar,
  TextField,
  Grid,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  Lock,
  AccountCircle,
  Edit,
  Save,
  Cancel,
  Brightness4,
  Brightness7,
  VolumeUp,
  Email,
  Phone,
  LocationOn,
  ArrowForwardIos,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { LetsEducationTest } from '../components/test/LetsEducationTest';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      challenges: true,
      social: true,
      marketplace: true,
    },
    privacy: {
      profileVisible: true,
      showActivity: true,
      allowMessages: true,
    },
    preferences: {
      darkMode: false,
      language: 'es',
      soundEnabled: true,
      autoplay: false,
    },
  });

  const handleSettingChange = (
    category: string,
    setting: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        full_name: user?.full_name || '',
        email: user?.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({
        full_name: editForm.full_name,
        email: editForm.email,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      title: 'Perfil',
      icon: <AccountCircle />,
      content: (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={user?.avatar_url}
                alt={user?.full_name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                {isEditing ? (
                  <Box>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      value={editForm.full_name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                      sx={{ mb: 2 }}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      size="small"
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6">{user?.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                    <Chip
                      label={user?.role}
                      color="primary"
                      size="small"
                      sx={{ mt: 1, textTransform: 'capitalize' }}
                    />
                  </Box>
                )}
              </Box>
              <Box>
                {isEditing ? (
                  <Box>
                    <IconButton
                      onClick={handleSaveProfile}
                      color="primary"
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleEditToggle} disabled={loading}>
                      <Cancel />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={handleEditToggle} color="primary">
                    <Edit />
                  </IconButton>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ),
    },
    {
      title: 'Notificaciones',
      icon: <Notifications />,
      content: (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notificaciones
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Notificaciones por email"
                  secondary="Recibir notificaciones importantes por correo"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'email',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText
                  primary="Notificaciones push"
                  secondary="Notificaciones en tiempo real en el navegador"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'push',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Desafíos y logros"
                  secondary="Notificaciones sobre tus desafíos y méritos"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.challenges}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'challenges',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      ),
    },
    {
      title: 'Privacidad',
      icon: <Lock />,
      content: (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Privacidad y seguridad
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText
                  primary="Perfil visible"
                  secondary="Permite que otros usuarios vean tu perfil"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onChange={(e) =>
                        handleSettingChange(
                          'privacy',
                          'profileVisible',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary="Mostrar actividad"
                  secondary="Mostrar tu actividad reciente a otros usuarios"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy.showActivity}
                      onChange={(e) =>
                        handleSettingChange(
                          'privacy',
                          'showActivity',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      ),
    },
    {
      title: 'Preferencias',
      icon: <Palette />,
      content: (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preferencias de la aplicación
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  {settings.preferences.darkMode ? (
                    <Brightness4 />
                  ) : (
                    <Brightness7 />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Modo oscuro"
                  secondary="Cambia el tema de la aplicación"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.preferences.darkMode}
                      onChange={(e) =>
                        handleSettingChange(
                          'preferences',
                          'darkMode',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <VolumeUp />
                </ListItemIcon>
                <ListItemText
                  primary="Sonidos habilitados"
                  secondary="Reproducir sonidos de notificaciones"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.preferences.soundEnabled}
                      onChange={(e) =>
                        handleSettingChange(
                          'preferences',
                          'soundEnabled',
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ ml: 'auto' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText primary="Idioma" secondary="Español (ES)" />
                <IconButton>
                  <ArrowForwardIos />
                </IconButton>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: 3,
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Configuración
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Personaliza tu experiencia en CoomÜnity ajustando estas configuraciones
        según tus preferencias.
      </Alert>

      {settingSections.map((section, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {section.icon}
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 500 }}>
              {section.title}
            </Typography>
          </Box>
          {section.content}
        </Box>
      ))}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="error">
            Zona de peligro
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Estas acciones son irreversibles. Procede con precaución.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (
                window.confirm(
                  '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
                )
              ) {
                alert(
                  'Funcionalidad de eliminación de cuenta no implementada en demo.'
                );
              }
            }}
          >
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>

      {/* Componente de prueba temporal para LETS Education Context */}
      <LetsEducationTest />
    </Box>
  );
};

export default Settings;
