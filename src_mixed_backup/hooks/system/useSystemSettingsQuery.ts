import { useQuery } from '@tanstack/react-query';
import { fetchSystemSettings } from '../../services/system.service';
import type { SystemSettings } from '../../types/system.types';

export const useSystemSettingsQuery = () => {
  return useQuery<SystemSettings>({
    queryKey: ['system', 'settings'],
    queryFn: fetchSystemSettings,
  });
}; 