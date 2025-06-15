import { useQuery } from '@tanstack/react-query';
import * as subtitleService from '../../../services/subtitle.service';
import { Subtitle } from '@prisma/client';
import { FindAllSubtitlesDto } from '../../../subtitle/dto/find-all-subtitles.dto';

export const useSubtitlesQuery = (findAllDto: FindAllSubtitlesDto) => {
  // Asegúrate de que videoItemId sea un número válido antes de habilitar la query
  const enabled = typeof findAllDto.videoItemId === 'number' && findAllDto.videoItemId > 0;
  
  return useQuery<Subtitle[], Error>({
    queryKey: ['subtitles', findAllDto],
    queryFn: () => subtitleService.findAll(findAllDto),
    enabled: enabled,
  });
}; 