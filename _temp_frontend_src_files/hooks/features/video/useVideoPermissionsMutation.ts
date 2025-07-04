import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VideoPermissions, DEFAULT_VIDEO_PERMISSIONS } from '../../../types/videoPermissions.types';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:3002';

interface UpsertVideoPermissionsParams {
  videoItemId: number;
  permissions: Partial<Omit<VideoPermissions, 'id' | 'videoItemId' | 'createdAt' | 'updatedAt' | 'videoItem' | 'createdBy'>>;
}

async function upsertVideoPermissions({ videoItemId, permissions }: UpsertVideoPermissionsParams): Promise<VideoPermissions> {
  const payload = {
    ...DEFAULT_VIDEO_PERMISSIONS,
    ...permissions,
  };

  const response = await fetch(`${API_BASE_URL}/video-permissions/video/${videoItemId}/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error updating video permissions: ${response.statusText}`);
  }

  return response.json();
}

async function publishVideoPermissions(videoItemId: number): Promise<VideoPermissions> {
  const response = await fetch(`${API_BASE_URL}/video-permissions/video/${videoItemId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error publishing video permissions: ${response.statusText}`);
  }

  return response.json();
}

export function useVideoPermissionsMutation() {
  const queryClient = useQueryClient();

  const upsertMutation = useMutation({
    mutationFn: upsertVideoPermissions,
    onSuccess: (data) => {
      // Actualizar la cache de React Query
      queryClient.setQueryData(['videoPermissions', data.videoItemId], data);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['videoPermissions'] });
      
      toast.success(data.isDraft ? 'Permisos guardados como borrador' : 'Permisos guardados exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error saving video permissions:', error);
      toast.error(`Error al guardar permisos: ${error.message}`);
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishVideoPermissions,
    onSuccess: (data) => {
      // Actualizar la cache de React Query
      queryClient.setQueryData(['videoPermissions', data.videoItemId], data);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['videoPermissions'] });
      
      toast.success('Video publicado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error publishing video:', error);
      toast.error(`Error al publicar video: ${error.message}`);
    },
  });

  return {
    upsert: upsertMutation.mutate,
    publish: publishMutation.mutate,
    isUpserting: upsertMutation.isPending,
    isPublishing: publishMutation.isPending,
    isLoading: upsertMutation.isPending || publishMutation.isPending,
  };
} 