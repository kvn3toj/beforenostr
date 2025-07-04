export interface CreateSubtitleDto {
  videoId: string;
  language: string;
  content: string;
  format?: 'srt' | 'vtt' | 'ass';
  isDefault?: boolean;
} 