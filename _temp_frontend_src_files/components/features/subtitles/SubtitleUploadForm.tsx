import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCreateSubtitleMutation } from '../../../hooks/features/subtitles/useCreateSubtitleMutation';
import { toast } from 'sonner';

interface SubtitleUploadFormProps {
  videoItemId: number;
  onUploadSuccess?: () => void;
  isDialog?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es-ES', name: 'Español' },
  { code: 'en-US', name: 'English' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-PT', name: 'Português' },
];

const SUPPORTED_FORMATS = [
  { value: 'srt', label: 'SRT' },
  { value: 'vtt', label: 'VTT' },
];

export const SubtitleUploadForm: React.FC<SubtitleUploadFormProps> = ({
  videoItemId,
  onUploadSuccess,
  isDialog = false
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [languageCode, setLanguageCode] = useState('');
  const [format, setFormat] = useState<'srt' | 'vtt'>('srt');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: createSubtitle, isPending: isUploading } = useCreateSubtitleMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      
      // Auto-detect format from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'srt' || extension === 'vtt') {
        setFormat(extension);
      }
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setUploadError(t('error_no_file_selected'));
      return;
    }

    if (!languageCode) {
      setUploadError('Por favor selecciona un idioma');
      return;
    }

    try {
      simulateProgress();
      
      // Read file content
      const fileContent = await readFileAsText(selectedFile);
      
      // Create subtitle
      createSubtitle({
        videoItemId,
        languageCode,
        format,
        content: fileContent,
        isActive: true,
      }, {
        onSuccess: () => {
          // Reset form
          setSelectedFile(null);
          setLanguageCode('');
          setFormat('srt');
          setUploadError(null);
          setUploadProgress(0);
          
          // Reset file input
          const fileInput = document.getElementById('subtitle-file-input') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          
          toast.success('Subtítulo agregado exitosamente');
          onUploadSuccess?.();
        },
        onError: (error) => {
          setUploadError((error as Error).message);
          setUploadProgress(0);
        }
      });
    } catch (error) {
      setUploadError(t('error_file_read'));
      setUploadProgress(0);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  return (
    <Box sx={{ p: isDialog ? 2 : 0 }}>
      {!isDialog && (
        <Typography variant="h6" gutterBottom>
          {t('subtitle_upload_form_title')}
        </Typography>
      )}

      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Language Selection */}
          <FormControl fullWidth>
            <InputLabel>Idioma</InputLabel>
            <Select
              value={languageCode}
              label="Idioma"
              onChange={(e) => setLanguageCode(e.target.value)}
              disabled={isUploading}
            >
              <MenuItem value="">
                <em>Elegir idioma</em>
              </MenuItem>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* File Input */}
          <Box>
            <input
              id="subtitle-file-input"
              type="file"
              accept=".srt,.vtt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
            <label htmlFor="subtitle-file-input">
              <Button
                variant="outlined"
                component="span"
                disabled={isUploading}
                fullWidth
                sx={{ 
                  p: 2,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  color: 'text.secondary'
                }}
              >
                {selectedFile ? selectedFile.name : 'Cargar archivo .srt'}
              </Button>
            </label>
          </Box>

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {selectedFile?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          {/* Submit Button */}
          {isDialog && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading || !selectedFile || !languageCode}
                sx={{ minWidth: 100 }}
              >
                {isUploading ? <CircularProgress size={24} /> : 'Añadir'}
              </Button>
            </Box>
          )}

          {!isDialog && (
            <Button
              type="submit"
              variant="contained"
              disabled={isUploading || !selectedFile || !languageCode}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isUploading ? <CircularProgress size={24} /> : t('button_upload')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}; 