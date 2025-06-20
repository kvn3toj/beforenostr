export interface UpdateQuestionDto {
  text?: string;
  type?: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  videoTimestamp?: number;
} 