import React from 'react';
import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  padding?: number | string;
  margin?: number | string;
  fullHeight?: boolean;
  centered?: boolean;
  background?: 'default' | 'paper' | 'transparent';
  elevation?: number;
}

const StyledContainer = styled(Box)<{
  fullHeight?: boolean;
  centered?: boolean;
  background?: string;
  elevation?: number;
}>(({ theme, fullHeight, centered, background, elevation }) => ({
  width: '100%',
  ...(fullHeight && {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }),
  ...(centered && {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  ...(background === 'paper' && {
    backgroundColor: theme.palette.background.paper,
  }),
  ...(background === 'default' && {
    backgroundColor: theme.palette.background.default,
  }),
  ...(elevation && elevation > 0 && {
    boxShadow: theme.shadows[elevation],
    borderRadius: theme.shape.borderRadius,
  }),
}));

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  padding,
  margin,
  fullHeight = false,
  centered = false,
  background = 'transparent',
  elevation = 0,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getResponsivePadding = () => {
    if (padding !== undefined) return padding;
    
    if (isMobile) return theme.spacing(1);
    if (isTablet) return theme.spacing(2);
    return theme.spacing(3);
  };

  const getResponsiveMargin = () => {
    if (margin !== undefined) return margin;
    return 0;
  };

  return (
    <StyledContainer
      fullHeight={fullHeight}
      centered={centered}
      background={background}
      elevation={elevation}
    >
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters}
        sx={{
          padding: getResponsivePadding(),
          margin: getResponsiveMargin(),
          ...(fullHeight && {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }),
        }}
      >
        {children}
      </Container>
    </StyledContainer>
  );
};

// Componente específico para páginas de administración
export const AdminPageContainer: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}> = ({ children, title, subtitle }) => {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer
      maxWidth="xl"
      background="default"
      padding={theme.spacing(3)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minHeight: 'calc(100vh - 64px)', // Altura menos el header
        }}
      >
        {(title || subtitle) && (
          <Box>
            {title && (
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: subtitle ? 1 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: '600px' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </ResponsiveContainer>
  );
};

// Componente para grids responsivos
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = 2,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gap: spacing,
        alignItems,
        justifyContent,
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || columns.xs || 1}, 1fr)`,
          md: `repeat(${columns.md || columns.sm || columns.xs || 1}, 1fr)`,
          lg: `repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
          xl: `repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
        },
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: `repeat(${columns.xs || 1}, 1fr)`,
        },
      }}
    >
      {children}
    </Box>
  );
}; 