import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContentItem } from '../../../services/contentItem.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useDeleteContentItemMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteContentItem(id),
    onSuccess: () => {
      toast.success(t('toast_content_item_deleted_success', 'Content item deleted successfully'));
      queryClient.invalidateQueries({ queryKey: ['contentItems'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_deleting_content_item', 'Error deleting content item: {{message}}', { message: errorMessage }));
    },
  });
};

export const useBulkDeleteContentItemsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map(id => deleteContentItem(id))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return { successful, failed, total: ids.length };
    },
    onSuccess: (result) => {
      if (result.failed === 0) {
        toast.success(t('toast_bulk_delete_success', '{{count}} items deleted successfully', { count: result.successful }));
      } else {
        toast.warning(t('toast_bulk_delete_partial', '{{successful}} items deleted, {{failed}} failed', { 
          successful: result.successful, 
          failed: result.failed 
        }));
      }
      queryClient.invalidateQueries({ queryKey: ['contentItems'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_bulk_deleting', 'Error during bulk deletion: {{message}}', { message: errorMessage }));
    },
  });
}; 