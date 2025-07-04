import React from 'react';
import { Box, Button } from '@mui/material';
import consciousDesignSystem from '../../../../theme/consciousDesignSystem';

interface RoleToggleProps {
  selectedRole: 'consumer' | 'provider';
  onRoleChange: (role: 'consumer' | 'provider') => void;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <Box
      sx={{
        borderRadius: consciousDesignSystem.components.card.borderRadius,
        backgroundColor: consciousDesignSystem.colors.grey[100],
        display: 'flex',
        padding: consciousDesignSystem.spacing[2],
        width: 'fit-content',
        maxWidth: '100%',
        alignItems: 'center',
        gap: consciousDesignSystem.spacing[1],
        fontFamily: consciousDesignSystem.typography.fontFamily.primary,
        fontSize: consciousDesignSystem.typography.fontSize.sm,
        fontWeight: consciousDesignSystem.typography.fontWeight.medium,
        boxShadow: consciousDesignSystem.components.card.shadow.subtle,
        border: `1px solid ${consciousDesignSystem.colors.grey[200]}`,
        transition: consciousDesignSystem.transitions.normal,
        '&:hover': {
          boxShadow: consciousDesignSystem.components.card.shadow.soft,
          transform: consciousDesignSystem.accessibility.hover.transform,
        },
      }}
    >
      {/* Consumidor Button */}
      <Button
        data-testid="consumer-role-button"
        variant={selectedRole === 'consumer' ? 'contained' : 'outlined'}
        onClick={() => onRoleChange('consumer')}
        sx={{
          borderRadius: consciousDesignSystem.components.button.borderRadius,
          backgroundColor: selectedRole === 'consumer'
            ? consciousDesignSystem.colors.primary.main
            : 'transparent',
          color: selectedRole === 'consumer'
            ? consciousDesignSystem.colors.primary.contrastText
            : consciousDesignSystem.colors.primary.main,
          border: selectedRole === 'consumer'
            ? 'none'
            : `1px solid ${consciousDesignSystem.colors.primary.light}`,
          minHeight: consciousDesignSystem.components.touchTarget.minimum,
          px: consciousDesignSystem.spacing[5],
          py: consciousDesignSystem.spacing[2],
          fontFamily: consciousDesignSystem.typography.fontFamily.primary,
          fontSize: consciousDesignSystem.typography.fontSize.sm,
          fontWeight: consciousDesignSystem.typography.fontWeight.semibold,
          textTransform: 'none',
          letterSpacing: '0.5px',
          transition: consciousDesignSystem.transitions.normal,
          boxShadow: selectedRole === 'consumer'
            ? consciousDesignSystem.components.card.shadow.medium
            : 'none',
          '&:hover': {
            backgroundColor: selectedRole === 'consumer'
              ? consciousDesignSystem.colors.primary.dark
              : `${consciousDesignSystem.colors.primary.main}10`,
            transform: consciousDesignSystem.accessibility.hover.transform,
            boxShadow: selectedRole === 'consumer'
              ? consciousDesignSystem.components.card.shadow.consciousness
              : consciousDesignSystem.components.card.shadow.soft,
          },
          '&:focus': {
            outline: consciousDesignSystem.accessibility.focus.outline,
            outlineColor: consciousDesignSystem.accessibility.focus.outlineColor,
            outlineOffset: consciousDesignSystem.accessibility.focus.outlineOffset,
          },
        }}
      >
        🛒 Consumidor
      </Button>

      {/* Proveedor Button */}
      <Button
        data-testid="provider-role-button"
        variant={selectedRole === 'provider' ? 'contained' : 'outlined'}
        onClick={() => onRoleChange('provider')}
        sx={{
          borderRadius: consciousDesignSystem.components.button.borderRadius,
          backgroundColor: selectedRole === 'provider'
            ? consciousDesignSystem.colors.secondary.main
            : 'transparent',
          color: selectedRole === 'provider'
            ? consciousDesignSystem.colors.secondary.contrastText
            : consciousDesignSystem.colors.secondary.main,
          border: selectedRole === 'provider'
            ? 'none'
            : `1px solid ${consciousDesignSystem.colors.secondary.light}`,
          minHeight: consciousDesignSystem.components.touchTarget.minimum,
          px: consciousDesignSystem.spacing[5],
          py: consciousDesignSystem.spacing[2],
          fontFamily: consciousDesignSystem.typography.fontFamily.primary,
          fontSize: consciousDesignSystem.typography.fontSize.sm,
          fontWeight: consciousDesignSystem.typography.fontWeight.semibold,
          textTransform: 'none',
          letterSpacing: '0.5px',
          transition: consciousDesignSystem.transitions.normal,
          boxShadow: selectedRole === 'provider'
            ? consciousDesignSystem.components.card.shadow.medium
            : 'none',
          '&:hover': {
            backgroundColor: selectedRole === 'provider'
              ? consciousDesignSystem.colors.secondary.dark
              : `${consciousDesignSystem.colors.secondary.main}10`,
            transform: consciousDesignSystem.accessibility.hover.transform,
            boxShadow: selectedRole === 'provider'
              ? consciousDesignSystem.components.card.shadow.consciousness
              : consciousDesignSystem.components.card.shadow.soft,
          },
          '&:focus': {
            outline: consciousDesignSystem.accessibility.focus.outline,
            outlineColor: consciousDesignSystem.accessibility.focus.outlineColor,
            outlineOffset: consciousDesignSystem.accessibility.focus.outlineOffset,
          },
        }}
      >
        🌱 Proveedor
      </Button>
    </Box>
  );
};
