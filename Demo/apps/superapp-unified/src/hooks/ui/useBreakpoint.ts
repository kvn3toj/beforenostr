import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'unknown';

export const useBreakpoint = (): Breakpoint => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  const [breakpoint, setBreakpoint] = useState<Breakpoint>('unknown');

  useEffect(() => {
    if (isXl) setBreakpoint('xl');
    else if (isLg) setBreakpoint('lg');
    else if (isMd) setBreakpoint('md');
    else if (isSm) setBreakpoint('sm');
    else if (isXs) setBreakpoint('xs');
  }, [isXs, isSm, isMd, isLg, isXl]);

  return breakpoint;
};

