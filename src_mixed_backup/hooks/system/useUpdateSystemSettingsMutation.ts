import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSystemSettings } from '../../services/system.service';
import type { SystemSettings, UpdateSystemSettingsData } from '../../types/system.types';
import { toast } from 'sonner';

type UpdateSettingsInput = {
  id: string;
  data: UpdateSystemSettingsData;
};

export const useUpdateSystemSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SystemSettings, Error, UpdateSettingsInput>({
    mutationFn: ({ id, data }) => updateSystemSettings(id, data),
    onSuccess: () => {
      toast.success('Configuración actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['system', 'settings'] });
    },
    onError: (error) => {
      toast.error(`Error al actualizar la configuración: ${error.message}`);
    },
  });
}; 