import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFolder, CreateFolderData } from '../../../services/folder.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { useAuth } from '../../useAuth';
import { PlaylistFolder } from '../../../types/folder.types';

interface CreateFolderMutationData {
  data: CreateFolderData;
  userId: string;
}

export const useCreateFolderMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<PlaylistFolder, Error, CreateFolderMutationData>({
    mutationFn: async ({ data, userId }: CreateFolderMutationData) => {
      return await createFolder(data, userId);
    },
    onSuccess: (data, variables) => {
      toast.success(t('toast_folder_created_success'));
      // Invalidate folders query for the specific mundo
      queryClient.invalidateQueries({
        queryKey: ['folders', variables.data.mundo_id]
      });
    },
    onError: (error: Error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_creating_folder', { message: errorMessage }));
    }
  });
}; 