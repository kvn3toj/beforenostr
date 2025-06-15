import { useMutation, useQueryClient } from '@tanstack/react-query';
import { initiateManualBackup } from '../../services/system.service';
import { toast } from 'sonner';

export const useInitiateBackupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateManualBackup,
    onSuccess: (data) => {
      toast.success(data.message || 'Backup manual iniciado con éxito');
      // Invalidate queries relacionadas con backups y audit logs
      queryClient.invalidateQueries({ queryKey: ['system', 'recentBackups'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'auditLogs'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al iniciar backup: ${error.message}`);
    }
  });
}; 