import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMatchMessages, sendMatchMessage } from '../services/marketplaceService';

export const useMatchChat = (matchId: string, senderId?: string) => {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['marketplace-match-messages', matchId],
    queryFn: () => getMatchMessages(matchId),
    enabled: !!matchId,
  });

  const sendMessage = useMutation({
    mutationFn: (content: string) => sendMatchMessage(matchId, content, senderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-match-messages', matchId] });
    },
  });

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    sendMessage: sendMessage.mutateAsync,
    sending: sendMessage.isPending,
  };
};
