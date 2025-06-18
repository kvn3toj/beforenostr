import { ThemeProvider } from '@mui/material/styles';
import { createCentralizedTheme } from '../theme-centralized';

const theme = createCentralizedTheme('light');

export const TestWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
); 