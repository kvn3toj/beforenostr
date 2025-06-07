import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Person, Psychology } from '@mui/icons-material';
import { personalityService, type Personality } from '../services/personality.service';
import { userService, type User } from '../services/user.service';

interface AssignUserPersonalityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  userId: string;
  personalityId: string;
}

export const AssignUserPersonalityModal: React.FC<AssignUserPersonalityModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      userId: '',
      personalityId: ''
    }
  });

  const selectedPersonalityId = watch('personalityId');
  const selectedPersonality = personalities.find(p => p.id === selectedPersonalityId);

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [personalitiesData, usersData] = await Promise.all([
        personalityService.getAllPersonalities(),
        userService.getUsers()
      ]);
      
      setPersonalities(personalitiesData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);

    try {
      // Usar el endpoint de personalidades para asignar
      await personalityService.assignToUser({
        userId: data.userId,
        personalityId: data.personalityId
      });

      // Mostrar éxito y cerrar modal
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error('Error assigning personality:', err);
      setError('Error al asignar la personalidad. Por favor, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const parseTraits = (traitsJson: string) => {
    try {
      return JSON.parse(traitsJson);
    } catch {
      return {};
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        Asignar Personalidad a Usuario
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Selector de Usuario */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Usuario</InputLabel>
              <Controller
                name="userId"
                control={control}
                rules={{ required: 'Selecciona un usuario' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Usuario"
                    error={!!errors.userId}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person />
                          <Box>
                            <Typography variant="body2">
                              {user.name || 'Sin nombre'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.userId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.userId.message}
                </Typography>
              )}
            </FormControl>

            {/* Selector de Personalidad */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Personalidad</InputLabel>
              <Controller
                name="personalityId"
                control={control}
                rules={{ required: 'Selecciona una personalidad' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Personalidad"
                    error={!!errors.personalityId}
                  >
                    {personalities.map((personality) => (
                      <MenuItem key={personality.id} value={personality.id}>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {personality.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {personality.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.personalityId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.personalityId.message}
                </Typography>
              )}
            </FormControl>

            {/* Vista previa de la personalidad seleccionada */}
            {selectedPersonality && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Vista previa: {selectedPersonality.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedPersonality.description}
                </Typography>
                
                {/* Mostrar traits si están disponibles */}
                {selectedPersonality.traits && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Características:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.entries(parseTraits(selectedPersonality.traits)).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading || submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <Psychology />}
        >
          {submitting ? 'Asignando...' : 'Asignar Personalidad'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 