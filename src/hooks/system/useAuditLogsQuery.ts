import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs, FetchAuditLogsParams } from '../../services/system.service';
import { AuditLog } from '../../types/system.types';

export const useAuditLogsQuery = (params: FetchAuditLogsParams) => {
  return useQuery<{ data: AuditLog[]; count: number }, Error>({
    queryKey: ['system', 'auditLogs', params],
    queryFn: () => fetchAuditLogs(params),
  });
}; 