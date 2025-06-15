import { useQuery } from '@tanstack/react-query';
import { fetchConfigs, fetchConfigById, fetchConfigByKey, FetchConfigsParams, AppConfig } from '../../services/config.service';

export const useConfigsQuery = (params: FetchConfigsParams = {}) => {
  return useQuery<AppConfig[], Error>({
    queryKey: ['admin', 'configs', params],
    queryFn: () => fetchConfigs(params),
  });
};

export const useConfigByIdQuery = (id: string) => {
  return useQuery<AppConfig, Error>({
    queryKey: ['admin', 'config', id],
    queryFn: () => fetchConfigById(id),
    enabled: !!id,
  });
};

export const useConfigByKeyQuery = (key: string) => {
  return useQuery<AppConfig, Error>({
    queryKey: ['admin', 'config', 'key', key],
    queryFn: () => fetchConfigByKey(key),
    enabled: !!key,
  });
}; 