import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../lib/api-service';
import type { Question } from '../interactive-video/useQuestionSystem';

/**
 * Hook para obtener preguntas dinámicas de un video específico desde el backend
 * Reemplaza los datos mock estáticos del módulo ÜPlay
 * 
 * @param videoId - ID del video para obtener sus preguntas
 * @returns Query object con preguntas, estados de loading/error
 */
export const useVideoQuestions = (videoId: string) => {
  return useQuery<Question[]>({
    queryKey: ['video-questions', videoId],
    queryFn: async () => {
      console.log('🔍 [useVideoQuestions] Obteniendo preguntas para video:', videoId);
      
      try {
        const questions = await apiService.get(`/video-items/${videoId}/questions`);
        console.log('✅ [useVideoQuestions] Preguntas obtenidas:', questions?.length || 0);
        return questions || [];
      } catch (error) {
        console.error('❌ [useVideoQuestions] Error obteniendo preguntas:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cachea las preguntas por 5 minutos
    fallbackData: [], // Devuelve array vacío por defecto (NO mock data)
    enabled: !!videoId, // Solo ejecuta si hay videoId válido
    retry: 2, // Reintenta 2 veces en caso de error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
  });
};