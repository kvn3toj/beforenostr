import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme';

const theme = createAppTheme('light');

export const TestWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
); 