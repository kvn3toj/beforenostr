import { CreateSubtitleDto } from '../subtitle/dto/create-subtitle.dto';
import { UpdateSubtitleDto } from '../subtitle/dto/update-subtitle.dto';
import { FindAllSubtitlesDto } from '../subtitle/dto/find-all-subtitles.dto';
import { Subtitle } from '../generated/prisma';
import { apiService } from './api.service';

// Configuración del backend - ajustar según tu configuración
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const SUBTITLES_ENDPOINT = `${API_BASE_URL}/subtitles`;

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

export const create = async (data: CreateSubtitleDto): Promise<Subtitle> => {
  return apiService.post<Subtitle>('/subtitles', data);
};

export const findAll = async (params: FindAllSubtitlesDto): Promise<Subtitle[]> => {
  const searchParams = new URLSearchParams();
  
  // Convertir parámetros a query string
  searchParams.append('videoItemId', params.videoItemId.toString());
  
  if (params.languageCode) {
    searchParams.append('languageCode', params.languageCode);
  }
  
  if (params.format) {
    searchParams.append('format', params.format);
  }
  
  if (params.isActive !== undefined) {
    searchParams.append('isActive', params.isActive.toString());
  }
  
  return apiService.get<Subtitle[]>(`/subtitles/search?${searchParams.toString()}`);
};

export const update = async (id: number, data: UpdateSubtitleDto): Promise<Subtitle> => {
  return apiService.patch<Subtitle>(`/subtitles/${id}`, data);
};

export const remove = async (id: number): Promise<void> => {
  return apiService.delete<void>(`/subtitles/${id}`);
}; 