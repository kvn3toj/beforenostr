import React from 'react';
import { Box, InputBase, IconButton, Typography } from '@mui/material';
import { Search, Mic, ArrowBack, TuneOutlined } from '@mui/icons-material';
import consciousDesignSystem from '../../../../theme/consciousDesignSystem';

interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showVoiceSearch?: boolean;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = '🔍 Descubre productos y servicios CoomÜnity',
  onFilterClick,
  showVoiceSearch = true,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: consciousDesignSystem.spacing[3],
        px: consciousDesignSystem.spacing[4],
        py: consciousDesignSystem.spacing[3],
        background: `linear-gradient(135deg, ${consciousDesignSystem.colors.grey[50]} 0%, ${consciousDesignSystem.colors.grey[100]} 100%)`,
        borderRadius: consciousDesignSystem.components.card.borderRadius,
        boxShadow: consciousDesignSystem.components.card.shadow.soft,
        margin: consciousDesignSystem.spacing[3],
        border: `1px solid ${consciousDesignSystem.colors.grey[200]}`,
      }}
    >
      {/* Search Title */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: consciousDesignSystem.typography.fontFamily.consciousness,
          fontSize: consciousDesignSystem.typography.fontSize.sm,
          fontWeight: consciousDesignSystem.typography.fontWeight.semibold,
          color: consciousDesignSystem.colors.primary.main,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${consciousDesignSystem.colors.primary.main} 0%, ${consciousDesignSystem.colors.secondary.main} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        ✨ Encuentra lo que necesitas ✨
      </Typography>

      {/* Main Search Container */}
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: consciousDesignSystem.spacing[2],
        }}
      >
        {/* Enhanced Search Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: consciousDesignSystem.colors.grey[50],
            borderRadius: consciousDesignSystem.components.button.borderRadius,
            flex: 1,
            minHeight: consciousDesignSystem.components.touchTarget.recommended,
            padding: consciousDesignSystem.spacing[2],
            border: `1px solid ${consciousDesignSystem.colors.grey[300]}`,
            transition: consciousDesignSystem.transitions.normal,
            boxShadow: consciousDesignSystem.components.card.shadow.subtle,
            '&:hover': {
              borderColor: consciousDesignSystem.colors.primary.light,
              boxShadow: consciousDesignSystem.components.card.shadow.soft,
            },
            '&:focus-within': {
              borderColor: consciousDesignSystem.colors.primary.main,
              boxShadow: `0 0 0 3px ${consciousDesignSystem.colors.primary.main}20`,
            },
          }}
        >
          {/* Enhanced Search Icon */}
          <IconButton
            sx={{
              width: consciousDesignSystem.components.touchTarget.minimum,
              height: consciousDesignSystem.components.touchTarget.minimum,
              mr: consciousDesignSystem.spacing[2],
              color: consciousDesignSystem.colors.primary.main,
              backgroundColor: `${consciousDesignSystem.colors.primary.main}10`,
              transition: consciousDesignSystem.transitions.normal,
              '&:hover': {
                backgroundColor: `${consciousDesignSystem.colors.primary.main}20`,
                transform: consciousDesignSystem.accessibility.hover.transform,
              },
            }}
          >
            <Search
              sx={{
                fontSize: '20px',
                color: consciousDesignSystem.colors.primary.main,
              }}
            />
          </IconButton>

          {/* Enhanced Input */}
          <InputBase
            data-testid="marketplace-search-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            sx={{
              flex: 1,
              color: consciousDesignSystem.colors.grey[800],
              fontFamily: consciousDesignSystem.typography.fontFamily.primary,
              fontSize: consciousDesignSystem.typography.fontSize.base,
              fontWeight: consciousDesignSystem.typography.fontWeight.medium,
              '& .MuiInputBase-input': {
                padding: 0,
                '&::placeholder': {
                  color: consciousDesignSystem.colors.grey[500],
                  opacity: 1,
                  fontStyle: 'italic',
                },
                '&:focus': {
                  color: consciousDesignSystem.colors.grey[900],
                },
              },
            }}
          />

          {/* Enhanced Voice Search */}
          {showVoiceSearch && (
            <IconButton
              sx={{
                width: consciousDesignSystem.components.touchTarget.minimum,
                height: consciousDesignSystem.components.touchTarget.minimum,
                ml: consciousDesignSystem.spacing[1],
                color: consciousDesignSystem.colors.secondary.main,
                backgroundColor: `${consciousDesignSystem.colors.secondary.main}10`,
                transition: consciousDesignSystem.transitions.normal,
                '&:hover': {
                  backgroundColor: `${consciousDesignSystem.colors.secondary.main}20`,
                  transform: consciousDesignSystem.accessibility.hover.transform,
                },
              }}
            >
              <Mic
                sx={{
                  fontSize: '18px',
                  color: consciousDesignSystem.colors.secondary.main,
                }}
              />
            </IconButton>
          )}
        </Box>

        {/* Enhanced Filter Button */}
        {onFilterClick && (
          <IconButton
            onClick={onFilterClick}
            sx={{
              width: consciousDesignSystem.components.touchTarget.recommended,
              height: consciousDesignSystem.components.touchTarget.recommended,
              backgroundColor: consciousDesignSystem.colors.accent.main,
              color: consciousDesignSystem.colors.accent.contrastText,
              borderRadius: consciousDesignSystem.components.button.borderRadius,
              boxShadow: consciousDesignSystem.components.card.shadow.medium,
              transition: consciousDesignSystem.transitions.normal,
              '&:hover': {
                backgroundColor: consciousDesignSystem.colors.accent.dark,
                transform: consciousDesignSystem.accessibility.hover.transform,
                boxShadow: consciousDesignSystem.components.card.shadow.consciousness,
              },
              '&:focus': {
                outline: consciousDesignSystem.accessibility.focus.outline,
                outlineColor: consciousDesignSystem.accessibility.focus.outlineColor,
                outlineOffset: consciousDesignSystem.accessibility.focus.outlineOffset,
              },
            }}
          >
            <TuneOutlined
              sx={{
                fontSize: '20px',
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Quick Search Suggestions */}
      <Box
        sx={{
          display: 'flex',
          gap: consciousDesignSystem.spacing[2],
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['🌱 Sostenible', '🤝 Colaborativo', '⚡ Urgente', '💎 Premium'].map((suggestion, index) => (
          <Box
            key={index}
            onClick={() => onChange(suggestion.split(' ')[1])}
            sx={{
              px: consciousDesignSystem.spacing[3],
              py: consciousDesignSystem.spacing[1],
              backgroundColor: `${consciousDesignSystem.colors.primary.main}10`,
              color: consciousDesignSystem.colors.primary.main,
              borderRadius: consciousDesignSystem.components.button.borderRadius,
              fontSize: consciousDesignSystem.typography.fontSize.xs,
              fontFamily: consciousDesignSystem.typography.fontFamily.primary,
              fontWeight: consciousDesignSystem.typography.fontWeight.medium,
              cursor: 'pointer',
              transition: consciousDesignSystem.transitions.normal,
              border: `1px solid ${consciousDesignSystem.colors.primary.light}`,
              '&:hover': {
                backgroundColor: `${consciousDesignSystem.colors.primary.main}20`,
                transform: consciousDesignSystem.accessibility.hover.transform,
              },
            }}
          >
            {suggestion}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
