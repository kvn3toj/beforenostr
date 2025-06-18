import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../lib/api-service';

// TODO: Backend endpoint needed: GET /video-items/:videoId/questions
export const useVideoQuestions = (videoId: string) => {
  return useQuery({
    queryKey: ['videoQuestions', videoId],
    queryFn: () => apiService.get(`/video-items/${videoId}/questions`),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
    fallbackData: [], // Fallback hasta que el endpoint esté disponible
  });
};