import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUserQuery } from '../hooks/useUserQuery';
import { UserForm } from '../components/features/users/components/UserForm';
import { updateUser } from '../services/user.service';
import { UpdateUserData } from '../types/user.types';

export const UserDetailPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError, error } = useUserQuery(userId);
  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => updateUser(id, data),
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
      setIsEditing(false);
      // Invalidate both the specific user query and the users list
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar usuario: ${error.message}`);
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error?.message || 'Error al cargar los datos del usuario'}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          No se encontró el usuario solicitado
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Detalles de Usuario
        </Typography>
        <Button
          variant={isEditing ? "outlined" : "contained"}
          color={isEditing ? "error" : "primary"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </Box>

      {isEditing ? (
        <Paper sx={{ p: 3 }}>
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
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.email}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Rol
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.role?.name || 'Sin rol asignado'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.name || 'No especificado'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Estado
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.isActive ? 'Activo' : 'Inactivo'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Fecha de Creación
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>

            {user.updatedAt && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Última Actualización
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Container>
  );
}; 