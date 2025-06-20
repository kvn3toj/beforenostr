export interface FindAllQuestionsDto {
  page?: number;
  limit?: number;
  type?: 'multiple_choice' | 'true_false' | 'open_ended';
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  search?: string;
} 