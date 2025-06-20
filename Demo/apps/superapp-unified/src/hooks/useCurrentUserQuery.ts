import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUserProfile } from '../services/user.service';
import { User } from '../types/user.types';

export const useCurrentUserQuery = () => {
  return useQuery<User, Error>({
    queryKey: ['users', 'me'],
    queryFn: fetchCurrentUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}; 