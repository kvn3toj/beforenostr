import React from 'react';
import { 
  TextField as MuiTextField, 
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { textStyles } from '../tokens/typography';
import { inputFocusStyles } from '../../../utils/accessibility/focus-styles';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant' | 'size'> {
  /**
   * Variante visual del campo de texto
   */
  variant?: 'outlined' | 'filled';
  
  /**
   * Tamaño del campo
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Texto de ayuda personalizado
   */
  helpText?: string;
  
  /**
   * Icono a mostrar al inicio del campo
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icono a mostrar al final del campo
   */
  endIcon?: React.ReactNode;
  
  /**
   * Estado de error
   */
  error?: boolean;
  
  /**
   * Estado de éxito
   */
  success?: boolean;
  
  /**
   * Mostrar/ocultar botón para campos de contraseña
   */
  showPasswordToggle?: boolean;
  
  /**
   * ID para el campo (se auto-genera si no se proporciona)
   */
  id?: string;
  
  /**
   * ARIA describedby adicional (se combina con helpText automático)
   */
  'aria-describedby'?: string;
}

const StyledTextField = styled(MuiTextField, {
  shouldForwardProp: (prop) => !['success'].includes(prop as string)
})<TextFieldProps>(({ 
  theme, 
  size: fieldSize,
  error,
  success
}) => {
  const getSizeStyles = () => {
    switch (fieldSize) {
      case 'small':
        return {
          '& .MuiInputBase-root': {
            minHeight: '36px',
            fontSize: textStyles.bodySmall.fontSize,
          },
          '& .MuiInputLabel-root': {
            fontSize: textStyles.bodySmall.fontSize,
          },
        };
      case 'large':
        return {
          '& .MuiInputBase-root': {
            minHeight: '52px',
            fontSize: textStyles.bodyLarge.fontSize,
          },
          '& .MuiInputLabel-root': {
            fontSize: textStyles.bodyLarge.fontSize,
          },
        };
      default: // medium
        return {
          '& .MuiInputBase-root': {
            minHeight: '44px',
            fontSize: textStyles.body.fontSize,
          },
          '& .MuiInputLabel-root': {
            fontSize: textStyles.body.fontSize,
          },
        };
    }
  };

  const getStateStyles = () => {
    if (error) {
      return {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: colors.error.main,
            borderWidth: '2px',
          },
          '&:hover fieldset': {
            borderColor: colors.error.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.error.main,
          },
        },
      };
    }
    
    if (success) {
      return {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: colors.success.main,
            borderWidth: '2px',
          },
          '&:hover fieldset': {
            borderColor: colors.success.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.success.main,
          },
        },
      };
    }
    
    return {};
  };

  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: `${spacing.md}px`,
      backgroundColor: colors.background.paper,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      
      '& fieldset': {
        borderColor: colors.border.default,
        borderWidth: '1px',
      },
      
      '&:hover fieldset': {
        borderColor: colors.primary.main,
      },
      
      '&.Mui-focused fieldset': {
        borderColor: colors.accessibility.focusRing,
        borderWidth: '2px',
        boxShadow: `0 0 0 3px ${colors.accessibility.focusRingOpacity}`,
      },
      
      '&.Mui-disabled': {
        backgroundColor: colors.neutral[50],
        '& fieldset': {
          borderColor: colors.border.light,
        },
      },
      
      '& input': {
        ...inputFocusStyles,
      },
    },
    
    '& .MuiInputLabel-root': {
      color: colors.text.secondary,
      fontWeight: textStyles.body.fontWeight,
      
      '&.Mui-focused': {
        color: colors.primary.main,
      },
      
      '&.Mui-error': {
        color: colors.error.main,
      },
    },
    
    '& .MuiFormHelperText-root': {
      fontSize: textStyles.caption.fontSize,
      marginTop: spacing.xs,
      marginLeft: 0,
      
      '&.Mui-error': {
        color: colors.error.main,
      },
    },
    
    ...getSizeStyles(),
    ...getStateStyles(),
  };
});

export const TextField: React.FC<TextFieldProps> = ({
  size = 'medium',
  variant = 'outlined',
  helpText,
  startIcon,
  endIcon,
  error = false,
  success = false,
  showPasswordToggle = false,
  type,
  InputProps,
  id: providedId,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Generar ID único si no se proporciona
  const fieldId = providedId || React.useMemo(() => 
    `textfield-${Math.random().toString(36).substr(2, 9)}`, []
  );
  
  // Generar IDs para elementos relacionados
  const helpTextId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  
  const isPasswordField = type === 'password' || showPasswordToggle;
  const inputType = isPasswordField && showPassword ? 'text' : type;
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Combinar aria-describedby
  const getAriaDescribedBy = () => {
    const parts = [];
    if (ariaDescribedBy) parts.push(ariaDescribedBy);
    if (helpTextId) parts.push(helpTextId);
    if (errorId) parts.push(errorId);
    return parts.length > 0 ? parts.join(' ') : undefined;
  };

  const getInputProps = () => {
    const baseProps = { 
      ...InputProps,
      'aria-describedby': getAriaDescribedBy(),
    };
    
    if (startIcon) {
      baseProps.startAdornment = (
        <InputAdornment position="start">
          {React.cloneElement(startIcon as React.ReactElement, {
            sx: { 
              color: error ? colors.error.main : success ? colors.success.main : colors.text.secondary,
              fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem'
            },
            'aria-hidden': true, // Los iconos decorativos no necesitan ser anunciados
          })}
        </InputAdornment>
      );
    }
    
    if (endIcon || isPasswordField) {
      const endAdornment = [];
      
      if (endIcon && !isPasswordField) {
        endAdornment.push(
          React.cloneElement(endIcon as React.ReactElement, {
            key: 'end-icon',
            sx: { 
              color: error ? colors.error.main : success ? colors.success.main : colors.text.secondary,
              fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem'
            },
            'aria-hidden': true, // Los iconos decorativos no necesitan ser anunciados
          })
        );
      }
      
      if (isPasswordField) {
        endAdornment.push(
          <IconButton
            key="password-toggle"
            onClick={handleTogglePassword}
            edge="end"
            size={size === 'small' ? 'small' : 'medium'}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword}
            sx={{ 
              color: colors.text.secondary,
              '&:hover': {
                color: colors.primary.main,
              }
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        );
      }
      
      baseProps.endAdornment = (
        <InputAdornment position="end">
          {endAdornment}
        </InputAdornment>
      );
    }
    
    return baseProps;
  };

  return (
    <StyledTextField
      id={fieldId}
      variant={variant}
      size={size}
      type={inputType}
      error={error}
      success={success}
      helperText={helpText || props.helperText}
      FormHelperTextProps={{
        id: helpTextId,
        ...(props.FormHelperTextProps || {}),
      }}
      InputProps={getInputProps()}
      aria-invalid={error ? 'true' : 'false'}
      {...props}
    />
  );
}; 