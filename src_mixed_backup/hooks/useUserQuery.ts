import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '../services/user.service';
import { User } from '../types/user.types';

export const useUserQuery = (userId: string | undefined) => {
  return useQuery<User, Error>({
    queryKey: ['users', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId,
  });
}; 