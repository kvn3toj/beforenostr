import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConfig, updateConfig, deleteConfig, CreateConfigDto, UpdateConfigDto, AppConfig } from '../../services/config.service';

export const useCreateConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AppConfig, Error, CreateConfigDto>({
    mutationFn: createConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
    },
  });
};

export const useUpdateConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AppConfig, Error, { id: string; data: UpdateConfigDto }>({
    mutationFn: ({ id, data }) => updateConfig(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'config', data.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'config', 'key', data.key] });
    },
  });
};

export const useDeleteConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AppConfig, Error, string>({
    mutationFn: deleteConfig,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      queryClient.removeQueries({ queryKey: ['admin', 'config', data.id] });
      queryClient.removeQueries({ queryKey: ['admin', 'config', 'key', data.key] });
    },
  });
}; 