export interface UpdateSubtitleDto {
  language?: string;
  content?: string;
  format?: 'srt' | 'vtt' | 'ass';
  isDefault?: boolean;
} 