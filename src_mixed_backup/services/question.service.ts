import { CreateQuestionDto } from '../questions/dto/create-question.dto';
import { UpdateQuestionDto } from '../questions/dto/update-question.dto';
import { FindAllQuestionsDto } from '../questions/dto/find-all-questions.dto';
import type { Question } from '../generated/prisma';
import { apiService } from './api.service';

// Configuración del backend - ajustar según tu configuración
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
const QUESTIONS_ENDPOINT = `${API_BASE_URL}/questions`;

// Helper function para manejar respuestas HTTP
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const create = async (data: CreateQuestionDto): Promise<Question> => {
  return apiService.post<Question>('/questions', data);
};

export const findAll = async (params: FindAllQuestionsDto): Promise<Question[]> => {
  const searchParams = new URLSearchParams();
  
  // Convertir parámetros a query string
  searchParams.append('videoItemId', params.videoItemId.toString());
  
  if (params.languageCode) {
    searchParams.append('languageCode', params.languageCode);
  }
  
  if (params.type) {
    searchParams.append('type', params.type);
  }
  
  if (params.isActive !== undefined) {
    searchParams.append('isActive', params.isActive.toString());
  }
  
  return apiService.get<Question[]>(`/questions/search?${searchParams.toString()}`);
};

export const findOne = async (id: number): Promise<Question> => {
  return apiService.get<Question>(`/questions/${id}`);
};

export const update = async (id: number, data: UpdateQuestionDto): Promise<Question> => {
  return apiService.patch<Question>(`/questions/${id}`, data);
};

export const remove = async (id: number): Promise<void> => {
  return apiService.delete<void>(`/questions/${id}`);
}; 