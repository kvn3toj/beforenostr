import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Chip,
  Button,
  Typography,
  Divider,
  Grid,
  alpha,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { Controller, useForm, FieldValues, Path } from 'react-hook-form';
import { useGuardianColors } from '../../theme/GuardianColorProvider';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'file'
  | 'divider'
  | 'section';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label?: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FormFieldOption[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | boolean;
  };
  defaultValue?: any;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  gridProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  };
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormBuilderProps<T extends FieldValues = FieldValues> {
  fields?: FormField[];
  sections?: FormSection[];
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  defaultValues?: Partial<T>;
  sx?: SxProps<Theme>;
}

export const FormBuilder = <T extends FieldValues = FieldValues>({
  fields = [],
  sections = [],
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  loading = false,
  defaultValues,
  sx,
}: FormBuilderProps<T>) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<T>({
    defaultValues: defaultValues as any,
  });

  const { palette } = useGuardianColors();
  const watchedValues = watch();

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditional) return true;

    const { field: conditionField, value: conditionValue, operator = 'equals' } = field.conditional;
    const fieldValue = watchedValues[conditionField as keyof T];

    switch (operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'not_equals':
        return fieldValue !== conditionValue;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(conditionValue);
      case 'greater_than':
        return Number(fieldValue) > Number(conditionValue);
      case 'less_than':
        return Number(fieldValue) < Number(conditionValue);
      default:
        return true;
    }
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const fieldName = field.name as Path<T>;
    const error = errors[fieldName];
    const hasError = !!error;

    switch (field.type) {
      case 'divider':
        return <Divider sx={{ my: 2 }} />;

      case 'section':
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: palette.text.primary }}>
              {field.label}
            </Typography>
            {field.helperText && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {field.helperText}
              </Typography>
            )}
          </Box>
        );

      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} es requerido` : false,
              minLength: field.validation?.minLength ? {
                value: field.validation.minLength,
                message: `Mínimo ${field.validation.minLength} caracteres`
              } : undefined,
              maxLength: field.validation?.maxLength ? {
                value: field.validation.maxLength,
                message: `Máximo ${field.validation.maxLength} caracteres`
              } : undefined,
              pattern: field.validation?.pattern ? {
                value: field.validation.pattern,
                message: 'Formato inválido'
              } : undefined,
            }}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                disabled={field.disabled || loading}
                error={hasError}
                helperText={error?.message || field.helperText}
                fullWidth={field.fullWidth !== false}
                size={field.size || 'medium'}
                InputProps={{
                  inputProps: {
                    min: field.validation?.min,
                    max: field.validation?.max,
                  },
                  sx: {
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: palette.primary,
                    },
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha(palette.divider, 0.8),
                    },
                    '&:hover fieldset': {
                      borderColor: palette.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: palette.primary,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: palette.text.secondary,
                    '&.Mui-focused': {
                      color: palette.primary,
                    },
                  },
                }}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} es requerido` : false,
            }}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                placeholder={field.placeholder}
                disabled={field.disabled || loading}
                error={hasError}
                helperText={error?.message || field.helperText}
                fullWidth={field.fullWidth !== false}
                size={field.size || 'medium'}
                multiline
                rows={4}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} es requerido` : false,
            }}
            render={({ field: controllerField }) => (
              <FormControl fullWidth={field.fullWidth !== false} error={hasError}>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  {...controllerField}
                  disabled={field.disabled || loading}
                  size={field.size || 'medium'}
                >
                  {field.options?.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {(error?.message || field.helperText) && (
                  <Typography variant="caption" color={hasError ? 'error' : 'text.secondary'}>
                    {error?.message || field.helperText}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...controllerField}
                    checked={controllerField.value || false}
                    disabled={field.disabled || loading}
                  />
                }
                label={field.label}
              />
            )}
          />
        );

      case 'switch':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...controllerField}
                    checked={controllerField.value || false}
                    disabled={field.disabled || loading}
                  />
                }
                label={field.label}
              />
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              required: field.required ? `${field.label} es requerido` : false,
            }}
            render={({ field: controllerField }) => (
              <FormControl error={hasError}>
                <FormLabel>{field.label}</FormLabel>
                <RadioGroup
                  {...controllerField}
                  row
                >
                  {field.options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio disabled={field.disabled || loading || option.disabled} />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
                {(error?.message || field.helperText) && (
                  <Typography variant="caption" color={hasError ? 'error' : 'text.secondary'}>
                    {error?.message || field.helperText}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      default:
        return null;
    }
  };

  const renderFields = (fieldsToRender: FormField[]) => (
    <Grid container spacing={2}>
      {fieldsToRender.map((field, index) => (
        <Grid
          item
          key={field.name || index}
          xs={field.gridProps?.xs || 12}
          sm={field.gridProps?.sm}
          md={field.gridProps?.md}
          lg={field.gridProps?.lg}
          xl={field.gridProps?.xl}
        >
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={sx}>
      {sections.length > 0 ? (
        sections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: palette.text.primary }}>
              {section.title}
            </Typography>
            {section.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {section.description}
              </Typography>
            )}
            {renderFields(section.fields)}
          </Box>
        ))
      ) : (
        renderFields(fields)
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              borderColor: alpha(palette.divider, 0.8),
              color: palette.text.primary,
              '&:hover': {
                borderColor: palette.primary,
                backgroundColor: alpha(palette.divider, 0.1),
              },
            }}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            backgroundColor: palette.primary,
            color: '#fff',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: alpha(palette.primary, 0.9),
            },
          }}
        >
          {submitLabel}
        </Button>
      </Box>
    </Box>
  );
};
