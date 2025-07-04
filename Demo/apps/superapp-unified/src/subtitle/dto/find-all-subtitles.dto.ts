export interface FindAllSubtitlesDto {
  videoId?: string;
  language?: string;
  format?: 'srt' | 'vtt' | 'ass';
  page?: number;
  limit?: number;
} 