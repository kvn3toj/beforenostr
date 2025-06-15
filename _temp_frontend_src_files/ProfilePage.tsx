import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCurrentUserQuery } from '../hooks/useCurrentUserQuery';
import { UserForm } from '../components/features/users/components/UserForm';
import { updateUser } from '../services/user.service';
import { UpdateUserData } from '../types/user.types';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, isError, error } = useCurrentUserQuery();
  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => updateUser(id, data),
    onSuccess: () => {
      toast.success(t('profile_updated_successfully') || 'Perfil actualizado correctamente');
      setIsEditing(false);
      // Invalidate both the current user query and the users list
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(t('profile_update_error') || `Error al actualizar perfil: ${error.message}`);
    },
  });

  const handleEditSubmit = (formData: UpdateUserData) => {
    if (user) {
      updateUserMutation({ id: user.id, data: formData });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          {error?.message || t('profile_load_error') || 'Error al cargar el perfil'}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="warning">
          {t('profile_not_found') || 'No se pudo cargar la información del perfil'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section - Más compacto */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '2rem',
                fontWeight: 'bold',
                border: '3px solid rgba(255,255,255,0.3)'
              }}
            >
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {t('my_profile') || 'Mi Perfil'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {user.name || user.email}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t('manage_profile_info') || 'Gestiona tu información personal'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant={isEditing ? "outlined" : "contained"}
            color={isEditing ? "error" : "inherit"}
            size="large"
            startIcon={isEditing ? undefined : <EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
            disabled={isUpdating}
            sx={{
              bgcolor: isEditing ? 'transparent' : 'rgba(255,255,255,0.2)',
              color: 'white',
              borderColor: isEditing ? 'rgba(255,255,255,0.5)' : 'transparent',
              '&:hover': {
                bgcolor: isEditing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
              },
              px: 3,
              py: 1.5
            }}
          >
            {isEditing ? (t('cancel') || 'Cancelar') : (t('edit_profile') || 'Editar Perfil')}
          </Button>
        </Box>
      </Paper>

      {isEditing ? (
        /* Edit Mode - Más compacto */
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
            {t('edit_profile_info') || 'Editar Información del Perfil'}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <UserForm
            onSubmit={handleEditSubmit}
            isLoading={isUpdating}
            onClose={() => setIsEditing(false)}
            defaultValues={{
              email: user.email,
              name: user.name,
              avatarUrl: user.avatarUrl,
              isActive: user.isActive,
            }}
            isEdit={true}
          />
        </Paper>
      ) : (
        /* View Mode - Layout mejorado */
        <Grid container spacing={3}>
          {/* Personal Information Card - Más ancho */}
          <Grid item xs={12} lg={8}>
            <Card elevation={2} sx={{ height: 'fit-content', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <PersonIcon color="primary" fontSize="large" />
                  <Typography variant="h6" fontWeight="bold">
                    {t('personal_information') || 'Información Personal'}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <EmailIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {t('email') || 'Email'}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {t('name') || 'Nombre'}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {user.name || t('not_specified') || 'No especificado'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <BadgeIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {t('role') || 'Rol'}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.role?.name || t('no_role_assigned') || 'Sin rol asignado'}
                        color="primary"
                        size="medium"
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <SecurityIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {t('status') || 'Estado'}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.isActive ? (t('active') || 'Activo') : (t('inactive') || 'Inactivo')}
                        color={user.isActive ? 'success' : 'error'}
                        size="medium"
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Information Card - Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Account Info */}
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <CalendarTodayIcon color="primary" fontSize="large" />
                    <Typography variant="h6" fontWeight="bold">
                      {t('account_information') || 'Información de Cuenta'}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
                      <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                        {t('member_since') || 'Miembro desde'}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {user.createdAt 
                          ? format(new Date(user.createdAt), 'PPP', { locale: es })
                          : t('not_available') || 'No disponible'}
                      </Typography>
                    </Box>

                    {user.updatedAt && (
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" gutterBottom>
                          {t('last_updated') || 'Última actualización'}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {format(new Date(user.updatedAt), 'PPp', { locale: es })}
                        </Typography>
                      </Box>
                    )}

                    {user.lastLogin && (
                      <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                        <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom>
                          {t('last_login') || 'Último acceso'}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {format(new Date(user.lastLogin), 'PPp', { locale: es })}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('account_actions') || 'Acciones de Cuenta'}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('account_actions_description') || 'Gestiona configuraciones adicionales de tu cuenta.'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Stack spacing={2} width="100%">
                    <Button 
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        // TODO: Implement change password functionality
                        toast.info(t('feature_coming_soon') || 'Funcionalidad próximamente disponible');
                      }}
                    >
                      {t('change_password') || 'Cambiar Contraseña'}
                    </Button>
                    <Button 
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        // TODO: Implement export data functionality
                        toast.info(t('feature_coming_soon') || 'Funcionalidad próximamente disponible');
                      }}
                    >
                      {t('export_data') || 'Exportar Datos'}
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}; 