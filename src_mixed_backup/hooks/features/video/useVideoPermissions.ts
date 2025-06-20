import { useQuery } from '@tanstack/react-query';
import { VideoPermissions } from '../../../types/videoPermissions.types';

const API_BASE_URL = 'http://localhost:3002';

async function fetchVideoPermissions(videoItemId: number): Promise<VideoPermissions | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/video-permissions/video/${videoItemId}`);
    
    if (response.status === 404) {
      return null; // No hay permisos configurados para este video
    }
    
    if (!response.ok) {
      // Intentar obtener el mensaje de error del JSON si es posible
      let errorMessage = `Error fetching video permissions: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Si no se puede parsear el JSON, usar el statusText
      }
      throw new Error(errorMessage);
    }
    
    // Verificar que la respuesta tenga contenido antes de intentar parsear JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: expected JSON');
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return null; // Respuesta vacía
    }
    
    return JSON.parse(text);
  } catch (error) {
    // Si el error ya es una instancia de Error, re-lanzarlo
    if (error instanceof Error) {
      throw error;
    }
    // Si es otro tipo de error, crear un Error apropiado
    throw new Error('Failed to fetch video permissions');
  }
}

export function useVideoPermissions(videoItemId: number) {
  return useQuery({
    queryKey: ['videoPermissions', videoItemId],
    queryFn: () => fetchVideoPermissions(videoItemId),
    enabled: !!videoItemId && !isNaN(videoItemId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      // No reintentar si es un 404 (permisos no encontrados)
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      // No reintentar si es un error de formato
      if (error instanceof Error && error.message.includes('Invalid response format')) {
        return false;
      }
      return failureCount < 3;
    },
  });
} 