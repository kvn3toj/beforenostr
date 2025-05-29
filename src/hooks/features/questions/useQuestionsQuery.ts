import { useQuery } from '@tanstack/react-query';
import * as questionService from '../../../services/question.service';
import type { Question } from '@prisma/client';
import { FindAllQuestionsDto } from '../../../questions/dto/find-all-questions.dto';

export const useQuestionsQuery = (findAllDto: FindAllQuestionsDto) => {
  // Asegúrate de que videoItemId sea un número válido antes de habilitar la query
  const enabled = typeof findAllDto.videoItemId === 'number' && findAllDto.videoItemId > 0;
  
  return useQuery<Question[], Error>({
    queryKey: ['questions', findAllDto],
    queryFn: () => questionService.findAll(findAllDto),
    enabled: enabled,
  });
}; 