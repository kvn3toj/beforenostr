import React from 'react';
import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { responsiveUtils, targetDevices } from '../../../theme';
import { fluidSpacing, componentSpacing } from '../../design-system/tokens/spacing';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  padding?: number | string | 'fluid';
  margin?: number | string | 'fluid';
  fullHeight?: boolean;
  centered?: boolean;
  background?: 'default' | 'paper' | 'transparent';
  elevation?: number;
  fluidSpacing?: boolean;
  pixelPerfect?: boolean;
  targetDevice?: keyof typeof targetDevices.mobile | keyof typeof targetDevices.tablet | keyof typeof targetDevices.desktop;
}

const StyledContainer = styled(Box)<{
  fullHeight?: boolean;
  centered?: boolean;
  background?: string;
  elevation?: number;
  fluidSpacing?: boolean;
  pixelPerfect?: boolean;
}>(({ theme, fullHeight, centered, background, elevation, fluidSpacing, pixelPerfect }) => ({
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
  
  ...(fluidSpacing && {
    padding: componentSpacing.padding.container.mobile,
    [theme.breakpoints.up('md')]: {
      padding: componentSpacing.padding.container.desktop,
    },
  }),
  
  ...(pixelPerfect && {
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    
    [responsiveUtils.mediaQueries.mobile]: {
      maxWidth: '390px',
      margin: '0 auto',
    },
    
    [`@media (min-width: 768px) and (max-width: 834px)`]: {
      maxWidth: '768px',
      margin: '0 auto',
    },
    
    [`@media (min-width: 1280px)`]: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
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
  fluidSpacing = true,
  pixelPerfect = false,
  targetDevice,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const getResponsivePadding = () => {
    if (padding !== undefined) {
      if (padding === 'fluid') {
        return componentSpacing.padding.container.mobile;
      }
      return padding;
    }
    
    if (fluidSpacing) {
      return isMobile ? componentSpacing.padding.container.mobile : componentSpacing.padding.container.desktop;
    }
    
    if (isMobile) return theme.spacing(1);
    if (isTablet) return theme.spacing(2);
    return theme.spacing(3);
  };

  const getResponsiveMargin = () => {
    if (margin !== undefined) {
      if (margin === 'fluid') {
        return componentSpacing.margin.section.xs;
      }
      return margin;
    }
    
    return 0;
  };

  const getTargetDeviceMaxWidth = () => {
    if (!targetDevice) return maxWidth;
    
    if (targetDevice in targetDevices.mobile) {
      const device = targetDevices.mobile[targetDevice as keyof typeof targetDevices.mobile];
      return `${device.width}px`;
    }
    
    if (targetDevice in targetDevices.tablet) {
      const device = targetDevices.tablet[targetDevice as keyof typeof targetDevices.tablet];
      return `${device.width}px`;
    }
    
    if (targetDevice in targetDevices.desktop) {
      const device = targetDevices.desktop[targetDevice as keyof typeof targetDevices.desktop];
      return `${device.width}px`;
    }
    
    return maxWidth;
  };

  return (
    <StyledContainer
      fullHeight={fullHeight}
      centered={centered}
      background={background}
      elevation={elevation}
      fluidSpacing={fluidSpacing}
      pixelPerfect={pixelPerfect}
    >
      <Container
        maxWidth={targetDevice ? false : maxWidth}
        disableGutters={disableGutters}
        sx={{
          padding: getResponsivePadding(),
          margin: getResponsiveMargin(),
          
          ...(targetDevice && {
            maxWidth: getTargetDeviceMaxWidth(),
            margin: '0 auto',
          }),
          
          ...(fullHeight && {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }),
          
          ...(pixelPerfect && {
            transform: 'translateZ(0)',
            willChange: 'transform',
            
            paddingX: {
              xs: fluidSpacing ? componentSpacing.padding.container.mobile : theme.spacing(2),
              sm: fluidSpacing ? componentSpacing.padding.container.mobile : theme.spacing(3),
              md: fluidSpacing ? componentSpacing.padding.container.desktop : theme.spacing(4),
              lg: fluidSpacing ? componentSpacing.padding.container.desktop : theme.spacing(5),
            },
          }),
        }}
      >
        {children}
      </Container>
    </StyledContainer>
  );
};

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
          minHeight: 'calc(100vh - 64px)',
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

export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number | 'fluid';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  fluidSpacing?: boolean;
  pixelPerfect?: boolean;
}> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = 2,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  fluidSpacing = true,
  pixelPerfect = false,
}) => {
  const theme = useTheme();

  const getGridSpacing = () => {
    if (spacing === 'fluid') {
      return componentSpacing.gap.grid;
    }
    
    if (fluidSpacing) {
      return {
        xs: componentSpacing.gap.grid.xs,
        sm: componentSpacing.gap.grid.sm,
        md: componentSpacing.gap.grid.md,
        lg: componentSpacing.gap.grid.lg,
      };
    }
    
    return spacing;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: getGridSpacing(),
        alignItems,
        justifyContent,
        
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || columns.xs || 1}, 1fr)`,
          md: `repeat(${columns.md || columns.sm || columns.xs || 1}, 1fr)`,
          lg: `repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
          xl: `repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
        },
        
        ...(pixelPerfect && {
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          
          gridTemplateColumns: {
            xs: `repeat(auto-fit, minmax(${280 / (columns.xs || 1)}px, 1fr))`,
            sm: `repeat(auto-fit, minmax(${300 / (columns.sm || columns.xs || 1)}px, 1fr))`,
            md: `repeat(auto-fit, minmax(${320 / (columns.md || columns.sm || 1)}px, 1fr))`,
            lg: `repeat(auto-fit, minmax(${340 / (columns.lg || columns.md || 1)}px, 1fr))`,
          },
        }),
        
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: `repeat(${columns.xs || 1}, 1fr)`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export const ResponsiveFlex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  responsiveDirection?: {
    xs?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    sm?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    md?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    lg?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  };
  gap?: number | 'fluid';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  fluidSpacing?: boolean;
}> = ({
  children,
  direction = 'row',
  responsiveDirection,
  gap = 2,
  wrap = 'wrap',
  alignItems = 'center',
  justifyContent = 'flex-start',
  fluidSpacing = true,
}) => {
  const getFlexGap = () => {
    if (gap === 'fluid') {
      return componentSpacing.gap.flex;
    }
    
    if (fluidSpacing) {
      return {
        xs: componentSpacing.gap.flex.xs,
        sm: componentSpacing.gap.flex.sm,
        md: componentSpacing.gap.flex.md,
        lg: componentSpacing.gap.flex.lg,
      };
    }
    
    return gap;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: responsiveDirection ? {
          xs: responsiveDirection.xs || direction,
          sm: responsiveDirection.sm || responsiveDirection.xs || direction,
          md: responsiveDirection.md || responsiveDirection.sm || direction,
          lg: responsiveDirection.lg || responsiveDirection.md || direction,
        } : direction,
        flexWrap: wrap,
        alignItems,
        justifyContent,
        gap: getFlexGap(),
      }}
    >
      {children}
    </Box>
  );
};

export const useDeviceInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  
  const getDeviceType = () => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isLargeDesktop) return 'large-desktop';
    if (isDesktop) return 'desktop';
    return 'unknown';
  };
  
  const getCurrentBreakpoint = () => {
    if (isLargeDesktop) return 'xl';
    if (isDesktop) return 'lg';
    if (isTablet) return 'md';
    if (isMobile) return 'xs';
    return 'sm';
  };
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    deviceType: getDeviceType(),
    breakpoint: getCurrentBreakpoint(),
    
    isTouchDevice: isMobile || isTablet,
    isWideScreen: isDesktop || isLargeDesktop,
    
    viewport: {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    },
  };
}; 