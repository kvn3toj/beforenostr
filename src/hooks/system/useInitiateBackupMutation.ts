import { useMutation, useQueryClient } from '@tanstack/react-query';
import { initiateManualBackup } from '../../services/system.service';
import { toast } from 'sonner';

export const useInitiateBackupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateManualBackup,
    onSuccess: (data) => {
      toast.success(data.message || 'Backup manual iniciado con éxito');
      // Invalidate the recent backups query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['system', 'recentBackups'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al iniciar backup: ${error.message}`);
    }
  });
}; 