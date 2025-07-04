import { useQuery } from '@tanstack/react-query';
import { fetchContentItems } from '../../../services/contentItem.service';
import { FetchContentItemsParams } from '../../../types/contentItem.types';

export const useContentItemsQuery = (params: FetchContentItemsParams) => {
  console.log('>>> useContentItemsQuery: Called with params:', params);
  
  return useQuery({
    queryKey: ['contentItems', params],
    queryFn: () => {
      console.log('>>> useContentItemsQuery: Executing fetchContentItems with params:', params);
      return fetchContentItems(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data) => {
      console.log('>>> useContentItemsQuery: Success, data received:', data);
    },
    onError: (error) => {
      console.error('>>> useContentItemsQuery: Error occurred:', error);
    }
  });
}; 