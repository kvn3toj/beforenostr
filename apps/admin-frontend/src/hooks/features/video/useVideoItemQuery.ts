import { useQuery } from '@tanstack/react-query';
import { fetchVideoItemById, VideoItem } from '../../../services/videoItem.service';

export const useVideoItemQuery = (videoItemId?: number) => {
  return useQuery<VideoItem, Error>({
    queryKey: ['videoItem', videoItemId],
    queryFn: () => videoItemId ? fetchVideoItemById(videoItemId.toString()) : Promise.resolve(null),
    enabled: !!videoItemId && videoItemId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}; 