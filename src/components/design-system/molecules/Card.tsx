import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../tokens/colors';
import { spacing, componentSpacing } from '../tokens/spacing';
import { textStyles } from '../tokens/typography';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  /**
   * Variante visual de la tarjeta
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'interactive';
  
  /**
   * Título de la tarjeta
   */
  title?: string;
  
  /**
   * Subtítulo de la tarjeta
   */
  subtitle?: string;
  
  /**
   * Icono del header
   */
  headerIcon?: React.ReactNode;
  
  /**
   * Acciones de la tarjeta (botones, etc.)
   */
  actions?: React.ReactNode;
  
  /**
   * Contenido de la tarjeta
   */
  children?: React.ReactNode;
  
  /**
   * Padding del contenido
   */
  contentPadding?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * Mostrar divisor entre header y contenido
   */
  showDivider?: boolean;
  
  /**
   * Callback cuando se hace clic en la tarjeta (solo para variant interactive)
   */
  onClick?: () => void;
}

const StyledCard = styled(MuiCard)<CardProps>(({ 
  theme, 
  variant: customVariant
}) => {
  const getVariantStyles = () => {
    switch (customVariant) {
      case 'outlined':
        return {
          border: `1px solid ${colors.border.default}`,
          boxShadow: 'none',
          '&:hover': {
            borderColor: colors.border.medium,
          },
        };
        
      case 'elevated':
        return {
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        };
        
      case 'interactive':
        return {
          border: `1px solid ${colors.border.default}`,
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: colors.primary.main,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        };
        
      default: // 'default'
        return {
          border: `1px solid ${colors.border.light}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
          },
        };
    }
  };

  return {
    borderRadius: `${spacing.md}px`,
    backgroundColor: colors.background.paper,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    
    ...getVariantStyles(),
  };
});

const StyledCardContent = styled(CardContent)<{ contentPadding?: string }>(({ 
  contentPadding 
}) => {
  const getPaddingStyles = () => {
    switch (contentPadding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: `${spacing.md}px` };
      case 'large':
        return { padding: `${spacing.xl}px` };
      default: // 'medium'
        return { padding: `${componentSpacing.padding.card}px` };
    }
  };

  return {
    ...getPaddingStyles(),
    '&:last-child': {
      paddingBottom: contentPadding === 'none' ? 0 : 
                    contentPadding === 'small' ? `${spacing.md}px` :
                    contentPadding === 'large' ? `${spacing.xl}px` :
                    `${componentSpacing.padding.card}px`,
    },
  };
});

const StyledCardHeader = styled(CardHeader)(() => ({
  padding: `${spacing.lg}px ${componentSpacing.padding.card}px ${spacing.md}px`,
  
  '& .MuiCardHeader-title': {
    ...textStyles.h6,
    color: colors.text.primary,
  },
  
  '& .MuiCardHeader-subheader': {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  
  '& .MuiCardHeader-avatar': {
    marginRight: spacing.md,
  },
}));

const StyledCardActions = styled(CardActions)(() => ({
  padding: `${spacing.md}px ${componentSpacing.padding.card}px`,
  justifyContent: 'flex-end',
  gap: spacing.sm,
}));

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  title,
  subtitle,
  headerIcon,
  actions,
  children,
  contentPadding = 'medium',
  showDivider = false,
  onClick,
  ...props
}) => {
  const hasHeader = title || subtitle || headerIcon;
  const hasActions = !!actions;
  
  const handleClick = variant === 'interactive' && onClick ? onClick : undefined;

  return (
    <StyledCard 
      variant={customVariant} 
      onClick={handleClick}
      {...props}
    >
      {hasHeader && (
        <>
          <StyledCardHeader
            avatar={headerIcon}
            title={title}
            subheader={subtitle}
          />
          {showDivider && <Divider />}
        </>
      )}
      
      {children && (
        <StyledCardContent contentPadding={contentPadding}>
          {children}
        </StyledCardContent>
      )}
      
      {hasActions && (
        <>
          {!showDivider && <Divider />}
          <StyledCardActions>
            {actions}
          </StyledCardActions>
        </>
      )}
    </StyledCard>
  );
}; 