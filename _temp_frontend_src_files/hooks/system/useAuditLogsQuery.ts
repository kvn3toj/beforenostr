import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs, FetchAuditLogsParams, AuditLog } from '../../services/auditLog.service';

export const useAuditLogsQuery = (params: FetchAuditLogsParams) => {
  return useQuery<{ data: AuditLog[]; count: number }, Error>({
    queryKey: ['admin', 'auditLogs', params],
    queryFn: () => fetchAuditLogs(params),
  });
}; 