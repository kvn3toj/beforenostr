import { useQuery } from '@tanstack/react-query';
import { fetchTopInteractedContent } from '../../services/analytics.service';
import { TopInteractedContentMetric } from '../../types/analytics.types';

export const useTopInteractedContentQuery = () => {
  return useQuery<TopInteractedContentMetric>({
    queryKey: ['analytics', 'topInteractedContent'],
    queryFn: fetchTopInteractedContent,
  });
}; 