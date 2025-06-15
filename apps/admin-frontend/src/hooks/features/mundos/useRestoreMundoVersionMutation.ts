import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreMundoVersion } from '../../../services/mundo.service';
import { Mundo } from '../../../types/mundo.types';
import { toast } from 'sonner';

interface RestoreMundoVersionInput {
  mundoId: string;
  versionId: string;
}

export const useRestoreMundoVersionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Mundo, Error, RestoreMundoVersionInput>({
    mutationFn: ({ mundoId, versionId }) => restoreMundoVersion(mundoId, versionId),
    onSuccess: (data, variables) => {
      toast.success('Versión restaurada con éxito');
      
      // Invalidate and refetch the mundo and its versions
      queryClient.invalidateQueries({ queryKey: ['mundos', variables.mundoId] });
      queryClient.invalidateQueries({ queryKey: ['mundos', variables.mundoId, 'versions'] });
    },
    onError: (error) => {
      toast.error(`Error al restaurar la versión: ${error.message}`);
    },
  });
}; 