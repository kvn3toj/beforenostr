import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button } from '@mui/material';

const profileSchema = z.object({
  name: z.string().min(1, 'Requerido'),
  picture: z.string().url('Debe ser una URL válida').optional(),
  about: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = ({ onSubmit }: { onSubmit: (data: ProfileFormData) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Nombre"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Foto de perfil"
        {...register('picture')}
        error={!!errors.picture}
        helperText={errors.picture?.message}
      />
      <TextField
        label="Acerca de"
        {...register('about')}
        multiline
        rows={3}
        error={!!errors.about}
        helperText={errors.about?.message}
      />
      <Button type="submit" variant="contained">
        Actualizar Perfil
      </Button>
    </Box>
  );
}; 