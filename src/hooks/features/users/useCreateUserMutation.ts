import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../../services/user.service';
import { CreateUserData } from '../../../types/user.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { analyticsService } from '../../../services/analytics.service';

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: (response, variables) => {
      toast.success(t('toast_user_created_success'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Track successful user creation
      analyticsService.trackUserCreationFunnel('USER_CREATION_SUCCESS', {
        userId: response?.id || 'unknown',
        userEmail: variables.email,
        hasRole: !!variables.roleId,
        userStatus: variables.status || 'ACTIVE',
        timestamp: new Date().toISOString()
      });
    },
    onError: (error: any, variables) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_create_user_error', { message: errorMessage }));
      
      // Track failed user creation
      analyticsService.trackUserCreationFunnel('USER_CREATION_FAILED', {
        errorMessage,
        userEmail: variables.email,
        errorCode: error?.response?.status || 'unknown',
        timestamp: new Date().toISOString()
      });
    },
  });
}; 